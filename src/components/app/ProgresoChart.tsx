"use client";

import { motion } from "motion/react";

interface Semana {
  etiqueta: string;
  kg: number;
}

export default function ProgresoChart({ semanas }: { semanas: Semana[] }) {
  const max = Math.max(...semanas.map((s) => s.kg), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-7"
    >
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-6">Tonelaje semanal</p>
      <div className="flex items-end gap-3 h-40 mb-3">
        {semanas.map((s, i) => (
          <div key={s.etiqueta} className="flex-1 flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] text-white/50 tabular-nums">{s.kg} kg</span>
            <motion.div
              style={{ height: `${(s.kg / max) * 100}%` }}
              className={`w-full rounded-t-md origin-bottom ${
                i === semanas.length - 1 ? "bg-orange-400" : "bg-orange-400/25"
              }`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        {semanas.map((s) => (
          <p key={s.etiqueta} className="flex-1 text-center text-[10px] text-white/40">
            {s.etiqueta}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
