
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

export interface GrillPackageItem {
  productId: string;
  name: string;
  minWeight: number;
  pricePerKg: number;
  isComplement?: boolean; // true si es complemento, false si es carne
}

export interface GrillPackage {
  id: string;
  name: string;
  description: string;
  image: string;
  items: GrillPackageItem[];
  discount: {
    threshold: number; // peso mínimo en gramos para aplicar descuento
    percentage: number; // porcentaje de descuento
  };
}

export interface PackageCartItem {
  packageId: string;
  packageName: string;
  items: Array<{
    productId: string;
    name: string;
    weight: number;
    pricePerKg: number;
    isComplement: boolean;
    ripeness?: 'inmadura' | 'medio-madura' | 'madura';
  }>;
  totalPrice: number;
  meatDiscount?: number; // descuento aplicado a las carnes
}

export interface CartContextType {
  products: Product[];
  cart: CartItem[];
  packageCart: PackageCartItem[];
  addToCart: (product: Product, weight: number, ripeness?: 'inmadura' | 'medio-madura' | 'madura') => void;
  removeFromCart: (productId: string, weight: number) => void;
  updateWeight: (productId: string, oldWeight: number, newWeight: number) => void;
  addPackageToCart: (packageData: PackageCartItem) => void;
  removePackageFromCart: (packageId: string) => void;
  clearCart: () => void;
  updateProductPrice: (productId: string, newPricePerKg: number) => void;
  updateProductName: (productId: string, newName: string) => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  removeProduct: (productId: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
