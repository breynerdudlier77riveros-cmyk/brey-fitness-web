"use client";

import ErrorState from "@/components/app/ErrorState";

// ── Error de una evaluación (Sprint I-02) ──────────────────────────────────
// Esta ruta lee la NKB del disco además de la base de datos, así que tiene una
// causa de fallo que las demás no: que las fichas normativas no hayan llegado
// al artefacto de producción.
//
// Aun así el texto NO afirma cuál de las dos ocurrió: la frontera de error solo
// sabe que algo lanzó. El informe normativo distingue internamente el origen
// —NKB o registros— cuando llega a construirse; si ni siquiera llegó, decir el
// motivo aquí sería adivinarlo.

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      title="No se pudo cargar la evaluación"
      description="Hubo un problema al derivar el informe. Es un fallo técnico, no una conclusión sobre las mediciones registradas."
      onRetry={reset}
    />
  );
}
