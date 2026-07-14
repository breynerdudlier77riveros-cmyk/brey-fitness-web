"use client";

import { useEffect, useState } from "react";
import { motion, animate, useReducedMotion } from "motion/react";
import { Check } from "@/components/brand/icons";

// ── Vista previa de la plataforma ───────────────────────────────────────────
// Mockup del dashboard de miembros (v1.1). Es también la spec visual de lo
// que se construirá: lo que se dibuja aquí es lo que existirá.
// REGLA: siempre se muestra con la etiqueta "Vista previa · Plataforma en
// desarrollo" — nunca como producto existente (Constitución, ley 4).
// Datos de ejemplo coherentes con el Sistema de Hipertrofia (fase de
// sobrecarga, semana 7 de 16).
//
// BREY v2.1: el "44%" cuenta hacia arriba y las barras de tonelaje crecen
// al montar — animando scaleY (transform), nunca height, así que el
// contenedor nunca cambia de tamaño y no hay CLS. "use client" porque
// Motion necesita ejecutar en el navegador.
//
// BREY v3.0 (Fase 2, skeleton loading): breve estado de carga antes del
// contenido real — comunica "esto es software real trayendo tus datos",
// no un mockup estático. Los contenedores del skeleton comparten alto y
// estructura con el contenido real, así que el swap no produce CLS.

const sesion = [
  { nombre: "Press banca",     esquema: "4 × 5",     intensidad: "RPE 8", hecho: true },
  { nombre: "Press militar",   esquema: "3 × 8",     intensidad: "RIR 2", hecho: false },
  { nombre: "Fondos lastrados", esquema: "3 × AMRAP", intensidad: "RIR 1", hecho: false },
];

// Tonelaje relativo de las últimas 6 semanas (alturas en %)
const tonelaje = [38, 52, 46, 60, 70, 84];

const dias = [
  { d: "L", estado: "hecho" },
  { d: "M", estado: "hecho" },
  { d: "X", estado: "descanso" },
  { d: "J", estado: "hoy" },
  { d: "V", estado: "plan" },
  { d: "S", estado: "plan" },
  { d: "D", estado: "descanso" },
] as const;

const diaEstilo: Record<(typeof dias)[number]["estado"], string> = {
  hecho:    "bg-orange-400",
  hoy:      "bg-white ring-2 ring-orange-400/60",
  plan:     "bg-white/15",
  descanso: "bg-white/[0.06]",
};

// El propio mockup ya llega envuelto en HeroPreviewItem/ScrollReveal, que
// tarda ~0.6-1s en asentarse visualmente (fade+scale). Sin este retraso,
// el conteo terminaría "bajo cuerda" mientras la tarjeta aún es invisible
// — se ve el número ya en su valor final apenas aparece, no contando.
const REVEAL_DELAY = 0.6;

// El skeleton se retira a los 450ms — después de que la tarjeta terminó de
// asentarse visualmente (~400-600ms) pero antes de que el conteo/barras
// arranquen (600ms), para que el orden se sienta como: aparece → carga → cuenta.
const SKELETON_MS = 450;

