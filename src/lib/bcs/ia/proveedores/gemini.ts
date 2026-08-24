// ── Adaptador de Gemini (Sprint BCS-14) ────────────────────────────────────
//
// EL PROVEEDOR GRATUITO, Y LO QUE ESO IMPLICA DE VERDAD.
//
//   Gemini tiene capa gratuita con límites por minuto y por día. Para un
//   consultorio que arranca sobra, y permite tener BREY IA encendida sin
//   ningún compromiso de gasto.
//
//   Lo que hay que saber: el contrato que este sistema le impone al modelo es
//   exigente —ocho prohibiciones en español, terminología clínica, prohibido
//   clasificar, obligatorio citar la ficha— y `validarTexto` rechaza la
//   respuesta ENTERA a la primera infracción. Un modelo que obedezca peor no
//   da respuestas peores: da más rechazos. El sistema sigue siendo seguro
//   —para eso está la puerta— pero contesta menos veces.
//
//   Por eso el rechazo se cuenta como lo que es y se enseña con su motivo, en
//   vez de reintentarse en silencio. Un reintento automático convertiría una
//   señal de «este modelo no da la talla para esto» en latencia inexplicable.
//
// ── LO ÚNICO QUE SÍ SE REINTENTA: EL 503 ──────────────────────────────────
//
//   Medido contra la API real: la capa gratuita devuelve «503 · high demand»
//   de forma intermitente —una de cada tres peticiones en la prueba— y el
//   propio error dice que se reintente. No es una señal sobre la petición: es
//   capacidad ajena, y la misma petición funciona un segundo después.
//
//   Es la excepción que confirma el párrafo de arriba, y la distinción importa:
//
//     · 503 UNAVAILABLE → se reintenta. La petición era correcta.
//     · 429 quota       → NO. Reintentar consume más cuota y agrava el
//                         problema; hay que esperar, y así se dice.
//     · rechazo del validador → NO. Es información sobre el modelo, no ruido.
//
//   Dos reintentos y para. Un bucle largo convierte «no hay servicio» en una
//   pantalla colgada, que es peor que un error claro.
//
// ── EL LÍMITE DE PETICIONES NO ES UN ERROR CUALQUIERA ─────────────────────
//
//   Es el estado propio de la capa gratuita y tiene remedio: esperar. Se
//   distingue del resto para poder decirlo así, en lugar de mandar al
//   profesional a revisar una clave que está perfecta.

import { GoogleGenAI } from '@google/genai';

import { MAX_TOKENS } from '@/lib/bcs/ia/contrato';
import type { Proveedor, ResultadoModelo } from '@/lib/bcs/ia/proveedor';

/**
 * El modelo por defecto, elegido midiendo y no por intuición.
 *
 * La tarea no pide un modelo grande: el modelo NO razona sobre datos crudos
 * —nunca los ve— sino que redacta sobre conclusiones que los motores ya
 * sacaron. Aun así, la variante pequeña era la sospechosa de no aguantar el
 * contrato, así que se probó contra la API real con el contrato y un informe
 * completos, y las tres preguntas de prueba pasaron el validador.
 *
 * Y hay una razón práctica que pesa más que la teórica: la capa gratuita da
 * **20 peticiones al día por modelo** en las variantes grandes. Veinte
 * preguntas diarias se agotan en una tarde de consulta. Las variantes `lite`
 * tienen cuota aparte y bastante más holgada, y además responden en unos
 * segundos en vez de en un minuto largo.
 *
 * `BREY_IA_MODELO` lo sustituye sin tocar código.
 */
const MODELO_POR_DEFECTO = 'gemini-3.5-flash-lite';

/**
 * Reintentos ante saturación, y esperas entre ellos. Cortas: alguien mira.
 *
 * Va fijado y no configurable: es una propiedad del proveedor, no una
 * preferencia. Quien quiera otro comportamiento cambia de proveedor.
 */
const REINTENTOS = 2;
const ESPERAS_MS = [700, 2000];

/**
 * ¿Merece otro intento?
 *
 * Solo la falta de capacidad del proveedor. Se deja exportada porque es la
 * decisión que puede estar mal —reintentar un 429 empeoraría las cosas— y una
 * decisión que puede estar mal se prueba.
 *
 * El orden de las dos comprobaciones importa: un mensaje de cuota que además
 * dijera «unavailable» se reintentaría si el 503 se mirase primero.
 */
