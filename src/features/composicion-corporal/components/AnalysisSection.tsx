import SectionCard from "@/features/composicion-corporal/components/SectionCard";
import InfoCard from "@/features/composicion-corporal/components/InfoCard";
import WarningCard from "@/features/composicion-corporal/components/WarningCard";
import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import { NotaSinHistorial } from "@/features/composicion-corporal/components/EstadosVacios";
import Badge from "@/components/brand/Badge";
import { InfoIcon, TrendUp, TrendDown, TrendFlat } from "@/components/brand/icons";
import type {
  Aviso,
  BodyCompositionAnalysis,
  ComparacionMetrica,
  EstadoTendencia,
  Hallazgo,
  Insight,
  ResumenAnalisis,
  Suficiencia,
  TendenciaMetrica,
} from "@/lib/bcs/analysis";

// ── Presentación del análisis (Sprint I-03) ────────────────────────────────
// Renderiza el DTO BodyCompositionAnalysis, que ya llega completamente
// interpretado por src/lib/bcs/analysis. Aquí no se decide nada: no se
// calculan deltas, no se clasifican direcciones, no se ocultan limitaciones.
// Si un texto no viene en el DTO, no se muestra.
//
// Una sola implementación para la ficha privada y el reporte público
// (BCS-ADR-05) — igual que ReportView, sin prop de "modo".

const ETIQUETA_SUFICIENCIA: Record<Suficiencia, string> = {
  sin_datos: "Sin datos",
  insuficiente: "Datos insuficientes",
  parcial: "Base parcial",
  suficiente: "Base suficiente",
};

const ICONO_TENDENCIA: Record<EstadoTendencia, typeof TrendUp> = {
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
  insuficiente: "Sin datos suficientes",
  indeterminada: "Indeterminada",
};

/** Nunca solo color: cada estado lleva ícono + texto (Design Handbook 06/15). */
function SuficienciaBadge({ suficiencia }: { suficiencia: Suficiencia }) {
  return (
    <Badge
      variant={suficiencia === "suficiente" ? "success" : "neutral"}
      className="px-2 py-0.5 text-[10px] tracking-[0.04em]"
    >
      {ETIQUETA_SUFICIENCIA[suficiencia]}
    </Badge>
  );
}

export function AnalysisSummary({ resumen }: { resumen: ResumenAnalisis }) {
  const cuerpo = (
    <div>
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <p className="font-bold text-white text-sm">{resumen.titulo}</p>
        <SuficienciaBadge suficiencia={resumen.suficiencia} />
      </div>
      <p className="text-sm text-white/70 leading-relaxed">{resumen.texto}</p>
    </div>
  );

  // El tono `atencion` significa "hay un dato que revisar", nunca un juicio
  // sobre la salud de la persona — por eso Warning (ámbar), nunca rojo.
  return resumen.tono === "atencion" ? <WarningCard>{cuerpo}</WarningCard> : <InfoCard>{cuerpo}</InfoCard>;
}

export function FindingsList({ hallazgos }: { hallazgos: Hallazgo[] }) {
  if (hallazgos.length === 0) {
    return <NotaSinHistorial>No hay hallazgos que reportar con las mediciones registradas.</NotaSinHistorial>;
  }

  return (
    <ul className="space-y-3">
      {hallazgos.map((h) => (
        <li key={h.id} className="border-b border-white/[0.05] last:border-0 pb-3 last:pb-0">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
            <p className="font-bold text-white text-sm">{h.titulo}</p>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {h.procedencia && <ProcedenciaBadge procedencia={h.procedencia} />}
              <SuficienciaBadge suficiencia={h.suficiencia} />
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">{h.descripcion}</p>
          <p className="text-xs text-white/35 italic mt-1">{h.explicacion}</p>
        </li>
      ))}
    </ul>
  );
}

