
export interface Product {
  id: string;
  name: string;
  pricePerKg: number;
  category: string;
  minWeight: number; // en gramos
  unit?: 'piece'; // si se vende por pieza
  gramsPerPiece?: number; // peso aproximado de una pieza en gramos
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
    individualDiscount?: number; // descuento aplicado a este producto específico
  }>;
  totalPrice: number;
  totalDiscount?: number; // suma de todos los descuentos individuales
}

export interface PetFoodCartItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  type: 'dog' | 'cat';
  quantity: number;
}

export interface LastOrder {
  cart: CartItem[];
  packageCart: PackageCartItem[];
  petFoodCart: PetFoodCartItem[];
  customerName?: string;
  address?: string;
  paymentMethod?: 'cash' | 'card';
  date: string; // ISO
}

export interface CartContextType {
  products: Product[];
  petFoodProducts: import('@/data/petFoodProducts').PetFoodItem[];
  updatePetFoodPrice: (id: string, newPrice: number) => void;
  cart: CartItem[];
  packageCart: PackageCartItem[];
  petFoodCart: PetFoodCartItem[];
  lastOrder: LastOrder | null;
  addToCart: (product: Product, weight: number, ripeness?: 'inmadura' | 'medio-madura' | 'madura') => void;
  removeFromCart: (productId: string, weight: number) => void;
  updateWeight: (productId: string, oldWeight: number, newWeight: number) => void;
  addPackageToCart: (packageData: PackageCartItem) => void;
  removePackageFromCart: (packageId: string) => void;
  addPetFoodToCart: (item: PetFoodCartItem) => void;
  removePetFoodFromCart: (id: string) => void;
  clearCart: () => void;
  saveLastOrder: (data: Omit<LastOrder, 'date'>) => void;
  repeatLastOrder: () => void;
  clearLastOrder: () => void;
  updateProductPrice: (productId: string, newPricePerKg: number) => void;
  updateProductName: (productId: string, newName: string) => void;
  addProduct: (newProduct: Omit<Product, 'id'>) => void;
  removeProduct: (productId: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
