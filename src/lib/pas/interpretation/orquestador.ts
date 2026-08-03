// ── Orquestador del PIE (Sprint PAS-4.0) ───────────────────────────────────
// Punto de entrada único. Puro y determinista: el mismo análisis y la misma
// PKB producen el mismo informe, con igualdad profunda.
//
// No lee el reloj: la fecha del informe es la que el PAE ya fijó en sus
// coordenadas.

import { esRegla } from './reglas';
import { ejecutar, todasLasInterpretaciones } from './motor';
import { trazaCompleta } from './trazabilidad';
import { terminosProhibidos } from './vocabulario';
import { PKB_VACIA } from './tipos';
import type { PerformanceAnalysis } from '../resultado';
import type { ConocimientoPKB, PerformanceInterpretationReport } from './tipos';

/**
 * Interpreta un Perfil Funcional dentro de los límites autorizados por la PKB.
 *
 * @param analisis Perfil YA construido por el PAE. El PIE no lo recalcula.
 * @param pkb Conocimiento autorizado. Sin correspondencias, el informe
 *   describe un perfil que no puede caracterizarse — que es el estado real
 *   del sistema en v1.0, y no un error.
 */
export function interpretarRendimiento(
  analisis: PerformanceAnalysis,
  pkb: ConocimientoPKB = PKB_VACIA
): PerformanceInterpretationReport {
  return ejecutar(analisis, pkb);
}

/**
 * Comprueba que un informe cumple sus propias reglas.
 *
 * Se expone porque un consumidor puede querer verificarlo antes de mostrarlo,
 * y porque hace las pruebas más directas. Devuelve los problemas encontrados;
 * lista vacía significa informe conforme.
 */
export function auditarInforme(informe: PerformanceInterpretationReport): string[] {
  const problemas: string[] = [];

  for (const interpretacion of todasLasInterpretaciones(informe)) {
    if (!esRegla(interpretacion.regla)) {
      problemas.push(`regla no catalogada: ${interpretacion.regla}`);
    }

    if (!trazaCompleta(interpretacion)) {
      problemas.push(`traza incompleta: ${interpretacion.id}`);
    }

    const prohibidos = terminosProhibidos(interpretacion.texto);
    if (prohibidos.length > 0) {
      problemas.push(`léxico prohibido en ${interpretacion.id}: ${prohibidos.join(', ')}`);
    }

    if (interpretacion.texto.includes('{') || interpretacion.texto.includes('}')) {
      problemas.push(`hueco sin sustituir en ${interpretacion.id}`);
    }
  }

  return problemas;
}
