// ── Motor BPS (Domain Engine, puro) ─────────────────────────────────────────
// Fuente exclusiva: Domain Model Handbook 10, Implementation Handbook 08,
// Architecture Handbook 07 — que remite textualmente a "Motor BPS Handbook
// T3–T7, T14" y "(05)" para la tabla exhaustiva de transiciones, por lo que
// esa tabla (motor-bps/05) y el catálogo de reglas BPS-001..025 (motor-bps/09)
// se leyeron como la fuente de detalle que los tres handbooks nombrados
// citan, no como una fuente alternativa (jerarquía intacta: ante conflicto,
// Domain Model > Implementation > Architecture Handbook seguiría ganando —
// no se encontró ninguno).
//
// Puro: nada aquí lee Date.now() (BPS-022 — la fecha/duración es SIEMPRE
// parámetro explícito), nada importa Supabase/React/Next/repositorios. Cada
// función recibe objetos, devuelve objetos.
//
// Alcance: la MÁQUINA DE ESTADOS del usuario (8 estados, 15 transiciones).
// NO incluye cicloSemanal completo (Architecture Handbook 07, pseudocódigo):
// ese orquestador lee Perfil fresco vía repositorio (I/O) e invoca a los
// otros 3 motores — es responsabilidad de la capa Application (fuera de
// este Sprint, que exige motores sin repositorios).

import type { EstadoUsuarioBPS, TransicionBPS, EventoBPS, ResultadoBPS } from "./tipos";
import type { SistemaSlug } from "@/lib/types";

// ── Tabla de transiciones — dato literal de Motor BPS Handbook 05 ──────────
// "Sin modificar ninguna transición": las 15 filas, tal cual.
export const TRANSICIONES: readonly TransicionBPS[] = [
  { id: "T1", de: "sin_diagnostico", a: "diagnosticado", evento: "diagnostico_completado", guard: "Resultado válido (03/V-1)" },
  { id: "T2", de: "diagnosticado", a: "diagnosticado", evento: "diagnostico_retoma", guard: "—" },
  { id: "T3", de: "diagnosticado", a: "pendiente_perfil", evento: "compra_confirmada", guard: "transaccionId nuevo; sistema disponible; resultado vigente" },
  { id: "T4", de: "sin_diagnostico", a: "pendiente_diagnostico", evento: "compra_confirmada", guard: "Ídem T3; sin resultado vigente" },
  { id: "T5", de: "pendiente_diagnostico", a: "pendiente_perfil", evento: "diagnostico_completado", guard: "Resultado válido" },
  { id: "T6", de: "pendiente_perfil", a: "activo", evento: "perfil_actualizado", guard: "3 campos de gate presentes (03/G2)" },
  { id: "T7", de: "activo", a: "pendiente_perfil", evento: "gate_perfil_roto", guard: "Algún campo de gate ausente" },
  { id: "T8", de: "activo", a: "en_descarga", evento: "recovery_exige_descarga", guard: "exigeDescarga.si" },
  { id: "T9", de: "en_descarga", a: "activo", evento: "descarga_completada", guard: "Cierre del microciclo de descarga" },
  { id: "T10", de: "activo", a: "en_pausa", evento: "lesion_o_pausa_voluntaria", guard: "—" },
  { id: "T11", de: "activo", a: "en_pausa", evento: "inactividad", guard: "≥21 días sin log (BPS-025)" },
  { id: "T12", de: "en_pausa", a: "activo", evento: "reanudacion", guard: "Pausa ≤ 30 días" },
  { id: "T13", de: "en_pausa", a: "activo", evento: "reanudacion", guard: "Pausa > 30 días → retroceso propuesto" },
  { id: "T14", de: "activo", a: "sistema_completado", evento: "ultimo_bloque_cerrado", guard: "Último Microciclo del último Bloque cerrado" },
  { id: "T15a", de: "sistema_completado", a: "diagnosticado", evento: "diagnostico_completado", guard: "Re-diagnóstico" },
  { id: "T15b", de: "sistema_completado", a: "pendiente_perfil", evento: "compra_confirmada", guard: "Compra de otro Sistema" },
] as const;

/** Filas de TRANSICIONES cuyo origen es `de` — usado por estadoActual()/recomputarEstado() y por los guards defensivos de cada función. */
export function transicionesValidasDesde(de: EstadoUsuarioBPS): readonly TransicionBPS[] {
  return TRANSICIONES.filter((t) => t.de === de);
}

