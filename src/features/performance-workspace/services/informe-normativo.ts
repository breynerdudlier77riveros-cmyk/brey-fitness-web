// ── Orquestación del informe normativo (Sprint PRS-2.1) ────────────────────
//
// El único sitio del Workspace donde se encadena NKB → NIE → informe v2.
//
// ENCADENA. No decide nada: no evalúa aplicabilidad, no elige norma, no compara
// y no convierte. Cada una de esas decisiones vive en su capa, y aquí solo se
// pasan los datos de una a la siguiente.
//
// Se ejecuta en servidor: `cargarNormas` lee las fichas de la NKB del disco.
// Ninguna pantalla lo llama, y ningún componente lo importa.

import { cargarNormas } from '@/lib/nie/nkb/cargador';
import type { NormaNKB } from '@/lib/nie';
import { consultarEvaluacion } from '@/lib/pas/normativo';
import {
  componerInformeNormativo,
  type DatosPortada,
  type InformeNormativoV2,
} from '@/lib/pas/report-v2';

import { aRegistroPAE } from './mapeo';
import { resolverSujeto, type CoordenadaAusente } from './sujeto';
import type { Atleta, RegistroWorkspace } from '../schemas/tipos';

/**
 * Las normas, cargadas una sola vez por proceso.
 *
 * Son 356 normas repartidas en 15 ficheros Markdown que se analizan al leerlos.
 * Hacerlo en cada petición sería repetir un trabajo cuyo resultado no cambia
 * entre peticiones: las fichas son ficheros del repositorio, no datos vivos.
 *
 * La caché es perezosa a propósito. Si fuera de módulo, importar este fichero
 * tocaría el disco aunque nadie pidiera un informe, y los tests de otras capas
 * pagarían esa lectura sin usarla.
 */
let cache: readonly NormaNKB[] | null = null;

export function normasNKB(): readonly NormaNKB[] {
  cache ??= cargarNormas();
  return cache;
}

export type ResultadoInformeNormativo =
  | { estado: 'DISPONIBLE'; informe: InformeNormativoV2 }
  | {
      /**
       * El expediente del atleta no permite construir el sujeto normativo.
       *
       * **No es un fallo del atleta ni del sistema**: es una carencia de datos
       * de identidad que nadie ha registrado todavía.
       */
      estado: 'SUJETO_INCOMPLETO';
      ausentes: readonly CoordenadaAusente[];
      detalle: string;
    }
  | {
      /** La evaluación no contiene ninguna medición que comparar. */
      estado: 'SIN_MEDICIONES';
      detalle: string;
    };

export interface EntradaInformeNormativo {
  atleta: Atleta;
  registros: readonly RegistroWorkspace[];
  /** Fecha de referencia. Se recibe: ninguna capa pura lee el reloj. */
  hoyISO: string;
  portada: DatosPortada;
  /** Solo para pruebas: permite inyectar la NKB sin tocar el disco. */
  normas?: readonly NormaNKB[];
}

/**
 * Construye el informe normativo de una evaluación.
 *
 * Orden de comprobación, y detenerse es el resultado correcto:
 *
 *   1. Sin mediciones → no hay nada que situar.
 *   2. Sujeto incompleto → no se fabrica uno parcial ni se toman datos
 *      prestados del profesional.
 *   3. Con ambos → se consulta y se compone, sin tocar el resultado.
 */
export function construirInformeNormativo(
  entrada: EntradaInformeNormativo,
): ResultadoInformeNormativo {
  if (entrada.registros.length === 0) {
    return {
      estado: 'SIN_MEDICIONES',
      detalle:
        'Esta evaluación todavía no tiene pruebas registradas. Sin una medición no hay nada que ' +
        'situar en una norma.',
    };
  }

  const sujeto = resolverSujeto(entrada.atleta, entrada.hoyISO);
  if (sujeto.estado === 'INCOMPLETO') {
    return { estado: 'SUJETO_INCOMPLETO', ausentes: sujeto.ausentes, detalle: sujeto.detalle };
  }

  const consultas = consultarEvaluacion(
    entrada.registros.map(aRegistroPAE),
    sujeto.sujeto,
    entrada.normas ?? normasNKB(),
  );

  return { estado: 'DISPONIBLE', informe: componerInformeNormativo(consultas, entrada.portada) };
}
