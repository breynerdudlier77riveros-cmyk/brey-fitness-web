// ── NIE-1.5 · la operación de conversión ───────────────────────────────────
//
// Mecanismo. La política —qué se autoriza y por qué— vive en `conversiones.ts`,
// y este módulo no la reabre: consulta la tabla y obedece.
//
// Tres reglas que gobiernan el diseño:
//
//   1. **Inmutabilidad.** El valor y la unidad originales nunca se sustituyen:
//      el resultado los lleva junto a los convertidos.
//   2. **Sin falsa precisión.** Convertir 30,7 kgf no autoriza a presentar
//      67,68969... lbf como si la fuente hubiera medido con esa resolución.
//   3. **Sin acoplamiento.** Esta capa no se aplica sola. `UNIT_MISMATCH` sigue
//      bloqueando la aplicabilidad, y convertir es una decisión externa que
//      debe declararse.
//
// Módulo puro.

import {
  ADVERTENCIA_METODOLOGICA,
  entradaDe,
  type FactorConversion,
} from './conversiones';
import type { Unidad } from './tipos';

/** De dónde salió el factor empleado. */
export interface TrazabilidadConversion {
  factor: number;
  exacto: boolean;
  definicion: string;
  referencia: string;
}

export interface ValorConvertido {
  valorOriginal: number;
  unidadOriginal: Unidad;
  /** Resultado aritmético completo. No se redondea: se conserva. */
  valorConvertido: number;
  unidadDestino: Unidad;
  /**
   * El convertido, redondeado a los decimales que traía el original.
   *
   * Es lo que debe mostrarse. `valorConvertido` es lo que debe usarse para
   * volver a convertir, porque redondear dos veces pierde información.
   */
  representacion: number;
  /** Decimales significativos del valor original. */
  decimalesOriginales: number;
  operacion: 'CONVERSION_UNIDAD' | 'IDENTIDAD';
  trazabilidad: TrazabilidadConversion;
  advertencia: string;
}

export type ResultadoConversion =
  | { estado: 'CONVERTIDO'; conversion: ValorConvertido }
  /** Origen y destino coinciden: no hay nada que convertir. */
  | { estado: 'IDENTIDAD'; conversion: ValorConvertido }
  | {
      estado: 'NO_AUTORIZADA';
      unidadOriginal: Unidad;
      unidadDestino: Unidad;
      valorOriginal: number;
      motivo: string;
    };

/**
 * Decimales significativos de un número, tal como se escribió.
 *
 * `30.7` → 1 · `30` → 0 · `30.70` → 1, porque en coma flotante el cero final
 * ya se ha perdido antes de llegar aquí. Es una limitación conocida: la
 * precisión declarada por la fuente vive en su ficha, no en el `number`.
 */
export function decimalesDe(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  const texto = String(valor);
  if (texto.includes('e') || texto.includes('E')) return 0;
  const punto = texto.indexOf('.');
  return punto === -1 ? 0 : texto.length - punto - 1;
}

function redondearA(valor: number, decimales: number): number {
  const f = 10 ** decimales;
  return Math.round(valor * f) / f;
}

/**
 * Convierte un valor entre unidades.
 *
 * Nunca lanza: un par no autorizado devuelve `NO_AUTORIZADA` con su motivo, que
 * es información y no un fallo.
 */
export function convertir(
  valor: number,
  origen: Unidad,
  destino: Unidad,
): ResultadoConversion {
  const decimalesOriginales = decimalesDe(valor);

  if (origen === destino) {
    return {
      estado: 'IDENTIDAD',
      conversion: {
        valorOriginal: valor,
        unidadOriginal: origen,
        valorConvertido: valor,
        unidadDestino: destino,
        representacion: valor,
        decimalesOriginales,
        operacion: 'IDENTIDAD',
        trazabilidad: {
          factor: 1,
          exacto: true,
          definicion: 'Origen y destino son la misma unidad',
          referencia: 'No se aplica ningún factor',
        },
        advertencia: ADVERTENCIA_METODOLOGICA,
      },
    };
  }

  const entrada = entradaDe(origen, destino);

  if (!entrada || entrada.estado === 'NO_AUTORIZADO') {
    return {
      estado: 'NO_AUTORIZADA',
      unidadOriginal: origen,
      unidadDestino: destino,
      valorOriginal: valor,
      motivo:
        entrada?.motivo ??
        `El par ${origen} → ${destino} no está declarado en la tabla de conversiones. La tabla es cerrada: lo no declarado no se convierte`,
    };
  }

  const f: FactorConversion = entrada;
  const valorConvertido = valor * f.factor;

  return {
    estado: 'CONVERTIDO',
    conversion: {
      valorOriginal: valor,
      unidadOriginal: origen,
      valorConvertido,
      unidadDestino: destino,
      representacion: redondearA(valorConvertido, decimalesOriginales),
      decimalesOriginales,
      operacion: 'CONVERSION_UNIDAD',
      trazabilidad: {
        factor: f.factor,
        exacto: f.exacto,
        definicion: f.definicion,
        referencia: f.referencia,
      },
      advertencia: ADVERTENCIA_METODOLOGICA,
    },
  };
}

/** `true` si el par puede convertirse. No dice si *conviene* hacerlo. */
export function esConvertible(origen: Unidad, destino: Unidad): boolean {
  if (origen === destino) return true;
  return entradaDe(origen, destino)?.estado === 'AUTORIZADO';
}
