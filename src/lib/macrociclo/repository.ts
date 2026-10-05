// ── Repositorio de macrociclos — único acceso a su tabla ───────────────────
//
// Misma disciplina que el repositorio de plantillas: cada función opera sobre
// UN agregado y NINGUNA decide permisos. La propiedad la impone la RLS de
// Postgres (FT-01/BE-04); comprobarla aquí crearía un segundo sitio donde se
// decide quién ve qué, y acabarían discrepando.

import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

import { contenidoVacio, semanaVacia } from './contenido';
import type {
  BandaPlan,
  Competencia,
  ContenidoMacrociclo,
  EstadoMacrociclo,
  FilaPlan,
  Macrociclo,
  Mesociclo,
  SemanaPlan,
} from './tipos';

function registrarFallo(operacion: string, error: PostgrestError | null) {
  // Sin esto, «la tabla no existe» y «este entrenador no tiene macrociclos»
  // son indistinguibles en pantalla, y una migración sin aplicar puede pasar
  // un sprint entero escondida detrás de un estado vacío bien redactado.
  if (error) console.error(`[macrociclo/repository] ${operacion}:`, error.message, error.code ?? '');
}

type Fila = Record<string, unknown>;

const texto = (v: unknown): string => (typeof v === 'string' ? v : '');
const textoONulo = (v: unknown): string | null => (typeof v === 'string' && v !== '' ? v : null);

/**
 * Reconstruye el documento desde el JSONB.
 *
 * Las tres listas se comprueban una a una en vez de confiar en el tipo: lo que
 * vuelve de la base es `unknown`, y un documento guardado por una versión
 * anterior puede no tener una clave que hoy damos por segura. Un `undefined`
 * aquí reventaría al pintar la rejilla, tres capas más arriba.
 */
export function mapContenido(v: unknown, semanas = 0): ContenidoMacrociclo {
  if (v === null || typeof v !== 'object') return contenidoVacio(semanas);
  const o = v as Record<string, unknown>;

  // ── LA LISTA DE SEMANAS SE RELLENA AL LEER, NO AL PINTAR ────────────────
  //
  //   `bandas`, `semanas` y `competencias` llegaron en MAC-3: un documento
  //   guardado antes no los tiene. Si la lista de semanas sale más corta que
  //   el plan, cada acceso a la última semana da `undefined` y la rejilla
  //   revienta al pintarla.
  //
  //   Se normaliza aquí, en el único sitio por el que pasa todo lo que viene
  //   de la base. Hacerlo en la interfaz obligaría a repetir el respaldo en
  //   cada componente, y bastaría olvidarlo en uno.
  const largo = Math.max(0, Math.trunc(semanas));
  const guardadas = Array.isArray(o.semanas) ? (o.semanas as SemanaPlan[]) : [];

  return {
    bandas: Array.isArray(o.bandas) ? (o.bandas as BandaPlan[]) : [],
    semanas: Array.from({ length: largo }, (_, i) => guardadas[i] ?? semanaVacia()),
    competencias: Array.isArray(o.competencias) ? (o.competencias as Competencia[]) : [],
    mesociclos: Array.isArray(o.mesociclos)
      ? (o.mesociclos as Mesociclo[]).map((m) => ({
          ...m,
          tipoId: typeof m.tipoId === 'string' ? m.tipoId : null,
        }))
      : [],
    // `grafico` llegó en MAC-2: los documentos guardados antes no lo tienen y
    // sin esto salen con `undefined`, que no es `null` y rompe la comparación
    // de la curva. Se normaliza al leer, no al pintar.
    filas: Array.isArray(o.filas)
      ? (o.filas as FilaPlan[]).map((f) => ({
          ...f,
          grafico: typeof f.grafico === 'string' ? f.grafico : null,
          grupo: typeof f.grupo === 'string' ? f.grupo : null,
        }))
      : [],
    dias: Array.isArray(o.dias) ? o.dias : [],
  };
}

