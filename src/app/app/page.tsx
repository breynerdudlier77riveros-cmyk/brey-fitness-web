"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  entrenamientoHoy,
  objetivoActual,
  recordsRecientes,
  progresoSemanal,
} from "@/data/mockDashboard";
import { Check, TrendingUp, ArrowRight } from "@/components/brand/icons";

// ── Hoy — pantalla de apertura del Dashboard (BREY v1.1) ────────────────────
// Interactividad real (marcar series como hechas) sin backend: estado local,
// no persiste al recargar — suficiente para validar la sensación de "app
// que uso hoy", que es todo lo que pide esta primera versión.

const fecha = new Date();
const diaSemana = fecha.toLocaleDateString("es-CO", { weekday: "long" });
const diaMes = fecha.toLocaleDateString("es-CO", { day: "numeric", month: "long" });

export default function HoyPage() {
  const [ejercicios, setEjercicios] = useState(entrenamientoHoy.ejercicios);

  const toggle = (nombre: string) => {
    setEjercicios((prev) =>
      prev.map((e) => (e.nombre === nombre ? { ...e, completado: !e.completado } : e))
    );
  };

  const hechos = ejercicios.filter((e) => e.completado).length;
  const total = ejercicios.length;
  const progresoSesion = Math.round((hechos / total) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-white/50 text-sm capitalize">
          {diaSemana} · {diaMes}
        </p>
        <h1 className="font-black text-2xl sm:text-3xl text-white mt-1">
          Hoy entrenas {entrenamientoHoy.nombreSesion}
        </h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Columna principal — Entrenamiento de hoy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden"
        >
          <div className="flex items-center justify-between gap-4 p-5 border-b border-white/[0.06]">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-orange-400 mb-1">
                {entrenamientoHoy.sistema} · Semana {entrenamientoHoy.semana} de {entrenamientoHoy.semanaTotal}
              </p>
              <p className="text-white/50 text-xs">{entrenamientoHoy.duracionEstimada} estimados</p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="font-mono font-black text-white text-lg tabular-nums">
                {hechos}/{total}
              </span>
              <p className="text-white/50 text-[10px] uppercase tracking-wide">series</p>
            </div>
          </div>

          <div className="h-1 bg-white/[0.06]">
            <motion.div
              className="h-full bg-orange-400 origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progresoSesion / 100 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="divide-y divide-white/[0.06]">
            {ejercicios.map((e) => (
              <button
                key={e.nombre}
                onClick={() => toggle(e.nombre)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border transition-all ${
                    e.completado ? "bg-emerald-500/20 border-emerald-500/30" : "border-white/20"
                  }`}
                >
                  {e.completado && <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={3} />}
                </span>
                <span className={`flex-1 min-w-0 text-sm font-semibold ${e.completado ? "text-white/45 line-through" : "text-white"}`}>
                  {e.nombre}
                </span>
                <span className="font-mono text-xs text-white/55 tabular-nums flex-shrink-0">
                  {e.series} × {e.reps}{e.peso ? ` · ${e.peso}kg` : ""}
                </span>
                <span className="hidden sm:inline-flex font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 text-white/55 flex-shrink-0">
                  {e.intensidad}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Columna lateral */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Objetivo */}
          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5">
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-orange-400 mb-2">
              Objetivo
            </p>
            <p className="font-black text-white text-sm leading-snug mb-3">{objetivoActual.titulo}</p>
            <div className="flex items-end justify-between mb-2">
              <span className="font-mono text-lg font-black text-white tabular-nums">
                {objetivoActual.metricaActual}
              </span>
              <span className="text-white/50 text-xs">→ {objetivoActual.metricaObjetivo}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-orange-400"
                style={{ width: `${objetivoActual.progreso}%` }}
              />
            </div>
            <p className="text-white/50 text-[11px]">{objetivoActual.semanasRestantes} semanas restantes</p>
          </div>

          {/* Progreso semanal — snapshot */}
          <Link
            href="/app/progreso"
            className="block rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all p-5 group"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50">
                Progreso semanal
              </p>
              <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-orange-400 transition-colors" strokeWidth={2.5} />
            </div>
            <div className="flex items-end gap-1 h-10">
              {progresoSemanal.map((p, i) => (
                <div
                  key={p.etiqueta}
                  style={{ height: `${p.tonelaje}%` }}
                  className={`flex-1 rounded-sm ${i === progresoSemanal.length - 1 ? "bg-orange-400" : "bg-orange-400/25"}`}
                />
              ))}
            </div>
          </Link>

          {/* PRs recientes */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50">
                PRs recientes
              </p>
            </div>
            <div className="space-y-3">
              {recordsRecientes.map((r) => (
                <div key={r.ejercicio} className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{r.ejercicio}</p>
                    <p className="text-[10px] text-white/45">{r.fecha}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-xs text-white tabular-nums">{r.valor}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">{r.mejora}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
