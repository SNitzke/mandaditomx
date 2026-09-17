
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import ProductMenu from '@/components/ProductMenu';
import GrillPackages from '@/components/GrillPackages';
import SeasonCalendar from '@/components/SeasonCalendar';
import ShoppingCartComponent from '@/components/ShoppingCart';
import AdminPanel from '@/components/AdminPanel';
import PetFood from '@/components/PetFood';
import Tortilleria from '@/components/Tortilleria';
import GutWell from '@/components/GutWell';
import RepeatOrderPrompt from '@/components/RepeatOrderPrompt';
import SmartOrder from '@/components/SmartOrder';
import mandaditoLogo from '@/assets/mandadito-logo.png';
import mandaditoIsotipo from '@/assets/mandadito-isotipo.png';
import { Clock, Phone, Package, Apple } from 'lucide-react';

const Index = () => {
  

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <h1 className="flex items-center min-w-0 m-0 p-0">
                  <img
                    src={mandaditoLogo}
                    alt="mandadito"
                    className="h-10 w-auto max-w-[190px] object-contain object-left md:h-14 md:max-w-[285px]"
                  />
                  <span className="sr-only">mandadito</span>
                </h1>
              </div>
              
              <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Entregas de Lunes a Viernes y Fines de Semana Parrilladas de 12:00 a 18:00</span>
                </div>
              </div>
              
              {/* Mobile contact info */}
              <div className="lg:hidden flex items-center text-xs text-gray-600">
                <Phone size={14} />
                <span className="ml-1">55 6425 9421</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
            <img
              src={mandaditoIsotipo}
              alt=""
              aria-hidden="true"
              className="mx-auto mb-4 h-20 w-20 rounded-full bg-white/95 object-contain p-2 shadow-lg md:h-24 md:w-24"
            />
            <h2 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight animate-fade-in-up">
              🥬 ¡Frescura Premium <span className="text-yellow-300">a Tu Mesa!</span>
            </h2>
            <p className="text-base md:text-lg mb-8 opacity-90 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              Pide en minutos, recibe en tu puerta.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => scrollToSection('productos-frescos')}
                className="flex items-center justify-center gap-2 bg-yellow-400 text-orange-700 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Apple size={22} />
                Ver Productos
              </button>
              <button
                onClick={() => scrollToSection('paquetes-parrilleros')}
                className="flex items-center justify-center gap-2 bg-white/90 text-orange-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Package size={22} />
                Paquetes Parrilleros
              </button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="py-6 md:py-12">
          {/* Smart Order (voz y foto) */}
          <section className="mb-8">
            <SmartOrder />
          </section>

          {/* Season Calendar */}
          <section className="mb-8">
            <SeasonCalendar />
          </section>


          {/* Product Menu */}
          <section id="productos-frescos">
            <ProductMenu />
          </section>
        </main>

        {/* Tortillería */}
        <section id="tortilleria" className="py-6 md:py-12 bg-gradient-to-br from-yellow-50 to-orange-50">
          <Tortilleria />
        </section>

        {/* GutWell */}
        <section id="gutwell" className="py-6 md:py-12">
          <GutWell />
        </section>

        {/* Grill Packages Section */}
        <section id="paquetes-parrilleros" className="py-6 md:py-12 bg-gradient-to-br from-orange-25 to-red-25">
          <GrillPackages />
        </section>

        {/* Pet Food Section */}
        <section id="alimento-mascotas" className="py-6 md:py-12">
          <PetFood />
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
                  <p>Envíos Lunes a Viernes</p>
                  <p>10:00 AM - 14:00 PM</p>
                  <p>Solicitar con 1 día de anticipación</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Sobre Nosotros</h3>
                <p className="text-gray-300">
                  Alimento de excelente calidad y los mejores ingredientes frescos.
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
        <RepeatOrderPrompt />

      </div>
    </CartProvider>
  );
};

export default Index;
