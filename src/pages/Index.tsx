
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import ProductMenu from '@/components/ProductMenu';
import ShoppingCartComponent from '@/components/ShoppingCart';
import AdminPanel from '@/components/AdminPanel';
import { Utensils, Clock, MapPin, Phone } from 'lucide-react';

const Index = () => {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <header className="bg-white shadow-md sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white p-2 rounded-full">
                  <Utensils size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Sabores Caseros</h1>
                  <p className="text-sm text-gray-600">Comida deliciosa a domicilio</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>Lun-Dom 9:00-22:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>55 6425 9421</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ¡Bienvenido a Sabores Caseros!
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Los mejores sabores de la comida casera, directo a tu mesa
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 text-lg">
              <div className="flex items-center justify-center gap-2">
                <MapPin size={20} />
                <span>Entrega rápida</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Utensils size={20} />
                <span>Ingredientes frescos</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock size={20} />
                <span>Servicio 7 días</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="py-12">
          <ProductMenu />
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
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
                  <p>Lunes a Domingo</p>
                  <p>9:00 AM - 10:00 PM</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Sobre Nosotros</h3>
                <p className="text-gray-300">
                  Comida casera preparada con amor y los mejores ingredientes frescos.
                </p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
              <p>&copy; 2024 Sabores Caseros. Todos los derechos reservados.</p>
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