export function mapMacrociclo(fila: Fila): Macrociclo {
  return {
    id: texto(fila.id),
    entrenadorId: texto(fila.entrenador_id),
    atletaId: textoONulo(fila.atleta_id),
    nombre: texto(fila.nombre),
    objetivo: textoONulo(fila.objetivo),
    fechaInicio: textoONulo(fila.fecha_inicio),
    semanas: typeof fila.semanas === 'number' ? fila.semanas : 12,
    modeloId: textoONulo(fila.modelo_id),
    contenido: mapContenido(
      fila.contenido,
      typeof fila.semanas === 'number' ? fila.semanas : 12,
    ),
    estado: texto(fila.estado) as EstadoMacrociclo,
    createdAt: texto(fila.created_at),
    actualizadoEl: texto(fila.actualizado_el),
  };
}

export async function obtenerMacrociclo(
  supabase: SupabaseClient,
  id: string,
): Promise<Macrociclo | null> {
  const { data, error } = await supabase.from('macrociclos').select('*').eq('id', id).maybeSingle();
  registrarFallo('obtenerMacrociclo', error);
  return data ? mapMacrociclo(data) : null;
}

/** Los del entrenador, el más reciente primero. Las archivados se excluyen. */
export async function listarMacrociclos(
  supabase: SupabaseClient,
  entrenadorId: string,
  opts?: { atletaId?: string; incluirArchivados?: boolean },
): Promise<Macrociclo[]> {
  let query = supabase
    .from('macrociclos')
    .select('*')
    .eq('entrenador_id', entrenadorId)
    .order('actualizado_el', { ascending: false });

  if (opts?.atletaId !== undefined) query = query.eq('atleta_id', opts.atletaId);
  if (!opts?.incluirArchivados) query = query.neq('estado', 'archivado');

  const { data, error } = await query;
  registrarFallo('listarMacrociclos', error);
  return (data ?? []).map(mapMacrociclo);
}

export async function crearMacrociclo(
  supabase: SupabaseClient,
  entrada: {
    entrenadorId: string;
    atletaId: string | null;
    nombre: string;
    objetivo: string | null;
    fechaInicio: string | null;
    semanas: number;
    modeloId: string | null;
    contenido: ContenidoMacrociclo;
  },
): Promise<Macrociclo | null> {
  const { data, error } = await supabase
    .from('macrociclos')
    .insert({
      entrenador_id: entrada.entrenadorId,
      atleta_id: entrada.atletaId,
      nombre: entrada.nombre,
      objetivo: entrada.objetivo,
      fecha_inicio: entrada.fechaInicio,
      semanas: entrada.semanas,
      modelo_id: entrada.modeloId,
      contenido: entrada.contenido,
    })
    .select()
    .single();

  registrarFallo('crearMacrociclo', error);
  return data ? mapMacrociclo(data) : null;
}

/**
 * Guarda el documento y la cabecera.
 *
 * Se escriben JUNTOS y no por separado porque `semanas` y la longitud de las
 * filas tienen que cuadrar: guardar una sin la otra dejaría en la base un
 * documento que viola la invariante 1, y a partir de ahí cada lectura lo daría
 * por bueno.
 */
export async function guardarMacrociclo(
  supabase: SupabaseClient,
  id: string,
  cambios: {
    nombre?: string;
    objetivo?: string | null;
    fechaInicio?: string | null;
    semanas?: number;
    atletaId?: string | null;
    estado?: EstadoMacrociclo;
    contenido?: ContenidoMacrociclo;
  },
): Promise<Macrociclo | null> {
  const parche: Record<string, unknown> = { actualizado_el: new Date().toISOString() };
  if (cambios.nombre !== undefined) parche.nombre = cambios.nombre;
  if (cambios.objetivo !== undefined) parche.objetivo = cambios.objetivo;
  if (cambios.fechaInicio !== undefined) parche.fecha_inicio = cambios.fechaInicio;
  if (cambios.semanas !== undefined) parche.semanas = cambios.semanas;
  if (cambios.atletaId !== undefined) parche.atleta_id = cambios.atletaId;
  if (cambios.estado !== undefined) parche.estado = cambios.estado;
  if (cambios.contenido !== undefined) parche.contenido = cambios.contenido;

  const { data, error } = await supabase
    .from('macrociclos')
    .update(parche)
    .eq('id', id)
    .select()
    .single();

  registrarFallo('guardarMacrociclo', error);
  return data ? mapMacrociclo(data) : null;
}

export async function borrarMacrociclo(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from('macrociclos').delete().eq('id', id);
  registrarFallo('borrarMacrociclo', error);
  return error === null;
}
