'use server';

// ── Cursos · casos de uso (Sprint CURSO-1) ─────────────────────────────────
//
// Mismo patrón que macrociclo/actions.ts y plantillas/actions.ts: valida
// sesión, valida entrada, orquesta el repositorio, devuelve DTO o código de
// error. Las transformaciones del documento están en `contenido.ts`.
//
// ── DOS TIPOS DE ACCIÓN, DOS COMPROBACIONES DISTINTAS ─────────────────────
//
//   Las de ADMIN comprueban `profile.es_admin` en TypeScript porque la RLS
//   de `sistema_contenido`/`compras` YA exige lo mismo — es la misma
//   comprobación dos veces, a propósito: la de aquí da un mensaje legible
//   («NO_AUTORIZADO»); si alguna vez discreparan, la RLS manda y la fila
//   simplemente no se escribe.
//
//   Las del COMPRADOR (marcar lección vista) no comprueban nada en
//   TypeScript: se apoyan enteramente en que `progreso_leccion` solo admite
//   escribir sobre una compra propia (RLS), igual que el resto del proyecto
//   impone ownership por RLS y no por una segunda comprobación (FT-01/BE-04).

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getUser } from '@/lib/supabase/user';
import { getProfile } from '@/lib/profile/repository';
import type { ActionResult } from '@/lib/types';

import {
  agregarMaterial,
  eliminarMaterial as eliminarMaterialDeContenido,
  problemasDe,
} from './contenido';
import {
  compraActivaDe,
  guardarContenido as guardarContenidoEnRepo,
  marcarLeccionVista as marcarLeccionVistaEnRepo,
  obtenerContenido,
  otorgarAcceso,
  revocarAcceso as revocarAccesoEnRepo,
} from './repository';
import type { ContenidoSistema, Material } from './tipos';

const BUCKET = 'sistema-recursos';
const RUTA_ADMIN = '/app/admin/sistemas';

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

/** Reemplaza el contenido entero de un Sistema. Valida antes de guardar. */
export async function accionGuardarContenido(
  sistemaSlug: string,
  contenido: ContenidoSistema,
): Promise<ActionResult<null>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const problemas = problemasDe(contenido);
  if (problemas.length > 0) return { ok: false, error: 'CONTENIDO_INVALIDO', detalle: problemas };

  const supabase = await createClient();
  const guardado = await guardarContenidoEnRepo(supabase, sistemaSlug, contenido);
  if (!guardado) return { ok: false, error: 'NO_GUARDADO' };

  revalidatePath(`${RUTA_ADMIN}/${sistemaSlug}`);
  return { ok: true, data: null };
}

/**
 * Sube un material (PDF u otro archivo) al bucket privado y lo añade a la
 * lección. Se usa el cliente de Service Role para la subida porque el
 * bucket no lleva políticas de `storage.objects` (ver `migration_cursos.sql`
 * — la comprobación de quién puede escribir vive aquí, en `exigirAdmin`, no
 * en Storage).
 */
export async function accionSubirMaterial(
  sistemaSlug: string,
  moduloId: string,
  leccionId: string,
  formData: FormData,
): Promise<ActionResult<Material>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const archivo = formData.get('archivo');
  if (!(archivo instanceof File) || archivo.size === 0) {
    return { ok: false, error: 'ARCHIVO_VACIO' };
  }
  // 50 MB: un PDF de curso no debería pasar de ahí, y un límite explícito
  // evita que un archivo enorme se cuelgue a medio subir sin que nadie sepa
  // por qué falló.
  if (archivo.size > 50 * 1024 * 1024) {
    return { ok: false, error: 'ARCHIVO_DEMASIADO_GRANDE' };
  }

  const supabaseAdmin = createAdminClient();
  const nombreLimpio = archivo.name.replace(/[^\p{L}\p{N}._-]/gu, '_');
  const path = `${sistemaSlug}/${crypto.randomUUID()}-${nombreLimpio}`;

  const { error: errorSubida } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, archivo, { contentType: archivo.type || undefined });
  if (errorSubida) return { ok: false, error: 'NO_SUBIDO', detalle: errorSubida.message };

  const supabase = await createClient();
  const contenido = await obtenerContenido(supabase, sistemaSlug);
  const siguiente = agregarMaterial(contenido, moduloId, leccionId, {
    nombre: archivo.name,
    archivoPath: path,
  });
  const guardado = await guardarContenidoEnRepo(supabase, sistemaSlug, siguiente);
  if (!guardado) {
    // El archivo ya subió; no dejarlo huérfano en Storage sin decirlo,
    // pero tampoco reintentar solo — el admin decide si reintenta guardar.
    return { ok: false, error: 'SUBIDO_PERO_NO_GUARDADO' };
  }

  revalidatePath(`${RUTA_ADMIN}/${sistemaSlug}`);
  const nuevo = siguiente.modulos
    .find((m) => m.id === moduloId)
    ?.lecciones.find((l) => l.id === leccionId)
    ?.materiales.at(-1);
  if (!nuevo) return { ok: false, error: 'NO_GUARDADO' };
  return { ok: true, data: nuevo };
}

