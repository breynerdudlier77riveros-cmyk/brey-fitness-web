// ── NIE-1.1 · comparación por dimensiones ──────────────────────────────────
//
// Cada coordenada se compara por separado y produce su propio estado. Es una
// operación de emparejamiento, no de recomendación: aquí no se prefiere, no se
// ordena y no se aproxima.
//
// Módulo puro. Sin E/S, sin fecha, sin azar.

import type {
  ComparacionDimension,
  ContextoEvaluacion,
  DimensionId,
  NormaNKB,
} from './tipos';
import { UNIT_MISMATCH } from './tipos';

// ─── Etiquetas legibles ─────────────────────────────────────────────────────

const INSTRUMENTOS: Record<string, string> = {
  'takei-tkk-5101': 'Takei TKK 5101 (digital)',
  'takei-t18-tkk-smedley-iii': 'Takei T-18 TKK SMEDLY III (analógico)',
  'camry-digital': 'Camry digital',
  'jamar-pc-5030-j1': 'JAMAR PC-5030 J1 (hidráulico)',
  'jamar-j00105': 'JAMAR J00105 (hidráulico)',
  'smedley-s': 'Smedley S (mecánico)',
};

const DEFINICIONES: Record<string, string> = {
  media_ambas_manos: 'media de ambas manos',
  maximo_ambas_manos: 'máximo de ambas manos',
  mejor_mano_derecha: 'mejor intento con la mano derecha',
  mejor_mano_izquierda: 'mejor intento con la mano izquierda',
  mejor_mano_dominante: 'mejor intento con la mano dominante',
  mejor_mano_no_dominante: 'mejor intento con la mano no dominante',
  media_2a_y_3a_mano_dominante: 'media de la 2.ª y 3.ª repetición, mano dominante',
};

const PAISES: Record<string, string> = {
  CO: 'Colombia',
  CL: 'Chile',
  BR: 'Brasil',
  DE: 'Alemania',
};

const etiqueta = (m: Record<string, string>, k: string) => m[k] ?? k;

// ─── Constructores ──────────────────────────────────────────────────────────

function match(
  dimension: DimensionId,
  esperado: string,
  recibido: string,
  motivo: string,
): ComparacionDimension {
  return { dimension, estado: 'MATCH', esperado, recibido, motivo };
}

function mismatch(
  dimension: DimensionId,
  esperado: string,
  recibido: string,
  motivo: string,
  codigo?: typeof UNIT_MISMATCH,
): ComparacionDimension {
  return { dimension, estado: 'MISMATCH', esperado, recibido, motivo, ...(codigo ? { codigo } : {}) };
}

function faltante(dimension: DimensionId, esperado: string, motivo: string): ComparacionDimension {
  return { dimension, estado: 'NO_DETERMINABLE', esperado, recibido: null, motivo };
}

function noAplica(dimension: DimensionId, motivo: string): ComparacionDimension {
  return { dimension, estado: 'NO_APLICA', esperado: '—', recibido: null, motivo };
}

// ─── Las diez dimensiones ───────────────────────────────────────────────────

function compararVariable(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  if (c.variable === null) {
    return faltante('variable', n.variable, 'El contexto no declara qué variable se midió');
  }
  return c.variable === n.variable
    ? match('variable', n.variable, c.variable, 'Misma variable normativa')
    : mismatch(
        'variable',
        n.variable,
        c.variable,
        'Variables distintas. No se aceptan equivalencias semánticas',
      );
}

/**
 * País. Se compara por identidad exacta.
 *
 * No existe respaldo por región: Colombia no es «Latinoamérica», y una norma
 * chilena no cubre a un colombiano por proximidad geográfica (`31`).
 */
function compararPais(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  const esperado = PAISES[n.pais];
  if (c.pais === null) {
    return faltante('pais', esperado, 'El contexto no declara la población del sujeto');
  }
  return c.pais === n.pais
    ? match('pais', esperado, PAISES[c.pais], `Población normativa de ${esperado}`)
    : mismatch(
        'pais',
        esperado,
        PAISES[c.pais],
        `La norma describe población de ${esperado}. La proximidad geográfica no sustituye a la pertenencia poblacional`,
      );
}

/**
 * Instrumento. Todos los pares están en EQ-3 · distintos (`18`, `39`).
 *
 * Compartir marca no es compartir método: Takei TKK 5101 ≠ Takei T-18 SMEDLY
 * III, y JAMAR PC-5030 J1 ≠ JAMAR J00105.
 */
function compararInstrumento(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  const esperado = etiqueta(INSTRUMENTOS, n.instrumento);
  if (c.instrumento === null) {
    return faltante(
      'instrumento',
      esperado,
      'El contexto no declara el instrumento. Sin él no puede establecerse la identidad de método',
    );
  }
  const recibido = etiqueta(INSTRUMENTOS, c.instrumento);
  return c.instrumento === n.instrumento
    ? match('instrumento', esperado, recibido, 'Mismo instrumento')
    : mismatch(
        'instrumento',
        esperado,
        recibido,
        'Instrumentos distintos. La relación entre métodos es EQ-3 y no hay evidencia publicada de equivalencia',
      );
}

/** Unidad. Nunca se convierte: el desajuste se nombra y se detiene (`39`). */
function compararUnidad(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  if (c.unidad === null) {
    return faltante('unidad', n.unidad, 'El contexto no declara la unidad de la medición');
  }
  return c.unidad === n.unidad
    ? match('unidad', n.unidad, c.unidad, 'Misma unidad')
    : mismatch(
        'unidad',
        n.unidad,
        c.unidad,
        `La norma publica en ${n.unidad} y la medición está en ${c.unidad}. La NKB no convierte unidades`,
        UNIT_MISMATCH,
      );
}

