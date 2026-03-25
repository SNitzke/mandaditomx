
import { useState, useEffect } from 'react';
import { Product, CartItem, PackageCartItem } from '@/types/product';

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const useCartOperations = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>(() => loadFromStorage('mi-super-cart', []));
  const [packageCart, setPackageCart] = useState<PackageCartItem[]>(() => loadFromStorage('mi-super-package-cart', []));

  useEffect(() => { localStorage.setItem('mi-super-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('mi-super-package-cart', JSON.stringify(packageCart)); }, [packageCart]);

  const addToCart = (product: Product, weight: number, ripeness?: 'inmadura' | 'medio-madura' | 'madura') => {
    const totalPrice = (product.pricePerKg * weight) / 1000;
    const newItem: CartItem = {
      product,
      weight,
      totalPrice: Math.round(totalPrice * 100) / 100,
      ripeness
    };

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.weight === weight && item.ripeness === ripeness
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

  const addPackageToCart = (packageData: PackageCartItem) => {
    setPackageCart(prevPackageCart => {
      const existingPackageIndex = prevPackageCart.findIndex(
        item => item.packageId === packageData.packageId
      );
      
      if (existingPackageIndex >= 0) {
        // Si ya existe, lo reemplazamos
        return prevPackageCart.map((item, index) => 
          index === existingPackageIndex ? packageData : item
        );
      }
      
      return [...prevPackageCart, packageData];
    });
  };

  const removePackageFromCart = (packageId: string) => {
    setPackageCart(prevPackageCart => 
      prevPackageCart.filter(item => item.packageId !== packageId)
    );
  };

  const getTotalPrice = () => {
    const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);
    const packageTotal = packageCart.reduce((total, item) => total + item.totalPrice, 0);
    return Math.round((cartTotal + packageTotal) * 100) / 100;
  };

  const getTotalItems = () => {
    return cart.length + packageCart.length;
  };

  return {
    products,
    cart,
    packageCart,
    addToCart,
    removeFromCart,
    updateWeight,
    addPackageToCart,
    removePackageFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    setProducts,
    setCart
  };
};
