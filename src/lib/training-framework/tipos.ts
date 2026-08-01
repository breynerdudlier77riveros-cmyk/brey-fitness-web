// ── Tipos del Training Framework — las 15 capas (handbook 03) ───────────────
// Capas 1–6 son PLANTILLA (catálogo autorizado por humanos, P14); de Sesión
// hacia abajo son INSTANCIA inmutable (P5) y ya existen en otro sitio:
// Sesión = fila de `workouts` (src/lib/types.ts), y las hojas 10–15 viajan en
// su jsonb. Este módulo modela SOLO el lado plantilla + la prescripción base,
// que es lo que faltaba.
//
// R-3 (Regla de Patrón): ninguna capa por encima del slot referencia
// ejercicios por nombre. Por eso `SlotPlantilla` es Patrón × Rol y este
// archivo NO importa nada del catálogo de ejercicios — solo los slugs de
// vocabulario de la Knowledge Base, como `import type` (cero runtime).

import type { PatronSlug, RolSlug, EquipoSlug } from "@/lib/knowledge-base/vocabularios";

/** Capa 2 — variante de contexto/equipo (ADR-005), conectada a `lugar_entrenamiento`. */
export type TrackSlug = "gym" | "casa" | "ambos";

export interface Track {
  slug: TrackSlug;
  /** "Almacena: el conjunto de etiquetas de equipo elegible que filtra el catálogo hacia abajo". */
  equipoElegible: EquipoSlug[];
}

/** Capa 4 — énfasis fisiológico del Bloque. */
export type Enfasis = "tecnica" | "volumen" | "intensidad" | "definicion";

/** v1: siempre `lineal`. Campo declarado para ramificar a futuro sin romper contratos. */
export type TipoPeriodizacion = "lineal";

/** Capa 8 — un slot es SIEMPRE Patrón × Rol, sin excepción ("slot sin rol" es plantilla malformada). */
export interface SlotPlantilla {
  patron: PatronSlug;
  rol: RolSlug;
}

/** Capas 10–14 en su forma de PLANTILLA (la instancia vive en workouts.ejercicios). */
export interface PrescripcionBase {
  series: number;
  /** Capa 11 — rango objetivo, no número fijo: es lo que permite la doble progresión. */
  repeticionesMin: number | null;
  repeticionesMax: number | null;
  /** En isométricos la unidad es segundos, declarada por la modalidad del ejercicio. */
  duracionSegundos: number | null;
  /** Capa 12 — esfuerzo objetivo. RPE y RIR son mutuamente excluyentes por Slot (PE-007/008). */
  rpeObjetivo: number | null;
  rirObjetivo: number | null;
  descansoSegundos: number;
  /** Capa 14 — notación de 4 dígitos `excéntrica-pausa-concéntrica-pausa`, o null = "controlado". */
  tempo: string | null;
}

/** Capa 6 — la semana concreta. Última capa de plantilla. */
export interface SesionPlantilla {
  /** El rol/carácter de la sesión (ej. "empuje pesado", "tracción + core") — nunca el ejercicio. */
  caracter: string;
  slots: SlotPlantilla[];
}

export interface Microciclo {
  id: string;
  numeroSemana: number;
  /** Lo declara el Mesociclo: "cuál semana es descarga programada". */
  esDescargaProgramada: boolean;
  sesionesIdeales: number;
  sesiones: SesionPlantilla[];
  /** "Separación mínima de recuperación entre sesiones del mismo patrón". Unidad sin decidir (pregunta abierta del handbook, Roadmap H2). */
  separacionMinimaMismoPatron: number | null;
}

/** Capa 5 — sub-tramo del Bloque, 2–6 semanas, cerrando en descarga o test. */
export interface Mesociclo {
  id: string;
  nombre: string;
  duracionSemanas: number;
  /** "El patrón de progresión semana a semana (ej. RPE 7→8→9→descarga)". */
  progresionSemanal: Array<number | "descarga">;
  semanaDescargaProgramada: number | null;
  cierre: "descarga" | "test";
  microciclos: Microciclo[];
}

/** Capa 4 — período con énfasis fisiológico. "Formaliza las fases[] del catálogo actual". */
export interface Bloque {
  id: string;
  nombre: string;
  descripcion: string;
  /** null = PENDIENTE de autorización editorial: `fases[]` no lo declara (ver catalogo.ts). */
  enfasis: Enfasis | null;
  duracionSemanas: number;
  /** R-1: es IDEAL, nunca mínimo obligatorio. */
  sesionesSemanales: number;
  tipoPeriodizacion: TipoPeriodizacion;
  /** Defaults que las capas inferiores heredan. null = no declarado por el catálogo actual. */
  descansoDefaultSegundos: number | null;
  intensidadDefault: number | null;
  mesociclos: Mesociclo[];
}

/** Capa 3 — punto de entrada y progresión dentro del Track. Corresponde a `profiles.nivel_actual`. */
export interface NivelPlantilla {
  nombre: string;
  descripcion: string;
  /** Qué Bloques habilita este Nivel. Vacío = no autorizado todavía. */
  bloques: Bloque[];
}

/** Resultado de R-1 · Regla de Frecuencia. */
export interface ResolucionFrecuencia {
  sesionesIdeales: number;
  sesionesReales: number;
  /** `mín(ideal, dias_por_semana)` — la única parte de R-1 que el handbook especifica numéricamente. */
  sesionesResueltas: number;
  requiereRedistribucionDeVolumen: boolean;
  /** El aviso es PARTE de la regla, no un extra (riesgo declarado en el handbook). */
  requiereAvisoDeExtension: boolean;
}
