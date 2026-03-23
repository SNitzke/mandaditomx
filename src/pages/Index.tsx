
import React, { useState } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import ProductMenu from '@/components/ProductMenu';
import GrillPackages from '@/components/GrillPackages';
import SeasonCalendar from '@/components/SeasonCalendar';
import ShoppingCartComponent from '@/components/ShoppingCart';
import AdminPanel from '@/components/AdminPanel';
import PetFood from '@/components/PetFood';
import { Utensils, Clock, MapPin, Phone, ShoppingBag, Package, Apple, PawPrint } from 'lucide-react';

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
              <div className="flex items-center gap-2 md:gap-3">
                <div className="bg-orange-500 text-white p-1.5 md:p-2 rounded-full">
                  <Utensils size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">Mi Super</h1>
                  <p className="text-xs md:text-sm text-gray-600">Del proveedor a tu mesa</p>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Entregas Miércoles, Jueves y Fines de Semana de 12:00 a 18:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>55 6425 9421</span>
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
        <section className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white py-12 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAzLTRzMyAyIDMgNGMwIDItMiA0LTMgNHMtMy0yLTMtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          <div className="max-w-6xl mx-auto px-4 md:px-6 text-center relative z-10">
            <div className="animate-fade-in-up">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 leading-tight">
                🥬 Frescura Premium<br />
                <span className="text-yellow-300">¡Directo a Tu Mesa!</span>
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl mb-8 md:mb-10 font-semibold opacity-95">
                Productos de excelente calidad
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 text-base md:text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-105">
                <MapPin size={20} className="md:w-6 md:h-6" />
                <span className="font-semibold">Entrega Express</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-105">
                <Utensils size={20} className="md:w-6 md:h-6" />
                <span className="font-semibold">Excelente calidad</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-105">
                <Clock size={20} className="md:w-6 md:h-6" />
                <span className="font-semibold">Siempre Fresco</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={() => scrollToSection('productos-frescos')}
                className="flex items-center justify-center gap-2 bg-yellow-400 text-orange-700 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,0,0.4)] transition-all duration-300 hover:scale-105"
              >
                <Apple size={20} className="md:w-6 md:h-6" />
                Productos Frescos
              </button>
              <button
                onClick={() => scrollToSection('paquetes-parrilleros')}
                className="flex items-center justify-center gap-2 bg-white/90 text-orange-600 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105"
              >
                <Package size={20} className="md:w-6 md:h-6" />
                Paquetes Parrilleros
              </button>
              <button
                onClick={() => scrollToSection('alimento-mascotas')}
                className="flex items-center justify-center gap-2 bg-amber-400 text-amber-800 px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg shadow-2xl hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-105"
              >
                <PawPrint size={20} className="md:w-6 md:h-6" />
                Alimento Mascotas
              </button>
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
          <section id="productos-frescos">
            <ProductMenu />
          </section>
        </main>

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

        {/* Order Dialog */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-center mb-6">
                ¿Qué deseas ordenar?
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 md:gap-6">
              {/* Productos Frescos */}
              <button
                onClick={() => scrollToSection('productos-frescos')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] border-2 border-green-200 hover:border-green-400"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Apple size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Productos Frescos</h3>
                    <p className="text-sm text-gray-600">Frutas, verduras, carnes, pollo, huevo y más</p>
                  </div>
                  <div className="text-green-500 group-hover:translate-x-2 transition-transform">→</div>
                </div>
              </button>

              {/* Paquetes Parrilleros */}
              <button
                onClick={() => scrollToSection('paquetes-parrilleros')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] border-2 border-orange-200 hover:border-orange-400"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-orange-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                    <Package size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Paquetes Parrilleros</h3>
                    <p className="text-sm text-gray-600">Paquetes especiales para carne asada con descuento</p>
                  </div>
                  <div className="text-orange-500 group-hover:translate-x-2 transition-transform">→</div>
                </div>
              </button>

              {/* Alimento para Mascotas */}
              <button
                onClick={() => scrollToSection('alimento-mascotas')}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] border-2 border-amber-200 hover:border-amber-400"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-amber-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                    <PawPrint size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Alimento para Mascotas</h3>
                    <p className="text-sm text-gray-600">Las mejores marcas para perros y gatos</p>
                  </div>
                  <div className="text-amber-500 group-hover:translate-x-2 transition-transform">→</div>
                </div>
              </button>

              {/* Ver Todo */}
              <button
                onClick={() => {
                  setIsOrderDialogOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02] border-2 border-yellow-200 hover:border-yellow-400"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                    <ShoppingBag size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">Ver Todo el Menú</h3>
                    <p className="text-sm text-gray-600">Explora todos nuestros productos disponibles</p>
                  </div>
                  <div className="text-yellow-500 group-hover:translate-x-2 transition-transform">→</div>
                </div>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CartProvider>
  );
};

export default Index;
