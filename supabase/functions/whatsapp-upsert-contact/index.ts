import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { normalizePhone } from '../_shared/whatsapp.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const phoneRaw = typeof body.phone === 'string' ? body.phone : '';
    const name = typeof body.name === 'string' ? body.name.slice(0, 120) : null;
    const address = typeof body.address === 'string' ? body.address.slice(0, 400) : null;

    const phone = normalizePhone(phoneRaw);
    if (!phone) {
      return new Response(JSON.stringify({ error: 'Teléfono inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await supabase
      .from('whatsapp_contacts')
      .upsert(
        {
          phone: `+${phone}`,
          name,
          address,
          last_order_at: new Date().toISOString(),
          subscribed: true,
          opted_out_at: null,
        },
        { onConflict: 'phone' },
      );

    if (error) {
      console.error('upsert contact failed', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('whatsapp-upsert-contact error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
