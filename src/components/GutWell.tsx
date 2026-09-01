import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Leaf, ShieldCheck, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import gutwellAsset from '@/assets/gutwell.jpg.asset.json';
const gutwellImg = gutwellAsset.url;

const GUTWELL_PRICE = 350;

const ingredients = [
  'Inulina de agave',
  'Psyllium husk',
  'Nopal deshidratado',
  'Chía molida',
  'Linaza molida',
  'Piña liofilizada',
  'Ralladura de naranja deshidratada',
];

const nutrition: Array<{ label: string; portion: string; per100: string }> = [
  { label: 'Energía', portion: '22 kcal', per100: '220 kcal' },
  { label: 'Proteína', portion: '0.7 g', per100: '7 g' },
  { label: 'Grasas saturadas', portion: '0.1 g', per100: '1 g' },
  { label: 'Carbohidratos', portion: '7.5 g', per100: '75 g' },
  { label: 'Azúcares', portion: '<0.5 g', per100: '<5 g' },
  { label: 'Fibra dietética total', portion: '4 g', per100: '40 g' },
  { label: 'Sodio', portion: '3 mg', per100: '30 mg' },
];

const benefits = [
  { name: 'Inulina de agave', emoji: '🌵', text: 'Prebiótico natural, alimenta la microbiota y regula la digestión.' },
  { name: 'Psyllium husk', emoji: '🌾', text: 'Forma gel, regula el tránsito intestinal y la absorción de glucosa.' },
  { name: 'Nopal', emoji: '🥬', text: 'Fibra soluble e insoluble, saciedad, ayuda a controlar glucosa y lípidos.' },
  { name: 'Chía molida', emoji: '🫘', text: 'Omega 3 vegetal, antioxidantes y sensación de saciedad.' },
  { name: 'Linaza molida', emoji: '🌱', text: 'Fuente de omega 3 y antioxidantes.' },
  { name: 'Piña liofilizada', emoji: '🍍', text: 'Bromelina digestiva y antioxidantes.' },
  { name: 'Ralladura de naranja', emoji: '🍊', text: 'Flavonoides cítricos y antioxidantes.' },
];

const GutWell: React.FC = () => {
  const { addExtraToCart, extrasCart } = useCart();
  const qty = extrasCart.find(i => i.id === 'gutwell-300g')?.quantity ?? 0;

  const addGutWell = () => {
    addExtraToCart({
      id: 'gutwell-300g',
      name: 'GutWell — Fibra y Superfoods en polvo',
      variantLabel: '300 g',
      price: GUTWELL_PRICE,
      category: 'Suplementos',
      emoji: '🌿',
    });
    toast({
      title: '¡GutWell agregado!',
      description: `300 g — $${GUTWELL_PRICE}`,
      duration: 2000,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <Card className="overflow-hidden border-emerald-100 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Imagen */}
          <div className="relative bg-gradient-to-br from-emerald-50 to-lime-50 p-6 flex items-center justify-center">
            <Badge className="absolute top-4 left-4 bg-emerald-600 text-white">Producto estrella</Badge>
            <img
              src={gutwellImg}
              alt="Bote de GutWell, suplemento de fibra y superfoods en polvo de 300 g"
              loading="lazy"
              width={1024}
              height={1024}
              className="w-full max-w-sm rounded-2xl"
            />
          </div>

          {/* Info principal */}
          <CardContent className="p-6 md:p-8 flex flex-col justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="border-emerald-300 text-emerald-700"><Leaf size={12} className="mr-1" /> 100% natural</Badge>
              <Badge variant="outline" className="border-emerald-300 text-emerald-700"><Sparkles size={12} className="mr-1" /> 4 g de fibra por porción</Badge>
              <Badge variant="outline" className="border-emerald-300 text-emerald-700"><ShieldCheck size={12} className="mr-1" /> Sin azúcar añadida</Badge>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900 mb-2 tracking-tight">GutWell</h2>
            <p className="text-lg text-gray-700 mb-1">Suplemento de fibra y superfoods en polvo</p>
            <p className="text-sm text-gray-500 mb-6">Contenido neto: 300 g</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-extrabold text-emerald-700">${GUTWELL_PRICE}</span>
              <span className="text-sm text-gray-500">MXN · 30 porciones</span>
            </div>

            <Button
              onClick={addGutWell}
              className="w-full h-14 text-lg font-bold rounded-full bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white shadow-lg hover:shadow-emerald-300/50 transition-all active:scale-95"
            >
              <Plus size={22} className="mr-2" />
              {qty > 0 ? `Agregar otro (${qty} en carrito)` : 'Agregar al carrito'}
            </Button>
          </CardContent>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-8 border-t bg-white">
          {/* Ingredientes */}
          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Ingredientes clave</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ingredients.map(ing => (
                <li key={ing} className="flex items-center gap-2 text-sm text-gray-700 bg-emerald-50/60 rounded-lg px-3 py-2">
                  <Leaf size={14} className="text-emerald-600 shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          {/* Nutrimental */}
          <div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Declaración nutrimental</h3>
            <div className="overflow-x-auto rounded-xl border border-emerald-100">
              <table className="w-full text-sm">
                <thead className="bg-emerald-50 text-emerald-900">
                  <tr>
                    <th className="text-left font-semibold px-3 py-2">Nutrimento</th>
                    <th className="text-right font-semibold px-3 py-2">Por porción (10 g)</th>
                    <th className="text-right font-semibold px-3 py-2">Por 100 g</th>
                  </tr>
                </thead>
                <tbody>
                  {nutrition.map((row, i) => (
                    <tr key={row.label} className={i % 2 ? 'bg-white' : 'bg-emerald-50/40'}>
                      <td className="px-3 py-2 text-gray-700">{row.label}</td>
                      <td className="px-3 py-2 text-right font-medium text-gray-800">{row.portion}</td>
                      <td className="px-3 py-2 text-right text-gray-600">{row.per100}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="px-6 md:px-8 pb-6">
          <h3 className="text-xl font-bold text-emerald-900 mb-4">Beneficios por ingrediente</h3>
          <div className="hidden md:grid grid-cols-2 gap-3">
            {benefits.map(b => (
              <div key={b.name} className="rounded-xl border border-emerald-100 p-4 hover:shadow-md transition-shadow">
                <p className="font-semibold text-emerald-800 mb-1">{b.emoji} {b.name}</p>
                <p className="text-sm text-gray-600">{b.text}</p>
              </div>
            ))}
          </div>
          <Accordion type="single" collapsible className="md:hidden">
            {benefits.map(b => (
              <AccordionItem key={b.name} value={b.name}>
                <AccordionTrigger className="text-left text-emerald-800 font-semibold">
                  {b.emoji} {b.name}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-600">{b.text}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Modo de uso */}
        <div className="mx-6 md:mx-8 mb-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-lime-50 border border-emerald-100 p-5">
          <h3 className="font-bold text-emerald-900 mb-1">Modo de uso</h3>
          <p className="text-gray-700">
            Disolver 1 cucharada (10 g) en 200-250 ml de agua o jugo. Tomar 10 minutos antes de consumir alimentos.
          </p>
        </div>

        {/* Avisos */}
        <div className="px-6 md:px-8 pb-6">
          <p className="text-xs text-gray-400 leading-relaxed">
            Este producto no es un medicamento. Mantener en lugar fresco, seco y protegido de la luz solar directa.
            El consumo de este producto es responsabilidad de quien lo recomienda y de quien lo usa.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default GutWell;
