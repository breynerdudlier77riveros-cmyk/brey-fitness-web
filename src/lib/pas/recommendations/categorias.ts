// ── Categorías y prioridades (Sprint PAS-6.0) ──────────────────────────────
// Ocho categorías y cuatro prioridades. Cerradas: ninguna regla puede
// inventar una nueva, y una prueba lo comprueba.
//
// La prioridad NO se calcula. La declara cada regla, y expresa qué impide
// leer el informe, no gravedad clínica: «crítica» es lo que invalida la
// lectura del perfil entero.

import type { CategoriaRecomendacion, PrioridadRecomendacion } from './tipos';

export const CATEGORIAS: readonly CategoriaRecomendacion[] = [
  'calidad_perfil',
  'cobertura',
  'evidencia',
  'reevaluacion',
  'consistencia',
  'interpretacion',
  'metodologia',
  'seguimiento_documental',
];

export const ETIQUETA_CATEGORIA: Readonly<Record<CategoriaRecomendacion, string>> = {
  calidad_perfil: 'Calidad del perfil',
  cobertura: 'Cobertura',
  evidencia: 'Evidencia',
  reevaluacion: 'Reevaluación',
  consistencia: 'Consistencia',
  interpretacion: 'Interpretación',
  metodologia: 'Metodología',
  seguimiento_documental: 'Seguimiento documental',
};

/** Orden editorial: lo que condiciona la lectura primero. */
export const ORDEN_CATEGORIAS: readonly CategoriaRecomendacion[] = [
  'consistencia',
  'calidad_perfil',
  'cobertura',
  'evidencia',
  'interpretacion',
  'metodologia',
  'reevaluacion',
  'seguimiento_documental',
];

export const PRIORIDADES: readonly PrioridadRecomendacion[] = [
  'critica',
  'alta',
  'media',
  'informativa',
];

export const ETIQUETA_PRIORIDAD: Readonly<Record<PrioridadRecomendacion, string>> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Media',
  informativa: 'Informativa',
};

export function esCategoria(valor: string): valor is CategoriaRecomendacion {
  return (CATEGORIAS as readonly string[]).includes(valor);
}

export function esPrioridad(valor: string): valor is PrioridadRecomendacion {
  return (PRIORIDADES as readonly string[]).includes(valor);
}
