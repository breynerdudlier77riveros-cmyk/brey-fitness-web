// ── Comparación entre dos Mediciones (Sprint I-03) ─────────────────────────
// Recorre las 22 variables del CATALOGO y produce una fila por cada una,
// incluidas las que NO se pueden comparar: una variable ausente nunca
// desaparece del análisis en silencio, se reporta con su motivo
// (`disponibilidad`). Esto es lo que distingue esta capa de
// construirComparacion() en reporte.ts, que omite las filas incompletas
// porque su consumidor es una tabla visual.

import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import type { Medicion } from '@/lib/bcs/tipos';
import type { ComparacionMetrica, DireccionCambio, DisponibilidadComparacion, Significancia } from './tipos';

const VARIABLES = Object.keys(CATALOGO) as VariableId[];

/** Días calendario entre dos fechas `yyyy-mm-dd`. Puro: no consulta el reloj. */
export function diasEntre(fechaAnteriorISO: string, fechaActualISO: string): number {
  const a = Date.parse(`${fechaAnteriorISO}T00:00:00Z`);
  const b = Date.parse(`${fechaActualISO}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return Math.round((b - a) / 86_400_000);
}

function disponibilidadDe(anterior: number | null, actual: number | null): DisponibilidadComparacion {
  if (anterior === null && actual === null) return 'ambos_ausentes';
  if (anterior === null) return 'dato_anterior_ausente';
  if (actual === null) return 'dato_actual_ausente';
  return 'comparable';
}

function razonNoComparable(etiqueta: string, disponibilidad: DisponibilidadComparacion): string {
  switch (disponibilidad) {
    case 'ambos_ausentes':
      return `${etiqueta} no está registrada en ninguna de las dos mediciones.`;
    case 'dato_anterior_ausente':
      return `${etiqueta} no está registrada en la medición anterior, así que no hay contra qué comparar.`;
    case 'dato_actual_ausente':
      return `${etiqueta} no está registrada en la medición actual.`;
    default:
      return '';
  }
}

/**
 * Compara una Medición anterior contra la actual.
 *
 * Reglas que gobiernan cada campo:
 *  · null NUNCA se trata como 0 (BCS Handbook 05: una variable ausente se
 *    omite de la comparación, jamás se interpola).
 *  · `deltaPorcentual` es null si el valor anterior es 0 — no se divide por
 *    cero ni se sustituye por un 100 % inventado.
 *  · `significancia` solo puede ser `significativa`/`insignificante` cuando
 *    la variable tiene umbral documentado (Design Handbook 12: únicamente
 *    Peso 0.2 kg y % grasa 0.3 pp). Para las otras 20 es `no_definida`, y
 *    aun así la `direccion` sí se calcula: saber que subió es un hecho;
 *    saber si ese cambio importa, no.
 *  · `direccion` es `estable` solo con delta exactamente 0, o con delta bajo
 *    un umbral documentado. Sin umbral, cualquier delta distinto de 0 es
 *    aumento o disminución.
 */
export function compararMediciones(anterior: Medicion, actual: Medicion): ComparacionMetrica[] {
  return VARIABLES.map((variable) => {
    const def = CATALOGO[variable];
    const valorAnterior = anterior[variable];
    const valorActual = actual[variable];
    const disponibilidad = disponibilidadDe(valorAnterior, valorActual);

    const base = {
      variable,
      etiqueta: def.etiqueta,
      unidad: def.unidad,
      procedencia: def.procedencia,
      valorAnterior,
      valorActual,
      umbralAplicado: def.umbralInsignificante ?? null,
    };

    if (disponibilidad !== 'comparable') {
      return {
        ...base,
        deltaAbsoluto: null,
        deltaPorcentual: null,
        direccion: 'indeterminada' as DireccionCambio,
        significancia: 'no_definida' as Significancia,
        disponibilidad,
        razon: razonNoComparable(def.etiqueta, disponibilidad),
      };
    }

    // Estrechado por disponibilidad === 'comparable'.
    const previo = valorAnterior as number;
    const nuevo = valorActual as number;
    const deltaAbsoluto = nuevo - previo;
    const deltaPorcentual = previo !== 0 ? (deltaAbsoluto / previo) * 100 : null;
    const umbral = def.umbralInsignificante;

    let direccion: DireccionCambio;
    let significancia: Significancia;
    let razon: string;

    if (deltaAbsoluto === 0) {
      direccion = 'estable';
      significancia = umbral !== undefined ? 'insignificante' : 'no_definida';
      razon = `${def.etiqueta} no cambió entre las dos mediciones.`;
    } else if (umbral !== undefined && Math.abs(deltaAbsoluto) < umbral) {
      direccion = 'estable';
      significancia = 'insignificante';
      razon = `El cambio de ${def.etiqueta} (${deltaAbsoluto.toFixed(2)} ${def.unidad}) está por debajo del umbral de ${umbral} ${def.unidad} definido para esta variable, usado solo para reducir ruido visual.`;
    } else {
      direccion = deltaAbsoluto > 0 ? 'aumento' : 'disminucion';
      if (umbral !== undefined) {
        significancia = 'significativa';
        razon = `El cambio de ${def.etiqueta} supera el umbral de ${umbral} ${def.unidad} definido para esta variable.`;
      } else {
        significancia = 'no_definida';
        razon = `${def.etiqueta} ${deltaAbsoluto > 0 ? 'aumentó' : 'disminuyó'}, pero no hay un umbral definido para esta variable, así que no puede decirse si el cambio es relevante.`;
      }
    }

    return {
      ...base,
      deltaAbsoluto,
      deltaPorcentual,
      direccion,
      significancia,
      disponibilidad,
      razon,
    };
  });
}
