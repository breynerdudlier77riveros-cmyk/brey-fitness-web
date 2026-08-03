// ── Orquestador del PPRE (Sprint PAS-6.0) ──────────────────────────────────
// Punto de entrada único. Puro y determinista: el mismo perfil, el mismo
// informe y la misma base producen el mismo resultado, con igualdad profunda.
//
// No lee el reloj: la fecha procede de las coordenadas que el PAE ya fijó.

import type { PerformanceAnalysis } from '../resultado';
import type { ConocimientoPKB, PerformanceInterpretationReport } from '../interpretation';
import { PKB_VACIA } from '../interpretation';
import { LIMITACIONES_DE_ALCANCE } from './casos-rechazados';
import { esCategoria, esPrioridad } from './categorias';
import { trazaCompleta } from './constructor';
import {
  calcularEstadisticas,
  componerResumen,
  ejecutarReglas,
  reglasDescartadas,
} from './motor';
import { esRegla } from './reglas';
import { auditarTextos } from './vocabulario';
import { VERSION_PPRE } from './version';
import type { PerformanceRecommendationReport } from './tipos';

/**
 * Genera las recomendaciones metodológicas de un Perfil Funcional.
 *
 * @param analisis Perfil YA derivado por el PAE. No se recalcula.
 * @param informe Interpretaciones YA emitidas por el PIE sobre ESE análisis.
 * @param pkb Conocimiento autorizado. Sin correspondencias, el motor describe
 *   un perfil que no puede caracterizarse — estado real del sistema en v1.0.
 */
export function generarRecomendaciones(
  analisis: PerformanceAnalysis,
  informe: PerformanceInterpretationReport,
  pkb: ConocimientoPKB = PKB_VACIA
): PerformanceRecommendationReport {
  const recomendaciones = ejecutarReglas({ analisis, informe, pkb });
  const estadisticas = calcularEstadisticas(recomendaciones);

  return {
    meta: {
      versionMotor: VERSION_PPRE,
      versionPAE: informe.meta.versionPAE,
      versionPIE: informe.meta.versionMotor,
      versionPKB: pkb.version,
      versionCatalogo: informe.meta.versionCatalogo,
      calculadoEn: informe.meta.calculadoEn,
      atletaId: informe.meta.atletaId,
    },
    resumen: componerResumen(recomendaciones, estadisticas),
    recomendaciones,
    estadisticas,
    limitacionesGenerales: [...LIMITACIONES_DE_ALCANCE],
    reglasEjecutadas: recomendaciones.map((r) => r.trazabilidad.regla).sort(),
    reglasDescartadas: reglasDescartadas(recomendaciones),
  };
}

/**
 * Comprueba que un informe cumple sus propias reglas.
 *
 * Se expone porque un consumidor puede querer verificarlo antes de mostrarlo,
 * y porque hace las pruebas más directas. Lista vacía = informe conforme.
 */
export function auditarRecomendaciones(
  informe: PerformanceRecommendationReport
): string[] {
  const problemas: string[] = [];

  for (const recomendacion of informe.recomendaciones) {
    if (!esRegla(recomendacion.trazabilidad.regla)) {
      problemas.push(`regla no catalogada: ${recomendacion.trazabilidad.regla}`);
    }
    if (!esCategoria(recomendacion.categoria)) {
      problemas.push(`categoría no catalogada: ${recomendacion.categoria}`);
    }
    if (!esPrioridad(recomendacion.prioridad)) {
      problemas.push(`prioridad no catalogada: ${recomendacion.prioridad}`);
    }
    if (!trazaCompleta(recomendacion)) {
      problemas.push(`traza incompleta: ${recomendacion.id}`);
    }
    if (recomendacion.descripcion.includes('{') || recomendacion.titulo.includes('{')) {
      problemas.push(`hueco sin sustituir en ${recomendacion.id}`);
    }
  }

  // La guarda léxica se aplica al informe ENTERO, no solo a los textos
  // renderizados: `fundamento` y `limitaciones` los escribe cada regla a mano
  // y no pasan por `render()`.
  problemas.push(...auditarTextos(informe));

  return problemas;
}
