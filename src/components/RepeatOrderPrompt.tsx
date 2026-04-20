import React, { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RotateCcw, Plus, Package } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const RepeatOrderPrompt: React.FC = () => {
  const { lastOrder, cart, packageCart, petFoodCart, repeatLastOrder, clearLastOrder } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Mostrar solo si hay un pedido anterior y el carrito actual está vacío
    const hasItemsInCart = cart.length > 0 || packageCart.length > 0 || petFoodCart.length > 0;
    if (lastOrder && !hasItemsInCart) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!lastOrder) return null;

  const totalItems =
    (lastOrder.cart?.length || 0) +
    (lastOrder.packageCart?.length || 0) +
    (lastOrder.petFoodCart?.length || 0);

  const orderDate = new Date(lastOrder.date).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleRepeat = () => {
    repeatLastOrder();
    setOpen(false);
    toast({
      title: '¡Pedido restaurado!',
      description: 'Puedes modificarlo o enviarlo tal como está.',
    });
  };

  const handleNew = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="text-orange-500" size={22} />
            ¡Bienvenido de vuelta!
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 pt-1">
            Tienes un pedido anterior del <strong>{orderDate}</strong> con{' '}
            <strong>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</strong>.
            ¿Quieres repetirlo o hacer uno nuevo?
          </DialogDescription>
        </DialogHeader>

        <div className="bg-orange-50 rounded-lg p-3 max-h-48 overflow-y-auto text-sm space-y-1 border border-orange-100">
          {lastOrder.cart?.slice(0, 6).map((item, i) => (
            <div key={i} className="flex justify-between text-gray-700">
              <span>• {item.product.name}</span>
              <span className="text-gray-500">
                {item.weight < 1000 ? `${item.weight}g` : `${item.weight / 1000}kg`}
              </span>
            </div>
          ))}
          {lastOrder.packageCart?.map((p, i) => (
            <div key={`p-${i}`} className="text-gray-700">🔥 {p.packageName}</div>
          ))}
          {lastOrder.petFoodCart?.map((p, i) => (
            <div key={`pf-${i}`} className="text-gray-700">
              {p.type === 'dog' ? '🐕' : '🐈'} {p.name} x{p.quantity}
            </div>
          ))}
          {lastOrder.cart && lastOrder.cart.length > 6 && (
            <div className="text-xs text-gray-500 italic">
              y {lastOrder.cart.length - 6} producto(s) más...
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={handleRepeat}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            <RotateCcw size={16} />
            Repetir pedido (puedes modificarlo)
          </Button>
          <Button
            onClick={handleNew}
            variant="outline"
            className="w-full"
          >
            <Plus size={16} />
            Hacer un pedido nuevo
          </Button>
          <button
            onClick={() => {
              clearLastOrder();
              setOpen(false);
            }}
            className="text-xs text-gray-400 hover:text-gray-600 mt-1"
          >
            Olvidar mi pedido anterior
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RepeatOrderPrompt;
