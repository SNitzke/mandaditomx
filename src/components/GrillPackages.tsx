import React, { useState } from 'react';
import { grillPackages } from '@/data/grillPackages';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Flame, Beef, Package, Plus, Percent, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GrillPackage, PackageCartItem } from '@/types/product';

// Import images
import paqueteNortena from '@/assets/paquete-nortena.jpg';
import paqueteArgentino from '@/assets/paquete-argentino.jpg';
import paqueteVikingo from '@/assets/paquete-vikingo.jpg';
import paqueteMedieval from '@/assets/paquete-medieval.jpg';
import paqueteRomano from '@/assets/paquete-romano.jpg';

const imageMap: Record<string, string> = {
  '/src/assets/paquete-nortena.jpg': paqueteNortena,
  '/src/assets/paquete-argentino.jpg': paqueteArgentino,
  '/src/assets/paquete-vikingo.jpg': paqueteVikingo,
  '/src/assets/paquete-medieval.jpg': paqueteMedieval,
  '/src/assets/paquete-romano.jpg': paqueteRomano,
};

const GrillPackages: React.FC = () => {
  const { addPackageToCart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState<Record<string, Record<string, number>>>({});
  const [selectedRipeness, setSelectedRipeness] = useState<Record<string, Record<string, 'inmadura' | 'medio-madura' | 'madura'>>>({});

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
      
      // Aplicar descuento individual por carne si cumple el threshold
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
    
    toast({
      title: "¡Paquete agregado!",
      description: `${grillPackage.name} - $${pricing.totalPrice.toFixed(2)}${pricing.hasDiscount ? ' (con descuento aplicado)' : ''}`,
      duration: 3000,
    });
  };

  return (
    <section className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8 md:mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-full">
            <Flame size={28} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Paquetes Parrilleros</h2>
        </div>
        <p className="text-lg text-gray-600 mb-4">
          Experiencias gastronómicas completas para tu asado perfecto
        </p>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
          <Percent size={20} />
          <span>¡Ahorra 10% por cada carne de 3kg o más!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {grillPackages.map((grillPackage) => {
          const packageId = grillPackage.id;
          const pricing = calculatePackagePrice(grillPackage, packageId);
          const meats = grillPackage.items.filter(item => !item.isComplement);
          const complements = grillPackage.items.filter(item => item.isComplement);

          return (
            <Card 
              key={grillPackage.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-orange-200 hover:border-orange-300"
            >
              <div className="relative">
                <img 
                  src={imageMap[grillPackage.image]} 
                  alt={grillPackage.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">{grillPackage.name}</h3>
                  <p className="text-white/90 text-sm">{grillPackage.description}</p>
                </div>
                {pricing.hasDiscount && (
                  <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white font-bold">
                    -10% ¡DESCUENTO!
                  </Badge>
                )}
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Carnes Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Beef className="text-red-500" size={20} />
                    <h4 className="font-semibold text-gray-800">Carnes Premium</h4>
                  </div>
                  <div className="space-y-3">
                    {meats.map((item) => {
                      const selectedWeight = selectedWeights[packageId]?.[item.productId] || item.minWeight;
                      const originalPrice = (item.pricePerKg * selectedWeight) / 1000;
                      const hasIndividualDiscount = selectedWeight >= grillPackage.discount.threshold;
                      const discountAmount = hasIndividualDiscount ? (originalPrice * grillPackage.discount.percentage) / 100 : 0;
                      const finalPrice = originalPrice - discountAmount;

                      return (
                        <div key={item.productId} className="bg-red-50 border border-red-100 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <span className="font-medium text-sm text-gray-800">{item.name}</span>
                              {hasIndividualDiscount && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Percent size={12} className="text-green-600" />
                                  <span className="text-xs text-green-600 font-medium">10% OFF</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              {hasIndividualDiscount ? (
                                <div>
                                  <span className="text-red-400 line-through text-xs">${originalPrice.toFixed(2)}</span>
                                  <span className="text-red-600 font-semibold block">${finalPrice.toFixed(2)}</span>
                                </div>
                              ) : (
                                <span className="text-red-600 font-semibold">${finalPrice.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                          <Select
                            value={selectedWeight.toString()}
                            onValueChange={(value) => handleWeightChange(packageId, item.productId, value)}
                          >
                            <SelectTrigger className="w-full h-8 text-sm">
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
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Descuento individual por carne al llegar a 3kg
                  </div>
                </div>

                {/* Complementos Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="text-green-500" size={20} />
                    <h4 className="font-semibold text-gray-800">Complementos Frescos</h4>
                  </div>
                  <div className="space-y-2">
                    {complements.map((item) => {
                      const selectedWeight = selectedWeights[packageId]?.[item.productId] || item.minWeight;
                      const itemPrice = ((item.pricePerKg * selectedWeight) / 1000).toFixed(2);

                      return (
                        <div key={item.productId} className="bg-green-50 border border-green-100 rounded-lg p-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-700">{item.name}</span>
                            <span className="text-green-600 font-medium text-sm">${itemPrice}</span>
                          </div>
                          <Select
                            value={selectedWeight.toString()}
                            onValueChange={(value) => handleWeightChange(packageId, item.productId, value)}
                          >
                            <SelectTrigger className="w-full h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                              {getWeightOptions(item.minWeight).map((option) => (
                                <SelectItem 
                                  key={option.value} 
                                  value={option.value.toString()}
                                  className="hover:bg-green-50 cursor-pointer text-xs"
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

                {/* Price and Add Button */}
                <div className="border-t pt-4">
                  <div className="text-center mb-4">
                    {pricing.hasDiscount && (
                      <div className="text-sm text-green-600 font-medium mb-1">
                        ¡Descuento aplicado: -${pricing.discount.toFixed(2)}!
                      </div>
                    )}
                    <div className="text-3xl font-bold text-orange-600">
                      ${pricing.totalPrice.toFixed(2)}
                    </div>
                    {!pricing.hasDiscount && (
                      <div className="text-xs text-orange-500 mt-1">
                        Selecciona 3kg o más de cualquier carne para obtener 10% de descuento en esa carne
                      </div>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleAddPackageToCart(grillPackage)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Plus size={20} className="mr-2" />
                    Armar mi Paquete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">¿Por qué elegir nuestros Paquetes Parrilleros?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center">
              <Flame className="mb-2" size={32} />
              <h4 className="font-semibold mb-1">Carnes Premium</h4>
              <p className="opacity-90">Cortes seleccionados de la más alta calidad</p>
            </div>
            <div className="flex flex-col items-center">
              <Percent className="mb-2" size={32} />
              <h4 className="font-semibold mb-1">Descuento Individual</h4>
              <p className="opacity-90">10% off por cada carne de 3kg o más</p>
            </div>
            <div className="flex flex-col items-center">
              <Package className="mb-2" size={32} />
              <h4 className="font-semibold mb-1">Todo Incluido</h4>
              <p className="opacity-90">Carnes y complementos listos para tu parrilla</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrillPackages;
