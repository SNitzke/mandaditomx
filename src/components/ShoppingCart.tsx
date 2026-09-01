
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ShoppingCart, Trash2, MessageCircle, MapPin, User, Clock, Flame, Percent, CreditCard, Banknote, ChevronUp, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CARD_SURCHARGE = 0.043; // 4.3%

const ShoppingCartComponent: React.FC = () => {
  const { cart, packageCart, petFoodCart, extrasCart, updateExtraQuantity, removeExtraFromCart, updateWeight, removeFromCart, removePackageFromCart, removePetFoodFromCart, clearCart, getTotalPrice, getTotalItems, saveLastOrder } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const isCartEmpty = cart.length === 0 && packageCart.length === 0 && petFoodCart.length === 0 && extrasCart.length === 0;

  const sendToWhatsApp = () => {
    if (isCartEmpty) {
      toast({
        title: "Carrito vacío",
        description: "Agrega productos antes de realizar el pedido",
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa tu nombre para el pedido",
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
    const cardSurcharge = paymentMethod === 'card' ? Math.round((subtotal + shippingCost) * CARD_SURCHARGE * 100) / 100 : 0;
    const finalTotal = subtotal + shippingCost + cardSurcharge;
    
    let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";
    
    // Productos individuales agrupados por categoría
    if (cart.length > 0) {
      const categoryEmojis: Record<string, string> = {
        'Frutas y Verduras': '🥬',
        'Carnes y Proteínas': '🥩',
        'Pollo': '🍗',
        'Producto Orgánico': '🧀',
        'Huevo': '🥚',
      };
      const categoryOrder = ['Frutas y Verduras', 'Carnes y Proteínas', 'Pollo', 'Producto Orgánico', 'Huevo'];
      const grouped: Record<string, typeof cart> = {};
      cart.forEach(item => {
        const cat = item.product.category;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
      });
      
      categoryOrder.forEach(cat => {
        if (grouped[cat] && grouped[cat].length > 0) {
          const emoji = categoryEmojis[cat] || '📦';
          message += `${emoji} *${cat.toUpperCase()}:*\n`;
          grouped[cat].forEach(item => {
            const isPiece = item.product.unit === 'piece' && item.product.gramsPerPiece;
            const weightDisplay = isPiece
              ? `${Math.max(1, Math.round(item.weight / (item.product.gramsPerPiece || 1)))} ${Math.max(1, Math.round(item.weight / (item.product.gramsPerPiece || 1))) === 1 ? 'pieza' : 'piezas'}`
              : (item.weight < 1000 ? `${item.weight}g` : `${item.weight/1000}kg`);
            const ripenessText = item.ripeness ? ` (${item.ripeness})` : '';
            message += `• ${item.product.name}${ripenessText} - ${weightDisplay} - $${item.totalPrice.toFixed(2)}\n`;
          });
          message += "\n";
        }
      });
      // Cualquier categoría no listada
      Object.keys(grouped).forEach(cat => {
        if (!categoryOrder.includes(cat) && grouped[cat].length > 0) {
          message += `📦 *${cat.toUpperCase()}:*\n`;
          grouped[cat].forEach(item => {
            const isPiece = item.product.unit === 'piece' && item.product.gramsPerPiece;
            const weightDisplay = isPiece
              ? `${Math.max(1, Math.round(item.weight / (item.product.gramsPerPiece || 1)))} ${Math.max(1, Math.round(item.weight / (item.product.gramsPerPiece || 1))) === 1 ? 'pieza' : 'piezas'}`
              : (item.weight < 1000 ? `${item.weight}g` : `${item.weight/1000}kg`);
            const ripenessText = item.ripeness ? ` (${item.ripeness})` : '';
            message += `• ${item.product.name}${ripenessText} - ${weightDisplay} - $${item.totalPrice.toFixed(2)}\n`;
          });
          message += "\n";
        }
      });
    }
    
    // Paquetes parrilleros
    if (packageCart.length > 0) {
      message += "🔥 *PAQUETES PARRILLEROS:*\n";
      packageCart.forEach((packageItem) => {
        message += `📦 *${packageItem.packageName}*\n`;
        
        // Carnes
        const meats = packageItem.items.filter(item => !item.isComplement);
        if (meats.length > 0) {
          message += "   🥩 Carnes:\n";
          meats.forEach(meat => {
            const weightDisplay = meat.weight < 1000 ? `${meat.weight}g` : `${meat.weight/1000}kg`;
            const originalPrice = ((meat.pricePerKg * meat.weight) / 1000);
            const finalPrice = meat.individualDiscount ? 
              originalPrice - meat.individualDiscount : originalPrice;
            
            if (meat.individualDiscount) {
              message += `     • ${meat.name} - ${weightDisplay} - ~$${originalPrice.toFixed(2)}~ $${finalPrice.toFixed(2)} (10% OFF)\n`;
            } else {
              message += `     • ${meat.name} - ${weightDisplay} - $${finalPrice.toFixed(2)}\n`;
            }
          });
        }
        
        // Complementos
        const complements = packageItem.items.filter(item => item.isComplement);
        if (complements.length > 0) {
          message += "   🥬 Complementos:\n";
          complements.forEach(complement => {
            const weightDisplay = complement.weight < 1000 ? `${complement.weight}g` : `${complement.weight/1000}kg`;
            const ripenessText = complement.ripeness ? ` (${complement.ripeness})` : '';
            const price = ((complement.pricePerKg * complement.weight) / 1000).toFixed(2);
            message += `     • ${complement.name}${ripenessText} - ${weightDisplay} - $${price}\n`;
          });
        }
        
        if (packageItem.totalDiscount) {
          message += `   💰 *Descuento total aplicado: -$${packageItem.totalDiscount.toFixed(2)}*\n`;
        }
        
        message += `   💲 *Subtotal paquete: $${packageItem.totalPrice.toFixed(2)}*\n\n`;
      });
    }
    
    // Alimento para mascotas
    if (petFoodCart.length > 0) {
      message += "🐾 *ALIMENTO PARA MASCOTAS:*\n";
      petFoodCart.forEach((item) => {
        message += `• ${item.type === 'dog' ? '🐕' : '🐈'} ${item.name} (${item.weight}) x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}\n`;
      });
      message += "\n";
    }

    // Extras (Tortillería, Suplementos)
    if (extrasCart.length > 0) {
      const extraEmojis: Record<string, string> = {
        'Tortillería': '🌽',
        'Suplementos': '🌿',
      };
      const groupedExtras: Record<string, typeof extrasCart> = {};
      extrasCart.forEach(item => {
        if (!groupedExtras[item.category]) groupedExtras[item.category] = [];
        groupedExtras[item.category].push(item);
      });
      Object.keys(groupedExtras).forEach(cat => {
        message += `${extraEmojis[cat] || '📦'} *${cat.toUpperCase()}:*\n`;
        groupedExtras[cat].forEach(item => {
          message += `• ${item.emoji ? item.emoji + ' ' : ''}${item.name} (${item.variantLabel}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        message += "\n";
      });
    }


    
    message += `*Subtotal: $${subtotal.toFixed(2)}*\n`;
    
    if (shippingCost > 0) {
      message += `*Envío: $${shippingCost.toFixed(2)}*\n`;
    }

    if (paymentMethod === 'card') {
      message += `💳 *Pago con tarjeta (+4.3%): +$${cardSurcharge.toFixed(2)}*\n`;
    } else {
      message += `💵 *Pago en efectivo*\n`;
    }
    
    message += `*Total: $${finalTotal.toFixed(2)}*\n\n`;
    message += `👤 *Nombre:* ${customerName}\n`;
    message += `📍 *Dirección de entrega:*\n${address}\n\n`;
    message += `🕐 *Horario de entrega:* 1:00 PM - 5:00 PM\n`;
    message += `⏰ *Recordatorio:* Último horario para pedidos hasta las 10:00 PM\n\n`;
    
    if (subtotal < 1500) {
      message += `*Nota:* Pedidos menores a $1,500 tienen un costo de envío de $50.\n\n`;
    }
    
    message += `¡Gracias!`;
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    saveLastOrder({ cart, packageCart, petFoodCart, customerName, address, paymentMethod });
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "¡Pedido enviado!",
      description: "Te redirigimos a WhatsApp para confirmar tu pedido",
    });
  };

  const getWeightOptions = (product: any) => {
    const options = [];
    if (product.unit === 'piece' && product.gramsPerPiece) {
      const g = product.gramsPerPiece;
      for (let n = 1; n <= 10; n++) {
        options.push({ value: g * n, label: `${n} ${n === 1 ? 'pieza' : 'piezas'}` });
      }
      return options;
    }
    for (let weight = product.minWeight; weight <= 5000; weight += 250) {
      if (weight < 1000) {
        options.push({ value: weight, label: `${weight}g` });
      } else {
        const kg = weight / 1000;
        options.push({ value: weight, label: `${kg}kg` });
      }
    }
    return options;
  };

  const formatItemQuantity = (product: any, weight: number) => {
    if (product.unit === 'piece' && product.gramsPerPiece) {
      const n = Math.max(1, Math.round(weight / product.gramsPerPiece));
      return `${n} ${n === 1 ? 'pieza' : 'piezas'}`;
    }
    return weight < 1000 ? `${weight}g` : `${weight / 1000}kg`;
  };

  const handleWeightChange = (productId: string, oldWeight: number, newWeight: string) => {
    updateWeight(productId, oldWeight, parseInt(newWeight));
  };

  if (cart.length === 0 && packageCart.length === 0 && petFoodCart.length === 0 && !isOpen) {
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

      {/* Cart Dialog - pantalla grande para mejor visualización */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl w-screen sm:w-[95vw] h-[100dvh] sm:h-[85vh] max-h-[100dvh] sm:max-h-[85vh] p-0 flex flex-col gap-0 sm:rounded-lg rounded-none">
          <DialogHeader className="px-6 pt-6 pb-3 border-b">
            <DialogTitle className="text-2xl font-bold text-gray-800 text-left">
              🛒 Mi Pedido {getTotalItems() > 0 && <span className="text-base font-normal text-gray-500">({getTotalItems()} {getTotalItems() === 1 ? 'producto' : 'productos'})</span>}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 sm:px-6 py-4 flex-1 flex flex-col overflow-hidden">

              {cart.length === 0 && packageCart.length === 0 && petFoodCart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 text-center">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
                    {/* Productos individuales */}
                    {cart.map((item, index) => {
                      const weightDisplay = item.weight < 1000 ? `${item.weight}g` : `${item.weight/1000}kg`;
                      
                      return (
                         <Card key={`${item.product.id}-${item.weight}-${item.ripeness}-${index}`} className="border-orange-100">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-medium text-gray-800">{item.product.name}</h3>
                                  <Badge variant="outline" className="text-xs">Individual</Badge>
                                </div>
                                <p className="text-sm text-gray-500">${item.product.pricePerKg}/kg</p>
                                {item.ripeness && (
                                  <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                    <Clock size={12} />
                                    {item.ripeness === 'inmadura' ? '🟢 Verde' : 
                                     item.ripeness === 'medio-madura' ? '🟡 Medio maduro' : 
                                     '🟠 Maduro'}
                                  </p>
                                )}
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
                                <label className="text-xs text-gray-500 mb-1 block">
                                  {item.product.unit === 'piece' ? 'Piezas:' : 'Peso:'}
                                </label>
                                <Select
                                  value={item.weight.toString()}
                                  onValueChange={(value) => handleWeightChange(item.product.id, item.weight, value)}
                                >
                                  <SelectTrigger className="w-full h-8 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    {getWeightOptions(item.product).map((option) => (
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

                    {/* Paquetes parrilleros */}
                    {packageCart.map((packageItem, index) => (
                      <Card key={`package-${packageItem.packageId}-${index}`} className="border-red-200 bg-gradient-to-r from-orange-50 to-red-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Flame size={16} className="text-red-500" />
                                <h3 className="font-bold text-gray-800">{packageItem.packageName}</h3>
                                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
                                  Paquete
                                </Badge>
                              </div>
                              {packageItem.totalDiscount && (
                                <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                  <Percent size={12} />
                                  Descuento total: -${packageItem.totalDiscount.toFixed(2)}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePackageFromCart(packageItem.packageId)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            {/* Carnes */}
                            <div>
                              <h4 className="text-xs font-semibold text-red-700 mb-2">🥩 Carnes:</h4>
                              <div className="space-y-1">
                                {packageItem.items.filter(item => !item.isComplement).map((meat, meatIndex) => {
                                  const weightDisplay = meat.weight < 1000 ? `${meat.weight}g` : `${meat.weight/1000}kg`;
                                  const originalPrice = (meat.pricePerKg * meat.weight) / 1000;
                                  const finalPrice = meat.individualDiscount ? 
                                    originalPrice - meat.individualDiscount : originalPrice;
                                  return (
                                    <div key={meatIndex} className="flex justify-between items-center text-xs bg-white/50 rounded px-2 py-1">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-1">
                                          <span>{meat.name} - {weightDisplay}</span>
                                          {meat.individualDiscount && (
                                            <span className="text-green-600 font-medium">(10% OFF)</span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        {meat.individualDiscount ? (
                                          <div>
                                            <span className="text-gray-400 line-through text-xs">${originalPrice.toFixed(2)}</span>
                                            <span className="font-medium block">${finalPrice.toFixed(2)}</span>
                                          </div>
                                        ) : (
                                          <span className="font-medium">${finalPrice.toFixed(2)}</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            {/* Complementos */}
                            <div>
                              <h4 className="text-xs font-semibold text-green-700 mb-2">🥬 Complementos:</h4>
                              <div className="space-y-1">
                                {packageItem.items.filter(item => item.isComplement).map((complement, compIndex) => {
                                  const weightDisplay = complement.weight < 1000 ? `${complement.weight}g` : `${complement.weight/1000}kg`;
                                  const price = ((complement.pricePerKg * complement.weight) / 1000).toFixed(2);
                                  const ripenessText = complement.ripeness ? ` (${complement.ripeness})` : '';
                                  return (
                                    <div key={compIndex} className="flex justify-between items-center text-xs bg-white/50 rounded px-2 py-1">
                                      <span>{complement.name}{ripenessText} - {weightDisplay}</span>
                                      <span className="font-medium">${price}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <div className="text-right border-t pt-2">
                              <span className="text-lg font-bold text-red-600">
                                ${packageItem.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Alimento para mascotas */}
                    {petFoodCart.map((item, index) => (
                      <Card key={`pet-${item.id}-${index}`} className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span>{item.type === 'dog' ? '🐕' : '🐈'}</span>
                                <h3 className="font-medium text-gray-800">{item.name}</h3>
                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                                  Mascota
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">{item.weight} · x{item.quantity}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePetFoodFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          <div className="text-right mt-2">
                            <span className="text-lg font-bold text-orange-600">
                              ${(item.price * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Collapsible open={checkoutOpen} onOpenChange={setCheckoutOpen} className="border-t mt-2 bg-white flex-shrink-0 flex flex-col min-h-0">
                    <CollapsibleTrigger asChild>
                      <button className="w-full flex items-center justify-between px-2 py-3 hover:bg-gray-50 transition-colors flex-shrink-0">
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-gray-500">Total {checkoutOpen ? '(toca para ocultar)' : '(toca para finalizar)'}</span>
                          <span className="text-2xl font-bold text-orange-600">
                            ${(() => {
                              const sub = getTotalPrice();
                              const ship = sub < 1500 ? 50 : 0;
                              const card = paymentMethod === 'card' ? Math.round((sub + ship) * CARD_SURCHARGE * 100) / 100 : 0;
                              return (sub + ship + card).toFixed(2);
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-orange-600 font-medium text-sm">
                          {checkoutOpen ? <>Ocultar <ChevronDown size={20} /></> : <>Finalizar pedido <ChevronUp size={20} /></>}
                        </div>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
                      <div className="px-2 pb-4 pt-2 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2 mb-4">
                      {/* Payment Method Selection */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Método de pago:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setPaymentMethod('cash')}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                              paymentMethod === 'cash'
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <Banknote size={18} />
                            Efectivo
                          </button>
                          <button
                            onClick={() => setPaymentMethod('card')}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                              paymentMethod === 'card'
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            <CreditCard size={18} />
                            Tarjeta
                          </button>
                        </div>
                      </div>

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
                      {paymentMethod === 'card' && (
                        <div className="flex justify-between items-center text-blue-600">
                          <span className="text-sm flex items-center gap-1">
                            <CreditCard size={14} />
                            Comisión tarjeta (4.3%):
                          </span>
                          <span className="text-sm font-medium">
                            +${((getTotalPrice() + (getTotalPrice() < 1500 ? 50 : 0)) * CARD_SURCHARGE).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {getTotalPrice() < 1500 && (
                        <p className="text-xs text-gray-500 text-center">
                          *Pedidos menores a $1,500 tienen un costo de envío de $50
                        </p>
                      )}
                      {paymentMethod === 'card' && (
                        <p className="text-xs text-blue-500 text-center">
                          *Pagos con tarjeta de crédito/débito incluyen un 4.3% adicional
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="customerName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User size={16} />
                          Nombre para el pedido
                        </Label>
                        <Input
                          id="customerName"
                          type="text"
                          placeholder="Ingresa tu nombre completo..."
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      
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
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShoppingCartComponent;
