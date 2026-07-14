"use client";

import { motion } from "motion/react";
import { progresoSemanal, recordsRecientes } from "@/data/mockDashboard";
import { TrendingUp } from "@/components/brand/icons";

// ── Progreso semanal (BREY v1.1) ─────────────────────────────────────────────

const primera = progresoSemanal[0].tonelaje;
const ultima = progresoSemanal[progresoSemanal.length - 1].tonelaje;
const tendencia = Math.round(((ultima - primera) / primera) * 100);
const promedio = Math.round(
  progresoSemanal.reduce((acc, p) => acc + p.tonelaje, 0) / progresoSemanal.length
);

export default function ProgresoPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-white/50 text-sm">Últimas {progresoSemanal.length} semanas</p>
        <h1 className="font-black text-2xl sm:text-3xl text-white mt-1">Progreso semanal</h1>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Tendencia", value: `+${tendencia}%`, accent: true },
          { label: "Promedio semanal", value: `${promedio}%` },
          { label: "Semana actual", value: `${ultima}%` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-2">
              {s.label}
            </p>
            <p className={`font-black text-xl sm:text-2xl tabular-nums ${s.accent ? "text-emerald-400" : "text-white"}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-7"
      >
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-6">
          Tonelaje relativo por semana
        </p>
        <div className="flex items-end gap-3 h-40 mb-3">
          {progresoSemanal.map((p, i) => (
            <div key={p.etiqueta} className="flex-1 flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] text-white/50 tabular-nums">{p.tonelaje}%</span>
              <motion.div
                style={{ height: `${p.tonelaje}%` }}
                className={`w-full rounded-t-md origin-bottom ${
                  i === progresoSemanal.length - 1 ? "bg-orange-400" : "bg-orange-400/25"
                }`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          {progresoSemanal.map((p) => (
            <p key={p.etiqueta} className="flex-1 text-center text-[10px] text-white/40">
              {p.etiqueta}
            </p>
          ))}
        </div>
      </motion.div>

      {/* PRs */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-7">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-emerald-400" strokeWidth={2} />
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50">
            Récords personales recientes
          </p>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {recordsRecientes.map((r) => (
            <div key={r.ejercicio} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-bold text-white">{r.ejercicio}</p>
                <p className="text-white/45 text-xs mt-0.5">{r.fecha}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-white tabular-nums">{r.valor}</p>
                <p className="text-emerald-400 text-xs font-semibold mt-0.5">{r.mejora}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
