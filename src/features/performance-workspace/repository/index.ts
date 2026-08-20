// ── Repositorio del Performance Workspace (Sprint PAS-7.0) ─────────────────
// Único punto de acceso a las cuatro tablas `pas_*`. Completamente separado
// del BCS: no importa ni una función de `lib/bcs/repository`, y ninguna
// consulta de aquí toca una tabla de composición corporal.
//
// El ownership lo impone la RLS. Estas funciones no vuelven a decidir
// permisos: persisten y leen.

import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { columnasDeValor, mapAtleta, mapEnlace, mapEvaluacion, mapRegistro } from './mappers';
import type {
  Atleta,
  EnlacePublico,
  EntradaAtleta,
  EntradaEvaluacion,
  EntradaRegistro,
  EstadoAtleta,
  EstadoEvaluacion,
  Evaluacion,
  RegistroWorkspace,
} from '../schemas/tipos';

/**
 * Deja rastro de un fallo sin cambiar el contrato de lectura.
 *
 * Mismo motivo que en el BCS: sin esto, «tabla inexistente» y «este
 * profesional aún no tiene atletas» se ven exactamente igual en pantalla, y
 * una migración sin aplicar puede pasar un sprint entero sin detectarse.
 */
function registrarFallo(operacion: string, error: PostgrestError | null) {
  if (error) console.error(`[pas/repository] ${operacion}:`, error.message, error.code ?? '');
}

// ── Atletas ────────────────────────────────────────────────────────────────

export async function listarAtletas(
  supabase: SupabaseClient,
  profesionalId: string,
  opts?: { estado?: EstadoAtleta; limit?: number }
): Promise<Atleta[]> {
  let query = supabase
    .from('pas_atletas')
    .select('*')
    .eq('profesional_id', profesionalId)
    .neq('estado', 'eliminado');

  if (opts?.estado) query = query.eq('estado', opts.estado);

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(opts?.limit ?? 100);

  registrarFallo('listarAtletas', error);
  return (data ?? []).map(mapAtleta);
}

export async function obtenerAtleta(
  supabase: SupabaseClient,
  id: string
): Promise<Atleta | null> {
  const { data, error } = await supabase.from('pas_atletas').select('*').eq('id', id).maybeSingle();
  registrarFallo('obtenerAtleta', error);
  return data ? mapAtleta(data) : null;
}

export async function crearAtleta(
  supabase: SupabaseClient,
  profesionalId: string,
  entrada: EntradaAtleta
): Promise<Atleta | null> {
  const { data, error } = await supabase
    .from('pas_atletas')
    .insert({
      profesional_id: profesionalId,
      nombre: entrada.nombre.trim(),
      documento: entrada.documento?.trim() || null,
      codigo_interno: entrada.codigoInterno?.trim() || null,
      deporte: entrada.deporte?.trim() || null,
      fecha_nacimiento: entrada.fechaNacimiento || null,
      sexo: entrada.sexo ?? null,
      pais: entrada.pais?.trim() || null,
      estatura_cm: entrada.estaturaCm ?? null,
      notas: entrada.notas || null,
    })
    .select()
    .single();

  registrarFallo('crearAtleta', error);
  return data ? mapAtleta(data) : null;
}

