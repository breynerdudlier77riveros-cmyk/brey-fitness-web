// ── Repositorio de progression_events — único punto de acceso a esta tabla ──
// Encapsula la tabla única de eventos del ecosistema (ENG-ADR-03). Append-only
// (P3/DM-ADR-06): solo insert + lecturas, nunca update/delete — coincide con
// la RLS (sin update/delete) y con el patrón del Implementation Handbook (06,
// Pista B #2): "get por rango de fechas, insert únicamente".
//
// Este repositorio NO conoce ningún motor ni decide qué evento emitir — eso
// es de Motor BPS / Progression Engine / Recovery Engine (otro sprint). Aquí
// solo se persiste el evento que un motor ya construyó, y se leen los del
// Usuario. Sirve a GET /motor-bps/eventos y GET /motor-bps/eventos/{id}
// (API Contract Handbook 07).

import type { SupabaseClient } from '@supabase/supabase-js';
import { mapEventoProgresion } from '@/lib/database/mappers';
import type { EventoProgresion } from '@/lib/types';

/** El evento a persistir, sin los campos que gobierna el servidor. */
type NuevoEvento = Omit<EventoProgresion, 'id' | 'user_id' | 'created_at'>;

export async function insertEvento(
  supabase: SupabaseClient,
  userId: string,
  evento: NuevoEvento
): Promise<EventoProgresion | null> {
  const { data, error } = await supabase
    .from('progression_events')
    .insert({ user_id: userId, ...evento })
    .select('*')
    .single();

  if (error || !data) return null;
  return mapEventoProgresion(data);
}

/**
 * Eventos del Usuario, más recientes primero. Siempre acotado — por rango de
 * fecha y/o filtros de tipo/origen — nunca todo el historial sin límite
 * (Engineering Handbook 09). `limit` por defecto 100.
 */
export async function getEventos(
  supabase: SupabaseClient,
  userId: string,
  opts?: {
    desde?: string;
    hasta?: string;
    tipo?: EventoProgresion['tipo'];
    origen?: EventoProgresion['origen'];
    limit?: number;
  }
): Promise<EventoProgresion[]> {
  let query = supabase
    .from('progression_events')
    .select('*')
    .eq('user_id', userId);

  if (opts?.desde) query = query.gte('created_at', opts.desde);
  if (opts?.hasta) query = query.lte('created_at', opts.hasta);
  if (opts?.tipo) query = query.eq('tipo', opts.tipo);
  if (opts?.origen) query = query.eq('origen', opts.origen);

  const { data } = await query
    .order('created_at', { ascending: false })
    .limit(opts?.limit ?? 100);

  return (data ?? []).map(mapEventoProgresion);
}

export async function getEventoById(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<EventoProgresion | null> {
  const { data } = await supabase
    .from('progression_events')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle();

  return data ? mapEventoProgresion(data) : null;
}
