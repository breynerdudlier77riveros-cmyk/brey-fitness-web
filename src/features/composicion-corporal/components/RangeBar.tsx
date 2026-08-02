"use client";

import { motion } from "motion/react";

// ── Sistema de barras (BCS Design Handbook 10) ─────────────────────────────
// Pista 10px, marcador circular 16px con borde blanco 2px, 2-4 zonas de
// color, ticks solo en límites entre zonas, etiqueta de zona oculta en
// mobile. Marcador se desliza desde el extremo izquierdo en 500ms ease-out
// al montar (MotionConfig reducedMotion="user", ya centralizado en
// layout.tsx, cubre prefers-reduced-motion sin guard propio aquí).
// role="img" con aria-label — NUNCA role="slider" (no es editable, BCS
// Design Handbook 15).
//
// Inspirada en analizadores comerciales (concepto pista+zonas+marcador)
// reconstruida con tokens propios — nunca copia colores/proporciones de
// una marca de dispositivo (BCSD-ADR-03).

export interface Zona {
  hasta: number; // límite superior de la zona (la última zona cubre hasta `max`)
  etiqueta: string;
  color: string; // clase Tailwind de fondo, ej. "bg-sky-500"
}

interface Props {
  valor: number;
  min: number;
  max: number;
  zonas: Zona[];
  unidad?: string;
}

export default function RangeBar({ valor, min, max, zonas, unidad }: Props) {
  const clamped = Math.min(Math.max(valor, min), max);
  const pct = ((clamped - min) / (max - min)) * 100;
  const ariaLabel = `Posición actual: ${valor.toFixed(1)}${unidad ? ` ${unidad}` : ""} dentro del rango ${min}–${max}${unidad ? ` ${unidad}` : ""}`;

  return (
    <div className="w-full">
      <div role="img" aria-label={ariaLabel} className="relative h-2.5 rounded-full overflow-visible flex">
        {zonas.map((zona, i) => {
          const desde = i === 0 ? min : zonas[i - 1].hasta;
          const anchoPct = ((Math.min(zona.hasta, max) - desde) / (max - min)) * 100;
          return (
            <div
              key={zona.etiqueta}
              style={{ width: `${anchoPct}%` }}
              className={`h-full ${zona.color} ${i === 0 ? "rounded-l-full" : ""} ${i === zonas.length - 1 ? "rounded-r-full" : ""}`}
            />
          );
        })}
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="print-marcador absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-950 shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
          aria-hidden="true"
        />
      </div>
      <div className="hidden sm:flex mt-1.5">
        {zonas.map((zona, i) => {
          const desde = i === 0 ? min : zonas[i - 1].hasta;
          const anchoPct = ((Math.min(zona.hasta, max) - desde) / (max - min)) * 100;
          return (
            <p key={zona.etiqueta} style={{ width: `${anchoPct}%` }} className="text-[10px] text-white/40 text-center truncate px-0.5">
              {zona.etiqueta}
            </p>
          );
        })}
      </div>
    </div>
  );
}
