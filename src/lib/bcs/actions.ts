"use server";

// ── Server Actions del BCS (capa Application, BE-01) ────────────────────────
// Los 8 casos de uso construibles del BCS Handbook (13, UC-01..08),
// traducidos literalmente de su pseudocódigo. Siguen el patrón sancionado
// (Engineering Handbook BE-01, ejemplo real signOut): "use server", cliente
// de servidor, valida sesión, valida entrada, orquesta repositorios, devuelve
// DTO/error oficial. Sin SQL, sin JSX, sin React, sin reglas de dominio.
//
// Ownership: la sesión da el entrenador (getUser); la RLS de Postgres impone
// que solo vea/edite sus propios agregados (BE-04) — estas acciones NUNCA
// re-implementan el chequeo de dueño en TypeScript (FT-01, BE-04).
//
// Eventos: los eventos de dominio del BCS (cliente_creado, medicion_registrada,
// enlace_revocado…) son EFECTOS persistidos en la propia fila, no filas de una
// tabla de eventos — el BCS no tiene tabla de eventos (Domain Model 11). Por
// eso ninguna acción "emite" un evento aparte: el efecto es el cambio de fila.
//
// UC-09 (VisualizarReportePúblico) NO está aquí: su cómputo del Reporte exige
// las reglas de interpretación del BCS Handbook (06) — lógica de DOMINIO,
// fuera del alcance de este Sprint — y su acceso anónimo por token requiere
// acceso elevado de servidor (Database Handbook 09, IN-A2) todavía no montado.
// Ver el informe del Sprint.

import { randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import {
  obtenerClientePorId,
  guardarCliente,
  cambiarEstadoCliente,
  obtenerMedicionPorId,
  guardarMedicion,
  anularMedicion,
  obtenerEnlaceActivoPorCliente,
  guardarEnlace,
  revocarEnlace,
} from "@/lib/bcs/repository";
import type { Cliente, Medicion, EnlacePublico } from "@/lib/bcs/tipos";
import type { ActionResult } from "@/lib/types";

// ── UC-01 · CrearCliente ───────────────────────────────────────────────────
export async function crearCliente(nombre: string): Promise<ActionResult<Cliente>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };
  if (!nombre.trim()) return { ok: false, error: "NOMBRE_VACIO" };

  const supabase = await createClient();
  const cliente = await guardarCliente(supabase, user.id, { nombre: nombre.trim() });
  if (!cliente) return { ok: false, error: "CLIENTE_NO_CREADO" };
  return { ok: true, data: cliente };
}

// ── UC-02 · EditarCliente ──────────────────────────────────────────────────
export async function editarCliente(id: string, nombre: string): Promise<ActionResult<Cliente>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };
  if (!nombre.trim()) return { ok: false, error: "NOMBRE_VACIO" };

  const supabase = await createClient();
  // La existencia + propiedad la resuelve la RLS: si no es su Cliente, la
  // lectura devuelve null (CLIENTE_NO_ENCONTRADO).
  const existente = await obtenerClientePorId(supabase, id);
  if (!existente) return { ok: false, error: "CLIENTE_NO_ENCONTRADO" };

  const cliente = await guardarCliente(supabase, user.id, { id, nombre: nombre.trim() });
  if (!cliente) return { ok: false, error: "CLIENTE_NO_ACTUALIZADO" };
  return { ok: true, data: cliente };
}

// ── UC-03 · ArchivarCliente ────────────────────────────────────────────────
export async function archivarCliente(id: string): Promise<ActionResult<Cliente>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const existente = await obtenerClientePorId(supabase, id);
  if (!existente) return { ok: false, error: "CLIENTE_NO_ENCONTRADO" };
  if (existente.estado === "archivado") return { ok: false, error: "CLIENTE_YA_ARCHIVADO" };

  const cliente = await cambiarEstadoCliente(supabase, user.id, id, "archivado");
  if (!cliente) return { ok: false, error: "CLIENTE_NO_ACTUALIZADO" };
  return { ok: true, data: cliente };
}

