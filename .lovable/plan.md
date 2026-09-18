# Campaña semanal de WhatsApp para clientes recurrentes

Objetivo: guardar los teléfonos de quienes ya pidieron y enviarles cada semana, de forma automática, un recordatorio de WhatsApp con un botón "Aceptar" que abre https://mandaditomx.netlify.app/

## 1. Conectar WhatsApp Business

Se abrirá una tarjeta para conectar tu cuenta de WhatsApp Business (número + aprobación de Meta). Sin esa conexión no se pueden enviar mensajes. Los envíos saldrán desde el número conectado.

## 2. Capturar el teléfono en el pedido

En el carrito se agrega un campo obligatorio "WhatsApp" (10 dígitos, se guarda como +52…). Al enviar el pedido:
- Se guarda o actualiza el cliente en la base de datos (nombre, teléfono, dirección, fecha del último pedido, suscripción activa).
- Sigue funcionando igual el envío del pedido por WhatsApp a tu número.

## 3. Tabla de clientes (base de datos)

Tabla `whatsapp_contacts`:
- `id`, `phone` (único, formato +52XXXXXXXXXX), `name`, `last_order_at`, `subscribed` (sí/no), `opted_out_at`, `created_at`.
- Tabla `whatsapp_campaign_logs`: a quién se envió, cuándo, estado y error devuelto por Meta.
- Seguridad: solo el servidor puede leer la lista; la app puede registrar un contacto al hacer un pedido, no leer los de otros.

## 4. Funciones del servidor

- `whatsapp-upsert-contact`: registra/actualiza el contacto cuando alguien hace un pedido.
- `send-weekly-campaign`: recorre los contactos suscritos y envía la plantilla, en lotes con pausa para no saturar; registra cada resultado en el log. Protegida con una clave interna para que nadie más la dispare.
- `whatsapp-templates`: crear y consultar el estado de aprobación de la plantilla.
- Cron semanal: jueves 10:00 (hora de Ciudad de México) llamando a `send-weekly-campaign`.

## 5. Plantilla (para aprobación rápida de Meta)

Categoría UTILITY, idioma es_MX, nombre `pedido_semanal_recordatorio`.

Cuerpo propuesto:
> Hola {{1}}, aquí mandadito. Esta semana ya puedes armar tu pedido de frutas, verduras, carnes y tortillería para recibirlo en tu domicilio entre 1 y 5 pm. Toca "Aceptar" para abrir tu lista, o ignora este mensaje si esta semana no lo necesitas.

Botones: URL "Aceptar" → https://mandaditomx.netlify.app/ y respuesta rápida "No, gracias" (al recibirla se marca el contacto como no suscrito cuando el proyecto pueda recibir mensajes; mientras tanto la baja se hace desde el panel de administración).

Pautas de redacción que se aplican:
- Mensaje transaccional/útil, no promocional; sin precios ni "oferta/descuento/gratis".
- Un solo variable {{1}} (nombre) con ejemplo incluido, texto largo alrededor de la variable.
- Sin mayúsculas gritadas, sin URL acortadas, sin emojis excesivos.
- Salida clara para el cliente ("ignora este mensaje" / "No, gracias").

## 6. Panel de administración

Dentro del panel oculto: lista de contactos, alta/baja de suscripción, botón "Crear plantilla", estado de aprobación y botón "Enviar campaña ahora" (prueba manual).

## Notas técnicas

- Envío vía el gateway de conectores de Lovable a la Graph API (`POST /messages`, `type: template`), nunca desde el navegador.
- Solo se puede enviar la plantilla una vez que Meta la apruebe (puede tardar hasta 48 h).
- Se respetan reintentos mínimos y se guarda el `message_id` de Meta por contacto.
