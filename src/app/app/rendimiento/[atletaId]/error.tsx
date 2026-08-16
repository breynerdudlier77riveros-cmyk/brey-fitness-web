"use client";

import ErrorState from "@/components/app/ErrorState";

// ── Error del expediente de un atleta (Sprint I-02) ────────────────────────
// Frontera propia, no heredada de `/rendimiento`: un fallo al cargar UN atleta
// no debe tumbar el listado, y el texto puede ser más preciso sobre qué falló.
//
// No afirma que el atleta no exista: eso lo resuelve `notFound()`. Aquí solo
// se sabe que la carga falló, y decir otra cosa sería inventar el motivo.

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      title="No se pudo cargar el expediente"
      description="Hubo un problema al consultar los datos de este atleta. Vuelve a intentarlo."
      onRetry={reset}
    />
  );
}
