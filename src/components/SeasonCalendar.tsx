import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { seasonalProducts, months, type SeasonalProduct } from '@/data/seasonalProducts';
import { CalendarDays, Leaf, Apple } from 'lucide-react';

const SeasonCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedMonth = selectedDate.getMonth();

  const getProductsInSeason = (month: number, type?: 'fruta' | 'verdura'): SeasonalProduct[] => {
    return seasonalProducts.filter(product => 
      product.months.includes(month) && 
      (!type || product.type === type)
    );
  };

  const getCurrentSeasonProducts = (type?: 'fruta' | 'verdura') => {
    return getProductsInSeason(selectedMonth, type);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <CalendarDays className="w-8 h-8 text-primary" />
          Calendario de Temporadas
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Conoce qué frutas y verduras están en su mejor momento
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Selecciona un mes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="pointer-events-auto border rounded-md"
            />
          </CardContent>
        </Card>

        {/* Productos de temporada */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Productos de temporada en {months[selectedMonth]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="todos" className="text-sm">Todos</TabsTrigger>
                <TabsTrigger value="frutas" className="text-sm flex items-center gap-1">
                  <Apple className="w-4 h-4" />
                  Frutas
                </TabsTrigger>
                <TabsTrigger value="verduras" className="text-sm flex items-center gap-1">
                  <Leaf className="w-4 h-4" />
                  Verduras
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="todos" className="mt-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {getCurrentSeasonProducts().map((product) => (
                      <Badge 
                        key={product.name} 
                        variant="secondary"
                        className={`${product.color} text-white border-0 hover:opacity-80 transition-opacity`}
                      >
                        {product.type === 'fruta' ? '🍎' : '🥬'} {product.name}
                      </Badge>
                    ))}
                  </div>
                  {getCurrentSeasonProducts().length === 0 && (
                    <p className="text-muted-foreground text-sm italic">
                      No hay productos específicos registrados para este mes
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="frutas" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {getCurrentSeasonProducts('fruta').map((product) => (
                    <Badge 
                      key={product.name} 
                      variant="secondary"
                      className={`${product.color} text-white border-0 hover:opacity-80 transition-opacity`}
                    >
                      🍎 {product.name}
                    </Badge>
                  ))}
                </div>
                {getCurrentSeasonProducts('fruta').length === 0 && (
                  <p className="text-muted-foreground text-sm italic">
                    No hay frutas específicas registradas para este mes
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="verduras" className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {getCurrentSeasonProducts('verdura').map((product) => (
                    <Badge 
                      key={product.name} 
                      variant="secondary"
                      className={`${product.color} text-white border-0 hover:opacity-80 transition-opacity`}
                    >
                      🥬 {product.name}
                    </Badge>
                  ))}
                </div>
                {getCurrentSeasonProducts('verdura').length === 0 && (
                  <p className="text-muted-foreground text-sm italic">
                    No hay verduras específicas registradas para este mes
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Información sobre temporadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Ventajas de consumir productos de temporada:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Mejor sabor y calidad</li>
                <li>Precios más accesibles</li>
                <li>Mayor frescura</li>
                <li>Apoyo al productor local</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Nota importante:</h4>
              <p>
                Algunos productos están disponibles todo el año gracias a técnicas de cultivo modernas, 
                pero su mejor momento de sabor y precio es durante su temporada natural.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonCalendar;