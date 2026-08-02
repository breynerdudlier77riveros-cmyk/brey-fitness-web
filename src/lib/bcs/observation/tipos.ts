// ── Contratos del Clinical Observation Generator (COG v1.0) ────────────────
// DTO derivado, NUNCA persistido. Se computa a partir de un
// BodyCompositionAnalysis y un RecommendationReport ya construidos, más la
// proyección de la Clinical Knowledge Base.
//
// Este motor NO interpreta: redacta. Toda afirmación que emite procede de un
// hallazgo que otro motor ya determinó, y toda oración lleva la traza
// completa de por qué existe.
//
// Diseñado para ser sustituible por un LLM sin tocar el resto del ecosistema:
// el contrato de entrada y salida no cambiaría, solo la implementación de
// `render.ts`. Por eso la trazabilidad vive en el DTO y no en el código.

import type { VariableId } from '@/lib/bcs/reporte';
import type { NivelEvidencia, Poblacion } from './conocimiento';

/** Bloques del informe. Cada uno es independiente y puede omitirse. */
export type BloqueObservacion =
  | 'executive'
  | 'body_composition'
  | 'trend'
  | 'measurement_quality'
  | 'interpretation'
  | 'recommendation_summary'
  | 'scientific_limitations'
  | 'overall_summary';

/**
 * Traza completa de una observación. Permite auditar cualquier frase hasta su
 * origen sin salir del DTO.
 */
export interface Trazabilidad {
  /** Id de la plantilla que redactó la observación. */
  ruleId: string;
  /** Ids de hallazgos del Analysis Engine que la sostienen. */
  findingIds: string[];
  /** Ids de recomendaciones del Recommendation Engine que la sostienen. */
  recommendationIds: string[];
  /** Claves de referencia científica (registro de la CKB). */
  referenceIds: string[];
  /** Nivel de evidencia del conocimiento invocado, ya graduado para BREY. */
  evidenceLevel: NivelEvidencia;
  /** Población en la que se obtuvo esa evidencia. */
  population: Poblacion;
  /** Limitaciones declaradas que acompañan a la afirmación. */
  limitationsUsed: string[];
  /** Interpretaciones que la CKB prohíbe explícitamente sobre este contenido. */
  prohibitedInterpretations: string[];
  /** Fichas de la CKB invocadas. */
  knowledgeIds: string[];
}

export interface Observacion {
  /** Id estable: plantilla más discriminante cuando hay varias activaciones. */
  id: string;
  bloque: BloqueObservacion;
  /** Texto final. Entre 2 y 5 oraciones, verificado en tiempo de construcción. */
  texto: string;
  /** Oraciones por separado, para consumidores que quieran maquetarlas. */
  oraciones: string[];
  /** Variables de composición corporal mencionadas. */
  variables: VariableId[];
  trazabilidad: Trazabilidad;
}

export interface BloqueInforme {
  bloque: BloqueObservacion;
  titulo: string;
  observaciones: Observacion[];
  /**
   * `sin_datos` cuando ninguna plantilla del bloque pudo activarse. No es un
   * error: es la respuesta correcta cuando los datos no autorizan a escribir.
   */
  estado: 'emitido' | 'sin_datos';
}

export interface ClinicalObservationReport {
  bloques: BloqueInforme[];
  /** Acceso directo por bloque, para consumidores que muestren solo algunos. */
  porBloque: Record<BloqueObservacion, BloqueInforme>;
  meta: {
    plantillasEvaluadas: number;
    observacionesEmitidas: number;
    /** Bloques que quedaron sin datos, por transparencia del consumidor. */
    bloquesSinDatos: BloqueObservacion[];
  };
}

/** Entrada del orquestador. Solo DTO ya construidos: aquí no se recalcula nada. */
export interface EntradaObservacion {
  analisis: import('@/lib/bcs/analysis').BodyCompositionAnalysis;
  recomendaciones: import('@/lib/bcs/recommendations').RecommendationReport;
}
