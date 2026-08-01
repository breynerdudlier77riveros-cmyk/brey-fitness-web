import { Accordion } from "@/components/brand/Accordion";
import SectionCard from "@/features/composicion-corporal/components/SectionCard";
import MetricCard from "@/features/composicion-corporal/components/MetricCard";
import HistoryCard from "@/features/composicion-corporal/components/HistoryCard";
import InfoCard from "@/features/composicion-corporal/components/InfoCard";
import WarningCard from "@/features/composicion-corporal/components/WarningCard";
import RangeBar, { type Zona } from "@/features/composicion-corporal/components/RangeBar";
import TrendChart from "@/features/composicion-corporal/components/TrendChart";
import StackedAreaChart from "@/features/composicion-corporal/components/StackedAreaChart";
import TrendIndicator from "@/features/composicion-corporal/components/TrendIndicator";
import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import { NotaSinHistorial } from "@/features/composicion-corporal/components/EstadosVacios";
import AnalysisSection from "@/features/composicion-corporal/components/AnalysisSection";
import { calcularDelta, type Reporte } from "@/lib/bcs/reporte";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Vista del Reporte — ÚNICA implementación (BCS-ADR-05) ──────────────────
// Renderiza las 8 secciones del BCS Handbook (04), en el orden exacto ahí
// especificado. La usan tanto el panel del Entrenador
// (app/composicion-corporal/[clienteId]) como la vista pública
// (app/reportes/[token]) — literalmente el mismo componente, sin ninguna
// prop de "modo". Los controles de edición (registrar medición, generar/
// revocar enlace, archivar/eliminar) viven en la página que envuelve a
// este componente, NUNCA aquí — es lo que garantiza la paridad de
// contenido por construcción, no por una condición que alguien podría
// desactivar por error.

const ZONAS_IMC: Zona[] = [
  { hasta: 18.5, etiqueta: "Bajo peso", color: "bg-sky-500" },
  { hasta: 25, etiqueta: "Normal", color: "bg-emerald-500" },
  { hasta: 30, etiqueta: "Sobrepeso", color: "bg-amber-500" },
  { hasta: 40, etiqueta: "Obesidad", color: "bg-red-500" },
];

interface Props {
  reporte: Reporte;
  /**
   * Análisis ya interpretado (Sprint I-03). REQUERIDO a propósito: al no ser
   * opcional, el compilador obliga a las dos superficies (panel del
   * Entrenador y reporte público) a pasarlo — la paridad de BCS-ADR-05
   * queda garantizada por construcción, no por recordar hacerlo.
   */
  analisis: BodyCompositionAnalysis;
  /** Solo el panel del Entrenador la pasa (BCS-ADR-05) — ver HistoryCard.tsx. */
  onCorregirMedicion?: (medicion: Medicion) => void;
}

