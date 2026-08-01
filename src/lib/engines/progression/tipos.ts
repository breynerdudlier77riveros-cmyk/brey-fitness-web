// ── Tipos del Progression Engine (Domain Engine, puro) ──────────────────────
// Fuente exclusiva: Progression Engine Handbook 04 (contrato de entradas),
// 05 (modelo de decisión), 06 (pipeline), 07 (catálogo PE-001..039).
//
// VeredictoRecovery se REIMPORTA (type-only) de engines/recovery/tipos.ts en
// vez de redeclararse con la forma cruda `{procede, tipo, razon}` que usa el
// texto de este propio handbook (04): esa forma es justamente la que
// IMP-ADR-01/API-ADR-02 reconciliaron a `{procede, subtipo?, razon}` — un
// import de tipo (cero runtime) es la manera de honrar esa reconciliación
// sin volver a arbitrarla ni duplicar el DTO (SSoT).

import type { VeredictoRecovery } from "@/lib/engines/recovery/tipos";
export type { VeredictoRecovery };

/** ENTRADA 1 — Ventana de historial. Origen: workout_logs reales (nunca prescripciones no ejecutadas). */
export interface Aparicion {
  fecha: string; // ISO yyyy-mm-dd, ascendente dentro de la ventana
  slotId: string;
  /** PE-021 — gate de cumplimiento previo a cualquier regla de microprogresión. */
  cumplida: boolean;
  /** PE-022 — evento inesperado con causa (excluye igual que PE-021, pero con causa registrada). */
  eventoInesperado?: { causa: string };
  rpeReportado?: number; // 0–10, Slots con sistema de esfuerzo RPE (PE-007/019)
  rirReportado?: number; // Slots con sistema de esfuerzo RIR (PE-008/020) — mutuamente excluyente con rpeReportado (PE-008 "inválido")
  repeticionesRealizadas?: number;
  duracionRealMin?: number;
}

/** ENTRADA 2 — Prescripción vigente. null permitido solo si el Slot no usa ese campo. */
export interface PrescripcionVigente {
  peso: number | null;
  repeticiones: number | null;
  /** Techo del rango de repeticiones prescrito (PE-002 doble progresión). */
  repeticionesTecho: number | null;
  series: number | null;
  tempo: string | null;
  descanso: number | null; // segundos
  rpeObjetivo: number | null;
  rir: number | null;
  duracion: number | null;
  volumen: number | null;
  densidad: number | null;
}

// ENTRADA 3 — Veredicto de Recovery. Obligatorio, no nulable (04). Tipo
// importado arriba desde engines/recovery/tipos.ts (forma canónica).

/** ENTRADA 4 — Cadenas + capacidades (Knowledge Base, read-only). */
export interface CadenaCapacidades {
  tipoSlot: "carga_externa" | "patron_corporal";
  eslabonSiguiente: string | null; // null = tope de la cadena, sin eslabón disponible
  /** Si el eslabón actual admite carga añadida cuando no hay eslabón siguiente (PE-003, contraejemplo). */
  admiteCargaEnTope: boolean;
}

/** Estado de estancamiento explícito como parámetro (el motor no tiene memoria propia, IN-P1/BPS-022). */
export interface EstadoEstancamiento {
  contadorCandidatura: number; // PE-027 — apariciones evaluables consecutivas sin avance
  confirmado: boolean; // PE-028
  escalonAplicado: 0 | 1 | 2 | 3; // PE-031 — 0 = ninguno, 1 = variar secundaria, 2 = deload preventivo sugerido, 3 = retroceso de eslabón
}

export interface EntradaEvaluacionSlot {
  slotId: string;
  ventana: Aparicion[]; // ordenada ascendente por fecha, ya filtrada a este Slot
  prescripcionVigente: PrescripcionVigente | null; // null = Slot nuevo (usa default de cadena)
  veredictoRecovery: VeredictoRecovery;
  cadena: CadenaCapacidades;
  fechaCiclo: string; // ISO — BPS-022/IN-P1: nunca Date.now() interno
  estadoEstancamiento: EstadoEstancamiento;
}

export type TipoDecisionSlot = "avanza" | "sostiene" | "retrocede";

export interface CambioPrescripcion {
  campo: keyof PrescripcionVigente | "eslabon";
  valorAnterior: unknown;
  valorNuevo: unknown;
}

export interface DecisionSlot {
  tipo: TipoDecisionSlot;
  slotId: string;
  razones: string[]; // nunca vacío — IN-P5/P2
  contexto: Record<string, unknown>;
  cambios: CambioPrescripcion[];
  estadoEstancamiento: EstadoEstancamiento; // recalculado — el llamador lo persiste para el próximo ciclo
  /** PE-035 — no vinculante, requiere confirmación aguas abajo; nunca aplica solo. */
  sugerenciaDeloadPreventivo?: boolean;
}

export type ErrorPE = "VEREDICTO_RECOVERY_AUSENTE" | "VENTANA_DESORDENADA" | "FECHA_ANTERIOR_A_ULTIMA_APARICION" | "PRESCRIPCION_INCOHERENTE" | "SISTEMA_ESFUERZO_MIXTO";

export type ResultadoPE = { ok: true; decision: DecisionSlot } | { ok: false; error: ErrorPE; detalle?: unknown };

// ── Macroprogresión (PE-013–018) ────────────────────────────────────────────
export type EscalonJerarquia = "microciclo" | "mesociclo" | "bloque" | "nivel";

export interface EntradaEvaluacionMacro {
  escalon: EscalonJerarquia;
  /** Decisiones del escalón inferior ya cerrado (p.ej. las 4 decisiones de Microciclo para evaluar Mesociclo). Vacío para "microciclo" (usa la ventana directa). */
  decisionesEscalonInferior: TipoDecisionSlot[];
  /** Solo relevante en escalón "microciclo" — IN-P3: mínimo 4 apariciones. */
  tamanoVentana?: number;
  /** PE-016 — si ya está en el último Nivel del Sistema, no hay Nivel siguiente que recomendar. */
  esUltimoEscalonDisponible?: boolean;
  /** PE-010 — evidencia adicional a favor del avance de Mesociclo. */
  techoVolumenAlcanzado?: boolean;
}

export type TipoDecisionMacro = "avanza" | "sostiene";

export interface DecisionMacro {
  tipo: TipoDecisionMacro;
  escalon: EscalonJerarquia;
  razones: string[];
  contexto: Record<string, unknown>;
  /** true únicamente en escalón "nivel" — PE-016: recomendación, nunca escritura directa (el Motor BPS decide). */
  esRecomendacionNoVinculante: boolean;
}

export interface EntradaRetrocesoMacro {
  cumplimientoUltimosDosMicrociclos: [number, number]; // 0–1, cada uno
  umbralMinimo: number; // decisión de producto, no fijado por este handbook — se recibe como parámetro
  deloadActivoEnVentana: boolean; // PE-017 contraejemplo — bajo cumplimiento explicado por deload no cuenta
}
