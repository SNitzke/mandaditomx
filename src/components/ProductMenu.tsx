
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProductMenu: React.FC = () => {
  const { products, addToCart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});

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

  const getWeightOptions = (minWeight: number) => {
    const options = [];
    // Generar opciones desde minWeight hasta 5kg en incrementos de 250g
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Productos Frescos</h2>
        <p className="text-gray-600">Productos de la más alta calidad directo del campo</p>
        <p className="text-sm text-orange-600 mt-2">* Compra mínima: 500 gramos por producto</p>
      </div>

      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-600 mb-4 border-b-2 border-orange-200 pb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryProducts.map((product) => {
              const selectedWeight = selectedWeights[product.id] || product.minWeight;
              const price = calculatePrice(product, selectedWeight);
              
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300 border-orange-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium text-gray-800">{product.name}</CardTitle>
                    <p className="text-sm text-gray-500">${product.pricePerKg}/kg</p>
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
                    
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-2xl font-bold text-orange-600">${price}</span>
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Agregar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductMenu;
