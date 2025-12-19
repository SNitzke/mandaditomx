// Product images mapping - maps product names to their image imports
import bistecTaqueroImg from '@/assets/products/bistec-taquero.jpg';
import arracheraImg from '@/assets/products/arrachera.jpg';
import ribEyeImg from '@/assets/products/rib-eye.jpg';
import tBoneImg from '@/assets/products/t-bone.jpg';
import costillaCerdoImg from '@/assets/products/costilla-cerdo.jpg';
import longanizaImg from '@/assets/products/longaniza.jpg';
import cecinaImg from '@/assets/products/cecina.jpg';
import picanaImg from '@/assets/products/picana.jpg';
import molidaImg from '@/assets/products/molida.jpg';
import milanesaImg from '@/assets/products/milanesa.jpg';
import pastorImg from '@/assets/products/pastor.jpg';
import pechugaPolloImg from '@/assets/products/pechuga-pollo.jpg';
import mangoImg from '@/assets/products/mango.jpg';
import aguacateImg from '@/assets/products/aguacate.jpg';
import jitomateImg from '@/assets/products/jitomate.jpg';
import quesoOaxacaImg from '@/assets/products/queso-oaxaca.jpg';
import huevosImg from '@/assets/products/huevos.jpg';
import sirloinImg from '@/assets/products/sirloin.jpg';
import fresaImg from '@/assets/products/fresa.jpg';
import chorizoImg from '@/assets/products/chorizo.jpg';
import polloEnteroImg from '@/assets/products/pollo-entero.jpg';
import manchegoImg from '@/assets/products/manchego.jpg';

// Map product names (or partial names) to their images
export const productImageMap: Record<string, string> = {
  // Carnes Premium
  'Bistec Taquero': bistecTaqueroImg,
  'Bistec Picado': bistecTaqueroImg,
  'Bistec de Cerdo': bistecTaqueroImg,
  'Bistec Ternera': bistecTaqueroImg,
  
  // Arracheras
  'Arrachera de Res': arracheraImg,
  'Arrachera Nacional': arracheraImg,
  'Arrachera de Cerdo': arracheraImg,
  
  // Cortes Premium
  'Rib Eye': ribEyeImg,
  'T-Bone': tBoneImg,
  'Sirloin': sirloinImg,
  'Top Sirloin': sirloinImg,
  'New York (Centro de Cara)': sirloinImg,
  'Picaña': picanaImg,
  'Filete Cabrería Nacional': ribEyeImg,
  
  // Costillas
  'Costilla de Cerdo': costillaCerdoImg,
  'Costilla Curly': costillaCerdoImg,
  
  // Embutidos
  'Longaniza Taquera': longanizaImg,
  'Longaniza Especial': longanizaImg,
  'Chorizo Argentino': chorizoImg,
  'Chistorra': chorizoImg,
  
  // Cecina
  'Cecina Adobada': cecinaImg,
  'Cecina Selecta': cecinaImg,
  'Cecina de Yecapixtla': cecinaImg,
  
  // Molidas
  'Molida de Res': molidaImg,
  'Molida Mixta': molidaImg,
  'Suadero Molido': molidaImg,
  'Suadero de Primera': molidaImg,
  
  // Milanesas
  'Milanesa de Res': milanesaImg,
  'Milanesa de Cerdo': milanesaImg,
  'Milanesa de Pollo': milanesaImg,
  
  // Pastor
  'Pastor Abierto': pastorImg,
  'Pastor Preparado': pastorImg,
  
  // Otros cortes de cerdo
  'Maciza de Cerdo': costillaCerdoImg,
  'Codillo Fresco': costillaCerdoImg,
  'Chuleta Ahumada': costillaCerdoImg,
  
  // Otros
  'Falda de Res': arracheraImg,
  'Retazo de Res': molidaImg,
  'Birria': pastorImg,
  
  // Pollo
  'Pechuga Entera': pechugaPolloImg,
  'Pechuga Partida': pechugaPolloImg,
  'Muslo y Pierna': polloEnteroImg,
  'Pollo Completo': polloEnteroImg,
  
  // Frutas
  'Mango Manila': mangoImg,
  'Mango Petacón': mangoImg,
  'Mango Ataulfo Selecto': mangoImg,
  'Fresa Domo (450 gr)': fresaImg,
  'Zarzamora Domo (170 gr)': fresaImg,
  'Zarzamora': fresaImg,
  'Frambuesa Domo (170 gr)': fresaImg,
  
  // Verduras
  'Aguacate': aguacateImg,
  'Jitomate': jitomateImg,
  'Tomate': jitomateImg,
  
  // Quesos
  'Queso Oaxaca': quesoOaxacaImg,
  'Queso Asadero': quesoOaxacaImg,
  'Manchego Natural': manchegoImg,
  'Manchego Aceituna': manchegoImg,
  'Manchego Chipotle': manchegoImg,
  'Manchego Jalapeño': manchegoImg,
  'Manchego Epazote': manchegoImg,
  'Manchego Romero': manchegoImg,
  'Manchego Vino Tinto': manchegoImg,
  'Manchego Arándano': manchegoImg,
  'Manchego Nuez': manchegoImg,
  
  // Huevo
  'Cartón Huevo Semi Sucio 30pz': huevosImg,
  'Cartón Huevo Tradicional 30pz': huevosImg,
  'Cartón Huevo Alteño 30pz': huevosImg,
  'Cartón Huevo Selecto 30pz': huevosImg,
  'Cartón Huevo Supremo 30pz': huevosImg,
  'Cartón Huevo San Juan 30pz': huevosImg,
};

// Category fallback images
export const categoryFallbackImages: Record<string, string> = {
  'Frutas y Verduras': mangoImg,
  'Carnes y Proteínas': arracheraImg,
  'Pollo': pechugaPolloImg,
  'Producto Orgánico': quesoOaxacaImg,
  'Huevo': huevosImg,
  'Producto Importado': manchegoImg,
};

// Helper function to get product image
export const getProductImage = (productName: string, category: string): string | undefined => {
  // First try exact match
  if (productImageMap[productName]) {
    return productImageMap[productName];
  }
  
  // Return category fallback
  return categoryFallbackImages[category];
};
