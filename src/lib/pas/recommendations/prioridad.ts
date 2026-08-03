// ── Orden de las recomendaciones (Sprint PAS-6.0) ──────────────────────────
// Prioridad primero, después el orden editorial de categorías, y a igualdad
// el id. El último desempate no es cosmético: sin él dos ejecuciones sobre el
// mismo perfil podrían devolver el mismo conjunto en distinto orden, y el
// informe dejaría de ser comparable consigo mismo.

import { ORDEN_CATEGORIAS, PRIORIDADES } from './categorias';
import type { PrioridadRecomendacion, Recomendacion } from './tipos';

const RANGO: Readonly<Record<PrioridadRecomendacion, number>> = {
  critica: 0,
  alta: 1,
  media: 2,
  informativa: 3,
};

export function compararPrioridad(
  a: PrioridadRecomendacion,
  b: PrioridadRecomendacion
): number {
  return RANGO[a] - RANGO[b];
}

export function esMasPrioritaria(
  a: PrioridadRecomendacion,
  b: PrioridadRecomendacion
): boolean {
  return RANGO[a] < RANGO[b];
}

export function ordenar(recomendaciones: readonly Recomendacion[]): Recomendacion[] {
  return [...recomendaciones].sort((a, b) => {
    const porPrioridad = compararPrioridad(a.prioridad, b.prioridad);
    if (porPrioridad !== 0) return porPrioridad;

    const porCategoria =
      ORDEN_CATEGORIAS.indexOf(a.categoria) - ORDEN_CATEGORIAS.indexOf(b.categoria);
    if (porCategoria !== 0) return porCategoria;

    return a.id.localeCompare(b.id);
  });
}

export function deduplicar(recomendaciones: readonly Recomendacion[]): Recomendacion[] {
  const vistas = new Map<string, Recomendacion>();
  for (const recomendacion of recomendaciones) {
    if (!vistas.has(recomendacion.id)) vistas.set(recomendacion.id, recomendacion);
  }
  return [...vistas.values()];
}

export function ordenarYDeduplicar(
  recomendaciones: readonly Recomendacion[]
): Recomendacion[] {
  return ordenar(deduplicar(recomendaciones));
}

export function contarPorPrioridad(
  recomendaciones: readonly Recomendacion[]
): Record<PrioridadRecomendacion, number> {
  const conteo = Object.fromEntries(
    PRIORIDADES.map((p) => [p, 0])
  ) as Record<PrioridadRecomendacion, number>;

  for (const recomendacion of recomendaciones) conteo[recomendacion.prioridad] += 1;
  return conteo;
}
