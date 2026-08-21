// ── Modelo de vista del Performance Clinical Report v2 (PRS v2.0) ──────────
//
// Todo lo que los componentes necesitan, ya resuelto. Los componentes son
// renderizadores tontos: no deciden, no calculan y no interpretan.
//
// Nada de este modelo contiene una categoría de mérito. Los estados son los
// del NIE, traducidos a texto; los textos largos son literales del NIE o de la
// NKB, transportados sin reescribir.

import type { Posicion } from '@/lib/pas/evidencia';
import type { ConflictoDeclarado, EstadoEvidencia } from '@/lib/nie';

import type { Escala } from './escala';

/** Sección 0 · portada. */
export interface Portada {
  atleta: string;
  edad: number | null;
  sexo: string | null;
  fecha: string;
  profesional: string | null;
  codigo: string;
  /** Frase que resume de qué evidencia se ha dispuesto. Sin juicio. */
  estadoCientifico: string;
}

/** Sección 1 · una tarjeta del resumen ejecutivo. */
export interface TarjetaResumen {
  id: string;
  variable: string;
  /** Estado ya rotulado, o el guion cuando no hay norma. */
  estado: string;
  /** `ES-1` · `ES-2` · `—`. */
  evidencia: string;
  /** Hay al menos una norma comparable. Gobierna el tono, nunca un juicio. */
  conNorma: boolean;
}

/** Una fila de la matriz de evidencia. */
export interface FilaEvidencia {
  dimension: string;
  estado: string;
}

/**
 * Las normas descartadas por un mismo motivo, agrupadas.
 *
 * Se agrupan porque no hacerlo destruye la sección: una consulta de prensión
 * evalúa 356 normas y descarta 354, y una lista de 354 filas no explica nada.
 * El recuento por motivo sí: «302 por método no equivalente» es la información
 * que el lector necesita, y los ejemplos le dan el detalle sin la avalancha.
 */
export interface GrupoDescarte {
  /**
   * Qué le pasó al grupo, en plural: «no comparables», «no aplicables»…
   *
   * Va separado del motivo porque **no son juicios de calidad**: una norma en
   * EQ-3 no es peor, es incomparable con este método. Escribir solo
   * «308 descartadas» invitaba a leerlas como 308 normas malas.
   */
  naturaleza: string;
  /** Por qué: `método EQ-3`, `identidad/población`, `unidad`. */
  motivoCorto: string;
  /** El motivo íntegro que redactó el NIE para un caso del grupo. */
  motivo: string;
  total: number;
  /** Hasta tres identidades, para que el motivo tenga cara. */
  ejemplos: readonly string[];
}

export interface PanelComparabilidad {
  /** Todas las normas que el NIE evaluó para esta medición. */
  evaluadas: number;
  /**
   * Las comparables, con su id y su tipo.
   *
   * El tipo es necesario en pantalla: dos candidatas de la misma población
   * —una TN-1 y una TN-2— se ven idénticas si solo se muestra «Colombia ·
   * Varones · 22 años», y parece que el sistema encontró dos veces la misma.
   */
  comparables: readonly { normaId: string; identidad: string; tipo: string }[];
  descartes: readonly GrupoDescarte[];
}

/** Sección 2 · una tarjeta del perfil normativo. Una por norma comparable. */
export interface TarjetaNormativa {
  normaId: string;
  /** Registro del que salió. Enlaza la tarjeta con su panel sin recorrer nada. */
  registroId: string;
  variable: string;
  /** El valor tal como se midió. */
  valor: number;
  unidad: string;
  /** Lo que el NIE dice de él, ya rotulado. */
  situacion: string;
  /**
   * El resultado en una línea, ya formateado: `P50`, `entre P90 y P97`,
   * `z = +1,25`. Es una lectura del resultado que produjo el NIE, no un
   * cálculo nuevo. `null` cuando no hay resultado que resumir.
   */
  resumenResultado: string | null;
  /**
   * La misma lectura, estructurada (PAS-13).
   *
   * `resumenResultado` es su rótulo; esto es el dato. Existe porque la capa de
   * presentación necesita redactar la posición en lenguaje llano, y deducirla
   * releyendo la cadena «entre P90 y P97» ataría el significado a la
   * puntuación de una frase.
   *
   * Comparte tipo con la capa de evidencia a propósito: «dónde cae un valor»
   * es una sola pregunta, la conteste la NKB o el registro de evidencia, y dos
   * vocabularios para la misma respuesta acabarían divergiendo.
   */
  posicion: Posicion | null;
  /**
   * La misma lectura en una frase, para quien no interprete la barra.
   *
   * Describe **dónde cae el valor**, nunca qué significa: «está a 1,25
   * desviaciones típicas sobre la media» es una distancia medida; «es alto»
   * sería una categoría, y no se emite ninguna.
   */
  explicacion: string | null;
  /** El motivo literal del NIE. No se reescribe. */
  motivo: string;
  /** `Colombia · 15 años · Varones`. */
  poblacion: string;
  metodo: string;
  tipo: 'TN-1' | 'TN-2';
  calidad: string;
  estadoNorma: string;
  estadoEvidencia: EstadoEvidencia;
  conflicto: ConflictoDeclarado;
  nCelda: number | null;
  /** `null` cuando la norma no publica una escala dibujable. */
  escala: Escala | null;
  /** Rótulo accesible completo de la barra. */
  aria: string;
  evidencia: readonly FilaEvidencia[];
  advertencias: readonly string[];
  referencia: string;
}

/** Sección 7 · una capacidad sin norma admisible. */
export interface TarjetaSinNorma {
  id: string;
  variable: string;
  /** El detalle literal del eslabón. Nunca «insuficiente». */
  detalle: string;
}

export interface InformeNormativoV2 {
  portada: Portada;
  resumen: readonly TarjetaResumen[];
  tarjetas: readonly TarjetaNormativa[];
  comparabilidad: Readonly<Record<string, PanelComparabilidad>>;
  sinNorma: readonly TarjetaSinNorma[];
  /** Advertencias del NIE, agregadas y sin duplicar. Literales. */
  advertencias: readonly string[];
}
