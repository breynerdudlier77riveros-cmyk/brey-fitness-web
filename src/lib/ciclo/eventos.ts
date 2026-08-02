// ── Persistencia de eventos del ciclo (capa Application) ────────────────────
// Toda escritura pasa por el repositorio de progression_events (Sprint 2) —
// nunca por Supabase directo. Los motores CONSTRUYEN el evento (razones +
// contexto); esta capa solo lo traduce a la forma de la fila y lo persiste.
//
// BPS-010: toda transición emite exactamente un evento con razón, y
// "transición y evento son atómicos: o ambos, o ninguno". Postgres no da una
// transacción multi-sentencia a través de PostgREST y ningún repositorio
// expone una (Sprint 2, congelado) — la atomicidad real queda pendiente y se
// documenta como riesgo en el informe, no se finge aquí.

import type { SupabaseClient } from "@supabase/supabase-js";
import { insertEvento } from "@/lib/progression/repository";
import type { EventoBPS } from "@/lib/engines/bps/tipos";
import type { EventoProgresion, TipoEvento, OrigenEvento } from "@/lib/types";

/** Forma mínima común a todos los productores de evento del ecosistema (Motor BPS Handbook 04, familia 2). */
export interface EventoParaPersistir {
  tipo: TipoEvento;
  origen: OrigenEvento;
  razones: string[];
  contexto: Record<string, unknown>;
  workoutLogId?: string | null;
}

/** Los eventos del Motor BPS ya vienen con `origen: "motor_bps"` fijado por el propio motor. */
export function desdeEventoBPS(evento: EventoBPS): EventoParaPersistir {
  return { tipo: evento.tipo, origen: evento.origen, razones: evento.razones, contexto: evento.contexto };
}

export async function persistirEvento(
  supabase: SupabaseClient,
  userId: string,
  evento: EventoParaPersistir
): Promise<EventoProgresion | null> {
  return insertEvento(supabase, userId, {
    tipo: evento.tipo,
    origen: evento.origen,
    razones: evento.razones, // NOT NULL — P2/BPS-010: un evento sin razones no existe
    contexto: evento.contexto,
    workout_log_id: evento.workoutLogId ?? null,
  });
}

/** Persiste en el orden recibido (el orden de emisión ES información auditable — P3). */
export async function persistirEventos(
  supabase: SupabaseClient,
  userId: string,
  eventos: readonly EventoParaPersistir[]
): Promise<EventoProgresion[]> {
  const persistidos: EventoProgresion[] = [];
  for (const evento of eventos) {
    const fila = await persistirEvento(supabase, userId, evento);
    if (fila) persistidos.push(fila);
  }
  return persistidos;
}
