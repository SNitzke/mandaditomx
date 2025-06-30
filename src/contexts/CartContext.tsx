
import React, { createContext, useContext, ReactNode } from 'react';
import { CartContextType } from '@/types/product';
import { initialProducts } from '@/data/initialProducts';
import { useCartOperations } from '@/hooks/useCartOperations';
import { useProductOperations } from '@/hooks/useProductOperations';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const cartOperations = useCartOperations(initialProducts);
  const productOperations = useProductOperations(
    cartOperations.products,
    cartOperations.setProducts,
    cartOperations.cart,
    cartOperations.setCart
  );

  const contextValue: CartContextType = {
    ...cartOperations,
    ...productOperations,
  };

  return (
    <CartContext.Provider value={contextValue}>
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
