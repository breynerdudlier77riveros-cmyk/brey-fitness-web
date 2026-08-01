import SectionCard from "@/features/composicion-corporal/components/SectionCard";

import ReportCover from "@/features/composicion-corporal/components/report/ReportCover";
import ReportFooter from "@/features/composicion-corporal/components/report/ReportFooter";
import ExecutiveSummary from "@/features/composicion-corporal/components/report/ExecutiveSummary";
import IndicatorGrid from "@/features/composicion-corporal/components/report/IndicatorGrid";
import BodyAnalysisSection from "@/features/composicion-corporal/components/report/BodyAnalysisSection";
import RangePositionSection from "@/features/composicion-corporal/components/report/RangePositionSection";
import ComparisonTable from "@/features/composicion-corporal/components/report/ComparisonTable";
import TrendsSection from "@/features/composicion-corporal/components/report/TrendsSection";
import TrendOverview from "@/features/composicion-corporal/components/report/TrendOverview";
import ProfessionalInterpretation from "@/features/composicion-corporal/components/report/ProfessionalInterpretation";
import MeasurementTimeline from "@/features/composicion-corporal/components/report/MeasurementTimeline";
import PhotoGallery from "@/features/composicion-corporal/components/report/PhotoGallery";
import ReportAppendix from "@/features/composicion-corporal/components/report/ReportAppendix";
import {
  AlertsBlock,
  FindingsBlock,
  InsightsBlock,
} from "@/features/composicion-corporal/components/report/AnalysisBlocks";

import type { Reporte } from "@/lib/bcs/reporte";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Vista del Reporte — ÚNICA implementación (BCS-ADR-05) ──────────────────
// La usan el panel del Entrenador (app/composicion-corporal/[clienteId]) y la
// vista pública (app/reportes/[token]): literalmente el mismo componente, sin
// prop de "modo". Los controles de edición viven en la página que lo envuelve,
// nunca aquí — eso garantiza la paridad de contenido por construcción.
//
// NO interpreta: compone. Toda cifra y todo texto llegan resueltos en
// `analisis` y `reporte`, calculados UNA vez en el Server Component de cada
// página. Aquí no se recorre el histórico ni se recalcula nada.
//
// El orden de las secciones (Sprint 3.0) está pensado para que un profesional
// entienda el caso leyendo solo las tres primeras: conclusión, luego lo que
// hay que revisar, luego la evidencia, y al final cómo se obtuvo.

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

      <SectionCard titulo="Análisis corporal">
        <BodyAnalysisSection ficha={ficha} />
      </SectionCard>

      {medicionActual.imc !== null && (
        <SectionCard titulo="Posición dentro del rango">
          <RangePositionSection imc={medicionActual.imc} filas={filas} />
        </SectionCard>
      )}

      <SectionCard titulo="Comparación con la medición anterior">
        <ComparisonTable
          comparacion={analisis.comparacion}
          fechaAnterior={historico.length >= 2 ? historico[1].fecha : null}
          fechaActual={medicionActual.fecha}
        />
      </SectionCard>

      <SectionCard titulo="Gráficas de evolución">
        <TrendsSection tendencias={tendencias} historico={historico} />
      </SectionCard>

      <SectionCard titulo="Tendencias por variable">
        <TrendOverview tendencias={analisis.tendencias} />
      </SectionCard>

      <SectionCard titulo="Interpretación profesional">
        <ProfessionalInterpretation analisis={analisis} />
      </SectionCard>

      <SectionCard titulo="Interpretaciones del análisis">
        <InsightsBlock insights={analisis.insights} />
      </SectionCard>

      <SectionCard titulo="Hallazgos">
        <FindingsBlock hallazgos={analisis.hallazgos} />
      </SectionCard>

      <SectionCard titulo="Historial de mediciones">
        <MeasurementTimeline historico={historico} onCorregir={onCorregirMedicion} />
      </SectionCard>

      <ReportAppendix
        analisis={analisis}
        medicionActual={medicionActual}
        clienteNombre={cliente.nombre}
      />

      {fotografias.length > 0 && (
        <SectionCard titulo="Fotografías de progreso">
          <PhotoGallery fotografias={fotografias} />
        </SectionCard>
      )}

      <ReportFooter clienteNombre={cliente.nombre} generadoEl={generadoEl} />
    </div>
  );
}
