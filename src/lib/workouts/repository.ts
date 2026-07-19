// ── Repositorio de workouts/workout_logs — único punto de acceso a estas
// tablas ─────────────────────────────────────────────────────────────────
// Mismo motivo que src/lib/profile/repository.ts: el Motor BPS y el
// Workout Player van a golpear estas dos tablas más que ninguna otra en la
// plataforma — centralizarlas ahora es lo que evita volver a tocar esta
// capa cuando esas features se construyan.
//
// select("*") siempre, nunca listas parciales de columnas: es lo que
// elimina la duplicación real que había (la misma lista de columnas de
// workout_logs, letra por letra, en dos archivos distintos, cada uno con
// su propio `Pick<WorkoutLog,...> as` inline). El costo — alguna columna
// de más, o el jsonb `ejercicios` en historial, que hoy no se muestra ahí
// — es marginal en filas de este tamaño en una página privada
// autenticada. Si `ejercicios` llega a pesar de verdad (Workout Player),
// este es el único lugar donde se ajustaría, sin tocar los call sites.

import type { SupabaseClient } from '@supabase/supabase-js';
import { mapWorkout, mapWorkoutLog } from '@/lib/database/mappers';
import type { Workout, WorkoutLog } from '@/lib/types';

export async function getWorkoutDelDia(
  supabase: SupabaseClient,
  userId: string,
  fechaISO: string
): Promise<Workout | null> {
  const { data } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .eq('fecha_planificada', fechaISO)
    .maybeSingle();

  return data ? mapWorkout(data) : null;
}

export async function getWorkoutsEnRango(
  supabase: SupabaseClient,
  userId: string,
  inicioISO: string,
  finISO: string
): Promise<Workout[]> {
  const { data } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .gte('fecha_planificada', inicioISO)
    .lte('fecha_planificada', finISO);

  return (data ?? []).map(mapWorkout);
}

/** Más recientes primero. `limit` por defecto 30 (mismo tope que usaba /app/entrenamientos/historial antes de este Sprint). */
export async function getWorkoutLogs(
  supabase: SupabaseClient,
  userId: string,
  opts?: { limit?: number }
): Promise<WorkoutLog[]> {
  const { data } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('fecha', { ascending: false })
    .limit(opts?.limit ?? 30);

  return (data ?? []).map(mapWorkoutLog);
}

/** Sin límite de filas, acotado por fecha — para agregados (ver /app/progreso). */
export async function getWorkoutLogsEnRango(
  supabase: SupabaseClient,
  userId: string,
  inicioISO: string
): Promise<WorkoutLog[]> {
  const { data } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('fecha', inicioISO);

  return (data ?? []).map(mapWorkoutLog);
}
