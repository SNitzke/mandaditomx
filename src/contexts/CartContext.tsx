
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialProducts: Product[] = [
  { id: '1', name: 'Hamburguesa Clásica', price: 85, category: 'Hamburguesas' },
  { id: '2', name: 'Hamburguesa con Queso', price: 95, category: 'Hamburguesas' },
  { id: '3', name: 'Pizza Margherita', price: 120, category: 'Pizzas' },
  { id: '4', name: 'Pizza Pepperoni', price: 140, category: 'Pizzas' },
  { id: '5', name: 'Tacos de Carnitas (3 pzs)', price: 45, category: 'Tacos' },
  { id: '6', name: 'Tacos de Pastor (3 pzs)', price: 45, category: 'Tacos' },
  { id: '7', name: 'Quesadilla de Queso', price: 35, category: 'Quesadillas' },
  { id: '8', name: 'Quesadilla de Pollo', price: 55, category: 'Quesadillas' },
  { id: '9', name: 'Agua Natural', price: 15, category: 'Bebidas' },
  { id: '10', name: 'Refresco', price: 25, category: 'Bebidas' },
];

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, price: newPrice }
          : product
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      products,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
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
