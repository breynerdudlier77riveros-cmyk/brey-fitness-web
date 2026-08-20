// ── Interpretación profesional · contratos (Sprint PAS-9) ──────────────────
//
// QUÉ ES INTERPRETAR AQUÍ, Y QUÉ NO:
//
//   Interpretar = poner en palabras lo que otra capa ya resolvió, y decir
//   además **qué no puede afirmarse con ello**.
//
//   Interpretar NO es juzgar. Ninguna regla de esta capa produce «alto»,
//   «bajo», «bueno» ni «adecuado»: para eso haría falta un punto de corte, y
//   la NKB no admite ninguno hoy (`41`). Un motor que dijera «tu prensión es
//   buena» estaría inventando la clasificación que todo el proyecto lleva
//   nueve sprints negándose a inventar.
//
// LOS TRES EJES VIAJAN SEPARADOS, y cada interpretación declara el suyo. Es la
// única defensa estructural contra la confusión más cara de este producto:
// leer «+4 kg respecto a marzo» como si fuera «por encima de tu población».
// Son afirmaciones sobre cosas distintas, y el modelo no permite mezclarlas
// porque no hay ningún campo donde quepan juntas.

/** Sobre qué habla la interpretación. Nunca dos a la vez. */
export type Eje = 'normativo' | 'longitudinal' | 'objetivo';

/**
 * Una afirmación, con su procedencia y su límite.
 *
 * `limite` no es decorativo: es la parte que impide que la frase se lea de
 * más. «Aumentó 4 kg» sin «esto no describe tu posición respecto a ninguna
 * población» es una media verdad que el lector completará solo, y la
 * completará mal.
 */
export interface Interpretacion {
  eje: Eje;
  /** Id de la regla que la produjo. Para trazar de dónde salió cada frase. */
  regla: string;
  texto: string;
  /** Qué NO puede afirmarse a partir de esto. `null` solo si no hay riesgo. */
  limite: string | null;
}

/**
 * Las tres interpretaciones de un resultado.
 *
 * Cada una puede faltar por su cuenta: hay resultados con referencia y sin
 * histórico, con histórico y sin objetivo, y con las tres. Un campo `null`
 * significa que ese eje no tiene nada que decir — no que el resultado sea peor.
 */
export interface InterpretacionResultado {
  normativo: Interpretacion | null;
  longitudinal: Interpretacion | null;
  objetivo: Interpretacion | null;
}

/**
 * Una regla del motor.
 *
 * Declarativa y determinista: misma entrada, misma frase. No hay generación
 * libre de lenguaje en ninguna parte de esta capa — cada texto sale de una
 * plantilla escrita a mano y revisable.
 */
export interface Regla<T> {
  id: string;
  eje: Eje;
  /** Qué situación reconoce. En una línea, para poder auditar la cobertura. */
  cuando: string;
  aplica(entrada: T): boolean;
  redactar(entrada: T): { texto: string; limite: string | null };
}
