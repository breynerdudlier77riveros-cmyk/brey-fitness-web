"use client";

import { FILTROS, ORDEN_FILTROS, type FiltroDashboard } from "@/lib/bcs/dashboard";

// ── Filtros (zona 8) ───────────────────────────────────────────────────────
// Filtrado POSTERIOR: no dispara ninguna consulta. Los datos ya están en el
// cliente y el selector solo cambia qué subconjunto se muestra.

interface Props {
  activo: FiltroDashboard;
  onCambiar: (filtro: FiltroDashboard) => void;
  conteo: Record<FiltroDashboard, number>;
}

export default function DashboardFilters({ activo, onCambiar, conteo }: Props) {
  return (
    <div className="flex flex-wrap gap-2 print:hidden" role="group" aria-label="Filtrar clientes">
      {ORDEN_FILTROS.map((filtro) => {
        const seleccionado = filtro === activo;
        return (
          <button
            key={filtro}
            type="button"
            onClick={() => onCambiar(filtro)}
            aria-pressed={seleccionado}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              seleccionado
                ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
                : "border-white/[0.10] text-white/55 hover:text-white hover:border-white/20"
            }`}
          >
            {FILTROS[filtro].etiqueta}
            <span className="text-white/35 tabular-nums">{conteo[filtro]}</span>
          </button>
        );
      })}
    </div>
  );
}
