// ── Orquestador del PAE (Sprint PAS-2.0) ───────────────────────────────────
// Punto de entrada único. Valida la forma de la solicitud, ejecuta la tubería
// y devuelve el PerformanceAnalysis.
//
// Puro y determinista: la misma solicitud produce el mismo resultado, con
// igualdad profunda. No lee el reloj, no consulta la red, no guarda nada.

import { ejecutar } from './motor';
import { esFechaISO } from './fechas';
import { CATALOGO_VACIO } from './tipos';
import type { CatalogoPruebas, EvaluacionPAS, SolicitudAnalisis } from './tipos';
import type { PerformanceAnalysis } from './resultado';

/**
 * Analiza el rendimiento de un atleta a partir de sus evaluaciones.
 *
 * @throws Si `hoyISO` no es una fecha `yyyy-mm-dd` válida. Es lo único que el
 *   motor rechaza de plano: sin fecha de referencia no puede evaluarse la
 *   vigencia, y continuar con una fecha inventada produciría un análisis que
 *   parece correcto y no lo es. Todo lo demás —datos ausentes, imposibles o
 *   contradictorios— se reporta, nunca se rechaza.
 */
export function analizarRendimiento(solicitud: SolicitudAnalisis): PerformanceAnalysis {
  if (!esFechaISO(solicitud.hoyISO)) {
    throw new Error(`PAE: hoyISO no es una fecha válida: ${solicitud.hoyISO}`);
  }

  return ejecutar(solicitud);
}

/**
 * Atajo para el caso de una sola evaluación, que es como llegará la mayoría
 * de las veces. El atleta se toma de la propia evaluación.
 */
export function analizarEvaluacion(
  evaluacion: EvaluacionPAS,
  catalogo: CatalogoPruebas,
  hoyISO: string
): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: evaluacion.atletaId,
    evaluaciones: [evaluacion],
    catalogo,
    hoyISO,
  });
}

/**
 * Análisis de un atleta sin ninguna evaluación.
 *
 * No es un caso de error: es el estado inicial de todo atleta, y el motor debe
 * describirlo igual de bien que un caso lleno — las 20 capacidades
 * desconocidas, con sus limitaciones declaradas.
 */
export function analisisVacio(atletaId: string, hoyISO: string): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId,
    evaluaciones: [],
    catalogo: CATALOGO_VACIO,
    hoyISO,
  });
}
