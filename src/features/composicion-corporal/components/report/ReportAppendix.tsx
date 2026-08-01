import SectionCard from "@/features/composicion-corporal/components/SectionCard";
import DataQualitySection from "./DataQualitySection";
import MethodologySection from "./MethodologySection";
import ConclusionSection from "./ConclusionSection";
import { LimitationsBlock } from "./AnalysisBlocks";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Cierre del documento (BCS Sprint 3.0) ──────────────────────────────────
// Las cuatro secciones finales forman una unidad editorial: cuánto respalda
// el dato lo afirmado, qué no pudo interpretarse, cómo se obtuvo todo, y el
// cierre. Van juntas porque se leen juntas — un profesional que audita el
// informe salta directamente aquí.

interface Props {
  analisis: BodyCompositionAnalysis;
  medicionActual: Medicion;
  clienteNombre: string;
}

export default function ReportAppendix({ analisis, medicionActual, clienteNombre }: Props) {
  const hayLimitaciones = analisis.avisos.some((a) => a.tipo === "limitacion" || a.tipo === "nota");

  return (
    <>
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

      <SectionCard titulo="Conclusión">
        <ConclusionSection analisis={analisis} clienteNombre={clienteNombre} />
      </SectionCard>
    </>
  );
}
