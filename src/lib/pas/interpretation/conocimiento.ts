// ── Contratos del conocimiento PKB (Sprint PAS-4.0) ────────────────────────
// La PKB entra como DTO, no como texto: sus limitaciones son CÓDIGOS y no
// prosa, para que todo el texto emitido lo controlen las plantillas del PIE.
// Una limitación redactada en libertad podría colar vocabulario prohibido en
// la salida — varias de la base dicen literalmente «nunca riesgo de lesión».

import type { CapacidadId } from '../capacidades';

export type NivelEvidencia = 'alta' | 'moderada' | 'baja' | 'muy_baja' | 'insuficiente';

export type EstadoCorrespondencia =
  | 'respaldada'
  | 'parcialmente_respaldada'
  | 'insuficiente'
  | 'no_recomendada'
  | 'sin_evidencia';

/** Categorías de `03-poblaciones.md`. Nunca se extrapola entre ellas. */
export type Poblacion =
  | 'atletas' | 'elite' | 'recreacionales' | 'adultos_mayores'
  | 'ninos' | 'adolescentes' | 'rehabilitacion' | 'clinicos'
  | 'mixta' | 'general';

/** Limitaciones de la PKB, como código. El texto lo pone el PIE. */
export type LimitacionPKB =
  | 'validez_constructo_no_verificada'
  | 'especifica_del_ejercicio'
  | 'especifica_del_angulo'
  | 'estimacion_mediada_por_ecuacion'
  | 'requiere_normalizacion'
  | 'contaminada_por_aprendizaje'
  | 'indice_oculta_componentes'
  | 'varianza_dominada_por_edad_y_sexo'
  | 'confundida_por_proporciones_corporales'
  | 'alcance_restringido'
  | 'poblacion_restringida';

/** Una fila de la matriz `09-matriz-prueba-capacidad.md`. */
export interface FichaPKB {
  /** Código de la correspondencia: `M-01`… */
  id: string;
  pruebaId: string;
  capacidad: CapacidadId;
  estado: EstadoCorrespondencia;
  nivelEvidencia: NivelEvidencia;
  poblaciones: Poblacion[];
  /** Qué exactamente puede afirmarse. Cadena breve, sin léxico prohibido. */
  alcanceAutorizado: string;
  limitaciones: LimitacionPKB[];
  /** Claves de `_evidencia/referencias.yaml`. */
  referencias: string[];
  sensibilidadDocumentada: boolean;
  vigenciaDocumentada: boolean;
  pesoDocumentado: boolean;
}

export interface ConocimientoPKB {
  version: string;
  fichas: FichaPKB[];
}

/** Conocimiento vacío: ninguna correspondencia. Estado válido, no error. */
export const PKB_VACIA: ConocimientoPKB = { version: 'vacia-0', fichas: [] };
