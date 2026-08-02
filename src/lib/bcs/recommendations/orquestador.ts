// ── Orquestador del Recommendation Engine (Sprint BCS-4.0) ─────────────────
// Punto de entrada único. Evalúa el catálogo, resuelve duplicados y
// conflictos, ordena y devuelve el informe completo.
//
// Puro y determinista: mismo BodyCompositionAnalysis → mismo resultado, con
// igualdad profunda. No recalcula el análisis, no lee las mediciones y no
// consulta el reloj.

import type { BodyCompositionAnalysis } from '@/lib/bcs/analysis';
import { ORDEN_CATEGORIAS } from './categorias';
import { evaluarReglas, totalReglas } from './motor';
import { compararPrioridad, esMasPrioritaria } from './prioridad';
import { LIMITACIONES_DE_ALCANCE } from './reglas';
import type {
  PrioridadRecomendacion,
  ProfessionalRecommendation,
  RecommendationReport,
} from './tipos';

/**
 * Resuelve duplicados y conflictos.
 *
 * Dos reglas pueden describir el mismo hecho desde ángulos distintos (por
 * ejemplo, un valor imposible que además queda fuera de rango). Cuando dos
 * recomendaciones comparten exactamente el mismo hallazgo de origen, se
 * conserva la de MAYOR prioridad: repetir el mismo problema dos veces con
 * distinta urgencia le resta credibilidad al informe.
 *
 * Las recomendaciones sin `origenHallazgos` (las de seguimiento, que dependen
 * del número de mediciones y no de un hallazgo concreto) nunca entran en este
 * arbitraje: no pueden colisionar con nada.
 */
function resolverConflictos(
  recomendaciones: ProfessionalRecommendation[]
): ProfessionalRecommendation[] {
  const porOrigen = new Map<string, ProfessionalRecommendation>();
  const sinOrigen: ProfessionalRecommendation[] = [];

  for (const rec of recomendaciones) {
    if (rec.origenHallazgos.length === 0) {
      sinOrigen.push(rec);
      continue;
    }

    const clave = [...rec.origenHallazgos].sort().join('|');
    const previa = porOrigen.get(clave);

    if (!previa || esMasPrioritaria(rec.prioridad, previa.prioridad)) {
      porOrigen.set(clave, rec);
    }
  }

  return [...porOrigen.values(), ...sinOrigen];
}

/** Deduplica por id: una misma regla nunca se emite dos veces con igual id. */
function deduplicarPorId(
  recomendaciones: ProfessionalRecommendation[]
): ProfessionalRecommendation[] {
  const vistos = new Set<string>();
  return recomendaciones.filter((r) => {
    if (vistos.has(r.id)) return false;
    vistos.add(r.id);
    return true;
  });
}

/** Prioridad primero; a igual prioridad, el orden editorial de categorías. */
function ordenar(recomendaciones: ProfessionalRecommendation[]): ProfessionalRecommendation[] {
  return [...recomendaciones].sort((a, b) => {
    const porPrioridad = compararPrioridad(a.prioridad, b.prioridad);
    if (porPrioridad !== 0) return porPrioridad;

    const porCategoria =
      ORDEN_CATEGORIAS.indexOf(a.categoria) - ORDEN_CATEGORIAS.indexOf(b.categoria);
    if (porCategoria !== 0) return porCategoria;

    // Desempate estable por id: sin esto, dos ejecuciones podrían diferir.
    return a.id.localeCompare(b.id);
  });
}

function contarPorPrioridad(
  recomendaciones: ProfessionalRecommendation[]
): Record<PrioridadRecomendacion, number> {
  const resumen: Record<PrioridadRecomendacion, number> = {
    alta: 0,
    media: 0,
    baja: 0,
    informativa: 0,
  };
  for (const rec of recomendaciones) resumen[rec.prioridad] += 1;
  return resumen;
}

/**
 * Genera el informe de recomendaciones profesionales.
 *
 * @param analisis Análisis ya construido por el Analysis Engine. Este motor
 *   NO vuelve a interpretar las mediciones: solo consume hallazgos,
 *   comparaciones, tendencias, avisos y resumen.
 */
export function generarRecomendaciones(
  analisis: BodyCompositionAnalysis
): RecommendationReport {
  const evaluadas = evaluarReglas(analisis);
  const recomendaciones = ordenar(deduplicarPorId(resolverConflictos(evaluadas)));

  return {
    recomendaciones,
    limitaciones: LIMITACIONES_DE_ALCANCE,
    resumen: contarPorPrioridad(recomendaciones),
    reglasEvaluadas: totalReglas(),
  };
}
