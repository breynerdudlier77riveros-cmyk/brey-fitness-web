// ── Tipos de Sistema (arquitectura BREY v2: BREY → BPS → Sistemas) ─────────
// El nivel del usuario NO es un producto: es configuración interna del
// Sistema que asigna el Diagnóstico BPS.

import type { ComponentType } from 'react';

export type SistemaSlug =
  | 'fuerza'
  | 'hipertrofia'
  | 'calistenia'
  | 'hibrido'
  | 'elite';

/** Nivel interno de progresión dentro de un Sistema. */
export interface NivelSistema {
  nombre: string;
  descripcion: string;
}

export interface FaseSistema {
  nombre: string;
  descripcion: string;
  semanas: number;
  sesionesSemanales: number;
}

/** Componente del ecosistema que acompaña a cada Sistema. */
export interface ComponenteEcosistema {
  etiqueta: string;
  /** 'incluido' hoy · 'en-camino' = visión, sin promesa de fecha. */
  estado: 'incluido' | 'en-camino';
}

export interface SistemaColor {
  gradient: string;       // e.g. "from-orange-950/60 via-orange-900/20 to-slate-950"
  badge: string;          // e.g. "text-orange-400 bg-orange-500/10 border-orange-500/20"
  accent: string;         // e.g. "text-orange-400"
  glow: string;           // e.g. "bg-orange-600/8"
  dot: string;            // e.g. "bg-orange-400"
  border: string;         // e.g. "border-orange-500/20"
  cta: string;            // e.g. "bg-orange-500 hover:bg-orange-400"
}

export interface Sistema {
  slug: SistemaSlug;
  nombre: string;
  /** Icono de trazo propio del Sistema — identidad visual de producto (BREY v2.1). */
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  /** Objetivo principal del usuario que entra a este Sistema. */
  objetivo: string;
  tagline: string;
  descripcion: string;
  para: string;
  /** null en Sistemas aún no disponibles. */
  duracion: string | null;
  /** false = "Disponible próximamente" + lista de espera. Nunca se vende lo que no existe. */
  disponible: boolean;
  /** null = no se muestra precio (Sistema no disponible). */
  precio: number | null;
  precioFormato: string | null;
  /** Modelo de cobro — preparado para membresía futura sin refactor. */
  modeloPrecio: 'unico' | 'membresia';
  niveles: NivelSistema[];
  fases: FaseSistema[];
  /** Entregables concretos de la compra hoy. */
  incluye: string[];
  /** El ecosistema alrededor del Sistema (incluido / en camino). */
  ecosistema: ComponenteEcosistema[];
  color: SistemaColor;
  seo: {
    title: string;
    description: string;
  };
}

// ── Exercise types ─────────────────────────────────────────────────────────

export type MuscleGroup =
  | 'pecho'
  | 'espalda'
  | 'hombros'
  | 'brazos'
  | 'piernas'
  | 'core'
  | 'gluteos'
  | 'full-body';

export type ExerciseLevel = 'principiante' | 'intermedio' | 'avanzado';
export type ExerciseType = 'compuesto' | 'aislamiento' | 'peso-corporal';
export type ExerciseEquipment = 'barra' | 'mancuernas' | 'maquina' | 'peso-corporal' | 'cables' | 'kettlebell';

export interface Exercise {
  slug: string;
  nombre: string;
  nombreIngles?: string;
  tipo: ExerciseType;
  nivel: ExerciseLevel;
  equipo: ExerciseEquipment[];
  musculoPrincipal: MuscleGroup;
  musculosSecundarios: MuscleGroup[];
  descripcion: string;
  instrucciones: string[];
  erroresComunes: string[];
  variantes: string[];
  beneficios: string[];
  sistemasVinculados: SistemaSlug[];
}

// ── Blog types (la fuente de verdad vive en lib/content.ts) ────────────────

export type { Category as BlogCategory, ContentType } from './content';

// ── Tipos de Entrenamientos (backend real — supabase/schema.sql) ───────────
// Espejan las tablas workouts/workout_logs. Hoy toda query contra ellas
// devuelve cero filas para cualquier usuario (no existe todavía un
// escritor — Motor BPS y Workout Player quedan para otro sprint), pero
// las queries de /app quedan tipadas en vez de `any` mientras tanto.

export type WorkoutEstado = 'planificado' | 'completado' | 'perdido';

/** Forma de cada entrada en el jsonb `ejercicios` de una fila de workouts (el plan). */
export interface EjercicioPlan {
  nombre: string;
  series: number;
  reps: string;
  peso?: number;
  intensidad?: string;
}

/** Igual que EjercicioPlan, más si ese set se marcó como hecho — jsonb de workout_logs. */
export interface EjercicioLog extends EjercicioPlan {
  completado: boolean;
}

export interface Workout {
  id: string;
  user_id: string;
  system_slug: SistemaSlug | null;
  nombre: string;
  semana: number | null;
  semana_total: number | null;
  /** date de Postgres — string ISO yyyy-mm-dd. */
  fecha_planificada: string;
  duracion_estimada_min: number | null;
  ejercicios: EjercicioPlan[];
  estado: WorkoutEstado;
  created_at: string;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  workout_id: string | null;
  fecha: string;
  duracion_real_min: number | null;
  volumen_total_kg: number | null;
  ejercicios: EjercicioLog[];
  completado: boolean;
  created_at: string;
}
