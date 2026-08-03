"use client";

import ErrorState from "@/components/app/ErrorState";

// ── Error del Workspace (Sprint PAS-7.0) ───────────────────────────────────
// El fallo más probable de este módulo es que las tablas `pas_*` no existan
// todavía. El texto lo menciona porque es la causa que un profesional no puede
// diagnosticar por su cuenta y que sí puede reportar.

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      title="No se pudo cargar el módulo de rendimiento"
      description="Si el problema persiste, puede que las tablas del Performance Workspace no estén aplicadas en la base de datos."
      onRetry={reset}
    />
  );
}
