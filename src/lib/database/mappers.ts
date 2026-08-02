// ── Mappers: fila cruda de Supabase → objeto de dominio tipado ─────────────
// Ningún repositorio devuelve el resultado crudo de `.select()` ni lo
// castea con `as Profile`/`as Workout`/`as WorkoutLog` — pasa por aquí.
// El cliente de Supabase de este proyecto no usa tipos generados
// (`supabase gen types`), así que cada fila llega como `any` sin ninguna
// garantía real; el parámetro `Record<string, unknown>` documenta eso en
// vez de fingir que ya viene tipada.

import { numOrNull } from './parsers';
import type {
  Profile, Workout, WorkoutLog, EjercicioPlan, EjercicioLog,
  SistemaCatalogo, EventoProgresion,
} from '@/lib/types';
import type { Diagnostico, Respuesta } from '@/lib/diagnostico/tipos';
import type { Cliente, Medicion, EnlacePublico } from '@/lib/bcs/tipos';

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

// `precio` es la única columna numeric de systems → numOrNull.
export function mapSistemaCatalogo(row: Row): SistemaCatalogo {
  return {
    slug: row.slug as SistemaCatalogo['slug'],
    nombre: row.nombre as string,
    objetivo: (row.objetivo as string | null) ?? null,
    tagline: (row.tagline as string | null) ?? null,
    descripcion: (row.descripcion as string | null) ?? null,
    duracion_semanas: (row.duracion_semanas as number | null) ?? null,
    disponible: row.disponible as boolean,
    precio: numOrNull(row.precio),
    modelo_precio: (row.modelo_precio as SistemaCatalogo['modelo_precio']) ?? null,
    created_at: row.created_at as string,
  };
}

// razones/notas/respuestas son jsonb — ya parseados por PostgREST, sin coerción.
export function mapDiagnostico(row: Row): Diagnostico {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    sistema_recomendado: row.sistema_recomendado as Diagnostico['sistema_recomendado'],
    nivel_entrada: (row.nivel_entrada as string | null) ?? null,
    disponible: row.disponible as boolean,
    razones: (row.razones as string[] | null) ?? [],
    notas: (row.notas as string[] | null) ?? [],
    respuestas: (row.respuestas as Respuesta[] | null) ?? [],
    created_at: row.created_at as string,
  };
}

// razones/contexto son jsonb sin esquema fijo por tipo (AR-013) — pass-through.
export function mapEventoProgresion(row: Row): EventoProgresion {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    tipo: row.tipo as EventoProgresion['tipo'],
    origen: row.origen as EventoProgresion['origen'],
    razones: row.razones ?? null,
    contexto: row.contexto ?? null,
    workout_log_id: (row.workout_log_id as string | null) ?? null,
    created_at: row.created_at as string,
  };
}

export function mapCliente(row: Row): Cliente {
  return {
    id: row.id as string,
    entrenador_id: row.entrenador_id as string,
    nombre: row.nombre as string,
    estado: row.estado as Cliente['estado'],
    created_at: row.created_at as string,
  };
}

// Las 22 variables numeric de bcs_mediciones llegan como string vía PostgREST
// → numOrNull en cada una. edad_metabolica es int; fecha/observaciones/foto_url
// son text/date sin coerción.
export function mapMedicion(row: Row): Medicion {
  return {
    id: row.id as string,
    cliente_id: row.cliente_id as string,
    estado: row.estado as Medicion['estado'],
    altura_cm: numOrNull(row.altura_cm),
    peso_kg: numOrNull(row.peso_kg),
    imc: numOrNull(row.imc),
    grasa_pct: numOrNull(row.grasa_pct),
    masa_grasa_kg: numOrNull(row.masa_grasa_kg),
    masa_muscular_kg: numOrNull(row.masa_muscular_kg),
    masa_libre_grasa_kg: numOrNull(row.masa_libre_grasa_kg),
    agua_total_l: numOrNull(row.agua_total_l),
    agua_intracelular_l: numOrNull(row.agua_intracelular_l),
    agua_extracelular_l: numOrNull(row.agua_extracelular_l),
    proteina_kg: numOrNull(row.proteina_kg),
    minerales_kg: numOrNull(row.minerales_kg),
    masa_osea_kg: numOrNull(row.masa_osea_kg),
    grasa_visceral_idx: numOrNull(row.grasa_visceral_idx),
    angulo_fase_deg: numOrNull(row.angulo_fase_deg),
    bmr_kcal: numOrNull(row.bmr_kcal),
    edad_metabolica: (row.edad_metabolica as number | null) ?? null,
    smi: numOrNull(row.smi),
    circ_cintura_cm: numOrNull(row.circ_cintura_cm),
    circ_cadera_cm: numOrNull(row.circ_cadera_cm),
    whr: numOrNull(row.whr),
    impedancia_ohm: numOrNull(row.impedancia_ohm),
    fecha: row.fecha as string,
    observaciones: (row.observaciones as string | null) ?? null,
    foto_url: (row.foto_url as string | null) ?? null,
  };
}

export function mapEnlacePublico(row: Row): EnlacePublico {
  return {
    id: row.id as string,
    cliente_id: row.cliente_id as string,
    token: row.token as string,
    estado: row.estado as EnlacePublico['estado'],
    created_at: row.created_at as string,
  };
}
