// ── Extracción de evidencia (Sprint PAS-6.0) ───────────────────────────────
// Recoge de la PKB y del PIE lo que sostiene cada recomendación. NO evalúa
// evidencia, NO la resume y NO genera conocimiento: localiza y arrastra.

import type { CapacidadId } from '../capacidades';
import type {
  ConocimientoPKB,
  FichaPKB,
  Interpretacion,
  NivelEvidencia,
  PerformanceInterpretationReport,
  Poblacion,
} from '../interpretation';
import { ORDEN_NIVELES } from '../report';
import type { EvidenciaRecomendacion } from './tipos';

export const SIN_EVIDENCIA: EvidenciaRecomendacion = {
  nivel: null,
  poblaciones: [],
};

export function fichasDe(pkb: ConocimientoPKB, capacidades: readonly CapacidadId[]): FichaPKB[] {
  return pkb.fichas
    .filter((f) => capacidades.includes(f.capacidad))
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function fichasAplicables(fichas: readonly FichaPKB[]): FichaPKB[] {
  return fichas.filter(
    (f) => f.estado === 'respaldada' || f.estado === 'parcialmente_respaldada'
  );
}

export function interpretacionesDe(
  informe: PerformanceInterpretationReport,
  capacidades: readonly CapacidadId[]
): Interpretacion[] {
  return informe.porCapacidad.filter((i) =>
    i.capacidadesRelacionadas.some((c) => capacidades.includes(c))
  );
}

/** El nivel más alto presente. Nunca se promedia: promediar sería calcular. */
function nivelMasAlto(fichas: readonly FichaPKB[]): NivelEvidencia | null {
  for (const nivel of ORDEN_NIVELES) {
    if (nivel === 'no_documentado') continue;
    if (fichas.some((f) => f.nivelEvidencia === nivel)) return nivel as NivelEvidencia;
  }
  return null;
}

export function construirEvidencia(fichas: readonly FichaPKB[]): EvidenciaRecomendacion {
  if (fichas.length === 0) return SIN_EVIDENCIA;

  return {
    nivel: nivelMasAlto(fichas),
    poblaciones: [...new Set(fichas.flatMap((f) => f.poblaciones))].sort() as Poblacion[],
  };
}

export function referenciasDe(fichas: readonly FichaPKB[]): string[] {
  return [...new Set(fichas.flatMap((f) => f.referencias))].sort();
}

/** Ids de hallazgos del PAE citados por las interpretaciones dadas. */
export function hallazgosDe(interpretaciones: readonly Interpretacion[]): string[] {
  return [...new Set(interpretaciones.flatMap((i) => i.hallazgosRelacionados))].sort();
}
