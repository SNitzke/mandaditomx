
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  category: string;
  minWeight: number; // en gramos
}

export interface CartItem {
  product: Product;
  weight: number; // en gramos
  totalPrice: number;
}

interface CartContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, weight: number) => void;
  removeFromCart: (productId: string, weight: number) => void;
  updateWeight: (productId: string, oldWeight: number, newWeight: number) => void;
  clearCart: () => void;
  updateProductPrice: (productId: string, newPricePerKg: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialProducts: Product[] = [
  // Frutas y Verduras
  { id: '1', name: 'Brócoli Floretes', pricePerKg: 140, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '2', name: 'Brócoli de Corte', pricePerKg: 120, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '3', name: 'Ejotes Delgados', pricePerKg: 108, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '4', name: 'Chile Poblano', pricePerKg: 100, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '5', name: 'Coctel Francés', pricePerKg: 70, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '6', name: 'Coliflor', pricePerKg: 100, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '7', name: 'Judías Verdes', pricePerKg: 70, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '8', name: 'Durazno en trozos', pricePerKg: 70, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '9', name: 'Espárragos Especiales', pricePerKg: 110, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '10', name: 'Fresa Entera', pricePerKg: 76, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '11', name: 'Habas de Cambray', pricePerKg: 46, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '12', name: 'Maíz en Grano', pricePerKg: 120, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '13', name: 'Maíz en Elote', pricePerKg: 76, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '14', name: 'Ejotes Tiernos', pricePerKg: 250, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '15', name: 'Zanahoria Baby', pricePerKg: 140, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '16', name: 'Betabel', pricePerKg: 46, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '17', name: 'Ejotes de Tipo Frances', pricePerKg: 120, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '18', name: 'Espinaca', pricePerKg: 82, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '19', name: 'Espárragos de Res', pricePerKg: 160, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '20', name: 'Chícharos', pricePerKg: 250, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '21', name: 'Chícharos Baby', pricePerKg: 100, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '22', name: 'Chícharos de Sal', pricePerKg: 150, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '23', name: 'Angelotes de Cerdo', pricePerKg: 160, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '24', name: 'Fresa Chilena', pricePerKg: 140, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '25', name: 'Mango', pricePerKg: 100, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '26', name: 'Piña', pricePerKg: 100, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '27', name: 'Papa', pricePerKg: 280, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '28', name: 'Chícharos Naturales', pricePerKg: 380, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '29', name: 'Brócoli Frances', pricePerKg: 250, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '30', name: 'Papelillo de Durazno', pricePerKg: 280, category: 'Frutas y Verduras', minWeight: 500 },
  { id: '31', name: 'Espárrago', pricePerKg: 160, category: 'Frutas y Verduras', minWeight: 500 },

  // Carnes y Proteínas
  { id: '32', name: 'Mango Manila', pricePerKg: 120, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '33', name: 'Mango Passion', pricePerKg: 141, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '34', name: 'Guayabas', pricePerKg: 32, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '35', name: 'Pizones', pricePerKg: 132, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '36', name: 'Melón 1ra que hice 500 grs', pricePerKg: 130, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '37', name: 'Limón 1ra de ajo con 5 semillas', pricePerKg: 83, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '38', name: 'Limón verde', pricePerKg: 30, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '39', name: 'Lima dulce', pricePerKg: 16, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '40', name: 'Uva verde', pricePerKg: 150, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '41', name: 'Una roja de uva con 6 semillas', pricePerKg: 110, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '42', name: 'Uva negra de la americana', pricePerKg: 150, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '43', name: 'Uva roja', pricePerKg: 44, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '44', name: 'Manzana red', pricePerKg: 130, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '45', name: 'Maíz', pricePerKg: 30, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '46', name: 'Fresas Domic', pricePerKg: 180, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '47', name: 'Fresas great', pricePerKg: 95, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '48', name: 'Uvea', pricePerKg: 22, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '49', name: 'Granada', pricePerKg: 170, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '50', name: 'Mango', pricePerKg: 39, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '51', name: 'Mandarina', pricePerKg: 84, category: 'Carnes y Proteínas', minWeight: 500 },
  { id: '52', name: 'Zanahoria Dómic', pricePerKg: 43, category: 'Carnes y Proteínas', minWeight: 500 },

  // Productos Especiales
  { id: '53', name: 'Frambuesas', pricePerKg: 190, category: 'Productos Especiales', minWeight: 500 },
  { id: '54', name: 'Zarzamora', pricePerKg: 130, category: 'Productos Especiales', minWeight: 500 },
  { id: '55', name: 'Frambuesa dulce', pricePerKg: 170, category: 'Productos Especiales', minWeight: 500 },
  { id: '56', name: 'Frambuesa amarilla', pricePerKg: 170, category: 'Productos Especiales', minWeight: 500 },
  { id: '57', name: 'Frambuesa roja', pricePerKg: 180, category: 'Productos Especiales', minWeight: 500 },
  { id: '58', name: 'Zarzamora', pricePerKg: 91, category: 'Productos Especiales', minWeight: 500 },
  { id: '59', name: 'Bluebird', pricePerKg: 30, category: 'Productos Especiales', minWeight: 500 },
  { id: '60', name: 'Arandano', pricePerKg: 140, category: 'Productos Especiales', minWeight: 500 },
  { id: '61', name: 'Brócoli', pricePerKg: 135, category: 'Productos Especiales', minWeight: 500 },
  { id: '62', name: 'Nopales', pricePerKg: 33, category: 'Productos Especiales', minWeight: 500 },
  { id: '63', name: 'Lechuga', pricePerKg: 114, category: 'Productos Especiales', minWeight: 500 },
  { id: '64', name: 'Melón', pricePerKg: 99, category: 'Productos Especiales', minWeight: 500 },
  { id: '65', name: 'Apio', pricePerKg: 142, category: 'Productos Especiales', minWeight: 500 },
  { id: '66', name: 'Espinaca', pricePerKg: 180, category: 'Productos Especiales', minWeight: 500 },
  { id: '67', name: 'Pepita', pricePerKg: 179, category: 'Productos Especiales', minWeight: 500 },
  { id: '68', name: 'Cilantro', pricePerKg: 170, category: 'Productos Especiales', minWeight: 500 },
  { id: '69', name: 'Apio grueso', pricePerKg: 190, category: 'Productos Especiales', minWeight: 500 },
  { id: '70', name: 'Apio dulce', pricePerKg: 130, category: 'Productos Especiales', minWeight: 500 },
  { id: '71', name: 'Calabaza rayada', pricePerKg: 130, category: 'Productos Especiales', minWeight: 500 },
  { id: '72', name: 'Chile serrano', pricePerKg: 150, category: 'Productos Especiales', minWeight: 500 },
  { id: '73', name: 'Jitomate', pricePerKg: 120, category: 'Productos Especiales', minWeight: 500 },
  { id: '74', name: 'Repollo', pricePerKg: 104, category: 'Productos Especiales', minWeight: 500 },

  // Productos Frescos
  { id: '75', name: 'Ejotes', pricePerKg: 140, category: 'Productos Frescos', minWeight: 500 },
  { id: '76', name: 'Elucavi', pricePerKg: 104, category: 'Productos Frescos', minWeight: 500 },
  { id: '77', name: 'Durazno', pricePerKg: 130, category: 'Productos Frescos', minWeight: 500 },
  { id: '78', name: 'Espárrago Delgado', pricePerKg: 198, category: 'Productos Frescos', minWeight: 500 },
  { id: '79', name: 'Elote', pricePerKg: 139, category: 'Productos Frescos', minWeight: 500 },
  { id: '80', name: 'Coliflor', pricePerKg: 190, category: 'Productos Frescos', minWeight: 500 },
  { id: '81', name: 'Nopales', pricePerKg: 120, category: 'Productos Frescos', minWeight: 500 },
  { id: '82', name: 'Chayote', pricePerKg: 125, category: 'Productos Frescos', minWeight: 500 },
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, weight: number) => {
    const totalPrice = (product.pricePerKg * weight) / 1000;
    const newItem: CartItem = {
      product,
      weight,
      totalPrice: Math.round(totalPrice * 100) / 100
    };

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.weight === weight
      );
      
      if (existingItemIndex >= 0) {
        // Si ya existe el mismo producto con el mismo peso, no lo agregamos de nuevo
        return prevCart;
      }
      
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (productId: string, weight: number) => {
    setCart(prevCart => prevCart.filter(
      item => !(item.product.id === productId && item.weight === weight)
    ));
  };

  const updateWeight = (productId: string, oldWeight: number, newWeight: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId && item.weight === oldWeight) {
          const totalPrice = (item.product.pricePerKg * newWeight) / 1000;
          return {
            ...item,
            weight: newWeight,
            totalPrice: Math.round(totalPrice * 100) / 100
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateProductPrice = (productId: string, newPricePerKg: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, pricePerKg: newPricePerKg }
          : product
      )
    );
    
    // Actualizar precios en el carrito
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          const totalPrice = (newPricePerKg * item.weight) / 1000;
          return {
            ...item,
            product: { ...item.product, pricePerKg: newPricePerKg },
            totalPrice: Math.round(totalPrice * 100) / 100
          };
        }
        return item;
      })
    );
  };

  const getTotalPrice = () => {
    return Math.round(cart.reduce((total, item) => total + item.totalPrice, 0) * 100) / 100;
  };

  const getTotalItems = () => {
    return cart.length;
  };

  return (
    <CartContext.Provider value={{
      products,
      cart,
      addToCart,
      removeFromCart,
      updateWeight,
      clearCart,
      updateProductPrice,
      getTotalPrice,
      getTotalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
