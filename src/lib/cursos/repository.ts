// ── Repositorio de cursos — único punto de acceso a estas tablas ──────────
// Mismo patrón que el resto del proyecto (`src/lib/systems/repository.ts`,
// `src/lib/profile/repository.ts`): el `SupabaseClient` llega como
// parámetro, nunca se construye aquí dentro, y ninguna fila cruda sale sin
// pasar por un mapper.
//
// Algunas funciones piden explícitamente el cliente de SERVICE ROLE
// (`src/lib/supabase/admin.ts`) porque el webhook de Hotmart no tiene sesión
// de usuario y la reconciliación de compras por email necesita leer/escribir
// filas que todavía no pertenecen a nadie (`usuario_id is null`) — ninguna
// política de RLS de `compras` lo permite con el cliente normal, y no debe
// permitirlo (ver `migration_cursos.sql`).

import type { SupabaseClient } from '@supabase/supabase-js';
import { contenidoVacio } from './contenido';
import type { Compra, ContenidoSistema } from './tipos';

type Row = Record<string, unknown>;

function mapCompra(row: Row): Compra {
  return {
    id: row.id as string,
    sistemaSlug: row.sistema_slug as string,
    usuarioId: (row.usuario_id as string | null) ?? null,
    email: row.email as string,
    origen: row.origen as Compra['origen'],
    hotmartTransaccion: (row.hotmart_transaccion as string | null) ?? null,
    estado: row.estado as Compra['estado'],
    createdAt: row.created_at as string,
    actualizadoEl: row.actualizado_el as string,
  };
}

// ── Contenido ────────────────────────────────────────────────────────────

export async function obtenerContenido(
  supabase: SupabaseClient,
  sistemaSlug: string,
): Promise<ContenidoSistema> {
  const { data } = await supabase
    .from('sistema_contenido')
    .select('contenido')
    .eq('sistema_slug', sistemaSlug)
    .maybeSingle();
  return (data?.contenido as ContenidoSistema | undefined) ?? contenidoVacio();
}

/** Crea o reemplaza el contenido entero. Solo el admin pasa la RLS para esto. */
export async function guardarContenido(
  supabase: SupabaseClient,
  sistemaSlug: string,
  contenido: ContenidoSistema,
): Promise<boolean> {
  const { error } = await supabase
    .from('sistema_contenido')
    .upsert(
      { sistema_slug: sistemaSlug, contenido, actualizado_el: new Date().toISOString() },
      { onConflict: 'sistema_slug' },
    );
  return error === null;
}

// ── Compras ──────────────────────────────────────────────────────────────

/** La compra activa de un usuario logueado para un Sistema, o `null`. */
export async function compraActivaDe(
  supabase: SupabaseClient,
  sistemaSlug: string,
  usuarioId: string,
): Promise<Compra | null> {
  const { data } = await supabase
    .from('compras')
    .select('*')
    .eq('sistema_slug', sistemaSlug)
    .eq('usuario_id', usuarioId)
    .eq('estado', 'activa')
    .maybeSingle();
  return data ? mapCompra(data) : null;
}

/** Todas las compras activas del usuario, para saber qué Sistemas tiene. */
export async function comprasActivasDelUsuario(
  supabase: SupabaseClient,
  usuarioId: string,
): Promise<Compra[]> {
  const { data } = await supabase
    .from('compras')
    .select('*')
    .eq('usuario_id', usuarioId)
    .eq('estado', 'activa');
  return (data ?? []).map(mapCompra);
}

/** Todas las compras de un Sistema (vista de admin). Necesita Service Role. */
export async function comprasDelSistema(
  supabaseAdmin: SupabaseClient,
  sistemaSlug: string,
): Promise<Compra[]> {
  const { data } = await supabaseAdmin
    .from('compras')
    .select('*')
    .eq('sistema_slug', sistemaSlug)
    .order('created_at', { ascending: false });
  return (data ?? []).map(mapCompra);
}

