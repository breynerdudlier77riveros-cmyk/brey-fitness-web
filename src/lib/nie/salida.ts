// ── NIE-1.8 + NIE-1.9 · resolución final y contrato de salida ──────────────
//
// Qué es «resolver» aquí, y qué NO es:
//
//   Resolver = **representar estructuralmente el conjunto** de resultados, de
//   forma que el consumidor pueda navegarlo sin que nadie haya decidido por él.
//
//   Resolver NO es reducir. No hay «mejor norma», no hay resultado final, no
//   hay desempate. Si dos normas dicen cosas distintas, la salida dice que dos
//   normas dicen cosas distintas.
//
// La regla estructural que lo garantiza: **toda vista es una partición.** Las
// listas de este módulo se obtienen filtrando el mismo array, conservando su
// orden, y su unión reconstruye el original entrada por entrada. Un test lo
// comprueba: filtrar no es elegir, precisamente porque no se pierde nadie.
//
// Módulo puro. No importa la capa de conversión: recibe ya resuelto lo que la
// composición decidió sobre la unidad.

import type { InterpretacionNormativa, ResultadoNormativo } from './comparacion-normativa';
import type {
  ConflictoDeclarado,
  ContextoEvaluacion,
  EstadoInterpretacion,
  EstadoResolucion,
  EstadoUnidad,
  Procedencia,
  ResolucionNormativa,
  Unidad,
} from './tipos';

// ─── Vistas ─────────────────────────────────────────────────────────────────

/**
 * Los resultados repartidos en dos, sin perder ni reordenar ninguno.
 *
 * `comparables` son los que produjeron un resultado estadístico.
 * `noComparables` son los que se detuvieron, **cada uno con su motivo**: nunca
 * se colapsan en un `false` ni desaparecen de la salida.
 */
export interface Particion {
  comparables: readonly ResultadoNormativo[];
  noComparables: readonly ResultadoNormativo[];
}

/**
 * Qué estados distintos produjeron las normas comparables, y cuáles los
 * produjeron.
 *
 * `null` cuando hay unanimidad o cuando no hay ninguna comparable. **No lleva
 * un estado ganador**: lleva el reparto completo para que se lea entero.
 */
export interface Divergencia {
  estados: readonly EstadoInterpretacion[];
  porEstado: readonly { estado: EstadoInterpretacion; normas: readonly string[] }[];
}

/** Qué normas están cuestionadas y cuáles no. Ambas listas, siempre. */
export interface Evidencia {
  activas: readonly string[];
  cuestionadas: readonly string[];
}

/** Un conflicto declarado por la NKB, tal como llega. */
export interface ConflictoPropagado {
  normaId: string;
  conflicto: ConflictoDeclarado;
  advertencias: readonly string[];
}

/** Lo que pasó con la unidad en una norma concreta. Incluye lo que NO se hizo. */
export interface ConversionRegistrada {
  normaId: string;
  estado: EstadoUnidad;
  valorOriginal: number;
  unidadOriginal: Unidad;
  valorConvertido: number | null;
  unidadDestino: Unidad;
  factorAplicado: number | null;
  representacion: number | null;
  motivo: string;
}

/**
 * Las siete situaciones que el contrato obliga a distinguir (NIE-1.9).
 *
 * **No son un enum**, y no deben serlo: no se excluyen entre sí. El caso ENSIN
 * es a la vez `interpretable` y `cuestionada`; un caso con TN-1 y TN-2 es a la
 * vez `interpretable` y `divergente`. Un único estado obligaría a elegir cuál
 * de las dos contar, que es exactamente lo que este motor no hace.
 *
 * Cada campo lleva las normas que lo sostienen, no un booleano: una distinción
 * sin trazabilidad no puede auditarse.
 */
export interface Distinciones {
  /** A · Ninguna norma de esta variable existe en la NKB. */
  sinNormaEnLaBase: boolean;
  /** B · Existe norma, pero no corresponde a este caso. */
  noAplicables: readonly string[];
  /** C · Existe norma, pero falta información para decidir. */
  indeterminadas: readonly string[];
  /** D · Existe norma y produjo un resultado. */
  interpretables: readonly string[];
  /** E · Existe norma utilizable, y está cuestionada. */
  cuestionadas: readonly string[];
  /** F · Varias comparables que no dicen lo mismo. */
  divergentes: boolean;
  /** G · La unidad podría convertirse, y no se pidió. */
  conversionDisponibleNoSolicitada: readonly string[];
}

// ─── La salida ──────────────────────────────────────────────────────────────

export interface SalidaNIE {
  observado: { valor: number; unidad: Unidad };
  contexto: ContextoEvaluacion;

  /** Cuántas normas se evaluaron. Debe cuadrar con `resultados`. */
  candidatasEvaluadas: number;
  /** **Todas**, en el orden de la NKB. Nadie falta, nadie se adelanta. */
  resultados: readonly ResultadoNormativo[];
  particion: Particion;

