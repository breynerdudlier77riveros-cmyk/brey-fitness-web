// ── Progreso hacia un objetivo (Sprint PAS-10) ─────────────────────────────
//
// Sustituye a `progresoDe` de PAS-8, que decidía la dirección leyendo el `tipo`
// del objetivo. Eso permitía declarar «aumentar» en un esprint sin que nada lo
// impidiera, y el porcentaje habría salido exactamente invertido.
//
// Ahora la dirección viene del CATÁLOGO —propiedad del instrumento— y el tipo
// del objetivo sigue siendo la intención de quien lo fijó. Cuando se
// contradicen, no se calcula: se declara el conflicto. Un profesional que pide
// «aumentar» el tiempo de un esprint ha querido decir otra cosa, y adivinar
// cuál no es trabajo de este módulo.
//
// Módulo puro.

import type { DireccionMejora } from '@/features/performance-workspace/schemas/catalogo';

/** Por qué no puede expresarse el avance en porcentaje. */
export type MotivoSinProgreso =
  | 'SIN_PUNTO_DE_PARTIDA'
  | 'SIN_MEDICION_ACTUAL'
  | 'SIN_DIRECCION_DECLARADA'
  | 'RECORRIDO_NULO'
  | 'DIRECCION_CONTRADICE_OBJETIVO'
  | 'UNIDADES_INCOMPATIBLES'
  | 'SIN_VALOR_OBJETIVO'
  | 'SIN_RANGO_DEFINIDO'
  | 'RANGO_INVERTIDO';

/** Dónde cae el valor respecto al rango que se quería mantener. */
export type PosicionRango = 'dentro' | 'por_encima' | 'por_debajo';

/**
 * Dos formas de estar en marcha, no una.
 *
 * Un objetivo de recorrido admite una fracción: se va del punto A al B y puede
 * decirse cuánto queda. Uno de mantenimiento no: se está dentro del rango o se
 * está fuera, y expresar eso como «llevas el 70 %» sería inventar un trayecto
 * que nadie se propuso recorrer.
 */
export type ResultadoProgreso =
  | { calculable: true; clase: 'recorrido'; proporcion: number; superado: boolean }
  | { calculable: true; clase: 'mantenimiento'; posicion: PosicionRango; dentro: boolean }
  | { calculable: false; motivo: MotivoSinProgreso; detalle: string };

export interface EntradaProgreso {
  /** Dirección del atributo, del catálogo. `null` = no determinada. */
  direccion: DireccionMejora | null;
  /** Lo que el profesional declaró perseguir. */
  tipo: 'aumentar' | 'reducir' | 'alcanzar' | 'mantener';
  valorInicial: number | null;
  /** `null` solo tiene sentido en `mantener`, donde la meta es el rango. */
  valorObjetivo: number | null;
  /** El rango a mantener. Solo se mira cuando `tipo` es `mantener`. */
  rango: { min: number; max: number } | null;
  valorActual: number | null;
  unidadObjetivo: string;
  unidadMedicion: string | null;
}

const DETALLE: Readonly<Record<MotivoSinProgreso, string>> = {
  SIN_PUNTO_DE_PARTIDA:
    'El objetivo no declara desde qué valor se partía, así que no hay recorrido que medir. ' +
    'Tomar la primera medición del histórico inventaría una decisión que nadie tomó.',
  SIN_MEDICION_ACTUAL:
    'Todavía no hay una medición compatible con la que evaluar el avance.',
  SIN_DIRECCION_DECLARADA:
    'El catálogo no declara hacia dónde mejora esta prueba, así que no puede saberse qué lado ' +
    'del recorrido es avance.',
  RECORRIDO_NULO: 'El punto de partida y el objetivo coinciden: no hay recorrido que recorrer.',
  DIRECCION_CONTRADICE_OBJETIVO:
    'El objetivo declarado va en sentido contrario al de la prueba. No se calcula el avance ' +
    'hasta que se resuelva la contradicción.',
  UNIDADES_INCOMPATIBLES:
    'El objetivo y la medición están en unidades distintas, y no hay conversión autorizada.',
  SIN_VALOR_OBJETIVO:
    'El objetivo no declara qué valor se persigue, así que no hay meta contra la que medir el ' +
    'avance.',
  SIN_RANGO_DEFINIDO:
    'El objetivo es de mantenimiento, pero no declara entre qué valores. Sin rango no puede ' +
    'decirse si el resultado sigue dentro, y elegir uno sería fijar el objetivo en lugar del ' +
    'profesional.',
  RANGO_INVERTIDO:
    'El rango declarado tiene el mínimo por encima del máximo. Darle la vuelta supondría decidir ' +
    'cuál de los dos extremos se escribió mal.',
};

