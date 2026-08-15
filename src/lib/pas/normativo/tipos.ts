// ── El eslabón PAS → NIE · contratos (PRS v2.0) ────────────────────────────
//
// Este módulo resuelve lo que faltaba entre los dos sistemas: el PAS registra
// mediciones y el NIE sabe interpretarlas, pero nadie traducía las unas a las
// otras.
//
// La regla que lo gobierna: **traducir no es suponer.** Cuando una coordenada
// no consta en el registro, se entrega `null` y el NIE responde
// `NO_DETERMINABLE`. Nunca se rellena con un valor por defecto, aunque sea el
// más frecuente, aunque sea «obvio».

import type {
  DefinicionOperacional,
  InstrumentoId,
  Lado,
  PaisId,
  Posicion,
  Sexo,
  Unidad,
  VariableId,
} from '@/lib/nie';

/**
 * Los datos del sujeto que el NIE necesita y el PAS no tiene.
 *
 * El PAS solo conoce `atletaId`: es deliberado, porque analizar la cobertura de
 * una capacidad no requiere saber la edad de nadie. Situar un valor en una
 * norma sí, y por eso entra aquí y no en `SolicitudAnalisis`.
 */
export interface SujetoNormativo {
  /** Años cumplidos. `null` = no consta. */
  edad: number | null;
  sexo: Sexo | null;
  /** En metros. Solo lo estratifican las fichas brasileñas. */
  estaturaM: number | null;
  /** País de pertenencia poblacional, no de residencia. */
  pais: PaisId | null;
}

/**
 * Cómo se lee una prueba del catálogo del PAS en coordenadas del NIE.
 *
 * Cada tabla traduce **el texto declarado en `condiciones`** al identificador
 * que usa el NIE. Un valor que no esté en la tabla no se traduce: se devuelve
 * `null`. Eso convierte un vocabulario desconocido en falta de información, que
 * es lo que es, y no en una coincidencia falsa.
 */
export interface MapeoNormativo {
  /** Id de la prueba en el catálogo del PAS. */
  pruebaId: string;
  variable: VariableId;
  /** Clave de `condiciones` de la que sale cada coordenada. */
  claves: {
    instrumento: string;
    definicionOperacional: string;
    posicion: string;
    lado: string;
  };
  /** Vocabulario declarado → identificador del NIE. Cerrado a propósito. */
  vocabulario: {
    instrumento: Readonly<Record<string, InstrumentoId>>;
    definicionOperacional: Readonly<Record<string, DefinicionOperacional>>;
    posicion: Readonly<Record<string, Posicion>>;
    lado: Readonly<Record<string, Lado>>;
  };
  /** Unidades admitidas para esta prueba. Otras se entregan sin traducir. */
  unidades: Readonly<Record<string, Unidad>>;
}

/** Por qué una prueba no llegó a consultarse contra la NKB. */
export type MotivoSinConsulta =
  /** El catálogo del PAS no declara correspondencia con ninguna variable. */
  | 'PRUEBA_NO_MAPEADA'
  /** El registro no es continuo: no hay un número que situar. */
  | 'VALOR_NO_CONTINUO'
  /** La unidad del registro no es ninguna de las que la NKB maneja. */
  | 'UNIDAD_DESCONOCIDA'
  /** El registro está anulado. Sigue habiendo ocurrido, pero no es elegible. */
  | 'REGISTRO_NO_VIGENTE';

/** Coordenada que no se pudo traducir, con el texto que venía. */
export interface CoordenadaSinTraducir {
  coordenada: string;
  /** Lo que traía el registro. `null` cuando la clave ni siquiera constaba. */
  declarado: string | null;
}
