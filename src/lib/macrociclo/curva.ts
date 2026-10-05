// ── La curva de volumen e intensidad (Sprint MAC-2) ────────────────────────
//
// El dibujo clásico del plan gráfico: dos líneas que suben y bajan semana a
// semana bajo la rejilla. Este módulo la calcula; el SVG solo la pinta.
//
// ── LO QUE LA CURVA DIBUJA ES LO QUE EL ENTRENADOR ESCRIBIÓ ──────────────
//
//   Ni una ondulación sale de aquí. Si una semana está vacía, la línea se
//   PARTE — no se interpola entre la anterior y la siguiente. Unir esos dos
//   puntos dibujaría una progresión que nadie planificó, y el ojo la leería
//   como parte del plan porque una línea continua no se lee como una
//   suposición.
//
//   Es la misma regla que el motor del PAS aplica a los percentiles: entre el
//   P90 y el P97 no hay P93, hay «entre los dos».
//
// ── POR QUÉ CADA SERIE SE NORMALIZA CONTRA SU PROPIO MÁXIMO ─────────────
//
//   La curva clásica lleva volumen e intensidad juntos, y no comparten
//   unidad: el volumen puede ser 5.000 kg y la intensidad 75 %. Dibujarlos en
//   un eje común dejaría la intensidad pegada al suelo.
//
//   Cada línea se escala a SU máximo, y el eje se etiqueta como porcentaje de
//   ese máximo. La leyenda dice cuál es el máximo real de cada serie, porque
//   un «100 %» sin decir 100 % de qué es un número sin referente.
//
// Módulo puro: misma entrada, misma salida, siempre.

import type { FilaPlan } from './tipos';

/** Un punto de la línea. `semana` en base cero. */
export interface PuntoCurva {
  semana: number;
  /** El valor tal como se escribió. */
  valor: number;
  /** 0 a 1 respecto del máximo de SU serie. */
  relativo: number;
}

/** Un tramo continuo. La línea se parte donde falta una semana. */
export type TramoCurva = PuntoCurva[];

export interface SerieCurva {
  filaId: string;
  nombre: string;
  unidad: string;
  color: string;
  /** El máximo real de la serie, para que el eje tenga referente. */
  maximo: number;
  minimo: number;
  /** Cuántas semanas tienen valor, de cuántas hay. */
  conValor: number;
  /**
   * Tramos continuos. Más de uno significa que hay huecos, y eso se ve: la
   * línea no se cierra por encima de una semana sin planificar.
   */
  tramos: TramoCurva[];
}

/**
 * Lee un valor de celda como número.
 *
 * Acepta coma decimal y tolera el signo de porcentaje, que es como se escribe
 * de verdad («75 %»). Cualquier otra cosa NO es un punto: un «alto» en la fila
 * de intensidad es una anotación legítima y no tiene sitio en una línea.
 */
export function numeroDeCelda(valor: string | null): number | null {
  if (valor === null) return null;
  const limpio = valor.trim().replace('%', '').replace(',', '.').trim();
  if (limpio === '') return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : null;
}

/**
 * Construye la serie de una fila.
 *
 * `null` cuando la fila no tiene ni un valor numérico: una serie sin puntos no
 * es una línea plana en cero, es una línea que no existe, y dibujarla en el
 * suelo diría que el volumen planificado es cero.
 */
export function serieDeFila(fila: FilaPlan): SerieCurva | null {
  if (fila.grafico === null) return null;

  const crudos: (number | null)[] = fila.valores.map(numeroDeCelda);
  const presentes = crudos.filter((v): v is number => v !== null);
  if (presentes.length === 0) return null;

  const maximo = Math.max(...presentes);
  const minimo = Math.min(...presentes);

  // Con un solo valor distinto, o con el máximo en cero, no hay escala que
  // aplicar. Se dibuja a media altura: es honesto —no hay variación que
  // mostrar— y evita dividir por cero.
  const escala = (v: number): number => (maximo === 0 ? 0.5 : v / maximo);

  const tramos: TramoCurva[] = [];
  let actual: TramoCurva = [];
  crudos.forEach((v, semana) => {
    if (v === null) {
      // El hueco PARTE la línea. Es la decisión de fondo de este módulo.
      if (actual.length > 0) tramos.push(actual);
      actual = [];
      return;
    }
    actual.push({ semana, valor: v, relativo: escala(v) });
  });
  if (actual.length > 0) tramos.push(actual);

  return {
    filaId: fila.id,
    nombre: fila.nombre,
    unidad: fila.unidad,
    color: fila.grafico,
    maximo,
    minimo,
    conValor: presentes.length,
    tramos,
  };
}

/** Las series dibujables del plan, en el orden de las filas. */
export function seriesDeCurva(filas: readonly FilaPlan[]): SerieCurva[] {
  return filas.map(serieDeFila).filter((s): s is SerieCurva => s !== null);
}

/**
 * Las marcas del eje vertical, de arriba abajo.
 *
 * Porcentajes del máximo de cada serie, como en el plan gráfico clásico. NO se
 * calculan a partir de los datos: son una retícula fija, y que lo sean es lo
 * que permite comparar dos macrociclos distintos de un vistazo.
 */
export const MARCAS_EJE: readonly number[] = [100, 90, 80, 70, 60, 50];

/**
 * Coordenadas de un punto dentro de un lienzo de `ancho` × `alto`.
 *
 * El punto se centra en SU columna de semana —de ahí el `+ 0.5`—, que es lo
 * que hace que la curva quede debajo de la celda a la que se refiere. Sin ese
 * medio paso, la línea sale corrida media columna a la izquierda y deja de
 * alinearse con la rejilla, que es todo el sentido de dibujarla ahí.
 */
export function coordenada(
  punto: PuntoCurva,
  semanas: number,
  ancho: number,
  alto: number,
  margen = 0,
): { x: number; y: number } {
  const anchoColumna = ancho / Math.max(1, semanas);
  const util = alto - margen * 2;
  return {
    x: (punto.semana + 0.5) * anchoColumna,
    // El eje crece hacia arriba y el SVG hacia abajo: se invierte aquí, una
    // sola vez, en vez de en cada sitio que dibuje.
    y: margen + util * (1 - punto.relativo),
  };
}

/** El `d` de un `<path>` para un tramo. Líneas rectas, sin suavizado. */
export function trazoDeTramo(
  tramo: TramoCurva,
  semanas: number,
  ancho: number,
  alto: number,
  margen = 0,
): string {
  // SIN CURVAS DE BÉZIER, y es deliberado: un suavizado inventa valores entre
  // dos semanas para que la línea quede bonita, y esos valores no los ha
  // escrito nadie. Una línea quebrada dice la verdad.
  return tramo
    .map((p, i) => {
      const { x, y } = coordenada(p, semanas, ancho, alto, margen);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}
