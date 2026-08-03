// ── Motor del PPRE (Sprint PAS-6.0) ────────────────────────────────────────
// Cuatro pasos en orden fijo sobre DTO ya resueltos:
//
//   1 · ejecutar las tres familias de reglas
//   2 · ordenar y deduplicar
//   3 · registrar qué reglas se ejecutaron y cuáles se descartaron
//   4 · componer estadísticas
//
// No calcula, no interpreta, no clasifica y no compara. Transforma
// interpretación validada en recomendaciones metodológicas.

import type { ContextoPPRE } from './contexto';
import { CATEGORIAS } from './categorias';
import { contarPorPrioridad, ordenarYDeduplicar } from './prioridad';
import { REGLAS } from './reglas';
import { reglasDeEstado } from './reglas-estado';
import { reglasDeEvidencia } from './reglas-evidencia';
import { reglasDePerfil } from './reglas-perfil';
import type {
  CategoriaRecomendacion,
  EstadisticasRecomendaciones,
  Recomendacion,
  ReglaDescartada,
} from './tipos';

export function ejecutarReglas(ctx: ContextoPPRE): Recomendacion[] {
  return ordenarYDeduplicar([
    ...reglasDeEstado(ctx),
    ...reglasDeEvidencia(ctx),
    ...reglasDePerfil(ctx),
  ]);
}

/**
 * Reglas del catálogo que no emitieron nada, con el motivo.
 *
 * Declararlas importa: sin esta lista, un consumidor no puede distinguir «esta
 * situación no se da» de «esta regla se olvidó de ejecutarse».
 */
export function reglasDescartadas(emitidas: readonly Recomendacion[]): ReglaDescartada[] {
  const activas = new Set(emitidas.map((r) => r.trazabilidad.regla));

  return REGLAS.filter((regla) => !activas.has(regla.id))
    .map((regla) => ({
      regla: regla.id,
      motivo: `No se cumple su condición: ${regla.disparador}.`,
    }))
    .sort((a, b) => a.regla.localeCompare(b.regla));
}

function contarPorCategoria(
  recomendaciones: readonly Recomendacion[]
): Record<CategoriaRecomendacion, number> {
  const conteo = Object.fromEntries(
    CATEGORIAS.map((c) => [c, 0])
  ) as Record<CategoriaRecomendacion, number>;

  for (const recomendacion of recomendaciones) conteo[recomendacion.categoria] += 1;
  return conteo;
}

export function calcularEstadisticas(
  recomendaciones: readonly Recomendacion[]
): EstadisticasRecomendaciones {
  const capacidades = new Set(recomendaciones.flatMap((r) => r.capacidades));

  return {
    total: recomendaciones.length,
    porPrioridad: contarPorPrioridad(recomendaciones),
    porCategoria: contarPorCategoria(recomendaciones),
    capacidadesImplicadas: capacidades.size,
    conReferencia: recomendaciones.filter((r) => r.referencias.length > 0).length,
    sinReferencia: recomendaciones.filter((r) => r.referencias.length === 0).length,
  };
}

/**
 * Resumen del informe: recuento, sin juicio.
 *
 * No destaca ninguna recomendación ni califica el perfil. Elegir cuál es «la
 * importante» sería interpretar, y este motor tiene esa puerta cerrada.
 */
export function componerResumen(
  recomendaciones: readonly Recomendacion[],
  estadisticas: EstadisticasRecomendaciones
): string {
  if (recomendaciones.length === 0) {
    return 'El perfil no activa ninguna regla del catálogo metodológico.';
  }

  const { critica, alta } = estadisticas.porPrioridad;

  return (
    `El perfil activa ${estadisticas.total} observaciones metodológicas ` +
    `(${critica} de prioridad crítica, ${alta} de prioridad alta) ` +
    `sobre ${estadisticas.capacidadesImplicadas} capacidades.`
  );
}
