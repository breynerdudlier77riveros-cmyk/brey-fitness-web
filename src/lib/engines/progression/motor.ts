// ── Progression Engine (Domain Engine, puro) ────────────────────────────────
// Fuente exclusiva: Progression Engine Handbook 04 (entradas), 05 (modelo de
// decisión — escalera de precedencia de 5 niveles), 06 (pipeline de 9 pasos),
// 07 (catálogo canónico PE-001..039). Implementa exactamente esas 39 reglas —
// sin simplificar sus umbrales (banda ±1, ventana mínima 4, estancamiento a
// las 3 apariciones consecutivas, retención de 30 días fuera de alcance de
// este motor) ni reinterpretarlas.
//
// Puro: fechaCiclo siempre llega como parámetro (IN-P1/BPS-022), nada lee
// Date.now(). No importa Supabase/React/Next/repositorios/Motor BPS. Recibe
// objetos, devuelve objetos — el paso 7 "Persistencia" del pipeline (06) es
// literalmente "empaquetado para persistir", nunca escritura física (IN-P1),
// así que esta capa termina en el DTO de decisión, nunca más allá.
//
// Reglas de frontera negativas (PE-005 tempo inmutable; PE-018 nunca decide
// Track/Sistema; PE-023/024/025 nunca reciben dolor/fatiga/sueño crudos) se
// aplican por AUSENCIA en el contrato de tipos (tipos.ts no tiene un campo
// "tempo objetivo autorregulado" ni "dolor"/"fatiga"/"sueño" en ninguna
// entrada) — la prohibición está en la forma, no solo en un guard en runtime.
//
// Gap documentado, no inventado: PE-012 exige "gana la de menor magnitud de
// cambio" como árbitro GENERAL entre variables micro en conflicto, pero el
// Implementation Handbook (08) marca ese comparador como "bloqueante parcial
// — Architecture Review AR-008, no operacionalmente definido" fuera del único
// caso que el propio catálogo sí resuelve explícitamente (PE-002 precede a
// PE-001 dentro del mismo Slot, vía el techo de repeticiones — "doble
// progresión"). Se implementa ese caso concreto; para cualquier otro par de
// variables en conflicto simultáneo se devuelve el conflicto sin resolverlo
// (campo `conflictoNoResuelto`), en vez de inventar una función de magnitud
// cruzada (kg vs. segundos vs. series) que ningún handbook define.

import type {
  Aparicion,
  PrescripcionVigente,
  EntradaEvaluacionSlot,
  DecisionSlot,
  ResultadoPE,
  CambioPrescripcion,
  EstadoEstancamiento,
  EntradaEvaluacionMacro,
  DecisionMacro,
  EntradaRetrocesoMacro,
} from "./tipos";

// ── Paso 2 — Validación (06) ────────────────────────────────────────────────
function validar(entrada: EntradaEvaluacionSlot): ResultadoPE | null {
  if (entrada.veredictoRecovery == null) return { ok: false, error: "VEREDICTO_RECOVERY_AUSENTE" };

  for (let i = 1; i < entrada.ventana.length; i++) {
    if (entrada.ventana[i].fecha < entrada.ventana[i - 1].fecha) return { ok: false, error: "VENTANA_DESORDENADA" };
  }
  const ultima = entrada.ventana.at(-1);
  if (ultima && entrada.fechaCiclo < ultima.fecha) return { ok: false, error: "FECHA_ANTERIOR_A_ULTIMA_APARICION" };

  const p = entrada.prescripcionVigente;
  if (p && ((p.rir !== null && p.rir < 0) || (p.rpeObjetivo !== null && (p.rpeObjetivo < 0 || p.rpeObjetivo > 10)))) {
    return { ok: false, error: "PRESCRIPCION_INCOHERENTE", detalle: p };
  }
  if (p && p.rpeObjetivo !== null && p.rir !== null) return { ok: false, error: "SISTEMA_ESFUERZO_MIXTO" };

  return null; // válida — continúa el pipeline
}