function compararDefinicion(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  const esperado = etiqueta(DEFINICIONES, n.definicionOperacional);
  if (c.definicionOperacional === null) {
    return faltante(
      'definicion_operacional',
      esperado,
      'El contexto no declara cómo se consolidó la medición',
    );
  }
  const recibido = etiqueta(DEFINICIONES, c.definicionOperacional);
  return c.definicionOperacional === n.definicionOperacional
    ? match('definicion_operacional', esperado, recibido, 'Misma definición operacional')
    : mismatch(
        'definicion_operacional',
        esperado,
        recibido,
        'El mejor intento y el promedio de intentos no son magnitudes equivalentes aunque compartan nombre',
      );
}

/**
 * Posición corporal.
 *
 * Cuando la **norma** no la declara —caso de las dos fichas alemanas, cuyo
 * CN-33 admite protocolo incompleto— no puede compararse. Eso no la convierte
 * en coincidencia: el resultado es NO_DETERMINABLE (`39`).
 */
function compararPosicion(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  if (n.posicion === null) {
    return faltante(
      'posicion',
      'no declarada por la fuente',
      'La ficha no declara la posición corporal, de modo que la correspondencia de protocolo no puede confirmarse ni descartarse',
    );
  }
  if (c.posicion === null) {
    return faltante('posicion', n.posicion, 'El contexto no declara la posición de la medición');
  }
  return c.posicion === n.posicion
    ? match('posicion', n.posicion, c.posicion, 'Misma posición corporal')
    : mismatch(
        'posicion',
        n.posicion,
        c.posicion,
        'Bipedestación y sedestación no son protocolos equivalentes',
      );
}

/** Lado medido. `ambas` describe una norma que consolida las dos manos. */
function compararLado(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  if (c.lado === null) {
    return faltante('lado', n.lado, 'El contexto no declara qué mano se midió');
  }
  return c.lado === n.lado
    ? match('lado', n.lado, c.lado, 'Mismo lado medido')
    : mismatch(
        'lado',
        n.lado,
        c.lado,
        'La norma describe otro lado. La dominancia declarada y la lateralidad anatómica tampoco son la misma coordenada',
      );
}

/**
 * Edad. La celda cubre o no cubre; no se interpola ni se extrapola.
 *
 * Una norma de 18–29 no dice nada sobre los 30, y dos normas contiguas no se
 * unen para fabricar un rango continuo (`31`).
 */
function compararEdad(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  const esperado = n.edad.min === n.edad.max ? `${n.edad.min}` : `${n.edad.min}–${n.edad.max}`;
  if (c.edad === null) {
    return faltante('edad', esperado, 'El contexto no declara la edad del sujeto');
  }
  const dentro = c.edad >= n.edad.min && c.edad <= n.edad.max;
  return dentro
    ? match('edad', esperado, String(c.edad), 'La edad cae dentro del estrato publicado')
    : mismatch(
        'edad',
        esperado,
        String(c.edad),
        'La edad queda fuera del estrato. No se interpola entre celdas ni se extrapola fuera del rango',
      );
}

function compararSexo(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  if (c.sexo === null) {
    return faltante('sexo', n.sexo, 'El contexto no declara el sexo del sujeto');
  }
  return c.sexo === n.sexo
    ? match('sexo', n.sexo, c.sexo, 'Mismo estrato de sexo')
    : mismatch('sexo', n.sexo, c.sexo, 'La norma está estratificada por sexo y corresponde al otro');
}

/** Estatura. Solo la estratifican las seis fichas brasileñas. */
function compararEstatura(c: ContextoEvaluacion, n: NormaNKB): ComparacionDimension {
  if (n.estatura === null) {
    return noAplica('estatura', 'La norma no estratifica por estatura');
  }
  const { minExclusivo: lo, maxInclusivo: hi } = n.estatura;
  const esperado =
    lo !== null && hi !== null ? `> ${lo} y ≤ ${hi} m` : lo !== null ? `> ${lo} m` : `≤ ${hi} m`;
  if (c.estaturaM === null) {
    return faltante(
      'estatura',
      esperado,
      'La norma estratifica por estatura y el contexto no la declara',
    );
  }
  const dentro = (lo === null || c.estaturaM > lo) && (hi === null || c.estaturaM <= hi);
  const recibido = `${c.estaturaM} m`;
  return dentro
    ? match('estatura', esperado, recibido, 'La estatura cae dentro del estrato publicado')
    : mismatch('estatura', esperado, recibido, 'La estatura queda fuera del estrato publicado');
}

// ─── Comparación completa ───────────────────────────────────────────────────

/** Compara las diez coordenadas de una norma contra el contexto. */
export function compararDimensiones(
  contexto: ContextoEvaluacion,
  norma: NormaNKB,
): ComparacionDimension[] {
  return [
    compararVariable(contexto, norma),
    compararPais(contexto, norma),
    compararInstrumento(contexto, norma),
    compararUnidad(contexto, norma),
    compararDefinicion(contexto, norma),
    compararPosicion(contexto, norma),
    compararLado(contexto, norma),
    compararEdad(contexto, norma),
    compararSexo(contexto, norma),
    compararEstatura(contexto, norma),
  ];
}
