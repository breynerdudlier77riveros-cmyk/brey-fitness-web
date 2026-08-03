// ── Agrupaciones del informe (Sprint PAS-5.0) ──────────────────────────────
// Reparte las filas ya construidas en los grupos que consumen las secciones de
// dominios, cobertura y nivel de evidencia. Ninguna función de aquí decide
// nada: filtra por un campo que ya venía resuelto.

import type { DominioId } from '../capacidades';
import { DOMINIOS } from '../capacidades';
import type { PerformanceInterpretationReport } from '../interpretation';
import { ETIQUETA_NIVEL, ORDEN_NIVELES } from './secciones';
import type { FilaCapacidad, GrupoCobertura, GrupoDominio, GrupoEvidencia } from './tipos';

export function agruparPorDominio(
  filas: readonly FilaCapacidad[],
  informe: PerformanceInterpretationReport
): GrupoDominio[] {
  return (Object.keys(DOMINIOS) as DominioId[]).map((dominio) => ({
    dominio,
    nombre: DOMINIOS[dominio],
    capacidades: filas.filter((f) => f.dominio === dominio),
    interpretacion: informe.porDominio.find((i) => i.id.endsWith(`:${dominio}`)) ?? null,
  }));
}

const COBERTURA: readonly { clave: GrupoCobertura['clave']; etiqueta: string; estado: string }[] = [
  { clave: 'cubiertas', etiqueta: 'Cubiertas', estado: 'evaluada' },
  { clave: 'parciales', etiqueta: 'Parcialmente cubiertas', estado: 'parcialmente_evaluada' },
  { clave: 'desactualizadas', etiqueta: 'Con registros no vigentes', estado: 'desactualizada' },
  { clave: 'en_conflicto', etiqueta: 'Con datos no conciliables', estado: 'en_conflicto' },
  { clave: 'desconocidas', etiqueta: 'Desconocidas', estado: 'desconocida' },
];

/**
 * Las reservadas van en su propio grupo, nunca dentro de «desconocidas».
 *
 * «Fuera de alcance» y «desconocida» significan cosas distintas: la primera
 * dice que el sistema todavía no admite pruebas para esa capacidad; la
 * segunda, que las admite y no hay ninguna.
 */
export function agruparPorCobertura(filas: readonly FilaCapacidad[]): GrupoCobertura[] {
  const activas = filas.filter((f) => !f.reservada);

  const grupos: GrupoCobertura[] = COBERTURA.map(({ clave, etiqueta, estado }) => ({
    clave,
    etiqueta,
    capacidades: activas.filter((f) => f.estado === estado),
  }));

  grupos.push({
    clave: 'reservadas',
    etiqueta: 'Fuera de alcance en esta versión',
    capacidades: filas.filter((f) => f.reservada),
  });

  return grupos;
}

/** Solo los niveles con alguna capacidad: un grupo vacío no informa de nada. */
export function agruparPorEvidencia(filas: readonly FilaCapacidad[]): GrupoEvidencia[] {
  return ORDEN_NIVELES.map((nivel) => ({
    nivel,
    etiqueta: ETIQUETA_NIVEL[nivel],
    capacidades: filas.filter((f) => f.nivel === nivel),
  })).filter((grupo) => grupo.capacidades.length > 0);
}
