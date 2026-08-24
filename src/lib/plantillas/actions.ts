'use server';

// ── Plantillas · casos de uso del entrenador ───────────────────────────────
//
// Patrón BE-01, el mismo que `src/lib/bcs/actions.ts`: valida sesión, valida
// entrada, orquesta el repositorio, devuelve DTO o código de error. Sin SQL,
// sin JSX, sin reglas de dominio — las transformaciones del documento están
// en `contenido.ts` y se llaman desde aquí.
//
// EL OWNERSHIP LO IMPONE LA RLS, NO ESTE FICHERO. Una acción que recibe un id
// ajeno no encuentra la fila: la lectura devuelve `null` y sale
// PLANTILLA_NO_ENCONTRADA. No se vuelve a comprobar el dueño en TypeScript
// (FT-01/BE-04), porque una segunda comprobación que discrepe de la primera
// es peor que no tenerla.
//
// ── LO QUE ESTAS ACCIONES NO HACEN ────────────────────────────────────────
//
// No calculan cargas, no proponen progresiones y no validan si una
// prescripción tiene sentido para el atleta. `problemasDe` solo comprueba que
// la ESTRUCTURA sea la que el resto del código da por hecha. Un RIR de 8 se
// guarda sin comentarios: es criterio del entrenador y el sistema no opina.

import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/user';
import type { ActionResult } from '@/lib/types';

import {
  borrarPlantilla,
  guardarEnlace,
  guardarPlantilla,
  listarEnlaces,
  obtenerEnlaceActivo,
  obtenerPlantillaPorId,
  revocarEnlace,
} from '@/lib/plantillas/repository';
import {
  contenidoVacio,
  diaNuevo,
  podarAjustes,
  problemasDe,
  redimensionar,
} from '@/lib/plantillas/contenido';
import type {
  Ajustes,
  Contenido,
  EnlacePlantilla,
  EstadoPlantilla,
  Plantilla,
} from '@/lib/plantillas/tipos';

const RUTA = '/app/plantillas';

/** Longitud del nombre. No es una regla de negocio: es que la lista lo recorta. */
const MAX_NOMBRE = 120;

// ── Crear ──────────────────────────────────────────────────────────────────

/**
 * Una plantilla nueva, con un primer día ya creado.
 *
 * El día de más no es relleno: una plantilla completamente vacía obliga a
 * adivinar por dónde se empieza, y el primer día enseña la estructura
 * (calentamiento + trabajo principal) sin escribir nada.
 */
export async function crearPlantilla(
  nombre: string,
  semanas = 4,
): Promise<ActionResult<Plantilla>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const limpio = nombre.trim();
  if (limpio === '') return { ok: false, error: 'NOMBRE_VACIO' };
  if (limpio.length > MAX_NOMBRE) return { ok: false, error: 'NOMBRE_LARGO' };
  if (!Number.isInteger(semanas) || semanas < 1 || semanas > 24) {
    return { ok: false, error: 'SEMANAS_FUERA_DE_RANGO' };
  }

  const contenido: Contenido = { ...contenidoVacio(), dias: [diaNuevo('Día 1')] };

  const supabase = await createClient();
  const plantilla = await guardarPlantilla(supabase, user.id, {
    nombre: limpio,
    semanas,
    contenido: redimensionar(contenido, semanas),
    estado: 'borrador',
  });

  if (!plantilla) return { ok: false, error: 'PLANTILLA_NO_CREADA' };
  revalidatePath(RUTA);
  return { ok: true, data: plantilla };
}

// ── Guardar el documento ───────────────────────────────────────────────────

/**
 * Guarda el contenido completo.
 *
 * El editor manda el documento entero, no un parche. Con cuatro niveles de
 * anidamiento, un protocolo de parches sería la parte del sistema con más
 * casos límite y menos usuarios; mandar el documento cuesta unos kilobytes y
 * no tiene ninguno.
 *
 * `redimensionar` va antes de validar a propósito: si el entrenador cambió el
 * número de semanas, el contenido que manda todavía tiene el anterior, y
 * rechazarlo por eso sería castigarle por un ajuste que el sistema sabe hacer.
 */
