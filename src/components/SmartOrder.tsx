import React, { useRef, useState } from 'react';
import { Mic, Square, Camera, Loader2, Sparkles, Check, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { PetFoodItem } from '@/data/petFoodProducts';

interface DetectedItem {
  id: string;
  quantity: number;
  ripeness?: 'inmadura' | 'medio-madura' | 'madura';
  requested?: string;
}

const encodeWav = (chunks: Float32Array[], sampleRate: number): Blob => {
  const length = chunks.reduce((acc, c) => acc + c.length, 0);
  const data = new Float32Array(length);
  let offset = 0;
  chunks.forEach((c) => {
    data.set(c, offset);
    offset += c.length;
  });

  // Downsample to 16 kHz
  const targetRate = 16000;
  const ratio = sampleRate / targetRate;
  const outLength = Math.floor(length / ratio);
  const buffer = new ArrayBuffer(44 + outLength * 2);
  const view = new DataView(buffer);
  const writeString = (pos: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + outLength * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, targetRate, true);
  view.setUint32(28, targetRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, outLength * 2, true);

  for (let i = 0; i < outLength; i++) {
    const sample = data[Math.floor(i * ratio)] || 0;
    const s = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([buffer], { type: 'audio/wav' });
};

const SmartOrder: React.FC = () => {
  const { products, petFoodProducts, addToCart, addPetFoodToCart } = useCart();
  const { toast } = useToast();

  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [detected, setDetected] = useState<DetectedItem[]>([]);
  const [notFound, setNotFound] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const buildCatalog = () => [
    ...products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      kind: 'product' as const,
      unit: p.unit === 'piece' ? ('piezas' as const) : ('gramos' as const),
      minWeight: p.minWeight,
    })),
    ...petFoodProducts.map((p) => ({
      id: p.id,
      name: `${p.name} (${p.weight})`,
      category: p.type === 'dog' ? 'Alimento para Perro' : 'Alimento para Gato',
      kind: 'pet' as const,
      unit: 'bultos' as const,
    })),
  ];

  const runParse = async (payload: { text?: string; imageBase64?: string }) => {
    const { data, error } = await supabase.functions.invoke('parse-order', {
      body: { ...payload, catalog: buildCatalog() },
    });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);

    const items: DetectedItem[] = data?.items ?? [];
    if (items.length === 0) {
      toast({
        title: 'No identificamos productos',
        description: 'Intenta de nuevo mencionando los productos y cantidades.',
        variant: 'destructive',
      });
      return;
    }
    setDetected(items);
    setNotFound(data?.notFound ?? []);
    setTranscript(payload.text ?? null);
    setReviewOpen(true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const node = ctx.createScriptProcessor(4096, 1, 1);
      chunksRef.current = [];
      node.onaudioprocess = (e) => {
        chunksRef.current.push(new Float32Array(e.inputBuffer.getChannelData(0)));
      };
      source.connect(node);
      node.connect(ctx.destination);
      processorRef.current = node;
      setRecording(true);
    } catch {
      toast({
        title: 'Sin acceso al micrófono',
        description: 'Permite el micrófono en tu navegador para pedir por voz.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = async () => {
    setRecording(false);
    const ctx = audioCtxRef.current;
    processorRef.current?.disconnect();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    const sampleRate = ctx?.sampleRate ?? 44100;
    const blob = encodeWav(chunksRef.current, sampleRate);
    await ctx?.close();
    audioCtxRef.current = null;
    processorRef.current = null;
    streamRef.current = null;

    if (blob.size < 4096) {
      toast({ title: 'Grabación muy corta', description: 'Mantén presionado y dicta tu pedido.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', blob, 'recording.wav');
      const { data, error } = await supabase.functions.invoke('transcribe-audio', { body: form });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      const text: string = data?.text ?? '';
      if (!text.trim()) {
        toast({ title: 'No escuchamos nada', description: 'Intenta grabar de nuevo.', variant: 'destructive' });
        return;
      }
      await runParse({ text });
    } catch (e) {
      toast({ title: 'Error al procesar tu voz', description: String((e as Error).message), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoto = async (file: File) => {
    setLoading(true);
    try {
      const base64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await runParse({ imageBase64: base64 });
    } catch (e) {
      toast({ title: 'Error al leer la foto', description: String((e as Error).message), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const findProduct = (id: string): Product | undefined => products.find((p) => p.id === id);
  const findPet = (id: string): PetFoodItem | undefined => petFoodProducts.find((p) => p.id === id);

  const describe = (item: DetectedItem) => {
    const product = findProduct(item.id);
    if (product) {
      if (product.unit === 'piece' && product.gramsPerPiece) {
        const pieces = Math.max(1, Math.round(item.quantity));
        return { name: product.name, detail: `${pieces} pieza${pieces > 1 ? 's' : ''}` };
      }
      const grams = Math.max(product.minWeight, Math.round(item.quantity / 250) * 250);
      return { name: product.name, detail: grams >= 1000 ? `${(grams / 1000).toFixed(grams % 1000 === 0 ? 0 : 2)} kg` : `${grams} g` };
    }
    const pet = findPet(item.id);
    if (pet) {
      const qty = Math.max(1, Math.round(item.quantity));
      return { name: `${pet.name} (${pet.weight})`, detail: `${qty} bulto${qty > 1 ? 's' : ''}` };
    }
    return null;
  };

  const confirmAll = () => {
    let added = 0;
    detected.forEach((item) => {
      const product = findProduct(item.id);
      if (product) {
        const weight =
          product.unit === 'piece' && product.gramsPerPiece
            ? Math.max(1, Math.round(item.quantity)) * product.gramsPerPiece
            : Math.max(product.minWeight, Math.round(item.quantity / 250) * 250);
        addToCart(product, weight, product.category === 'Frutas y Verduras' ? item.ripeness : undefined);
        added++;
        return;
      }
      const pet = findPet(item.id);
      if (pet) {
        const qty = Math.max(1, Math.round(item.quantity));
        for (let i = 0; i < qty; i++) {
          addPetFoodToCart({ id: pet.id, name: pet.name, price: pet.price, weight: pet.weight, type: pet.type, quantity: 1 });
        }
        added++;
      }
    });
    setReviewOpen(false);
    setDetected([]);
    toast({ title: '¡Listo!', description: `${added} producto(s) agregados a tu carrito.` });
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-orange-500" size={22} />
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Pide más rápido</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Dicta tu pedido por voz o toma una foto de tu lista y lo agregamos al carrito automáticamente.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={loading}
              className={`flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-white transition-all duration-300 disabled:opacity-60 ${
                recording ? 'bg-red-600 animate-pulse' : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {recording ? <Square size={20} /> : <Mic size={20} />}
              {recording ? 'Detener y enviar' : 'Pedir por voz'}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || recording}
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-all duration-300 disabled:opacity-60"
            >
              <Camera size={20} />
              Foto de mi lista
            </button>
          </div>
          {(loading || recording) && (
            <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
              {loading && <Loader2 className="animate-spin" size={16} />}
              {recording ? 'Grabando… di por ejemplo: "un kilo de manzana roja y dos sandías"' : 'Procesando tu pedido…'}
            </p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhoto(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Revisa tu pedido</DialogTitle>
          </DialogHeader>
          {transcript && (
            <p className="text-sm text-gray-500 italic border-l-4 border-orange-300 pl-3">"{transcript}"</p>
          )}
          <div className="space-y-2">
            {detected.map((item, index) => {
              const info = describe(item);
              if (!info) return null;
              return (
                <div key={`${item.id}-${index}`} className="flex items-center justify-between bg-orange-50 rounded-lg p-3">
                  <div>
                    <p className="font-semibold text-gray-800">{info.name}</p>
                    <p className="text-sm text-gray-600">
                      {info.detail}
                      {item.ripeness ? ` · ${item.ripeness}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setDetected((prev) => prev.filter((_, i) => i !== index))}
                    className="text-red-500 hover:text-red-700 p-2"
                    aria-label={`Quitar ${info.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
          {notFound.length > 0 && (
            <p className="text-sm text-amber-700 bg-amber-50 rounded-lg p-3">
              No encontramos en el catálogo: {notFound.join(', ')}
            </p>
          )}
          <Button onClick={confirmAll} disabled={detected.length === 0} className="w-full bg-green-600 hover:bg-green-700">
            <Check size={18} className="mr-2" />
            Agregar al carrito
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SmartOrder;
