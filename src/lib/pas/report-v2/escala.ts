// ── Geometría de las barras clínicas (PRS v2.0) ────────────────────────────
//
// LA DECISIÓN QUE DEFINE ESTE MÓDULO, y que hay que entender antes de tocarlo:
//
//   El eje de la barra es un **eje de valores** (kg, kgf, lbf), NO un eje de
//   percentiles.
//
// Las marcas se colocan donde caiga su valor publicado, y el punto del atleta
// donde caiga el suyo. La distancia entre P25 y P50 en pantalla refleja la
// diferencia en kilos entre ambos, no veinticinco puntos percentiles.
//
// Por qué importa: si el eje fuera de percentiles, situar el punto entre dos
// marcas equivaldría a **interpolar** —«está en el percentil 37»— que es
// exactamente lo que la NKB prohíbe (`21`) y lo que el NIE se niega a hacer.
// Sobre un eje de valores, la posición solo afirma «pesa esto», que es un dato
// medido, y la etiqueta sigue diciendo «entre P25 y P50, no se interpola».
//
// Módulo puro y aritmético. No conoce React, ni normas, ni ciencia.

/** Una marca del eje, ya posicionada. */
export interface Marca {
  /** Rótulo publicado: `P50`, `μ`, `μ+1σ`. Nunca un valor calculado. */
  etiqueta: string;
  valor: number;
  /** Posición en el eje, de 0 a 100. */
  posicion: number;
  /** La marca central de la escala, que se dibuja destacada. */
  principal: boolean;
}

export interface Escala {
  minimo: number;
  maximo: number;
  marcas: readonly Marca[];
  /** Posición del valor observado, de 0 a 100. */
  posicionObservado: number;
  /** El observado cae fuera del intervalo publicado. Se sujeta al borde. */
  fueraDeRango: boolean;
}

/** Ancho mínimo del eje para que una escala degenerada siga siendo dibujable. */
const EPSILON = 1e-9;

/**
 * Sitúa un valor entre dos extremos, de 0 a 100, sujetándolo al borde.
 *
 * Sujetar no oculta nada: `fueraDeRango` lo declara, y el componente lo rotula.
 * Dejar que el punto se saliera del trazo sería peor —desaparecería— y
 * estirar el eje para que quepa comprimiría las marcas publicadas.
 */
function situar(valor: number, minimo: number, maximo: number): number {
  const ancho = maximo - minimo;
  if (ancho < EPSILON) return 50;
  return Math.min(100, Math.max(0, ((valor - minimo) / ancho) * 100));
}

/**
 * Construye la escala a partir de marcas ya publicadas.
 *
 * `entradas` llega tal como la fuente la publica. Este módulo **no añade,
 * quita ni reordena marcas**: solo las posiciona.
 */
export function escalar(
  entradas: readonly { etiqueta: string; valor: number; principal?: boolean }[],
  observado: number,
): Escala {
  const valores = entradas.map((e) => e.valor);
  const minimo = Math.min(...valores);
  const maximo = Math.max(...valores);

  return {
    minimo,
    maximo,
    marcas: entradas.map((e) => ({
      etiqueta: e.etiqueta,
      valor: e.valor,
      posicion: situar(e.valor, minimo, maximo),
      principal: e.principal === true,
    })),
    posicionObservado: situar(observado, minimo, maximo),
    fueraDeRango: observado < minimo || observado > maximo,
  };
}
