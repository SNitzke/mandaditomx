export interface SeasonalProduct {
  name: string;
  months: number[]; // 0-11 (enero-diciembre)
  type: 'fruta' | 'verdura';
  color: string;
}

export const seasonalProducts: SeasonalProduct[] = [
  // Frutas
  { name: 'Mango', months: [3, 4, 5, 6, 7], type: 'fruta', color: 'bg-yellow-400' },
  { name: 'Guayaba', months: [9, 10, 11, 0, 1], type: 'fruta', color: 'bg-pink-400' },
  { name: 'Papaya', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'fruta', color: 'bg-orange-400' },
  { name: 'Plátano', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'fruta', color: 'bg-yellow-300' },
  { name: 'Melón', months: [4, 5, 6, 7, 8], type: 'fruta', color: 'bg-green-300' },
  { name: 'Limón', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'fruta', color: 'bg-lime-400' },
  { name: 'Sandía', months: [4, 5, 6, 7, 8, 9], type: 'fruta', color: 'bg-red-400' },
  { name: 'Uva', months: [7, 8, 9, 10], type: 'fruta', color: 'bg-purple-400' },
  { name: 'Manzana', months: [8, 9, 10, 11, 0, 1], type: 'fruta', color: 'bg-red-300' },
  { name: 'Pera', months: [8, 9, 10, 11], type: 'fruta', color: 'bg-yellow-200' },
  { name: 'Durazno', months: [5, 6, 7, 8], type: 'fruta', color: 'bg-peach-400' },
  { name: 'Tuna', months: [6, 7, 8, 9], type: 'fruta', color: 'bg-pink-300' },
  { name: 'Fresa', months: [11, 0, 1, 2, 3], type: 'fruta', color: 'bg-red-500' },
  { name: 'Ciruela', months: [5, 6, 7, 8], type: 'fruta', color: 'bg-purple-500' },
  { name: 'Naranja', months: [10, 11, 0, 1, 2], type: 'fruta', color: 'bg-orange-500' },
  { name: 'Mandarina', months: [10, 11, 0, 1, 2], type: 'fruta', color: 'bg-orange-300' },
  { name: 'Zarzamora', months: [5, 6, 7, 8, 9], type: 'fruta', color: 'bg-purple-600' },
  { name: 'Frambuesa', months: [5, 6, 7, 8, 9], type: 'fruta', color: 'bg-red-600' },
  { name: 'Carambola', months: [9, 10, 11, 0], type: 'fruta', color: 'bg-yellow-500' },
  { name: 'Kiwi', months: [10, 11, 0, 1, 2, 3], type: 'fruta', color: 'bg-green-500' },
  { name: 'Lichi', months: [5, 6, 7], type: 'fruta', color: 'bg-pink-500' },
  { name: 'Toronja', months: [9, 10, 11, 0, 1, 2], type: 'fruta', color: 'bg-pink-200' },
  { name: 'Piña', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'fruta', color: 'bg-yellow-600' },
  
  // Verduras
  { name: 'Chile Poblano', months: [6, 7, 8, 9], type: 'verdura', color: 'bg-green-600' },
  { name: 'Betabel', months: [10, 11, 0, 1, 2], type: 'verdura', color: 'bg-red-700' },
  { name: 'Ejotes', months: [5, 6, 7, 8, 9], type: 'verdura', color: 'bg-green-400' },
  { name: 'Espinaca', months: [9, 10, 11, 0, 1, 2, 3], type: 'verdura', color: 'bg-green-700' },
  { name: 'Pepino', months: [4, 5, 6, 7, 8], type: 'verdura', color: 'bg-green-200' },
  { name: 'Jícama', months: [10, 11, 0, 1, 2], type: 'verdura', color: 'bg-amber-200' },
  { name: 'Camote', months: [9, 10, 11, 0], type: 'verdura', color: 'bg-orange-600' },
  { name: 'Pimiento', months: [5, 6, 7, 8, 9], type: 'verdura', color: 'bg-red-500' },
  { name: 'Zanahoria', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-orange-500' },
  { name: 'Jitomate', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-red-600' },
  { name: 'Aguacate', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-green-800' },
  { name: 'Brócoli', months: [10, 11, 0, 1, 2, 3, 4], type: 'verdura', color: 'bg-green-500' },
  { name: 'Nopal', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-green-600' },
  { name: 'Lechuga', months: [9, 10, 11, 0, 1, 2, 3], type: 'verdura', color: 'bg-green-300' },
  { name: 'Tomate', months: [5, 6, 7, 8, 9], type: 'verdura', color: 'bg-green-400' },
  { name: 'Perejil', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-green-600' },
  { name: 'Cilantro', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-green-500' },
  { name: 'Apio', months: [9, 10, 11, 0, 1, 2, 3], type: 'verdura', color: 'bg-green-400' },
  { name: 'Papa', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-amber-600' },
  { name: 'Cebolla', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-purple-300' },
  { name: 'Chile Serrano', months: [5, 6, 7, 8, 9], type: 'verdura', color: 'bg-green-600' },
  { name: 'Chile Jalapeño', months: [5, 6, 7, 8, 9], type: 'verdura', color: 'bg-green-500' },
  { name: 'Ajo', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], type: 'verdura', color: 'bg-gray-300' },
  { name: 'Espárrago', months: [2, 3, 4, 5], type: 'verdura', color: 'bg-green-400' },
  { name: 'Coliflor', months: [10, 11, 0, 1, 2, 3], type: 'verdura', color: 'bg-gray-200' },
  { name: 'Chayote', months: [7, 8, 9, 10, 11], type: 'verdura', color: 'bg-green-300' },
  { name: 'Calabaza', months: [8, 9, 10, 11], type: 'verdura', color: 'bg-orange-400' },
];

export const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const isInSeason = (productName: string, month: number): boolean => {
  const product = seasonalProducts.find(p => 
    productName.toLowerCase().includes(p.name.toLowerCase()) || 
    p.name.toLowerCase().includes(productName.toLowerCase())
  );
  return product ? product.months.includes(month) : true; // Si no se encuentra, asumimos que está disponible
};

export const getSeasonMessage = (productName: string, month: number): string => {
  if (isInSeason(productName, month)) {
    return "¡En temporada!";
  } else {
    return "No es temporada de este producto";
  }
};