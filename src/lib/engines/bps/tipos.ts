// ── Tipos del Motor BPS (Domain Engine, puro) ───────────────────────────────
// Fuente: Motor BPS Handbook 05 (máquina de estados) + 09 (25 reglas
// BPS-001..025) + Architecture Handbook 07. `TipoEvento`/`OrigenEvento` se
// reimportan de src/lib/types.ts (type-only, cero runtime, cero infra): es
// el vocabulario oficial ya reconciliado (DB-ADR-03/IMP-ADR-06), reutilizarlo
// es SSoT — duplicarlo aquí sería inventar un DTO paralelo.

import type { TipoEvento, SistemaSlug } from "@/lib/types";

export type EstadoUsuarioBPS =
  | "sin_diagnostico"
  | "diagnosticado"
  | "pendiente_diagnostico"
  | "pendiente_perfil"
  | "activo"
  | "en_descarga"
  | "en_pausa"
  | "sistema_completado";

/** Fila literal de la tabla de transiciones (Motor BPS Handbook 05) — dato, no lógica. */
export interface TransicionBPS {
  id: string; // "T1".."T15b"
  de: EstadoUsuarioBPS;
  a: EstadoUsuarioBPS;
  evento: string;
  guard: string;
}

export interface EventoBPS {
  tipo: TipoEvento;
  origen: "motor_bps";
  razones: string[];
  contexto: Record<string, unknown>;
}

/**
 * Códigos oficiales (Motor BPS Handbook 04, Familia 4) usados por este
 * motor: DIAGNOSTICO_REQUERIDO, PERFIL_INCOMPLETO. Los dos restantes NO
 * están en ese catálogo — ver comentario en motor.ts sobre por qué son
 * necesarios y por qué no se inventan como regla de negocio nueva.
 */
export type ErrorBPS = "DIAGNOSTICO_REQUERIDO" | "PERFIL_INCOMPLETO" | "TRANSICION_NO_PERMITIDA" | "NO_ESPECIFICADO";

export interface TransicionAplicada {
  estado: EstadoUsuarioBPS;
  eventos: EventoBPS[];
  /** Presentes solo cuando la transición escribe punteros (T3/T5/T15b) o los conserva tras un cierre (BPS-008 upgrade). */
  sistemaActual?: SistemaSlug | null;
  nivelActual?: string | null;
  /** T13 — retroceso de Mesociclo PROPUESTO, nunca impuesto (BPS-016). El motor solo lo sugiere. */
  propuesta?: { retrocedeMesociclos: 1; ajustable: true };
}

export type ResultadoBPS = { ok: true; resultado: TransicionAplicada } | { ok: false; error: ErrorBPS; detalle?: unknown };
