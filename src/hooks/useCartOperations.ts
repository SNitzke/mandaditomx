
import { useState } from 'react';
import { Product, CartItem } from '@/types/product';

export const useCartOperations = (initialProducts: Product[]) => {
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

  const getTotalPrice = () => {
    return Math.round(cart.reduce((total, item) => total + item.totalPrice, 0) * 100) / 100;
  };

  const getTotalItems = () => {
    return cart.length;
  };

  return {
    products,
    cart,
    addToCart,
    removeFromCart,
    updateWeight,
    clearCart,
    getTotalPrice,
    getTotalItems,
    setProducts,
    setCart
  };
};