// ── PE-021 / PE-022 — Aparición evaluable ───────────────────────────────────
function esEvaluable(a: Aparicion): boolean {
  return a.cumplida && !a.eventoInesperado;
}

function sostiene(slotId: string, razon: string, contexto: Record<string, unknown>, estadoEstancamiento: EstadoEstancamiento): DecisionSlot {
  return { tipo: "sostiene", slotId, razones: [razon], contexto, cambios: [], estadoEstancamiento };
}

// ── PE-007/PE-019 (RPE) y PE-008/PE-020 (RIR) — banda ±1 ────────────────────
function enBandaRPE(reportado: number, objetivo: number): "en_banda" | "bajo_banda" | "sobre_banda" {
  if (reportado < objetivo - 1) return "bajo_banda";
  if (reportado > objetivo + 1) return "sobre_banda";
  return "en_banda";
}
function enBandaRIR(reportado: number, objetivo: number): "en_banda" | "bajo_banda" | "sobre_banda" {
  // Espejo de RPE (PE-008): RIR reportado MENOR que el objetivo = esfuerzo mayor al esperado (equivalente a "sobre_banda" de esfuerzo).
  if (reportado < objetivo - 1) return "sobre_banda";
  if (reportado > objetivo + 1) return "bajo_banda";
  return "en_banda";
}

