"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  /** Texto final tal cual se publica: "+6", "16–24", "30". Cada número cuenta por separado. */
  valor: string;
  /** Milisegundos de espera tras entrar en pantalla. */
  retardo?: number;
  className?: string;
}

const DURACION = 1600;
const esNumero = (s: string) => /^\d+$/.test(s);

// Contador de cifras reales. El HTML del servidor trae el valor final (sin JS,
// buscadores y movimiento reducido ven la cifra quieta). En el cliente pinta
// el texto directo en el nodo, sin estado de React: cero re-renders por cuadro.
// El lector de pantalla lee solo el valor final (sr-only).
export default function Cifra({ valor, retardo = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const partes = valor.split(/(\d+)/);
    const pintar = (p: number) => {
      el.textContent = partes.map((s) => (esNumero(s) ? String(Math.round(Number(s) * p)) : s)).join("");
    };
    pintar(0);

    let cuadro = 0;
    let espera = 0;
    const animar = () => {
      const inicio = performance.now();
      const paso = (ahora: number) => {
        const x = Math.min((ahora - inicio) / DURACION, 1);
        pintar(x === 1 ? 1 : 1 - Math.pow(2, -10 * x));
        if (x < 1) cuadro = requestAnimationFrame(paso);
      };
      cuadro = requestAnimationFrame(paso);
    };

    const visor = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return;
      visor.disconnect();
      espera = window.setTimeout(animar, retardo);
    });
    visor.observe(el);

    return () => {
      visor.disconnect();
      clearTimeout(espera);
      cancelAnimationFrame(cuadro);
      el.textContent = valor;
    };
  }, [valor, retardo]);

  return (
    <>
      <span ref={ref} aria-hidden className={cn("tabular-nums", className)}>
        {valor}
      </span>
      <span className="sr-only">{valor}</span>
    </>
  );
}
