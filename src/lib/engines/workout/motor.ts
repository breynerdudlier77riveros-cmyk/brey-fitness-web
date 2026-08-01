// ── Workout Generator (Domain Engine, puro) ─────────────────────────────────
// Fuente exclusiva: Architecture Handbook 08 — pseudocódigo generarSemana(),
// R-G1 (semana completa, no sesión por sesión), R-G2 (recorte por tiempo),
// R-G3 (multiplicador de descarga uniforme), invariantes I-G1..I-G4.
//
// "El ensamblador. No decide nada nuevo" (08): este motor NUNCA elige
// ejercicios, nunca calcula prescripciones, nunca decide descarga — combina
// piezas ya decididas por Progression Engine, Recovery Engine y Knowledge
// Base (esta última fuera de alcance de este Sprint, ver tipos.ts).
//
// Puro: sin repositorios, sin persistencia (pedido explícito del Sprint) —
// la idempotencia de "semana ya generada" (08, caso límite) es una
// verificación contra base de datos, responsabilidad del llamador, no de
// esta función. I-G4 ("corre solo si el Motor BPS lo invoca") es un
// invariante de ORDEN DE INVOCACIÓN que ninguna función pura puede
// autoverificar — es responsabilidad del orquestador, documentada aquí, no
// hecha cumplir en runtime por este módulo.

import type { EntradaGenerarSemana, ResultadoGeneracion, SesionGenerada, SlotGenerado, SlotResuelto, RolSlot } from "./tipos";

// R-G2 — orden de recorte fijo, nunca principal ni activacion.
const ORDEN_RECORTE: readonly RolSlot[] = ["metabolico", "core-final", "accesorio"];

function duracionTotal(slots: readonly SlotResuelto[]): number {
  return slots.reduce((suma, s) => suma + s.duracionEstimadaMin, 0);
}

/**
 * R-G2 — Regla de Recorte por tiempo: recorta metabolico → core-final →
 * accesorio hasta caber, o hasta agotar esas categorías. Recorte por
 * categoría completa en cada paso: R-G2 especifica el ORDEN entre
 * categorías, no un recorte parcial slot-a-slot dentro de una misma
 * categoría — no se inventa esa granularidad.
 */
function recortarPorTiempo(slots: readonly SlotResuelto[], duracionDisponibleMin: number): { slots: SlotResuelto[]; excedeTiempo: boolean } {
  let actuales = [...slots];

  for (const rolARecortar of ORDEN_RECORTE) {
    if (duracionTotal(actuales) <= duracionDisponibleMin) break;
    actuales = actuales.filter((s) => s.rol !== rolARecortar);
  }

  return { slots: actuales, excedeTiempo: duracionTotal(actuales) > duracionDisponibleMin };
}

export function generarSemana(entrada: EntradaGenerarSemana): ResultadoGeneracion {
  const { veredictoRecovery } = entrada;
  // Traducción de la forma canónica (IMP-ADR-01) a la semántica del pseudocódigo original (recovery.si / recovery.tipo) — ver tipos.ts.
  const esDescarga = !veredictoRecovery.procede;
  const mult = esDescarga ? 0.6 : 1.0; // R-G3
  const rpeDelta = esDescarga ? -1 : 0;

  const sesiones: SesionGenerada[] = [];

  for (const sesionPlan of entrada.sesiones) {
    // I-G1 / R-G1 — cualquier slot sin ejercicio resuelto aborta TODA la semana, no solo esa sesión.
    for (const slot of sesionPlan.slots) {
      if (!slot.resolucion.ok) {
        return {
          ok: false,
          error: "CATALOGO_INSUFICIENTE",
          detalle: { fecha: sesionPlan.fecha, patron: slot.patron, rol: slot.rol, motivo: slot.resolucion.detalle },
        };
      }
    }

    const { slots: slotsRecortados, excedeTiempo } = recortarPorTiempo(sesionPlan.slots, entrada.duracionSesionMin);

    const slotsGenerados: SlotGenerado[] = slotsRecortados.map((slot) => {
      // Ya validado arriba (resolucion.ok === true para todos los slots de esta semana).
      const ejercicio = (slot.resolucion as { ok: true; ejercicio: SlotGenerado["ejercicio"] }).ejercicio;
      return {
        patron: slot.patron,
        rol: slot.rol,
        ejercicio,
        // Mínimo 1 serie sin excepción — el caso "0 series en un principal" está definido como IMPOSIBLE por regla (08, casos inválidos), no librado al redondeo.
        series: Math.max(1, Math.round(slot.prescripcion.series * mult)),
        reps: slot.prescripcion.rango,
        rpe: slot.prescripcion.rpe + rpeDelta,
        descansoSeg: slot.descansoBaseSeg,
        tempo: slot.prescripcion.tempo ?? "controlado",
        notas: slot.notas,
      };
    });

    sesiones.push({
      fecha: sesionPlan.fecha,
      duracionEstimadaMin: duracionTotal(slotsRecortados),
      slots: slotsGenerados,
      excedeTiempoDeclarado: excedeTiempo,
    });
  }

  return {
    ok: true,
    sesiones,
    evento: { tipo: "semana_generada", versionCatalogo: entrada.versionCatalogo, tipoSemana: esDescarga ? "descarga" : "normal" }, // BPS-023
  };
}
