import { TrendUp, TrendDown, TrendFlat } from "@/components/brand/icons";
import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import type { ComparacionMetrica, EstadoTendencia, TendenciaMetrica } from "@/lib/bcs/analysis";
import type { Procedencia } from "@/lib/bcs/reporte";
import { formatearDelta, formatearFechaCorta, formatearPorcentaje, formatearValor } from "./formato";

// ── Tarjeta de indicador principal (BCS Sprint 2.0) ────────────────────────
// Sustituye a la MetricCard anterior. Muestra las seis piezas que el sprint
// exige por indicador: valor, unidad, tendencia, variación, estado y fecha.
//
// El color NUNCA es arbitrario ni decorativo, y sobre todo NUNCA significa
// "bueno/malo": el BCS no conoce el objetivo del cliente (BCS Handbook 05,
// límite explícito). Solo codifica DIRECCIÓN del cambio, y solo cuando el
// motor la declaró significativa; en cualquier otro caso es neutro. Además
// del color siempre hay ícono y texto (Design Handbook 15).

const ICONO: Record<EstadoTendencia, typeof TrendUp> = {
  ascendente: TrendUp,
  descendente: TrendDown,
  estable: TrendFlat,
  variable: TrendFlat,
  insuficiente: TrendFlat,
  indeterminada: TrendFlat,
};

const ETIQUETA_TENDENCIA: Record<EstadoTendencia, string> = {
  ascendente: "Al alza",
  descendente: "A la baja",
  estable: "Sin cambio",
  variable: "Variable",
  insuficiente: "Sin histórico",
  indeterminada: "Indeterminada",
};

interface Props {
  etiqueta: string;
  valor: number | null;
  unidad: string;
  procedencia: Procedencia;
  /** Fila de la comparación con la medición anterior, si existe. */
  comparacion?: ComparacionMetrica;
  /** Tendencia del histórico completo, si existe. */
  tendencia?: TendenciaMetrica;
  /** Clasificación calculada (hoy solo IMC), o el motivo por el que no la hay. */
  clasificacion?: string;
  /** Fecha de la medición a la que pertenece el valor. */
  fecha: string;
}

export default function IndicatorCard({
  etiqueta,
  valor,
  unidad,
  procedencia,
  comparacion,
  tendencia,
  clasificacion,
  fecha,
}: Props) {
  const significativo = comparacion?.significancia === "significativa";
  const direccion = comparacion?.direccion;

  const colorDelta =
    significativo && direccion === "aumento"
      ? "text-sky-400"
      : significativo && direccion === "disminucion"
        ? "text-orange-400"
        : "text-white/50";

  const estadoTendencia = tendencia?.estado ?? "insuficiente";
  const Icono = ICONO[estadoTendencia];

  const descripcionAccesible = [
    `${etiqueta}: ${formatearValor(valor, unidad)}`,
    comparacion?.deltaAbsoluto != null
      ? `variación ${formatearDelta(comparacion.deltaAbsoluto, unidad)} respecto a la medición anterior`
      : "sin medición anterior con la que comparar",
    `tendencia ${ETIQUETA_TENDENCIA[estadoTendencia].toLowerCase()}`,
  ].join(", ");

  return (
    <article
      role="group"
      aria-label={descripcionAccesible}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/50 leading-tight">
          {etiqueta}
        </h3>
        <ProcedenciaBadge procedencia={procedencia} />
      </div>

      <p className="font-black text-2xl text-white tabular-nums leading-none">
        {formatearValor(valor, unidad)}
      </p>

      <div className="mt-3 space-y-1.5 text-[11px]">
        <div className={`flex items-center gap-1.5 font-bold tabular-nums ${colorDelta}`}>
          <Icono className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.25} />
          {comparacion?.deltaAbsoluto != null ? (
            <>
              <span>{formatearDelta(comparacion.deltaAbsoluto, unidad)}</span>
              {comparacion.deltaPorcentual !== null && (
                <span className="text-white/35 font-semibold">
                  ({formatearPorcentaje(comparacion.deltaPorcentual)})
                </span>
              )}
            </>
          ) : (
            <span className="text-white/35 font-semibold">Sin comparación</span>
          )}
        </div>

        <p className="text-white/45">
          {ETIQUETA_TENDENCIA[estadoTendencia]}
          {tendencia && tendencia.puntosUsados > 0 && (
            <span className="text-white/30"> · {tendencia.puntosUsados} mediciones</span>
          )}
        </p>

        {clasificacion && <p className="text-white/60 font-semibold">{clasificacion}</p>}
      </div>

      <p className="text-[10px] text-white/30 mt-3 pt-2.5 border-t border-white/[0.05]">
        {formatearFechaCorta(fecha)}
      </p>
    </article>
  );
}
