// ── Orquestador del análisis de composición corporal (Sprint I-03) ─────────
// Función pura: mismas Mediciones → exactamente el mismo DTO, siempre. No
// toca Supabase, ni red, ni React, ni el reloj (la única fecha que usa es la
// que el llamador le pasa explícitamente), ni muta el arreglo recibido.
//
// El análisis es derivado y NO se persiste: no hay tabla, ni columna, ni
// caché — se recomputa en cada render, igual que el Reporte.

import type { Medicion } from '@/lib/bcs/tipos';
import { construirAvisos } from './alertas';
import { evaluarCalidad } from './calidad';
import { compararMediciones } from './comparacion';
import { construirHallazgos } from './hallazgos';
import { construirInsights } from './insights';
import { construirResumen } from './resumen';
import { calcularTendencias } from './tendencias';
import type { BodyCompositionAnalysis, Suficiencia } from './tipos';

export interface OpcionesAnalisis {
  /**
   * Fecha de referencia `yyyy-mm-dd` para detectar mediciones con fecha
   * futura. Es un parámetro y no `new Date()` interno a propósito: leer el
   * reloj aquí rompería el determinismo y haría los tests dependientes del
   * día en que corren.
   */
  hoyISO?: string;
}

function suficienciaGlobal(cantidad: number): Suficiencia {
  if (cantidad === 0) return 'sin_datos';
  if (cantidad === 1) return 'insuficiente';
  if (cantidad === 2) return 'parcial';
  return 'suficiente';
}

/**
 * Analiza el histórico de Mediciones de un Cliente.
 *
 * @param mediciones Mediciones vigentes en cualquier orden — la función las
 *   ordena internamente sobre una copia. Las `anuladas` no deberían llegar
 *   aquí (el repositorio ya las filtra); si llegan, se analizan igual pero
 *   se emite una alerta explícita, nunca se descartan en silencio.
 */
export function analizarComposicionCorporal(
  mediciones: readonly Medicion[],
  opciones: OpcionesAnalisis = {}
): BodyCompositionAnalysis {
  // Copia antes de ordenar — la entrada del llamador nunca se muta.
  const desc = [...mediciones].sort((a, b) => (a.fecha < b.fecha ? 1 : a.fecha > b.fecha ? -1 : 0));
  const asc = [...desc].reverse();
  const cantidadMediciones = desc.length;
  const suficiencia = suficienciaGlobal(cantidadMediciones);

  const actual = desc[0] ?? null;
  const anterior = desc[1] ?? null;

  const comparacion = actual && anterior ? compararMediciones(anterior, actual) : [];
  const tendencias = calcularTendencias(asc);
  const incidencias = evaluarCalidad({ historicoDesc: desc, hoyISO: opciones.hoyISO });
  const hallazgos = construirHallazgos({ comparacion, tendencias, incidencias, cantidadMediciones });
  const avisos = construirAvisos(incidencias);
  const insights = construirInsights(hallazgos);
  const resumen = construirResumen({ hallazgos, cantidadMediciones, suficiencia });

  return {
    medicionesAnalizadas: desc.map((m) => m.id),
    medicionActualId: actual?.id ?? null,
    medicionAnteriorId: anterior?.id ?? null,
    fechaInicial: asc[0]?.fecha ?? null,
    fechaFinal: desc[0]?.fecha ?? null,
    cantidadMediciones,
    suficiencia,
    comparacion,
    tendencias,
    hallazgos,
    avisos,
    insights,
    resumen,
  };
}