export async function actualizarAtleta(
  supabase: SupabaseClient,
  id: string,
  entrada: EntradaAtleta
): Promise<Atleta | null> {
  const { data, error } = await supabase
    .from('pas_atletas')
    .update({
      nombre: entrada.nombre.trim(),
      documento: entrada.documento?.trim() || null,
      codigo_interno: entrada.codigoInterno?.trim() || null,
      deporte: entrada.deporte?.trim() || null,
      fecha_nacimiento: entrada.fechaNacimiento || null,
      sexo: entrada.sexo ?? null,
      pais: entrada.pais?.trim() || null,
      estatura_cm: entrada.estaturaCm ?? null,
      notas: entrada.notas || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  registrarFallo('actualizarAtleta', error);
  return data ? mapAtleta(data) : null;
}

export async function cambiarEstadoAtleta(
  supabase: SupabaseClient,
  id: string,
  estado: EstadoAtleta
): Promise<Atleta | null> {
  const { data, error } = await supabase
    .from('pas_atletas')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  registrarFallo('cambiarEstadoAtleta', error);
  return data ? mapAtleta(data) : null;
}

// ── Evaluaciones ───────────────────────────────────────────────────────────

export async function listarEvaluaciones(
  supabase: SupabaseClient,
  atletaId: string,
  opts?: { limit?: number }
): Promise<Evaluacion[]> {
  const { data, error } = await supabase
    .from('pas_evaluaciones')
    .select('*')
    .eq('atleta_id', atletaId)
    .order('fecha', { ascending: false })
    .limit(opts?.limit ?? 100);

  registrarFallo('listarEvaluaciones', error);
  return (data ?? []).map(mapEvaluacion);
}

export async function obtenerEvaluacion(
  supabase: SupabaseClient,
  id: string
): Promise<Evaluacion | null> {
  const { data, error } = await supabase
    .from('pas_evaluaciones')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  registrarFallo('obtenerEvaluacion', error);
  return data ? mapEvaluacion(data) : null;
}

export async function crearEvaluacion(
  supabase: SupabaseClient,
  entrada: EntradaEvaluacion
): Promise<Evaluacion | null> {
  const { data, error } = await supabase
    .from('pas_evaluaciones')
    .insert({
      atleta_id: entrada.atletaId,
      tipo: entrada.tipo,
      fecha: entrada.fecha,
      // El peso de ESTA evaluación (G-01). `undefined` y `null` acaban ambos en
      // NULL, que es «no consta» — nunca se hereda de otra evaluación.
      peso_kg: entrada.pesoKg ?? null,
      observaciones: entrada.observaciones || null,
    })
    .select()
    .single();

  registrarFallo('crearEvaluacion', error);
  return data ? mapEvaluacion(data) : null;
}

export async function cambiarEstadoEvaluacion(
  supabase: SupabaseClient,
  id: string,
  estado: EstadoEvaluacion
): Promise<Evaluacion | null> {
  const { data, error } = await supabase
    .from('pas_evaluaciones')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  registrarFallo('cambiarEstadoEvaluacion', error);
  return data ? mapEvaluacion(data) : null;
}

// ── Registros ──────────────────────────────────────────────────────────────

export async function listarRegistros(
  supabase: SupabaseClient,
  evaluacionId: string
): Promise<RegistroWorkspace[]> {
  const { data, error } = await supabase
    .from('pas_registros')
    .select('*')
    .eq('evaluacion_id', evaluacionId)
    .order('created_at', { ascending: true });

  registrarFallo('listarRegistros', error);
  return (data ?? []).map(mapRegistro);
}

/**
 * Los registros, distinguiendo «no hay» de «no se pudieron leer» (PRS-2.4).
 *
 * `listarRegistros` devuelve `[]` en los dos casos, y aguas abajo eso se
 * convierte en «esta evaluación no tiene pruebas registradas» — una afirmación
 * sobre el trabajo del profesional que un fallo de red no autoriza a hacer.
 *
 * Esta variante no reemplaza a la anterior: la tabla de registros puede seguir
 * mostrando una lista vacía sin más. La usa el informe normativo, que sí tiene
 * que separar el estado técnico del estado de dominio.
 */
export async function leerRegistros(
  supabase: SupabaseClient,
  evaluacionId: string
): Promise<
  | { estado: 'OK'; registros: RegistroWorkspace[] }
  | { estado: 'ERROR'; mensaje: string; codigo: string | null }
> {
  const { data, error } = await supabase
    .from('pas_registros')
    .select('*')
    .eq('evaluacion_id', evaluacionId)
    .order('created_at', { ascending: true });

  if (error) {
    registrarFallo('leerRegistros', error);
    return { estado: 'ERROR', mensaje: error.message, codigo: error.code ?? null };
  }

  return { estado: 'OK', registros: (data ?? []).map(mapRegistro) };
}

export async function crearRegistro(
  supabase: SupabaseClient,
  entrada: EntradaRegistro
): Promise<RegistroWorkspace | null> {
  const { data, error } = await supabase
    .from('pas_registros')
    .insert({
      evaluacion_id: entrada.evaluacionId,
      prueba_id: entrada.pruebaId,
      fecha: entrada.fecha,
      ...columnasDeValor(entrada.valor),
      condiciones: entrada.condiciones ?? {},
      precondiciones_cumplidas: entrada.precondicionesCumplidas ?? null,
      patron: entrada.patron || null,
      observaciones: entrada.observaciones || null,
    })
    .select()
    .single();

  registrarFallo('crearRegistro', error);
  return data ? mapRegistro(data) : null;
}

/** Anula. Un registro NUNCA se edita (PAS I-01); la RLS solo permite `estado`. */
export async function anularRegistro(
  supabase: SupabaseClient,
  id: string
): Promise<boolean> {
  const { error } = await supabase
    .from('pas_registros')
    .update({ estado: 'anulada' })
    .eq('id', id)
    .eq('estado', 'vigente');

  registrarFallo('anularRegistro', error);
  return !error;
}

// ── Enlaces públicos ───────────────────────────────────────────────────────

export async function obtenerEnlaceActivo(
  supabase: SupabaseClient,
  evaluacionId: string
): Promise<EnlacePublico | null> {
  const { data, error } = await supabase
    .from('pas_enlaces_publicos')
    .select('*')
    .eq('evaluacion_id', evaluacionId)
    .eq('activo', true)
    .maybeSingle();

  registrarFallo('obtenerEnlaceActivo', error);
  return data ? mapEnlace(data) : null;
}

export async function crearEnlace(
  supabase: SupabaseClient,
  evaluacionId: string,
  token: string
): Promise<EnlacePublico | null> {
  const { data, error } = await supabase
    .from('pas_enlaces_publicos')
    .insert({ evaluacion_id: evaluacionId, token })
    .select()
    .single();

  registrarFallo('crearEnlace', error);
  return data ? mapEnlace(data) : null;
}

export async function revocarEnlace(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase
    .from('pas_enlaces_publicos')
    .update({ activo: false, revocado_at: new Date().toISOString() })
    .eq('id', id);

  registrarFallo('revocarEnlace', error);
  return !error;
}
