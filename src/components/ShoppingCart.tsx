
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ShoppingCartComponent: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const sendToWhatsApp = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de realizar el pedido",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = "525564259421";
    let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";
    
    cart.forEach((item) => {
      message += `• ${item.product.name} - Cantidad: ${item.quantity} - $${item.product.price * item.quantity}\n`;
    });
    
    message += `\n*Total: $${getTotalPrice()}*\n\n¡Gracias!`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "¡Pedido enviado!",
      description: "Te redirigimos a WhatsApp para confirmar tu pedido",
    });
  };

  if (cart.length === 0 && !isOpen) {
    return (
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-14 h-14 shadow-lg"
        >
          <ShoppingCart size={24} />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-14 h-14 shadow-lg relative"
        >
          <ShoppingCart size={24} />
          {getTotalItems() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">
              {getTotalItems()}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mi Pedido</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 text-center">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {cart.map((item) => (
                      <Card key={item.product.id} className="border-orange-100">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-orange-600 font-bold">${item.product.price}</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus size={16} />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus size={16} />
                              </Button>
                            </div>
                          </div>
                          <div className="text-right mt-2">
                            <span className="text-sm text-gray-600">
                              Subtotal: ${item.product.price * item.quantity}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-gray-800">Total:</span>
                      <span className="text-2xl font-bold text-orange-600">${getTotalPrice()}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={sendToWhatsApp}
                        className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={20} />
                        Enviar Pedido por WhatsApp
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={clearCart}
                        className="w-full text-red-500 border-red-200 hover:bg-red-50"
                      >
                        Limpiar Carrito
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShoppingCartComponent;