/** Bloque de carga — mismo alto que el texto real que reemplaza. */
function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none ${className}`} />;
}

/** Mantiene la forma exacta del dashboard real mientras "carga". */
function DashboardSkeleton() {
  return (
    <>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 space-y-2.5">
          <SkeletonBar className="h-2.5 w-24" />
          <SkeletonBar className="h-4 w-32" />
          <SkeletonBar className="h-2.5 w-40" />
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <SkeletonBar className="h-3 w-10" />
          <div className="w-16 h-1 rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
        </div>
      </div>

      <SkeletonBar className="h-2.5 w-48 mb-5" />

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.06] mb-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <div className="w-5 h-5 rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none flex-shrink-0" />
            <SkeletonBar className="h-3 flex-1" />
            <SkeletonBar className="h-3 w-8" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
          <SkeletonBar className="h-2.5 w-20 mb-3" />
          <div className="flex items-end gap-1.5 h-12 mb-2">
            {tonelaje.map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="flex-1 rounded-sm bg-white/[0.06] animate-pulse motion-reduce:animate-none"
              />
            ))}
          </div>
          <SkeletonBar className="h-2.5 w-24" />
        </div>
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 flex flex-col justify-between">
          <div>
            <SkeletonBar className="h-2.5 w-20 mb-3" />
            <div className="flex items-center justify-between">
              {dias.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
              ))}
            </div>
          </div>
          <SkeletonBar className="h-2.5 w-20 mt-3" />
        </div>
      </div>
    </>
  );
}

/** true una vez pasado el breve estado de carga (instantáneo si reduced-motion). */
function useSkeletonReady(delay = SKELETON_MS) {
  const shouldReduceMotion = useReducedMotion();
  const [ready, setReady] = useState(!!shouldReduceMotion);
  useEffect(() => {
    if (shouldReduceMotion) return;
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [shouldReduceMotion, delay]);
  return ready;
}

/**
 * Cuenta de 0 al valor objetivo una sola vez al montar.
 * animate() es imperativo — a diferencia de motion.div, no lee el
 * MotionConfig reducedMotion="user" de layout.tsx, así que aquí se
 * consulta useReducedMotion() directamente y se salta la animación.
 */
function useCountUp(target: number, duration = 1.1, delay = REVEAL_DELAY) {
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(shouldReduceMotion ? target : 0);
  useEffect(() => {
    if (shouldReduceMotion) return;
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, duration, delay, shouldReduceMotion]);
  return value;
}

export default function DashboardPreview({ className = "" }: { className?: string }) {
  const progreso = useCountUp(44);
  const ready = useSkeletonReady();

  return (
    <div className={`relative mx-auto w-full max-w-md ${className}`}>
      {/* Glow ambiental */}
      <div aria-hidden className="absolute -inset-8 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

      {/* Etiqueta honesta — innegociable */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-slate-950 text-[10px] font-bold tracking-[0.14em] uppercase text-orange-400">
        Vista previa · Plataforma en desarrollo
      </div>

      {/* Marco de la app */}
      <div className="relative rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 p-5 sm:p-6">
        {!ready ? (
          <DashboardSkeleton />
        ) : (
          <>
        {/* Cabecera: hoy entrenas */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.20em] uppercase text-orange-400 mb-1.5">
              Hoy entrenas
            </p>
            <p className="font-black text-white text-lg leading-tight">Empuje · Fuerza</p>
            <p className="text-white/50 text-[11px] mt-1">
              Sistema de Hipertrofia · Semana 7 de 16
            </p>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="font-mono font-bold text-white text-sm tabular-nums">{progreso}%</span>
            <span className="text-white/50 text-[10px]">del Sistema</span>
            <div className="w-16 h-1 rounded-full bg-white/[0.08] mt-1.5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-orange-400 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0.44 }}
                transition={{ duration: 1.1, delay: REVEAL_DELAY, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </div>

        {/* Objetivo — visible, no solo implícito en la sesión */}
        <p className="text-[11px] text-white/55 mb-5">
          Objetivo · <span className="text-white font-semibold">Ganar fuerza en tren superior</span>
        </p>

        {/* Sesión */}
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.06] mb-4">
          {sesion.map((e) => (
            <div key={e.nombre} className="flex items-center gap-3 px-4 py-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  e.hecho ? "bg-emerald-500/20" : "border border-white/15"
                }`}
              >
                {e.hecho && <Check className="w-3 h-3 text-emerald-400" strokeWidth={3} />}
              </div>
              <span className={`flex-1 text-sm font-semibold ${e.hecho ? "text-white/50 line-through" : "text-white"}`}>
                {e.nombre}
              </span>
              <span className="font-mono text-xs text-white/60 tabular-nums">{e.esquema}</span>
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 text-white/60">
                {e.intensidad}
              </span>
            </div>
          ))}
        </div>

        {/* Progreso + semana */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tonelaje + PR */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-3">
              Tonelaje semanal
            </p>
            <div className="flex items-end gap-1.5 h-12 mb-2">
              {tonelaje.map((h, i) => (
                <motion.div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-sm origin-bottom ${i === tonelaje.length - 1 ? "bg-orange-400" : "bg-orange-400/25"}`}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: REVEAL_DELAY + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
            <p className="font-mono text-[11px] text-emerald-400 tabular-nums">PR · Press banca 82kg ↑</p>
          </div>

          {/* Semana + racha */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-3">
                Esta semana
              </p>
              <div className="flex items-center justify-between">
                {dias.map(({ d, estado }, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <span className="text-[9px] text-white/40 font-medium">{d}</span>
                    <span className={`w-2 h-2 rounded-full ${diaEstilo[estado]}`} />
                  </div>
                ))}
              </div>
            </div>
            <p className="font-mono text-[11px] text-white/60 mt-3 tabular-nums">
              Racha · <span className="text-white font-bold">12 sesiones</span>
            </p>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
