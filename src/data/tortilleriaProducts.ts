export interface TortilleriaVariant {
  id: string;
  label: string;
  price: number;
}

export interface TortilleriaProduct {
  id: string;
  name: string;
  emoji: string;
  description: string;
  variants: TortilleriaVariant[];
}

export const tortilleriaProducts: TortilleriaProduct[] = [
  {
    id: 'tostadas',
    name: 'Tostadas',
    emoji: '🌽',
    description: 'Doradas y crujientes, listas para tus antojos.',
    variants: [
      { id: '100pz', label: '100 piezas', price: 120 },
      { id: '50pz', label: '50 piezas', price: 70 },
      { id: '28pz', label: '28 piezas', price: 25 },
    ],
  },
  {
    id: 'totopos',
    name: 'Totopos para Chilaquiles',
    emoji: '🥘',
    description: 'El punto perfecto para chilaquiles rojos o verdes.',
    variants: [{ id: '400g', label: '400 g', price: 50 }],
  },
  {
    id: 'nachos',
    name: 'Nachos',
    emoji: '🧀',
    description: 'Ideales para botanear con queso y guacamole.',
    variants: [{ id: '400g', label: '400 g', price: 50 }],
  },
  {
    id: 'maiz-pozole',
    name: 'Maíz precocido para Pozole',
    emoji: '🍲',
    description: 'Listo para tu pozole casero, sin complicaciones.',
    variants: [{ id: '800g', label: '800 g', price: 40 }],
  },
  {
    id: 'tortilla-harina-natural',
    name: 'Tortilla de Harina Natural',
    emoji: '🫓',
    description: 'Suaves y recién hechas, sabor tradicional.',
    variants: [
      { id: '1kg', label: '1 kg', price: 50 },
      { id: '500g', label: '500 g', price: 35 },
    ],
  },
  {
    id: 'tortilla-harina-mantequilla',
    name: 'Tortilla de Harina Sabor Mantequilla',
    emoji: '🧈',
    description: 'Extra suaves con un delicado sabor a mantequilla.',
    variants: [
      { id: '1kg', label: '1 kg', price: 50 },
      { id: '500g', label: '500 g', price: 35 },
    ],
  },
  {
    id: 'tortilla-harina-integral',
    name: 'Tortilla de Harina Integral',
    emoji: '🌾',
    description: 'Con más fibra, para un día a día más ligero.',
    variants: [
      { id: '1kg', label: '1 kg', price: 50 },
      { id: '500g', label: '500 g', price: 35 },
    ],
  },
  {
    id: 'tortilla-harina-burritos',
    name: 'Tortilla de Harina para Burritos',
    emoji: '🌯',
    description: 'Grandes y resistentes, perfectas para burritos.',
    variants: [{ id: '1kg', label: '1 kg', price: 50 }],
  },
];
