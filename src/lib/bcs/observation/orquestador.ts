// ── Orquestador del Clinical Observation Generator (COG v1.0) ──────────────
// Punto de entrada único. Recorre el catálogo, construye las observaciones con
// su trazabilidad y las ensambla en bloques.
//
// Puro y determinista: mismas entradas → mismo informe, con igualdad profunda.
// No recalcula el análisis, no lee las mediciones, no consulta el reloj y no
// muta lo que recibe.

import { construirObservacion } from './constructor';
import { EVALUADORES, type Contexto } from './motor';
import { PLANTILLAS, TOTAL_PLANTILLAS } from './plantillas';
import { ensamblar } from './render';
import type { ClinicalObservationReport, EntradaObservacion, Observacion } from './tipos';

/**
 * Genera el informe de observaciones clínicas.
 *
 * @param entrada DTO ya construidos por el Analysis Engine y el Recommendation
 *   Engine. Este motor solo redacta lo que ellos determinaron.
 */
export function generarObservaciones(entrada: EntradaObservacion): ClinicalObservationReport {
  const contexto: Contexto = {
    analisis: entrada.analisis,
    recomendaciones: entrada.recomendaciones,
  };

  const observaciones: Observacion[] = [];

  // Orden fijo del catálogo: la reproducibilidad no depende del orden de
  // iteración de un objeto, sino de recorrer las claves ordenadas.
  for (const plantillaId of Object.keys(PLANTILLAS).sort()) {
    const evaluador = EVALUADORES[plantillaId];
    if (!evaluador) continue;

    for (const activacion of evaluador(contexto)) {
      const observacion = construirObservacion(plantillaId, activacion);
      if (observacion) observaciones.push(observacion);
    }
  }

  const informe = ensamblar(observaciones);

  return {
    ...informe,
    meta: { ...informe.meta, plantillasEvaluadas: TOTAL_PLANTILLAS },
  };
}