// ── evaluarSlot() — el pipeline completo (06) para un Slot ──────────────────
export function evaluarSlot(entrada: EntradaEvaluacionSlot): ResultadoPE {
  const errorValidacion = validar(entrada);
  if (errorValidacion) return errorValidacion;

  const { slotId, ventana, prescripcionVigente, veredictoRecovery, cadena, estadoEstancamiento } = entrada;

  // Nivel 1 (05) — PE-026: Recovery es terminal, ninguna otra regla se evalúa.
  // Bajo la forma canónica reconciliada (IMP-ADR-01/API-ADR-02, importada de
  // engines/recovery/tipos.ts), procede:false ES la señal de descarga — no
  // existe un campo "tipo" independiente que distinguir. PE-034 (deload
  // reactivo) es la ejecución de este mismo veredicto sin re-decidir nada;
  // `subtipo` solo distingue programada/reactiva para el contexto del evento.
  //
  // Gap documentado, no inventado: PE-034 ("el motor aplica la reducción que
  // Recovery indique") y PE-038 ("duración indicada por Recovery") presuponen
  // que el veredicto trae una magnitud/duración — pero la forma canónica
  // (IMP-ADR-01) solo tiene {procede, subtipo?, razon}, sin esos campos. Este
  // motor no puede "aplicar la reducción que Recovery indique" porque esa
  // información no existe en el DTO oficial que recibe — se documenta el
  // veredicto tal cual llega, sin inventar una magnitud ni un campo nuevo.
  if (!veredictoRecovery.procede) {
    return {
      ok: true,
      decision: sostiene(
        slotId,
        veredictoRecovery.subtipo === "reactiva"
          ? "PE-034: deload reactivo indicado por Recovery — se ejecuta sin cuestionar el veredicto"
          : "PE-026/PE-033: veredicto de Recovery no favorable (descarga programada)",
        { subtipo: veredictoRecovery.subtipo ?? null, razonRecovery: veredictoRecovery.razon, magnitudDisponible: false },
        estadoEstancamiento
      ),
    };
  }

  // Slot nuevo (04, "Prescripción vigente null en Slot nuevo") — no es error, usa default de cadena; no hay progresión este ciclo.
  if (prescripcionVigente === null) {
    return { ok: true, decision: sostiene(slotId, "Slot nuevo — usa default de cadena, sin progresión este ciclo", {}, estadoEstancamiento) };
  }

  // Apariciones evaluables de este Slot (PE-021/022).
  const evaluables = ventana.filter(esEvaluable);
  const excluidas = ventana.length - evaluables.length;

  // Nivel 3 (05) — Estancamiento confirmado (PE-027/028) gana sobre progresión normal.
  if (estadoEstancamiento.confirmado) {
    return evaluarEscaleraEstancamiento(slotId, estadoEstancamiento, prescripcionVigente);
  }

  // ── Nivel 4 — Progresión normal (microprogresión, PE-001–012) ────────────
  const ultimasDos = evaluables.slice(-2);
  // "Bajo objetivo" estricto (no solo fuera de banda) dispara PE-001/002 — PE-007 solo clasifica banda; el disparo de progresión exige tendencia consistente por debajo, no meramente "en banda".
  const tendenciaBajoObjetivo =
    ultimasDos.length === 2 &&
    ultimasDos.every((a) => a.rpeReportado !== undefined && prescripcionVigente.rpeObjetivo !== null && a.rpeReportado <= prescripcionVigente.rpeObjetivo - 1);

  let decision: DecisionSlot | null = null;

  if (tendenciaBajoObjetivo && prescripcionVigente.repeticiones !== null && prescripcionVigente.repeticionesTecho !== null) {
    const enTecho = prescripcionVigente.repeticiones >= prescripcionVigente.repeticionesTecho;

    if (!enTecho) {
      // PE-002 — doble progresión: repeticiones antes que carga.
      decision = {
        tipo: "avanza",
        slotId,
        razones: ["PE-002: RPE bajo objetivo 2 apariciones consecutivas, dentro del rango de repeticiones"],
        contexto: { rpeReportados: ultimasDos.map((a) => a.rpeReportado) },
        cambios: [{ campo: "repeticiones", valorAnterior: prescripcionVigente.repeticiones, valorNuevo: prescripcionVigente.repeticiones + 1 }],
        estadoEstancamiento: { ...estadoEstancamiento, contadorCandidatura: 0, escalonAplicado: 0 },
      };
    } else if (cadena.tipoSlot === "patron_corporal") {
      // PE-003 — techo alcanzado, patrón corporal → avanza eslabón de cadena.
      if (cadena.eslabonSiguiente) {
        decision = {
          tipo: "avanza",
          slotId,
          razones: ["PE-003: techo de repeticiones alcanzado con RPE bajo objetivo — avanza eslabón"],
          contexto: { eslabonSiguiente: cadena.eslabonSiguiente },
          cambios: [{ campo: "eslabon", valorAnterior: null, valorNuevo: cadena.eslabonSiguiente }],
          estadoEstancamiento: { ...estadoEstancamiento, contadorCandidatura: 0, escalonAplicado: 0 },
        };
      } else if (cadena.admiteCargaEnTope) {
        // Contraejemplo documentado de PE-003: sin eslabón siguiente, se degrada a PE-001 dentro del mismo eslabón.
        decision = {
          tipo: "avanza",
          slotId,
          razones: ["PE-003 degradado a PE-001: tope de cadena sin eslabón siguiente, el ejercicio admite carga añadida"],
          contexto: {},
          cambios: [{ campo: "peso", valorAnterior: prescripcionVigente.peso, valorNuevo: null }],
          estadoEstancamiento: { ...estadoEstancamiento, contadorCandidatura: 0, escalonAplicado: 0 },
        };
      }
      // Si no admite carga en tope: no hay decisión de avance — cae a "sin cambio" abajo (PE-027 lo contará como candidato).
    } else {
      // PE-001 — techo alcanzado, carga externa → sube carga.
      decision = {
        tipo: "avanza",
        slotId,
        razones: ["PE-001: techo de repeticiones alcanzado con RPE bajo objetivo 2 apariciones consecutivas — sube carga"],
        contexto: { rpeReportados: ultimasDos.map((a) => a.rpeReportado) },
        cambios: [{ campo: "peso", valorAnterior: prescripcionVigente.peso, valorNuevo: null }], // magnitud exacta: decisión de producto fuera de este catálogo (PE-001, "justificación")
        estadoEstancamiento: { ...estadoEstancamiento, contadorCandidatura: 0, escalonAplicado: 0 },
      };
    }
  }

  // PE-007 — "fuera de banda... consistentemente alto" → retención (nunca reduce lo ya prescrito, solo no progresa).
  if (!decision) {
    const consistentementeSobreBanda =
      ultimasDos.length === 2 &&
      ultimasDos.every((a) => a.rpeReportado !== undefined && prescripcionVigente.rpeObjetivo !== null && enBandaRPE(a.rpeReportado, prescripcionVigente.rpeObjetivo) === "sobre_banda");
    if (consistentementeSobreBanda) {
      decision = sostiene(
        slotId,
        "PE-007: RPE consistentemente sobre banda (±1) — retención, sin progresión",
        { rpeReportados: ultimasDos.map((a) => a.rpeReportado) },
        estadoEstancamiento
      );
    }
  }

  // PE-006 — descanso por RIR reportado (independiente de la progresión de carga/reps — puede coexistir).
  const ultimaConRIR = evaluables.at(-1);
  if (ultimaConRIR?.rirReportado !== undefined && prescripcionVigente.rir !== null && prescripcionVigente.descanso !== null) {
    const banda = enBandaRIR(ultimaConRIR.rirReportado, prescripcionVigente.rir);
    if (banda === "sobre_banda") {
      const cambioDescanso: CambioPrescripcion = { campo: "descanso", valorAnterior: prescripcionVigente.descanso, valorNuevo: null };
      if (decision) {
        decision.cambios.push(cambioDescanso);
        decision.razones.push("PE-006: RIR reportado bajo objetivo — descanso sube");
      } else {
        decision = {
          tipo: "avanza",
          slotId,
          razones: ["PE-006: RIR reportado bajo objetivo — descanso sube"],
          contexto: { rirReportado: ultimaConRIR.rirReportado },
          cambios: [cambioDescanso],
          estadoEstancamiento: { ...estadoEstancamiento, contadorCandidatura: 0, escalonAplicado: 0 },
        };
      }
    }
  }

  if (decision) return { ok: true, decision };

  // Ninguna regla de progresión disparó este ciclo — nivel 3: actualizar contador de estancamiento (PE-027/029/030).
  const nuevoEstado = actualizarContadorEstancamiento(estadoEstancamiento, evaluables.length > 0, excluidas > 0);
  return {
    ok: true,
    decision: sostiene(slotId, "Sin señal de progresión en banda este ciclo", { apariciones: ventana.length, excluidas }, nuevoEstado),
  };
}

