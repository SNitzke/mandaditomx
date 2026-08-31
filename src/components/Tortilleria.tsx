import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { tortilleriaProducts } from '@/data/tortilleriaProducts';
import tortilleriaImg from '@/assets/category-tortilleria.jpg';

const Tortilleria: React.FC = () => {
  const { addExtraToCart, extrasCart } = useCart();
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(tortilleriaProducts.map(p => [p.id, p.variants[0].id]))
  );

  const handleAdd = (productId: string) => {
    const product = tortilleriaProducts.find(p => p.id === productId)!;
    const variant = product.variants.find(v => v.id === selected[productId]) || product.variants[0];
    addExtraToCart({
      id: `tortilleria-${product.id}-${variant.id}`,
      name: product.name,
      variantLabel: variant.label,
      price: variant.price,
      category: 'Tortillería',
      emoji: product.emoji,
    });
    toast({
      title: '¡Agregado al carrito!',
      description: `${product.name} · ${variant.label} — $${variant.price}`,
      duration: 2000,
    });
  };

  const quantityOf = (productId: string, variantId: string) =>
    extrasCart.find(i => i.id === `tortilleria-${productId}-${variantId}`)?.quantity ?? 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8 animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
          🌽 Tortillería y Derivados
        </h2>
        <p className="text-base md:text-xl text-gray-700 font-medium">
          Maíz y harina recién hechos: tostadas, totopos, nachos y tortillas
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
        <img
          src={tortilleriaImg}
          alt="Tostadas, totopos, tortillas de harina y maíz para pozole de la tortillería"
          loading="lazy"
          width={1024}
          height={768}
          className="w-full h-40 md:h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:p-6">
          <p className="text-white font-semibold text-sm md:text-lg">
            Hechos el mismo día de tu entrega 🔥
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {tortilleriaProducts.map(product => {
          const activeVariant = product.variants.find(v => v.id === selected[product.id]) || product.variants[0];
          const qty = quantityOf(product.id, activeVariant.id);
          return (
            <Card
              key={product.id}
              className="border-amber-100 hover:border-amber-300 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <CardContent className="p-4 md:p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">
                    <span className="mr-1">{product.emoji}</span>
                    {product.name}
                  </h3>
                  {qty > 0 && (
                    <Badge className="bg-green-500 text-white shrink-0">{qty} en carrito</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-4">{product.description}</p>

                <div className="mt-auto">
                  {product.variants.length > 1 ? (
                    <>
                      <p className="text-xs font-medium text-gray-600 mb-2">Elige presentación:</p>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {product.variants.map(variant => {
                          const isActive = activeVariant.id === variant.id;
                          return (
                            <button
                              key={variant.id}
                              onClick={() => setSelected(s => ({ ...s, [product.id]: variant.id }))}
                              aria-pressed={isActive}
                              className={`rounded-xl border-2 px-2 py-2 text-center transition-all active:scale-95 min-h-[56px] ${
                                isActive
                                  ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-orange-200'
                              }`}
                            >
                              <span className="block text-xs font-semibold leading-tight">{variant.label}</span>
                              <span className="block text-sm font-bold">${variant.price}</span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="mb-4 flex items-center gap-2">
                      <Badge variant="outline" className="text-sm">{activeVariant.label}</Badge>
                      <span className="text-xl font-bold text-orange-600">${activeVariant.price}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-extrabold text-orange-600">${activeVariant.price}</span>
                    <Button
                      onClick={() => handleAdd(product.id)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-5 h-11 font-semibold shadow-md hover:shadow-lg transition-all active:scale-95"
                    >
                      {qty > 0 ? <Check size={18} className="mr-1" /> : <Plus size={18} className="mr-1" />}
                      Agregar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Tortilleria;
