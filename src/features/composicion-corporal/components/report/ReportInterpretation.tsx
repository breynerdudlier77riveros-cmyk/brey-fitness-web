import SectionCard from "@/features/composicion-corporal/components/SectionCard";
import ProfessionalInterpretation from "./ProfessionalInterpretation";
import RecommendationSection from "./RecommendationSection";
import { FindingsBlock, InsightsBlock } from "./AnalysisBlocks";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { RecommendationReport } from "@/lib/bcs/recommendations";

// ── Bloque interpretativo del informe (Sprint BCS-4.0) ─────────────────────
// Las cuatro secciones que traducen el análisis a lectura profesional, en el
// orden en que se leen: qué significa, qué hacer, qué combinaciones se
// demostraron y sobre qué hechos concretos se apoya todo.
//
// Van juntas porque comparten origen: ninguna añade interpretación propia,
// todas consumen el mismo BodyCompositionAnalysis ya resuelto.

interface Props {
  analisis: BodyCompositionAnalysis;
  recomendaciones: RecommendationReport;
}

export default function ReportInterpretation({ analisis, recomendaciones }: Props) {
  return (
    <>
      <SectionCard titulo="Interpretación profesional">
        <ProfessionalInterpretation analisis={analisis} />
      </SectionCard>

      <SectionCard titulo="Recomendaciones profesionales">
        <RecommendationSection informe={recomendaciones} />
      </SectionCard>

      <SectionCard titulo="Interpretaciones del análisis">
        <InsightsBlock insights={analisis.insights} />
      </SectionCard>

      <SectionCard titulo="Hallazgos">
        <FindingsBlock hallazgos={analisis.hallazgos} />
      </SectionCard>
    </>
  );
}
