// ── Repositorio de plantillas — único acceso a sus dos tablas ──────────────
//
// Encapsula `plantillas` y `plantilla_enlaces`. Misma disciplina que el
// repositorio del BCS: cada función opera sobre UN agregado, ninguna decide
// permisos —eso lo hace la RLS— y ninguna compone documentos, que es trabajo
// de la capa de aplicación.
//
// La excepción declarada es `obtenerPorToken`, que sí lee las dos tablas de
// una vez. No es una comodidad: la ruta pública entra por el token y sin la
// plantilla el enlace no dice nada. Devolver primero el enlace y volver a
// preguntar por la plantilla serían dos viajes y una ventana en la que el
// token resuelve y el documento no.

import type { PostgrestError, SupabaseClient } from '@supabase/supabase-js';

import { mapEnlacePlantilla, mapPlantilla } from '@/lib/database/mappers';
import type {
  Ajustes,
  Contenido,
  EnlacePlantilla,
  EstadoPlantilla,
  Plantilla,
} from '@/lib/plantillas/tipos';

/**
 * Deja rastro de un fallo real sin cambiar el contrato.
 *
 * Misma razón que en el repositorio del BCS: sin esto, «la tabla no existe»
 * y «este entrenador no tiene plantillas» son indistinguibles en pantalla, y
 * una migración sin aplicar puede pasar un sprint entero escondida detrás de
 * un estado vacío perfectamente redactado.
 */
function registrarFallo(operacion: string, error: PostgrestError | null) {
  if (error) console.error(`[plantillas/repository] ${operacion}:`, error.message, error.code ?? '');
}

// ── RepositorioPlantilla ───────────────────────────────────────────────────

export async function obtenerPlantillaPorId(
  supabase: SupabaseClient,
  id: string,
): Promise<Plantilla | null> {
  const { data, error } = await supabase.from('plantillas').select('*').eq('id', id).maybeSingle();
  registrarFallo('obtenerPlantillaPorId', error);
  return data ? mapPlantilla(data) : null;
}

/** Las del entrenador, la más reciente primero. Las archivadas se excluyen salvo que se pidan. */
export async function listarPlantillas(
  supabase: SupabaseClient,
  entrenadorId: string,
  opts?: { incluirArchivadas?: boolean },
): Promise<Plantilla[]> {
  let query = supabase
    .from('plantillas')
    .select('*')
    .eq('entrenador_id', entrenadorId)
    .order('actualizado_el', { ascending: false });

  if (!opts?.incluirArchivadas) query = query.neq('estado', 'archivada');

  const { data, error } = await query;
  registrarFallo('listarPlantillas', error);
  return (data ?? []).map(mapPlantilla);
}

/**
 * Crea o actualiza. Sin `id` inserta; con `id`, actualiza.
 *
 * `actualizado_el` se pone aquí y no con un trigger: la lista ordena por él y
 * un trigger obligaría a una migración más para algo que este es el único
 * sitio que escribe.
 */
export async function guardarPlantilla(
  supabase: SupabaseClient,
  entrenadorId: string,
  datos: {
    id?: string;
    nombre: string;
    descripcion?: string | null;
    semanas?: number;
    contenido?: Contenido;
    estado?: EstadoPlantilla;
  },
): Promise<Plantilla | null> {
  const fila: Record<string, unknown> = {
    entrenador_id: entrenadorId,
    nombre: datos.nombre,
    actualizado_el: new Date().toISOString(),
  };

  // Solo se escribe lo que llega. Omitir una clave es «no la toques», y sin
  // esa distinción renombrar una plantilla desde la lista le borraría el
  // contenido.
  if (datos.descripcion !== undefined) fila.descripcion = datos.descripcion;
  if (datos.semanas !== undefined) fila.semanas = datos.semanas;
  if (datos.contenido !== undefined) fila.contenido = datos.contenido;
  if (datos.estado !== undefined) fila.estado = datos.estado;
  if (datos.id) fila.id = datos.id;

  const { data, error } = await supabase
    .from('plantillas')
    .upsert(fila, { onConflict: 'id' })
    .select()
    .single();

  registrarFallo('guardarPlantilla', error);
  return data ? mapPlantilla(data) : null;
}

export async function borrarPlantilla(supabase: SupabaseClient, id: string): Promise<boolean> {
  const { error } = await supabase.from('plantillas').delete().eq('id', id);
  registrarFallo('borrarPlantilla', error);
  return error === null;
}

