// ── Tipos y DTOs de la Knowledge Base ───────────────────────────────────────
// La ficha completa de un Ejercicio según la tabla de atributos del
// Architecture Handbook 04, más cadenas y capacidades.
//
// La tabla del handbook marca 9 atributos como "Existe" (los del catálogo
// actual, src/data/exercises.ts) y 6 como "Falta": patronPrimario,
// patronesSecundarios, rolesPosibles, modalidad, zonasRiesgo, cadena
// (+ capacidadesRequeridas). Esos 6 se modelan aquí como NULLABLE, no como
// obligatorios rellenos: el propio handbook los declara "bloqueante #2 del
// Roadmap… etiquetado con criterio, NO código" (P14). Inventarlos sería
// fabricar biomecánica.

import type { Exercise, ExerciseLevel } from "@/lib/types";
import type { PatronSlug, RolSlug, EquipoSlug, ZonaSlug, IntensidadZona, Modalidad } from "./vocabularios";

/** {zona, intensidad} — el filtro de seguridad excluye solo `alto`. */
export interface ZonaRiesgoDeclarada {
  zona: ZonaSlug;
  intensidad: IntensidadZona;
}

/** Eslabones vecinos dentro de la MISMA familia de dificultad. Lineal en v1: un anterior, un siguiente. */
export interface CadenaEslabon {
  anterior: string | null;
  siguiente: string | null;
}

/** Prerequisito demostrable, independiente del Nivel nominal (gates de calistenia). */
export interface Capacidad {
  slug: string;
  descripcion: string;
  comoSeDemuestra: string;
}

/**
 * Ficha completa. Los 9 atributos ya existentes se heredan del `Exercise` del
 * catálogo actual; los 6 pendientes son explícitamente nullables.
 */
export interface EjercicioKB {
  // ── Los 9 que YA existen en src/data/exercises.ts ───────────────────────
  slug: string;
  nombre: string;
  nombreIngles: string | null;
  tipo: Exercise["tipo"];
  nivel: ExerciseLevel;
  equipo: EquipoSlug[];
  musculoPrincipal: Exercise["musculoPrincipal"];
  musculosSecundarios: Exercise["musculosSecundarios"];
  descripcion: string;
  instrucciones: string[];
  erroresComunes: string[];
  beneficios: string[];
  sistemasVinculados: Exercise["sistemasVinculados"];

  // ── Los 6 que el handbook declara FALTANTES (bloqueante #2) ─────────────
  /** Sin él el ejercicio es INVÁLIDO: "Rechazado al validar el catálogo — nunca llega a ser elegible". */
  patronPrimario: PatronSlug | null;
  /** 0..N. Solo el primario llena slots (regla a). */
  patronesSecundarios: PatronSlug[];
  rolesPosibles: RolSlug[];
  modalidad: Modalidad | null;
  /** Lista vacía es válida; `null` significa SIN ETIQUETAR (distinto de "no carga ninguna zona"). */
  zonasRiesgo: ZonaRiesgoDeclarada[] | null;
  cadena: CadenaEslabon | null;
  capacidadesRequeridas: string[];

  /** `variantes[]` del catálogo actual: texto libre, precursor SIN estructura de la cadena. Nunca se parsea (P14). */
  variantesTextoLibre: string[];
}

/** Resultado de validar el catálogo contra las reglas del handbook 04. */
export interface ValidacionCatalogo {
  totalEjercicios: number;
  /** "Ejercicio sin patronPrimario → Inválido: rechazado al validar el catálogo". */
  invalidosSinPatron: string[];
  sinRoles: string[];
  sinModalidad: string[];
  sinZonasEtiquetadas: string[];
  sinCadena: string[];
  /** Cadenas con ciclo (A→B→A) — "Inválido: rechazado por validación estructural". */
  cadenasConCiclo: string[][];
  elegiblesParaResolucion: number;
}

/** Entrada de `resolverEjercicioParaSlot`. Valores, NUNCA una entidad de usuario (la KB no conoce usuarios). */
export interface ConsultaSlot {
  patron: PatronSlug;
  rol: RolSlug;
  /** El Track (03) "almacena el conjunto de etiquetas de equipo elegible" — la KB recibe ese conjunto, no el Track. */
  equipoElegible: readonly EquipoSlug[];
  /** Qué niveles de ejercicio acepta este slot. El mapeo Nivel-de-usuario → nivel-de-ejercicio NO está especificado en ningún handbook: se recibe resuelto. */
  nivelesElegibles: readonly ExerciseLevel[];
  /** Zonas declaradas por el usuario, como VALORES. Se excluyen los ejercicios que las cargan en `alto`. */
  zonasExcluidas: readonly ZonaSlug[];
  capacidadesCumplidas: readonly string[];
  /** Paso 1 — el eslabón de cadena vigente para este patrón/rol, ya resuelto por el llamador (la KB no consulta historiales). */
  eslabonVigente?: string | null;
  excluir?: readonly string[];
}

export type ResolucionSlot =
  | { ok: true; ejercicio: EjercicioKB; paso: 1 | 2 | 3 | 4; patronUsado: PatronSlug; degradado: boolean; razon: string }
  | { ok: false; error: "CATALOGO_INSUFICIENTE"; detalle: { patron: PatronSlug; rol: RolSlug; equipoElegible: readonly EquipoSlug[]; nivelesElegibles: readonly ExerciseLevel[]; exclusiones: readonly ZonaSlug[] } };
