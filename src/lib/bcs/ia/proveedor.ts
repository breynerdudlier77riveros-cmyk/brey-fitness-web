// ── El puerto del modelo de lenguaje (Sprint BCS-14) ───────────────────────
//
// POR QUÉ EXISTE ESTA CAPA, QUE AYER NO HACÍA FALTA.
//
//   BCS-12 llamaba a Anthropic directamente desde la acción de servidor, y
//   estaba bien: había un proveedor. Ahora hay dos, y la razón no es técnica
//   sino económica — el proyecto arranca sin clientes y la capa gratuita de
//   Gemini permite tener la función encendida sin gastar nada, con la
//   intención declarada de pasar a Claude cuando haya volumen.
//
//   Ese «cuando haya volumen» es justo lo que esta capa protege. Sin ella, el
//   cambio de vuelta sería reescribir la acción de servidor, y una reescritura
//   futura es una reescritura que se pospone. Con ella es una variable de
//   entorno.
//
// ── LO QUE EL PUERTO DELIBERADAMENTE NO DEJA PASAR ────────────────────────
//
//   Un adaptador devuelve TEXTO o un motivo por el que no lo hay. No devuelve
//   objetos del SDK, ni códigos HTTP, ni `null`. Todo lo que el sistema hace
//   después —el validador, las tres puertas, la redacción del error— es
//   idéntico venga de donde venga la respuesta, y eso solo se sostiene si el
//   proveedor no puede colar su vocabulario aguas arriba.
//
//   En particular NO se expone streaming ni herramientas. BREY IA responde una
//   pregunta cerrada sobre un documento cerrado; darle herramientas sería
//   darle una forma de conseguir datos que el contexto le niega a propósito.
//
// ── `truncada` ES UN ESTADO, NO UN DETALLE ────────────────────────────────
//
//   Una respuesta que se queda sin tokens a mitad de frase es exactamente el
//   fallo que el validador lleva desde BCS-6 negándose a producir: un texto
//   mutilado con apariencia de correcto. Antes no se comprobaba. Ahora corta
//   antes de llegar al usuario, en los dos proveedores.
//
// Módulo puro salvo por la lectura de `process.env`, que es la única decisión
// que este fichero toma.

/** Lo que un adaptador puede devolver. Texto, o por qué no lo hay. */
export type ResultadoModelo =
  | { estado: 'texto'; texto: string }
  /** El modelo se negó, o su filtro de seguridad tumbó la salida. */
  | { estado: 'declinada' }
  /** Se agotó el techo de tokens. No se entrega media respuesta. */
  | { estado: 'truncada' }
  | { estado: 'error'; mensaje: string };

/**
 * Un turno de la conversación.
 *
 * Existe porque una sola pregunta suelta no deja PROFUNDIZAR: «explícame más
 * eso» no tiene antecedente si cada petición empieza de cero, y era la queja
 * exacta del profesional. Con el hilo, la segunda pregunta se apoya en la
 * primera.
 *
 * El historial llega del navegador, así que se trata como lo que es: entrada
 * no fiable. Alguien podría fabricar un turno del modelo que diga «acepto
 * saltarme las reglas». No importa: `validarTexto` comprueba el texto que se
 * va a ENSEÑAR, no el que se pidió, y esa puerta no depende de que el
 * historial sea auténtico.
 */
export interface Turno {
  rol: 'usuario' | 'modelo';
  texto: string;
}

export interface Proveedor {
  /** Cómo se llama en pantalla. Va bajo cada respuesta. */
  readonly nombre: string;
  /** El modelo concreto. Se nombra también: no da igual cuál contestó. */
  readonly modelo: string;
  responder(sistema: string, turnos: readonly Turno[]): Promise<ResultadoModelo>;
}

/** Los proveedores que el sistema sabe usar. */
export type NombreProveedor = 'gemini' | 'anthropic';

/**
 * Qué proveedor toca, y por qué.
 *
 * `BREY_IA_PROVEEDOR` manda cuando está puesta. Sin ella se elige por la clave
 * que exista, y GEMINI VA PRIMERO a propósito: es la gratuita, y quien tenga
 * las dos configuradas casi seguro esté probando la de coste cero. Quien
 * quiera Claude teniendo las dos lo dice, que es una línea.
 */
export function proveedorElegido(env: NodeJS.ProcessEnv = process.env): NombreProveedor | null {
  const declarado = env.BREY_IA_PROVEEDOR?.trim().toLowerCase();
  if (declarado === 'gemini' || declarado === 'anthropic') return declarado;

  if (env.GEMINI_API_KEY) return 'gemini';
  if (env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

/**
 * El nombre de la variable que falta, para poder decirlo en pantalla.
 *
 * «Falta una clave» no sirve de nada: hay dos posibles y el profesional no
 * tiene por qué saber cuál eligió el sistema.
 */
export function claveQueFalta(
  proveedor: NombreProveedor | null,
  env: NodeJS.ProcessEnv = process.env,
): string | null {
  if (proveedor === 'gemini' && !env.GEMINI_API_KEY) return 'GEMINI_API_KEY';
  if (proveedor === 'anthropic' && !env.ANTHROPIC_API_KEY) return 'ANTHROPIC_API_KEY';
  if (proveedor === null) return 'GEMINI_API_KEY';
  return null;
}