export function esReintentable(error: unknown): boolean {
  const texto = error instanceof Error ? error.message : String(error);
  if (/\b429\b|RESOURCE_EXHAUSTED|quota/i.test(texto)) return false;
  return /\b503\b|UNAVAILABLE|high demand|overloaded/i.test(texto);
}

const esperar = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

export function crearProveedorGemini(env: NodeJS.ProcessEnv = process.env): Proveedor | null {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const modelo = env.BREY_IA_MODELO?.trim() || MODELO_POR_DEFECTO;

  return {
    nombre: 'Google Gemini',
    modelo,

    async responder(sistema, mensaje): Promise<ResultadoModelo> {
      const ai = new GoogleGenAI({ apiKey });

      for (let intento = 0; ; intento++) {
        try {
          const respuesta = await ai.models.generateContent({
            model: modelo,
            contents: mensaje,
            config: {
              // El contrato va como instrucción de sistema y no dentro del
              // mensaje: mezclarlo con la pregunta lo pondría al mismo nivel
              // que el texto del usuario, que es justo lo que no debe estar.
              systemInstruction: sistema,
              maxOutputTokens: MAX_TOKENS,
              // Baja pero no cero: se pide redacción, no muestreo creativo, y
              // cero hace que un rechazo del validador se repita idéntico.
              temperature: 0.3,
            },
          });

          const candidato = respuesta.candidates?.[0];
          const motivo = candidato?.finishReason;

          // El filtro del proveedor tumbó la salida. No es un fallo del
          // sistema ni de la pregunta: es el modelo negándose, y se dice así.
          if (motivo === 'SAFETY' || motivo === 'PROHIBITED_CONTENT' || motivo === 'BLOCKLIST') {
            return { estado: 'declinada' };
          }
          if (motivo === 'MAX_TOKENS') return { estado: 'truncada' };

          const texto = respuesta.text?.trim() ?? '';
          if (texto === '') {
            // Sin texto y sin motivo declarado: si el prompt entero fue
            // bloqueado, `candidates` llega vacío y no hay `finishReason`.
            if (respuesta.promptFeedback?.blockReason) return { estado: 'declinada' };
            return { estado: 'error', mensaje: 'El modelo no devolvió texto.' };
          }

          return { estado: 'texto', texto };
        } catch (error) {
          // Solo la saturación se reintenta, y un número fijo de veces.
          if (intento < REINTENTOS && esReintentable(error)) {
            await esperar(ESPERAS_MS[intento]);
            continue;
          }
          return { estado: 'error', mensaje: traducir(error) };
        }
      }
    },
  };
}

/**
 * El fallo, en algo que el profesional pueda accionar.
 *
 * El SDK no expone clases de error por código, así que se mira el mensaje. Es
 * frágil por naturaleza y por eso el caso final NO finge saber qué pasó: dice
 * que no se pudo hablar con el modelo y para.
 */
function traducir(error: unknown): string {
  const texto = error instanceof Error ? error.message : String(error);

  if (/\b429\b|RESOURCE_EXHAUSTED|quota/i.test(texto)) {
    return (
      'Se alcanzó el límite de peticiones de la capa gratuita. Vuelve a intentarlo en un minuto; ' +
      'si se repite a diario, es que esta función ya necesita un plan de pago.'
    );
  }
  if (/\b401\b|\b403\b|API_KEY_INVALID|API key not valid|PERMISSION_DENIED/i.test(texto)) {
    return 'La clave de API no es válida o no tiene permiso para este modelo.';
  }
  if (/\b404\b|NOT_FOUND|is not found for API version/i.test(texto)) {
    return 'Ese modelo no existe o no está disponible para tu clave. Revisa BREY_IA_MODELO.';
  }
  if (/\b400\b|INVALID_ARGUMENT/i.test(texto)) {
    return 'La petición no fue válida.';
  }
  if (/\b503\b|UNAVAILABLE|high demand|overloaded/i.test(texto)) {
    // Aquí solo se llega tras agotar los reintentos, y por eso se dice: si el
    // mensaje sugiriera «prueba otra vez» sin más, el profesional repetiría a
    // mano lo que el sistema ya hizo tres veces.
    return (
      'El modelo está saturado y no respondió tras varios intentos. Pasa a menudo en la capa ' +
      'gratuita; vuelve a preguntar en un momento.'
    );
  }
  if (/\b5\d\d\b|INTERNAL/i.test(texto)) {
    return 'El servicio del modelo falló. Inténtalo de nuevo.';
  }
  return 'No se pudo contactar con el modelo.';
}
