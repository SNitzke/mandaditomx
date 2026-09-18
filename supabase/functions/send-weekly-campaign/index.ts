import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { TEMPLATE_LANG, TEMPLATE_NAME, normalizePhone, isAuthorized, whatsappFetch } from '../_shared/whatsapp.ts';

const BATCH_SIZE = 10;
const BATCH_PAUSE_MS = 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!isAuthorized(req)) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const testPhoneRaw = typeof body.testPhone === 'string' ? body.testPhone : '';
    const templateName = typeof body.templateName === 'string' ? body.templateName : TEMPLATE_NAME;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    let targets: { id: string | null; phone: string; name: string | null }[] = [];

    if (testPhoneRaw) {
      const p = normalizePhone(testPhoneRaw);
      if (!p) {
        return new Response(JSON.stringify({ error: 'Teléfono de prueba inválido' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      targets = [{ id: null, phone: `+${p}`, name: typeof body.testName === 'string' ? body.testName : 'cliente' }];
    } else {
      const { data, error } = await supabase
        .from('whatsapp_contacts')
        .select('id, phone, name')
        .eq('subscribed', true);
      if (error) throw new Error(error.message);
      targets = (data ?? []) as typeof targets;
    }

    const results: { phone: string; status: string; error?: string; message_id?: string }[] = [];

    for (let i = 0; i < targets.length; i += BATCH_SIZE) {
      const batch = targets.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (contact) => {
          const to = contact.phone.replace(/\D/g, '');
          const firstName = (contact.name || 'cliente').trim().split(/\s+/)[0].slice(0, 40) || 'cliente';

          let status = 'sent';
          let errorText: string | undefined;
          let messageId: string | undefined;

          try {
            const res = await whatsappFetch('/messages', {
              method: 'POST',
              body: {
                messaging_product: 'whatsapp',
                to,
                type: 'template',
                template: {
                  name: templateName,
                  language: { code: TEMPLATE_LANG },
                  components: [
                    { type: 'body', parameters: [{ type: 'text', text: firstName }] },
                  ],
                },
              },
            });

            const data = res.data as { messages?: { id: string }[]; error?: { message?: string } };
            if (!res.ok) {
              status = 'failed';
              errorText = `[${res.status}] ${res.raw}`.slice(0, 900);
            } else {
              messageId = data?.messages?.[0]?.id;
            }
          } catch (e) {
            status = 'failed';
            errorText = String(e).slice(0, 900);
          }

          results.push({ phone: contact.phone, status, error: errorText, message_id: messageId });

          await supabase.from('whatsapp_campaign_logs').insert({
            contact_id: contact.id,
            phone: contact.phone,
            template_name: templateName,
            status,
            message_id: messageId ?? null,
            error: errorText ?? null,
          });
        }),
      );

      if (i + BATCH_SIZE < targets.length) await sleep(BATCH_PAUSE_MS);
    }

    const sent = results.filter((r) => r.status === 'sent').length;
    return new Response(
      JSON.stringify({ total: targets.length, sent, failed: results.length - sent, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('send-weekly-campaign error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
