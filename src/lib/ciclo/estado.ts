// ── Derivación del estado BPS (capa Application) ────────────────────────────
// El estado de la FSM NO tiene columna propia en `profiles` (verificado
// contra supabase/schema.sql: solo existen sistema_actual y nivel_actual).
// Domain Model Handbook 10 lo dice explícitamente: "dado que Programa no
// tiene fila propia (13), su único estado real vive en
// profiles.sistema_actual/nivel_actual; la recuperación es siempre
// re-derivar desde esas columnas". Motor BPS Handbook 04, en cambio, lista
// el estado de la FSM como "Materializado + derivable de eventos (IN-5)" —
// contradicción documentada en el informe del Sprint; se resuelve por
// jerarquía (Domain Model > Motor BPS Handbook) y por el esquema real:
// SIEMPRE se deriva, nunca se lee de una columna.
//
// Esta derivación es orquestación pura de dos funciones YA existentes del
// Motor BPS (recomputarEstado + estadoActual, Sprint 4) — no reimplementa
// ninguna regla de la FSM ni modifica el motor.

import { recomputarEstado, estadoActual } from "@/lib/engines/bps/motor";
import type { EventoReplay } from "@/lib/engines/bps/motor";
import type { EstadoUsuarioBPS, EventoBPS } from "@/lib/engines/bps/tipos";
import type { EventoProgresion, TipoEvento, Profile } from "@/lib/types";

/**
 * Qué estado destino implica cada tipo de evento persistido, según la tabla
 * de transiciones T1–T15b (Motor BPS Handbook 05). Solo aparecen aquí los
 * tipos que SON transiciones de la FSM; los demás (avanza, sostiene,
 * semana_generada, prescripcion_actualizada…) no mueven el estado y se
 * filtran antes del replay — pasarlos los marcaría "ignorados" y ensuciaría
 * el diagnóstico real de eventos corruptos.
 *
 * `transicion_estado` no está en el mapa porque su destino es específico de
 * cada evento: se lee de su propio `contexto.a` (ver mapearAReplay).
 */
const TIPO_A_ESTADO: Partial<Record<TipoEvento, EstadoUsuarioBPS>> = {
  activacion: "pendiente_perfil", // T3/T5 — ambas desembocan en pendiente_perfil
  gate_fallado: "pendiente_perfil", // T7
  pausa: "en_pausa", // T10/T11
  reanudacion: "activo", // T12/T13
  descarga_programada: "en_descarga", // T8
  descarga_reactiva: "en_descarga", // T8
  sistema_completado: "sistema_completado", // T14
};

const ESTADOS_VALIDOS: Record<EstadoUsuarioBPS, true> = {
  sin_diagnostico: true,
  diagnosticado: true,
  pendiente_diagnostico: true,
  pendiente_perfil: true,
  activo: true,
  en_descarga: true,
  en_pausa: true,
  sistema_completado: true,
};

function destinoDe(evento: EventoProgresion): EstadoUsuarioBPS | null {
  if (evento.tipo === "transicion_estado") {
    const contexto = evento.contexto as { a?: unknown } | null;
    const destino = contexto?.a;
    return typeof destino === "string" && destino in ESTADOS_VALIDOS ? (destino as EstadoUsuarioBPS) : null;
  }
  return TIPO_A_ESTADO[evento.tipo] ?? null;
}

export interface EstadoDerivado {
  estado: EstadoUsuarioBPS;
  /** true si estadoActual() tuvo que degradar un estado imposible (Motor BPS Handbook 05). */
  reparado: boolean;
  /** Evento `anomalia` a persistir cuando hubo reparación — nunca se silencia (P3). */
  anomalia?: EventoBPS;
  ignoradosEnReplay: Array<{ evento: string; motivo: string }>;
}

/**
 * @param eventos tal como los devuelve el repositorio: MÁS RECIENTES PRIMERO.
 *   Se invierten aquí porque el replay exige orden ascendente por created_at
 *   (Motor BPS Handbook 05, `recomputarEstado`).
 */
export function derivarEstadoBPS(
  eventos: readonly EventoProgresion[],
  perfil: Profile,
  tieneDiagnosisVigente: boolean
): EstadoDerivado {
  const ascendentes = [...eventos].reverse();

  const paraReplay: EventoReplay[] = [];
  for (const evento of ascendentes) {
    const aPropuesto = destinoDe(evento);
    if (aPropuesto) paraReplay.push({ evento: evento.tipo, aPropuesto });
  }

  // IN-5 / BPS-011 — el estado es recomputable desde los eventos, y los eventos ganan.
  const replay = recomputarEstado(paraReplay);

  // Motor BPS Handbook 05 — detección y reparación de estados imposibles
  // contra los punteros reales (única fuente materializada que existe).
  const verificado = estadoActual({
    estadoDeclarado: replay.estadoFinal,
    sistemaActual: perfil.sistema_actual,
    nivelActual: perfil.nivel_actual,
    tieneDiagnosisVigente,
  });

  return {
    estado: verificado.estado,
    reparado: verificado.reparado,
    anomalia: verificado.anomalia,
    ignoradosEnReplay: replay.ignorados,
  };
}