const sin = (motivo: MotivoSinProgreso): ResultadoProgreso => ({
  calculable: false,
  motivo,
  detalle: DETALLE[motivo],
});

/**
 * Cuánto se ha avanzado, cuando puede decirse.
 *
 * Las dos fórmulas del encargo, cada una con su condición:
 *
 *   mayor_mejor → (actual − inicial) / (objetivo − inicial)
 *   menor_mejor → (inicial − actual) / (inicial − objetivo)
 *
 * Son la misma proporción leída desde el lado correcto. Aplicar la primera a
 * una prueba cronometrada daría negativo justo cuando el atleta mejora.
 */
export function calcularProgreso(e: EntradaProgreso): ResultadoProgreso {
  if (e.valorActual === null) return sin('SIN_MEDICION_ACTUAL');
  if (e.unidadMedicion !== null && e.unidadMedicion !== e.unidadObjetivo) {
    return sin('UNIDADES_INCOMPATIBLES');
  }

  // El mantenimiento se resuelve antes que nada porque NO necesita dirección:
  // no pregunta hacia dónde se mejora, sino si el valor sigue dentro. Por eso
  // es el único tipo de objetivo posible en las pruebas cuya dirección el
  // catálogo deja sin declarar.
  if (e.tipo === 'mantener') {
    if (e.rango === null) return sin('SIN_RANGO_DEFINIDO');
    if (e.rango.min > e.rango.max) return sin('RANGO_INVERTIDO');
    const posicion: PosicionRango =
      e.valorActual < e.rango.min
        ? 'por_debajo'
        : e.valorActual > e.rango.max
          ? 'por_encima'
          : 'dentro';
    return { calculable: true, clase: 'mantenimiento', posicion, dentro: posicion === 'dentro' };
  }

  if (e.valorObjetivo === null) return sin('SIN_VALOR_OBJETIVO');
  if (e.direccion === null) return sin('SIN_DIRECCION_DECLARADA');

  // `alcanzar` no dice desde qué lado se llega, así que la dirección de la
  // prueba manda; los otros dos sí declaran intención y deben coincidir.
  if (e.tipo === 'aumentar' && e.direccion === 'menor_mejor') {
    return sin('DIRECCION_CONTRADICE_OBJETIVO');
  }
  if (e.tipo === 'reducir' && e.direccion === 'mayor_mejor') {
    return sin('DIRECCION_CONTRADICE_OBJETIVO');
  }

  if (e.valorInicial === null) return sin('SIN_PUNTO_DE_PARTIDA');

  const recorrido =
    e.direccion === 'mayor_mejor'
      ? e.valorObjetivo - e.valorInicial
      : e.valorInicial - e.valorObjetivo;

  if (recorrido === 0) return sin('RECORRIDO_NULO');

  const avanzado =
    e.direccion === 'mayor_mejor'
      ? e.valorActual - e.valorInicial
      : e.valorInicial - e.valorActual;

  const bruta = avanzado / recorrido;

  return {
    calculable: true,
    clase: 'recorrido',
    // Se acota a [0,1] para mostrar: un −40 % o un 130 % en una barra se leen
    // como un error de la aplicación, no como un dato.
    proporcion: Math.min(1, Math.max(0, bruta)),
    // Pero rebasarlo SÍ se declara, en vez de perderse en el tope. Estricto:
    // llegar justo al objetivo es alcanzarlo, no superarlo, y son dos frases
    // distintas para el atleta.
    superado: bruta > 1,
  };
}
