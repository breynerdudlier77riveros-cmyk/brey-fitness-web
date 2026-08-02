// ── Constructor de observaciones (COG v1.0) ────────────────────────────────
// Toma la activación de una plantilla y produce la Observación final con su
// trazabilidad completa. Es el punto donde el conocimiento de la CKB se une al
// texto: la plantilla aporta las oraciones, la CKB aporta el permiso para
// afirmarlas y las limitaciones que deben acompañarlas.

import { CONOCIMIENTO, evidenciaCombinada, poblacionCombinada } from './conocimiento';
import { PLANTILLAS, type Activacion } from './plantillas';
import type { Observacion, Trazabilidad } from './tipos';

/** Límites de extensión exigidos: entre 2 y 5 oraciones por observación. */
export const MIN_ORACIONES = 2;
export const MAX_ORACIONES = 5;

/**
 * Recorta a MAX_ORACIONES conservando el orden. Nunca rellena para llegar al
 * mínimo: una plantilla que produzca menos de 2 oraciones es un defecto del
 * catálogo, no algo que el constructor deba disimular añadiendo texto.
 */
function ajustarExtension(oraciones: string[]): string[] {
  return oraciones.slice(0, MAX_ORACIONES);
}

export function construirObservacion(
  plantillaId: string,
  activacion: Activacion
): Observacion | null {
  const plantilla = PLANTILLAS[plantillaId];
  if (!plantilla) return null;

  const oraciones = ajustarExtension(activacion.oraciones);
  // Una observación sin la extensión mínima no se emite: preferimos el
  // silencio a una frase suelta sin contexto.
  if (oraciones.length < MIN_ORACIONES) return null;

  const claves = plantilla.conocimiento;
  const fichas = claves.map((c) => CONOCIMIENTO[c]);

  const trazabilidad: Trazabilidad = {
    ruleId: plantilla.id,
    findingIds: [...new Set(activacion.findingIds)],
    recommendationIds: [...new Set(activacion.recommendationIds)],
    referenceIds: [...new Set(fichas.flatMap((f) => f.referencias))],
    evidenceLevel: evidenciaCombinada(claves),
    population: poblacionCombinada(claves),
    limitationsUsed: [...new Set(fichas.flatMap((f) => f.limitaciones))],
    prohibitedInterpretations: [...new Set(fichas.flatMap((f) => f.prohibidas))],
    knowledgeIds: fichas.map((f) => f.fichaCkb),
  };

  return {
    id: activacion.discriminante ? `${plantilla.id}#${activacion.discriminante}` : plantilla.id,
    bloque: plantilla.bloque,
    texto: oraciones.join(' '),
    oraciones,
    variables: [...new Set(activacion.variables)],
    trazabilidad,
  };
}
