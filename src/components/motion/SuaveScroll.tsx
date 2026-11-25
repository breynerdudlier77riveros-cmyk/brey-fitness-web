"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// ── Scroll suave con inercia (Lenis, solo la home) ──────────────────────────
// Suaviza la rueda del mouse en escritorio. En pantallas táctiles Lenis deja el
// scroll nativo (no se activa syncTouch: secuestrar el dedo se siente roto).
// Con movimiento reducido no se monta. Los anclas (#sistemas) respetan el
// scroll-margin-top del destino; los diálogos y menús scrollean nativos.
// Montado solo en la home a propósito: el resto del sitio (blog, biblioteca,
// calculadoras) tiene paneles con scroll propio y no gana nada con esto.
export default function SuaveScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      prevent: (nodo) => nodo.closest("[role='dialog'], [role='menu'], [data-vaul-drawer]") !== null,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
