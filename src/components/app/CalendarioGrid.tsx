"use client";

import { useState } from "react";
import { motion } from "motion/react";

export type EstadoDia = "completado" | "planificado" | "descanso" | "perdido";

export interface CeldaDia {
  fechaISO: string;
  estado: EstadoDia;
  sesion: string | null;
}

interface Props {
  semanas: CeldaDia[][];
  hoyISO: string;
}

const diaEstilo: Record<EstadoDia, string> = {
  completado: "bg-orange-400 border-orange-400",
  planificado: "bg-transparent border-white/25 border-dashed",
  descanso: "bg-white/[0.06] border-white/[0.06]",
  perdido: "bg-red-500/15 border-red-500/40",
};

const diaEtiqueta: Record<EstadoDia, string> = {
  completado: "Completado",
  planificado: "Planificado",
  descanso: "Sin sesión",
  perdido: "No completado",
};

const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];

export default function CalendarioGrid({ semanas, hoyISO }: Props) {
  const [seleccion, setSeleccion] = useState<CeldaDia | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-7"
    >
      <div className="grid grid-cols-7 gap-2 mb-3">
        {diasSemana.map((d) => (
          <p key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-white/40">
            {d}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        {semanas.map((fila, i) => (
          <div key={i} className="grid grid-cols-7 gap-2">
            {fila.map((celda) => {
              const esHoy = celda.fechaISO === hoyISO;
              return (
                <button
                  key={celda.fechaISO}
                  onClick={() => setSeleccion(celda)}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <span
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border ${diaEstilo[celda.estado]} ${
                      esHoy ? "ring-2 ring-orange-400/60 ring-offset-2 ring-offset-slate-950" : ""
                    }`}
                  />
                  <span className="text-[9px] text-white/40 tabular-nums hidden sm:block">
                    {Number(celda.fechaISO.slice(-2))}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-white/[0.06] min-h-[52px]">
        {seleccion ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white font-bold text-sm capitalize">
                {new Date(`${seleccion.fechaISO}T00:00:00`).toLocaleDateString("es-CO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <p className="text-white/55 text-xs mt-0.5">{seleccion.sesion ?? diaEtiqueta[seleccion.estado]}</p>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${diaEstilo[seleccion.estado]} ${
                seleccion.estado === "planificado" || seleccion.estado === "descanso" ? "text-white/60" : "text-slate-950"
              }`}
            >
              {diaEtiqueta[seleccion.estado]}
            </span>
          </div>
        ) : (
          <p className="text-white/40 text-xs">Toca un día para ver el detalle.</p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 pt-5 border-t border-white/[0.06]">
        {(Object.keys(diaEtiqueta) as EstadoDia[]).map((estado) => (
          <div key={estado} className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full border ${diaEstilo[estado]}`} />
            <span className="text-[11px] text-white/50">{diaEtiqueta[estado]}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
