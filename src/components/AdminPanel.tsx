import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Settings, Save, Plus, Trash2, Edit3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminPanel: React.FC = () => {
  const { products, updateProductPrice, addProduct, removeProduct, updateProductName } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [names, setNames] = useState<Record<string, string>>({});
  const [editingNames, setEditingNames] = useState<Record<string, boolean>>({});
  
  // Estados para agregar nuevo producto
  const [newProduct, setNewProduct] = useState({
    name: '',
    pricePerKg: 0,
    category: 'Frutas y Verduras',
    minWeight: 500
  });

  const ADMIN_CODE = 'Gutfeier9';

  const categories = [
    'Frutas y Verduras',
    'Carnes y Proteínas',
    'Pollo',
    'Productos Orgánicos'
    'Huevo'
  ];

  const authenticate = () => {
    if (adminCode === ADMIN_CODE) {
      setIsAuthenticated(true);
      const currentPrices: Record<string, number> = {};
      const currentNames: Record<string, string> = {};
      products.forEach(product => {
        currentPrices[product.id] = product.pricePerKg;
        currentNames[product.id] = product.name;
      });
      setPrices(currentPrices);
      setNames(currentNames);
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
      description: "El precio por kg se ha actualizado correctamente",
    });
  };

  const handlePriceChange = (productId: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setPrices(prev => ({
      ...prev,
      [productId]: numericValue
    }));
  };

  const handleNameChange = (productId: string, value: string) => {
    setNames(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const toggleEditName = (productId: string) => {
    setEditingNames(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const saveName = (productId: string) => {
    const newName = names[productId];
    if (newName && newName.trim()) {
      updateProductName(productId, newName.trim());
      toggleEditName(productId);
      toast({
        title: "Nombre actualizado",
        description: "El nombre del producto se ha actualizado correctamente",
      });
    }
  };

  const handleAddProduct = () => {
    if (newProduct.name.trim() && newProduct.pricePerKg > 0) {
      addProduct({
        name: newProduct.name.trim(),
        pricePerKg: newProduct.pricePerKg,
        category: newProduct.category,
        minWeight: newProduct.minWeight
      });
      
      setNewProduct({
        name: '',
        pricePerKg: 0,
        category: 'Frutas y Verduras',
        minWeight: 500
      });
      
      toast({
        title: "Producto agregado",
        description: "El nuevo producto se ha agregado correctamente",
      });
    } else {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos correctamente",
        variant: "destructive",
      });
    }
  };

  const handleRemoveProduct = (productId: string, productName: string) => {
    removeProduct(productId);
    toast({
      title: "Producto eliminado",
      description: `${productName} ha sido eliminado correctamente`,
    });
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
      <Card className="w-full max-w-7xl h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Panel de Administración - Gestión Completa de Productos
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
        
        <CardContent className="p-0 h-full">
          {!isAuthenticated ? (
            <div className="flex items-center justify-center h-full">
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
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-8">
                {/* Sección para agregar nuevo producto */}
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">
                      <Plus className="inline mr-2" size={20} />
                      Agregar Nuevo Producto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre del Producto</label>
                        <Input
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Ej: Brócoli Premium"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Precio por kg</label>
                        <Input
                          type="number"
                          value={newProduct.pricePerKg || ''}
                          onChange={(e) => setNewProduct({...newProduct, pricePerKg: parseFloat(e.target.value) || 0})}
                          placeholder="140"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Categoría</label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg z-[60]">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Peso mínimo (g)</label>
                        <Input
                          type="number"
                          value={newProduct.minWeight}
                          onChange={(e) => setNewProduct({...newProduct, minWeight: parseInt(e.target.value) || 500})}
                          placeholder="500"
                          min="250"
                          step="250"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddProduct} className="bg-green-600 hover:bg-green-700">
                      <Plus size={16} className="mr-2" />
                      Agregar Producto
                    </Button>
                  </CardContent>
                </Card>

                {/* Sección de productos existentes */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Productos Existentes ({products.length})
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="border-orange-100">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                {editingNames[product.id] ? (
                                  <div className="flex gap-2">
                                    <Input
                                      value={names[product.id] || product.name}
                                      onChange={(e) => handleNameChange(product.id, e.target.value)}
                                      className="text-sm"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => saveName(product.id)}
                                      className="bg-green-500 hover:bg-green-600"
                                    >
                                      <Save size={14} />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => toggleEditName(product.id)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Edit3 size={12} />
                                    </Button>
                                  </div>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveProduct(product.id, product.name)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                            
                            <div>
                              <p className="text-xs text-gray-500">{product.category}</p>
                              <p className="text-xs text-gray-400">Mín: {product.minWeight}g</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <label className="block text-xs text-gray-500 mb-1">
                                  Precio Actual: ${product.pricePerKg}/kg
                                </label>
                                <Input
                                  type="number"
                                  value={prices[product.id] || product.pricePerKg}
                                  onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                  min="0"
                                  step="0.01"
                                  className="text-sm"
                                  placeholder="$/kg"
                                />
                              </div>
                              <Button
                                onClick={() => updatePrice(product.id, prices[product.id] || product.pricePerKg)}
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                <Save size={14} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      products.forEach(product => {
                        if (prices[product.id] && prices[product.id] !== product.pricePerKg) {
                          updateProductPrice(product.id, prices[product.id]);
                        }
                      });
                      toast({
                        title: "Todos los precios actualizados",
                        description: "Se han guardado todos los cambios de precios por kg",
                      });
                    }}
                  >
                    Guardar Todos los Cambios de Precios
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
