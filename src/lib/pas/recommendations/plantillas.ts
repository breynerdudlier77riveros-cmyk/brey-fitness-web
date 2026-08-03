// ── Acceso a las plantillas (Sprint PAS-6.0) ───────────────────────────────
// El catálogo vive en `plantillas-catalogo.ts` por tamaño. Aquí solo el
// índice y el guard: una plantilla desconocida debe fallar en el acto y no
// varias capas más abajo.

import { PLANTILLAS } from './plantillas-catalogo';

export { PLANTILLAS } from './plantillas-catalogo';
export type { Plantilla } from './plantillas-catalogo';

const INDICE = new Map(PLANTILLAS.map((plantilla) => [plantilla.id, plantilla]));

export function plantilla(id: string) {
  const encontrada = INDICE.get(id);
  if (!encontrada) throw new Error(`PPRE: plantilla desconocida: ${id}`);
  return encontrada;
}

export const TOTAL_PLANTILLAS = PLANTILLAS.length;
