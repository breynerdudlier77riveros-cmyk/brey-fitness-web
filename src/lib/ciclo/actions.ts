"use server";

// ── Server Actions del ciclo (capa Application, BE-01) ──────────────────────
// Patrón sancionado idéntico al de Sprint 3 (lib/supabase/actions.ts,
// lib/bcs/actions.ts): valida sesión → obtiene cliente de servidor → invoca
// el caso de uso → devuelve DTO oficial. Nada más: la orquestación real vive
// en ciclo-semanal.ts, no aquí.

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { insertWorkoutLog } from "@/lib/workouts/repository";
import { ejecutarCicloSemanal } from "./ciclo-semanal";
import type { EntradaCiclo, ResultadoCiclo } from "./tipos";
import type { ActionResult, EjercicioLog, WorkoutLog } from "@/lib/types";

/**
 * Generación semanal — el ciclo completo del Motor BPS (Handbook 07, tramo 2).
 *
 * ⚠ `entrada.plantilla` proviene del Training Framework (Architecture
 * Handbook 03) y de la Knowledge Base (04), NINGUNO de los cuales existe en
 * el repositorio. Hasta que existan, esta acción no es invocable desde la UI:
 * no hay quién construya la plantilla. La orquestación sí está completa y
 * queda lista para el día en que el catálogo se construya.
 */
export async function ejecutarCiclo(entrada: EntradaCiclo): Promise<ActionResult<ResultadoCiclo>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const resultado = await ejecutarCicloSemanal(supabase, user.id, entrada);
  return { ok: true, data: resultado };
}

/**
 * Cierre de sesión (Architecture Handbook 09, `cerrarSesion`).
 *
 * I-W4: la sesión parcial se registra exactamente igual que la completa.
 * I-W3: tras el cierre el log es inmutable — este es su único camino de
 * escritura (`insertWorkoutLog`; el repositorio no expone update, por diseño).
 * I-W2: la fila de `workouts` JAMÁS se muta — todo lo real va al log.
 *
 * ⚠ Dos brechas documentadas, no resueltas aquí (ver informe):
 *  1. El handbook emite `evento("sesion_cerrada", estado)`, pero
 *     `sesion_cerrada` NO está entre los 25 valores del CHECK de
 *     `progression_events.tipo` (DB-ADR-03). Insertarlo fallaría contra la
 *     base real, así que el cierre NO emite evento — inventar un tipo o
 *     reutilizar otro sería falsear el catálogo.
 *  2. `volumenTotalKg` llega calculado por el llamador: el handbook lo define
 *     como "Σ(peso × reps) de series dinámicas registradas", pero el DTO
 *     oficial `EjercicioLog` es POR EJERCICIO (no por serie) y su `reps` es
 *     `string` — la suma por serie no es derivable de él. Solo el Player,
 *     que sí captura por serie (I-W1), puede calcularla.
 */
export async function cerrarSesion(input: {
  workoutId: string | null;
  fecha: string;
  duracionRealMin: number | null;
  volumenTotalKg: number | null;
  ejercicios: EjercicioLog[];
}): Promise<ActionResult<WorkoutLog>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const log = await insertWorkoutLog(supabase, user.id, {
    workout_id: input.workoutId,
    fecha: input.fecha,
    duracion_real_min: input.duracionRealMin,
    volumen_total_kg: input.volumenTotalKg,
    ejercicios: input.ejercicios,
    // "completada" si todo slot quedó registrado, "parcial" si no — la sesión
    // parcial se registra igual (I-W4); el flag distingue, nunca bloquea.
    completado: input.ejercicios.every((e) => e.completado),
  });

  if (!log) return { ok: false, error: "PERSISTENCIA_FALLIDA" };
  return { ok: true, data: log };
}
