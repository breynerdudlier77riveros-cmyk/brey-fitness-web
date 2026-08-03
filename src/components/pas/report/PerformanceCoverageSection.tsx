import PerformanceSection from "./PerformanceSection";
import InterpretationList from "./InterpretationList";
import type { Interpretacion } from "@/lib/pas/interpretation";
import type { GrupoCobertura } from "@/lib/pas/report";

// ── Cobertura (Sprint PAS-5.0) ─────────────────────────────────────────────
// Qué capacidades están cubiertas, parcialmente cubiertas o desconocidas.
//
// El PRS NO explica por qué: el «porqué» está en las interpretaciones del PIE,
// que se reproducen debajo tal cual. Redactar aquí una explicación propia sería
// generar conclusiones nuevas, que es lo que este sistema tiene prohibido.

interface Props {
  grupos: readonly GrupoCobertura[];
  interpretaciones: readonly Interpretacion[];
}

export default function PerformanceCoverageSection({ grupos, interpretaciones }: Props) {
  const conContenido = grupos.filter((grupo) => grupo.capacidades.length > 0);

  return (
    <PerformanceSection id="cobertura">
      <div className="space-y-4">
        {conContenido.map((grupo) => (
          <div key={grupo.clave} data-cobertura={grupo.clave} className="prs-bloque">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/40">
              {grupo.etiqueta}
              <span className="ml-1.5 tabular-nums text-white/30">
                ({grupo.capacidades.length})
              </span>
            </h3>

            <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
              {grupo.capacidades.map((capacidad) => (
                <li key={capacidad.capacidad} className="text-sm text-white/70">
                  {capacidad.nombre}
                  <span className="ml-1 text-[11px] text-white/40">{capacidad.capacidad}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <InterpretationList
          interpretaciones={interpretaciones}
          vacio="El motor de interpretación no emitió observaciones sobre la cobertura."
        />
      </div>
    </PerformanceSection>
  );
}
