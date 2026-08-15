// ── Rótulos del informe (PRS v2.0) ─────────────────────────────────────────
//
// Traduce identificadores del NIE a texto legible. **Traducir no es juzgar**:
// ninguna de estas cadenas contiene «bajo», «alto», «bueno», «deficiente» ni
// nada equivalente, y hay un test que lo comprueba sobre la lista entera.
//
// Cuando el NIE ya redacta un motivo, se usa el suyo. Estas etiquetas son para
// los códigos, no para sustituir su prosa.

import type { Calidad, EstadoInterpretacion, EstadoNorma, EstadoUnidad } from '@/lib/nie';

export const ETIQUETA_INTERPRETACION: Readonly<Record<EstadoInterpretacion, string>> = {
  COINCIDE_CON_PERCENTIL: 'Coincide con un percentil publicado',
  ENTRE_PERCENTILES_PUBLICADOS: 'Entre dos percentiles publicados',
  // «inferior» y «superior» describen aquí el extremo del intervalo, no a la
  // persona — pero son dos de las palabras que la doctrina prohíbe, y una
  // etiqueta que exige explicar por qué no es lo que parece está mal escrita.
  // Se nombra el valor publicado, que es de lo que se habla.
  POR_DEBAJO_DEL_MENOR_PUBLICADO: 'Por debajo del menor valor publicado',
  POR_ENCIMA_DEL_MAYOR_PUBLICADO: 'Por encima del mayor valor publicado',
  // «Puntuación» se lee como nota, y de ahí a percentil y a clasificación hay
  // un paso. Lo que TN-2 produce es una distancia a la media, y así se nombra.
  CALCULADA: 'Distancia respecto a la media',
  OPERACION_NO_AUTORIZADA: 'La norma no autoriza esa operación',
  DATOS_INSUFICIENTES: 'La norma no publica lo que la operación necesita',
  NORMA_NO_APLICABLE: 'La norma no corresponde a este caso',
  UNIDAD_INCOMPATIBLE: 'Unidades distintas, sin conversión declarada',
  SIN_NORMA_APLICABLE: 'Sin norma aplicable',
  SIN_PUNTO_DE_CORTE_ADMISIBLE: 'Sin punto de corte admisible',
  SIN_CLASIFICACION_ADMISIBLE: 'Sin clasificación admisible',
  NO_COMPARABLE: 'No comparable',
  NO_COMPARABLE_EQ3: 'Método no equivalente (EQ-3)',
  ESTADOS_DIVERGENTES: 'Varias normas, con resultados distintos',
};

export const ETIQUETA_CALIDAD: Readonly<Record<Calidad, string>> = {
  alta: 'Alta',
  moderada: 'Moderada',
  baja: 'Baja',
  muy_baja: 'Muy baja',
};

export const ETIQUETA_ESTADO_NORMA: Readonly<Record<EstadoNorma, string>> = {
  'ES-1': 'Activa',
  'ES-2': 'Cuestionada',
  'ES-3': 'Suspendida',
  'ES-4': 'Retirada',
  'ES-5': 'Histórica',
};

export const ETIQUETA_UNIDAD: Readonly<Record<EstadoUnidad, string>> = {
  MISMA_UNIDAD: 'Misma unidad',
  CONVERSION_AUTORIZADA: 'Unidad convertida',
  CONVERSION_DISPONIBLE_NO_SOLICITADA: 'Conversión disponible, no solicitada',
  CONVERSION_NO_AUTORIZADA: 'Conversión no autorizada',
  UNIT_MISMATCH: 'Unidades distintas',
};

export const ETIQUETA_PAIS: Readonly<Record<string, string>> = {
  CO: 'Colombia',
  CL: 'Chile',
  BR: 'Brasil',
  DE: 'Alemania',
};

export const ETIQUETA_CONFLICTO: Readonly<Record<string, string>> = {
  ninguno: 'Ninguno registrado',
  CONFLICTO: 'Conflicto declarado',
  CONFLICTO_NO_DETERMINABLE: 'Conflicto no determinable',
};

/** Nombre visible de una variable de la NKB. */
export const ETIQUETA_VARIABLE: Readonly<Record<string, string>> = {
  fuerza_prension_manual: 'Fuerza de prensión manual',
};
