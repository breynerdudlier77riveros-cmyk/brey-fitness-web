// ── Mapper del catálogo actual → ficha de Knowledge Base ────────────────────
// Mismo principio que src/lib/database/mappers.ts: ninguna ficha cruda escapa
// sin pasar por un mapper. Aquí la fuente no es Postgres sino el catálogo en
// código (ADR-009: el catálogo rico vive en código versionado, no en la base).
//
// Los 6 atributos que el handbook 04 marca como "Falta" se mapean a null /
// lista vacía — NUNCA se infieren del nombre, del músculo ni del texto libre.
// El propio handbook lo prohíbe explícitamente: "La intensidad relativa por
// zona no se infiere del nombre — exige etiquetado con criterio biomecánico"
// y "Notas machine-readable: descartado". Un mapper que adivinara
// `patronPrimario` a partir de `musculoPrincipal` estaría fabricando
// biomecánica (P11/P14).

import type { Exercise } from "@/lib/types";
import type { EjercicioKB } from "./tipos";
import type { EquipoSlug } from "./vocabularios";

export function mapEjercicioKB(ejercicio: Exercise): EjercicioKB {
  return {
    slug: ejercicio.slug,
    nombre: ejercicio.nombre,
    nombreIngles: ejercicio.nombreIngles ?? null,
    tipo: ejercicio.tipo,
    nivel: ejercicio.nivel,
    equipo: ejercicio.equipo as EquipoSlug[], // mismo vocabulario cerrado (handbook 04, "Vocabulario ya existente en el catálogo")
    musculoPrincipal: ejercicio.musculoPrincipal,
    musculosSecundarios: ejercicio.musculosSecundarios,
    descripcion: ejercicio.descripcion,
    instrucciones: ejercicio.instrucciones,
    erroresComunes: ejercicio.erroresComunes,
    beneficios: ejercicio.beneficios,
    sistemasVinculados: ejercicio.sistemasVinculados,

    // Los 6 pendientes de etiquetado con criterio (bloqueante #2 del Roadmap).
    patronPrimario: null,
    patronesSecundarios: [],
    rolesPosibles: [],
    modalidad: null,
    zonasRiesgo: null, // null = SIN ETIQUETAR; [] significaría "no carga ninguna zona", que es una afirmación distinta
    cadena: null,
    capacidadesRequeridas: [],

    variantesTextoLibre: ejercicio.variantes,
  };
}
