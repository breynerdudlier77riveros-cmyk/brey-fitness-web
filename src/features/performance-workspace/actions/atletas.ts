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
  reasignarEvaluaciones,
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
/**
 * Une dos fichas del mismo atleta: mueve las evaluaciones y archiva la vacía.
 *
 * ── LO QUE ESTA ACCIÓN AFIRMA ────────────────────────────────────────────
 *
 *   Que las dos fichas son la misma persona. Eso no lo sabe el sistema —dos
 *   homónimos son perfectamente posibles— así que lo afirma quien la invoca, y
 *   la pantalla se lo hace decir explícitamente.
 *
 * ── POR QUÉ IMPORTA MÁS DE LO QUE PARECE ─────────────────────────────────
 *
 *   Las evaluaciones se interpretan con la identidad de SU atleta: sexo, edad
 *   y país deciden qué normas son admisibles. Moverlas cambia esas lecturas,
 *   normalmente para bien —el caso típico es una ficha sin sexo cuyas
 *   evaluaciones no podían situarse— pero cambiarlas es cambiarlas.
 *
 * ── NO SE BORRA NADA ─────────────────────────────────────────────────────
 *
 *   El origen se ARCHIVA, no se elimina: su ficha deja de estar en medio y
 *   sigue existiendo. Lo que no es reversible es el traslado en sí, y por eso
 *   la pantalla lo advierte antes.
 */
export async function accionFusionarAtletas(
  desdeId: string,
  hastaId: string
): Promise<ActionResult<{ movidas: number }>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };
  if (desdeId === hastaId) return { ok: false, error: "MISMO_ATLETA" };

  const supabase = await createClient();

  // Los dos se leen por la RLS: una ficha ajena no aparece y la fusión se
  // detiene aquí sin comprobar dueños a mano (FT-01/BE-04).
  const [desde, hasta] = await Promise.all([
    obtenerAtleta(supabase, desdeId),
    obtenerAtleta(supabase, hastaId),
  ]);
  if (!desde || !hasta) return { ok: false, error: "ATLETA_NO_ENCONTRADO" };
  if (desde.estado === "eliminado" || hasta.estado === "eliminado") {
    return { ok: false, error: "ATLETA_ELIMINADO" };
  }

  const movidas = await reasignarEvaluaciones(supabase, desdeId, hastaId);
  if (movidas === null) return { ok: false, error: "NO_REASIGNADAS" };

  // Solo después de mover: archivar primero dejaría la ficha oculta con sus
  // evaluaciones dentro si el traslado fallara.
  const archivado = await cambiarEstadoAtleta(supabase, desdeId, "archivado");
  if (!archivado) return { ok: false, error: "NO_ARCHIVADO" };

  revalidatePath(RUTA);
  revalidatePath(`${RUTA}/${hastaId}`);
  return { ok: true, data: { movidas } };
}

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
