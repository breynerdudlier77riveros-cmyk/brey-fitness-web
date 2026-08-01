// ── Ciclo semanal — orquestación oficial (capa Application) ─────────────────
// Traduce paso a paso el Tramo 2 del pipeline del Motor BPS Handbook (07) y
// el pseudocódigo `cicloSemanal` del Architecture Handbook (07), en su orden
// exacto y sin ramas alternativas (IN-7). El orden NO se altera en ningún
// punto; la única diferencia con el diagrama es de CARGA DE DATOS, no de
// decisión: el Perfil se lee antes del paso 1 porque el estado de la FSM se
// DERIVA de sus punteros + los eventos (no existe columna de estado — ver
// estado.ts), y el paso 1 necesita ese estado para decidir. La secuencia de
// decisiones queda intacta.
//
// Por qué esto es un Application Service y no una Server Action más: el
// Engineering Handbook (04, BE-02) fija el umbral para crear la capa en
// "cuando un caso de uso orqueste ≥2 repositorios con lógica de coordinación
// no trivial". Este ciclo orquesta CUATRO repositorios (profile, progression,
// workouts, diagnostico) y los cuatro motores — el umbral documentado se
// cumple por primera vez. No es arquitectura inventada: es la capa que el
// propio handbook manda crear en este escenario.
//
// Reglas estructurales que este archivo respeta:
//   · Cero Supabase directo — el SupabaseClient solo se pasa a repositorios.
//   · Cero estado mutable compartido, cero variables globales: todo el estado
//     del ciclo vive en variables locales de la función.
//   · Los motores se invocan como funciones puras y NO se modifican.
//   · R-M4/BPS-007: Recovery SIEMPRE antes que Progression; si Recovery exige
//     descarga, Progression no se consulta en absoluto (paso 8).

import type { SupabaseClient } from "@supabase/supabase-js";

import { getProfile } from "@/lib/profile/repository";
import { getEventos } from "@/lib/progression/repository";
import { getDiagnosisVigente } from "@/lib/diagnostico/repository";
import { getWorkoutLogs, getWorkoutsEnRango, insertWorkouts } from "@/lib/workouts/repository";

import { pausar, finalizar } from "@/lib/engines/bps/motor";
import { calcularVeredicto } from "@/lib/engines/recovery/motor";
import { evaluarMacro } from "@/lib/engines/progression/motor";
import { generarSemana } from "@/lib/engines/workout/motor";
import type { TipoDecisionSlot } from "@/lib/engines/progression/tipos";
import type { EstadoUsuarioBPS } from "@/lib/engines/bps/tipos";

import { derivarEstadoBPS } from "./estado";
import { persistirEvento, desdeEventoBPS, type EventoParaPersistir } from "./eventos";
import type { EntradaCiclo, ResultadoCiclo, SesionPlantilla } from "./tipos";
import type { EjercicioPlan, Profile, Workout } from "@/lib/types";

const DIAS_INACTIVIDAD_AUTOPAUSA = 21; // BPS-025

/**
 * Gate de Perfil deportivo (BPS-004): días + lugar + zonas declaradas.
 * "declarado ≠ ausente" — un usuario que declara "ninguna lesión" PASA el
 * gate; el campo vacío/nulo NO pasa. BPS-020 exige nombrar exactamente qué
 * falta.
 *
 * ⚠ Esta regla vive aquí y no en el Motor BPS porque el Sprint 4 fijó la
 * superficie del motor en activar/pausar/reanudar/finalizar/cancelar/
 * estadoActual/transiciones y no incluyó una función de gate — y este Sprint
 * prohíbe modificar los motores. Queda documentado como deuda de ubicación
 * en el informe: es una regla de dominio ejecutándose en la capa Application.
 */
export function camposFaltantesDelGate(perfil: Profile): string[] {
  const faltantes: string[] = [];
  if (perfil.dias_por_semana === null) faltantes.push("dias_por_semana");
  if (perfil.lugar_entrenamiento === null) faltantes.push("lugar_entrenamiento");
  if (perfil.lesiones === null) faltantes.push("lesiones");
  return faltantes;
}

