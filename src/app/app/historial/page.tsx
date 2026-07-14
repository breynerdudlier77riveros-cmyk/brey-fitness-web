"use client";

import { motion } from "motion/react";
import { historialSesiones } from "@/data/mockDashboard";
import { Check, Close } from "@/components/brand/icons";

// ── Historial básico (BREY v1.1) ─────────────────────────────────────────────

function fechaRelativa(offsetDias: number) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + offsetDias);
  return fecha.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
}

export default function HistorialPage() {
  const completadas = historialSesiones.filter((s) => s.completado).length;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="text-white/50 text-sm">Últimas {historialSesiones.length} sesiones</p>
          <h1 className="font-black text-2xl sm:text-3xl text-white mt-1">Historial</h1>
        </div>
        <p className="text-white/50 text-xs">
          <span className="text-white font-bold">{completadas}</span> de {historialSesiones.length} completadas
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden"
      >
        {historialSesiones.map((s, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                s.completado ? "bg-emerald-500/15 border-emerald-500/25" : "bg-red-500/10 border-red-500/25"
              }`}
            >
              {s.completado ? (
                <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
              ) : (
                <Close className="w-4 h-4 text-red-400" strokeWidth={2.5} />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold ${s.completado ? "text-white" : "text-white/50"}`}>
                {s.nombre}
              </p>
              <p className="text-white/45 text-xs mt-0.5 capitalize">{fechaRelativa(s.offsetDias)}</p>
            </div>

            <div className="text-right flex-shrink-0 hidden sm:block">
              <p className="font-mono text-xs text-white/70 tabular-nums">{s.duracion}</p>
              <p className="font-mono text-[10px] text-white/45 tabular-nums mt-0.5">{s.volumen}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
