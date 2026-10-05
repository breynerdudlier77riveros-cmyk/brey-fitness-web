// ── Repositorio de anamnesis — único punto de acceso a `public.anamnesis` ──
// Mismo patrón que `src/lib/cursos/repository.ts`: el `SupabaseClient` llega
// como parámetro, nunca se construye aquí dentro, y ninguna fila cruda sale
// sin pasar por un mapper.

import type { SupabaseClient } from '@supabase/supabase-js';
import { datosVacios } from './tipos';
import type { AnamnesisDatos, Registro } from './tipos';

type Row = Record<string, unknown>;

function mapRegistro(row: Row): Registro {
  return {
    id: row.id as string,
    creadoPor: row.creado_por as string,
    contenido: (row.contenido as AnamnesisDatos | null) ?? datosVacios(),
    creadoEl: row.creado_el as string,
    actualizadoEl: row.actualizado_el as string,
  };
}

/** Todos los registros creados por este usuario, más recientes primero. */
export async function listar(supabase: SupabaseClient, creadoPor: string): Promise<Registro[]> {
  const { data } = await supabase
    .from('anamnesis')
    .select('*')
    .eq('creado_por', creadoPor)
    .order('actualizado_el', { ascending: false });
  return (data ?? []).map(mapRegistro);
}

export async function obtener(supabase: SupabaseClient, id: string): Promise<Registro | null> {
  const { data } = await supabase.from('anamnesis').select('*').eq('id', id).maybeSingle();
  return data ? mapRegistro(data) : null;
}

export async function crear(supabase: SupabaseClient, creadoPor: string): Promise<Registro | null> {
  const { data } = await supabase
    .from('anamnesis')
    .insert({ creado_por: creadoPor, contenido: datosVacios() })
    .select('*')
    .maybeSingle();
  return data ? mapRegistro(data) : null;
}

export async function guardar(
  supabase: SupabaseClient,
  id: string,
  contenido: AnamnesisDatos,
): Promise<boolean> {
  const { error } = await supabase
    .from('anamnesis')
    .update({ contenido, actualizado_el: new Date().toISOString() })
    .eq('id', id);
  return error === null;
}

export async function eliminar(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from('anamnesis').delete().eq('id', id);
  return error === null;
}
