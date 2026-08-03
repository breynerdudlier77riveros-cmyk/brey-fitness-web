// ── Contratos de salida del PIE (Sprint PAS-4.0) ───────────────────────────
// Toda interpretación arrastra su cadena de trazabilidad completa. No existe
// forma de expresar en estos tipos un texto sin origen.

import type { CapacidadId } from '../capacidades';
import type { LimitacionPKB, NivelEvidencia, Poblacion } from './conocimiento';

export type PrioridadInterpretacion = 'estructural' | 'alta' | 'media' | 'informativa';

export type BloqueInterpretacion =
  | 'resumen'
  | 'capacidad'
  | 'dominio'
  | 'cobertura'
  | 'consistencia'
  | 'evidencia_disponible'
  | 'evidencia_insuficiente'
  | 'metodologia'
  | 'limitaciones';

/**
 * Cadena de trazabilidad. Los siete eslabones son obligatorios; los que no
 * apliquen van vacíos, nunca ausentes.
 *
 *   hallazgo → estado funcional → regla PIE → ficha PKB → referencia
 *            → nivel de evidencia → limitaciones utilizadas
 */
export interface Trazabilidad {
  hallazgos: string[];
  estadoFuncional: string | null;
  regla: string;
  fichasPKB: string[];
  referencias: string[];
  nivelEvidencia: NivelEvidencia | null;
  limitaciones: LimitacionPKB[];
}

export interface Interpretacion {
  id: string;
  regla: string;
  bloque: BloqueInterpretacion;
  prioridad: PrioridadInterpretacion;
  /** Texto renderizado desde una plantilla. Nunca construido en libertad. */
  texto: string;
  /** Plantilla que lo produjo, para auditar la redacción. */
  plantilla: string;
  hallazgosRelacionados: string[];
  capacidadesRelacionadas: CapacidadId[];
  referencias: string[];
  nivelEvidencia: NivelEvidencia | null;
  poblaciones: Poblacion[];
  limitaciones: LimitacionPKB[];
  trazabilidad: Trazabilidad;
}

export interface CoberturaPerfil {
  capacidadesTotales: number;
  capacidadesActivas: number;
  caracterizadas: number;
  parciales: number;
  desactualizadas: number;
  enConflicto: number;
  desconocidas: number;
  reservadas: number;
  /** Correspondencias de la PKB aplicables al perfil. */
  correspondenciasAplicadas: number;
}

export interface MetaInterpretacion {
  versionMotor: string;
  versionPKB: string;
  /** Coordenadas heredadas del análisis del PAE. */
  versionPAE: string;
  versionCatalogo: string;
  calculadoEn: string;
  atletaId: string;
  reglasEvaluadas: number;
  interpretacionesEmitidas: number;
}

export interface PerformanceInterpretationReport {
  meta: MetaInterpretacion;
  resumenEjecutivo: Interpretacion[];
  porCapacidad: Interpretacion[];
  porDominio: Interpretacion[];
  hallazgos: Interpretacion[];
  cobertura: CoberturaPerfil;
  interpretacionCobertura: Interpretacion[];
  consistencia: Interpretacion[];
  evidenciaDisponible: Interpretacion[];
  evidenciaInsuficiente: Interpretacion[];
  observacionesMetodologicas: Interpretacion[];
  limitaciones: Interpretacion[];
}
