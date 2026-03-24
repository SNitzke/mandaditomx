import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Dog, Cat } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import categoryMascotasImg from '@/assets/category-mascotas.jpg';
import dogFoodImg from '@/assets/products/dog-food.jpg';
import catFoodImg from '@/assets/products/cat-food.jpg';

interface PetFoodItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  type: 'dog' | 'cat';
}

const petFoodProducts: PetFoodItem[] = [
  // Perro
  { id: 'pet-1', name: 'Nupec Adulto R. Grande', price: 1850, weight: '20 kg', type: 'dog' },
  { id: 'pet-2', name: 'Beneful Adulto', price: 1200, weight: '20 kg', type: 'dog' },
  { id: 'pet-3', name: 'Dog Chow Cachorro', price: 1015, weight: '20 kg', type: 'dog' },
  { id: 'pet-4', name: 'Dog Chow Adulto', price: 1100, weight: '25 kg', type: 'dog' },
  { id: 'pet-5', name: 'Ganador Adulto', price: 1100, weight: '25 kg', type: 'dog' },
  { id: 'pet-6', name: 'Ganador Cachorro', price: 1040, weight: '20 kg', type: 'dog' },
  { id: 'pet-7', name: 'Ganador Premium Adulto', price: 1190, weight: '20 kg', type: 'dog' },
  { id: 'pet-8', name: 'Ganador Premium Cachorro', price: 1230, weight: '20 kg', type: 'dog' },
  { id: 'pet-9', name: 'Pedigree Adulto', price: 1000, weight: '20 kg', type: 'dog' },
  { id: 'pet-10', name: 'Pedigree Puppy', price: 1100, weight: '20 kg', type: 'dog' },
  { id: 'pet-11', name: 'ProPlan Adulto', price: 1600, weight: '13 kg', type: 'dog' },
  { id: 'pet-12', name: 'ProPlan Cachorro', price: 1700, weight: '13 kg', type: 'dog' },
  { id: 'pet-13', name: 'Hi Dog Cachorro', price: 700, weight: '20 kg', type: 'dog' },
  { id: 'pet-14', name: 'Hi Dog Adulto', price: 800, weight: '25 kg', type: 'dog' },
  // Gato
  { id: 'pet-15', name: 'Cat Chow', price: 1120, weight: '20 kg', type: 'cat' },
  { id: 'pet-16', name: 'Minino', price: 800, weight: '15 kg', type: 'cat' },
  { id: 'pet-17', name: 'Minino Plus', price: 650, weight: '10 kg', type: 'cat' },
  { id: 'pet-18', name: 'Whiskas', price: 1000, weight: '20 kg', type: 'cat' },
  { id: 'pet-19', name: 'Gatina', price: 700, weight: '15 kg', type: 'cat' },
];

const PetFood: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'dog' | 'cat'>('dog');
  const [petCart, setPetCart] = useState<Record<string, number>>({});
  const { cart } = useCart();

  const filteredProducts = petFoodProducts.filter(p => p.type === selectedType);

  const addToPetCart = (item: PetFoodItem) => {
    setPetCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));
    toast({
      title: "¡Producto agregado!",
      description: `${item.name} (${item.weight}) - $${item.price.toLocaleString()}`,
      duration: 2000,
    });
  };

  const getQuantity = (id: string) => petCart[id] || 0;

  const image = selectedType === 'dog' ? dogFoodImg : catFoodImg;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
          🐾 Alimento para Mascotas
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-6 font-medium">
          Las mejores marcas para consentir a tu mejor amigo
        </p>
      </div>

      {/* Pet Type Selector */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setSelectedType('dog')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
            selectedType === 'dog'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-300/50 scale-105'
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-amber-300'
          }`}
        >
          🐕 Perro
        </button>
        <button
          onClick={() => setSelectedType('cat')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
            selectedType === 'cat'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-300/50 scale-105'
              : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300'
          }`}
        >
          🐈 Gato
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.map((item) => {
          const qty = getQuantity(item.id);
          return (
            <Card
              key={item.id}
              className={`hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] animate-fade-in rounded-2xl overflow-hidden ${
                qty > 0
                  ? 'border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-200/50'
                  : selectedType === 'dog'
                    ? 'border-2 border-amber-100 hover:border-amber-300 bg-gradient-to-br from-white to-amber-50/30'
                    : 'border-2 border-purple-100 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50/30'
              }`}
            >
              {/* Product Image */}
              <div className="relative h-36 md:h-44 overflow-hidden">
                <img
                  src={image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-2 right-2">
                  <Badge className={`${selectedType === 'dog' ? 'bg-amber-500' : 'bg-purple-500'} text-white font-bold text-sm px-2 py-1 shadow-lg`}>
                    {item.weight}
                  </Badge>
                </div>
                {qty > 0 && (
                  <div className="absolute top-2 right-2 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg font-bold text-sm">
                    {qty}
                  </div>
                )}
              </div>

              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-base md:text-lg font-bold text-gray-800 leading-tight">
                  {item.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-gray-800">
                      ${item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/ {item.weight}</span>
                  </div>
                </div>

                <Button
                  onClick={() => addToPetCart(item)}
                  className={`w-full font-bold text-white rounded-xl h-11 transition-all duration-300 ${
                    selectedType === 'dog'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-300/50'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-purple-300/50'
                  } shadow-lg hover:shadow-xl hover:scale-[1.02]`}
                >
                  <Plus size={18} className="mr-1" />
                  Agregar
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* WhatsApp Order Summary for Pet Food */}
      {Object.keys(petCart).length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🛒 Tu pedido de mascotas</h3>
          <div className="space-y-2 mb-4">
            {Object.entries(petCart).map(([id, qty]) => {
              const item = petFoodProducts.find(p => p.id === id);
              if (!item || qty === 0) return null;
              return (
                <div key={id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.name}</span>
                    <Badge variant="outline" className="text-xs">{item.weight}</Badge>
                    <Badge variant="secondary" className="text-xs">x{qty}</Badge>
                  </div>
                  <span className="font-bold">${(item.price * qty).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-extrabold text-green-600">
              ${Object.entries(petCart).reduce((sum, [id, qty]) => {
                const item = petFoodProducts.find(p => p.id === id);
                return sum + (item ? item.price * qty : 0);
              }, 0).toLocaleString()}
            </span>
          </div>
          <Button
            onClick={() => {
              const items = Object.entries(petCart)
                .map(([id, qty]) => {
                  const item = petFoodProducts.find(p => p.id === id);
                  return item ? `• ${item.name} (${item.weight}) x${qty} - $${(item.price * qty).toLocaleString()}` : '';
                })
                .filter(Boolean)
                .join('\n');
              const total = Object.entries(petCart).reduce((sum, [id, qty]) => {
                const item = petFoodProducts.find(p => p.id === id);
                return sum + (item ? item.price * qty : 0);
              }, 0);
              const message = `🐾 *Pedido Alimento para Mascotas*\n\n${items}\n\n💰 *Total: $${total.toLocaleString()}*`;
              window.open(`https://wa.me/5215564259421?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg"
          >
            📱 Enviar pedido por WhatsApp
          </Button>
        </div>
      )}
    </div>
  );
};

export default PetFood;
