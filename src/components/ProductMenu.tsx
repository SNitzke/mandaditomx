
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProductMenu: React.FC = () => {
  const { products, addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "¡Producto agregado!",
      description: `${product.name} se agregó al carrito`,
      duration: 2000,
    });
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Nuestro Menú</h2>
        <p className="text-gray-600">Deliciosos productos preparados con amor</p>
      </div>

      {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
        <div key={category} className="mb-8">
          <h3 className="text-2xl font-semibold text-orange-600 mb-4 border-b-2 border-orange-200 pb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow duration-300 border-orange-100">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium text-gray-800">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">${product.price}</span>
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
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductMenu;