// ── RepositorioEnlace ──────────────────────────────────────────────────────

/** Todos los enlaces de una plantilla, activos y revocados. */
export async function listarEnlaces(
  supabase: SupabaseClient,
  plantillaId: string,
): Promise<EnlacePlantilla[]> {
  const { data, error } = await supabase
    .from('plantilla_enlaces')
    .select('*')
    .eq('plantilla_id', plantillaId)
    .order('created_at', { ascending: false });

  registrarFallo('listarEnlaces', error);
  return (data ?? []).map(mapEnlacePlantilla);
}

/**
 * El enlace activo de un destino, o `null`.
 *
 * `clienteId === null` busca el genérico. En PostgREST eso NO es `eq.null`
 * —que compara con la cadena «null»— sino `is.null`, y confundirlos devuelve
 * siempre vacío sin dar error.
 */
export async function obtenerEnlaceActivo(
  supabase: SupabaseClient,
  plantillaId: string,
  clienteId: string | null,
): Promise<EnlacePlantilla | null> {
  let query = supabase
    .from('plantilla_enlaces')
    .select('*')
    .eq('plantilla_id', plantillaId)
    .eq('estado', 'activo');

  query = clienteId === null ? query.is('cliente_id', null) : query.eq('cliente_id', clienteId);

  const { data, error } = await query.maybeSingle();
  registrarFallo('obtenerEnlaceActivo', error);
  return data ? mapEnlacePlantilla(data) : null;
}

export async function guardarEnlace(
  supabase: SupabaseClient,
  datos: {
    id?: string;
    plantilla_id: string;
    cliente_id: string | null;
    token?: string;
    ajustes?: Ajustes;
    nota?: string | null;
  },
): Promise<EnlacePlantilla | null> {
  const fila: Record<string, unknown> = {
    plantilla_id: datos.plantilla_id,
    cliente_id: datos.cliente_id,
  };
  if (datos.id) fila.id = datos.id;
  if (datos.token !== undefined) fila.token = datos.token;
  if (datos.ajustes !== undefined) fila.ajustes = datos.ajustes;
  if (datos.nota !== undefined) fila.nota = datos.nota;

  const { data, error } = await supabase
    .from('plantilla_enlaces')
    .upsert(fila, { onConflict: 'id' })
    .select()
    .single();

  registrarFallo('guardarEnlace', error);
  return data ? mapEnlacePlantilla(data) : null;
}

export async function revocarEnlace(
  supabase: SupabaseClient,
  enlaceId: string,
): Promise<EnlacePlantilla | null> {
  const { data, error } = await supabase
    .from('plantilla_enlaces')
    .update({ estado: 'revocado' })
    .eq('id', enlaceId)
    .select()
    .single();

  registrarFallo('revocarEnlace', error);
  return data ? mapEnlacePlantilla(data) : null;
}

// ── Resolución del token (acceso anónimo) ──────────────────────────────────

/**
 * El enlace y su plantilla, por token. Sin sesión.
 *
 * Se le pasa el cliente ADMIN desde la capa de aplicación: la RLS de las dos
 * tablas exige `auth.uid()` y aquí no hay ninguno. Es el mismo camino que el
 * UC-09 del BCS, y el único de todo el subsistema que lo toma.
 *
 * Devuelve `null` sin distinguir por qué: token inexistente, revocado y
 * plantilla archivada dan el mismo resultado. Distinguirlos en pantalla
 * confirmaría a quien prueba tokens al azar cuáles existen.
 */
export async function resolverToken(
  admin: SupabaseClient,
  token: string,
): Promise<{ enlace: EnlacePlantilla; plantilla: Plantilla } | null> {
  const { data, error } = await admin
    .from('plantilla_enlaces')
    .select('*, plantillas(*)')
    .eq('token', token)
    .eq('estado', 'activo')
    .maybeSingle();

  registrarFallo('resolverToken', error);
  if (!data) return null;

  const fila = data as Record<string, unknown>;
  const anidada = fila.plantillas as Record<string, unknown> | null;
  if (!anidada) return null;

  const plantilla = mapPlantilla(anidada);
  if (plantilla.estado === 'archivada') return null;

  return { enlace: mapEnlacePlantilla(fila), plantilla };
}
