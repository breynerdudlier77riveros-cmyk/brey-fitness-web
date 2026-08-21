// ── La posición del resultado, en palabras (Sprint PAS-13) ─────────────────
//
// UN SOLO SITIO DONDE SE DECIDE QUIÉN CONTESTA AL EJE NORMATIVO.
//
// La tarjeta necesita la frase llana y los detalles técnicos necesitan el
// rótulo exacto de la misma posición. Si cada componente resolviera por su
// cuenta si manda la NKB o la capa de evidencia, acabarían describiendo
// posiciones distintas del mismo resultado en la misma pantalla — que es
// exactamente la clase de contradicción que PAS-13 vino a quitar.
//
// La precedencia NO se decide aquí: llega resuelta en `fuenteNormativa`, desde
// `componer`. Esto solo la lee.

import { poblacionEnPalabras } from '@/lib/pas/evidencia';
import { enLlano, type LecturaLlana } from '@/lib/pas/lenguaje-llano';

import type { ResultadoHumano } from './tipos';

/**
 * La posición de este resultado, dicha en español corriente.
 *
 * `null` cuando no hay ninguna posición que decir, que es un caso frecuente y
 * legítimo: sin norma compatible no hay dónde situar el valor, y rellenar el
 * hueco con una frase vacía sería peor que dejarlo.
 */
export function lecturaLlanaDe(r: ResultadoHumano): LecturaLlana | null {
  if (r.referencia.estado === 'DISPONIBLE' && r.referencia.posicion !== null) {
    // La NKB no publica su población en forma de sintagma —«Colombia · Varones
    // · 22 años» es una etiqueta, no algo que quepa dentro de una frase—, así
    // que la frase usa una fórmula genérica y la población va rotulada aparte,
    // debajo. Meterla a la fuerza produciría español roto.
    return enLlano(r.pruebaId, r.referencia.posicion, 'personas de tu mismo grupo de referencia');
  }

  if (r.fuenteNormativa === 'evidencia') {
    const compatible = r.evidencia.compatibles[0];
    if (compatible?.posicion) {
      return enLlano(r.pruebaId, compatible.posicion, poblacionEnPalabras(compatible.referencia));
    }
  }

  return null;
}
