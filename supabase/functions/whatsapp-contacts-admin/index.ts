import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { isAuthorized, normalizePhone } from '../_shared/whatsapp.ts';

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

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await req.json().catch(() => ({}));
    const action = typeof body.action === 'string' ? body.action : 'list';

    if (action === 'list') {
      const { data, error } = await supabase
        .from('whatsapp_contacts')
        .select('id, phone, name, subscribed, last_order_at, created_at')
        .order('last_order_at', { ascending: false, nullsFirst: false })
        .limit(500);
      if (error) throw new Error(error.message);

      const { data: logs } = await supabase
        .from('whatsapp_campaign_logs')
        .select('phone, status, error, sent_at, template_name')
        .order('sent_at', { ascending: false })
        .limit(50);

      return new Response(JSON.stringify({ contacts: data ?? [], logs: logs ?? [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'set_subscription') {
      const id = typeof body.id === 'string' ? body.id : '';
      const subscribed = Boolean(body.subscribed);
      if (!id) {
        return new Response(JSON.stringify({ error: 'Falta el contacto' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { error } = await supabase
        .from('whatsapp_contacts')
        .update({ subscribed, opted_out_at: subscribed ? null : new Date().toISOString() })
        .eq('id', id);
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'add') {
      const phone = normalizePhone(typeof body.phone === 'string' ? body.phone : '');
      if (!phone) {
        return new Response(JSON.stringify({ error: 'Teléfono inválido' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const { error } = await supabase.from('whatsapp_contacts').upsert(
        {
          phone: `+${phone}`,
          name: typeof body.name === 'string' ? body.name.slice(0, 120) : null,
          subscribed: true,
          opted_out_at: null,
        },
        { onConflict: 'phone' },
      );
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const id = typeof body.id === 'string' ? body.id : '';
      const { error } = await supabase.from('whatsapp_contacts').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Acción no válida' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('whatsapp-contacts-admin error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
