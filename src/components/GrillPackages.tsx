import React, { useState } from 'react';
import { grillPackages } from '@/data/grillPackages';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Flame, Beef, Package, Plus, Percent, AlertTriangle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GrillPackage, PackageCartItem } from '@/types/product';

// Import images
import paqueteNortena from '@/assets/paquete-nortena.jpg';
import paqueteArgentino from '@/assets/paquete-argentino.jpg';
import paqueteVikingo from '@/assets/paquete-vikingo.jpg';
import paqueteMedieval from '@/assets/paquete-medieval.jpg';
import paqueteRomano from '@/assets/paquete-romano.jpg';
import paqueteFiestasPatrias from '@/assets/paquete-fiestas-patrias.jpg';

const imageMap: Record<string, string> = {
  '/src/assets/paquete-nortena.jpg': paqueteNortena,
  '/src/assets/paquete-argentino.jpg': paqueteArgentino,
  '/src/assets/paquete-vikingo.jpg': paqueteVikingo,
  '/src/assets/paquete-medieval.jpg': paqueteMedieval,
  '/src/assets/paquete-romano.jpg': paqueteRomano,
  '/src/assets/paquete-fiestas-patrias.jpg': paqueteFiestasPatrias,
};

const isPackageAvailable = (pkg: GrillPackage) =>
  !pkg.availableUntil || new Date(pkg.availableUntil).getTime() >= Date.now();