export async function guardarContenido(
  id: string,
  datos: { nombre?: string; descripcion?: string | null; semanas: number; contenido: Contenido },
): Promise<ActionResult<Plantilla>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const existente = await obtenerPlantillaPorId(supabase, id);
  if (!existente) return { ok: false, error: 'PLANTILLA_NO_ENCONTRADA' };

  const nombre = (datos.nombre ?? existente.nombre).trim();
  if (nombre === '') return { ok: false, error: 'NOMBRE_VACIO' };
  if (nombre.length > MAX_NOMBRE) return { ok: false, error: 'NOMBRE_LARGO' };

  const contenido = redimensionar(datos.contenido, datos.semanas);

  const problemas = problemasDe(contenido, datos.semanas);
  if (problemas.length > 0) {
    return { ok: false, error: `ESTRUCTURA_INVALIDA: ${problemas[0]}` };
  }

  const plantilla = await guardarPlantilla(supabase, user.id, {
    id,
    nombre,
    descripcion: datos.descripcion,
    semanas: datos.semanas,
    contenido,
  });
  if (!plantilla) return { ok: false, error: 'PLANTILLA_NO_ACTUALIZADA' };

  // Borrar un ejercicio deja ajustes apuntando al vacío. Se podan aquí y no
  // en el editor porque el editor no conoce los enlaces de los clientes.
  await podarAjustesDeEnlaces(supabase, id, contenido);

  revalidatePath(RUTA);
  revalidatePath(`${RUTA}/${id}`);
  return { ok: true, data: plantilla };
}

/** Recorta los ajustes de cada enlace a las series que siguen existiendo. */
async function podarAjustesDeEnlaces(
  supabase: Awaited<ReturnType<typeof createClient>>,
  plantillaId: string,
  contenido: Contenido,
): Promise<void> {
  for (const enlace of await listarEnlaces(supabase, plantillaId)) {
    if (enlace.estado !== 'activo' || Object.keys(enlace.ajustes).length === 0) continue;
    const podados = podarAjustes(contenido, enlace.ajustes);
    if (Object.keys(podados).length === Object.keys(enlace.ajustes).length) continue;
    await guardarEnlace(supabase, {
      id: enlace.id,
      plantilla_id: enlace.plantilla_id,
      cliente_id: enlace.cliente_id,
      ajustes: podados,
    });
  }
}

// ── Estado ─────────────────────────────────────────────────────────────────

/**
 * Cambia el estado. Publicar es lo que habilita compartir.
 *
 * Archivar NO borra los enlaces: los deja sin resolver. Un enlace archivado
 * que vuelve a resolver al desarchivar es recuperable; uno revocado, no.
 */
export async function cambiarEstadoPlantilla(
  id: string,
  estado: EstadoPlantilla,
): Promise<ActionResult<Plantilla>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const existente = await obtenerPlantillaPorId(supabase, id);
  if (!existente) return { ok: false, error: 'PLANTILLA_NO_ENCONTRADA' };

  const plantilla = await guardarPlantilla(supabase, user.id, {
    id,
    nombre: existente.nombre,
    estado,
  });
  if (!plantilla) return { ok: false, error: 'PLANTILLA_NO_ACTUALIZADA' };

  revalidatePath(RUTA);
  return { ok: true, data: plantilla };
}

/** Borrar de verdad. Solo en borrador: lo compartido no desaparece sin avisar. */
export async function eliminarPlantilla(id: string): Promise<ActionResult<{ id: string }>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const existente = await obtenerPlantillaPorId(supabase, id);
  if (!existente) return { ok: false, error: 'PLANTILLA_NO_ENCONTRADA' };
  if (existente.estado !== 'borrador') return { ok: false, error: 'SOLO_SE_BORRA_EN_BORRADOR' };

  if (!(await borrarPlantilla(supabase, id))) {
    return { ok: false, error: 'PLANTILLA_NO_BORRADA' };
  }

  revalidatePath(RUTA);
  return { ok: true, data: { id } };
}

// ── Compartir ──────────────────────────────────────────────────────────────

/**
 * El token. Única parte no determinista de toda la capa.
 *
 * 24 bytes en base64url son 32 caracteres de alfabeto de 64: por encima del
 * mínimo de 21 que el BCS fijó, y con la misma propiedad que allí — es
 * imposible de adivinar, así que la seguridad del enlace no depende de que
 * nadie lo publique por error, sino de poder revocarlo cuando pase.
 */
const nuevoToken = (): string => randomBytes(24).toString('base64url');

