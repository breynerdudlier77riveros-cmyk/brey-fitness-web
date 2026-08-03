// ── Prioridad y orden (Sprint PAS-4.0) ─────────────────────────────────────
// La prioridad NO es gravedad clínica: es relevancia para entender el perfil.
// «Estructural» es lo que condiciona la lectura de todo lo demás —que el
// catálogo esté vacío, que el perfil sea inconsistente—, no lo más urgente.

import type { Interpretacion, PrioridadInterpretacion } from './tipos';

export const PRIORIDADES: readonly PrioridadInterpretacion[] = [
  'estructural',
  'alta',
  'media',
  'informativa',
];

const RANGO: Readonly<Record<PrioridadInterpretacion, number>> = {
  estructural: 0,
  alta: 1,
  media: 2,
  informativa: 3,
};

export function compararPrioridad(
  a: PrioridadInterpretacion,
  b: PrioridadInterpretacion
): number {
  return RANGO[a] - RANGO[b];
}

export function esMasPrioritaria(
  a: PrioridadInterpretacion,
  b: PrioridadInterpretacion
): boolean {
  return RANGO[a] < RANGO[b];
}

/**
 * Orden estable: prioridad, después id.
 *
 * El desempate por id no es cosmético — sin él, dos ejecuciones sobre los
 * mismos datos podrían devolver el mismo conjunto en distinto orden, y el
 * informe dejaría de ser comparable consigo mismo.
 */
export function ordenar(interpretaciones: readonly Interpretacion[]): Interpretacion[] {
  return [...interpretaciones].sort((a, b) => {
    const porPrioridad = compararPrioridad(a.prioridad, b.prioridad);
    if (porPrioridad !== 0) return porPrioridad;
    return a.id.localeCompare(b.id);
  });
}

/** Deduplica por id conservando la primera aparición. */
export function deduplicar(interpretaciones: readonly Interpretacion[]): Interpretacion[] {
  const vistas = new Map<string, Interpretacion>();
  for (const interpretacion of interpretaciones) {
    if (!vistas.has(interpretacion.id)) vistas.set(interpretacion.id, interpretacion);
  }
  return [...vistas.values()];
}

export function ordenarYDeduplicar(
  interpretaciones: readonly Interpretacion[]
): Interpretacion[] {
  return ordenar(deduplicar(interpretaciones));
}
