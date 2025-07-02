
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ShoppingCart, Plus, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProductMenu: React.FC = () => {
  const { products, addToCart, cart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: any) => {
    const selectedWeight = selectedWeights[product.id] || product.minWeight;
    const totalPrice = (product.pricePerKg * selectedWeight) / 1000;
    
    addToCart(product, selectedWeight);
    toast({
      title: "¡Producto agregado!",
      description: `${product.name} (${selectedWeight}g) - $${totalPrice.toFixed(2)}`,
      duration: 2000,
    });
  };

  const handleWeightChange = (productId: string, weight: string) => {
    setSelectedWeights(prev => ({
      ...prev,
      [productId]: parseInt(weight)
    }));
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const isProductInCart = (productId: string) => {
    return cart.some(item => item.product.id === productId);
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

  const calculatePrice = (product: any, weight: number) => {
    return ((product.pricePerKg * weight) / 1000).toFixed(2);
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Productos Frescos</h2>
        <p className="text-sm md:text-base text-gray-600">Productos de la más alta calidad directo del productor</p>
        <p className="text-xs md:text-sm text-orange-600 mt-2">* Compra mínima: 500 gramos por producto</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
            <Collapsible 
              open={openCategories[category] ?? false} 
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 md:p-4 flex justify-between items-center hover:from-orange-600 hover:to-red-600 transition-colors">
                  <h3 className="text-lg md:text-xl font-semibold text-left">
                    {category}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm opacity-80">
                      {categoryProducts.length} productos
                    </span>
                    {openCategories[category] ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="p-4 md:p-6 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryProducts.map((product) => {
                      const selectedWeight = selectedWeights[product.id] || product.minWeight;
                      const price = calculatePrice(product, selectedWeight);
                      const inCart = isProductInCart(product.id);
                      
                      return (
                        <Card 
                          key={product.id} 
                          className={`hover:shadow-lg transition-all duration-300 ${
                            inCart 
                              ? 'border-green-500 bg-green-50 shadow-md' 
                              : 'border-orange-100 hover:border-orange-200'
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-base md:text-lg font-medium text-gray-800">
                                  {product.name}
                                </CardTitle>
                                <p className="text-sm text-gray-500">${product.pricePerKg}/kg</p>
                              </div>
                              {inCart && (
                                <div className="bg-green-500 text-white rounded-full p-1 ml-2">
                                  <Check size={16} />
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-700 mb-2 block">
                                Seleccionar peso:
                              </label>
                              <Select
                                value={selectedWeight.toString()}
                                onValueChange={(value) => handleWeightChange(product.id, value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecciona el peso" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                                  {getWeightOptions(product.minWeight).map((option) => (
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
                            
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-2">
                              <span className="text-xl md:text-2xl font-bold text-orange-600">
                                ${price}
                              </span>
                              <Button 
                                onClick={() => handleAddToCart(product)}
                                className={`w-full sm:w-auto flex items-center gap-2 transition-colors ${
                                  inCart 
                                    ? 'bg-green-500 hover:bg-green-600' 
                                    : 'bg-orange-500 hover:bg-orange-600'
                                } text-white`}
                              >
                                <Plus size={16} />
                                {inCart ? 'Agregar más' : 'Agregar'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductMenu;
