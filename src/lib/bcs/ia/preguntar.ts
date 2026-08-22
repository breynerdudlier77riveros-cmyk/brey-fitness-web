"use server";

// ── BREY IA · responder una pregunta sobre el informe (Sprint BCS-12) ──────
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
// SIN CLAVE NO HAY MAGIA. Si `ANTHROPIC_API_KEY` no está configurada, se
// devuelve un estado explícito y la interfaz lo dice. Nunca se degrada a una
// respuesta inventada ni se finge que la función no existe.

import Anthropic from '@anthropic-ai/sdk';

import { validarTexto, type Violacion } from '@/lib/bcs/copilot';
import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import { construirContexto, type EntradaContexto } from './contexto';
import { MAX_TOKENS, MODELO, SISTEMA } from './contrato';

export type RespuestaIA =
  | { estado: 'ok'; texto: string }
  /** El modelo dijo algo que el validador no admite. Se muestra el motivo. */
  | { estado: 'rechazada'; violaciones: readonly Violacion[] }
  /** No hay clave configurada. No es un error: es una función sin habilitar. */
  | { estado: 'sin_configurar' }
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

export async function preguntarABreyIA(
  pregunta: string,
  contexto: EntradaContexto,
): Promise<RespuestaIA> {
  const clave = process.env.ANTHROPIC_API_KEY;
  if (!clave) return { estado: 'sin_configurar' };

  const limpia = pregunta.trim();
  if (limpia.length === 0) return { estado: 'error', mensaje: 'La pregunta está vacía.' };
  if (limpia.length > MAX_PREGUNTA) {
    return {
      estado: 'error',
      mensaje: `La pregunta no puede pasar de ${MAX_PREGUNTA} caracteres.`,
    };
  }

  const client = new Anthropic({ apiKey: clave });

  try {
    // Streaming aunque la respuesta sea corta: el techo de tokens es holgado y
    // una petición sin stream puede chocar con el tiempo límite HTTP.
    const stream = client.messages.stream({
      model: MODELO,
      max_tokens: MAX_TOKENS,
      thinking: { type: 'adaptive' },
      system: [
        // El contrato es idéntico en cada petición: se cachea. Lo que cambia
        // —el informe y la pregunta— va después, en el mensaje del usuario.
        { type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } },
      ],
      messages: [
        {
          role: 'user',
          content:
            `${construirContexto(contexto)}\n\n---\n\nPregunta: ${limpia}`,
        },
      ],
    });

    const mensaje = await stream.finalMessage();

    if (mensaje.stop_reason === 'refusal') {
      return {
        estado: 'error',
        mensaje: 'El modelo declinó responder a esa pregunta.',
      };
    }

    const texto = mensaje.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();

    if (texto === '') {
      return { estado: 'error', mensaje: 'El modelo no devolvió texto.' };
    }

    // LA PUERTA. Se comprueba el texto que iba a verse, no el que se pidió.
    const violaciones = validarTexto(texto, VARIABLES);
    if (violaciones.length > 0) return { estado: 'rechazada', violaciones };

    return { estado: 'ok', texto };
  } catch (error) {
    // Se distinguen los casos que el profesional puede resolver de los que no.
    if (error instanceof Anthropic.AuthenticationError) {
      return { estado: 'error', mensaje: 'La clave de API no es válida.' };
    }
    if (error instanceof Anthropic.RateLimitError) {
      return { estado: 'error', mensaje: 'Demasiadas peticiones. Inténtalo en un momento.' };
    }
    if (error instanceof Anthropic.APIError) {
      return { estado: 'error', mensaje: `La API respondió ${error.status}.` };
    }
    return { estado: 'error', mensaje: 'No se pudo contactar con el modelo.' };
  }
}
