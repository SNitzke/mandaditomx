
import { Product, CartItem } from '@/types/product';

export const useProductOperations = (
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  cart: CartItem[],
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
) => {
  const updateProductPrice = (productId: string, newPricePerKg: number) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, pricePerKg: newPricePerKg }
          : product
      )
    );
    
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

  const updateProductName = (productId: string, newName: string) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, name: newName }
          : product
      )
    );
    
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            product: { ...item.product, name: newName }
          };
        }
        return item;
      })
    );
  };

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newId = (Math.max(...products.map(p => parseInt(p.id))) + 1).toString();
    const newProduct: Product = {
      id: newId,
      ...newProductData
    };
    
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const removeProduct = (productId: string) => {
    setProducts(prevProducts => 
      prevProducts.filter(product => product.id !== productId)
    );
    
    setCart(prevCart => 
      prevCart.filter(item => item.product.id !== productId)
    );
  };

  return {
    updateProductPrice,
    updateProductName,
    addProduct,
    removeProduct
  };
};
