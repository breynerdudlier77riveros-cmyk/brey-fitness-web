'use server';

// ── BREY IA · responder una pregunta sobre el informe (Sprint BCS-12/14) ───
//
// La única parte del ecosistema que NO es determinista, y está encapsulada
// aquí a propósito: nada de lo que devuelve entra en el informe, se persiste
// ni alimenta a ningún motor. Es una capa de conversación encima de un
// documento ya cerrado.
//
// ── LAS TRES PUERTAS QUE ATRAVIESA UNA RESPUESTA ──────────────────────────
//
//   1 · El CONTEXTO. El modelo no recibe las cifras sueltas, solo las
//       conclusiones que los motores ya sacaron. No puede clasificar un valor
//       que no tiene. Es la restricción más fuerte porque no depende de que el
//       modelo obedezca nada.
//
//   2 · El CONTRATO. Las prohibiciones de la CKB, escritas en el prompt.
//
//   3 · El VALIDADOR. `validarTexto`, el mismo que guarda los entregables
//       deterministas desde BCS-6.0. Y aquí importa MÁS que allí: una
//       plantilla escrita a mano no se desvía sola, un modelo sí.
//
//   Una violación RECHAZA la respuesta entera. No se sanea, no se recorta, no
//   se muestra «lo aprovechable». Es la doctrina que el propio validador
//   declara: entregar el resto sin la parte censurada deja un texto mutilado
//   con apariencia de correcto, y quien lo lee no sabe que faltó algo.
//
// ── LAS TRES PUERTAS NO DEPENDEN DEL PROVEEDOR (BCS-14) ───────────────────
//
//   Desde que hay dos modelos posibles, esta distinción importa: el proveedor
//   se elige por variable de entorno, pero las tres puertas son las mismas
//   para todos y están de este lado del puerto. Un adaptador nuevo no puede
//   aflojarlas, porque no las toca — solo devuelve texto o el motivo de que no
//   lo haya.
//
//   Y el modelo que contestó se NOMBRA en la respuesta. Con dos proveedores de
//   calidad distinta, ocultar cuál habló sería esconder la variable que más
//   explica lo que se está leyendo.
//
// SIN CLAVE NO HAY MAGIA. Si no hay ninguna configurada se devuelve un estado
// explícito, con el nombre de la variable que falta. Nunca se degrada a una
// respuesta inventada ni se finge que la función no existe.

import { validarTexto, type Violacion } from '@/lib/bcs/copilot';
import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import { construirContexto, type EntradaContexto } from './contexto';
import { SISTEMA } from './contrato';
import { construirTurnos } from '@/lib/ia/hilo';
import { claveQueFalta, proveedorElegido, type Proveedor, type Turno } from '@/lib/ia/proveedor';
import { crearProveedorAnthropic } from '@/lib/ia/proveedores/anthropic';
import { crearProveedorGemini } from '@/lib/ia/proveedores/gemini';

export type RespuestaIA =
  | { estado: 'ok'; texto: string; modelo: string }
  /** El modelo dijo algo que el validador no admite. Se muestra el motivo. */
  | { estado: 'rechazada'; violaciones: readonly Violacion[]; modelo: string }
  /** No hay clave configurada. No es un error: es una función sin habilitar. */
  | { estado: 'sin_configurar'; variable: string }
  | { estado: 'error'; mensaje: string };

/** Todas las variables del catálogo: el modelo puede nombrar cualquiera. */
const VARIABLES = Object.keys(CATALOGO) as VariableId[];

/**
 * Longitud máxima de la pregunta.
 *
 * No es una medida de coste: es que una «pregunta» de mil caracteres suele ser
 * un intento de meter instrucciones en el hueco del usuario.
 */
const MAX_PREGUNTA = 500;

/** El adaptador que toca, ya construido, o `null` si le falta la clave. */
function resolverProveedor(): Proveedor | null {
  switch (proveedorElegido()) {
    case 'gemini':
      return crearProveedorGemini();
    case 'anthropic':
      return crearProveedorAnthropic();
    default:
      return null;
  }
}

export async function preguntarABreyIA(
  pregunta: string,
  contexto: EntradaContexto,
  /**
   * Lo dicho hasta ahora, para poder repreguntar.
   *
   * Llega del navegador y NO se comprueba su autenticidad, porque no hace
   * falta: `validarTexto` gobierna el texto que se va a ENSEÑAR, no el que se
   * pidió. Un turno del modelo fabricado no abre ninguna puerta que la salida
   * no vuelva a cerrar.
   */
  historial: readonly Turno[] = [],
): Promise<RespuestaIA> {
  const proveedor = resolverProveedor();
  if (proveedor === null) {
    return {
      estado: 'sin_configurar',
      variable: claveQueFalta(proveedorElegido()) ?? 'GEMINI_API_KEY',
    };
  }

  const limpia = pregunta.trim();
  if (limpia.length === 0) return { estado: 'error', mensaje: 'La pregunta está vacía.' };
  if (limpia.length > MAX_PREGUNTA) {
    return {
      estado: 'error',
      mensaje: `La pregunta no puede pasar de ${MAX_PREGUNTA} caracteres.`,
    };
  }

  const resultado = await proveedor.responder(
    SISTEMA,
    construirTurnos(construirContexto(contexto), historial, limpia),
  );

  switch (resultado.estado) {
    case 'declinada':
      return { estado: 'error', mensaje: 'El modelo declinó responder a esa pregunta.' };

    case 'truncada':
      // No se entrega la mitad que llegó. Es el mismo criterio que aplica el
      // validador a una respuesta parcialmente inadmisible, por el mismo
      // motivo: un texto cortado no se ve cortado.
      return {
        estado: 'error',
        mensaje: 'La respuesta se cortó antes de terminar. Prueba con una pregunta más concreta.',
      };

    case 'error':
      return { estado: 'error', mensaje: resultado.mensaje };

    case 'texto': {
      // LA PUERTA. Se comprueba el texto que iba a verse, no el que se pidió.
      const violaciones = validarTexto(resultado.texto, VARIABLES);
      if (violaciones.length > 0) {
        return { estado: 'rechazada', violaciones, modelo: proveedor.modelo };
      }
      return { estado: 'ok', texto: resultado.texto, modelo: proveedor.modelo };
    }
  }
}
