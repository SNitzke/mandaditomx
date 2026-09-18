CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('whatsapp-weekly-campaign')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'whatsapp-weekly-campaign');

SELECT cron.schedule(
  'whatsapp-weekly-campaign',
  '0 16 * * 4',
  $$
  SELECT net.http_post(
    url := 'https://iajqpgfufznogokowqpl.supabase.co/functions/v1/send-weekly-campaign',
    headers := '{"Content-Type": "application/json", "x-campaign-secret": "f7a7f3ac63d9b69c44f3897780b0b9cdcaeabba83dbaf064"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);