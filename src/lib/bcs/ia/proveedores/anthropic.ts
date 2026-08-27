// ── Adaptador de Anthropic (Sprint BCS-14) ─────────────────────────────────
//
// Es el código que BCS-12 tenía dentro de la acción de servidor, movido detrás
// del puerto sin cambiarle nada sustantivo. Lo único que se añade es el estado
// `truncada`, que antes no se comprobaba: una respuesta cortada a mitad de
// frase llegaba entera a `validarTexto` y, si el trozo entregado no infringía
// nada, se mostraba como si estuviera completa.
//
// ── POR QUÉ ESTE SIGUE SIENDO EL RECOMENDADO ──────────────────────────────
//
// El contrato de BREY IA es difícil de obedecer y el validador no perdona una
// sola infracción. La calidad de seguimiento de instrucciones no es aquí un
// lujo: es la diferencia entre una función que contesta y una que rechaza. El
// proveedor gratuito está para arrancar sin coste; este está para cuando el
// volumen justifique el gasto, y el cambio es una variable de entorno.

import Anthropic from '@anthropic-ai/sdk';

import { MAX_TOKENS } from '@/lib/bcs/ia/contrato';
import type { Proveedor, ResultadoModelo } from '@/lib/bcs/ia/proveedor';

/** Un solo sitio, para que no diverja entre rutas. */
export const MODELO_POR_DEFECTO = 'claude-opus-5';

export function crearProveedorAnthropic(env: NodeJS.ProcessEnv = process.env): Proveedor | null {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const modelo = env.BREY_IA_MODELO?.trim() || MODELO_POR_DEFECTO;

  return {
    nombre: 'Anthropic Claude',
    modelo,

    async responder(sistema, turnos): Promise<ResultadoModelo> {
      const client = new Anthropic({ apiKey });

      try {
        // Streaming aunque la respuesta sea corta: el techo de tokens es
        // holgado y una petición sin stream puede chocar con el tiempo límite
        // HTTP de la plataforma.
        const stream = client.messages.stream({
          model: modelo,
          max_tokens: MAX_TOKENS,
          thinking: { type: 'adaptive' },
          system: [
            // El contrato es idéntico en cada petición: se cachea. Lo que
            // cambia —el informe y la pregunta— va en el mensaje del usuario.
            { type: 'text', text: sistema, cache_control: { type: 'ephemeral' } },
          ],
          messages: turnos.map((t) => ({
            role: t.rol === 'usuario' ? ('user' as const) : ('assistant' as const),
            content: t.texto,
          })),
        });

        const respuesta = await stream.finalMessage();

        if (respuesta.stop_reason === 'refusal') return { estado: 'declinada' };
        if (respuesta.stop_reason === 'max_tokens') return { estado: 'truncada' };

        const texto = respuesta.content
          .filter((b): b is Anthropic.TextBlock => b.type === 'text')
          .map((b) => b.text)
          .join('\n')
          .trim();

        if (texto === '') return { estado: 'error', mensaje: 'El modelo no devolvió texto.' };

        return { estado: 'texto', texto };
      } catch (error) {
        // Se distinguen los casos que el profesional puede resolver de los
        // que no: una clave mal escrita se arregla, una caída se espera.
        if (error instanceof Anthropic.AuthenticationError) {
          return { estado: 'error', mensaje: 'La clave de API no es válida.' };
        }
        if (error instanceof Anthropic.RateLimitError) {
          return {
            estado: 'error',
            mensaje: 'Demasiadas peticiones. Inténtalo en un momento.',
          };
        }
        if (error instanceof Anthropic.APIError) {
          return { estado: 'error', mensaje: `La API respondió ${error.status}.` };
        }
        return { estado: 'error', mensaje: 'No se pudo contactar con el modelo.' };
      }
    },
  };
}