function diasEntre(desdeISO: string, hastaISO: string): number {
  const MS_POR_DIA = 86_400_000;
  return Math.floor((Date.parse(hastaISO) - Date.parse(desdeISO)) / MS_POR_DIA);
}

/** Eventos de decisión del Progression Engine → la forma que `evaluarMacro` consume. */
function aDecisionesDeSlot(tipos: readonly string[]): TipoDecisionSlot[] {
  const decisiones: TipoDecisionSlot[] = [];
  for (const tipo of tipos) {
    if (tipo === "avanza" || tipo === "sostiene" || tipo === "retrocede") decisiones.push(tipo);
  }
  return decisiones;
}

export async function ejecutarCicloSemanal(
  supabase: SupabaseClient,
  userId: string,
  entrada: EntradaCiclo
): Promise<ResultadoCiclo> {
  const { fecha, versionCatalogo, plantilla } = entrada; // Paso 0 — parámetros, nunca defaults (BPS-022/023)

  // ── Carga de datos previa (no es una decisión del pipeline) ──────────────
  const perfil = await getProfile(supabase, userId);
  if (!perfil) {
    // Mapa de fallos del pipeline, paso 2: Perfil ilegible → nunca generar con datos viejos (IN-6).
    return { estado: "error", error: "SISTEMA_NO_ACTIVO", detalle: "Perfil ilegible", estadoBPS: "sin_diagnostico" };
  }

  // Replay completo para derivar el estado (IN-5). ⚠ El repositorio acota
  // toda lectura por diseño (Engineering Handbook 09: nunca sin límite) — un
  // usuario con más eventos que este tope tendría un replay incompleto.
  // Tensión documentada en el informe: IN-5 pide historia completa, el
  // Engineering Handbook prohíbe lecturas ilimitadas.
  const eventos = await getEventos(supabase, userId, { limit: 1000 });
  const diagnosisVigente = await getDiagnosisVigente(supabase, userId);
  const derivado = derivarEstadoBPS(eventos, perfil, diagnosisVigente !== null);
  let estadoBPS: EstadoUsuarioBPS = derivado.estado;

  // La reparación de un estado imposible nunca se silencia (P3/Motor BPS 05).
  if (derivado.anomalia) await persistirEvento(supabase, userId, desdeEventoBPS(derivado.anomalia));

  // ── Paso 1 — ¿Estado generativo? (BPS-013) ───────────────────────────────
  if (estadoBPS !== "activo" && estadoBPS !== "en_descarga") {
    return { estado: "sin_efectos", motivo: `Estado no generativo: ${estadoBPS} (BPS-013)`, estadoBPS };
  }

  // Paso 1 — BPS-009: Elite activa comercialmente pero el pipeline lo rechaza.
  if (perfil.sistema_actual === "elite") {
    return { estado: "error", error: "SISTEMA_SIN_JERARQUIA", detalle: { sistema: "elite" }, estadoBPS };
  }

  // ── Paso 2 — Perfil FRESCO (IN-6/BPS-005): ya leído arriba, sin caché ────
  // ── Paso 3 — ¿Gates OK? ──────────────────────────────────────────────────
  const faltantes = camposFaltantesDelGate(perfil);
  if (faltantes.length > 0) {
    // T7 → pendiente_perfil + PERFIL_INCOMPLETO con la lista exacta (BPS-020).
    await persistirEvento(supabase, userId, {
      tipo: "gate_fallado",
      origen: "motor_bps",
      razones: ["PERFIL_INCOMPLETO"],
      contexto: { gate: "perfil_deportivo", camposFaltantes: faltantes, de: estadoBPS, a: "pendiente_perfil" },
    });
    return { estado: "gate_fallado", error: "PERFIL_INCOMPLETO", camposFaltantes: faltantes, estadoBPS: "pendiente_perfil" };
  }

  // ── Paso 4 — ¿Inactividad ≥21 días? (BPS-025) ────────────────────────────
  // Deliberadamente ANTES de consultar a los motores: con 21 días sin logs la
  // ventana estaría vacía y sus veredictos serían ruido (Motor BPS 07).
  const ultimosLogs = await getWorkoutLogs(supabase, userId, { limit: 1 });
  const ultimoLog = ultimosLogs.at(0);
  if (ultimoLog) {
    const diasSinLog = diasEntre(ultimoLog.fecha, fecha);
    if (diasSinLog >= DIAS_INACTIVIDAD_AUTOPAUSA) {
      const transicion = pausar({ estadoActual: estadoBPS, motivo: "inactividad", diasSinLog });
      if (transicion.ok) {
        for (const evento of transicion.resultado.eventos) {
          await persistirEvento(supabase, userId, desdeEventoBPS(evento));
        }
        return { estado: "transicion", estadoBPS: transicion.resultado.estado, motivo: `T11 auto-pausa por inactividad (${diasSinLog} días)` };
      }
    }
  }

  // ── Paso 5 — Leer ventana de historial ───────────────────────────────────
  // El Motor lee datos crudos y los PASA; nunca los interpreta (BPS-019).
  const ventanaLogs = await getWorkoutLogs(supabase, userId, { limit: 30 });

  // ── Paso 6 — Recovery Engine → veredicto ─────────────────────────────────
  const veredicto = calcularVeredicto({ semanaEsDescargaProgramada: plantilla.esDescargaProgramada });

  // ── Paso 7 — ¿Exige descarga? ────────────────────────────────────────────
  if (!veredicto.procede) {
    // ── Paso 8 — T8 → en_descarga. Progression NO se consulta (IN-7/BPS-007).
    // La ausencia del evento de progresión esta semana es información auditable.
    estadoBPS = "en_descarga";
    await persistirEvento(supabase, userId, {
      tipo: veredicto.subtipo === "reactiva" ? "descarga_reactiva" : "descarga_programada",
      origen: "recovery_engine",
      razones: [veredicto.razon],
      contexto: { subtipo: veredicto.subtipo ?? null, de: "activo", a: "en_descarga" },
    });
  } else {
    // ── Paso 9 — Progression Engine → decisión ─────────────────────────────
    // Acotado al Microciclo vigente: pasar el historial completo haría que
    // cualquier "sostiene" antiguo bloqueara el avance para siempre (PE-013
    // evalúa "la ventana", no toda la vida del usuario).
    //
    // ⚠ LIMITACIÓN DOCUMENTADA: estas son las decisiones MACRO ya emitidas en
    // la ventana, no las decisiones por Slot que PE-013 realmente espera.
    // `evaluarSlot` (la evaluación micro que las produciría) exige Prescripción
    // vigente y Cadenas/capacidades: no existe tabla de prescripciones ni
    // Knowledge Base en el repositorio, así que la evaluación micro no es
    // invocable todavía. Se pasa lo único derivable de datos reales.
    const eventosDelMicrociclo = await getEventos(supabase, userId, { desde: plantilla.inicioISO });
    const decisionesPrevias = aDecisionesDeSlot(eventosDelMicrociclo.map((e) => e.tipo));
    const decisionMacro = evaluarMacro({
      escalon: "microciclo",
      decisionesEscalonInferior: decisionesPrevias,
      tamanoVentana: ventanaLogs.length,
    });

    // ── Paso 10 — Aplicar transición (avanza/sostiene/retrocede + evento) ──
    await persistirEvento(supabase, userId, {
      tipo: decisionMacro.tipo === "avanza" ? "avanza" : "sostiene",
      origen: "progression_engine",
      razones: decisionMacro.razones,
      contexto: { ...decisionMacro.contexto, escalon: decisionMacro.escalon, esRecomendacion: decisionMacro.esRecomendacionNoVinculante },
    });

    // T9 — si veníamos de descarga y Recovery ya no la exige, se cierra el microciclo de descarga.
    if (estadoBPS === "en_descarga") {
      estadoBPS = "activo";
      await persistirEvento(supabase, userId, {
        tipo: "transicion_estado",
        origen: "motor_bps",
        razones: ["Descarga completada"],
        contexto: { de: "en_descarga", a: "activo", transicion: "T9" },
      });
    }
  }

  // ── Paso 11 — ¿Fin del último Bloque? (T14/BPS-018) ─────────────────────
  if (plantilla.esFinDeUltimoBloque) {
    const cierre = finalizar({ estadoActual: "activo", ultimoBloqueDelSistemaCerrado: true });
    if (cierre.ok) {
      for (const evento of cierre.resultado.eventos) {
        await persistirEvento(supabase, userId, desdeEventoBPS(evento));
      }
      return { estado: "transicion", estadoBPS: cierre.resultado.estado, motivo: "T14 — último Bloque del Sistema terminado" };
    }
  }

  // ── Paso 12 — ¿Semana ya generada? (idempotencia, BPS-014) ──────────────
  const yaGenerada = await getWorkoutsEnRango(supabase, userId, plantilla.inicioISO, plantilla.finISO);
  if (yaGenerada.length > 0) {
    // SEMANA_YA_GENERADA no es un fallo para el usuario: se devuelve la existente.
    return { estado: "semana_ya_generada", workouts: yaGenerada, estadoBPS };
  }

  // ── Paso 13 — Invocar Generator ──────────────────────────────────────────
  const generacion = generarSemana({
    sesiones: plantilla.sesiones.map((s) => s.plan),
    duracionSesionMin: perfil.duracion_sesion_min ?? 0,
    veredictoRecovery: veredicto,
    versionCatalogo,
  });

  if (!generacion.ok) {
    // CATALOGO_INSUFICIENTE se propaga con detalle, jamás se parchea (BPS-021).
    return { estado: "error", error: "CATALOGO_INSUFICIENTE", detalle: generacion.detalle, estadoBPS };
  }

  const filas = generacion.sesiones.map((sesion) => {
    const meta = plantilla.sesiones.find((s) => s.plan.fecha === sesion.fecha);
    return {
      system_slug: perfil.sistema_actual,
      nombre: meta?.nombre ?? plantilla.microcicloId,
      semana: meta?.semana ?? null,
      semana_total: meta?.semanaTotal ?? null,
      fecha_planificada: sesion.fecha,
      duracion_estimada_min: sesion.duracionEstimadaMin,
      ejercicios: sesion.slots.map(aEjercicioPlan),
      estado: "planificado" as const,
    };
  });

  // El batch semanal es transaccional — todo o nada (Motor BPS 07, mapa de fallos).
  const workouts: Workout[] = await insertWorkouts(supabase, userId, filas);

  // ── Paso 14 — Evento semana_generada (BPS-023) ──────────────────────────
  const eventoGeneracion: EventoParaPersistir = {
    tipo: generacion.evento.tipo,
    origen: "workout_generator",
    razones: ["Semana generada"],
    contexto: {
      versionCatalogo: generacion.evento.versionCatalogo,
      tipoSemana: generacion.evento.tipoSemana,
      microciclo: plantilla.microcicloId,
      sesionesExcedenTiempoDeclarado: generacion.sesiones.filter((s) => s.excedeTiempoDeclarado).map((s) => s.fecha),
    },
  };
  await persistirEvento(supabase, userId, eventoGeneracion);

  return { estado: "generada", workouts, estadoBPS };
}

