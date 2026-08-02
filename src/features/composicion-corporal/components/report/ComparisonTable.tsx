import { NotaSinHistorial } from "@/features/composicion-corporal/components/EstadosVacios";
import type { ComparacionMetrica, Significancia } from "@/lib/bcs/analysis";
import { formatearDelta, formatearFechaCorta, formatearPorcentaje, formatearValor } from "./formato";

// ── Comparación entre dos mediciones (BCS Sprint 2.0) ──────────────────────
// Antes → Después → Δ absoluto → Δ relativo → Significancia, con las cifras
// alineadas a la derecha en tabular-nums para que las columnas se lean en
// vertical, como en un informe de laboratorio.
//
// Las variables NO comparables no se ocultan: se listan aparte con su motivo.
// Que un dato falte es información, y esconderlo dejaría creer que no cambió.

const ETIQUETA_SIGNIFICANCIA: Record<Significancia, string> = {
  significativa: "Supera el umbral",
  insignificante: "Bajo el umbral",
  no_definida: "Sin umbral definido",
};

interface Props {
  comparacion: ComparacionMetrica[];
  fechaAnterior: string | null;
  fechaActual: string | null;
}

export default function ComparisonTable({ comparacion, fechaAnterior, fechaActual }: Props) {
  const comparables = comparacion.filter((c) => c.disponibilidad === "comparable");
  const parciales = comparacion.filter(
    (c) => c.disponibilidad !== "comparable" && c.disponibilidad !== "ambos_ausentes"
  );

  if (comparables.length === 0 && parciales.length === 0) {
    return <NotaSinHistorial>Todavía no hay una medición anterior con la que comparar.</NotaSinHistorial>;
  }

  return (
    <div className="space-y-5">
      {comparables.length > 0 && (
        <div className="overflow-x-auto -mx-1 px-1">
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">
              Comparación entre la medición anterior y la actual, con cambio absoluto, relativo y su
              relevancia
            </caption>
            <thead>
              <tr className="text-[10px] font-bold tracking-[0.08em] uppercase text-white/40 border-b border-white/[0.10]">
                <th scope="col" className="text-left py-2.5 pr-3 font-bold">
                  Variable
                </th>
                <th scope="col" className="text-right py-2.5 px-3 font-bold whitespace-nowrap">
                  {fechaAnterior ? formatearFechaCorta(fechaAnterior) : "Anterior"}
                </th>
                <th scope="col" className="text-right py-2.5 px-3 font-bold whitespace-nowrap">
                  {fechaActual ? formatearFechaCorta(fechaActual) : "Actual"}
                </th>
                <th scope="col" className="text-right py-2.5 px-3 font-bold">
                  Cambio
                </th>
                <th scope="col" className="text-right py-2.5 px-3 font-bold">
                  Relativo
                </th>
                <th scope="col" className="text-left py-2.5 pl-3 font-bold">
                  Relevancia
                </th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((c) => (
                <tr key={c.variable} className="border-b border-white/[0.05] last:border-0">
                  <th scope="row" className="text-left py-2.5 pr-3 font-medium text-white/80">
                    {c.etiqueta}
                  </th>
                  <td className="text-right py-2.5 px-3 text-white/55 tabular-nums whitespace-nowrap">
                    {formatearValor(c.valorAnterior, c.unidad)}
                  </td>
                  <td className="text-right py-2.5 px-3 text-white font-semibold tabular-nums whitespace-nowrap">
                    {formatearValor(c.valorActual, c.unidad)}
                  </td>
                  <td
                    className={`text-right py-2.5 px-3 font-bold tabular-nums whitespace-nowrap ${
                      c.significancia === "significativa" ? "text-white" : "text-white/45"
                    }`}
                  >
                    {formatearDelta(c.deltaAbsoluto, c.unidad, 2)}
                  </td>
                  <td className="text-right py-2.5 px-3 text-white/45 tabular-nums whitespace-nowrap">
                    {c.deltaPorcentual !== null ? formatearPorcentaje(c.deltaPorcentual) : "no aplica"}
                  </td>
                  <td className="text-left py-2.5 pl-3 text-[11px] text-white/45">
                    {ETIQUETA_SIGNIFICANCIA[c.significancia]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {parciales.length > 0 && (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
          <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/40 mb-2">
            No comparables
          </p>
          <ul className="space-y-1">
            {parciales.map((c) => (
              <li key={c.variable} className="text-xs text-white/50 leading-relaxed">
                <span className="text-white/70 font-semibold">{c.etiqueta}:</span> {c.razon}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
