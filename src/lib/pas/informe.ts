// ── Informe: conflictos, hallazgos, limitaciones y salida (Sprint PAS-2.0) ─
// Todo estructurado, nada narrativo. Ni una frase de este archivo está
// pensada para leerse tal cual: quien redacte lo hará en otro sprint, con
// otras reglas y sobre estos códigos.

import type { CapacidadId } from './capacidades';
import type { CoordenadasVersion, EstadoCapacidad, EstadoCapacidadValor } from './estado';

export type TipoConflicto =
  | 'id_registro_repetido'
  | 'id_evaluacion_repetida'
  | 'duplicado_exacto'
  | 'resultado_divergente'
  | 'repeticion_no_admitida'
  | 'fecha_invalida'
  | 'fecha_futura'
  | 'registro_anterior_a_evaluacion'
  | 'prueba_no_catalogada'
  | 'valor_incompatible'
  | 'patron_ausente'
  | 'contribucion_sin_referencia'
  | 'contribucion_de_familia_contexto'
  | 'contribucion_a_capacidad_reservada'
  | 'atleta_divergente'
  | 'evaluacion_inicial_duplicada'
  | 'evaluacion_sin_registros';

export interface Conflicto {
  id: string;
  tipo: TipoConflicto;
  /** Regla que lo detectó, para auditar el motor mismo. */
  regla: string;
  evaluaciones: string[];
  registros: string[];
  pruebas: string[];
  capacidades: CapacidadId[];
  detalle: Record<string, string>;
}

export type TipoHallazgo =
  | 'evidencia_suficiente'
  | 'evidencia_insuficiente'
  | 'sin_evidencia'
  | 'cobertura_parcial'
  | 'resultado_obsoleto'
  | 'resultado_repetido'
  | 'resultado_conflictivo'
  | 'resultado_pendiente'
  | 'registro_anulado_presente'
  | 'registro_excluido';

/** Un hallazgo describe. Nunca califica: ver `16-glosario.md`. */
export interface Hallazgo {
  id: string;
  tipo: TipoHallazgo;
  capacidad: CapacidadId | null;
  pruebas: string[];
  registros: string[];
  /** Regla que lo activó (TR-04). */
  regla: string;
  /** Versión del motor que lo produjo (I-11). */
  versionMotor: string;
  /** Fecha de cálculo, recibida como `hoyISO`. */
  fecha: string;
}

export type TipoLimitacion =
  | 'catalogo_sin_pruebas'
  | 'catalogo_sin_correspondencias'
  | 'capacidad_reservada'
  | 'capacidad_sin_evidencia'
  | 'capacidad_cobertura_parcial'
  | 'capacidad_desactualizada'
  | 'capacidad_en_conflicto'
  | 'cobertura_no_declarada'
  | 'vigencia_no_declarada'
  | 'datos_incompatibles'
  | 'evaluacion_sin_registros';

export interface Limitacion {
  id: string;
  tipo: TipoLimitacion;
  capacidad: CapacidadId | null;
  detalle: Record<string, string>;
}

export type NivelConsistencia = 'completa' | 'parcial' | 'inconsistente' | 'sin_datos';

export interface InformeConsistencia {
  nivel: NivelConsistencia;
  capacidadesEvaluables: number;
  capacidadesEvaluadas: number;
  capacidadesEnConflicto: number;
  registrosTotales: number;
  registrosElegibles: number;
  conflictos: number;
}

export interface ResumenAnalisis {
  evaluaciones: number;
  registrosTotales: number;
  registrosElegibles: number;
  registrosExcluidos: number;
  capacidadesPorEstado: Record<EstadoCapacidadValor, number>;
  hallazgos: number;
  conflictos: number;
  limitaciones: number;
}

export interface PerformanceAnalysis {
  atletaId: string;
  coordenadas: CoordenadasVersion;
  /** Las 20 capacidades, siempre. Ninguna se omite por no tener datos. */
  capacidades: EstadoCapacidad[];
  hallazgos: Hallazgo[];
  conflictos: Conflicto[];
  consistencia: InformeConsistencia;
  limitaciones: Limitacion[];
  resumen: ResumenAnalisis;
}