/**
 * Crea o rota el enlace de un destino.
 *
 * `clienteId === null` es el enlace genérico; puesto, la asignación a ese
 * cliente. Si ya había uno activo se REVOCA antes de emitir el nuevo: dos
 * activos a la vez harían que revocar «el» enlace dejara otro vivo sin que
 * nadie lo viera en pantalla. El índice único de la migración lo impone
 * también en la base, por si esta función se saltara alguna vez.
 */
export async function crearEnlacePlantilla(
  plantillaId: string,
  clienteId: string | null = null,
): Promise<ActionResult<EnlacePlantilla>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const plantilla = await obtenerPlantillaPorId(supabase, plantillaId);
  if (!plantilla) return { ok: false, error: 'PLANTILLA_NO_ENCONTRADA' };
  if (plantilla.estado === 'archivada') return { ok: false, error: 'PLANTILLA_ARCHIVADA' };
  if (plantilla.estado === 'borrador') return { ok: false, error: 'PLANTILLA_EN_BORRADOR' };

  const activo = await obtenerEnlaceActivo(supabase, plantillaId, clienteId);
  // Los ajustes del enlace anterior se conservan: rotar el token por seguridad
  // no debería costarle al entrenador volver a teclear las cargas del cliente.
  const ajustes = activo?.ajustes ?? {};
  if (activo) await revocarEnlace(supabase, activo.id);

  const enlace = await guardarEnlace(supabase, {
    plantilla_id: plantillaId,
    cliente_id: clienteId,
    token: nuevoToken(),
    ajustes,
  });
  if (!enlace) return { ok: false, error: 'ENLACE_NO_CREADO' };

  revalidatePath(`${RUTA}/${plantillaId}`);
  return { ok: true, data: enlace };
}

export async function revocarEnlacePlantilla(
  enlaceId: string,
): Promise<ActionResult<EnlacePlantilla>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const enlace = await revocarEnlace(supabase, enlaceId);
  if (!enlace) return { ok: false, error: 'ENLACE_NO_ENCONTRADO' };

  revalidatePath(`${RUTA}/${enlace.plantilla_id}`);
  return { ok: true, data: enlace };
}

/**
 * Guarda las cargas propias de un cliente.
 *
 * Se podan contra el contenido vigente antes de escribir: un ajuste a una
 * serie que ya no existe no se guarda, para que no reaparezca si el editor
 * vuelve a crear un ejercicio con la misma dirección.
 */
export async function guardarAjustesCliente(
  enlaceId: string,
  ajustes: Ajustes,
): Promise<ActionResult<EnlacePlantilla>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const enlaces = await listarEnlacesDelUsuario(supabase, enlaceId);
  if (!enlaces) return { ok: false, error: 'ENLACE_NO_ENCONTRADO' };

  const { enlace, plantilla } = enlaces;
  if (enlace.cliente_id === null) return { ok: false, error: 'ENLACE_GENERICO_SIN_AJUSTES' };

  const guardado = await guardarEnlace(supabase, {
    id: enlace.id,
    plantilla_id: enlace.plantilla_id,
    cliente_id: enlace.cliente_id,
    ajustes: podarAjustes(plantilla.contenido, ajustes),
  });
  if (!guardado) return { ok: false, error: 'ENLACE_NO_ACTUALIZADO' };

  revalidatePath(`${RUTA}/${enlace.plantilla_id}`);
  return { ok: true, data: guardado };
}

/**
 * El enlace y su plantilla, comprobando por la RLS que sean del usuario.
 *
 * No hay `obtenerEnlacePorId` en el repositorio a propósito: un enlace suelto
 * no se puede validar sin su plantilla, y una función que lo devolviera
 * invitaría a usarlo sin ella.
 */
async function listarEnlacesDelUsuario(
  supabase: Awaited<ReturnType<typeof createClient>>,
  enlaceId: string,
): Promise<{ enlace: EnlacePlantilla; plantilla: Plantilla } | null> {
  const { data } = await supabase
    .from('plantilla_enlaces')
    .select('plantilla_id')
    .eq('id', enlaceId)
    .maybeSingle();
  if (!data) return null;

  const plantilla = await obtenerPlantillaPorId(supabase, data.plantilla_id as string);
  if (!plantilla) return null;

  const enlace = (await listarEnlaces(supabase, plantilla.id)).find((e) => e.id === enlaceId);
  return enlace ? { enlace, plantilla } : null;
}
