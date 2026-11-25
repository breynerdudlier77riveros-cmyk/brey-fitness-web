"use client";

import { useEffect } from "react";

// ── Disparador de los revelados al hacer scroll ─────────────────────────────
// Pone .is-in a cada [data-reveal] la primera vez que entra en pantalla. Las
// animaciones viven en globals.css ("Capa de movimiento"); este componente no
// anima nada, solo avisa. Un MutationObserver recoge lo que llega después
// (navegación entre páginas, contenido en streaming) sin depender de la ruta.
// .revelado-listo en <html> apaga el failsafe CSS que lo mostraría todo a los
// 3 s. Se pone en la primera respuesta del IntersectionObserver (que siempre
// llega al observar), no al montar: si el observador no responde, el failsafe
// sigue activo y nada se queda escondido.

const SELECTOR = "[data-reveal]:not(.is-in)";

export default function Revelado() {
  useEffect(() => {
    const raiz = document.documentElement;

    const observados = new WeakSet<Element>();
    const visor = new IntersectionObserver(
      (entradas) => {
        raiz.classList.add("revelado-listo");
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-in");
            visor.unobserve(entrada.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );

    const registrar = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (observados.has(el)) return;
        observados.add(el);
        visor.observe(el);
      });
    };
    registrar();

    let pendiente = 0;
    const cambios = new MutationObserver(() => {
      if (pendiente) return;
      pendiente = requestAnimationFrame(() => {
        pendiente = 0;
        registrar();
      });
    });
    cambios.observe(document.body, { childList: true, subtree: true });

    return () => {
      cambios.disconnect();
      visor.disconnect();
      cancelAnimationFrame(pendiente);
      raiz.classList.remove("revelado-listo");
    };
  }, []);

  return null;
}
