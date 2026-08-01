// ── Repositorio del Training Framework — consultas sobre las plantillas ─────
// Sin SupabaseClient, misma razón que la Knowledge Base: no existe tabla de
// plantillas en el esquema; el catálogo vive en código versionado (ADR-009).
//
// El TF nunca conoce ejercicios concretos (R-3): ninguna función de este
// archivo importa, devuelve ni filtra por ejercicios — solo Patrón × Rol.

import { obtenerBloquesDeSistema, obtenerNivelesDeSistema } from "./catalogo";
import { ordenDeRol } from "@/lib/knowledge-base/vocabularios";
import { MESOCICLO_SEMANAS_MAX, MESOCICLO_SEMANAS_MIN } from "./vocabularios";
import type { Bloque, Mesociclo, Microciclo, ResolucionFrecuencia, SlotPlantilla } from "./tipos";

export function obtenerBloque(sistemaSlug: string, bloqueId: string): Bloque | undefined {
  return obtenerBloquesDeSistema(sistemaSlug).find((b) => b.id === bloqueId);
}

export function obtenerMesociclo(sistemaSlug: string, bloqueId: string, mesocicloId: string): Mesociclo | undefined {
  return obtenerBloque(sistemaSlug, bloqueId)?.mesociclos.find((m) => m.id === mesocicloId);
}

export function obtenerMicrociclo(sistemaSlug: string, bloqueId: string, mesocicloId: string, microcicloId: string): Microciclo | undefined {
  return obtenerMesociclo(sistemaSlug, bloqueId, mesocicloId)?.microciclos.find((mc) => mc.id === microcicloId);
}

export function obtenerNiveles(sistemaSlug: string) {
  return obtenerNivelesDeSistema(sistemaSlug);
}

/** R-4 · Regla de Orden por Rol — el Generator no puede alterar este orden relativo. */
export function ordenarSlotsPorRol(slots: readonly SlotPlantilla[]): SlotPlantilla[] {
  return [...slots].sort((a, b) => ordenDeRol(a.rol) - ordenDeRol(b.rol));
}

/**
 * R-1 · Regla de Frecuencia.
 *
 * `sesionesSemanales` del Bloque es IDEAL, nunca mínimo obligatorio: el
 * Microciclo real usa `mín(ideal, dias_por_semana)`. Eso es todo lo que el
 * handbook especifica numéricamente.
 *
 * ⚠ El pseudocódigo nombra `redistribuir(volumenSemanal, sobre: real)` y
 * `estimarExtension(ideal, real, duracionSemanas)`, pero NO define ninguna de
 * las dos fórmulas, y `volumenSemanal` no existe como campo en ninguna
 * plantilla real. Por eso esta función devuelve los FLAGS de que ambas cosas
 * hacen falta, en vez de un número fabricado. El aviso de extensión es parte
 * de la regla, no un extra — el flag existe para que nadie lo omita.
 */
export function resolverFrecuenciaSemana(sesionesIdeales: number, diasPorSemana: number): ResolucionFrecuencia {
  const sesionesResueltas = Math.min(sesionesIdeales, diasPorSemana);
  const insuficiente = diasPorSemana < sesionesIdeales;

  return {
    sesionesIdeales,
    sesionesReales: diasPorSemana,
    sesionesResueltas,
    requiereRedistribucionDeVolumen: insuficiente,
    requiereAvisoDeExtension: insuficiente,
  };
}

export interface ValidacionPlantillas {
  sistema: string;
  bloques: number;
  bloquesSinEnfasis: string[];
  bloquesSinMesociclos: string[];
  /** "Microciclo con 0 sesiones → plantilla malformada, error de catálogo". */
  microciclosSinSesiones: string[];
  /** Capa 5: "2–6 semanas". */
  mesociclosFueraDeRango: string[];
  /** "Slot sin rol → plantilla malformada, un slot es Patrón×Rol sin excepción". */
  slotsMalformados: number;
  generable: boolean;
}

/** Valida las plantillas contra los "casos inválidos" del handbook 03. */
export function validarPlantillas(sistemaSlug: string): ValidacionPlantillas {
  const bloques = obtenerBloquesDeSistema(sistemaSlug);
  const bloquesSinEnfasis: string[] = [];
  const bloquesSinMesociclos: string[] = [];
  const microciclosSinSesiones: string[] = [];
  const mesociclosFueraDeRango: string[] = [];
  let slotsMalformados = 0;

  for (const bloque of bloques) {
    if (bloque.enfasis === null) bloquesSinEnfasis.push(bloque.id);
    if (bloque.mesociclos.length === 0) bloquesSinMesociclos.push(bloque.id);

    for (const meso of bloque.mesociclos) {
      if (meso.duracionSemanas < MESOCICLO_SEMANAS_MIN || meso.duracionSemanas > MESOCICLO_SEMANAS_MAX) {
        mesociclosFueraDeRango.push(meso.id);
      }
      for (const micro of meso.microciclos) {
        if (micro.sesiones.length === 0) microciclosSinSesiones.push(micro.id);
        for (const sesion of micro.sesiones) {
          slotsMalformados += sesion.slots.filter((s) => !s.patron || !s.rol).length;
        }
      }
    }
  }

  return {
    sistema: sistemaSlug,
    bloques: bloques.length,
    bloquesSinEnfasis,
    bloquesSinMesociclos,
    microciclosSinSesiones,
    mesociclosFueraDeRango,
    slotsMalformados,
    generable: bloques.length > 0 && bloquesSinMesociclos.length === 0 && slotsMalformados === 0,
  };
}
