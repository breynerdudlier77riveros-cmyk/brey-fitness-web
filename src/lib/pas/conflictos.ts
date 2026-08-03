// ── Conflictos: punto de reunión (Sprint PAS-2.0) ──────────────────────────
// Reúne las tres familias de detección —catálogo, estructura de la evaluación
// y contenido del registro— y devuelve una lista ordenada y sin repetidos.
//
// Los conflictos NO se resuelven (PAS-ADR-04, I-07). Este módulo tampoco
// prioriza entre ellos: ordenar por gravedad exigiría un criterio de gravedad,
// y ninguna fuente lo define.

import { conflictosDeCatalogo } from './conflictos-catalogo';
import { conflictosDeEvaluaciones } from './conflictos-evaluacion';
import { conflictosDeRegistros } from './conflictos-registro';
import type { CatalogoPruebas, DefinicionPrueba, EvaluacionPAS } from './tipos';
import type { Conflicto } from './resultado';

export { conflictosDeCatalogo } from './conflictos-catalogo';
export { conflictosDeEvaluaciones } from './conflictos-evaluacion';
export { conflictosDeRegistros } from './conflictos-registro';

/**
 * Deduplica por id y ordena. Dos detectores pueden señalar el mismo hecho
 * —una prueba no catalogada la ven tanto REG-01 como la elegibilidad—, y el
 * informe no debe contarlo dos veces.
 */
export function ordenarConflictos(conflictos: readonly Conflicto[]): Conflicto[] {
  const unicos = new Map<string, Conflicto>();
  for (const conflicto of conflictos) {
    if (!unicos.has(conflicto.id)) unicos.set(conflicto.id, conflicto);
  }
  return [...unicos.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function detectarConflictos(
  evaluaciones: readonly EvaluacionPAS[],
  catalogo: CatalogoPruebas,
  indice: ReadonlyMap<string, DefinicionPrueba>,
  atletaId: string,
  hoyISO: string
): Conflicto[] {
  return ordenarConflictos([
    ...conflictosDeCatalogo(catalogo),
    ...conflictosDeEvaluaciones(evaluaciones, atletaId, hoyISO),
    ...conflictosDeRegistros(evaluaciones, indice),
  ]);
}

/** Ids de registro implicados en algún conflicto de resultado divergente. */
export function registrosDivergentes(conflictos: readonly Conflicto[]): Set<string> {
  const ids = new Set<string>();
  for (const conflicto of conflictos) {
    if (conflicto.tipo !== 'resultado_divergente') continue;
    for (const registro of conflicto.registros) ids.add(registro);
  }
  return ids;
}