export function InsightsList({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) {
    return <NotaSinHistorial>Todavía no hay interpretaciones disponibles para estas mediciones.</NotaSinHistorial>;
  }

  return (
    <ul className="space-y-3">
      {insights.map((i) => (
        <li key={i.id} className="flex gap-3">
          <InfoIcon className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-0.5">
              <p className="font-bold text-white text-sm">{i.titulo}</p>
              <SuficienciaBadge suficiencia={i.suficiencia} />
            </div>
            <p className="text-sm text-white/60 leading-relaxed">{i.descripcion}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Alertas (dato a revisar) — visualmente separadas de las limitaciones. */
export function AlertsList({ avisos }: { avisos: Aviso[] }) {
  const alertas = avisos.filter((a) => a.tipo === "alerta");
  if (alertas.length === 0) return null;

  return (
    <div className="space-y-3">
      {alertas.map((a) => (
        <WarningCard key={a.id}>
          <span className="font-bold">{a.titulo}.</span> {a.descripcion}
        </WarningCard>
      ))}
    </div>
  );
}

/**
 * Limitaciones y notas — NUNCA se ocultan: que el sistema no pueda
 * interpretar algo es información que el cliente tiene derecho a ver.
 */
export function AnalysisLimitations({ avisos }: { avisos: Aviso[] }) {
  const limitaciones = avisos.filter((a) => a.tipo === "limitacion" || a.tipo === "nota");
  if (limitaciones.length === 0) return null;

  return (
    <ul className="space-y-2.5">
      {limitaciones.map((a) => (
        <li key={a.id} className="text-xs text-white/45 leading-relaxed">
          <span className="font-semibold text-white/60">{a.titulo}:</span> {a.descripcion}
        </li>
      ))}
    </ul>
  );
}

export function MetricComparisonTable({ comparacion }: { comparacion: ComparacionMetrica[] }) {
  const comparables = comparacion.filter((c) => c.disponibilidad === "comparable");
  const noComparables = comparacion.filter(
    (c) => c.disponibilidad !== "comparable" && c.disponibilidad !== "ambos_ausentes"
  );

  if (comparables.length === 0 && noComparables.length === 0) {
    return <NotaSinHistorial>No hay variables comparables entre las dos mediciones.</NotaSinHistorial>;
  }

  return (
    <div className="space-y-4">
      {comparables.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-bold tracking-[0.08em] uppercase text-white/40 border-b border-white/[0.07]">
                <th className="py-2 pr-3">Variable</th>
                <th className="py-2 pr-3 text-right">Δ</th>
                <th className="py-2 pr-3 text-right">Δ %</th>
                <th className="py-2">Relevancia</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((c) => (
                <tr key={c.variable} className="border-b border-white/[0.04] last:border-0">
                  <td className="py-2 pr-3 text-white/80">{c.etiqueta}</td>
                  <td className="py-2 pr-3 text-right text-white tabular-nums">
                    {c.deltaAbsoluto !== null
                      ? `${c.deltaAbsoluto > 0 ? "+" : c.deltaAbsoluto < 0 ? "−" : ""}${Math.abs(c.deltaAbsoluto).toFixed(2)}${c.unidad ? ` ${c.unidad}` : ""}`
                      : "—"}
                  </td>
                  <td className="py-2 pr-3 text-right text-white/60 tabular-nums">
                    {c.deltaPorcentual !== null ? `${c.deltaPorcentual > 0 ? "+" : "−"}${Math.abs(c.deltaPorcentual).toFixed(1)} %` : "no aplica"}
                  </td>
                  <td className="py-2 text-white/50 text-xs">
                    {c.significancia === "significativa"
                      ? "Supera el umbral definido"
                      : c.significancia === "insignificante"
                        ? "Bajo el umbral definido"
                        : "Sin umbral definido"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noComparables.length > 0 && (
        <p className="text-xs text-white/40 leading-relaxed">
          No comparables por falta de dato en alguna de las dos mediciones:{" "}
          {noComparables.map((c) => c.etiqueta).join(", ")}.
        </p>
      )}
    </div>
  );
}

export function TrendOverview({ tendencias }: { tendencias: TendenciaMetrica[] }) {
  const conDatos = tendencias.filter((t) => t.estado !== "insuficiente");

  if (conDatos.length === 0) {
    return <NotaSinHistorial>Se necesitan al menos 2 mediciones con la misma variable para describir su evolución.</NotaSinHistorial>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
      {conDatos.map((t) => {
        const Icono = ICONO_TENDENCIA[t.estado];
        return (
          <li key={t.variable} className="flex items-center justify-between gap-3 py-1.5 border-b border-white/[0.04]">
            <span className="text-sm text-white/70 min-w-0 truncate">{t.etiqueta}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white/60 flex-shrink-0">
              <Icono className="w-3.5 h-3.5" strokeWidth={2.25} />
              {ETIQUETA_TENDENCIA[t.estado]}
              <span className="text-white/30 font-normal">({t.puntosUsados})</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Bloque completo del análisis — el único punto que ReportView monta. */
export default function AnalysisSection({ analisis }: { analisis: BodyCompositionAnalysis }) {
  return (
    <>
      <AlertsList avisos={analisis.avisos} />

      <SectionCard titulo="Análisis">
        <div className="space-y-6">
          <AnalysisSummary resumen={analisis.resumen} />

          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">Interpretación</p>
            <InsightsList insights={analisis.insights} />
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">Hallazgos</p>
            <FindingsList hallazgos={analisis.hallazgos} />
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">Evolución por variable</p>
            <TrendOverview tendencias={analisis.tendencias} />
          </div>

          {analisis.comparacion.length > 0 && (
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">
                Detalle de cambios
              </p>
              <MetricComparisonTable comparacion={analisis.comparacion} />
            </div>
          )}

          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">
              Qué no puede interpretarse
            </p>
            <AnalysisLimitations avisos={analisis.avisos} />
          </div>
        </div>
      </SectionCard>
    </>
  );
}
