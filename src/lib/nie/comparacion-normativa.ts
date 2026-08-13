// ── NIE-1.6 + NIE-1.7 · comparación controlada e interpretación ────────────
//
// Responde una sola pregunta:
//
//   ¿Dónde se encuentra este valor observado respecto de las normas admisibles
//   y aplicables que **realmente pueden compararse con él**?
//
// Y conserva toda la incertidumbre de la evidencia al responderla.
//
// Regla que gobierna el módulo: **preferir `NO_COMPARABLE` antes que inventar
// una comparación.** Nunca convertir `NO_APLICABLE`, `NO_DETERMINABLE`,
// `UNIT_MISMATCH`, EQ-3, un conflicto o un ES-2 en un resultado limpio.
//
// Es la capa de composición: la única del motor autorizada a usar la capa de
// conversión de NIE-1.5, y **solo cuando el consumidor lo pide expresamente**.
//
// Módulo puro.

import { convertir } from './conversion-unidad';
import { entradaDe } from './conversiones';
import { interpretar, type ResultadoInterpretacion } from './estadistica';
import type { OperacionSolicitada } from './operaciones';
import type {
  Calidad,
  Candidata,
  ConflictoDeclarado,
  EstadoEvidencia,
  EstadoInterpretacion,
  EstadoNorma,
  EstadoUnidad,
  PaisId,
  Procedencia,
  ResultadoEstadistico,
  TipoNorma,
  Unidad,
} from './tipos';
import type { ValorObservado } from './valor-observado';

// ─── Entrada ────────────────────────────────────────────────────────────────

export interface OpcionesComparacion {
  /**
   * Convertir la unidad del valor observado a la de la norma cuando el par esté
   * autorizado.
   *
   * **Por defecto `false`.** Sin esto no hay conversión: una comparación que
   * requiera convertir se detiene en
   * `CONVERSION_DISPONIBLE_NO_SOLICITADA`, y quien quiera convertir lo declara
   * en su código, donde puede auditarse.
   */
  convertirUnidad?: boolean;
  /** Operación pedida al motor estadístico. Por defecto, la que el tipo autorice. */
  solicitud?: OperacionSolicitada;
}

// ─── Salida ─────────────────────────────────────────────────────────────────

/** Cómo quedó la unidad. Conserva el original intacto, siempre. */
export interface ResolucionUnidad {
  estado: EstadoUnidad;
  valorOriginal: number;
  unidadOriginal: Unidad;
  /** El valor que entró en la comparación. Igual al original si no se convirtió. */
  valorComparado: number;
  unidadComparada: Unidad;
  /** `null` cuando no se aplicó ningún factor. */
  factorAplicado: number | null;
  /**
   * El valor comparado redondeado a los decimales del original.
   *
   * `valorComparado` es el resultado aritmético completo y sirve para volver a
   * convertir; esto es lo que puede mostrarse sin afirmar una resolución que la
   * fuente no midió (`08`). `null` cuando no hubo conversión.
   */
  representacion: number | null;
  motivo: string;
}

/** Identidad de la norma, tal como el consumidor la necesita. */
export interface NormaResumen {
  id: string;
  fichaId: string;
  poblacion: string;
  pais: PaisId;
  /** Contiene el sexo cuando la norma lo distingue: la `Candidata` no lo separa. */
  estrato: string;
  instrumento: string;
  tipo: TipoNorma;
  unidad: Unidad;
  nCelda: number | null;
  calidad: Calidad;
  estado: EstadoNorma;
}

export interface ResultadoNormativo {
  norma: NormaResumen;
  /** Eje propio: una norma cuestionada lo dice, y no deja de ser utilizable. */
  estadoEvidencia: EstadoEvidencia;
  unidad: ResolucionUnidad;
  comparacion: {
    estado: EstadoInterpretacion;
    operacion: ResultadoInterpretacion['operacion'];
    resultado: ResultadoEstadistico | null;
    motivo: string;
  };
  conflicto: ConflictoDeclarado;
  limitaciones: readonly string[];
  advertencias: readonly string[];
  procedencia: Procedencia;
}

export interface InterpretacionNormativa {
  observado: { valor: number; unidad: Unidad };
  /** Una entrada por candidata. **Nunca se elige entre ellas.** */
  resultadosNormativos: readonly ResultadoNormativo[];
  /**
   * Estado del **conjunto**, no de un miembro elegido:
   *
   * - sin comparaciones → `SIN_NORMA_APLICABLE`
   * - todas coinciden → ese estado, por unanimidad
   * - discrepan → `ESTADOS_DIVERGENTES`, y hay que mirar cada una
   *
   * Nunca se toma el estado de la primera. Que dos normas comparables digan
   * cosas distintas es información, no un empate que resolver.
   */
  estadoGlobal: EstadoInterpretacion;
  advertencias: readonly string[];
}

// ─── Unidad ─────────────────────────────────────────────────────────────────

/**
 * Resuelve la unidad **sin convertir jamás en silencio**.
 *
 * La conversión, cuando ocurre, se aplica al **valor observado**, nunca al
 * normativo: los valores de la NKB no se tocan.
 */