const GrillPackages: React.FC = () => {
  const { addPackageToCart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState<Record<string, Record<string, number>>>({});
  const [selectedRipeness, setSelectedRipeness] = useState<Record<string, Record<string, 'inmadura' | 'medio-madura' | 'madura'>>>({});
  const [selectedPackage, setSelectedPackage] = useState<GrillPackage | null>(null);

  const handleWeightChange = (packageId: string, productId: string, weight: string) => {
    setSelectedWeights(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [productId]: parseInt(weight)
      }
    }));
  };

  const handleRipenessChange = (packageId: string, productId: string, ripeness: 'inmadura' | 'medio-madura' | 'madura') => {
    setSelectedRipeness(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [productId]: ripeness
      }
    }));
  };

  const calculatePackagePrice = (grillPackage: GrillPackage, packageId: string) => {
    let totalPrice = 0;
    let totalDiscount = 0;
    let meatDiscounts: Record<string, number> = {};
    let hasAnyDiscount = false;

    grillPackage.items.forEach(item => {
      const weight = selectedWeights[packageId]?.[item.productId] || item.minWeight;
      let itemPrice = (item.pricePerKg * weight) / 1000;
      
      if (!item.isComplement && weight >= grillPackage.discount.threshold) {
        const individualDiscount = (itemPrice * grillPackage.discount.percentage) / 100;
        meatDiscounts[item.productId] = individualDiscount;
        totalDiscount += individualDiscount;
        itemPrice -= individualDiscount;
        hasAnyDiscount = true;
      }
      
      totalPrice += itemPrice;
    });

    return {
      totalPrice: Math.round(totalPrice * 100) / 100,
      discount: Math.round(totalDiscount * 100) / 100,
      hasDiscount: hasAnyDiscount,
      meatDiscounts
    };
  };

  const getWeightOptions = (minWeight: number) => {
    const options = [];
    const maxWeight = minWeight >= 1000 ? 5000 : Math.max(5000, minWeight * 4);
    
    for (let weight = minWeight; weight <= maxWeight; weight += minWeight >= 1000 ? 500 : 500) {
      if (weight < 1000) {
        options.push({ value: weight, label: `${weight}g` });
      } else {
        const kg = weight / 1000;
        options.push({ value: weight, label: `${kg}kg` });
      }
    }
    return options;
  };

  const handleAddPackageToCart = (grillPackage: GrillPackage) => {
    const packageId = grillPackage.id;
    const pricing = calculatePackagePrice(grillPackage, packageId);
    
    const packageCartItem: PackageCartItem = {
      packageId: grillPackage.id,
      packageName: grillPackage.name,
      items: grillPackage.items.map(item => {
        const weight = selectedWeights[packageId]?.[item.productId] || item.minWeight;
        const originalPrice = (item.pricePerKg * weight) / 1000;
        const hasIndividualDiscount = !item.isComplement && weight >= grillPackage.discount.threshold;
        const individualDiscount = hasIndividualDiscount ? (originalPrice * grillPackage.discount.percentage) / 100 : 0;
        
        return {
          productId: item.productId,
          name: item.name,
          weight,
          pricePerKg: item.pricePerKg,
          isComplement: item.isComplement || false,
          ripeness: item.name.includes('Frutas y Verduras') ? 
            selectedRipeness[packageId]?.[item.productId] || 'medio-madura' : undefined,
          individualDiscount: individualDiscount > 0 ? individualDiscount : undefined
        };
      }),
      totalPrice: pricing.totalPrice,
      totalDiscount: pricing.hasDiscount ? pricing.discount : undefined
    };

    addPackageToCart(packageCartItem);
    setSelectedPackage(null);
    
    toast({
      title: "¡Paquete agregado!",
      description: `${grillPackage.name} - $${pricing.totalPrice.toFixed(2)}${pricing.hasDiscount ? ' (con descuento aplicado)' : ''}`,
      duration: 3000,
    });
  };

  return (
    <section className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full animate-pulse-glow">
            <Flame size={32} />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            🔥 Paquetes Parrilleros
          </h2>
        </div>
        <p className="text-xl md:text-2xl text-gray-700 mb-4 font-semibold">
          La experiencia completa para tu asado perfecto
        </p>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl animate-bounce-subtle">
          <Percent size={24} />
          <span>¡Ahorra 10% por cada carne de 3kg o más!</span>
        </div>
      </div>

      {/* Grid de paquetes - Solo imágenes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
        {grillPackages.filter(isPackageAvailable).map((grillPackage, index) => (
          <div 
            key={grillPackage.id}
            className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer animate-scale-in hover:scale-105 ${grillPackage.badge ? 'ring-4 ring-green-500 sm:col-span-2 lg:col-span-1' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedPackage(grillPackage)}
          >
            <div className="aspect-[4/3] relative">
              <img 
                src={imageMap[grillPackage.image]} 
                alt={grillPackage.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/20 transition-all duration-300" />
              {grillPackage.badge && (
                <span className="absolute top-3 left-3 bg-white/95 text-green-700 font-extrabold text-sm px-3 py-1 rounded-full shadow-lg">
                  {grillPackage.badge}
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-8px]">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">{grillPackage.name}</h3>
              <p className="text-white/90 text-sm md:text-base mb-3 drop-shadow-md">{grillPackage.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-300 font-bold text-xl">👆 Click para armar</span>
                <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold text-sm px-3 py-1">
                  -10% OFF
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalle del paquete */}
      <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedPackage && (
            <div>
              <DialogHeader>
                <div className="relative">
                  <img 
                    src={imageMap[selectedPackage.image]} 
                    alt={selectedPackage.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
                  <DialogTitle className="absolute bottom-4 left-4 text-white text-3xl font-bold drop-shadow-lg">
                    {selectedPackage.name}
                  </DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                {(() => {
                  const packageId = selectedPackage.id;
                  const pricing = calculatePackagePrice(selectedPackage, packageId);
                  const meats = selectedPackage.items.filter(item => !item.isComplement);
                  const complements = selectedPackage.items.filter(item => item.isComplement);

                  return (
                    <>
                      {/* Carnes */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Beef className="text-red-500" size={24} />
                          <h4 className="font-bold text-xl text-gray-800">Carnes Premium</h4>
                        </div>
                        <div className="space-y-3">
                          {meats.map((item) => {
                            const selectedWeight = selectedWeights[packageId]?.[item.productId] || item.minWeight;
                            const originalPrice = (item.pricePerKg * selectedWeight) / 1000;
                            const hasIndividualDiscount = selectedWeight >= selectedPackage.discount.threshold;
                            const discountAmount = hasIndividualDiscount ? (originalPrice * selectedPackage.discount.percentage) / 100 : 0;
                            const finalPrice = originalPrice - discountAmount;

                            return (
                              <div key={item.productId} className="bg-red-50 border-2 border-red-200 rounded-xl p-4 hover:border-red-300 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <span className="font-semibold text-base text-gray-800">{item.name}</span>
                                    {hasIndividualDiscount && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <Percent size={14} className="text-green-600" />
                                        <span className="text-sm text-green-600 font-bold">10% OFF aplicado!</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    {hasIndividualDiscount ? (
                                      <div>
                                        <span className="text-red-400 line-through text-sm">${originalPrice.toFixed(2)}</span>
                                        <span className="text-red-600 font-bold text-lg block">${finalPrice.toFixed(2)}</span>
                                      </div>
                                    ) : (
                                      <span className="text-red-600 font-bold text-lg">${finalPrice.toFixed(2)}</span>
                                    )}
                                  </div>
                                </div>
                                <Select
                                  value={selectedWeight.toString()}
                                  onValueChange={(value) => handleWeightChange(packageId, item.productId, value)}
                                >
                                  <SelectTrigger className="w-full h-10 text-sm font-medium">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    {getWeightOptions(item.minWeight).map((option) => (
                                      <SelectItem 
                                        key={option.value} 
                                        value={option.value.toString()}
                                        className="hover:bg-red-50 cursor-pointer text-sm"
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-sm text-gray-600 mt-3 flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <AlertTriangle size={16} className="text-yellow-600" />
                          <span className="font-medium">Descuento del 10% se aplica individualmente a cada carne de 3kg o más</span>
                        </div>
                      </div>

                      {/* Complementos */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Package className="text-green-500" size={24} />
                          <h4 className="font-bold text-xl text-gray-800">Complementos Frescos</h4>
                        </div>
                        <div className="space-y-3">
                          {complements.map((item) => {
                            const selectedWeight = selectedWeights[packageId]?.[item.productId] || item.minWeight;
                            const itemPrice = ((item.pricePerKg * selectedWeight) / 1000).toFixed(2);

                            return (
                              <div key={item.productId} className="bg-green-50 border-2 border-green-200 rounded-xl p-4 hover:border-green-300 transition-all">
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-base font-medium text-gray-800">{item.name}</span>
                                  <span className="text-green-600 font-bold text-lg">${itemPrice}</span>
                                </div>
                                <Select
                                  value={selectedWeight.toString()}
                                  onValueChange={(value) => handleWeightChange(packageId, item.productId, value)}
                                >
                                  <SelectTrigger className="w-full h-9 text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                    {getWeightOptions(item.minWeight).map((option) => (
                                      <SelectItem 
                                        key={option.value} 
                                        value={option.value.toString()}
                                        className="hover:bg-green-50 cursor-pointer text-sm"
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Total y botón */}
                      <div className="border-t-2 pt-6">
                        <div className="text-center mb-6">
                          {pricing.hasDiscount && (
                            <div className="text-lg text-green-600 font-bold mb-2 bg-green-50 py-2 px-4 rounded-lg inline-block">
                              ✨ Descuento aplicado: -${pricing.discount.toFixed(2)}
                            </div>
                          )}
                          <div className="text-4xl font-extrabold text-orange-600 mb-2">
                            ${pricing.totalPrice.toFixed(2)}
                          </div>
                          {!pricing.hasDiscount && (
                            <div className="text-sm text-orange-600 bg-orange-50 py-2 px-4 rounded-lg inline-block">
                              💡 Selecciona 3kg o más de cualquier carne para obtener 10% OFF
                            </div>
                          )}
                        </div>
                        <Button 
                          onClick={() => handleAddPackageToCart(selectedPackage)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg py-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                        >
                          <Plus size={24} className="mr-2" />
                          Agregar al Carrito
                        </Button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Info Section */}
      <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in">
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-extrabold mb-6">¿Por qué nuestros Paquetes Parrilleros?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-base">
            <div className="flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <Flame className="mb-3" size={48} />
              <h4 className="font-bold text-xl mb-2">Carnes Premium</h4>
              <p className="opacity-90">Los mejores cortes, la máxima calidad</p>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <Percent className="mb-3" size={48} />
              <h4 className="font-bold text-xl mb-2">Descuento Individual</h4>
              <p className="opacity-90">10% OFF en cada carne de 3kg o más</p>
            </div>
            <div className="flex flex-col items-center transform hover:scale-110 transition-all duration-300">
              <Package className="mb-3" size={48} />
              <h4 className="font-bold text-xl mb-2">Todo Incluido</h4>
              <p className="opacity-90">Carnes + complementos = Parrilla perfecta</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrillPackages;