// ── Tipos del Workout Generator (Domain Engine, puro) ───────────────────────
// Fuente exclusiva: Architecture Handbook 08 (Workout Generator) — pseudocódigo
// generarSemana(microciclo, perfil, prescripcion, recovery), R-G1/G2/G3,
// invariantes I-G1..G4.
//
// VeredictoRecovery se reimporta (type-only) de engines/recovery/tipos.ts —
// el propio módulo 08 usa en su tabla de entradas y pseudocódigo la forma
// PRE-reconciliación de Motor BPS Handbook ({si, tipo, razón}), la misma que
// IMP-ADR-01/API-ADR-02 ya reconciliaron a {procede, subtipo?, razon} para
// TODO consumidor del Veredicto (motor.ts traduce recovery.si → !procede,
// recovery.tipo → subtipo). Ver comentario de motor.ts y el informe del
// Sprint — es la misma discrepancia ya encontrada y corregida en Progression
// Engine, aquí en su tercera aparición.
//
// Dependencias que este motor NO resuelve por sí mismo (recibidas ya
// resueltas, "reciben objetos, devuelven objetos"):
//   - Resolución de ejercicio por Slot (KB.resolverEjercicioParaSlot, módulo
//     04, Knowledge Base) — no es parte de este Sprint ni de este handbook.
//   - Orden de slots por Rol (R-4, Training Framework módulo 03) — el motor
//     consume el orden ya dado, nunca reordena (ninguna regla de ordenación
//     R-4 concreta está en el alcance leído para este Sprint).
//   - Duración estimada por slot y descanso por Rol/énfasis del Bloque
//     (descansoPorRol(rol, bloque.enfasis) del pseudocódigo) — catálogo del
//     Training Framework, no una fórmula de este módulo.
// Inventar cualquiera de estas tres cosas violaría "no inventes reglas".

import type { VeredictoRecovery } from "@/lib/engines/recovery/tipos";
export type { VeredictoRecovery };

export type RolSlot = "activacion" | "principal" | "accesorio" | "core-final" | "metabolico";

export interface EjercicioResueltoWG {
  slug: string;
  nombre: string;
  modalidad: string;
}

/** KB.resolverEjercicioParaSlot ya ejecutado por el llamador — este motor solo consume el resultado (ok o fallo con detalle, I-G1). */
export type ResolucionSlot = { ok: true; ejercicio: EjercicioResueltoWG } | { ok: false; detalle: string };

export interface PrescripcionPorPatron {
  series: number;
  rango: string; // reps, ej. "8-12"
  rpe: number;
  tempo: string | null;
}

export interface SlotResuelto {
  patron: string;
  rol: RolSlot;
  resolucion: ResolucionSlot;
  prescripcion: PrescripcionPorPatron;
  /** Pre-calculada por el llamador (Training Framework/KB) — este motor no estima duración de ejercicios. */
  duracionEstimadaMin: number;
  /** descansoPorRol(rol, bloque.enfasis) ya resuelto por el llamador — segundos. */
  descansoBaseSeg: number;
  notas?: string;
}

export interface SesionPlan {
  fecha: string; // ISO
  /** Ya ordenados por Rol (R-4, Training Framework) — este motor no reordena. */
  slots: SlotResuelto[];
}

export interface EntradaGenerarSemana {
  sesiones: SesionPlan[];
  duracionSesionMin: number; // perfil.duracion_sesion_min, fresco (BPS-005)
  veredictoRecovery: VeredictoRecovery;
  versionCatalogo: string; // BPS-023 — toda generación registra la versión
}

export interface SlotGenerado {
  patron: string;
  rol: RolSlot;
  ejercicio: EjercicioResueltoWG;
  series: number;
  reps: string;
  rpe: number;
  descansoSeg: number;
  tempo: string | null;
  notas?: string;
}

export interface SesionGenerada {
  fecha: string;
  duracionEstimadaMin: number;
  slots: SlotGenerado[];
  /** R-G2 — true si tras recortar metabolico→core-final→accesorio la sesión aún excede duracion_sesion_min. Nunca se recorta principal/activacion para forzar que quepa. */
  excedeTiempoDeclarado: boolean;
}

export interface EventoSemanaGenerada {
  tipo: "semana_generada";
  versionCatalogo: string;
  tipoSemana: "normal" | "descarga";
}

export type ResultadoGeneracion =
  | { ok: true; sesiones: SesionGenerada[]; evento: EventoSemanaGenerada }
  | { ok: false; error: "CATALOGO_INSUFICIENTE"; detalle: { fecha: string; patron: string; rol: RolSlot; motivo: string } };
