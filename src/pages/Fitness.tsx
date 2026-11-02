import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Dumbbell, Phone } from "lucide-react";
import PlanFitness from "@/components/PlanFitness";
import mandaditoLogo from "@/assets/mandadito-logo.png";

const TITLE = "Plan Fitness — Arma tu plan de alimentación | mandadito";
const DESC = "Calcula tus calorías, proteína, carbohidratos y grasas según cómo entrenas, y arma tu despensa de la semana con productos frescos de mandadito.";

const Fitness = () => {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    document.title = TITLE;
    meta?.setAttribute("content", DESC);
    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center min-w-0" aria-label="Volver al inicio de mandadito">
              <img
                src={mandaditoLogo}
                alt="mandadito"
                className="h-10 w-auto max-w-[170px] object-contain object-left md:h-14 md:max-w-[285px]"
              />
            </Link>
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-bold text-primary transition hover:bg-primary/10"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Volver a la tienda</span>
              <span className="sm:hidden">Tienda</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <PlanFitness />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 text-center">
          <p className="flex items-center justify-center gap-2 text-gray-300">
            <Phone size={16} /> +52 55 6425 9421
          </p>
          <p className="mt-3 text-xs text-gray-400">
            <Dumbbell size={12} className="mr-1 inline" /> Herramienta orientativa: no sustituye la consulta con un nutriólogo.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Fitness;
