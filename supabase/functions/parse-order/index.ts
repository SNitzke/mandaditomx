import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface CatalogItem {
  id: string;
  name: string;
  category: string;
  kind: 'product' | 'pet';
  unit: 'gramos' | 'piezas' | 'bultos';
  minWeight?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'Falta LOVABLE_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const text: string | undefined = typeof body.text === 'string' ? body.text.slice(0, 4000) : undefined;
    const imageBase64: string | undefined = typeof body.imageBase64 === 'string' ? body.imageBase64 : undefined;
    const catalog: CatalogItem[] = Array.isArray(body.catalog) ? body.catalog : [];

    if ((!text && !imageBase64) || catalog.length === 0) {
      return new Response(JSON.stringify({ error: 'Faltan datos (texto o imagen y catálogo).' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const catalogText = catalog
      .map((c) => `${c.id} | ${c.name} | ${c.category} | se pide en ${c.unit}${c.minWeight ? ` | mínimo ${c.minWeight}` : ''}`)
      .join('\n');

    const systemPrompt = `Eres el asistente de pedidos de "Mi Super", una tienda mexicana de frutas, verduras, carnes y alimento para mascotas.
Tu tarea es convertir el pedido del cliente (dictado por voz o escrito en una lista fotografiada) en productos EXACTOS del catálogo.

CATÁLOGO (id | nombre | categoría | unidad de venta | mínimo):
${catalogText}

REGLAS:
- Solo puedes usar ids que existan en el catálogo. Nunca inventes ids ni productos.
- Elige el producto más parecido al que pide el cliente (ej. "manzana" -> "Manzana Roja", "croquetas para perro" -> el alimento de perro más común).
- "quantity" siempre es un número:
  * unidad "gramos": cantidad en GRAMOS (1 kilo = 1000, medio kilo = 500, "un cuarto" = 250). Redondea a múltiplos de 250 y respeta el mínimo. Si no especifican cantidad, usa 1000.
  * unidad "piezas": número de piezas (mínimo 1). Si no especifican, usa 1.
  * unidad "bultos": número de bultos/costales (mínimo 1). Si no especifican, usa 1.
- Si el cliente menciona madurez de una fruta o verdura, usa "ripeness": "inmadura", "medio-madura" o "madura". Si no, omítela.
- Si algo que pidió el cliente NO existe en el catálogo, agrégalo en "notFound" con el texto tal cual lo dijo.
- Responde ÚNICAMENTE con JSON válido con esta forma:
{"items":[{"id":"12","quantity":1000,"ripeness":"madura","requested":"sandía"}],"notFound":["chiles en vinagre"]}`;

    const userContent: unknown[] = [];
    if (imageBase64) {
      userContent.push({
        type: 'text',
        text: 'Esta es la foto de la lista de compras del cliente. Lee la lista y conviértela en productos del catálogo.',
      });
      userContent.push({ type: 'image_url', image_url: { url: imageBase64 } });
    } else {
      userContent.push({ type: 'text', text: `El cliente dijo: "${text}"` });
    }

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.6-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiRes.ok) {
      const details = await aiRes.text();
      console.error('AI request failed', aiRes.status, details);
      const message =
        aiRes.status === 429
          ? 'Demasiadas solicitudes, intenta en un momento.'
          : aiRes.status === 402
          ? 'Se agotaron los créditos de IA.'
          : 'No se pudo interpretar el pedido.';
      return new Response(JSON.stringify({ error: message, details }), {
        status: aiRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiData = await aiRes.json();
    const raw: string = aiData?.choices?.[0]?.message?.content ?? '';
    let parsed: { items?: unknown[]; notFound?: unknown[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = {};
        }
      }
    }

    const validIds = new Set(catalog.map((c) => c.id));
    const items = (Array.isArray(parsed.items) ? parsed.items : [])
      .map((i) => i as Record<string, unknown>)
      .filter((i) => typeof i.id === 'string' && validIds.has(i.id as string))
      .map((i) => ({
        id: i.id as string,
        quantity: Number(i.quantity) > 0 ? Number(i.quantity) : 1,
        ripeness: typeof i.ripeness === 'string' ? i.ripeness : undefined,
        requested: typeof i.requested === 'string' ? i.requested : undefined,
      }));

    const notFound = (Array.isArray(parsed.notFound) ? parsed.notFound : []).filter(
      (n): n is string => typeof n === 'string',
    );

    return new Response(JSON.stringify({ items, notFound, transcript: text ?? null }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('parse-order error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
