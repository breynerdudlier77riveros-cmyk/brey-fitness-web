"use client";

import { useState } from "react";
import type { Program, ProgramCategory, ProgramLevel, ProgramGoal } from "@/lib/programs";

/* ── Visual maps ──────────────────────────────────────────────────────────── */
const CATEGORY_GRADIENT: Record<ProgramCategory, string> = {
  calistenia: "from-orange-950/70 via-orange-900/25 to-slate-900",
  gym:        "from-sky-950/70 via-sky-900/25 to-slate-900",
  hibrido:    "from-emerald-950/70 via-emerald-900/25 to-slate-900",
};

const CATEGORY_BADGE: Record<ProgramCategory, string> = {
  calistenia: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  gym:        "text-sky-400 bg-sky-500/10 border-sky-500/20",
  hibrido:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

const CATEGORY_LABEL: Record<ProgramCategory, string> = {
  calistenia: "Calistenia",
  gym:        "Gym",
  hibrido:    "Híbrido",
};

const LEVEL_BADGE: Record<ProgramLevel, string> = {
  principiante: "text-lime-400 bg-lime-500/10 border-lime-500/20",
  intermedio:   "text-amber-400 bg-amber-500/10 border-amber-500/20",
  avanzado:     "text-red-400 bg-red-500/10 border-red-500/20",
};

const LEVEL_LABEL: Record<ProgramLevel, string> = {
  principiante: "Principiante",
  intermedio:   "Intermedio",
  avanzado:     "Avanzado",
};

const GOAL_LABEL: Record<ProgramGoal, string> = {
  fuerza:          "Fuerza",
  hipertrofia:     "Hipertrofia",
  "perdida-grasa": "Pérdida de grasa",
  habilidades:     "Habilidades",
};

/* ── Category icon ────────────────────────────────────────────────────────── */
function CategoryIcon({ categoria }: { categoria: ProgramCategory }) {
  if (categoria === "calistenia") {
    return (
      <svg className="w-10 h-10 text-orange-500/30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    );
  }
  if (categoria === "gym") {
    return (
      <svg className="w-10 h-10 text-sky-500/30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    );
  }
  return (
    <svg className="w-10 h-10 text-emerald-500/30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
    </svg>
  );
}

/* ── Stars ────────────────────────────────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          className={`w-3 h-3 ${n <= Math.round(rating) ? "text-orange-400" : "text-white/10"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-white/30 text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ── Program Card ─────────────────────────────────────────────────────────── */
function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-500">

      {/* Visual area */}
      <div className={`relative h-44 bg-gradient-to-br ${CATEGORY_GRADIENT[program.categoria]} flex items-center justify-center overflow-hidden`}>
        {/* Decorative ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-white/[0.04] absolute" />
          <div className="w-20 h-20 rounded-full border border-white/[0.06] absolute" />
        </div>
        <CategoryIcon categoria={program.categoria} />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${CATEGORY_BADGE[program.categoria]}`}>
            {CATEGORY_LABEL[program.categoria]}
          </span>
          {program.destacado && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
              Destacado
            </span>
          )}
        </div>

        {/* Level badge */}
        <span className={`absolute bottom-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${LEVEL_BADGE[program.nivel]}`}>
          {LEVEL_LABEL[program.nivel]}
        </span>
      </div>

      {/* Info area */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <Stars rating={program.rating} />
          <h3 className="font-black text-base text-white mt-2 leading-snug group-hover:text-orange-400 transition-colors duration-300">
            {program.nombre}
          </h3>
          <p className="text-white/35 text-xs leading-relaxed mt-1.5 line-clamp-2">
            {program.descripcion}
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-white/25 pt-3 border-t border-white/[0.06]">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {program.duracion}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            {program.cantidadVideos} videos
          </span>
          <span className="ml-auto font-black text-white/70 text-sm">{program.precio}</span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-white/25 uppercase tracking-wide">{GOAL_LABEL[program.objetivo]}</span>
          <button className="text-xs font-bold text-white/40 hover:text-orange-400 transition-colors duration-200 flex items-center gap-1 group-hover:text-orange-400">
            Ver programa
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Filter types ─────────────────────────────────────────────────────────── */
type FilterValue =
  | "todos"
  | ProgramCategory
  | ProgramLevel
  | ProgramGoal;

interface FilterOption {
  value: FilterValue;
  label: string;
  group: "all" | "category" | "level" | "goal";
}

const FILTERS: FilterOption[] = [
  { value: "todos",          label: "Todos",             group: "all"      },
  { value: "calistenia",     label: "Calistenia",        group: "category" },
  { value: "gym",            label: "Gym",               group: "category" },
  { value: "hibrido",        label: "Híbrido",           group: "category" },
  { value: "principiante",   label: "Principiante",      group: "level"    },
  { value: "intermedio",     label: "Intermedio",        group: "level"    },
  { value: "avanzado",       label: "Avanzado",          group: "level"    },
  { value: "fuerza",         label: "Fuerza",            group: "goal"     },
  { value: "hipertrofia",    label: "Hipertrofia",       group: "goal"     },
  { value: "perdida-grasa",  label: "Pérdida de grasa",  group: "goal"     },
  { value: "habilidades",    label: "Habilidades",       group: "goal"     },
];

function filterPrograms(programs: Program[], active: FilterValue): Program[] {
  if (active === "todos") return programs;
  if (active === "calistenia" || active === "gym" || active === "hibrido")
    return programs.filter((p) => p.categoria === active);
  if (active === "principiante" || active === "intermedio" || active === "avanzado")
    return programs.filter((p) => p.nivel === active);
  return programs.filter((p) => p.objetivo === active);
}

/* ── Main export ──────────────────────────────────────────────────────────── */
export default function ProgramsSection({ programs }: { programs: Program[] }) {
  const [active, setActive] = useState<FilterValue>("todos");
  const filtered = filterPrograms(programs, active);

  return (
    <section id="programas" className="py-20 md:py-28">

      {/* Filter chips */}
      <div className="sticky top-16 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.05] py-3 mb-12">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 cursor-pointer ${
                  active === f.value
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white/[0.04] border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.07]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <p className="text-white/25 text-sm">
            <span className="text-white/60 font-bold">{filtered.length}</span> programas encontrados
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-white/20 text-sm">
            No hay programas con ese filtro.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