function resolverUnidad(
  observado: ValorObservado,
  destino: Unidad,
  convertirSiSePuede: boolean,
): ResolucionUnidad {
  const base = {
    valorOriginal: observado.valor,
    unidadOriginal: observado.unidad,
    valorComparado: observado.valor,
    unidadComparada: observado.unidad,
    factorAplicado: null as number | null,
    representacion: null as number | null,
  };

  if (observado.unidad === destino) {
    return { ...base, estado: 'MISMA_UNIDAD', motivo: 'Observado y norma comparten unidad' };
  }

  const entrada = entradaDe(observado.unidad, destino);

  if (!entrada || entrada.estado === 'NO_AUTORIZADO') {
    return {
      ...base,
      estado: entrada ? 'CONVERSION_NO_AUTORIZADA' : 'UNIT_MISMATCH',
      motivo:
        entrada?.motivo ??
        `El par ${observado.unidad} → ${destino} no está declarado. La tabla de conversiones es cerrada`,
    };
  }

  if (!convertirSiSePuede) {
    return {
      ...base,
      estado: 'CONVERSION_DISPONIBLE_NO_SOLICITADA',
      motivo:
        `El par ${observado.unidad} → ${destino} está autorizado, pero nadie pidió convertir. ` +
        'La conversión es una decisión externa que debe declararse',
    };
  }

  const r = convertir(observado.valor, observado.unidad, destino);
  if (r.estado === 'NO_AUTORIZADA') {
    return { ...base, estado: 'CONVERSION_NO_AUTORIZADA', motivo: r.motivo };
  }

  return {
    valorOriginal: r.conversion.valorOriginal,
    unidadOriginal: r.conversion.unidadOriginal,
    valorComparado: r.conversion.valorConvertido,
    unidadComparada: r.conversion.unidadDestino,
    factorAplicado: r.conversion.trazabilidad.factor,
    representacion: r.conversion.representacion,
    estado: 'CONVERSION_AUTORIZADA',
    motivo: `${r.conversion.advertencia}. ${r.conversion.trazabilidad.definicion}`,
  };
}

// ─── Comparación ────────────────────────────────────────────────────────────

function resumir(c: Candidata): NormaResumen {
  return {
    id: c.normaId,
    fichaId: c.fichaId,
    poblacion: c.poblacion,
    pais: c.pais,
    estrato: c.estrato,
    instrumento: c.instrumento,
    tipo: c.tipo,
    unidad: c.unidad,
    nCelda: c.nCelda,
    calidad: c.calidad,
    estado: c.estadoNorma,
  };
}

function sinComparar(
  c: Candidata,
  unidad: ResolucionUnidad,
  estado: EstadoInterpretacion,
  motivo: string,
): ResultadoNormativo {
  return {
    norma: resumir(c),
    estadoEvidencia: c.estadoNorma === 'ES-2' ? 'CUESTIONADA' : 'ACTIVA',
    unidad,
    comparacion: { estado, operacion: 'NINGUNA', resultado: null, motivo },
    conflicto: c.conflicto,
    limitaciones: c.limitaciones,
    advertencias: c.advertencias,
    procedencia: c.procedencia,
  };
}

/**
 * Compara un valor observado contra una candidata.
 *
 * Orden de comprobación. Cada paso puede detener la comparación, y detenerse es
 * el resultado correcto cuando la evidencia no alcanza:
 *
 *   1. **EQ-3** — se comprueba **antes que la unidad**, porque un problema
 *      metodológico no lo arregla ninguna conversión.
 *   2. **Aplicabilidad** — otra incompatibilidad o falta de información.
 *   3. **Unidad** — misma, convertible-y-solicitada, o se detiene.
 *   4. **Operación** — la que el tipo de norma autorice (`estadistica.ts`).
 */
