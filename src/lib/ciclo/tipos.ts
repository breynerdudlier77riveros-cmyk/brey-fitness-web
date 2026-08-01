// ── DTOs de orquestación del ciclo semanal (capa Application) ───────────────
// NO son DTOs de dominio nuevos: son la forma de las ENTRADAS que el ciclo
// necesita y que ningún motor produce — el catálogo del Training Framework
// (Architecture Handbook 03) y la Knowledge Base (04). Ninguna de esas dos
// piezas existe en el repositorio (ver informe del Sprint), así que el ciclo
// las recibe ya resueltas de su llamador en vez de inventarlas.
//
// Reutiliza los DTOs oficiales de los motores (SesionPlan del Workout
// Generator) — nunca redefine uno.

import type { SesionPlan } from "@/lib/engines/workout/tipos";
import type { EstadoUsuarioBPS } from "@/lib/engines/bps/tipos";
import type { Workout } from "@/lib/types";

/**
 * Una sesión de la plantilla: el DTO oficial del Workout Generator
 * (`SesionPlan`) ENVUELTO — nunca modificado — junto a los campos de catálogo
 * que la fila `workouts` exige y que el Generator no produce (`nombre` es
 * NOT NULL en el esquema; `semana`/`semana_total` los define el Mesociclo).
 */
export interface SesionPlantilla {
  plan: SesionPlan;
  nombre: string;
  semana: number | null;
  semanaTotal: number | null;
}

/**
 * La plantilla del Microciclo vigente + los hechos estructurales del catálogo
 * que el ciclo necesita para decidir (Motor BPS Handbook 07, pasos 6/11/12).
 * Todo esto vive en el Training Framework (Architecture Handbook 03), que no
 * está construido — el llamador debe proveerlo.
 */
export interface PlantillaMicrociclo {
  microcicloId: string;
  /** Paso 6 — I-R1: la descarga programada del Mesociclo se ejecuta aunque el índice de fatiga sea 0. */
  esDescargaProgramada: boolean;
  /** Paso 11 — T14/BPS-018: último Microciclo del último Bloque cerrado. */
  esFinDeUltimoBloque: boolean;
  /** Slots ya resueltos a ejercicio por la Knowledge Base (Architecture Handbook 04) — el Generator no resuelve ejercicios. */
  sesiones: SesionPlantilla[];
  /** Rango de la semana, para el chequeo de idempotencia del paso 12 (BPS-014). */
  inicioISO: string;
  finISO: string;
}

/** Paso 0 — fecha y versión de catálogo son parámetros del ciclo, nunca defaults (BPS-022/BPS-023). */
export interface EntradaCiclo {
  fecha: string; // ISO yyyy-mm-dd
  versionCatalogo: string;
  plantilla: PlantillaMicrociclo;
}

/** Motivos por los que el ciclo termina sin generar — todos son comportamiento definido, no fallos (Motor BPS Handbook 07). */
export type ResultadoCiclo =
  | { estado: "generada"; workouts: Workout[]; estadoBPS: EstadoUsuarioBPS }
  | { estado: "sin_efectos"; motivo: string; estadoBPS: EstadoUsuarioBPS }
  | { estado: "transicion"; estadoBPS: EstadoUsuarioBPS; motivo: string }
  | { estado: "gate_fallado"; error: "PERFIL_INCOMPLETO"; camposFaltantes: string[]; estadoBPS: EstadoUsuarioBPS }
  | { estado: "semana_ya_generada"; workouts: Workout[]; estadoBPS: EstadoUsuarioBPS }
  | { estado: "error"; error: "SISTEMA_SIN_JERARQUIA" | "CATALOGO_INSUFICIENTE" | "SISTEMA_NO_ACTIVO"; detalle: unknown; estadoBPS: EstadoUsuarioBPS };
