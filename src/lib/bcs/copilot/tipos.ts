// ── Contratos del AI Clinical Copilot (Sprint BCS-6.0) ─────────────────────
// Capa de PRODUCTIVIDAD, no de inteligencia. Reutiliza lo que los motores ya
// determinaron y lo transforma en documentos que el profesional entrega.
//
// No genera conocimiento propio: toda frase procede de un DTO existente o de
// una plantilla que cita su fuente. Por eso cada entregable lleva su traza y
// pasa por el validador antes de devolverse.
//
// Sobre el nombre: el encargo pide un «AI Copilot», pero sus propias
// restricciones —no generar conocimiento, trazabilidad total— excluyen que un
// modelo redacte. La composición es determinista; prompts.ts prepara los
// contratos para el día en que un LLM sustituya el render, exactamente igual
// que el Clinical Observation Generator dejó preparado el suyo.

import type { BodyCompositionAnalysis } from '@/lib/bcs/analysis';
import type { ClinicalObservationReport } from '@/lib/bcs/observation';
import type { RecommendationReport } from '@/lib/bcs/recommendations';
import type { Reporte } from '@/lib/bcs/reporte';
import type { DashboardAnalytics } from '@/lib/bcs/dashboard';

/** Entrada única: todos los DTO ya construidos por sus motores. */
export interface EntradaCopilot {
  reporte: Reporte;
  analisis: BodyCompositionAnalysis;
  recomendaciones: RecommendationReport;
  observaciones: ClinicalObservationReport;
  /**
   * Analítica del consultorio. Opcional y hoy sin uso en ningún entregable de
   * cliente: describe el consultorio completo, no a una persona. Se acepta en
   * el contrato porque el encargo la lista como fuente, y se documenta que
   * ningún entregable individual puede alimentarse de ella sin mezclar
   * ámbitos.
   */
  analytics?: DashboardAnalytics;
  /** Nombre del profesional, para firmas. Opcional: nunca se inventa. */
  profesional?: string;
  /** Fecha de emisión `yyyy-mm-dd`. Explícita: la capa no lee el reloj. */
  hoyISO: string;
}

export type TipoEntregable =
  | 'resumen_ejecutivo'
  | 'explicacion_paciente'
  | 'guion_consulta'
  | 'faq'
  | 'correo'
  | 'whatsapp'
  | 'nota_soap'
  | 'presentacion'
  | 'material_educativo'
  | 'documento_impresion';

/** Traza de un entregable: de dónde sale cada parte de su contenido. */
export interface TrazaEntregable {
  /** Plantilla que lo compuso. */
  plantillaId: string;
  /** Ids de observaciones del COG reutilizadas. */
  observacionIds: string[];
  /** Ids de hallazgos del Analysis Engine. */
  hallazgoIds: string[];
  /** Ids de recomendaciones del Recommendation Engine. */
  recomendacionIds: string[];
  /** Claves de referencia científica (registro de la CKB). */
  referenciaIds: string[];
  /** Fichas de la CKB invocadas. */
  fichasCkb: string[];
  /** Variables de composición corporal mencionadas. */
  variables: string[];
}

/** Bloque de texto de un entregable. */
export interface Seccion {
  titulo: string;
  contenido: string[];
}

export interface Entregable {
  id: string;
  tipo: TipoEntregable;
  /** Variante concreta: `30`, `2min`, `seguimiento`, `breve`… */
  variante: string;
  titulo: string;
  secciones: Seccion[];
  /** Texto plano completo, listo para copiar. */
  texto: string;
  palabras: number;
  traza: TrazaEntregable;
}

/** Motivo por el que un entregable no pudo producirse. */
export interface EntregableRechazado {
  tipo: TipoEntregable;
  variante: string;
  motivo: string;
  /** Violaciones detectadas por el validador, si las hubo. */
  violaciones: string[];
}

export interface ResultadoCopilot {
  entregables: Entregable[];
  rechazados: EntregableRechazado[];
  meta: {
    hoyISO: string;
    solicitados: number;
    emitidos: number;
  };
}