export async function accionEliminarMaterial(
  sistemaSlug: string,
  moduloId: string,
  leccionId: string,
  materialId: string,
  archivoPath: string,
): Promise<ActionResult<null>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const supabase = await createClient();
  const contenido = await obtenerContenido(supabase, sistemaSlug);
  const siguiente = eliminarMaterialDeContenido(contenido, moduloId, leccionId, materialId);
  const guardado = await guardarContenidoEnRepo(supabase, sistemaSlug, siguiente);
  if (!guardado) return { ok: false, error: 'NO_GUARDADO' };

  // El archivo se borra DESPUÉS de guardar el documento, no antes: si el
  // guardado fallara, el material seguiría apuntando a un archivo que
  // todavía existe, que es el error recuperable — el contrario (documento
  // ya sin el material, archivo ya borrado, y el guardado falla) no tiene
  // vuelta atrás.
  const supabaseAdmin = createAdminClient();
  await supabaseAdmin.storage.from(BUCKET).remove([archivoPath]);

  revalidatePath(`${RUTA_ADMIN}/${sistemaSlug}`);
  return { ok: true, data: null };
}

/** Otorga acceso manual a un Sistema — cortesías, soporte, pruebas. */
export async function accionOtorgarAccesoManual(
  sistemaSlug: string,
  email: string,
): Promise<ActionResult<null>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const limpio = email.trim().toLowerCase();
  if (limpio === '' || !limpio.includes('@')) return { ok: false, error: 'EMAIL_INVALIDO' };

  const supabaseAdmin = createAdminClient();
  const compra = await otorgarAcceso(supabaseAdmin, {
    sistemaSlug,
    email: limpio,
    origen: 'manual',
  });
  if (!compra) return { ok: false, error: 'NO_OTORGADO' };

  revalidatePath(`${RUTA_ADMIN}/${sistemaSlug}`);
  return { ok: true, data: null };
}

export async function accionRevocarAcceso(
  sistemaSlug: string,
  email: string,
): Promise<ActionResult<null>> {
  const admin = await exigirAdmin();
  if (!admin.ok) return admin.error;

  const supabaseAdmin = createAdminClient();
  await revocarAccesoEnRepo(supabaseAdmin, sistemaSlug, email);

  revalidatePath(`${RUTA_ADMIN}/${sistemaSlug}`);
  return { ok: true, data: null };
}

/** Marca una lección como vista, para quien la compró. */
export async function accionMarcarLeccionVista(
  sistemaSlug: string,
  leccionId: string,
): Promise<ActionResult<null>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const compra = await compraActivaDe(supabase, sistemaSlug, user.id);
  if (!compra) return { ok: false, error: 'SIN_ACCESO' };

  await marcarLeccionVistaEnRepo(supabase, compra.id, leccionId);
  return { ok: true, data: null };
}

/**
 * Una URL firmada para descargar/ver un material, válida por 10 minutos.
 * Comprueba la compra activa ANTES de firmar — el bucket es privado y sin
 * esto cualquiera con el `archivoPath` (que viaja en el HTML de la lección)
 * podría pedir su propia URL firmada sin haber pagado.
 */
export async function accionUrlMaterial(
  sistemaSlug: string,
  archivoPath: string,
): Promise<ActionResult<string>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const compra = await compraActivaDe(supabase, sistemaSlug, user.id);
  if (!compra) return { ok: false, error: 'SIN_ACCESO' };

  const supabaseAdmin = createAdminClient();
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(archivoPath, 60 * 10);
  if (error || !data) return { ok: false, error: 'NO_DISPONIBLE' };

  return { ok: true, data: data.signedUrl };
}
