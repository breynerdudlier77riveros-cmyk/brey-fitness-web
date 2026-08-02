// ── resolverEjercicioParaSlot — reglas de sustitución (handbook 04) ─────────
// Traducción literal del pseudocódigo de "Reglas de sustitución": 6 pasos, en
// orden, sin ramas alternativas. Función PURA: recibe el catálogo y valores,
// devuelve un resultado. Sin I/O, sin usuarios, sin Date.now(), sin aleatorio.
//
// Es la consulta que el Workout Generator (08) esperaba desde el Sprint 4 y
// que quedó declarada como dependencia externa. NO es un motor de dominio: es
// la resolución de elegibilidad que la propia Knowledge Base especifica como
// suya (módulo 04, "Dependido por: 05, 08, 09").

import type { ExerciseLevel } from "@/lib/types";
import { obtenerCadenaDe, excluirPorZonas } from "./repository";
import type { EjercicioKB, ConsultaSlot, ResolucionSlot } from "./tipos";
import { buscarPatron, type PatronSlug } from "./vocabularios";

/** Orden estable y total (P1): nivel ascendente, luego slug ascendente. Nunca "el primero que devuelva la base". */
const PESO_NIVEL: Record<ExerciseLevel, number> = { principiante: 0, intermedio: 1, avanzado: 2 };

function ordenEstable(a: EjercicioKB, b: EjercicioKB): number {
  const porNivel = PESO_NIVEL[a.nivel] - PESO_NIVEL[b.nivel];
  return porNivel !== 0 ? porNivel : a.slug.localeCompare(b.slug);
}

/** Paso 0 — universo elegible. Todos los filtros del pseudocódigo, en su orden. */
function candidatosPara(catalogo: readonly EjercicioKB[], consulta: ConsultaSlot, patron: PatronSlug): EjercicioKB[] {
  const excluidos = new Set(consulta.excluir ?? []);
  const conZonasFiltradas = excluirPorZonas(catalogo, consulta.zonasExcluidas);

  return conZonasFiltradas
    .filter((e) => e.patronPrimario === patron)
    .filter((e) => e.rolesPosibles.includes(consulta.rol))
    .filter((e) => consulta.nivelesElegibles.includes(e.nivel))
    .filter((e) => e.equipo.every((eq) => consulta.equipoElegible.includes(eq)))
    .filter((e) => e.capacidadesRequeridas.every((c) => consulta.capacidadesCumplidas.includes(c)))
    .filter((e) => !excluidos.has(e.slug))
    .sort(ordenEstable);
}

export function resolverEjercicioParaSlot(
  catalogo: readonly EjercicioKB[],
  consulta: ConsultaSlot
): ResolucionSlot {
  return resolverInterno(catalogo, consulta, consulta.patron, new Set<PatronSlug>(), false);
}

function resolverInterno(
  catalogo: readonly EjercicioKB[],
  consulta: ConsultaSlot,
  patron: PatronSlug,
  visitados: Set<PatronSlug>,
  degradado: boolean
): ResolucionSlot {
  visitados.add(patron);
  const candidatos = candidatosPara(catalogo, consulta, patron);

  // ── Paso 1 — preferencia: el eslabón de cadena vigente ───────────────────
  if (consulta.eslabonVigente) {
    const vigente = candidatos.find((e) => e.slug === consulta.eslabonVigente);
    if (vigente) {
      return { ok: true, ejercicio: vigente, paso: 1, patronUsado: patron, degradado, razon: "Eslabón de cadena vigente, elegible" };
    }
  }

  // ── Paso 2 — misma cadena, eslabón elegible más cercano al vigente ───────
  if (consulta.eslabonVigente) {
    const cadena = obtenerCadenaDe(catalogo, consulta.eslabonVigente);
    const posicionVigente = cadena.findIndex((e) => e.slug === consulta.eslabonVigente);
    if (posicionVigente !== -1) {
      const elegiblesDeLaCadena = cadena
        .map((eslabon, indice) => ({ eslabon, distancia: Math.abs(indice - posicionVigente) }))
        .filter(({ eslabon }) => candidatos.some((c) => c.slug === eslabon.slug))
        .sort((a, b) => (a.distancia !== b.distancia ? a.distancia - b.distancia : ordenEstable(a.eslabon, b.eslabon)));

      const masCercano = elegiblesDeLaCadena.at(0);
      if (masCercano) {
        return { ok: true, ejercicio: masCercano.eslabon, paso: 2, patronUsado: patron, degradado, razon: "Eslabón elegible más cercano dentro de la misma cadena" };
      }
    }
  }

  // ── Paso 3 — mismo patrón + rol, fuera de la cadena ──────────────────────
  const primero = candidatos.at(0);
  if (primero) {
    return { ok: true, ejercicio: primero, paso: 3, patronUsado: patron, degradado, razon: "Primer candidato por orden estable (nivel asc, slug asc)" };
  }

  // ── Paso 4 — degradación de patrón declarada (única permitida) ───────────
  // ⚠ El grafo de degradación del handbook 04 es MUTUO en tres pares
  // (empuje-horizontal ⇄ empuje-vertical, traccion-horizontal ⇄
  // traccion-vertical, dominante-rodilla ⇄ dominante-cadera). El pseudocódigo
  // recursa sin guarda, así que dos patrones vacíos producirían recursión
  // infinita. El conjunto `visitados` corta el ciclo sin alterar la regla:
  // cada patrón declarado se intenta exactamente una vez. Reportado como
  // hallazgo — no es una degradación nueva ni un par improvisado.
  const destino = buscarPatron(patron)?.degradaA ?? null;
  if (destino && !visitados.has(destino)) {
    return resolverInterno(catalogo, consulta, destino, visitados, true);
  }

  // ── Paso 5 — fallo visible (P6) ──────────────────────────────────────────
  return {
    ok: false,
    error: "CATALOGO_INSUFICIENTE",
    detalle: {
      patron: consulta.patron,
      rol: consulta.rol,
      equipoElegible: consulta.equipoElegible,
      nivelesElegibles: consulta.nivelesElegibles,
      exclusiones: consulta.zonasExcluidas,
    },
  };
}