/**
 * SlotGenerado (Workout Generator) → EjercicioPlan (forma oficial del jsonb
 * `workouts.ejercicios`).
 *
 * ⚠ PÉRDIDA DE INFORMACIÓN DOCUMENTADA: el Architecture Handbook (08) exige
 * que cada fila sea autocontenida con "patrón, rol, ejercicio (slug +
 * nombre), series, reps/duración, RPE objetivo, descanso, tempo (si aplica),
 * notas", pero el DTO oficial `EjercicioPlan` solo tiene
 * {nombre, series, reps, peso?, intensidad?}. patrón, rol, slug, modalidad,
 * descanso, tempo y notas NO tienen destino. Se mapea lo que cabe (el RPE
 * objetivo viaja en `intensidad`, único campo textual disponible) y se
 * reporta la brecha — cambiar `EjercicioPlan` sería modificar un DTO oficial,
 * prohibido en este Sprint.
 */
function aEjercicioPlan(slot: { ejercicio: { nombre: string }; series: number; reps: string; rpe: number }): EjercicioPlan {
  return { nombre: slot.ejercicio.nombre, series: slot.series, reps: slot.reps, intensidad: `RPE ${slot.rpe}` };
}

/** Reexport para las Server Actions — evita que importen el tipo desde dos sitios. */
export type { SesionPlantilla };
