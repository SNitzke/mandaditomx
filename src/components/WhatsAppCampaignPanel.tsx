import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Send, RefreshCw, Plus, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Contact {
  id: string;
  phone: string;
  name: string | null;
  subscribed: boolean;
  last_order_at: string | null;
}

interface CampaignLog {
  phone: string;
  status: string;
  error: string | null;
  sent_at: string;
  template_name: string;
}

interface Props {
  adminPassword: string;
}

const WhatsAppCampaignPanel: React.FC<Props> = ({ adminPassword }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [logs, setLogs] = useState<CampaignLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateStatus, setTemplateStatus] = useState<string>('');
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');
  const [testPhone, setTestPhone] = useState('');

  const headers = { 'x-admin-password': adminPassword };

  const call = async (fn: string, body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke(fn, { body, headers });
    if (error) {
      const details = 'context' in error && error.context ? await (error.context as Response).text() : error.message;
      throw new Error(details);
    }
    return data;
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await call('whatsapp-contacts-admin', { action: 'list' });
      setContacts(data.contacts ?? []);
      setLogs(data.logs ?? []);
    } catch (e) {
      toast({ title: 'Error al cargar contactos', description: String(e), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const setSubscription = async (id: string, subscribed: boolean) => {
    try {
      await call('whatsapp-contacts-admin', { action: 'set_subscription', id, subscribed });
      await loadContacts();
    } catch (e) {
      toast({ title: 'Error', description: String(e), variant: 'destructive' });
    }
  };

  const removeContact = async (id: string) => {
    try {
      await call('whatsapp-contacts-admin', { action: 'delete', id });
      await loadContacts();
    } catch (e) {
      toast({ title: 'Error', description: String(e), variant: 'destructive' });
    }
  };

  const addContact = async () => {
    if (!newPhone.trim()) return;
    try {
      await call('whatsapp-contacts-admin', { action: 'add', phone: newPhone, name: newName });
      setNewPhone('');
      setNewName('');
      await loadContacts();
      toast({ title: 'Contacto agregado' });
    } catch (e) {
      toast({ title: 'Error', description: String(e), variant: 'destructive' });
    }
  };

  const templateAction = async (action: 'list' | 'create') => {
    setLoading(true);
    try {
      const data = await call('whatsapp-templates', { action });
      if (action === 'list') {
        const list = (data?.data ?? []) as { name: string; status: string }[];
        const tpl = list.find((t) => t.name === 'pedido_semanal_recordatorio');
        setTemplateStatus(tpl ? `${tpl.name}: ${tpl.status}` : 'La plantilla aún no existe');
      } else {
        setTemplateStatus('Plantilla enviada a revisión de Meta (puede tardar hasta 48 h)');
      }
    } catch (e) {
      setTemplateStatus(String(e));
      toast({ title: 'Error con la plantilla', description: String(e), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async (test: boolean) => {
    setLoading(true);
    try {
      const data = await call('send-weekly-campaign', test ? { testPhone } : {});
      toast({
        title: 'Campaña ejecutada',
        description: `Enviados: ${data.sent} · Fallidos: ${data.failed} de ${data.total}`,
      });
      await loadContacts();
    } catch (e) {
      toast({ title: 'Error al enviar', description: String(e), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">💬 Campaña semanal de WhatsApp</h3>

      <Card className="border-emerald-200 bg-emerald-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Plantilla de Meta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" disabled={loading} onClick={() => templateAction('list')}>
              <FileText size={14} className="mr-2" /> Ver estado
            </Button>
            <Button size="sm" disabled={loading} onClick={() => templateAction('create')} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus size={14} className="mr-2" /> Crear plantilla
            </Button>
          </div>
          {templateStatus && <p className="text-xs text-gray-700 break-words">{templateStatus}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Enviar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Teléfono de prueba (10 dígitos)</label>
              <Input value={testPhone} onChange={(e) => setTestPhone(e.target.value)} placeholder="5512345678" className="w-48" />
            </div>
            <Button size="sm" variant="outline" disabled={loading || !testPhone} onClick={() => sendCampaign(true)}>
              <Send size={14} className="mr-2" /> Enviar prueba
            </Button>
            <Button size="sm" disabled={loading} onClick={() => sendCampaign(false)} className="bg-green-600 hover:bg-green-700">
              <Send size={14} className="mr-2" /> Enviar campaña ahora
            </Button>
          </div>
          <p className="text-xs text-gray-500">El envío automático corre cada jueves a las 10:00 AM (CDMX).</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Contactos ({contacts.length})</CardTitle>
          <Button size="sm" variant="outline" disabled={loading} onClick={loadContacts} aria-label="Actualizar contactos">
            <RefreshCw size={14} className="mr-2" /> Actualizar
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2 items-end">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nombre" className="w-40" />
            <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="5512345678" className="w-40" />
            <Button size="sm" onClick={addContact}>
              <Plus size={14} className="mr-2" /> Agregar
            </Button>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y">
            {contacts.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.name || 'Sin nombre'}</p>
                  <p className="text-xs text-gray-500">{c.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={c.subscribed ? 'default' : 'secondary'}>
                    {c.subscribed ? 'Suscrito' : 'Baja'}
                  </Badge>
                  <Button size="sm" variant="outline" onClick={() => setSubscription(c.id, !c.subscribed)}>
                    {c.subscribed ? 'Dar de baja' : 'Reactivar'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={`Eliminar contacto ${c.phone}`}
                    className="text-red-500"
                    onClick={() => removeContact(c.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-sm text-gray-500 py-3">Sin contactos cargados.</p>}
          </div>
        </CardContent>
      </Card>

      {logs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Últimos envíos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-56 overflow-y-auto space-y-1">
              {logs.map((l, i) => (
                <div key={i} className="text-xs flex justify-between gap-2 border-b py-1">
                  <span>{l.phone}</span>
                  <span className={l.status === 'sent' ? 'text-green-600' : 'text-red-600'}>{l.status}</span>
                  <span className="text-gray-400">{new Date(l.sent_at).toLocaleString('es-MX')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppCampaignPanel;
