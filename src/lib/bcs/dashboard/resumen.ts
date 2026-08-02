// ── Filtros del dashboard (Sprint BCS-5.0) ─────────────────────────────────
// Filtrado POSTERIOR sobre datos ya cargados: ninguna consulta se repite al
// cambiar de filtro. Es lo que permite que el selector sea instantáneo y que
// la capa siga siendo pura.

import type { ClienteIndexado } from './clientes';
import { vigentes } from './clientes';
import type { FilaSeguimiento, FiltroDashboard } from './tipos';

interface DefinicionFiltro {
  etiqueta: string;
  aplica: (c: ClienteIndexado) => boolean;
}

export const FILTROS: Record<FiltroDashboard, DefinicionFiltro> = {
  todos: { etiqueta: 'Todos', aplica: () => true },
  activos: { etiqueta: 'Activos', aplica: (c) => c.cliente.estado === 'activo' },
  archivados: { etiqueta: 'Archivados', aplica: (c) => c.cliente.estado === 'archivado' },
  con_seguimiento: { etiqueta: 'Con seguimiento', aplica: (c) => c.tieneSeguimiento },
  sin_seguimiento: { etiqueta: 'Sin seguimiento', aplica: (c) => !c.tieneSeguimiento },
  con_enlace: { etiqueta: 'Con enlace', aplica: (c) => c.tieneEnlaceActivo },
  sin_enlace: { etiqueta: 'Sin enlace', aplica: (c) => !c.tieneEnlaceActivo },
};

export const ORDEN_FILTROS: FiltroDashboard[] = [
  'todos',
  'activos',
  'archivados',
  'con_seguimiento',
  'sin_seguimiento',
  'con_enlace',
  'sin_enlace',
];

/** Aplica un filtro al índice. Los eliminados nunca entran en ningún filtro. */
export function filtrarIndice(
  indice: readonly ClienteIndexado[],
  filtro: FiltroDashboard
): ClienteIndexado[] {
  return vigentes(indice).filter(FILTROS[filtro].aplica);
}

/** Aplica el mismo criterio sobre filas de seguimiento ya construidas. */
export function filtrarSeguimiento(
  filas: readonly FilaSeguimiento[],
  filtro: FiltroDashboard
): FilaSeguimiento[] {
  switch (filtro) {
    case 'todos':
      return [...filas];
    case 'activos':
      return filas.filter((f) => f.estado === 'activo');
    case 'archivados':
      return filas.filter((f) => f.estado === 'archivado');
    case 'con_seguimiento':
      return filas.filter((f) => f.totalMediciones >= 2);
    case 'sin_seguimiento':
      return filas.filter((f) => f.totalMediciones < 2);
    case 'con_enlace':
      return filas.filter((f) => f.tieneEnlaceActivo);
    case 'sin_enlace':
      return filas.filter((f) => !f.tieneEnlaceActivo);
  }
}

/** Recuento por filtro, para mostrarlo junto a cada opción del selector. */
export function contarPorFiltro(
  indice: readonly ClienteIndexado[]
): Record<FiltroDashboard, number> {
  const resultado = {} as Record<FiltroDashboard, number>;
  for (const filtro of ORDEN_FILTROS) {
    resultado[filtro] = filtrarIndice(indice, filtro).length;
  }
  return resultado;
}