// ── PE-027/PE-029/PE-030 — contador de candidatura a estancamiento ─────────
function actualizarContadorEstancamiento(estado: EstadoEstancamiento, huboEvaluable: boolean, huboExcluida: boolean): EstadoEstancamiento {
  if (huboExcluida) {
    // PE-029 — no-intento no es estancamiento: reinicia el contador.
    return { ...estado, contadorCandidatura: 0 };
  }
  if (!huboEvaluable) {
    // PE-030 — hueco (Slot no programado): contador en pausa, no reinicia ni avanza.
    return estado;
  }
  const contador = estado.contadorCandidatura + 1;
  // PE-027/028 — 3 apariciones evaluables consecutivas sin avance → candidato, y como son estrictamente consecutivas (sin exclusión intermedia por construcción de esta función), confirmado en el mismo momento.
  return { ...estado, contadorCandidatura: contador, confirmado: contador >= 3 };
}

// ── PE-031 — Escalera de acciones ante estancamiento confirmado ────────────
function evaluarEscaleraEstancamiento(slotId: string, estado: EstadoEstancamiento, prescripcion: PrescripcionVigente): ResultadoPE {
  const siguienteEscalon = ((estado.escalonAplicado + 1) as 1 | 2 | 3);

  if (siguienteEscalon === 1) {
    return {
      ok: true,
      decision: {
        tipo: "sostiene",
        slotId,
        razones: ["PE-031 escalón 1: estancamiento confirmado — variar variable secundaria (descanso)"],
        contexto: {},
        cambios: [{ campo: "descanso", valorAnterior: prescripcion.descanso, valorNuevo: null }],
        estadoEstancamiento: { ...estado, escalonAplicado: 1 },
      },
    };
  }
  if (siguienteEscalon === 2) {
    return {
      ok: true,
      decision: {
        tipo: "sostiene",
        slotId,
        razones: ["PE-031 escalón 2: estancamiento persiste — sugiere deload preventivo (PE-035, no vinculante)"],
        contexto: {},
        cambios: [],
        estadoEstancamiento: { ...estado, escalonAplicado: 2 },
        sugerenciaDeloadPreventivo: true,
      },
    };
  }
  // siguienteEscalon === 3
  return {
    ok: true,
    decision: {
      tipo: "retrocede",
      slotId,
      razones: ["PE-031 escalón 3: estancamiento persiste tras deload — retrocede eslabón de cadena (nunca escalón macro, PE-017 es un mecanismo independiente)"],
      contexto: {},
      cambios: [{ campo: "eslabon", valorAnterior: null, valorNuevo: "anterior" }],
      estadoEstancamiento: { ...estado, escalonAplicado: 3 },
    },
  };
}

