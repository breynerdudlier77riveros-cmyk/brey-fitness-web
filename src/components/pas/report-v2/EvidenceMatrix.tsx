import type { FilaEvidencia } from "@/lib/pas/report-v2";

// ── Matriz de evidencia (PRS v2.0) ─────────────────────────────────────────
//
// Sustituye los párrafos largos del informe v1. Cinco ejes independientes, cada
// uno con su estado: calidad, estado de la norma, conflicto, unidad y tamaño de
// celda.
//
// Tabla real, no una rejilla de <div>: es información tabular y un lector de
// pantalla debe poder recorrerla por filas. Los ejes NO se combinan en una
// puntuación — que sean independientes es justamente lo que la NKB sostiene.

interface Props {
  filas: readonly FilaEvidencia[];
  /** Rótulo accesible. Debe identificar de qué norma es esta matriz. */
  titulo: string;
}

export default function EvidenceMatrix({ filas, titulo }: Props) {
  return (
    <div className="prs2-evidencia prs2-tabla">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{titulo}</caption>
        <thead>
          <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
            <th scope="col" className="py-1.5 pr-3 font-semibold">
              Dimensión
            </th>
            <th scope="col" className="py-1.5 font-semibold">
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.dimension} data-dimension={f.dimension} className="border-b border-white/5">
              <th scope="row" className="py-1.5 pr-3 text-left font-medium text-white/70">
                {f.dimension}
              </th>
              <td className="py-1.5 text-white/60">{f.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
