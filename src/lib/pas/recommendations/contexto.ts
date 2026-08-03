// ── Contexto de ejecución (Sprint PAS-6.0) ─────────────────────────────────
// Lo único que las reglas pueden mirar. No hay acceso a registros, pruebas ni
// resultados brutos: no llegan hasta aquí.

import type { CapacidadId } from '../capacidades';
import { definicionCapacidad } from '../capacidades';
import type { EstadoCapacidad, PerformanceAnalysis } from '../resultado';
import type { ConocimientoPKB, PerformanceInterpretationReport } from '../interpretation';

export interface ContextoPPRE {
  analisis: PerformanceAnalysis;
  informe: PerformanceInterpretationReport;
  pkb: ConocimientoPKB;
}

/** Capacidades activas —no reservadas— en un estado dado. */
export function enEstado(ctx: ContextoPPRE, estado: string): EstadoCapacidad[] {
  return ctx.analisis.capacidades.filter(
    (c) => c.estado === estado && !definicionCapacidad(c.capacidad).reservada
  );
}

export function reservadas(ctx: ContextoPPRE): EstadoCapacidad[] {
  return ctx.analisis.capacidades.filter((c) => definicionCapacidad(c.capacidad).reservada);
}

/**
 * Códigos de capacidad, ordenados.
 *
 * Se usan CÓDIGOS y no nombres en todo el texto emitido: varios nombres del
 * catálogo son término prohibido en este motor (ver `vocabulario.ts`).
 */
export function codigos(estados: readonly EstadoCapacidad[]): CapacidadId[] {
  return estados.map((e) => e.capacidad).sort();
}

/** Interpretaciones del PIE emitidas por una regla concreta. */
export function porRegla(ctx: ContextoPPRE, regla: string) {
  return [
    ...ctx.informe.porCapacidad,
    ...ctx.informe.observacionesMetodologicas,
    ...ctx.informe.interpretacionCobertura,
    ...ctx.informe.consistencia,
  ].filter((i) => i.regla === regla);
}

/** Fichas de la base cuyo estado coincide con alguno de los indicados. */
export function fichasPorEstado(ctx: ContextoPPRE, estados: readonly string[]) {
  return ctx.pkb.fichas
    .filter((f) => estados.includes(f.estado))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/** Fichas aplicables que declaran una limitación concreta. */
export function fichasConLimitacion(ctx: ContextoPPRE, limitacion: string) {
  return ctx.pkb.fichas
    .filter(
      (f) =>
        (f.estado === 'respaldada' || f.estado === 'parcialmente_respaldada') &&
        (f.limitaciones as readonly string[]).includes(limitacion)
    )
    .sort((a, b) => a.id.localeCompare(b.id));
}