function transicionInvalida(de: EstadoUsuarioBPS, intentada: string): ResultadoBPS {
  // TRANSICION_NO_PERMITIDA no está en el catálogo Familia 4 del Motor BPS
  // Handbook (04): ese catálogo solo documenta errores alcanzables por un
  // flujo legítimo (p. ej. ACTIVACION_SIN_COMPRA se describe literalmente
  // como "no existe camino de código legítimo"). Como estas funciones son
  // totales (deben responder ante cualquier estado de entrada, no solo los
  // legítimos), se necesita un código defensivo para "el llamador pidió una
  // transición que no figura en la tabla de 05" — no es una regla de
  // negocio nueva, es la traducción directa de "transiciones inválidas"
  // (Domain Model 10) a un valor de retorno.
  return {
    ok: false,
    error: "TRANSICION_NO_PERMITIDA",
    detalle: { estadoActual: de, intentada, transicionesValidas: transicionesValidasDesde(de).map((t) => t.id) },
  };
}

// ── activar() — T3, T4, T5, T15b (BPS-001, BPS-002, BPS-003, BPS-008) ──────
export interface EntradaActivar {
  estadoActual: EstadoUsuarioBPS;
  transaccionId: string;
  sistemaComprado: SistemaSlug;
  /** null = sin resultado vigente para ESTE Sistema (nunca se traduce nivel entre Sistemas, motor-bps/06). */
  nivelEntradaVigente: string | null;
  /** BPS-008 / motor-bps/06 "caso límite": upgrade con Sistema ya activo. */
  sistemaPrevioActivo?: SistemaSlug | null;
}

export function activar(input: EntradaActivar): ResultadoBPS {
  const { estadoActual, transaccionId, sistemaComprado, nivelEntradaVigente, sistemaPrevioActivo } = input;

  // Caso límite (motor-bps/06): compra con Sistema ya activo → cierre
  // ordenado (motivo reemplazado_por_compra) + activación normal del nuevo.
  // Dos transiciones reales, dos eventos (BPS-010: uno por transición).
  if (estadoActual === "activo" && sistemaPrevioActivo && sistemaPrevioActivo !== sistemaComprado) {
    if (nivelEntradaVigente === null) {
      return { ok: false, error: "DIAGNOSTICO_REQUERIDO", detalle: { sistemaComprado } };
    }
    const cierre: EventoBPS = {
      tipo: "sistema_completado",
      origen: "motor_bps",
      razones: ["reemplazado_por_compra"],
      contexto: { sistemaAnterior: sistemaPrevioActivo, sistemaNuevo: sistemaComprado },
    };
    const activacion: EventoBPS = {
      tipo: "activacion",
      origen: "motor_bps",
      razones: ["compra_confirmada"],
      contexto: { transaccionId, sistema: sistemaComprado, nivelEntrada: nivelEntradaVigente },
    };
    return {
      ok: true,
      resultado: { estado: "pendiente_perfil", eventos: [cierre, activacion], sistemaActual: sistemaComprado, nivelActual: nivelEntradaVigente },
    };
  }

  const esOrigenValido =
    estadoActual === "diagnosticado" || estadoActual === "sin_diagnostico" || estadoActual === "sistema_completado";
  if (!esOrigenValido) return transicionInvalida(estadoActual, "activar (compra_confirmada)");

  // T4 — BPS-003: sin diagnóstico previo, la compra siempre espera (sin punteros).
  if (estadoActual === "sin_diagnostico") {
    const evento: EventoBPS = {
      tipo: "transicion_estado",
      origen: "motor_bps",
      razones: ["compra_confirmada_sin_diagnostico"],
      contexto: { transaccionId, sistema: sistemaComprado, de: "sin_diagnostico", a: "pendiente_diagnostico" },
    };
    return { ok: true, resultado: { estado: "pendiente_diagnostico", eventos: [evento] } };
  }

  // T3 (de diagnosticado) / T15b (de sistema_completado) — mismo destino y
  // forma de evento; lo único que las distingue es el origen, ya validado
  // arriba. BPS-003: sin resultado vigente PARA ESTE Sistema, no hay activación
  // directa — se exige re-diagnóstico ligero (motor-bps/06), que este motor
  // no resuelve por sí mismo (no re-evalúa Diagnósticos, BPS-021).
  if (nivelEntradaVigente === null) {
    return { ok: false, error: "DIAGNOSTICO_REQUERIDO", detalle: { estadoActual, sistemaComprado, motivo: "sin_resultado_vigente_para_sistema" } };
  }

  const evento: EventoBPS = {
    tipo: "activacion",
    origen: "motor_bps",
    razones: ["compra_confirmada"],
    contexto: { transaccionId, sistema: sistemaComprado, nivelEntrada: nivelEntradaVigente },
  };
  return { ok: true, resultado: { estado: "pendiente_perfil", eventos: [evento], sistemaActual: sistemaComprado, nivelActual: nivelEntradaVigente } };
}