/** PE-032 — limpia el flag de estancamiento en cuanto una Aparición evaluable produce avance. Se llama tras un `avanza` real, no dentro de evaluarSlot (que ya no vuelve a entrar a la escalera una vez confirmado hasta que el llamador aplique esta limpieza). Siempre el mismo reset — no depende del estado previo. */
export function limpiarEstancamientoTrasAvance(): EstadoEstancamiento {
  return { contadorCandidatura: 0, confirmado: false, escalonAplicado: 0 };
}

// ── PE-036 — Cancelación de deload programado/preventivo ───────────────────
export function cancelarDeloadSiAplica(input: { tipoDeloadPendiente: "programado" | "preventivo"; veredictoRecoveryActualizado: boolean; estancamientoActivo: boolean }): boolean {
  // Un deload reactivo (PE-034) NUNCA es cancelable por este motor — no está en el dominio de esta función por diseño (solo recibe "programado"|"preventivo").
  return input.veredictoRecoveryActualizado && !input.estancamientoActivo;
}

// ── PE-037 — Prioridad entre tipos de deload coincidentes ──────────────────
export function resolverTipoDeload(candidatos: { reactivo: boolean; programado: boolean; preventivo: boolean }): "reactivo" | "programado" | "preventivo" | null {
  if (candidatos.reactivo) return "reactivo";
  if (candidatos.programado) return "programado";
  if (candidatos.preventivo) return "preventivo";
  return null;
}

// ── PE-038/PE-039 — duración y reincorporación ──────────────────────────────
export function duracionDeload(tipo: "reactivo" | "programado" | "preventivo", duracionIndicadaPorRecovery?: number): number {
  if (tipo === "reactivo" && duracionIndicadaPorRecovery !== undefined) return duracionIndicadaPorRecovery;
  return 1; // PE-038 — todo deload dura 1 Microciclo salvo indicación explícita de Recovery para el reactivo.
}

export function reincorporarPostDeload(prescripcionPreviaAlDeload: PrescripcionVigente): PrescripcionVigente {
  // PE-039 — vuelve exactamente al valor previo, nunca al reducido ni con compensación.
  return { ...prescripcionPreviaAlDeload };
}

