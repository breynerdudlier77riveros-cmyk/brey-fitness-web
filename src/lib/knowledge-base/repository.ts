// ── Repositorio de la Knowledge Base — consultas sobre el catálogo ──────────
// Sin SupabaseClient, a diferencia de los repositorios del Sprint 2: no hay
// tabla de ejercicios en el esquema (verificado: las 9 tablas reales son
// systems, profiles, diagnoses, workouts, workout_logs, progression_events y
// las 3 del BCS). El catálogo rico vive en código versionado (ADR-009), igual
// que `sistemas.ts`. Este repositorio encapsula ese acceso para que ningún
// consumidor importe src/data/exercises.ts directamente.
//
// La KB nunca conoce usuarios: ninguna función de este archivo recibe userId,
// sesión ni SupabaseClient.

import { ejercicios } from "@/data/exercises";
import type { ExerciseLevel } from "@/lib/types";
import { mapEjercicioKB } from "./mappers";
import type { EjercicioKB, ValidacionCatalogo } from "./tipos";
import type { PatronSlug, RolSlug, EquipoSlug, ZonaSlug } from "./vocabularios";

/** Todo el catálogo, ya mapeado a la ontología. Orden estable: el del archivo fuente. */
export function obtenerCatalogo(): EjercicioKB[] {
  return ejercicios.map(mapEjercicioKB);
}

export function obtenerPorSlug(slug: string): EjercicioKB | undefined {
  return obtenerCatalogo().find((e) => e.slug === slug);
}

/** Solo los que llenan slots: patrón primario declarado (regla a del vocabulario). */
export function obtenerPorPatronPrimario(catalogo: readonly EjercicioKB[], patron: PatronSlug): EjercicioKB[] {
  return catalogo.filter((e) => e.patronPrimario === patron);
}

export function obtenerPorRol(catalogo: readonly EjercicioKB[], rol: RolSlug): EjercicioKB[] {
  return catalogo.filter((e) => e.rolesPosibles.includes(rol));
}

export function obtenerPorEquipo(catalogo: readonly EjercicioKB[], equipoElegible: readonly EquipoSlug[]): EjercicioKB[] {
  return catalogo.filter((e) => e.equipo.every((eq) => equipoElegible.includes(eq)));
}

export function obtenerPorNivel(catalogo: readonly EjercicioKB[], niveles: readonly ExerciseLevel[]): EjercicioKB[] {
  return catalogo.filter((e) => niveles.includes(e.nivel));
}

/** Regla de exclusión por zona: se excluyen los que cargan la zona en `alto`; medio/bajo permanecen elegibles. */
export function excluirPorZonas(catalogo: readonly EjercicioKB[], zonasExcluidas: readonly ZonaSlug[]): EjercicioKB[] {
  if (zonasExcluidas.length === 0) return [...catalogo];
  return catalogo.filter((e) => {
    // Sin etiquetar (null) NO se puede afirmar que sea seguro — se excluye por
    // precaución: el filtro es de seguridad y no removible (handbook 04).
    if (e.zonasRiesgo === null) return false;
    return !e.zonasRiesgo.some((z) => z.intensidad === "alto" && zonasExcluidas.includes(z.zona));
  });
}

/** La cadena completa a la que pertenece un eslabón, recorrida en ambos sentidos. */
export function obtenerCadenaDe(catalogo: readonly EjercicioKB[], slug: string): EjercicioKB[] {
  const porSlug = new Map(catalogo.map((e) => [e.slug, e]));
  const inicio = porSlug.get(slug);
  if (!inicio || !inicio.cadena) return inicio ? [inicio] : [];

  const haciaAtras: EjercicioKB[] = [];
  const vistosAtras = new Set<string>([slug]);
  let cursor = inicio.cadena.anterior;
  while (cursor && !vistosAtras.has(cursor)) {
    const eslabon = porSlug.get(cursor);
    if (!eslabon) break;
    haciaAtras.unshift(eslabon);
    vistosAtras.add(cursor);
    cursor = eslabon.cadena?.anterior ?? null;
  }

  const haciaAdelante: EjercicioKB[] = [];
  const vistosAdelante = new Set<string>([slug]);
  cursor = inicio.cadena.siguiente;
  while (cursor && !vistosAdelante.has(cursor)) {
    const eslabon = porSlug.get(cursor);
    if (!eslabon) break;
    haciaAdelante.push(eslabon);
    vistosAdelante.add(cursor);
    cursor = eslabon.cadena?.siguiente ?? null;
  }

  return [...haciaAtras, inicio, ...haciaAdelante];
}

/**
 * Valida el catálogo contra las reglas de "Casos inválidos" del handbook 04.
 * Es la prueba objetiva de qué falta para que la resolución de slots funcione
 * — no un chequeo decorativo.
 */
export function validarCatalogo(catalogo: readonly EjercicioKB[] = obtenerCatalogo()): ValidacionCatalogo {
  const invalidosSinPatron = catalogo.filter((e) => e.patronPrimario === null).map((e) => e.slug);
  const sinRoles = catalogo.filter((e) => e.rolesPosibles.length === 0).map((e) => e.slug);
  const sinModalidad = catalogo.filter((e) => e.modalidad === null).map((e) => e.slug);
  const sinZonasEtiquetadas = catalogo.filter((e) => e.zonasRiesgo === null).map((e) => e.slug);
  const sinCadena = catalogo.filter((e) => e.cadena === null).map((e) => e.slug);

  // Cadena con ciclo (A→B→A) — inválida por validación estructural.
  const cadenasConCiclo: string[][] = [];
  const porSlug = new Map(catalogo.map((e) => [e.slug, e]));
  for (const ejercicio of catalogo) {
    if (!ejercicio.cadena?.siguiente) continue;
    const recorrido: string[] = [ejercicio.slug];
    const vistos = new Set<string>([ejercicio.slug]);
    let cursor: string | null = ejercicio.cadena.siguiente;
    while (cursor) {
      if (vistos.has(cursor)) {
        cadenasConCiclo.push([...recorrido, cursor]);
        break;
      }
      recorrido.push(cursor);
      vistos.add(cursor);
      cursor = porSlug.get(cursor)?.cadena?.siguiente ?? null;
    }
  }

  return {
    totalEjercicios: catalogo.length,
    invalidosSinPatron,
    sinRoles,
    sinModalidad,
    sinZonasEtiquetadas,
    sinCadena,
    cadenasConCiclo,
    elegiblesParaResolucion: catalogo.length - invalidosSinPatron.length,
  };
}
