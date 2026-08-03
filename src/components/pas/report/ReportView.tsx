import PerformanceHeader from "./PerformanceHeader";
import PerformanceExecutiveSummary from "./PerformanceExecutiveSummary";
import PerformanceFunctionalProfile from "./PerformanceFunctionalProfile";
import PerformanceDomainOverview from "./PerformanceDomainOverview";
import PerformanceInterpretations from "./PerformanceInterpretations";
import PerformanceCoverageSection from "./PerformanceCoverageSection";
import PerformanceEvidenceSection from "./PerformanceEvidenceSection";
import PerformanceMethodology from "./PerformanceMethodology";
import PerformanceLimitations from "./PerformanceLimitations";
import PerformanceAppendix from "./PerformanceAppendix";
import PerformanceFooter from "./PerformanceFooter";

import { componerInforme } from "@/lib/pas/report";
import type { PerformanceAnalysis } from "@/lib/pas";
import type { PerformanceInterpretationReport } from "@/lib/pas/interpretation";

// ── Vista del informe de rendimiento — ÚNICA implementación (PAS-5.0) ──────
// COMPONE. No calcula, no interpreta, no redacta.
//
// Recibe los dos DTO ya resueltos y no los modifica: `componerInforme` los lee
// y devuelve un modelo de vista nuevo. Todo el texto de las secciones 4, 5, 7
// y 8 es literalmente el que emitió el PIE.
//
// Desacoplado a propósito de dónde se muestre: no conoce rutas, ni sesión, ni
// token, ni props de «modo». Cuando exista la vista pública por token, será
// este mismo componente sin cambios — los controles viven en la página que lo
// envuelve, igual que en el Clinical Report del BCS (BCS-ADR-05).
//
// Sin navegación, sin botones, sin inputs, sin acordeones y sin estado: no
// lleva "use client" porque no lo necesita.

interface Props {
  /** Perfil funcional ya derivado por el PAE. */
  analisis: PerformanceAnalysis;
  /** Interpretaciones ya emitidas por el PIE sobre ESE mismo análisis. */
  interpretacion: PerformanceInterpretationReport;
  /** Nombre visible del atleta. Sin él se muestra su identificador. */
  atleta?: string;
}

export default function ReportView({ analisis, interpretacion, atleta }: Props) {
  const vista = componerInforme(analisis, interpretacion);

  return (
    <article
      className="reporte-pas-print space-y-6"
      aria-label="Informe de perfil funcional"
    >
      <PerformanceHeader apendice={vista.apendice} atleta={atleta} />

      <PerformanceExecutiveSummary
        vista={vista}
        resumen={interpretacion.resumenEjecutivo}
      />

      <PerformanceFunctionalProfile vista={vista} />

      <PerformanceDomainOverview dominios={vista.dominios} />

      <PerformanceInterpretations filas={vista.filas} />

      <PerformanceCoverageSection
        grupos={vista.cobertura}
        interpretaciones={interpretacion.interpretacionCobertura}
      />

      <PerformanceEvidenceSection grupos={vista.evidencia} />

      <PerformanceMethodology
        interpretaciones={interpretacion.observacionesMetodologicas}
      />

      <PerformanceLimitations interpretaciones={interpretacion.limitaciones} />

      <PerformanceAppendix apendice={vista.apendice} />

      <PerformanceFooter apendice={vista.apendice} />
    </article>
  );
}