export function compararValor(
  observado: ValorObservado,
  candidata: Candidata,
  opciones: OpcionesComparacion = {},
): ResultadoNormativo {
  const unidadSinTocar: ResolucionUnidad = {
    estado: observado.unidad === candidata.unidad ? 'MISMA_UNIDAD' : 'UNIT_MISMATCH',
    valorOriginal: observado.valor,
    unidadOriginal: observado.unidad,
    valorComparado: observado.valor,
    unidadComparada: observado.unidad,
    factorAplicado: null,
    representacion: null,
    motivo: 'No se llegó a resolver la unidad: la comparación se detuvo antes',
  };

  // 1 · EQ-3 primero. La unidad no resuelve un problema de método.
  if (candidata.discrepancias.includes('instrumento')) {
    return sinComparar(
      candidata,
      unidadSinTocar,
      'NO_COMPARABLE_EQ3',
      'Los métodos están en EQ-3. Ni la coincidencia de unidad, población o edad los hace comparables',
    );
  }

  const utilizable =
    candidata.aplicabilidad === 'APLICABLE' ||
    candidata.aplicabilidad === 'APLICABLE_CON_RESERVAS';

  // 2 · Cualquier otra razón por la que la norma no corresponde.
  if (!utilizable) {
    return sinComparar(
      candidata,
      unidadSinTocar,
      'NO_COMPARABLE',
      `La norma no corresponde a este caso (${candidata.aplicabilidad}): ` +
        (candidata.discrepancias.length > 0
          ? `discrepa en ${candidata.discrepancias.join(', ')}`
          : `falta información sobre ${candidata.camposFaltantes.join(', ')}`),
    );
  }

  // 3 · Unidad.
  const unidad = resolverUnidad(observado, candidata.unidad, opciones.convertirUnidad === true);
  if (unidad.estado !== 'MISMA_UNIDAD' && unidad.estado !== 'CONVERSION_AUTORIZADA') {
    const estado: EstadoInterpretacion =
      unidad.estado === 'UNIT_MISMATCH' ? 'UNIDAD_INCOMPATIBLE' : 'NO_COMPARABLE';
    return sinComparar(candidata, unidad, estado, unidad.motivo);
  }

  // 4 · La operación que el tipo autorice, sobre el valor ya en la unidad de la
  // norma. El motor estadístico no sabe nada de conversiones.
  const observadoEnUnidadNorma: ValorObservado = {
    ...observado,
    valor: unidad.valorComparado,
    unidad: unidad.unidadComparada,
  };
  const r = interpretar(observadoEnUnidadNorma, candidata, opciones.solicitud ?? 'AUTOMATICA');

  return {
    norma: resumir(candidata),
    estadoEvidencia: candidata.estadoNorma === 'ES-2' ? 'CUESTIONADA' : 'ACTIVA',
    unidad,
    comparacion: {
      estado: r.estado,
      operacion: r.operacion,
      resultado: r.resultado,
      motivo: r.motivo,
    },
    conflicto: candidata.conflicto,
    limitaciones: candidata.limitaciones,
    advertencias: candidata.advertencias,
    procedencia: candidata.procedencia,
  };
}

/**
 * Compara contra **todas** las candidatas y devuelve una entrada por cada una.
 *
 * No elige, no ordena, no consolida y no descarta por calidad. Si hay dos
 * normas aplicables, hay dos resultados.
 */
export function interpretarNormativamente(
  observado: ValorObservado,
  candidatas: readonly Candidata[],
  opciones: OpcionesComparacion = {},
): InterpretacionNormativa {
  const resultados = candidatas.map((c) => compararValor(observado, c, opciones));

  const comparadas = resultados.filter(
    (r) => r.comparacion.resultado !== null,
  );

  const advertencias: string[] = [];

  if (comparadas.length > 1) {
    advertencias.push(
      `Hay ${comparadas.length} normas comparables con este valor. El motor no elige entre ellas: ` +
        'la selección es una decisión externa que debe declararse.',
    );
  }
  if (resultados.some((r) => r.estadoEvidencia === 'CUESTIONADA')) {
    advertencias.push(
      'Alguna norma está en ES-2 · Cuestionada. Que exista una comparación válida no elimina la objeción científica.',
    );
  }
  if (resultados.some((r) => r.conflicto !== 'ninguno')) {
    advertencias.push(
      'Alguna norma arrastra un conflicto declarado por la NKB. El motor lo propaga; no lo resuelve.',
    );
  }
  if (resultados.some((r) => r.unidad.estado === 'CONVERSION_DISPONIBLE_NO_SOLICITADA')) {
    advertencias.push(
      'Alguna comparación se detuvo porque requeriría convertir la unidad y no se solicitó. ' +
        'Convertir es una decisión externa.',
    );
  }

  // El estado del conjunto se deriva por unanimidad, nunca tomando el primero.
  // Se lee del conjunto de estados **distintos**, no de una posición entre las
  // normas: cuando hay unanimidad ese conjunto tiene un solo miembro, y tomarlo
  // no elige nada porque cualquier otra daría lo mismo. `distintos` es una lista
  // de estados, nunca de candidatas.
  const distintos = [...new Set(comparadas.map((r) => r.comparacion.estado))];
  const estadoGlobal: EstadoInterpretacion =
    distintos.length === 0
      ? 'SIN_NORMA_APLICABLE'
      : distintos.length === 1
        ? distintos[0]
        : 'ESTADOS_DIVERGENTES';

  if (estadoGlobal === 'ESTADOS_DIVERGENTES') {
    advertencias.push(
      'Las normas comparables no coinciden en su estado. No hay un resultado único que resumirlas: ' +
        'cada una debe leerse con su norma.',
    );
  }

  return {
    observado: { valor: observado.valor, unidad: observado.unidad },
    resultadosNormativos: resultados,
    estadoGlobal,
    advertencias,
  };
}

/** Resultados que llegaron a producir una comparación. **Filtrar no es elegir.** */
export function comparables(
  i: InterpretacionNormativa,
): readonly ResultadoNormativo[] {
  return i.resultadosNormativos.filter((r) => r.comparacion.resultado !== null);
}
