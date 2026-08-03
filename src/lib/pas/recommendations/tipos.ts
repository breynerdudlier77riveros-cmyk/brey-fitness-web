// ── Contratos del PPRE (Sprint PAS-6.0) ────────────────────────────────────
// El motor recibe el Perfil Funcional del PAE, el informe del PIE y el
// conocimiento de la PKB. NUNCA registros, pruebas ni resultados brutos: todo
// llega ya derivado.
//
// Una recomendación de este motor es METODOLÓGICA: dice qué hacer con el
// DATO, jamás qué hacer con el atleta.

import type { CapacidadId } from '../capacidades';
import type { NivelEvidencia, Poblacion } from '../interpretation';

export type CategoriaRecomendacion =
  | 'calidad_perfil'
  | 'cobertura'
  | 'evidencia'
  | 'reevaluacion'
  | 'consistencia'
  | 'interpretacion'
  | 'metodologia'
  | 'seguimiento_documental';

export type PrioridadRecomendacion = 'critica' | 'alta' | 'media' | 'informativa';

/** Activa, o no aplicable porque su condición no se cumple en este perfil. */
export type EstadoRecomendacion = 'activa' | 'no_aplicable';

/**
 * Cadena de trazabilidad completa. Los siete eslabones son obligatorios; los
 * que no apliquen van vacíos, nunca ausentes.
 *
 *   capacidad → hallazgo → interpretación → ficha PKB → referencia
 *             → regla PPRE → texto final
 */
export interface TrazabilidadRecomendacion {
  capacidades: CapacidadId[];
  /** Ids de hallazgos del PAE. */
  hallazgos: string[];
  /** Ids de interpretaciones del PIE. NUNCA su texto. */
  interpretaciones: string[];
  /** Códigos de ficha de la PKB (`M-01`…). */
  fichasPKB: string[];
  /** Claves de `_evidencia/referencias.yaml`. */
  referencias: string[];
  regla: string;
  /** Plantilla que produjo el texto, para auditar la redacción. */
  plantilla: string;
}

/**
 * Evidencia que sostiene una recomendación.
 *
 * NO incluye el `alcanceAutorizado` de la ficha, pese a ser el dato más
 * informativo de la base: su redacción contiene términos que este motor tiene
 * prohibidos —«la carga máxima movilizable en el ejercicio evaluado»—. Se cita
 * la ficha en `trazabilidad.fichasPKB` y el consumidor la resuelve contra la
 * PKB, que es donde ese texto puede leerse sin restricción léxica.
 */
export interface EvidenciaRecomendacion {
  nivel: NivelEvidencia | null;
  poblaciones: Poblacion[];
}

export interface Recomendacion {
  id: string;
  categoria: CategoriaRecomendacion;
  prioridad: PrioridadRecomendacion;
  titulo: string;
  descripcion: string;
  /** Qué hace el profesional con el DATO. Nunca una indicación al atleta. */
  accionProfesional: string;
  /** Qué observar después. `null` cuando la regla no define seguimiento. */
  seguimiento: string | null;
  /** Por qué se emitió, en términos del estado observado. */
  fundamento: string;
  evidencia: EvidenciaRecomendacion;
  referencias: string[];
  /** Qué NO cubre esta recomendación. */
  limitaciones: string[];
  capacidades: CapacidadId[];
  hallazgos: string[];
  interpretaciones: string[];
  trazabilidad: TrazabilidadRecomendacion;
  estado: EstadoRecomendacion;
}

export interface EstadisticasRecomendaciones {
  total: number;
  porPrioridad: Record<PrioridadRecomendacion, number>;
  porCategoria: Record<CategoriaRecomendacion, number>;
  capacidadesImplicadas: number;
  conReferencia: number;
  sinReferencia: number;
}

/** Ámbito sobre el que el motor NO puede pronunciarse, y por qué. */
export interface LimitacionGeneral {
  id: string;
  ambito: string;
  motivo: string;
}

export interface ReglaDescartada {
  regla: string;
  motivo: string;
}

export interface MetaRecomendaciones {
  versionMotor: string;
  versionPAE: string;
  versionPIE: string;
  versionPKB: string;
  versionCatalogo: string;
  calculadoEn: string;
  atletaId: string;
}

export interface PerformanceRecommendationReport {
  meta: MetaRecomendaciones;
  /** Recuento legible del estado del perfil. Sin juicio. */
  resumen: string;
  recomendaciones: Recomendacion[];
  estadisticas: EstadisticasRecomendaciones;
  limitacionesGenerales: LimitacionGeneral[];
  reglasEjecutadas: string[];
  reglasDescartadas: ReglaDescartada[];
}
