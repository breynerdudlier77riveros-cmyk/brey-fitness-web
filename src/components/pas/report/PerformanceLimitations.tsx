import PerformanceSection from "./PerformanceSection";
import InterpretationList from "./InterpretationList";
import type { Interpretacion } from "@/lib/pas/interpretation";

// ── Limitaciones (Sprint PAS-5.0) ──────────────────────────────────────────
// Las limitaciones que el PIE emitió, sin añadir ninguna.
//
// Que la lista esté vacía es una afirmación fuerte —significa que nada acota
// la lectura del informe— y por eso el texto de vacío lo dice explícitamente
// en vez de dejar el hueco en blanco.

interface Props {
  interpretaciones: readonly Interpretacion[];
}

export default function PerformanceLimitations({ interpretaciones }: Props) {
  return (
    <PerformanceSection
      id="limitaciones"
      nota="Restricciones que acotan lo que este informe permite afirmar."
    >
      <InterpretationList
        interpretaciones={interpretaciones}
        vacio="El motor de interpretación no emitió limitaciones para este perfil."
      />
    </PerformanceSection>
  );
}
