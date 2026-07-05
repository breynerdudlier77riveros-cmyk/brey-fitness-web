// ── Program types ──────────────────────────────────────────────────────────

export type ProgramSlug =
  | 'performance-start'
  | 'performance-gym'
  | 'performance-calisthenics'
  | 'performance-hybrid'
  | 'performance-elite';

export type ProgramLevel = 'principiante' | 'intermedio' | 'avanzado' | 'todos';

export interface ProgramModule {
  nombre: string;
  descripcion: string;
  semanas: number;
  sesionesSemanales: number;
}

export interface ProgramColor {
  gradient: string;       // e.g. "from-emerald-950/60 via-emerald-900/20 to-slate-950"
  badge: string;          // e.g. "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  accent: string;         // e.g. "text-emerald-400"
  glow: string;           // e.g. "bg-emerald-600/8"
  dot: string;            // e.g. "bg-emerald-400"
  border: string;         // e.g. "border-emerald-500/20"
  cta: string;            // e.g. "bg-emerald-500 hover:bg-emerald-400"
}

export interface EcosystemProgram {
  slug: ProgramSlug;
  nombre: string;
  tagline: string;
  descripcion: string;
  para: string;
  nivel: ProgramLevel;
  duracion: string;
  precio: number;
  precioFormato: string;
  modulos: ProgramModule[];
  incluye: string[];
  color: ProgramColor;
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
  programasVinculados: ProgramSlug[];
}

// ── Blog types (la fuente de verdad vive en lib/content.ts) ────────────────

export type { Category as BlogCategory, ContentType } from './content';