// ── evaluarMacro() — PE-013–017 (jerarquía Microciclo→Mesociclo→Bloque→Nivel) ─
export function evaluarMacro(entrada: EntradaEvaluacionMacro): DecisionMacro {
  const { escalon, decisionesEscalonInferior, tamanoVentana, esUltimoEscalonDisponible, techoVolumenAlcanzado } = entrada;

  // Nivel 2 (05) — IN-P3: mínimo 4 apariciones para cualquier decisión macro.
  if (escalon === "microciclo" && (tamanoVentana ?? 0) < 4) {
    return { tipo: "sostiene", escalon, razones: ["VENTANA_INSUFICIENTE: mínimo 4 apariciones (IN-P3)"], contexto: { tamanoVentana }, esRecomendacionNoVinculante: false };
  }

  if (escalon === "microciclo") {
    // PE-013 — avanza si el patrón de la ventana está en banda (sin retroceso, sin sostiene forzado por otras reglas).
    const huboRetroceso = decisionesEscalonInferior.includes("sostiene");
    return huboRetroceso
      ? { tipo: "sostiene", escalon, razones: ["PE-013: patrón de la ventana no sostenido"], contexto: {}, esRecomendacionNoVinculante: false }
      : { tipo: "avanza", escalon, razones: ["PE-013: cumplimiento y RPE en banda"], contexto: {}, esRecomendacionNoVinculante: false };
  }

  if (escalon === "mesociclo") {
    // PE-014 — avanza si a lo sumo 1 "sostiene" en la ventana completa de Microciclos.
    const sostienes = decisionesEscalonInferior.filter((d) => d === "sostiene").length;
    if (sostienes <= 1 || techoVolumenAlcanzado) {
      return {
        tipo: "avanza",
        escalon,
        razones: techoVolumenAlcanzado ? ["PE-010/014: techo de volumen alcanzado — evidencia adicional de avance"] : ["PE-014: máximo 1 sostiene en la ventana"],
        contexto: { sostienes },
        esRecomendacionNoVinculante: false,
      };
    }
    return { tipo: "sostiene", escalon, razones: ["PE-014: más de 1 sostiene en la ventana de Microciclos"], contexto: { sostienes }, esRecomendacionNoVinculante: false };
  }

  if (escalon === "bloque") {
    // PE-015 — mismo mecanismo que PE-014, un nivel arriba: todos los Mesociclos deben haber avanzado.
    const todosAvanzaron = decisionesEscalonInferior.every((d) => d === "avanza");
    return todosAvanzaron
      ? { tipo: "avanza", escalon, razones: ["PE-015: todos los Mesociclos del Bloque avanzaron"], contexto: {}, esRecomendacionNoVinculante: false }
      : { tipo: "sostiene", escalon, razones: ["PE-015: al menos un Mesociclo del Bloque no avanzó"], contexto: {}, esRecomendacionNoVinculante: false };
  }

  // escalon === "nivel" — PE-016: recomendación, nunca escritura directa (el Motor BPS decide).
  if (esUltimoEscalonDisponible) {
    return { tipo: "sostiene", escalon, razones: ["PE-016: Nivel máximo del Sistema — sostiene, continúa refinando (PE-018: nunca recomienda Track/Sistema)"], contexto: {}, esRecomendacionNoVinculante: true };
  }
  const todosAvanzaron = decisionesEscalonInferior.every((d) => d === "avanza");
  return todosAvanzaron
    ? { tipo: "avanza", escalon, razones: ["PE-016: último Bloque del Nivel completado con avance sostenido — RECOMENDACIÓN, el Motor BPS aplica la transición"], contexto: {}, esRecomendacionNoVinculante: true }
    : { tipo: "sostiene", escalon, razones: ["PE-016: Bloque aún no completado con avance sostenido"], contexto: {}, esRecomendacionNoVinculante: true };
}

// ── PE-017 — Retroceso de escalón por incumplimiento sostenido ─────────────
export function evaluarRetroceso(entrada: EntradaRetrocesoMacro): DecisionMacro | null {
  if (entrada.deloadActivoEnVentana) return null; // contraejemplo documentado — no cuenta como retroceso
  const [c1, c2] = entrada.cumplimientoUltimosDosMicrociclos;
  if (c1 < entrada.umbralMinimo && c2 < entrada.umbralMinimo) {
    return {
      tipo: "sostiene", // el "retroceso" mueve el puntero -1, pero no es una salida de tipo Slot (avanza/sostiene/retrocede) — se modela como evento propio, no como TipoDecisionMacro (que solo tiene avanza/sostiene, 09)
      escalon: "microciclo",
      razones: ["PE-017: cumplimiento bajo el umbral en 2 Microciclos consecutivos — retrocede 1 escalón (nunca más de uno)"],
      contexto: { cumplimiento: [c1, c2], umbralMinimo: entrada.umbralMinimo },
      esRecomendacionNoVinculante: false,
    };
  }
  return null;
}
