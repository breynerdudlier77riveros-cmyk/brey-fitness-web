import PerformanceSection from "./PerformanceSection";
import InterpretationList from "./InterpretationList";
import type { Interpretacion } from "@/lib/pas/interpretation";

// ── Metodología (Sprint PAS-5.0) ───────────────────────────────────────────
// Las observaciones metodológicas del PIE, exactamente como las emitió. Este
// componente no añade ni una nota propia sobre el método: si algo falta aquí,
// falta en el motor de interpretación, y ahí es donde debe corregirse.

interface Props {
  interpretaciones: readonly Interpretacion[];
}

export default function PerformanceMethodology({ interpretaciones }: Props) {
  return (
    <PerformanceSection id="metodologia">
      <InterpretationList
        interpretaciones={interpretaciones}
        vacio="El motor de interpretación no emitió observaciones metodológicas."
      />
    </PerformanceSection>
  );
}
