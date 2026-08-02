import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import type { BloqueCategoria } from "@/lib/bcs/reporte";
import { formatearValor } from "./formato";

// ── Análisis corporal (BCS Sprint 3.0) ─────────────────────────────────────
// La ficha completa de la medición actual, agrupada por las cuatro categorías
// del catálogo. Complementa a los Indicadores principales: allí se destacan
// nueve variables, aquí están TODAS las registradas, en el mismo orden que el
// entrenador ya memorizó de otras pantallas.
//
// Una variable ausente no se lista con un guion: se omite (el dominio ya la
// filtró en construirFicha). Un hueco vacío se confunde con un cero.

interface Props {
  ficha: BloqueCategoria[];
}

export default function BodyAnalysisSection({ ficha }: Props) {
  const bloques = ficha.filter((b) => b.filas.length > 0);

  return (
    <div className="space-y-6">
      {bloques.map((bloque) => (
        <section key={bloque.categoria} aria-label={bloque.etiqueta}>
          <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">
            {bloque.etiqueta}
          </h3>

          <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-x-5 gap-y-3">
            {bloque.filas.map((fila) => (
              <div key={fila.id} className="min-w-0">
                <dt className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-semibold text-white/45 truncate">
                    {fila.etiqueta}
                  </span>
                  <ProcedenciaBadge procedencia={fila.procedencia} />
                </dt>
                <dd className="text-sm font-black text-white tabular-nums">
                  {formatearValor(fila.valor, fila.unidad)}
                </dd>
                {fila.clasificacion && (
                  <p className="text-[10px] text-white/50 mt-0.5">{fila.clasificacion.etiqueta}</p>
                )}
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
