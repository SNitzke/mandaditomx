
import { useState, useEffect } from 'react';
import { Product, CartItem, PackageCartItem, PetFoodCartItem } from '@/types/product';

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
  const [petFoodCart, setPetFoodCart] = useState<PetFoodCartItem[]>(() => loadFromStorage('mi-super-pet-cart', []));

  useEffect(() => { localStorage.setItem('mi-super-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('mi-super-package-cart', JSON.stringify(packageCart)); }, [packageCart]);
  useEffect(() => { localStorage.setItem('mi-super-pet-cart', JSON.stringify(petFoodCart)); }, [petFoodCart]);

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
    setPetFoodCart([]);
  };

  const addPackageToCart = (packageData: PackageCartItem) => {
    setPackageCart(prevPackageCart => {
      const existingPackageIndex = prevPackageCart.findIndex(
        item => item.packageId === packageData.packageId
      );
      
      if (existingPackageIndex >= 0) {
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

  const addPetFoodToCart = (item: PetFoodCartItem) => {
    setPetFoodCart(prev => {
      const existing = prev.findIndex(p => p.id === item.id);
      if (existing >= 0) {
        return prev.map((p, i) => i === existing ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, item];
    });
  };

  const removePetFoodFromCart = (id: string) => {
    setPetFoodCart(prev => prev.filter(p => p.id !== id));
  };

  const getTotalPrice = () => {
    const cartTotal = cart.reduce((total, item) => total + item.totalPrice, 0);
    const packageTotal = packageCart.reduce((total, item) => total + item.totalPrice, 0);
    const petTotal = petFoodCart.reduce((total, item) => total + item.price * item.quantity, 0);
    return Math.round((cartTotal + packageTotal + petTotal) * 100) / 100;
  };

  const getTotalItems = () => {
    return cart.length + packageCart.length + petFoodCart.length;
  };

  return {
    products,
    cart,
    packageCart,
    petFoodCart,
    addToCart,
    removeFromCart,
    updateWeight,
    addPackageToCart,
    removePackageFromCart,
    addPetFoodToCart,
    removePetFoodFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    setProducts,
    setCart
  };
};
