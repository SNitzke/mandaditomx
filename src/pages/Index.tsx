
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import ProductMenu from '@/components/ProductMenu';
import GrillPackages from '@/components/GrillPackages';
import SeasonCalendar from '@/components/SeasonCalendar';
import ShoppingCartComponent from '@/components/ShoppingCart';
import AdminPanel from '@/components/AdminPanel';
import { Utensils, Clock, MapPin, Phone } from 'lucide-react';

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-orange-500 text-white p-1.5 md:p-2 rounded-full">
                  <Utensils size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">Mi Super</h1>
                  <p className="text-xs md:text-sm text-gray-600">Productos 100% Orgánicos</p>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Lun-Dom 9:00-22:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>55 6425 9421 / 55 4381 4332</span>
                </div>
              </div>
              
              {/* Mobile contact info */}
              <div className="lg:hidden flex items-center text-xs text-gray-600">
                <Phone size={14} />
                <span className="ml-1">55 6425 9421 / 55 4381 4332</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8 md:py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              ¡Bienvenido a Mi Super!
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-90">
              Los mejores productos orgánicos, directo a tu domicilio
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 text-sm md:text-lg">
              <div className="flex items-center justify-center gap-2">
                <MapPin size={16} className="md:w-5 md:h-5" />
                <span>Entrega rápida</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Utensils size={16} className="md:w-5 md:h-5" />
                <span>Producto 100% natural</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock size={16} className="md:w-5 md:h-5" />
                <span>Servicio 7 días</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="py-6 md:py-12">
          {/* Season Calendar */}
          <section className="mb-8">
            <SeasonCalendar />
          </section>

          {/* Product Menu */}
          <section>
            <ProductMenu />
          </section>
        </main>

        {/* Grill Packages Section */}
        <section className="py-6 md:py-12 bg-gradient-to-br from-orange-25 to-red-25">
          <GrillPackages />
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 md:py-8">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">
              <div>
                <h3 className="text-lg font-semibold mb-3">Contacto</h3>
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center justify-center md:justify-start gap-2">
                    <Phone size={16} />
                    +52 55 6425 9421
                  </p>
                  <p>WhatsApp disponible</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Horarios</h3>
                <div className="text-gray-300">
                  <p>Envíos Miércoles y Jueves</p>
                  <p>12:00 AM - 10:00 PM</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Sobre Nosotros</h3>
                <p className="text-gray-300">
                  Alimento 100% natural y los mejores ingredientes frescos.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-6 md:mt-8 pt-4 md:pt-6 text-center text-gray-400">
              <p>&copy; 2025 Mi Super. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>

        {/* Components */}
        <ShoppingCartComponent />
        <AdminPanel />
      </div>
    </CartProvider>
  );
};

export default Index;
