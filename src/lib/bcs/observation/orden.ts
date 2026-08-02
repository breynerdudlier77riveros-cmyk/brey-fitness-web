// ── Orden editorial de los bloques (COG v1.0) ──────────────────────────────
// Secuencia en que se lee un informe clínico: primero el alcance de lo que
// puede afirmarse, después lo que condiciona la lectura, luego la evidencia, y
// al final los límites y el cierre.
//
// Es una decisión editorial, no de prioridad. Por eso vive separada de
// prioridad.ts, que ordena dentro de cada bloque.

import type { BloqueObservacion } from './tipos';

export const ORDEN_BLOQUES: BloqueObservacion[] = [
  'executive',
  'measurement_quality',
  'body_composition',
  'trend',
  'interpretation',
  'recommendation_summary',
  'scientific_limitations',
  'overall_summary',
];

export const TITULO_BLOQUE: Record<BloqueObservacion, string> = {
  executive: 'Observación general',
  measurement_quality: 'Calidad de la medición',
  body_composition: 'Composición corporal',
  trend: 'Evolución de la serie',
  interpretation: 'Interpretación',
  recommendation_summary: 'Síntesis de recomendaciones',
  scientific_limitations: 'Límites de la interpretación',
  overall_summary: 'Cierre',
};

/**
 * `measurement_quality` va ANTES que composición y evolución a propósito: si
 * el registro es inconsistente, las observaciones sobre el cuerpo no son
 * interpretables (CKB 09, ficha patron-error-de-medicion). Leerlas primero y
 * descubrir después que el dato era dudoso invierte el orden de la duda.
 */
export function indiceDeBloque(bloque: BloqueObservacion): number {
  return ORDEN_BLOQUES.indexOf(bloque);
}