/**
 * Otorga acceso a un Sistema — por Hotmart o a mano. Si ya existía una
 * compra de ese email para ese Sistema (p. ej. una reembolsada que se
 * recompra), la reactiva en vez de duplicarla: `unique(sistema_slug, email)`
 * en la base de datos es la misma regla, aquí solo se respeta con upsert.
 */
export async function otorgarAcceso(
  supabaseAdmin: SupabaseClient,
  entrada: {
    sistemaSlug: string;
    email: string;
    origen: 'hotmart' | 'manual';
    hotmartTransaccion?: string | null;
    /** Si quien otorga el acceso ya sabe el usuario (alta manual con cuenta existente). */
    usuarioId?: string | null;
  },
): Promise<Compra | null> {
  const { data } = await supabaseAdmin
    .from('compras')
    .upsert(
      {
        sistema_slug: entrada.sistemaSlug,
        email: entrada.email.toLowerCase(),
        origen: entrada.origen,
        hotmart_transaccion: entrada.hotmartTransaccion ?? null,
        usuario_id: entrada.usuarioId ?? null,
        estado: 'activa',
        actualizado_el: new Date().toISOString(),
      },
      { onConflict: 'sistema_slug,email' },
    )
    .select('*')
    .maybeSingle();
  return data ? mapCompra(data) : null;
}

export async function revocarAcceso(
  supabaseAdmin: SupabaseClient,
  sistemaSlug: string,
  email: string,
): Promise<void> {
  await supabaseAdmin
    .from('compras')
    .update({ estado: 'reembolsada', actualizado_el: new Date().toISOString() })
    .eq('sistema_slug', sistemaSlug)
    .eq('email', email.toLowerCase());
}

/**
 * La primera vez que alguien inicia sesión con un correo que ya tenía una
 * compra sin cuenta vinculada (`usuario_id is null`), esto la enlaza.
 *
 * Necesita Service Role: ninguna política de `compras` deja leer una fila
 * ajena por email antes de que `usuario_id` apunte a este usuario — es
 * exactamente la comprobación que esta función existe para resolver.
 */
export async function vincularComprasDelUsuario(
  supabaseAdmin: SupabaseClient,
  usuarioId: string,
  email: string,
): Promise<void> {
  await supabaseAdmin
    .from('compras')
    .update({ usuario_id: usuarioId })
    .eq('email', email.toLowerCase())
    .is('usuario_id', null);
}

// ── Progreso ─────────────────────────────────────────────────────────────

export async function leccionesVistas(
  supabase: SupabaseClient,
  compraId: string,
): Promise<ReadonlySet<string>> {
  const { data } = await supabase
    .from('progreso_leccion')
    .select('leccion_id')
    .eq('compra_id', compraId);
  return new Set((data ?? []).map((r) => r.leccion_id as string));
}

export async function marcarLeccionVista(
  supabase: SupabaseClient,
  compraId: string,
  leccionId: string,
): Promise<void> {
  await supabase
    .from('progreso_leccion')
    .upsert(
      { compra_id: compraId, leccion_id: leccionId },
      { onConflict: 'compra_id,leccion_id', ignoreDuplicates: true },
    );
}

// ── Eventos de Hotmart (idempotencia) ───────────────────────────────────

/**
 * Registra el evento crudo. Devuelve `false` sin volver a procesar nada si
 * `idEvento` ya existía — la clave única de `hotmart_eventos` es lo que hace
 * el reintento de Hotmart inofensivo (ver `migration_cursos.sql`).
 */
export async function registrarEventoHotmart(
  supabaseAdmin: SupabaseClient,
  entrada: { idEvento: string; evento: string; payload: unknown },
): Promise<boolean> {
  const { error } = await supabaseAdmin.from('hotmart_eventos').insert({
    hotmart_id: entrada.idEvento,
    evento: entrada.evento,
    payload: entrada.payload as object,
  });
  // code 23505 = unique_violation: ya se había registrado este evento.
  if (error && (error as { code?: string }).code === '23505') return false;
  return error === null;
}