// ── UC-03 (inverso) · ReactivarCliente (POST /bcs/clientes/{id}/reactivar) ──
export async function reactivarCliente(id: string): Promise<ActionResult<Cliente>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const existente = await obtenerClientePorId(supabase, id);
  if (!existente) return { ok: false, error: "CLIENTE_NO_ENCONTRADO" };

  const cliente = await cambiarEstadoCliente(supabase, user.id, id, "activo");
  if (!cliente) return { ok: false, error: "CLIENTE_NO_ACTUALIZADO" };
  return { ok: true, data: cliente };
}

// ── UC-04 · EliminarClientePermanentemente ─────────────────────────────────
// ⚠ El BCS Handbook (13/UC-04) especifica un DELETE físico. La capa de
// persistencia (Sprint 2) NO expone borrado físico (el repositorio solo tiene
// cambiarEstado; la RLS no tiene política DELETE — Database Handbook 09) y
// este Sprint no puede tocar repositorios ni esquema. Se implementa la parte
// construible: cascada de revocación del enlace activo (IN-29) + marca del
// estado terminal `eliminado` (Domain Model 10). El borrado físico real queda
// pendiente (ver informe).
export async function eliminarCliente(id: string): Promise<ActionResult<Cliente>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const existente = await obtenerClientePorId(supabase, id);
  if (!existente) return { ok: false, error: "CLIENTE_NO_ENCONTRADO" };

  // Cascada: revoca el enlace activo del Cliente, si lo hay (IN-29).
  const enlaceActivo = await obtenerEnlaceActivoPorCliente(supabase, id);
  if (enlaceActivo) await revocarEnlace(supabase, enlaceActivo.id);

  const cliente = await cambiarEstadoCliente(supabase, user.id, id, "eliminado");
  if (!cliente) return { ok: false, error: "CLIENTE_NO_ACTUALIZADO" };
  return { ok: true, data: cliente };
}

// ── UC-05 · RegistrarMedición ──────────────────────────────────────────────
export async function registrarMedicion(
  datos: Omit<Medicion, "id" | "estado">
): Promise<ActionResult<Medicion>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const cliente = await obtenerClientePorId(supabase, datos.cliente_id);
  if (!cliente) return { ok: false, error: "CLIENTE_NO_ENCONTRADO" };
  if (cliente.estado === "eliminado") return { ok: false, error: "CLIENTE_ELIMINADO" };

  // Validación de entrada: fecha nunca futura (FECHA_FUTURA). El rango físico
  // (VALOR_FUERA_DE_RANGO_FISICO — ninguna masa > peso) NO se re-valida aquí:
  // es una regla de dominio que el CHECK de Postgres impone (Database Handbook
  // 07); si la viola, guardarMedicion devuelve null y se traduce abajo.
  if (datos.fecha > new Date().toISOString().slice(0, 10)) {
    return { ok: false, error: "FECHA_FUTURA" };
  }

  const medicion = await guardarMedicion(supabase, datos);
  if (!medicion) return { ok: false, error: "VALOR_FUERA_DE_RANGO_FISICO" };
  return { ok: true, data: medicion };
}

