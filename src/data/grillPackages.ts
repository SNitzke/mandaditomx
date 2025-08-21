import { GrillPackage } from '@/types/product';

export const grillPackages: GrillPackage[] = [
  {
    id: 'nortena',
    name: 'La Norteña',
    description: 'El auténtico sabor del norte mexicano con carnes premium y complementos tradicionales',
    image: '/src/assets/paquete-nortena.jpg',
    discount: {
      threshold: 3000, // 3kg
      percentage: 10
    },
    items: [
      // Carnes
      { productId: '91', name: 'Arrachera de Res', minWeight: 500, pricePerKg: 250, isComplement: false },
      { productId: '96', name: 'T-Bone', minWeight: 500, pricePerKg: 270, isComplement: false },
      { productId: '90', name: 'Chistorra', minWeight: 500, pricePerKg: 160, isComplement: false },
      { productId: '76', name: 'Longaniza Especial', minWeight: 500, pricePerKg: 110, isComplement: false },
      // Complementos
      { productId: '47', name: 'Tomate', minWeight: 500, pricePerKg: 30, isComplement: true },
      { productId: '53', name: 'Cebolla Blanca', minWeight: 500, pricePerKg: 20, isComplement: true },
      { productId: '49', name: 'Cilantro (Manojo 200 gr)', minWeight: 200, pricePerKg: 70, isComplement: true },
      { productId: '9', name: 'Limón', minWeight: 500, pricePerKg: 32, isComplement: true },
      { productId: '42', name: 'Aguacate', minWeight: 500, pricePerKg: 90, isComplement: true },
      { productId: '54', name: 'Chile Serrano', minWeight: 200, pricePerKg: 30, isComplement: true },
    ]
  },
  {
    id: 'argentino',
    name: 'Festín Argentino',
    description: 'La elegancia del asado argentino con cortes premium y acompañamientos selectos',
    image: '/src/assets/paquete-argentino.jpg',
    discount: {
      threshold: 3000,
      percentage: 10
    },
    items: [
      // Carnes
      { productId: '91', name: 'Arrachera de Res', minWeight: 500, pricePerKg: 250, isComplement: false },
      { productId: '95', name: 'Rib Eye', minWeight: 500, pricePerKg: 500, isComplement: false },
      { productId: '97', name: 'Sirloin', minWeight: 500, pricePerKg: 320, isComplement: false },
      { productId: '94', name: 'Chorizo Argentino', minWeight: 500, pricePerKg: 140, isComplement: false },
      // Complementos
      { productId: '57', name: 'Cabeza de Ajo', minWeight: 60, pricePerKg: 250, isComplement: true },
      { productId: '51', name: 'Papa', minWeight: 500, pricePerKg: 30, isComplement: true },
      { productId: '9', name: 'Limón', minWeight: 500, pricePerKg: 32, isComplement: true },
    ]
  },
  {
    id: 'vikingo',
    name: 'Furia Vikinga',
    description: 'Una fiesta épica con abundantes cortes de carne para los más valientes',
    image: '/src/assets/paquete-vikingo.jpg',
    discount: {
      threshold: 3000,
      percentage: 10
    },
    items: [
      // Carnes
      { productId: '72', name: 'Costilla de Cerdo', minWeight: 500, pricePerKg: 150, isComplement: false },
      { productId: '78', name: 'Chuleta Ahumada', minWeight: 500, pricePerKg: 125, isComplement: false },
      { productId: '65', name: 'Bistec Picado', minWeight: 500, pricePerKg: 140, isComplement: false },
      { productId: '99', name: 'Picaña', minWeight: 500, pricePerKg: 280, isComplement: false },
      { productId: '91', name: 'Arrachera de Res', minWeight: 500, pricePerKg: 250, isComplement: false },
      { productId: '96', name: 'T-Bone', minWeight: 500, pricePerKg: 270, isComplement: false },
      // Complementos
      { productId: '51', name: 'Papa', minWeight: 500, pricePerKg: 30, isComplement: true },
      { productId: '53', name: 'Cebolla Blanca', minWeight: 500, pricePerKg: 20, isComplement: true },
      { productId: '57', name: 'Cabeza de Ajo', minWeight: 60, pricePerKg: 250, isComplement: true },
    ]
  },
  {
    id: 'medieval',
    name: 'Banquete Medieval',
    description: 'Un festín digno de reyes con carnes tradicionales y acompañamientos clásicos',
    image: '/src/assets/paquete-medieval.jpg',
    discount: {
      threshold: 3000,
      percentage: 10
    },
    items: [
      // Carnes
      { productId: '71', name: 'Maciza de Cerdo', minWeight: 500, pricePerKg: 110, isComplement: false },
      { productId: '104', name: 'Pechuga Caliente', minWeight: 500, pricePerKg: 140, isComplement: false },
      { productId: '91', name: 'Arrachera de Res', minWeight: 500, pricePerKg: 250, isComplement: false },
      // Complementos
      { productId: '53', name: 'Cebolla Blanca', minWeight: 500, pricePerKg: 20, isComplement: true },
      { productId: '51', name: 'Papa', minWeight: 500, pricePerKg: 30, isComplement: true },
      { productId: '57', name: 'Cabeza de Ajo', minWeight: 60, pricePerKg: 250, isComplement: true },
    ]
  },
  {
    id: 'romano',
    name: 'Gusto Romano',
    description: 'La sofisticación romana con cortes refinados y hierbas mediterráneas',
    image: '/src/assets/paquete-romano.jpg',
    discount: {
      threshold: 3000,
      percentage: 10
    },
    items: [
      // Carnes
      { productId: '85', name: 'New York (Centro de Cara)', minWeight: 500, pricePerKg: 270, isComplement: false },
      { productId: '103', name: 'Pechuga Fría', minWeight: 500, pricePerKg: 130, isComplement: false },
      { productId: '86', name: 'Falda de Res', minWeight: 500, pricePerKg: 210, isComplement: false },
      // Complementos
      { productId: '57', name: 'Cabeza de Ajo', minWeight: 60, pricePerKg: 250, isComplement: true },
      { productId: '53', name: 'Cebolla Blanca', minWeight: 500, pricePerKg: 20, isComplement: true },
      { productId: '9', name: 'Limón', minWeight: 500, pricePerKg: 32, isComplement: true },
    ]
  }
];