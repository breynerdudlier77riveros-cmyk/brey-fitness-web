"use server";

// ── Server Actions · Atletas (Sprint PAS-7.0) ──────────────────────────────
// Patrón sancionado del ecosistema: valida sesión, valida entrada, orquesta
// repositorio, devuelve DTO o error. Sin SQL, sin JSX, sin reglas de dominio.
//
// El ownership lo impone la RLS: estas acciones NUNCA re-implementan el
// chequeo de dueño en TypeScript.

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import {
  actualizarAtleta,
  cambiarEstadoAtleta,
  crearAtleta,
  obtenerAtleta,
} from "../repository";
import { puedeTransicionarAtleta } from "../schemas/estados";
import { validarAtleta } from "../schemas/validacion";
import type { Atleta, EntradaAtleta, EstadoAtleta } from "../schemas/tipos";
import type { ActionResult } from "@/lib/types";

const RUTA = "/app/rendimiento";

export async function accionCrearAtleta(
  entrada: EntradaAtleta
): Promise<ActionResult<Atleta>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const validacion = validarAtleta(entrada);
  if (!validacion.ok) return { ok: false, error: validacion.errores[0] };

  const supabase = await createClient();
  const atleta = await crearAtleta(supabase, user.id, entrada);
  if (!atleta) return { ok: false, error: "NO_CREADO" };

  revalidatePath(RUTA);
  return { ok: true, data: atleta };
}

export async function accionEditarAtleta(
  id: string,
  entrada: EntradaAtleta
): Promise<ActionResult<Atleta>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const validacion = validarAtleta(entrada);
  if (!validacion.ok) return { ok: false, error: validacion.errores[0] };

  const supabase = await createClient();
  const actual = await obtenerAtleta(supabase, id);
  if (!actual) return { ok: false, error: "NO_ENCONTRADO" };

  // Un atleta eliminado no se edita: su expediente queda como estaba.
  if (actual.estado === "eliminado") return { ok: false, error: "ATLETA_ELIMINADO" };

  const atleta = await actualizarAtleta(supabase, id, entrada);
  if (!atleta) return { ok: false, error: "NO_ACTUALIZADO" };

  revalidatePath(RUTA);
  revalidatePath(`${RUTA}/${id}`);
  return { ok: true, data: atleta };
}

/**
 * Cambia el estado comprobando la transición.
 *
 * La máquina de estados vive en `schemas/estados.ts` y no aquí: si cada acción
 * decidiera sus propias transiciones, archivar desde una pantalla y desde otra
 * podrían acabar significando cosas distintas.
 */
export async function accionCambiarEstadoAtleta(
  id: string,
  estado: EstadoAtleta
): Promise<ActionResult<Atleta>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const actual = await obtenerAtleta(supabase, id);
  if (!actual) return { ok: false, error: "NO_ENCONTRADO" };

  if (!puedeTransicionarAtleta(actual.estado, estado)) {
    return { ok: false, error: "TRANSICION_NO_PERMITIDA" };
  }

  const atleta = await cambiarEstadoAtleta(supabase, id, estado);
  if (!atleta) return { ok: false, error: "NO_ACTUALIZADO" };

  revalidatePath(RUTA);
  revalidatePath(`${RUTA}/${id}`);
  return { ok: true, data: atleta };
}

/** Borrado lógico. Nada se elimina físicamente: el histórico se conserva. */
export async function accionEliminarAtleta(id: string): Promise<ActionResult<Atleta>> {
  return accionCambiarEstadoAtleta(id, "eliminado");
}

export async function accionArchivarAtleta(id: string): Promise<ActionResult<Atleta>> {
  return accionCambiarEstadoAtleta(id, "archivado");
}

export async function accionReactivarAtleta(id: string): Promise<ActionResult<Atleta>> {
  return accionCambiarEstadoAtleta(id, "activo");
}