// ── UC-06 · CorregirMedición ───────────────────────────────────────────────
// El paso "anular" es un UPDATE de bcs_mediciones.estado. La policy que lo
// permite (acotada a vigente→anulada y a la columna `estado`) se añadió en
// supabase/migration_bcs_anular_medicion.sql — sin ella este UPDATE queda
// bloqueado por RLS y el error se detecta abajo en vez de pasar inadvertido.
export async function corregirMedicion(
  medicionId: string,
  nuevosValores: Omit<Medicion, "id" | "estado" | "cliente_id">
): Promise<ActionResult<Medicion>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const original = await obtenerMedicionPorId(supabase, medicionId);
  if (!original) return { ok: false, error: "MEDICION_NO_ENCONTRADA" };
  if (original.estado === "anulada") return { ok: false, error: "MEDICION_YA_ANULADA" };

  // Misma validación que UC-05: sin ella, una fecha futura llegaba al CHECK
  // de Postgres y volvía como VALOR_FUERA_DE_RANGO_FISICO, cuyo mensaje al
  // entrenador habla de masas y no de la fecha.
  if (nuevosValores.fecha > new Date().toISOString().slice(0, 10)) {
    return { ok: false, error: "FECHA_FUTURA" };
  }

  // Orden deliberado: primero INSERTAR, después anular.
  //
  // El fallo probable aquí es que los valores nuevos violen un CHECK (una
  // masa mayor que el peso) — depende de lo que teclee el entrenador. Si se
  // anulara primero, ese fallo dejaría al Cliente SIN esa medición y sin
  // reemplazo, y no habría vuelta atrás: la anulación es terminal (la policy
  // solo permite vigente→anulada, nunca al revés). Insertando primero, un
  // valor inválido aborta sin haber tocado la medición original.
  const nueva = await guardarMedicion(supabase, { cliente_id: original.cliente_id, ...nuevosValores });
  if (!nueva) return { ok: false, error: "VALOR_FUERA_DE_RANGO_FISICO" };

  // El resultado de anular NO se descarta: antes se ignoraba, y como la RLS
  // bloqueaba el UPDATE, quedaban dos mediciones vigentes para la misma
  // fecha mientras la UI decía "Medición corregida". El histórico las
  // mostraba duplicadas y el Reporte elegía una cualquiera como actual.
  const anulada = await anularMedicion(supabase, medicionId);
  if (!anulada) return { ok: false, error: "MEDICION_NO_ANULADA" };

  return { ok: true, data: nueva };
}

// ── UC-07 · CrearEnlacePúblico ─────────────────────────────────────────────
// El token es la ÚNICA parte no determinista de toda la capa Application, por
// diseño de seguridad (BCS-ADR-02: aleatorio criptográfico). base64url sobre
// 24 bytes → ~32 caracteres URL-safe, 192 bits de entropía (supera el mínimo
// de 21 caracteres y los ~125 bits que la Architecture Review AR-020 validó
// como inviables de fuerza bruta). La generación vive aquí (servidor) y no en
// el repositorio, cuyo contrato (BCS Handbook 13) lista guardar/revocar/
// obtener, nunca "generar".
export async function crearEnlacePublico(clienteId: string): Promise<ActionResult<EnlacePublico>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  const cliente = await obtenerClientePorId(supabase, clienteId);
  if (!cliente) return { ok: false, error: "CLIENTE_NO_ENCONTRADO" };

  // Reemplazo automático: si ya hay un enlace activo, se revoca (09-IN-1).
  const activo = await obtenerEnlaceActivoPorCliente(supabase, clienteId);
  if (activo) await revocarEnlace(supabase, activo.id);

  const token = randomBytes(24).toString("base64url");
  const enlace = await guardarEnlace(supabase, { cliente_id: clienteId, token });
  if (!enlace) return { ok: false, error: "ENLACE_NO_CREADO" };
  return { ok: true, data: enlace };
}

// ── UC-08 · RevocarEnlacePúblico ───────────────────────────────────────────
export async function revocarEnlacePublico(enlaceId: string): Promise<ActionResult<EnlacePublico>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  const supabase = await createClient();
  // La existencia + propiedad las resuelve la RLS: revocar un enlace ajeno o
  // inexistente devuelve null (ENLACE_NO_ENCONTRADO). La precondición
  // "ya revocado" (ENLACE_YA_REVOCADO) NO se puede detectar: el repositorio
  // (Sprint 2, congelado) no expone obtenerEnlacePorId para leer el estado
  // antes de actuar — se documenta como limitación en el informe.
  const enlace = await revocarEnlace(supabase, enlaceId);
  if (!enlace) return { ok: false, error: "ENLACE_NO_ENCONTRADO" };
  return { ok: true, data: enlace };
}
