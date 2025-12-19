
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
import { getProductImage } from '@/data/productImages';
import frutasVerdurasImg from '@/assets/category-frutas-verduras.jpg';
import carnesImg from '@/assets/category-carnes.jpg';
import polloImg from '@/assets/category-pollo.jpg';
import organicoImg from '@/assets/category-organico.jpg';
import huevoImg from '@/assets/category-huevo.jpg';
import costcoImg from '@/assets/category-costco.jpg';

const categoryImages: Record<string, string> = {
  'Frutas y Verduras': frutasVerdurasImg,
  'Carnes y Proteínas': carnesImg,
  'Pollo': polloImg,
  'Producto Orgánico': organicoImg,
  'Huevo': huevoImg,
  'Producto Importado': costcoImg,
};

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
      <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          🌿 Productos Frescos Premium
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-6 font-medium">La más alta calidad directo del productor a tu mesa</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm md:text-base">
          <div className="bg-orange-100 border-2 border-orange-300 text-orange-700 px-4 py-2 rounded-full font-medium shadow-sm">
            🛒 Compra mínima: 500g por producto
          </div>
          <div className="bg-green-100 border-2 border-green-300 text-green-700 px-4 py-2 rounded-full font-medium shadow-sm">
            ⏰ Pedidos hasta las 18:00 PM
          </div>
          <div className="bg-blue-100 border-2 border-blue-300 text-blue-700 px-4 py-2 rounded-full font-medium shadow-sm">
            📅 Orgánicos: 1 semana anticipación
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category} className="group">
            <Collapsible 
              open={openCategories[category] ?? false} 
              onOpenChange={() => toggleCategory(category)}
            >
              <CollapsibleTrigger className="w-full">
                <div 
                  className="relative h-56 md:h-64 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-[1.03] group animate-scale-in"
                  style={{
                    backgroundImage: `url(${categoryImages[category]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/20 group-hover:to-red-500/20 transition-all duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 transform group-hover:translate-y-[-8px] transition-all duration-300">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl px-5 py-4 shadow-2xl border-2 border-white/50 group-hover:border-orange-300 transition-all duration-300">
                      <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 text-center mb-2">
                        {category}
                      </h3>
                      <p className="text-sm text-gray-600 text-center font-medium">
                        ✨ {categoryProducts.length} productos premium
                      </p>
                      <div className="mt-2 text-center">
                        <span className="text-orange-600 font-bold text-sm">👆 Click para explorar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="fixed inset-0 bg-black/50 z-40 overflow-y-auto" onClick={() => toggleCategory(category)}>
                  <div className="min-h-screen p-4 flex items-start justify-center pt-20">
                    <div 
                      className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden flex flex-col"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold">{category}</h3>
                          <p className="text-sm opacity-90 mt-1">{categoryProducts.length} productos disponibles</p>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => toggleCategory(category)}
                          className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                        >
                          ✕
                        </Button>
                      </div>

                      {/* Search */}
                      <div className="p-6 border-b bg-gray-50">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input
                            type="text"
                            placeholder={`Buscar en ${category}...`}
                            value={searchTerms[category] || ''}
                            onChange={(e) => handleSearchChange(category, e.target.value)}
                            className="pl-12 h-12 text-base bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                          />
                        </div>
                      </div>

                      {/* Products */}
                      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
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
                                className={`hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in rounded-2xl overflow-hidden ${
                                  inCart 
                                    ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-200/50' 
                                    : 'border-2 border-orange-100 hover:border-orange-300 bg-gradient-to-br from-white to-orange-50/30'
                                }`}
                              >
                                {/* Product Image */}
                                {getProductImage(product.name, product.category) && (
                                  <div className="relative h-36 md:h-44 overflow-hidden">
                                    <img 
                                      src={getProductImage(product.name, product.category)} 
                                      alt={product.name}
                                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-2 right-2">
                                      <Badge className="bg-orange-500 text-white font-bold text-sm px-2 py-1 shadow-lg">
                                        ${product.pricePerKg}/kg
                                      </Badge>
                                    </div>
                                    {inCart && (
                                      <div className="absolute top-2 right-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full p-2 shadow-lg animate-bounce-subtle">
                                        <Check size={18} strokeWidth={3} />
                                      </div>
                                    )}
                                  </div>
                                )}
                                <CardHeader className="pb-2 pt-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <CardTitle className="text-base md:text-lg font-bold text-gray-800 mb-1 leading-tight">
                                        {product.name}
                                      </CardTitle>
                                      
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
                                    {!getProductImage(product.name, product.category) && inCart && (
                                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full p-2 ml-2 shadow-lg animate-bounce-subtle">
                                        <Check size={20} strokeWidth={3} />
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
                                  
                                   <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t-2 border-gray-100 mt-2">
                                    <div className="text-center sm:text-left">
                                      <p className="text-xs text-gray-500 font-medium">Precio Total</p>
                                      <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                        ${price}
                                      </span>
                                    </div>
                                    <Button 
                                      onClick={() => handleAddToCart(product)}
                                      className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6 py-6 text-base"
                                    >
                                      <Plus size={20} className="mr-2" strokeWidth={3} />
                                      {inCart ? '¡Agregar más!' : '¡Agregar!'}
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
                    </div>
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
