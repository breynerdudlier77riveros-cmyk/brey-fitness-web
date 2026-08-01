import SectionCard from "@/features/composicion-corporal/components/SectionCard";

import ReportCover from "@/features/composicion-corporal/components/report/ReportCover";
import ReportFooter from "@/features/composicion-corporal/components/report/ReportFooter";
import ExecutiveSummary from "@/features/composicion-corporal/components/report/ExecutiveSummary";
import IndicatorGrid from "@/features/composicion-corporal/components/report/IndicatorGrid";
import RangePositionSection from "@/features/composicion-corporal/components/report/RangePositionSection";
import ComparisonTable from "@/features/composicion-corporal/components/report/ComparisonTable";
import TrendsSection from "@/features/composicion-corporal/components/report/TrendsSection";
import MeasurementTimeline from "@/features/composicion-corporal/components/report/MeasurementTimeline";
import DataQualitySection from "@/features/composicion-corporal/components/report/DataQualitySection";
import MethodologySection from "@/features/composicion-corporal/components/report/MethodologySection";
import {
  AlertsBlock,
  FindingsBlock,
  InsightsBlock,
  LimitationsBlock,
} from "@/features/composicion-corporal/components/report/AnalysisBlocks";

import type { Reporte } from "@/lib/bcs/reporte";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Vista del Reporte — ÚNICA implementación (BCS-ADR-05) ──────────────────
// La usan el panel del Entrenador (app/composicion-corporal/[clienteId]) y la
// vista pública (app/reportes/[token]): literalmente el mismo componente, sin
// prop de "modo". Los controles de edición viven en la página que lo envuelve,
// nunca aquí — eso garantiza la paridad de contenido por construcción, no por
// una condición que alguien podría desactivar por error.
//
// Este componente NO interpreta: compone. Toda cifra y todo texto de análisis
// llegan resueltos en `analisis` (BodyCompositionAnalysis) y en `reporte`,
// calculados UNA sola vez en el Server Component de cada página — aquí no se
// recalcula nada ni se vuelve a recorrer el histórico.
//
// El orden de las secciones es el de lectura de un informe clínico: primero
// la conclusión, luego lo que hay que revisar, después la evidencia, y al
// final cómo se obtuvo y qué no pudo interpretarse.

interface Props {
  reporte: Reporte;
  analisis: BodyCompositionAnalysis;
  /**
   * Fecha de emisión (yyyy-mm-dd). Llega desde la página: este componente no
   * lee el reloj, para que portada y pie no puedan discrepar entre sí.
   */
  generadoEl: string;
  /**
   * Profesional que emite el reporte. Opcional: la vista pública se resuelve
   * por token y no conoce al entrenador (el DTO de UC-09 solo trae Cliente y
   * Mediciones). Cuando falta, la portada omite la fila — nunca inventa uno.
   */
  entrenador?: string;
  /** Solo el panel del Entrenador la pasa (BCS-ADR-05). */
  onCorregirMedicion?: (medicion: Medicion) => void;
}

export default function ReportView({
  reporte,
  analisis,
  generadoEl,
  entrenador,
  onCorregirMedicion,
}: Props) {
  const { cliente, medicionActual, ficha, historico, tendencias, fotografias } = reporte;

  const filas = ficha.flatMap((bloque) => bloque.filas);
  const hayAlertas = analisis.avisos.some((a) => a.tipo === "alerta");
  const hayLimitaciones = analisis.avisos.some((a) => a.tipo === "limitacion" || a.tipo === "nota");

  return (
    <div className="reporte-print space-y-6">
      <ReportCover
        clienteNombre={cliente.nombre}
        analisis={analisis}
        entrenador={entrenador}
        generadoEl={generadoEl}
      />

      <ExecutiveSummary analisis={analisis} />

      {hayAlertas && (
        <SectionCard titulo="Datos a revisar">
          <AlertsBlock avisos={analisis.avisos} />
        </SectionCard>
      )}

      <SectionCard titulo="Indicadores principales">
        <IndicatorGrid medicionActual={medicionActual} analisis={analisis} filas={filas} />
      </SectionCard>

      {medicionActual.imc !== null && (
        <SectionCard titulo="Posición dentro del rango">
          <RangePositionSection imc={medicionActual.imc} filas={filas} />
        </SectionCard>
      )}

      <SectionCard titulo="Interpretación">
        <InsightsBlock insights={analisis.insights} />
      </SectionCard>

      <SectionCard titulo="Hallazgos">
        <FindingsBlock hallazgos={analisis.hallazgos} />
      </SectionCard>

      <SectionCard titulo="Comparación con la medición anterior">
        <ComparisonTable
          comparacion={analisis.comparacion}
          fechaAnterior={historico.length >= 2 ? historico[1].fecha : null}
          fechaActual={medicionActual.fecha}
        />
      </SectionCard>

      <SectionCard titulo="Evolución">
        <TrendsSection tendencias={tendencias} historico={historico} />
      </SectionCard>

      <SectionCard titulo="Historial de mediciones">
        <MeasurementTimeline historico={historico} onCorregir={onCorregirMedicion} />
      </SectionCard>

      <SectionCard titulo="Calidad del análisis">
        <DataQualitySection analisis={analisis} medicionActual={medicionActual} />
      </SectionCard>

      {hayLimitaciones && (
        <SectionCard titulo="Qué no puede interpretarse">
          <LimitationsBlock avisos={analisis.avisos} />
        </SectionCard>
      )}

      <SectionCard titulo="Metodología">
        <MethodologySection analisis={analisis} />
      </SectionCard>

      {fotografias.length > 0 && (
        <SectionCard titulo="Fotografías de progreso">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-3">
            {fotografias.map((f) => (
              // eslint-disable-next-line @next/next/no-img-element -- URL de Storage externa, sin dominio conocido para next/image
              <img
                key={f.url}
                src={f.url}
                alt={`Fotografía de progreso — ${f.fecha}`}
                className="w-full aspect-square object-cover rounded-xl border border-white/[0.07]"
              />
            ))}
          </div>
        </SectionCard>
      )}

      <ReportFooter clienteNombre={cliente.nombre} generadoEl={generadoEl} />
    </div>
  );
}
