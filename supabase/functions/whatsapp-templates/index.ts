import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { TEMPLATE_LANG, TEMPLATE_NAME, isAuthorized, whatsappFetch } from '../_shared/whatsapp.ts';

const ACCEPT_URL = 'https://mandaditomx.netlify.app/';

const TEMPLATE_BODY =
  'Hola {{1}}, te saluda mandadito. Ya puedes armar tu pedido de la semana con frutas, verduras, carnes, pollo, huevo y tortillería para recibirlo en tu domicilio entre la 1 y las 5 de la tarde. Si quieres hacer tu pedido ahora, toca el botón Aceptar; si esta semana no lo necesitas, puedes ignorar este mensaje o responder No, gracias.';

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
    const action = typeof body.action === 'string' ? body.action : 'list';

    if (action === 'list') {
      const res = await whatsappFetch('/message_templates?fields=name,status,language,category,components&limit=50');
      return new Response(JSON.stringify(res.data), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'create') {
      const res = await whatsappFetch('/message_templates', {
        method: 'POST',
        body: {
          name: TEMPLATE_NAME,
          language: TEMPLATE_LANG,
          category: 'UTILITY',
          components: [
            {
              type: 'BODY',
              text: TEMPLATE_BODY,
              example: { body_text: [['Ana']] },
            },
            {
              type: 'BUTTONS',
              buttons: [
                { type: 'URL', text: 'Aceptar', url: ACCEPT_URL },
                { type: 'QUICK_REPLY', text: 'No, gracias' },
              ],
            },
          ],
        },
      });
      return new Response(JSON.stringify(res.data), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      const name = typeof body.name === 'string' ? body.name : TEMPLATE_NAME;
      const res = await whatsappFetch(`/message_templates?name=${encodeURIComponent(name)}`, { method: 'DELETE' });
      return new Response(JSON.stringify(res.data), {
        status: res.ok ? 200 : res.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Acción no válida' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('whatsapp-templates error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
