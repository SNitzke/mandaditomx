import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Página no encontrada (404) — Pedido Súper</title>
        <meta name="description" content="La página que buscas no existe. Vuelve al inicio para hacer tu pedido de frutas, verduras y carnes a domicilio." />
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href="https://sabroso-pedido-rapido.lovable.app/" />
        <meta property="og:title" content="Página no encontrada (404) — Pedido Súper" />
        <meta property="og:description" content="La página que buscas no existe. Vuelve al inicio para hacer tu pedido." />
        <meta property="og:url" content={`https://sabroso-pedido-rapido.lovable.app${location.pathname}`} />
      </Helmet>
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-foreground">404 — Página no encontrada</h1>
          <p className="text-xl text-muted-foreground mb-4">La página que buscas no existe.</p>
          <a href="/" className="text-primary hover:underline">
            Volver al inicio
          </a>
        </div>
      </main>
    </>
  );
};

export default NotFound;
