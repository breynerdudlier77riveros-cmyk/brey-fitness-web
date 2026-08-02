// ── Contratos del Recommendation Engine del BCS (Sprint BCS-4.0) ───────────
// DTO derivado, NUNCA persistido: se computa on-demand a partir de un
// BodyCompositionAnalysis ya construido. No existe tabla ni columna para nada
// de este archivo y este Sprint no crea ninguna.
//
// Una recomendación de este motor NUNCA es un consejo clínico. Es la
// consecuencia operativa de un estado que el Analysis Engine ya determinó, y
// siempre lleva la referencia de la regla que la produjo — sin cajas negras.

import type { VariableId } from '@/lib/bcs/reporte';

/**
 * Categoría de la recomendación. Cada recomendación pertenece exactamente a
 * una.
 *
 * Las categorías clínicas que el encargo enumeraba (nutrición, actividad
 * física, derivación profesional, educación del cliente, adherencia) NO
 * aparecen aquí: ningún handbook del ecosistema define criterio alguno para
 * emitirlas sobre composición corporal, y el motor no inventa reglas. Ver
 * `LIMITACIONES_DE_ALCANCE` en reglas.ts, que las declara explícitamente en
 * la salida en vez de callarlas.
 */
export type CategoriaRecomendacion =
  | 'control_de_calidad'
  | 'medicion'
  | 'seguimiento'
  | 'reevaluacion'
  | 'composicion_corporal'
  | 'interpretacion';

export type PrioridadRecomendacion = 'alta' | 'media' | 'baja' | 'informativa';

/** Estado de la recomendación dentro del reporte. */
export type EstadoRecomendacion = 'activa' | 'no_aplicable';

/** De dónde sale la autoridad de una regla. La distinción es auditable. */
export type OrigenEvidencia =
  /** Afirmación literal de un handbook del ecosistema. */
  | 'handbook'
  /** Contrato del Analysis Engine, ya implementado y probado. */
  | 'motor_analisis';

export interface Evidencia {
  origen: OrigenEvidencia;
  /** Documento o módulo concreto: "BCS Handbook 03", "BCS Design Handbook 12"… */
  referencia: string;
  /** Qué dice exactamente la fuente, en sus términos. */
  cita: string;
}

export interface ProfessionalRecommendation {
  /** Id estable = id de la regla, más el discriminante cuando aplica. */
  id: string;
  /** Id de la regla del catálogo que la produjo. */
  regla: string;
  categoria: CategoriaRecomendacion;
  prioridad: PrioridadRecomendacion;
  titulo: string;
  descripcion: string;
  /** Por qué se emitió, en términos del dato observado. */
  fundamento: string;
  evidencia: Evidencia;
  variablesRelacionadas: VariableId[];
  /** Qué hace el profesional con esto. Nunca una prescripción clínica. */
  accionProfesional: string;
  /** Qué observar después. `null` cuando la regla no define seguimiento. */
  seguimiento: string | null;
  /** Qué NO cubre esta recomendación. */
  limitaciones: string[];
  /** Ids de los hallazgos o avisos del análisis que la dispararon. */
  origenHallazgos: string[];
  estado: EstadoRecomendacion;
}

/**
 * Motivo por el que el motor NO puede emitir recomendaciones de cierto tipo.
 * Se devuelve junto a las recomendaciones: el silencio se explica, no se
 * deja en blanco.
 */
export interface LimitacionRecomendacion {
  id: string;
  /** Ámbito sobre el que no puede recomendarse. */
  ambito: string;
  motivo: string;
}

export interface RecommendationReport {
  recomendaciones: ProfessionalRecommendation[];
  /** Ámbitos sobre los que el motor no puede pronunciarse, y por qué. */
  limitaciones: LimitacionRecomendacion[];
  /** Recuento por prioridad, para la cabecera de la sección. */
  resumen: Record<PrioridadRecomendacion, number>;
  /** Reglas del catálogo evaluadas en esta ejecución. */
  reglasEvaluadas: number;
}
