"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { patronCalendario, type EstadoDia } from "@/data/mockDashboard";

// ── Calendario — vista semanal de 5 semanas (BREY v1.1) ─────────────────────
// En vez de una grilla de mes calendario (que arrastra complejidad de días
// sobrantes del mes anterior/siguiente), 5 filas de semanas reales
// (lunes-domingo) alineadas a hoy — mismo concepto, más simple y siempre
// correcto sin importar el día en que se abra el Dashboard. Inspirado en
// el patrón de calendario de contribuciones (GitHub/Whoop): ritmo semanal
// de un vistazo, no un calendario de citas.

const diaEstilo: Record<EstadoDia, string> = {
  completado: "bg-orange-400 border-orange-400",
  hoy:        "bg-white border-white ring-2 ring-orange-400/60 ring-offset-2 ring-offset-slate-950",
  planificado:"bg-transparent border-white/25 border-dashed",
  descanso:   "bg-white/[0.06] border-white/[0.06]",
  perdido:    "bg-red-500/15 border-red-500/40",
};

const diaEtiqueta: Record<EstadoDia, string> = {
  completado: "Completado",
  hoy: "Hoy",
  planificado: "Planificado",
  descanso: "Descanso",
  perdido: "No completado",
};

const diasSemana = ["L", "M", "X", "J", "V", "S", "D"];

interface CeldaDia {
  offset: number;
  fecha: Date;
  estado: EstadoDia;
  sesion?: string;
}

function construirSemanas(): CeldaDia[][] {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const diaISO = hoy.getDay() === 0 ? 7 : hoy.getDay(); // 1=lunes..7=domingo
  const offsetLunesEstaSemana = -(diaISO - 1);
  const offsetInicio = offsetLunesEstaSemana - 4 * 7; // 4 semanas antes + esta semana

  const semanas: CeldaDia[][] = [];
  for (let semana = 0; semana < 5; semana++) {
    const fila: CeldaDia[] = [];
    for (let dia = 0; dia < 7; dia++) {
      const offset = offsetInicio + semana * 7 + dia;
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() + offset);
      const mock = patronCalendario.find((p) => p.offset === offset);
      fila.push({ offset, fecha, estado: mock?.estado ?? "descanso", sesion: mock?.sesion });
    }
    semanas.push(fila);
  }
  return semanas;
}

export default function CalendarioPage() {
  const semanas = useMemo(() => construirSemanas(), []);
  const [seleccion, setSeleccion] = useState<CeldaDia | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-white/50 text-sm">Últimas 5 semanas</p>
        <h1 className="font-black text-2xl sm:text-3xl text-white mt-1">Calendario</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-7"
      >
        {/* Cabecera de días */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {diasSemana.map((d) => (
            <p key={d} className="text-center text-[10px] font-bold uppercase tracking-widest text-white/40">
              {d}
            </p>
          ))}
        </div>

        {/* Filas de semanas */}
        <div className="space-y-2">
          {semanas.map((fila, i) => (
            <div key={i} className="grid grid-cols-7 gap-2">
              {fila.map((celda) => (
                <button
                  key={celda.offset}
                  onClick={() => setSeleccion(celda)}
                  className="aspect-square rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <span className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border ${diaEstilo[celda.estado]}`} />
                  <span className="text-[9px] text-white/40 tabular-nums hidden sm:block">
                    {celda.fecha.getDate()}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Detalle del día seleccionado */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] min-h-[52px]">
          {seleccion ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold text-sm capitalize">
                  {seleccion.fecha.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <p className="text-white/55 text-xs mt-0.5">
                  {seleccion.sesion ?? diaEtiqueta[seleccion.estado]}
                </p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border ${diaEstilo[seleccion.estado]} ${
                seleccion.estado === "planificado" || seleccion.estado === "descanso" ? "text-white/60" : "text-slate-950"
              }`}>
                {diaEtiqueta[seleccion.estado]}
              </span>
            </div>
          ) : (
            <p className="text-white/40 text-xs">Toca un día para ver el detalle.</p>
          )}
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 pt-5 border-t border-white/[0.06]">
          {(Object.keys(diaEtiqueta) as EstadoDia[]).map((estado) => (
            <div key={estado} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full border ${diaEstilo[estado]}`} />
              <span className="text-[11px] text-white/50">{diaEtiqueta[estado]}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
