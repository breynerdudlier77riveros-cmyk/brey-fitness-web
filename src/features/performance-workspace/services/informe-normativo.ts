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

/**
 * Solo para pruebas: olvida la NKB cacheada.
 *
 * Sin esto, un test que simule la ausencia de las fichas seguiría viendo las
 * normas que cargó otro test antes, y comprobaría lo contrario de lo que cree.
 */
export function olvidarNormas(): void {
  cache = null;
}

export type ResultadoInformeNormativo =
  | { estado: 'DISPONIBLE'; informe: InformeNormativoV2 }
  | {
      /**
       * Algo falló en la infraestructura: no se pudieron leer las fichas de la
       * NKB, o la base no devolvió los registros.
       *
       * **Es un estado TÉCNICO y jamás debe leerse como uno científico.** Que
       * el sistema no haya podido consultar las normas no significa que no
       * existan, ni que no correspondan, ni que el atleta no tenga mediciones.
       * Devolver aquí `SIN_NORMA_APLICABLE` o `SIN_MEDICIONES` convertiría un
       * fallo de despliegue en una afirmación sobre la evidencia.
       */
      estado: 'ERROR_TECNICO';
      origen: 'NKB' | 'REGISTROS';
      detalle: string;
      /** El error real, para el registro del servidor. No se muestra en crudo. */
      causa: string;
    }
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
  /**
   * Los registros, o el fallo al leerlos.
   *
   * Acepta la lista directamente por comodidad de quien ya la tenga, pero la
   * ruta pasa el resultado de `leerRegistros` para que un fallo de la base no
   * se confunda con una evaluación vacía.
   */
  registros:
    | readonly RegistroWorkspace[]
    | { estado: 'OK'; registros: readonly RegistroWorkspace[] }
    | { estado: 'ERROR'; mensaje: string; codigo: string | null };
  /** Fecha de referencia. Se recibe: ninguna capa pura lee el reloj. */
  hoyISO: string;
  portada: DatosPortada;
  /** Solo para pruebas: permite inyectar la NKB sin tocar el disco. */
  normas?: readonly NormaNKB[];
}

const DETALLE_NKB =
  'No se pudieron leer las fichas normativas. Es un fallo de la instalación, no una ' +
  'conclusión sobre la evidencia: las normas existen, y este informe no ha podido consultarlas.';

const DETALLE_REGISTROS =
  'No se pudieron leer las pruebas registradas en esta evaluación. Es un fallo al consultar los ' +
  'datos, no una afirmación de que no haya mediciones.';

/**
 * Construye el informe normativo de una evaluación.
 *
 * Orden de comprobación, y detenerse es el resultado correcto:
 *
 *   0. Fallo al leer los registros → estado TÉCNICO.
 *   1. Sin mediciones → no hay nada que situar.
 *   2. Sujeto incompleto → no se fabrica uno parcial ni se toman datos
 *      prestados del profesional.
 *   3. Fallo al leer la NKB → estado TÉCNICO.
 *   4. Con todo → se consulta y se compone, sin tocar el resultado.
 *
 * Los pasos 0 y 3 son técnicos y los demás científicos. La separación es la
 * razón de ser de este orden: un fallo de infraestructura nunca puede caer en
 * un estado que hable de la evidencia.
 */
export function construirInformeNormativo(
  entrada: EntradaInformeNormativo,
): ResultadoInformeNormativo {
  // 0 · Fallo al leer los registros. Se comprueba lo PRIMERO: sin saber si hay
  // mediciones no puede afirmarse que no las haya.
  //
  // El estrechamiento va por `'estado' in`, no por `Array.isArray`: este último
  // no distingue un `readonly T[]` dentro de una unión, y el compilador dejaría
  // pasar el caso de error sin verlo.
  const entregado = entrada.registros;
  if ('estado' in entregado && entregado.estado === 'ERROR') {
    return {
      estado: 'ERROR_TECNICO',
      origen: 'REGISTROS',
      detalle: DETALLE_REGISTROS,
      causa: entregado.mensaje,
    };
  }

  const registros: readonly RegistroWorkspace[] =
    'estado' in entregado ? entregado.registros : entregado;

  if (registros.length === 0) {
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

  // La NKB se lee del disco: si las fichas no llegaron al artefacto de
  // producción, esto lanza ENOENT. Se captura AQUÍ y solo aquí, para
  // convertirlo en un estado técnico con nombre — nunca en una lista vacía,
  // que aguas abajo se leería como «ninguna norma aplicable».
  let normas: readonly NormaNKB[];
  try {
    normas = entrada.normas ?? normasNKB();
  } catch (e) {
    return {
      estado: 'ERROR_TECNICO',
      origen: 'NKB',
      detalle: DETALLE_NKB,
      causa: e instanceof Error ? e.message : String(e),
    };
  }

  const consultas = consultarEvaluacion(registros.map(aRegistroPAE), sujeto.sujeto, normas);

  return { estado: 'DISPONIBLE', informe: componerInformeNormativo(consultas, entrada.portada) };
}
