// ── Prioridad de recomendación (Sprint BCS-4.0) ────────────────────────────
// La prioridad NO se calcula: viene fijada en el catálogo de reglas, y cada
// regla justifica la suya con su evidencia. Aquí solo vive la semántica de
// cada nivel y el orden de presentación.
//
// Deliberadamente no hay puntuación numérica ni ponderación: cualquier
// fórmula que combinara varias señales en un número sería una heurística
// inventada, que es exactamente lo que el encargo prohíbe.

import type { PrioridadRecomendacion } from './tipos';

interface DefinicionPrioridad {
  id: PrioridadRecomendacion;
  etiqueta: string;
  /** Cuándo corresponde este nivel. Criterio único y verificable. */
  criterio: string;
}

export const PRIORIDADES: Record<PrioridadRecomendacion, DefinicionPrioridad> = {
  alta: {
    id: 'alta',
    etiqueta: 'Alta',
    criterio:
      'El dato registrado presenta una inconsistencia verificable que condiciona la lectura del resto del informe.',
  },
  media: {
    id: 'media',
    etiqueta: 'Media',
    criterio:
      'Falta información para completar el análisis, o hay un valor que conviene confirmar antes de considerarlo definitivo.',
  },
  baja: {
    id: 'baja',
    etiqueta: 'Baja',
    criterio: 'Acción de continuidad que no bloquea la interpretación actual.',
  },
  informativa: {
    id: 'informativa',
    etiqueta: 'Informativa',
    criterio: 'Precisión sobre el alcance de lo interpretado. No requiere ninguna acción.',
  },
};

const PESO: Record<PrioridadRecomendacion, number> = {
  alta: 0,
  media: 1,
  baja: 2,
  informativa: 3,
};

/** Comparador para ordenar de mayor a menor prioridad. Estable y puro. */
export function compararPrioridad(a: PrioridadRecomendacion, b: PrioridadRecomendacion): number {
  return PESO[a] - PESO[b];
}

export function esMasPrioritaria(a: PrioridadRecomendacion, b: PrioridadRecomendacion): boolean {
  return PESO[a] < PESO[b];
}