/** Completa T5: pendiente_diagnostico → pendiente_perfil, al llegar el Diagnóstico que la compra esperaba (BPS-003). */
export function completarDiagnosticoEnEspera(input: {
  estadoActual: EstadoUsuarioBPS;
  transaccionId: string;
  sistemaComprado: SistemaSlug;
  nivelEntrada: string;
}): ResultadoBPS {
  if (input.estadoActual !== "pendiente_diagnostico") return transicionInvalida(input.estadoActual, "completarDiagnosticoEnEspera (T5)");
  const evento: EventoBPS = {
    tipo: "activacion",
    origen: "motor_bps",
    razones: ["diagnostico_completado_con_compra_en_espera"],
    contexto: { transaccionId: input.transaccionId, sistema: input.sistemaComprado, nivelEntrada: input.nivelEntrada },
  };
  return {
    ok: true,
    resultado: { estado: "pendiente_perfil", eventos: [evento], sistemaActual: input.sistemaComprado, nivelActual: input.nivelEntrada },
  };
}

// ── pausar() — T10, T11 (BPS-025) ───────────────────────────────────────────
export function pausar(input: {
  estadoActual: EstadoUsuarioBPS;
  motivo: "lesion" | "voluntaria" | "inactividad";
  /** Obligatorio si motivo="inactividad" — BPS-022: la fecha/duración es siempre parámetro, el motor nunca lee el reloj. */
  diasSinLog?: number;
}): ResultadoBPS {
  const { estadoActual, motivo, diasSinLog } = input;
  if (estadoActual !== "activo") return transicionInvalida(estadoActual, `pausar (${motivo})`);

  if (motivo === "inactividad" && (diasSinLog === undefined || diasSinLog < 21)) {
    // BPS-025: el guard (≥21 días) no se cumple — no es un T11 legítimo.
    return transicionInvalida(estadoActual, "pausar (inactividad, guard BPS-025 no satisfecho: <21 días)");
  }

  const evento: EventoBPS = {
    tipo: "pausa",
    origen: "motor_bps",
    razones: [motivo],
    contexto: motivo === "inactividad" ? { diasSinLog } : {},
  };
  return { ok: true, resultado: { estado: "en_pausa", eventos: [evento] } };
}

// ── reanudar() — T12, T13 (BPS-016) ─────────────────────────────────────────
export function reanudar(input: { estadoActual: EstadoUsuarioBPS; diasEnPausa: number }): ResultadoBPS {
  const { estadoActual, diasEnPausa } = input;
  if (estadoActual !== "en_pausa") return transicionInvalida(estadoActual, "reanudar");

  if (diasEnPausa <= 30) {
    const evento: EventoBPS = { tipo: "reanudacion", origen: "motor_bps", razones: ["reanudacion_estandar"], contexto: { diasEnPausa } };
    return { ok: true, resultado: { estado: "activo", eventos: [evento] } }; // T12
  }

  // T13 — BPS-016: propuesta ajustable de retroceso de 1 Mesociclo, NUNCA impuesta.
  const evento: EventoBPS = {
    tipo: "reanudacion",
    origen: "motor_bps",
    razones: ["reanudacion_tras_pausa_prolongada"],
    contexto: { diasEnPausa, propuesta: "retroceso_1_mesociclo" },
  };
  return { ok: true, resultado: { estado: "activo", eventos: [evento], propuesta: { retrocedeMesociclos: 1, ajustable: true } } };
}

// ── finalizar() — T14 (BPS-018) ─────────────────────────────────────────────
export function finalizar(input: { estadoActual: EstadoUsuarioBPS; ultimoBloqueDelSistemaCerrado: boolean; duracionRealSemanas?: number; duracionPlanificadaSemanas?: number }): ResultadoBPS {
  const { estadoActual, ultimoBloqueDelSistemaCerrado } = input;
  if (estadoActual !== "activo") return transicionInvalida(estadoActual, "finalizar");
  if (!ultimoBloqueDelSistemaCerrado) return transicionInvalida(estadoActual, "finalizar (guard BPS-018 no satisfecho: último Bloque no cerrado)");

  const evento: EventoBPS = {
    tipo: "sistema_completado",
    origen: "motor_bps",
    razones: ["ultimo_bloque_cerrado"],
    contexto: { duracionRealSemanas: input.duracionRealSemanas ?? null, duracionPlanificadaSemanas: input.duracionPlanificadaSemanas ?? null },
  };
  return { ok: true, resultado: { estado: "sistema_completado", eventos: [evento] } };
}

