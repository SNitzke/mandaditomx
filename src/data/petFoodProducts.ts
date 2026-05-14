export interface PetFoodItem {
  id: string;
  name: string;
  price: number;
  weight: string;
  type: 'dog' | 'cat';
}

export const initialPetFoodProducts: PetFoodItem[] = [
  { id: 'pet-1', name: 'Nupec Adulto R. Grande', price: 1850, weight: '20 kg', type: 'dog' },
  { id: 'pet-2', name: 'Beneful Adulto', price: 1320, weight: '20 kg', type: 'dog' },
  { id: 'pet-3', name: 'Dog Chow Cachorro', price: 1015, weight: '20 kg', type: 'dog' },
  { id: 'pet-4', name: 'Dog Chow Adulto', price: 1100, weight: '25 kg', type: 'dog' },
  { id: 'pet-5', name: 'Ganador Adulto', price: 1100, weight: '25 kg', type: 'dog' },
  { id: 'pet-6', name: 'Ganador Cachorro', price: 1040, weight: '20 kg', type: 'dog' },
  { id: 'pet-7', name: 'Ganador Premium Adulto', price: 1190, weight: '20 kg', type: 'dog' },
  { id: 'pet-8', name: 'Ganador Premium Cachorro', price: 1230, weight: '20 kg', type: 'dog' },
  { id: 'pet-9', name: 'Pedigree Adulto', price: 1000, weight: '20 kg', type: 'dog' },
  { id: 'pet-10', name: 'Pedigree Puppy', price: 1100, weight: '20 kg', type: 'dog' },
  { id: 'pet-11', name: 'ProPlan Adulto', price: 1600, weight: '13 kg', type: 'dog' },
  { id: 'pet-12', name: 'ProPlan Cachorro', price: 1700, weight: '13 kg', type: 'dog' },
  { id: 'pet-13', name: 'Hi Dog Cachorro', price: 700, weight: '20 kg', type: 'dog' },
  { id: 'pet-14', name: 'Hi Dog Adulto', price: 800, weight: '25 kg', type: 'dog' },
  { id: 'pet-15', name: 'Cat Chow', price: 1120, weight: '20 kg', type: 'cat' },
  { id: 'pet-16', name: 'Minino', price: 800, weight: '15 kg', type: 'cat' },
  { id: 'pet-17', name: 'Minino Plus', price: 650, weight: '10 kg', type: 'cat' },
  { id: 'pet-18', name: 'Whiskas', price: 1000, weight: '20 kg', type: 'cat' },
  { id: 'pet-19', name: 'Gatina', price: 700, weight: '15 kg', type: 'cat' },
];
