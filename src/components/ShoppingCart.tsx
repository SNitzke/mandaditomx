
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingCart, Trash2, MessageCircle, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ShoppingCartComponent: React.FC = () => {
  const { cart, updateWeight, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState('');

  const sendToWhatsApp = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de realizar el pedido",
        variant: "destructive",
      });
      return;
    }

    if (!address.trim()) {
      toast({
        title: "Dirección requerida",
        description: "Por favor ingresa tu dirección de entrega",
        variant: "destructive",
      });
      return;
    }

    const phoneNumber = "525564259421";
    const subtotal = getTotalPrice();
    const shippingCost = subtotal < 1500 ? 50 : 0;
    const finalTotal = subtotal + shippingCost;
    
    let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";
    
    cart.forEach((item) => {
      const weightDisplay = item.weight < 1000 ? `${item.weight}g` : `${item.weight/1000}kg`;
      message += `• ${item.product.name} - ${weightDisplay} - $${item.totalPrice.toFixed(2)}\n`;
    });
    
    message += `\n*Subtotal: $${subtotal.toFixed(2)}*\n`;
    
    if (shippingCost > 0) {
      message += `*Envío: $${shippingCost.toFixed(2)}*\n`;
    }
    
    message += `*Total: $${finalTotal.toFixed(2)}*\n\n`;
    message += `📍 *Dirección de entrega:*\n${address}\n\n`;
    message += `🕐 *Horario de entrega:* 4:00 PM - 7:00 PM\n\n`;
    
    if (subtotal < 1500) {
      message += `*Nota:* Pedidos menores a $1,500 tienen un costo de envío de $50.\n\n`;
    }
    
    message += `¡Gracias!`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "¡Pedido enviado!",
      description: "Te redirigimos a WhatsApp para confirmar tu pedido",
    });
  };

  const getWeightOptions = (minWeight: number) => {
    const options = [];
    for (let weight = minWeight; weight <= 5000; weight += 250) {
      if (weight < 1000) {
        options.push({ value: weight, label: `${weight}g` });
      } else {
        const kg = weight / 1000;
        options.push({ value: weight, label: `${kg}kg` });
      }
    }
    return options;
  };

  const handleWeightChange = (productId: string, oldWeight: number, newWeight: string) => {
    updateWeight(productId, oldWeight, parseInt(newWeight));
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
                    {cart.map((item, index) => {
                      const weightDisplay = item.weight < 1000 ? `${item.weight}g` : `${item.weight/1000}kg`;
                      
                      return (
                        <Card key={`${item.product.id}-${item.weight}-${index}`} className="border-orange-100">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                                <p className="text-sm text-gray-500">${item.product.pricePerKg}/kg</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.product.id, item.weight)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                            
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs text-gray-500 mb-1 block">Peso:</label>
                                <Select
                                  value={item.weight.toString()}
                                  onValueChange={(value) => handleWeightChange(item.product.id, item.weight, value)}
                                >
                                  <SelectTrigger className="w-full h-8 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    {getWeightOptions(item.product.minWeight).map((option) => (
                                      <SelectItem 
                                        key={option.value} 
                                        value={option.value.toString()}
                                        className="hover:bg-orange-50 cursor-pointer"
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="text-right">
                                <span className="text-lg font-bold text-orange-600">
                                  ${item.totalPrice.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-700">Subtotal:</span>
                        <span className="text-lg text-gray-800">${getTotalPrice().toFixed(2)}</span>
                      </div>
                      {getTotalPrice() < 1500 && (
                        <div className="flex justify-between items-center">
                          <span className="text-lg text-gray-700">Envío:</span>
                          <span className="text-lg text-gray-800">$50.00</span>
                        </div>
                      )}
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-800">Total:</span>
                          <span className="text-2xl font-bold text-orange-600">
                            ${(getTotalPrice() + (getTotalPrice() < 1500 ? 50 : 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {getTotalPrice() < 1500 && (
                        <p className="text-xs text-gray-500 text-center">
                          *Pedidos menores a $1,500 tienen un costo de envío de $50
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin size={16} />
                          Dirección de entrega
                        </Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="Ingresa tu dirección completa..."
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full"
                        />
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
