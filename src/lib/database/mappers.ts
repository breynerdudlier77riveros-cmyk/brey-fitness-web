// ── Mappers: fila cruda de Supabase → objeto de dominio tipado ─────────────
// Ningún repositorio devuelve el resultado crudo de `.select()` ni lo
// castea con `as Profile`/`as Workout`/`as WorkoutLog` — pasa por aquí.
// El cliente de Supabase de este proyecto no usa tipos generados
// (`supabase gen types`), así que cada fila llega como `any` sin ninguna
// garantía real; el parámetro `Record<string, unknown>` documenta eso en
// vez de fingir que ya viene tipada.

import { numOrNull } from './parsers';
import type { Profile, Workout, WorkoutLog, EjercicioPlan, EjercicioLog } from '@/lib/types';

type Row = Record<string, unknown>;

export function mapProfile(row: Row): Profile {
  return {
    id: row.id as string,
    email: (row.email as string | null) ?? null,
    nombre: (row.nombre as string | null) ?? null,
    avatar_url: (row.avatar_url as string | null) ?? null,
    sistema_actual: (row.sistema_actual as Profile['sistema_actual']) ?? null,
    nivel_actual: (row.nivel_actual as string | null) ?? null,
    edad: (row.edad as number | null) ?? null,
    sexo: (row.sexo as string | null) ?? null,
    // numeric en Postgres → string en PostgREST — únicas 2 columnas de
    // profiles con este riesgo (ver src/lib/database/parsers.ts).
    peso_kg: numOrNull(row.peso_kg),
    altura_cm: numOrNull(row.altura_cm),
    objetivo: (row.objetivo as string | null) ?? null,
    nivel_experiencia: (row.nivel_experiencia as string | null) ?? null,
    lugar_entrenamiento: (row.lugar_entrenamiento as string | null) ?? null,
    dias_por_semana: (row.dias_por_semana as number | null) ?? null,
    duracion_sesion_min: (row.duracion_sesion_min as number | null) ?? null,
    experiencia: (row.experiencia as string | null) ?? null,
    lesiones: (row.lesiones as string | null) ?? null,
    observaciones: (row.observaciones as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export function mapWorkout(row: Row): Workout {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    system_slug: (row.system_slug as Workout['system_slug']) ?? null,
    nombre: row.nombre as string,
    semana: (row.semana as number | null) ?? null,
    semana_total: (row.semana_total as number | null) ?? null,
    fecha_planificada: row.fecha_planificada as string,
    duracion_estimada_min: (row.duracion_estimada_min as number | null) ?? null,
    ejercicios: (row.ejercicios as EjercicioPlan[] | null) ?? [],
    estado: row.estado as Workout['estado'],
    created_at: row.created_at as string,
  };
}

export function mapWorkoutLog(row: Row): WorkoutLog {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    workout_id: (row.workout_id as string | null) ?? null,
    fecha: row.fecha as string,
    duracion_real_min: (row.duracion_real_min as number | null) ?? null,
    // numeric en Postgres → string en PostgREST — la columna detrás del
    // bug confirmado en /app/progreso antes de este Sprint (ver plan).
    volumen_total_kg: numOrNull(row.volumen_total_kg),
    ejercicios: (row.ejercicios as EjercicioLog[] | null) ?? [],
    completado: row.completado as boolean,
    created_at: row.created_at as string,
  };
}
