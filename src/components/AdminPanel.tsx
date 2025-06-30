
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminPanel: React.FC = () => {
  const { products, updateProductPrice } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});

  const ADMIN_CODE = 'admin123'; // En producción, esto debería ser más seguro

  const authenticate = () => {
    if (adminCode === ADMIN_CODE) {
      setIsAuthenticated(true);
      // Inicializar precios actuales
      const currentPrices: Record<string, number> = {};
      products.forEach(product => {
        currentPrices[product.id] = product.price;
      });
      setPrices(currentPrices);
      toast({
        title: "Acceso concedido",
        description: "Bienvenido al panel de administración",
      });
    } else {
      toast({
        title: "Código incorrecto",
        description: "El código de acceso no es válido",
        variant: "destructive",
      });
    }
  };

  const updatePrice = (productId: string, newPrice: number) => {
    updateProductPrice(productId, newPrice);
    toast({
      title: "Precio actualizado",
      description: "El precio se ha actualizado correctamente",
    });
  };

  const handlePriceChange = (productId: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setPrices(prev => ({
      ...prev,
      [productId]: numericValue
    }));
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 left-6">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="opacity-50 hover:opacity-100"
        >
          <Settings size={16} />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Panel de Administración
          </CardTitle>
          <Button
            variant="ghost"
            onClick={() => {
              setIsVisible(false);
              setIsAuthenticated(false);
              setAdminCode('');
            }}
          >
            ✕
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-y-auto">
          {!isAuthenticated ? (
            <div className="space-y-4 max-w-sm mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Código de Acceso</label>
                <Input
                  type="password"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Ingresa el código"
                  onKeyPress={(e) => e.key === 'Enter' && authenticate()}
                />
              </div>
              <Button onClick={authenticate} className="w-full">
                Acceder
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Pista: admin123
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Gestión de Precios
                </h3>
                <p className="text-gray-600 text-sm">
                  Actualiza los precios de los productos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="border-orange-100">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-800">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.category}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">
                              Precio Actual: ${product.price}
                            </label>
                            <Input
                              type="number"
                              value={prices[product.id] || product.price}
                              onChange={(e) => handlePriceChange(product.id, e.target.value)}
                              min="0"
                              step="0.01"
                              className="text-lg font-medium"
                            />
                          </div>
                          <Button
                            onClick={() => updatePrice(product.id, prices[product.id] || product.price)}
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            <Save size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    products.forEach(product => {
                      if (prices[product.id] && prices[product.id] !== product.price) {
                        updateProductPrice(product.id, prices[product.id]);
                      }
                    });
                    toast({
                      title: "Todos los precios actualizados",
                      description: "Se han guardado todos los cambios",
                    });
                  }}
                >
                  Guardar Todos los Cambios
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
