// ── Vocabularios del Training Framework (handbook 03) ───────────────────────
// Solo lo que el handbook publica cerrado. Todo lo marcado "calibrable" o
// "pendiente" se expone como RANGO o como null, nunca como un número inventado.

import type { RolSlug } from "@/lib/knowledge-base/vocabularios";
import type { TrackSlug, Enfasis, TipoPeriodizacion } from "./tipos";

export const TRACKS: readonly TrackSlug[] = ["gym", "casa", "ambos"] as const;

export const ENFASIS: readonly Enfasis[] = ["tecnica", "volumen", "intensidad", "definicion"] as const;

/** v1: siempre lineal (capa 4). */
export const PERIODIZACION_V1: TipoPeriodizacion = "lineal";

/** Capa 14 — default cuando no se prescribe notación explícita. */
export const TEMPO_DEFAULT = "controlado";

/** Capa 5 — "sub-tramo del Bloque… 2–6 semanas". */
export const MESOCICLO_SEMANAS_MIN = 2;
export const MESOCICLO_SEMANAS_MAX = 6;

/**
 * Capa 13 — descanso default por Rol, "modulado por énfasis del Bloque".
 * El handbook publica RANGOS y declara los números "calibrables". La función
 * que elige un valor concreto dentro del rango a partir del énfasis NO está
 * especificada en ningún handbook — por eso aquí se expone el rango y no un
 * número: elegir uno sería inventar la modulación. `activacion` se define
 * como "mínimo", sin cifras.
 */
export interface RangoDescanso {
  minSegundos: number | null;
  maxSegundos: number | null;
  nota?: string;
}

export const DESCANSO_POR_ROL: Readonly<Record<RolSlug, RangoDescanso>> = {
  activacion: { minSegundos: null, maxSegundos: null, nota: "mínimo — el handbook no publica cifras" },
  principal: { minSegundos: 120, maxSegundos: 180 },
  accesorio: { minSegundos: 60, maxSegundos: 120 },
  "core-final": { minSegundos: 45, maxSegundos: 90 },
  metabolico: { minSegundos: 30, maxSegundos: 60 },
};

/**
 * Identificador de versión del catálogo — obligatorio en cada generación
 * (BPS-023/ADR-009): sin él, una generación pasada es irreproducible tras
 * cambios de contenido. Debe incrementarlo quien autorice contenido nuevo.
 */
export const VERSION_CATALOGO = "sin-contenido-autorizado";
