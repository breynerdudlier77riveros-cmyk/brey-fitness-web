'use server';

// ── Anamnesis · casos de uso ────────────────────────────────────────────
// Mismo patrón que `src/lib/cursos/actions.ts`: comprueba `profile.es_admin`
// en TypeScript aunque la RLS de `anamnesis` ya exige dueño — es la misma
// comprobación dos veces a propósito, para un mensaje legible; si alguna vez
// discreparan, la RLS manda y la fila simplemente no se escribe.

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/user';
import { getProfile } from '@/lib/profile/repository';
import type { ActionResult } from '@/lib/types';

import { normalizar } from './contenido';
import * as repo from './repository';
import type { AnamnesisDatos, Registro } from './tipos';

const RUTA_LISTA = '/app/admin/anamnesis';

async function exigirAdmin(): Promise<
  { ok: true; usuarioId: string } | { ok: false; error: ActionResult<never> }
> {
  const user = await getUser();
  if (!user) return { ok: false, error: { ok: false, error: 'NO_AUTENTICADO' } };

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);
  if (!profile?.es_admin) return { ok: false, error: { ok: false, error: 'NO_AUTORIZADO' } };

  return { ok: true, usuarioId: user.id };
}

export async function accionListar(): Promise<ActionResult<Registro[]>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const supabase = await createClient();
  const registros = await repo.listar(supabase, admin.usuarioId);
  return { ok: true, data: registros };
}

export async function accionCrear(): Promise<ActionResult<Registro>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const supabase = await createClient();
  const creado = await repo.crear(supabase, admin.usuarioId);
  if (!creado) return { ok: false, error: 'NO_CREADO' };

  revalidatePath(RUTA_LISTA);
  return { ok: true, data: creado };
}

export async function accionGuardar(
  id: string,
  contenido: AnamnesisDatos,
): Promise<ActionResult<null>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const supabase = await createClient();
  const guardado = await repo.guardar(supabase, id, normalizar(contenido));
  if (!guardado) return { ok: false, error: 'NO_GUARDADO' };

  revalidatePath(`${RUTA_LISTA}/${id}`);
  return { ok: true, data: null };
}

export async function accionEliminar(id: string): Promise<ActionResult<null>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const supabase = await createClient();
  const eliminado = await repo.eliminar(supabase, id);
  if (!eliminado) return { ok: false, error: 'NO_ELIMINADO' };

  revalidatePath(RUTA_LISTA);
  return { ok: true, data: null };
}
