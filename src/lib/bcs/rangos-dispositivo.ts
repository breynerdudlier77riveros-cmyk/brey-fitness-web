// ── Rangos de referencia del aparato, por cliente (Sprint BCS-13) ──────────
//
// LA BARRA QUE EL PROFESIONAL PEDÍA, Y POR QUÉ TARDÓ TANTO EN SER POSIBLE.
//
//   Los analizadores comerciales pintan una banda «Bajo / Normal / Alto» en
//   cada variable. Reproducirla parecía cuestión de cargar una tabla, y no
//   había ninguna tabla que cargar.
//
//   Se comprobó contra una hoja real del InBody 770 (184 cm, varón). Los
//   rangos impresos son una FÓRMULA sobre la talla:
//
//     peso estándar   = IMC 22 × talla²
//     MLG estándar    = 85 % del peso estándar
//     cada componente = fracción fija de la MLG estándar
//     banda           = ±10 %, y la grasa 80–160 %
//
//   Once de doce variables encajan al segundo decimal. Así que la banda no
//   dice en qué percentil de una población caes: dice a qué distancia estás de
//   un valor calculado desde tu estatura. Son dos afirmaciones distintas, y
//   este módulo existe para no confundirlas.
//
// ── LO QUE SE DIBUJA Y LO QUE NO SE DICE ──────────────────────────────────
//
//   SÍ: el eje, los dos números del fabricante, y dónde cae el valor.
//   NO: «Normal», «Standard», «Bajo». Ni verde, ni ámbar, ni rojo.
//
//   No es cautela decorativa. La CKB (12 §5) excluye los rangos comerciales
//   con este motivo exacto: «un rango de referencia es lo que convertiría una
//   descripción en una clasificación». La prohibición es a la ETIQUETA, no al
//   eje — y sin etiqueta la barra sigue siendo una descripción, que es lo que
//   el sistema lleva doce sprints emitiendo.
//
//   Se pierde una palabra y se gana el eje entero. «Normal» comprime siete
//   números en un adjetivo.
//
// ── POR QUÉ SE TRANSCRIBEN Y NO SE CALCULAN ───────────────────────────────
//
//   La fórmula se dedujo aquí; InBody no la publica. Encaja perfecto en la
//   hoja de un varón, y no hay ninguna hoja de mujer con la que comprobar sus
//   constantes, que son distintas. Aplicar las masculinas a una clienta daría
//   doce rangos equivocados sin que nada fallara — el peor tipo de error.
//
//   Transcribir de la hoja es exacto para los dos sexos y se puede comprobar
//   contra el papel. Y es una sola vez por cliente: los rangos dependen de la
//   talla y el sexo, que no cambian entre mediciones.
//
// Módulo puro.

import type { VariableId } from '@/lib/bcs/reporte';

export interface RangoDispositivo {
  min: number;
  max: number;
}

/** Lo que se captura de la hoja. Una variable sin entrada no dibuja barra. */
export type RangosDispositivo = Partial<Record<VariableId, RangoDispositivo>>;

/**
 * Las variables cuyo rango imprime la hoja del InBody 770, en su orden.
 *
 * Es el orden de la propia hoja, no el del catálogo: quien transcribe va
 * leyendo de arriba abajo, y reordenarlo aquí le obligaría a buscar cada
 * línea. La lista sale de una hoja real, no de la documentación.
 */
export const CAPTURABLES: readonly { id: VariableId; enLaHoja: string }[] = [
  { id: 'agua_total_l', enLaHoja: 'Agua Corporal Total (ACT)' },
  { id: 'agua_intracelular_l', enLaHoja: 'Agua Intracelular (AIC)' },
  { id: 'agua_extracelular_l', enLaHoja: 'Agua Extracelular (AEC)' },
  { id: 'proteina_kg', enLaHoja: 'Proteínas' },
  { id: 'minerales_kg', enLaHoja: 'Minerales' },
  { id: 'masa_osea_kg', enLaHoja: 'Contenido Mineral Óseo' },
  { id: 'masa_grasa_kg', enLaHoja: 'Masa Grasa Corporal' },
  { id: 'masa_libre_grasa_kg', enLaHoja: 'Masa Libre de Grasa' },
  { id: 'peso_kg', enLaHoja: 'Peso' },
  { id: 'masa_muscular_kg', enLaHoja: 'Masa de Músculo Esquelético' },
  { id: 'imc', enLaHoja: 'IMC' },
  { id: 'grasa_pct', enLaHoja: 'PGC (Porcentaje de Grasa Corporal)' },
  { id: 'bmr_kcal', enLaHoja: 'Tasa Metabólica Basal' },
  { id: 'whr', enLaHoja: 'Relación Cintura-Cadera' },
];

/** Dónde cae `valor` en la banda del aparato. `null` si no hay rango. */
export type PosicionBanda =
  | { clase: 'dentro'; min: number; max: number }
  | { clase: 'por_debajo'; min: number; max: number }
  | { clase: 'por_encima'; min: number; max: number };

export function situarEnBanda(
  variable: VariableId,
  valor: number,
  rangos: RangosDispositivo | null,
): PosicionBanda | null {
  const r = rangos?.[variable];
  if (!r) return null;
  // Un rango invertido o degenerado no se «arregla»: no se usa. Vendría de un
  // error al transcribir, y una banda de anchura cero sitúa a cualquiera fuera.
  if (!(r.max > r.min)) return null;

  if (valor < r.min) return { clase: 'por_debajo', min: r.min, max: r.max };
  if (valor > r.max) return { clase: 'por_encima', min: r.min, max: r.max };
  return { clase: 'dentro', min: r.min, max: r.max };
}

/** Coma decimal. Solo presentación. */
const n = (v: number): string => String(v).replace('.', ',');

/**
 * La posición, en palabras. Sin categoría, por lo dicho arriba.
 *
 * Fíjate en lo que NO aparece: ni «normal» ni «bajo» ni «alto». Se dice dónde
 * cae respecto a dos números que se nombran, y quien lee decide.
 */
export function redactarBanda(p: PosicionBanda, unidad: string): string {
  const banda = `${n(p.min)}–${n(p.max)} ${unidad}`;
  switch (p.clase) {
    case 'dentro':
      return `Tu valor cae dentro del intervalo que tu aparato imprime para ti: ${banda}.`;
    case 'por_debajo':
      return `Tu valor queda por debajo del intervalo que tu aparato imprime para ti: ${banda}.`;
    case 'por_encima':
      return `Tu valor queda por encima del intervalo que tu aparato imprime para ti: ${banda}.`;
  }
}

/** La advertencia de procedencia. Va siempre, pegada a la barra. */
export function procedenciaBanda(dispositivo: string | null): string {
  const aparato = dispositivo ?? 'tu analizador';
  return (
    `Este intervalo lo calcula ${aparato} a partir de tu estatura y tu sexo, no de una población ` +
    'medida: no es un percentil y su método no está publicado. Sirve para ver a qué distancia ' +
    'estás del valor que el aparato considera de referencia para alguien de tu talla, y no se ' +
    'compara con la escala de otra marca.'
  );
}
