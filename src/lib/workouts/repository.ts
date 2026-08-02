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

// ── Escritores (Architecture Handbook 11) ──────────────────────────────────
// Los inserta el Motor BPS / Workout Generator (batch semanal) y el Workout
// Player (un log al cierre). Este repositorio solo persiste lo que esos
// productores ya construyeron — nunca decide qué generar ni qué registrar.

/** Forma que recibe el insert, sin los campos que gobierna el servidor. */
type NuevoWorkout = Omit<Workout, 'id' | 'user_id' | 'created_at'>;
type NuevoWorkoutLog = Omit<WorkoutLog, 'id' | 'user_id' | 'created_at'>;

/** Batch de la semana en una sola operación atómica (Architecture Handbook 11): un `insert([...])` es transaccional. Escritor del Generator. */
export async function insertWorkouts(
  supabase: SupabaseClient,
  userId: string,
  sesiones: NuevoWorkout[]
): Promise<Workout[]> {
  const { data } = await supabase
    .from('workouts')
    .insert(sesiones.map((s) => ({ user_id: userId, ...s })))
    .select('*');

  return (data ?? []).map(mapWorkout);
}

/** Una sola escritura, al cierre de la sesión (I-W3). Escritor del Player. Un log cerrado es inmutable — nunca se actualiza aquí. */
export async function insertWorkoutLog(
  supabase: SupabaseClient,
  userId: string,
  log: NuevoWorkoutLog
): Promise<WorkoutLog | null> {
  const { data, error } = await supabase
    .from('workout_logs')
    .insert({ user_id: userId, ...log })
    .select('*')
    .single();

  if (error || !data) return null;
  return mapWorkoutLog(data);
}
