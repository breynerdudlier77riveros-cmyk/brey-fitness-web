// ── Máquina de estados del Workspace (Sprint PAS-7.0) ──────────────────────
// Qué transiciones existen y cuáles no. Vive aquí y no repartida por las
// acciones: una transición permitida en un sitio y prohibida en otro es el
// fallo más caro de un CRUD con estados.
//
// Ninguna transición es científica. Son reglas de expediente.

import type { EstadoAtleta, EstadoEvaluacion } from './tipos';

const ATLETA: Readonly<Record<EstadoAtleta, readonly EstadoAtleta[]>> = {
  activo: ['archivado', 'eliminado'],
  archivado: ['activo', 'eliminado'],
  // Terminal: un atleta eliminado no se reactiva. El borrado es lógico para
  // conservar el histórico, no para poder deshacerlo.
  eliminado: [],
};

const EVALUACION: Readonly<Record<EstadoEvaluacion, readonly EstadoEvaluacion[]>> = {
  borrador: ['completada', 'anulada'],
  completada: ['compartida', 'archivada', 'anulada'],
  compartida: ['completada', 'archivada', 'anulada'],
  archivada: ['completada'],
  // Terminal, como la anulación de un registro en el PAE.
  anulada: [],
};

export function transicionesAtleta(desde: EstadoAtleta): readonly EstadoAtleta[] {
  return ATLETA[desde];
}

export function transicionesEvaluacion(desde: EstadoEvaluacion): readonly EstadoEvaluacion[] {
  return EVALUACION[desde];
}

export function puedeTransicionarAtleta(desde: EstadoAtleta, hasta: EstadoAtleta): boolean {
  return ATLETA[desde].includes(hasta);
}

export function puedeTransicionarEvaluacion(
  desde: EstadoEvaluacion,
  hasta: EstadoEvaluacion
): boolean {
  return EVALUACION[desde].includes(hasta);
}

/** Estados en los que la evaluación admite añadir o anular registros. */
export function admiteRegistros(estado: EstadoEvaluacion): boolean {
  return estado === 'borrador';
}

/**
 * Estados en los que se deriva el informe.
 *
 * Una evaluación anulada NO deriva: su informe daría una lectura de datos que
 * el profesional retiró. Un borrador sí, para que pueda revisarse antes de
 * cerrarlo.
 */
export function admiteInforme(estado: EstadoEvaluacion): boolean {
  return estado !== 'anulada';
}

export function esVisibleEnListado(estado: EstadoAtleta): boolean {
  return estado !== 'eliminado';
}

export const ETIQUETA_ESTADO_ATLETA: Readonly<Record<EstadoAtleta, string>> = {
  activo: 'Activo',
  archivado: 'Archivado',
  eliminado: 'Eliminado',
};

export const ETIQUETA_ESTADO_EVALUACION: Readonly<Record<EstadoEvaluacion, string>> = {
  borrador: 'Borrador',
  completada: 'Completada',
  anulada: 'Anulada',
  compartida: 'Compartida',
  archivada: 'Archivada',
};