  /** Eje de candidatura y aplicabilidad. Lo fija `resolucion.ts` (NIE-1.1/1.2). */
  estadoResolucion: EstadoResolucion;
  /** Eje de interpretación del conjunto. Lo fija la composición (NIE-1.6). */
  estadoInterpretacion: EstadoInterpretacion;

  divergencia: Divergencia | null;
  evidencia: Evidencia;
  conflictos: readonly ConflictoPropagado[];
  conversiones: readonly ConversionRegistrada[];
  distinciones: Distinciones;

  advertencias: readonly string[];
  /** Una entrada por resultado, en el mismo orden. Reconstruye el origen de todo. */
  trazabilidad: readonly Procedencia[];
}

// ─── Construcción ───────────────────────────────────────────────────────────

const ids = (rs: readonly ResultadoNormativo[]): readonly string[] => rs.map((r) => r.norma.id);

function repartir(comparables: readonly ResultadoNormativo[]): Divergencia | null {
  const estados = [...new Set(comparables.map((r) => r.comparacion.estado))];
  if (estados.length < 2) return null;
  return {
    estados,
    porEstado: estados.map((estado) => ({
      estado,
      normas: ids(comparables.filter((r) => r.comparacion.estado === estado)),
    })),
  };
}

/**
 * Compone la salida final a partir de lo que ya decidieron las capas previas.
 *
 * **No decide nada nuevo.** No vuelve a comparar, no reevalúa aplicabilidad, no
 * toca unidades y no interpreta: recoloca. Por eso recibe las dos resoluciones
 * ya hechas en lugar de rehacerlas — si volviera a calcular, podría discrepar
 * de ellas, y entonces habría dos verdades.
 */
export function construirSalida(
  resolucion: ResolucionNormativa,
  interpretacion: InterpretacionNormativa,
): SalidaNIE {
  const resultados = interpretacion.resultadosNormativos;

  const comparables = resultados.filter((r) => r.comparacion.resultado !== null);
  const noComparables = resultados.filter((r) => r.comparacion.resultado === null);

  const utilizables = resolucion.candidatas.filter(
    (c) => c.aplicabilidad === 'APLICABLE' || c.aplicabilidad === 'APLICABLE_CON_RESERVAS',
  );
  const utilizable = new Set(utilizables.map((c) => c.normaId));

  const porAplicabilidad = (estado: string): readonly string[] =>
    resolucion.candidatas.filter((c) => c.aplicabilidad === estado).map((c) => c.normaId);

  const divergencia = repartir(comparables);

  const conversiones: ConversionRegistrada[] = resultados
    .filter((r) => r.unidad.estado !== 'MISMA_UNIDAD')
    .map((r) => ({
      normaId: r.norma.id,
      estado: r.unidad.estado,
      valorOriginal: r.unidad.valorOriginal,
      unidadOriginal: r.unidad.unidadOriginal,
      valorConvertido: r.unidad.factorAplicado === null ? null : r.unidad.valorComparado,
      unidadDestino: r.norma.unidad,
      factorAplicado: r.unidad.factorAplicado,
      representacion: r.unidad.representacion,
      motivo: r.unidad.motivo,
    }));

  return {
    observado: interpretacion.observado,
    contexto: resolucion.contexto,

    candidatasEvaluadas: resultados.length,
    resultados,
    particion: { comparables, noComparables },

    estadoResolucion: resolucion.estadoGlobal,
    estadoInterpretacion: interpretacion.estadoGlobal,

    divergencia,
    evidencia: {
      activas: ids(resultados.filter((r) => r.estadoEvidencia === 'ACTIVA')),
      cuestionadas: ids(resultados.filter((r) => r.estadoEvidencia === 'CUESTIONADA')),
    },
    conflictos: resultados
      .filter((r) => r.conflicto !== 'ninguno')
      .map((r) => ({
        normaId: r.norma.id,
        conflicto: r.conflicto,
        advertencias: r.advertencias,
      })),
    conversiones,
    distinciones: {
      sinNormaEnLaBase: resultados.length === 0,
      noAplicables: porAplicabilidad('NO_APLICABLE'),
      indeterminadas: porAplicabilidad('NO_DETERMINABLE'),
      interpretables: ids(comparables),
      // Solo las que además son utilizables: una ES-2 que ni siquiera
      // corresponde a este caso ya está contada en `noAplicables`.
      cuestionadas: ids(
        resultados.filter((r) => r.estadoEvidencia === 'CUESTIONADA' && utilizable.has(r.norma.id)),
      ),
      divergentes: divergencia !== null,
      conversionDisponibleNoSolicitada: ids(
        resultados.filter((r) => r.unidad.estado === 'CONVERSION_DISPONIBLE_NO_SOLICITADA'),
      ),
    },

    advertencias: [...resolucion.advertencias, ...interpretacion.advertencias],
    trazabilidad: resultados.map((r) => r.procedencia),
  };
}
