CREATE TABLE public.whatsapp_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  name text,
  address text,
  last_order_at timestamptz,
  subscribed boolean NOT NULL DEFAULT true,
  opted_out_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.whatsapp_contacts TO service_role;
ALTER TABLE public.whatsapp_contacts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.whatsapp_campaign_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.whatsapp_contacts(id) ON DELETE SET NULL,
  phone text NOT NULL,
  template_name text NOT NULL,
  status text NOT NULL,
  message_id text,
  error text,
  sent_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.whatsapp_campaign_logs TO service_role;
ALTER TABLE public.whatsapp_campaign_logs ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_whatsapp_contacts_subscribed ON public.whatsapp_contacts (subscribed);
CREATE INDEX idx_whatsapp_campaign_logs_sent_at ON public.whatsapp_campaign_logs (sent_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_whatsapp_contacts_updated_at
BEFORE UPDATE ON public.whatsapp_contacts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();