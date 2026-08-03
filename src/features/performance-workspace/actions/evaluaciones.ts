"use server";

// ── Server Actions · Evaluaciones, registros y compartición (PAS-7.0) ──────
// Mismo patrón que `atletas.ts`. Ninguna de estas acciones interpreta ni
// calcula: los motores se ejecutan en la capa de servicios, desde los Server
// Components que muestran el informe.

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { fechaISOLocal } from "@/lib/utils";
import {
  anularRegistro,
  cambiarEstadoEvaluacion,
  crearEnlace,
  crearEvaluacion,
  crearRegistro,
  listarRegistros,
  obtenerEnlaceActivo,
  obtenerEvaluacion,
  revocarEnlace,
} from "../repository";
import { admiteRegistros, puedeTransicionarEvaluacion } from "../schemas/estados";
import { validarEvaluacion, validarRegistro } from "../schemas/validacion";
import type {
  EnlacePublico,
  EntradaEvaluacion,
  EntradaRegistro,
  EstadoEvaluacion,
  Evaluacion,
  RegistroWorkspace,
} from "../schemas/tipos";
import type { ActionResult } from "@/lib/types";

const RUTA = "/app/rendimiento";

export async function accionCrearEvaluacion(
  entrada: EntradaEvaluacion
): Promise<ActionResult<Evaluacion>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const validacion = validarEvaluacion(entrada, fechaISOLocal());
  if (!validacion.ok) return { ok: false, error: validacion.errores[0] };

  const supabase = await createClient();
  const evaluacion = await crearEvaluacion(supabase, entrada);
  if (!evaluacion) return { ok: false, error: "NO_CREADA" };

  revalidatePath(`${RUTA}/${entrada.atletaId}`);
  return { ok: true, data: evaluacion };
}

export async function accionCambiarEstadoEvaluacion(
  id: string,
  estado: EstadoEvaluacion
): Promise<ActionResult<Evaluacion>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const actual = await obtenerEvaluacion(supabase, id);
  if (!actual) return { ok: false, error: "NO_ENCONTRADA" };

  if (!puedeTransicionarEvaluacion(actual.estado, estado)) {
    return { ok: false, error: "TRANSICION_NO_PERMITIDA" };
  }

  const evaluacion = await cambiarEstadoEvaluacion(supabase, id, estado);
  if (!evaluacion) return { ok: false, error: "NO_ACTUALIZADA" };

  revalidatePath(`${RUTA}/${actual.atletaId}`);
  revalidatePath(`${RUTA}/evaluacion/${id}`);
  return { ok: true, data: evaluacion };
}

/**
 * Duplica una evaluación: copia el encabezado, NO los registros.
 *
 * Copiar los registros crearía observaciones que nadie tomó, con la fecha de
 * otra sesión. Duplicar sirve para repetir la estructura de una valoración,
 * no sus resultados.
 */
export async function accionDuplicarEvaluacion(
  id: string,
  fecha: string
): Promise<ActionResult<Evaluacion>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const origen = await obtenerEvaluacion(supabase, id);
  if (!origen) return { ok: false, error: "NO_ENCONTRADA" };

  return accionCrearEvaluacion({
    atletaId: origen.atletaId,
    tipo: origen.tipo,
    fecha,
    observaciones: origen.observaciones,
  });
}

export async function accionRegistrarPrueba(
  entrada: EntradaRegistro
): Promise<ActionResult<RegistroWorkspace>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const validacion = validarRegistro(entrada, fechaISOLocal());
  if (!validacion.ok) return { ok: false, error: validacion.errores[0] };

  const supabase = await createClient();
  const evaluacion = await obtenerEvaluacion(supabase, entrada.evaluacionId);
  if (!evaluacion) return { ok: false, error: "NO_ENCONTRADA" };

  if (!admiteRegistros(evaluacion.estado)) {
    return { ok: false, error: "EVALUACION_CERRADA" };
  }

  const registro = await crearRegistro(supabase, entrada);
  if (!registro) return { ok: false, error: "NO_REGISTRADO" };

  revalidatePath(`${RUTA}/evaluacion/${entrada.evaluacionId}`);
  return { ok: true, data: registro };
}

/** Un registro no se edita: se anula y se crea otro (PAS I-01). */
export async function accionAnularRegistro(
  id: string,
  evaluacionId: string
): Promise<ActionResult<{ id: string }>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const evaluacion = await obtenerEvaluacion(supabase, evaluacionId);
  if (!evaluacion) return { ok: false, error: "NO_ENCONTRADA" };
  if (!admiteRegistros(evaluacion.estado)) return { ok: false, error: "EVALUACION_CERRADA" };

  const anulado = await anularRegistro(supabase, id);
  if (!anulado) return { ok: false, error: "NO_ANULADO" };

  revalidatePath(`${RUTA}/evaluacion/${evaluacionId}`);
  return { ok: true, data: { id } };
}

/** Cierra el borrador. Sin registros vigentes no hay nada que cerrar. */
export async function accionCompletarEvaluacion(
  id: string
): Promise<ActionResult<Evaluacion>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const registros = await listarRegistros(supabase, id);
  if (registros.filter((r) => r.estado === "vigente").length === 0) {
    return { ok: false, error: "SIN_REGISTROS" };
  }

  return accionCambiarEstadoEvaluacion(id, "completada");
}

// ── Compartición ───────────────────────────────────────────────────────────
// Arquitectura preparada: se emite y se revoca el token. Este sprint NO
// publica ninguna ruta anónima que lo consuma — el acceso sin sesión exige
// acceso elevado de servidor que todavía no está montado.

export async function accionCompartirEvaluacion(
  id: string
): Promise<ActionResult<EnlacePublico>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const evaluacion = await obtenerEvaluacion(supabase, id);
  if (!evaluacion) return { ok: false, error: "NO_ENCONTRADA" };

  // Un borrador no se comparte: su contenido todavía puede cambiar.
  if (evaluacion.estado === "borrador") return { ok: false, error: "EVALUACION_EN_BORRADOR" };
  if (evaluacion.estado === "anulada") return { ok: false, error: "EVALUACION_ANULADA" };

  const existente = await obtenerEnlaceActivo(supabase, id);
  if (existente) return { ok: true, data: existente };

  const enlace = await crearEnlace(supabase, id, randomBytes(32).toString("hex"));
  if (!enlace) return { ok: false, error: "NO_COMPARTIDA" };

  if (evaluacion.estado === "completada") {
    await cambiarEstadoEvaluacion(supabase, id, "compartida");
  }

  revalidatePath(`${RUTA}/evaluacion/${id}`);
  return { ok: true, data: enlace };
}

export async function accionRevocarCompartir(
  id: string,
  evaluacionId: string
): Promise<ActionResult<{ id: string }>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const revocado = await revocarEnlace(supabase, id);
  if (!revocado) return { ok: false, error: "NO_REVOCADO" };

  revalidatePath(`${RUTA}/evaluacion/${evaluacionId}`);
  return { ok: true, data: { id } };
}
