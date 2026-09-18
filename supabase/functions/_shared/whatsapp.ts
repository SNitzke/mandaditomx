export const GATEWAY_URL = 'https://connector-gateway.lovable.dev/whatsapp';

export const TEMPLATE_NAME = 'pedido_semanal_recordatorio';
export const TEMPLATE_LANG = 'es_MX';

export function getKeys() {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const WHATSAPP_API_KEY = Deno.env.get('WHATSAPP_API_KEY');
  if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY no está configurada');
  if (!WHATSAPP_API_KEY) throw new Error('WHATSAPP_API_KEY no está configurada (conecta WhatsApp Business)');
  return { LOVABLE_API_KEY, WHATSAPP_API_KEY };
}

export async function whatsappFetch(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<{ ok: boolean; status: number; data: unknown; raw: string }> {
  const { LOVABLE_API_KEY, WHATSAPP_API_KEY } = getKeys();
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      'X-Connection-Api-Key': WHATSAPP_API_KEY,
      'Content-Type': 'application/json',
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  const raw = await res.text();
  let data: unknown = raw;
  try {
    data = JSON.parse(raw);
  } catch {
    // keep raw
  }
  if (!res.ok) {
    console.error(`WhatsApp gateway ${path} failed [${res.status}]: ${raw}`);
  }
  return { ok: res.ok, status: res.status, data, raw };
}

/** Normalizes a Mexican phone number to digits-only E.164 without "+" (e.g. 5215512345678). */
export function normalizePhone(input: string): string | null {
  const digits = (input || '').replace(/\D/g, '');
  if (digits.length === 10) return `52${digits}`;
  if (digits.length === 12 && digits.startsWith('52')) return digits;
  if (digits.length === 13 && digits.startsWith('521')) return digits;
  if (digits.length >= 11 && digits.length <= 15) return digits;
  return null;
}