// ── cancelar() ───────────────────────────────────────────────────────────
// Reembolso/cancelación es "Frontera comercial abierta... el Motor NO
// improvisa una desactivación" (Motor BPS Handbook 06, tabla "Qué dispara la
// activación — y qué no"). No existe estado, transición, evento ni error
// oficial para esta operación en ningún handbook fuente. Implementarla como
// una transición real sería inventar una regla de negocio inexistente — lo
// fiel es que la función exista (el Sprint la pide) pero rehúse actuar,
// devolviendo exactamente esa ausencia de especificación como resultado.
export function cancelar(): ResultadoBPS {
  return {
    ok: false,
    error: "NO_ESPECIFICADO",
    detalle:
      "Reembolso/cancelación no está especificado en v1 (Motor BPS Handbook 06). El Motor no improvisa una desactivación — requiere una decisión de producto/ADR antes de poder implementarse.",
  };
}

// ── estadoActual() — detección y reparación de estados imposibles (05) ─────
export interface PunterosBPS {
  estadoDeclarado: EstadoUsuarioBPS;
  sistemaActual: SistemaSlug | null;
  nivelActual: string | null;
  tieneDiagnosisVigente: boolean;
  /** Solo relevante si estadoDeclarado === "en_descarga". */
  mesocicloVigenteExiste?: boolean;
}

export interface EstadoActualResultado {
  estado: EstadoUsuarioBPS;
  reparado: boolean;
  anomalia?: EventoBPS;
}

export function estadoActual(input: PunterosBPS): EstadoActualResultado {
  const { estadoDeclarado, sistemaActual, nivelActual, tieneDiagnosisVigente, mesocicloVigenteExiste } = input;

  // Fila 1: activo con sistema_actual null.
  if (estadoDeclarado === "activo" && sistemaActual === null) {
    const degradado: EstadoUsuarioBPS = tieneDiagnosisVigente ? "diagnosticado" : "sin_diagnostico";
    return {
      estado: degradado,
      reparado: true,
      anomalia: {
        tipo: "anomalia",
        origen: "motor_bps",
        razones: ["estado_imposible: activo con sistema_actual null"],
        contexto: { estadoDeclarado, degradadoA: degradado },
      },
    };
  }

  // Fila 2: activo/pendiente_perfil con nivel_actual null.
  if ((estadoDeclarado === "activo" || estadoDeclarado === "pendiente_perfil") && nivelActual === null) {
    return {
      estado: "pendiente_diagnostico",
      reparado: true,
      anomalia: {
        tipo: "anomalia",
        origen: "motor_bps",
        razones: ["estado_imposible: nivel_actual null en estado generativo/gate (violación BPS-003)"],
        contexto: { estadoDeclarado, degradadoA: "pendiente_diagnostico" },
      },
    };
  }

  // Fila 3: en_descarga sin Mesociclo vigente — "la instancia generada manda" (P5): no se degrada el estado.
  if (estadoDeclarado === "en_descarga" && mesocicloVigenteExiste === false) {
    return {
      estado: "en_descarga",
      reparado: false,
      anomalia: {
        tipo: "anomalia",
        origen: "motor_bps",
        razones: ["estado_imposible: en_descarga sin Mesociclo vigente — estructura de catálogo cambiada"],
        contexto: { estadoDeclarado },
      },
    };
  }

  return { estado: estadoDeclarado, reparado: false };
}

// ── recomputarEstado() — replay determinista (BPS-011, IN-5) ───────────────
// Traducción literal del pseudocódigo de motor-bps/05: misma secuencia de
// eventos → siempre el mismo estado. Nunca borra eventos (P3): los inválidos
// quedan marcados, no eliminados — por eso el resultado los expone en vez de
// lanzarlos como excepción (los motores nunca lanzan, IN-4/BPS-010).
export interface EventoReplay {
  evento: string;
  /** Estado destino que este evento produciría si la transición fuese válida — lo decide el productor del evento (fuera de este motor), aquí solo se valida contra TRANSICIONES. */
  aPropuesto: EstadoUsuarioBPS;
}

export interface ResultadoReplay {
  estadoFinal: EstadoUsuarioBPS;
  ignorados: Array<{ evento: string; motivo: string }>;
}

export function recomputarEstado(eventos: readonly EventoReplay[]): ResultadoReplay {
  let estado: EstadoUsuarioBPS = "sin_diagnostico";
  const ignorados: Array<{ evento: string; motivo: string }> = [];

  for (const e of eventos) {
    const valida = transicionesValidasDesde(estado).some((t) => t.a === e.aPropuesto);
    if (valida) {
      estado = e.aPropuesto;
    } else {
      ignorados.push({ evento: e.evento, motivo: `no hay transición ${estado} → ${e.aPropuesto} en la tabla` });
    }
  }

  return { estadoFinal: estado, ignorados };
}
