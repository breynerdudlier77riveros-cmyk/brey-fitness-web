// ── Vocabularios cerrados de la Knowledge Base ──────────────────────────────
// Transcripción literal de las tablas del Architecture Handbook 04. Esto NO
// es contenido inventado: son los vocabularios que el handbook declara
// "cerrados" y publica completos. El catálogo de ejercicios (la INSTANCIA de
// esta ontología) es otra cosa y vive en src/data/exercises.ts.
//
// La KB nunca conoce usuarios: aquí no hay ni un tipo de Perfil, sesión o
// auth. Recibe valores (zonas, capacidades, equipo elegible), nunca entidades
// de usuario.

/** 9 patrones — 7 activos, 2 reservados. Slug estable desde el nacimiento (P15). */
export type PatronSlug =
  | "empuje-horizontal"
  | "empuje-vertical"
  | "traccion-horizontal"
  | "traccion-vertical"
  | "dominante-rodilla"
  | "dominante-cadera"
  | "core"
  | "locomocion"
  | "rotacion-potencia";

export interface Patron {
  slug: PatronSlug;
  nombre: string;
  ejemploGym: string | null;
  ejemploCasa: string | null;
  /** La ÚNICA degradación permitida (regla b del vocabulario) — el paso 4 de la resolución no improvisa pares. */
  degradaA: PatronSlug | null;
  estado: "activo" | "reservado";
}

export const PATRONES: readonly Patron[] = [
  { slug: "empuje-horizontal", nombre: "Empuje horizontal", ejemploGym: "Press banca", ejemploCasa: "Flexiones, fondos", degradaA: "empuje-vertical", estado: "activo" },
  { slug: "empuje-vertical", nombre: "Empuje vertical", ejemploGym: "Press militar", ejemploCasa: "Pike push-up, pino", degradaA: "empuje-horizontal", estado: "activo" },
  { slug: "traccion-horizontal", nombre: "Tracción horizontal", ejemploGym: "Remo con barra", ejemploCasa: "Remo invertido", degradaA: "traccion-vertical", estado: "activo" },
  { slug: "traccion-vertical", nombre: "Tracción vertical", ejemploGym: "Dominadas lastradas", ejemploCasa: "Dominadas", degradaA: "traccion-horizontal", estado: "activo" },
  { slug: "dominante-rodilla", nombre: "Dominante de rodilla", ejemploGym: "Sentadilla", ejemploCasa: "Búlgara, pistol", degradaA: "dominante-cadera", estado: "activo" },
  { slug: "dominante-cadera", nombre: "Dominante de cadera", ejemploGym: "Peso muerto", ejemploCasa: "Hip thrust", degradaA: "dominante-rodilla", estado: "activo" },
  { slug: "core", nombre: "Core / anti-rotación / anti-extensión", ejemploGym: "Rueda abdominal", ejemploCasa: "Plancha, L-sit", degradaA: null, estado: "activo" },
  { slug: "locomocion", nombre: "Locomoción / transporte", ejemploGym: "Farmer carry", ejemploCasa: "Sprint", degradaA: null, estado: "reservado" },
  { slug: "rotacion-potencia", nombre: "Rotación / potencia", ejemploGym: null, ejemploCasa: null, degradaA: null, estado: "reservado" },
] as const;

/** 5 roles. Un slot es SIEMPRE Patrón × Rol — nunca patrón solo. */
export type RolSlug = "activacion" | "principal" | "accesorio" | "core-final" | "metabolico";

export interface Rol {
  slug: RolSlug;
  significado: string;
  /** Prioridad de fatiga — R-4 de 03: el Generator no puede alterar este orden relativo. */
  orden: 1 | 2 | 3 | 4 | 5;
  cuentaComoVolumenProductivo: boolean;
}

export const ROLES: readonly Rol[] = [
  { slug: "activacion", significado: "Prepara el patrón antes del trabajo pesado, esfuerzo bajo", orden: 1, cuentaComoVolumenProductivo: false },
  { slug: "principal", significado: "El movimiento más pesado/complejo del patrón", orden: 2, cuentaComoVolumenProductivo: true },
  { slug: "accesorio", significado: "Apoya al principal — menor carga, más reps", orden: 3, cuentaComoVolumenProductivo: true },
  { slug: "core-final", significado: "Estabilidad/core al cierre, sin fatigar patrones grandes", orden: 4, cuentaComoVolumenProductivo: true },
  { slug: "metabolico", significado: "Finisher de acondicionamiento — opcional, según énfasis del Bloque", orden: 5, cuentaComoVolumenProductivo: true },
] as const;

/** Vocabulario de equipamiento (cerrado aquí; el mapeo equipo→Track es contenido pendiente, Roadmap H2). */
export type EquipoSlug = "barra" | "mancuernas" | "maquina" | "peso-corporal" | "cables" | "kettlebell";

export const EQUIPAMIENTO: readonly EquipoSlug[] = ["barra", "mancuernas", "maquina", "peso-corporal", "cables", "kettlebell"] as const;

/** 6 zonas de riesgo articular — el eje de seguridad. */
export type ZonaSlug = "rodilla" | "cadera" | "lumbar" | "hombro" | "codo-muneca" | "tobillo";

export interface Zona {
  slug: ZonaSlug;
  queCarga: string;
}

export const ZONAS_RIESGO: readonly Zona[] = [
  { slug: "rodilla", queCarga: "Flexión profunda o carga axial en flexión" },
  { slug: "cadera", queCarga: "Rango de flexión/rotación bajo carga" },
  { slug: "lumbar", queCarga: "Carga axial o flexión de columna bajo carga" },
  { slug: "hombro", queCarga: "Rango overhead o rotación externa cargada" },
  { slug: "codo-muneca", queCarga: "Carga en extensión o hiperextensión" },
  { slug: "tobillo", queCarga: "Dorsiflexión o impacto" },
] as const;

/** No es flag binario: sentadilla con barra y extensión en máquina cargan `rodilla` de formas muy distintas. */
export type IntensidadZona = "alto" | "medio" | "bajo";

/** Modalidad = eje de ejecución × eje de lateralidad. Determina si el Player muestra contador de reps o cronómetro. */
export type EjeEjecucion = "dinamico" | "isometrico";
export type EjeLateralidad = "bilateral" | "unilateral";

export interface Modalidad {
  ejecucion: EjeEjecucion;
  lateralidad: EjeLateralidad;
}

export function buscarPatron(slug: PatronSlug): Patron | undefined {
  return PATRONES.find((p) => p.slug === slug);
}

export function buscarRol(slug: RolSlug): Rol | undefined {
  return ROLES.find((r) => r.slug === slug);
}

/** R-4 — ordena slots por prioridad de fatiga del Rol. Orden estable y total. */
export function ordenDeRol(rol: RolSlug): number {
  return buscarRol(rol)?.orden ?? Number.MAX_SAFE_INTEGER;
}
