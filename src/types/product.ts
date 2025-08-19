
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
  ripeness?: 'inmadura' | 'medio-madura' | 'madura'; // para frutas y verduras
}

export interface CartContextType {
  products: Product[];
  cart: CartItem[];
  addToCart: (product: Product, weight: number, ripeness?: 'inmadura' | 'medio-madura' | 'madura') => void;
  removeFromCart: (productId: string, weight: number) => void;
  updateWeight: (productId: string, oldWeight: number, newWeight: number) => void;
  clearCart: () => void;
  updateProductPrice: (productId: string, newPricePerKg: number) => void;
  updateProductName: (productId: string, newName: string) => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  removeProduct: (productId: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
