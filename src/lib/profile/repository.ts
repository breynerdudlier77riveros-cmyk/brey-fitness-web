// ── Repositorio de profiles — único punto de acceso a esta tabla ───────────
// Toda consulta relacionada con `profiles` pasa por aquí, sin excepción
// salvo una documentada: `src/components/layout/Navbar.tsx` sigue con su
// propio `.select("nombre")` — corre client-side en CADA página del sitio
// (no solo /app), y forzarlo a traer las 20 columnas del perfil completo
// (incluidas lesiones/observaciones) solo para mostrar un nombre sería un
// costo real y evitable en la ruta más caliente del sitio. Esa es la única
// excepción intencional a esta regla.
//
// Cada función recibe el `SupabaseClient` como parámetro en vez de
// construirlo internamente — es lo que permite que sirva tanto a Server
// Components (cliente de @/lib/supabase/server, que depende de
// next/headers y no puede invocarse fuera de ese contexto) como a
// PerfilForm.tsx (Client Component, cliente de @/lib/supabase/client) sin
// duplicar esta lógica ni adivinar en qué contexto se ejecuta.

import type { SupabaseClient } from '@supabase/supabase-js';
import { mapProfile } from '@/lib/database/mappers';
import type { Profile } from '@/lib/types';
import type { ProfileUpdateInput } from '@/lib/perfil/perfil';

export async function getProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data ? mapProfile(data) : null;
}

/**
 * Garantiza que el perfil exista antes de devolver — el trigger en
 * auth.users ya lo crea normalmente; esto es el respaldo defensivo si por
 * lo que sea no ocurrió (antes vivía inline en app/app/layout.tsx).
 */
export async function getOrCreateProfile(
  supabase: SupabaseClient,
  userId: string,
  defaults: { email: string | null; nombre: string }
): Promise<Profile> {
  const existente = await getProfile(supabase, userId);
  if (existente) return existente;

  const { data } = await supabase
    .from('profiles')
    .upsert({ id: userId, email: defaults.email, nombre: defaults.nombre })
    .select('*')
    .single();

  return mapProfile(data);
}

/** null en caso de error — el error concreto de Postgres no se propaga hoy: ningún call site lo necesita (todos muestran el mismo mensaje genérico). */
export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  patch: ProfileUpdateInput
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(patch)
    .eq('id', userId)
    .select('*')
    .single();

  if (error || !data) return null;
  return mapProfile(data);
}