export default function ReportView({ reporte, analisis, onCorregirMedicion }: Props) {
  const { medicionActual, medicionAnterior, resumenEjecutivo, ficha, comparacion, historico, tendencias, advertencias, fotografias } = reporte;
  const tieneHistorial = historico.length >= 2;

  return (
    <div className="space-y-6">
      {advertencias.map((a) => (
        <WarningCard key={a.id}>{a.texto}</WarningCard>
      ))}

      {/* 1 · Resumen ejecutivo */}
      <SectionCard titulo="Resumen ejecutivo">
        <ul className="space-y-2">
          {resumenEjecutivo.map((item) => (
            <li key={item.id} className="text-sm text-white/80">
              {item.texto}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* 1b · Análisis determinista (Sprint I-03) — va inmediatamente
          después del resumen: primero qué pasó, luego el detalle crudo. */}
      <AnalysisSection analisis={analisis} />

      {/* 2 · Ficha de la medición actual, agrupada por categoría */}
      <SectionCard titulo={`Medición actual — ${new Date(`${medicionActual.fecha}T00:00:00`).toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric" })}`}>
        <div className="space-y-6">
          {ficha
            .filter((bloque) => bloque.filas.length > 0)
            .map((bloque) => (
              <div key={bloque.categoria}>
                <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">{bloque.etiqueta}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-2 gap-4">
                  {bloque.filas.map((fila) => {
                    const anterior = medicionAnterior?.[fila.id];
                    const delta = anterior !== null && anterior !== undefined ? calcularDelta(fila.id, fila.valor, anterior) : undefined;
                    return (
                      <MetricCard
                        key={fila.id}
                        etiqueta={fila.etiqueta}
                        valor={fila.valor}
                        unidad={fila.unidad}
                        procedencia={fila.procedencia}
                        delta={delta}
                        clasificacionEtiqueta={fila.clasificacion?.etiqueta}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </SectionCard>

      {/* 6 · Barras de progreso (solo IMC calculable hoy — ver 7) */}
      {medicionActual.imc !== null && (
        <SectionCard titulo="Posición dentro del rango">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-white">IMC</p>
            <ProcedenciaBadge procedencia="validacion" />
          </div>
          <RangeBar valor={medicionActual.imc} min={10} max={40} zonas={ZONAS_IMC} unidad="kg/m²" />
        </SectionCard>
      )}

      {/* 7 · Clasificaciones e interpretaciones — nunca lenguaje diagnóstico */}
      <SectionCard titulo="Interpretación">
        <div className="space-y-3">
          {ficha
            .flatMap((b) => b.filas)
            .filter((f) => f.clasificacion)
            .map((f) => (
              <InfoCard key={f.id}>{f.clasificacion!.texto}</InfoCard>
            ))}
          {ficha
            .flatMap((b) => b.filas)
            .filter((f) => f.bloqueoClasificacion)
            .map((f) => (
              <p key={f.id} className="text-xs text-white/40 italic">
                {f.etiqueta}: sin clasificación disponible todavía — se muestra solo como tendencia.
              </p>
            ))}
        </div>
      </SectionCard>

      {/* 3 · Comparación con la medición anterior */}
      <SectionCard titulo="Comparación con la medición anterior">
        {comparacion ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-bold tracking-[0.08em] uppercase text-white/40 border-b border-white/[0.07]">
                  <th className="py-2 pr-3">Variable</th>
                  <th className="py-2 pr-3 text-right">Anterior</th>
                  <th className="py-2 pr-3 text-right">Actual</th>
                  <th className="py-2 text-right">Diferencia</th>
                </tr>
              </thead>
              <tbody>
                {comparacion.map((fila) => (
                  <tr key={fila.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="py-2 pr-3 text-white/80">{fila.etiqueta}</td>
                    <td className="py-2 pr-3 text-right text-white/60 tabular-nums">
                      {fila.valorAnterior.toFixed(1)} {fila.unidad}
                    </td>
                    <td className="py-2 pr-3 text-right text-white font-semibold tabular-nums">
                      {fila.valorActual.toFixed(1)} {fila.unidad}
                    </td>
                    <td className="py-2 text-right">
                      <TrendIndicator delta={fila.delta} unidad={fila.unidad} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <NotaSinHistorial>Todavía no hay una medición anterior con la que comparar.</NotaSinHistorial>
        )}
      </SectionCard>

      {/* 5 · Gráficos de tendencia */}
      <SectionCard titulo="Tendencias">
        {tieneHistorial ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tendencias
              .filter((s) => s.tipoGrafico === "linea")
              .map((serie) => (
                <div key={serie.id}>
                  <p className="text-xs font-bold text-white/70 mb-2">{serie.etiqueta}</p>
                  <TrendChart puntos={serie.puntos} unidad={serie.unidad} />
                </div>
              ))}
            {tendencias.some((s) => s.id === "agua_total_l") && (
              <div>
                <p className="text-xs font-bold text-white/70 mb-2">Agua corporal</p>
                <StackedAreaChart historico={[...historico].reverse()} />
              </div>
            )}
          </div>
        ) : (
          <NotaSinHistorial>Se necesitan al menos 2 mediciones para mostrar tendencias.</NotaSinHistorial>
        )}
      </SectionCard>

      {/* 4 · Histórico completo */}
      <SectionCard titulo="Histórico completo">
        <Accordion type="single" collapsible className="gap-2">
          {historico.map((m) => (
            <HistoryCard key={m.id} medicion={m} onCorregir={onCorregirMedicion} />
          ))}
        </Accordion>
      </SectionCard>

      {/* 8 · Fotografías */}
      {fotografias.length > 0 && (
        <SectionCard titulo="Fotografías de progreso">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {fotografias.map((f) => (
              // eslint-disable-next-line @next/next/no-img-element -- URL de Storage externa, sin dominio conocido para next/image
              <img key={f.url} src={f.url} alt={`Fotografía de progreso — ${f.fecha}`} className="w-full aspect-square object-cover rounded-xl border border-white/[0.07]" />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
