
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, ChevronDown, ChevronUp, Check, Clock, Search, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { isInSeason, getSeasonMessage } from '@/data/seasonalProducts';

const ProductMenu: React.FC = () => {
  const { products, addToCart, cart } = useCart();
  const [selectedWeights, setSelectedWeights] = useState<Record<string, number>>({});
  const [selectedRipeness, setSelectedRipeness] = useState<Record<string, 'inmadura' | 'medio-madura' | 'madura'>>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  
  const currentMonth = new Date().getMonth();

  const handleAddToCart = (product: any) => {
    const selectedWeight = selectedWeights[product.id] || product.minWeight;
    const totalPrice = (product.pricePerKg * selectedWeight) / 1000;
    const ripeness = product.category === 'Frutas y Verduras' ? selectedRipeness[product.id] || 'medio-madura' : undefined;
    
    addToCart(product, selectedWeight, ripeness);
    
    const ripenessText = ripeness ? ` - ${ripeness}` : '';
    toast({
      title: "¡Producto agregado!",
      description: `${product.name} (${selectedWeight}g)${ripenessText} - $${totalPrice.toFixed(2)}`,
      duration: 2000,
    });
  };

  const handleWeightChange = (productId: string, weight: string) => {
    setSelectedWeights(prev => ({
      ...prev,
      [productId]: parseInt(weight)
    }));
  };

  const handleRipenessChange = (productId: string, ripeness: 'inmadura' | 'medio-madura' | 'madura') => {
    setSelectedRipeness(prev => ({
      ...prev,
      [productId]: ripeness
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
    for (let weight = minWeight; weight <= 5000; weight += 500) {
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

  const handleSearchChange = (category: string, term: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [category]: term
    }));
  };

  const filterProductsBySearch = (categoryProducts: typeof products, category: string) => {
    const searchTerm = searchTerms[category]?.toLowerCase() || '';
    if (!searchTerm) return categoryProducts;
    
    return categoryProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
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
        <p className="text-xs md:text-sm text-orange-600 mt-2">Compra mínima: 500 gramos por producto</p>
        <p className="text-xs md:text-sm text-orange-600 mt-2">Solicitar con 1 semana de anticipación cualquier producto en la categoría de "Producto Orgánico"</p>
        <p className="text-xs md:text-sm text-orange-600 mt-2">Horario límite para realizar pedidos: hasta las 10:00 PM cada día</p>
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
                      {filterProductsBySearch(categoryProducts, category).length} de {categoryProducts.length} productos
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
                  {/* Buscador por categoría */}
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder={`Buscar en ${category}...`}
                        value={searchTerms[category] || ''}
                        onChange={(e) => handleSearchChange(category, e.target.value)}
                        className="pl-10 bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterProductsBySearch(categoryProducts, category).map((product) => {
                      const selectedWeight = selectedWeights[product.id] || product.minWeight;
                      const selectedRipenessValue = selectedRipeness[product.id] || 'medio-madura';
                      const price = calculatePrice(product, selectedWeight);
                      const inCart = isProductInCart(product.id);
                      const isFruitOrVegetable = product.category === 'Frutas y Verduras';
                      const productInSeason = isFruitOrVegetable ? isInSeason(product.name, currentMonth) : true;
                      const seasonMessage = isFruitOrVegetable ? getSeasonMessage(product.name, currentMonth) : '';
                      
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
                                
                                {/* Indicador de temporada para frutas y verduras */}
                                {isFruitOrVegetable && (
                                  <div className="mt-1">
                                    {productInSeason ? (
                                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                        🌱 {seasonMessage}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        {seasonMessage}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>
                              {inCart && (
                                <div className="bg-green-500 text-white rounded-full p-1 ml-2">
                                  <Check size={16} />
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {/* Selector de peso */}
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
                            
                            {/* Selector de madurez - Solo para frutas y verduras */}
                            {isFruitOrVegetable && (
                              <div>
                                <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                                  <Clock size={16} />
                                  Nivel de madurez:
                                </label>
                                <div className="relative">
                                  {/* Timeline visual */}
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
                                      <div 
                                        className={`absolute h-1 bg-gradient-to-r from-green-400 to-yellow-500 rounded-full transition-all duration-300 ${
                                          selectedRipenessValue === 'inmadura' ? 'w-1/3' : 
                                          selectedRipenessValue === 'medio-madura' ? 'w-2/3' : 'w-full'
                                        }`}
                                      />
                                      <div 
                                        className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-md transition-all duration-300 -top-1 ${
                                          selectedRipenessValue === 'inmadura' ? 'left-0 bg-green-500' :
                                          selectedRipenessValue === 'medio-madura' ? 'left-1/2 -translate-x-1/2 bg-yellow-500' :
                                          'right-0 bg-orange-500'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Opciones de madurez */}
                                  <div className="grid grid-cols-3 gap-2">
                                    {[
                                      { value: 'inmadura', label: 'Verde', emoji: '🟢', color: 'border-green-500 bg-green-50 text-green-700' },
                                      { value: 'medio-madura', label: 'Medio', emoji: '🟡', color: 'border-yellow-500 bg-yellow-50 text-yellow-700' },
                                      { value: 'madura', label: 'Maduro', emoji: '🟠', color: 'border-orange-500 bg-orange-50 text-orange-700' }
                                    ].map((option) => (
                                      <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleRipenessChange(product.id, option.value as any)}
                                        className={`p-2 rounded-lg border-2 transition-all text-xs font-medium flex flex-col items-center gap-1 ${
                                          selectedRipenessValue === option.value
                                            ? option.color + ' shadow-md scale-105'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                      >
                                        <span className="text-lg">{option.emoji}</span>
                                        <span>{option.label}</span>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            
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
                  
                  {/* Mensaje cuando no hay resultados de búsqueda */}
                  {filterProductsBySearch(categoryProducts, category).length === 0 && searchTerms[category] && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-2">No se encontraron productos que coincidan con "{searchTerms[category]}"</p>
                      <Button 
                        variant="outline" 
                        onClick={() => handleSearchChange(category, '')}
                        className="text-sm"
                      >
                        Limpiar búsqueda
                      </Button>
                    </div>
                  )}
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
