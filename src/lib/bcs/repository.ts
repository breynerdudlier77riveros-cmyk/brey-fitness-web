// ── Repositorio del BCS — único punto de acceso a las tres tablas del BCS ───
// Encapsula bcs_clientes / bcs_mediciones / bcs_enlaces_publicos. Traduce
// literalmente los tres contratos de repositorio del BCS Handbook (13):
//   RepositorioCliente        · obtenerPorId, listarPorEntrenador, guardar, cambiarEstado
//   RepositorioMedicion       · obtenerPorId, listarVigentesPorCliente, guardar, anular
//   RepositorioEnlacePublico  · obtenerPorToken, obtenerActivoPorCliente, guardar, revocar
//
// Cada función opera sobre UN solo agregado — ningún join de conveniencia
// entre agregados (BCS Handbook 13): componer el Reporte (Cliente+Mediciones)
// es de la capa de aplicación, no de aquí. El ownership lo impone la RLS
// (Entrenador dueño); estas funciones no vuelven a decidir permisos, solo
// persisten y leen. El BCS es standalone: este repositorio nunca toca una
// tabla del Core Product.

import type { SupabaseClient } from '@supabase/supabase-js';
import { mapCliente, mapMedicion, mapEnlacePublico } from '@/lib/database/mappers';
import type { Cliente, Medicion, EnlacePublico, ClienteEstado } from '@/lib/bcs/tipos';

// ── RepositorioCliente ─────────────────────────────────────────────────────

export async function obtenerClientePorId(
  supabase: SupabaseClient,
  id: string
): Promise<Cliente | null> {
  const { data } = await supabase.from('bcs_clientes').select('*').eq('id', id).maybeSingle();
  return data ? mapCliente(data) : null;
}

/** Clientes del Entrenador, más recientes primero. Filtro opcional por estado; paginado por rango (>50, BCS Handbook 12). `limit` por defecto 50. */
export async function listarClientesPorEntrenador(
  supabase: SupabaseClient,
  entrenadorId: string,
  opts?: { estado?: ClienteEstado; limit?: number }
): Promise<Cliente[]> {
  let query = supabase
    .from('bcs_clientes')
    .select('*')
    .eq('entrenador_id', entrenadorId);

  if (opts?.estado) query = query.eq('estado', opts.estado);

  const { data } = await query
    .order('created_at', { ascending: false })
    .limit(opts?.limit ?? 50);

  return (data ?? []).map(mapCliente);
}

/** Persiste un Cliente. Sin `id` → crea uno nuevo (UC-01); con `id` → actualiza sus datos identificativos (UC-02). El estado se cambia por cambiarEstado, no aquí. */
export async function guardarCliente(
  supabase: SupabaseClient,
  entrenadorId: string,
  datos: { id?: string; nombre: string }
): Promise<Cliente | null> {
  if (datos.id) {
    const { data, error } = await supabase
      .from('bcs_clientes')
      .update({ nombre: datos.nombre })
      .eq('id', datos.id)
      .eq('entrenador_id', entrenadorId)
      .select('*')
      .single();
    if (error || !data) return null;
    return mapCliente(data);
  }

  const { data, error } = await supabase
    .from('bcs_clientes')
    .insert({ entrenador_id: entrenadorId, nombre: datos.nombre })
    .select('*')
    .single();
  if (error || !data) return null;
  return mapCliente(data);
}

/** Transición de estado: activo ⇄ archivado (UC-03), o → eliminado (marca de estado; el borrado físico permanente de UC-04 es de la capa de aplicación). */
export async function cambiarEstadoCliente(
  supabase: SupabaseClient,
  entrenadorId: string,
  id: string,
  estado: ClienteEstado
): Promise<Cliente | null> {
  const { data, error } = await supabase
    .from('bcs_clientes')
    .update({ estado })
    .eq('id', id)
    .eq('entrenador_id', entrenadorId)
    .select('*')
    .single();
  if (error || !data) return null;
  return mapCliente(data);
}

// ── RepositorioMedicion ────────────────────────────────────────────────────

export async function obtenerMedicionPorId(
  supabase: SupabaseClient,
  id: string
): Promise<Medicion | null> {
  const { data } = await supabase.from('bcs_mediciones').select('*').eq('id', id).maybeSingle();
  return data ? mapMedicion(data) : null;
}

/** Mediciones vigentes de un Cliente, ordenadas por fecha desc (BCS Handbook 13). `limit` por defecto 50 (paginación >50, BCS Handbook 12). */
export async function listarMedicionesVigentesPorCliente(
  supabase: SupabaseClient,
  clienteId: string,
  opts?: { limit?: number }
): Promise<Medicion[]> {
  const { data } = await supabase
    .from('bcs_mediciones')
    .select('*')
    .eq('cliente_id', clienteId)
    .eq('estado', 'vigente')
    .order('fecha', { ascending: false })
    .limit(opts?.limit ?? 50);

  return (data ?? []).map(mapMedicion);
}

/** Registra una Medición nueva (estado `vigente` por default). UC-05. Nunca edita en sitio (BCS-ADR-03). */
export async function guardarMedicion(
  supabase: SupabaseClient,
  datos: Omit<Medicion, 'id' | 'estado'>
): Promise<Medicion | null> {
  const { data, error } = await supabase
    .from('bcs_mediciones')
    .insert(datos)
    .select('*')
    .single();
  if (error || !data) return null;
  return mapMedicion(data);
}

/**
 * Marca una Medición como `anulada` (paso "anular" de UC-06, corrección).
 *
 * ⚠ CONTRADICCIÓN ENTRE HANDBOOKS (documentada, no resuelta aquí): el BCS
 * Handbook (13, UC-06) y el Domain Model (10, FSM Vigente→Anulada) exigen esta
 * transición, pero el Database Handbook (09) especifica bcs_mediciones SIN
 * política de UPDATE (append-only). Con la RLS actual (Sprint 1, fiel al
 * Database Handbook 09) este UPDATE queda BLOQUEADO en runtime. La función se
 * implementa fiel al contrato del repositorio (BCS Handbook 13); cerrar la
 * brecha (una política UPDATE acotada al estado, como la que sí tiene
 * bcs_enlaces_publicos para revocar) es una decisión de la RLS, no de esta
 * capa — se reporta como hallazgo, no se corrige el esquema sin autoridad.
 */
export async function anularMedicion(
  supabase: SupabaseClient,
  id: string
): Promise<Medicion | null> {
  const { data, error } = await supabase
    .from('bcs_mediciones')
    .update({ estado: 'anulada' })
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) return null;
  return mapMedicion(data);
}

// ── RepositorioEnlacePublico ───────────────────────────────────────────────

/**
 * Resuelve un token a su EnlacePúblico. En contexto de Entrenador la RLS lo
 * acota a sus propios enlaces; el acceso ANÓNIMO del Cliente (portador del
 * token, sin sesión) es la capa de aplicación quien lo ejecuta con acceso
 * elevado (Database Handbook 09, BCS Handbook IN-A2) — esta función es neutral
 * al respecto, solo consulta por token.
 */
export async function obtenerEnlacePorToken(
  supabase: SupabaseClient,
  token: string
): Promise<EnlacePublico | null> {
  const { data } = await supabase.from('bcs_enlaces_publicos').select('*').eq('token', token).maybeSingle();
  return data ? mapEnlacePublico(data) : null;
}

/** El enlace `activo` de un Cliente (a lo más uno — 09-IN-1), o null. */
export async function obtenerEnlaceActivoPorCliente(
  supabase: SupabaseClient,
  clienteId: string
): Promise<EnlacePublico | null> {
  const { data } = await supabase
    .from('bcs_enlaces_publicos')
    .select('*')
    .eq('cliente_id', clienteId)
    .eq('estado', 'activo')
    .maybeSingle();

  return data ? mapEnlacePublico(data) : null;
}

/**
 * Persiste un EnlacePúblico nuevo (estado `activo` por default). UC-07. El
 * `token` llega ya generado: su generación (aleatorio ≥21 caracteres,
 * BCS-ADR-02) es una garantía de la capa de aplicación (el contrato del BCS
 * Handbook 13 lista guardar/revocar/obtener, nunca "generar"), no de esta
 * capa de persistencia.
 */
export async function guardarEnlace(
  supabase: SupabaseClient,
  datos: { cliente_id: string; token: string }
): Promise<EnlacePublico | null> {
  const { data, error } = await supabase
    .from('bcs_enlaces_publicos')
    .insert(datos)
    .select('*')
    .single();
  if (error || !data) return null;
  return mapEnlacePublico(data);
}

/** Marca un EnlacePúblico como `revocado` (UC-08). Revocado nunca reactiva (IN-28). */
export async function revocarEnlace(
  supabase: SupabaseClient,
  id: string
): Promise<EnlacePublico | null> {
  const { data, error } = await supabase
    .from('bcs_enlaces_publicos')
    .update({ estado: 'revocado' })
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) return null;
  return mapEnlacePublico(data);
}
