'use server';

// ── Macrociclos · casos de uso del entrenador ──────────────────────────────
//
// Patrón BE-01, el mismo que `plantillas/actions.ts`: valida sesión, valida
// entrada, orquesta el repositorio, devuelve DTO o código de error. Sin SQL,
// sin JSX y sin reglas de dominio — las transformaciones del documento están
// en `contenido.ts` y se llaman desde aquí.
//
// EL OWNERSHIP LO IMPONE LA RLS. Una acción que recibe un id ajeno no
// encuentra la fila y sale `NO_ENCONTRADO`. No se vuelve a comprobar el dueño
// en TypeScript (FT-01/BE-04): dos comprobaciones que discrepen son peores
// que una sola.
//
// ── TODO EXPORT ES ASYNC ──────────────────────────────────────────────────
//
// Un fichero `'use server'` exige que CADA export sea una función asíncrona.
// Por eso aquí no hay constantes ni tipos exportados: viven en `tipos.ts` y en
// `contenido.ts`, que son módulos normales.

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/user';
import type { ActionResult } from '@/lib/types';

import {
  borrarMacrociclo,
  guardarMacrociclo,
  obtenerMacrociclo,
} from './repository';
import { crearMacrociclo as crearEnRepo } from './repository';
import { contenidoVacio, problemasDe, redimensionar } from './contenido';
import { modeloDe } from './modelos';
import { sembrarConModelo, sembrarPlanGrafico } from './sembrar';
import type { ContenidoMacrociclo, EstadoMacrociclo, Macrociclo } from './tipos';
import { MAX_SEMANAS, MIN_SEMANAS } from './tipos';

const RUTA = '/app/rendimiento/macrociclo';

/**
 * Crea un macrociclo, sembrado con un modelo si se pide.
 *
 * Sembrar crea los mesociclos con su nombre y su orden, y las filas con sus
 * renglones. NINGUNA CELDA SALE RELLENA: el modelo aporta la estructura y el
 * entrenador aporta cada cifra, que es la línea que sostiene el subsistema.
 */
export async function accionCrearMacrociclo(entrada: {
  nombre: string;
  atletaId: string | null;
  objetivo: string | null;
  fechaInicio: string | null;
  semanas: number;
  modeloId: string | null;
  /**
   * `plan_grafico` siembra las bandas de periodo y etapa y una fila por cada
   * contenido de preparación; `vacio` no siembra nada. En los dos casos, ni
   * una celda sale rellena.
   */
  plantilla?: 'vacio' | 'plan_grafico';
}): Promise<ActionResult<Macrociclo>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const nombre = entrada.nombre.trim();
  if (nombre === '') return { ok: false, error: 'NOMBRE_VACIO' };

  const semanas = Math.trunc(entrada.semanas);
  if (!Number.isFinite(semanas) || semanas < MIN_SEMANAS || semanas > MAX_SEMANAS) {
    return { ok: false, error: 'SEMANAS_FUERA_DE_RANGO' };
  }

  // Un modelo que no existe es un error de programación, no un plan sin
  // modelo: fallar aquí evita crear un macrociclo que dice venir de un modelo
  // inexistente.
  const modelo = entrada.modeloId === null ? null : modeloDe(entrada.modeloId);
  if (entrada.modeloId !== null && modelo === null) {
    return { ok: false, error: 'MODELO_DESCONOCIDO' };
  }

  // Con modelo se siembran además sus mesociclos; sin él, solo el esqueleto.
  // `vacio` deja el documento sin una sola fila, que es lo que quiere quien
  // trae su propia estructura.
  const plantilla = entrada.plantilla ?? 'plan_grafico';
  let contenido: ContenidoMacrociclo;
  if (plantilla === 'vacio') {
    contenido = contenidoVacio(semanas);
  } else if (modelo === null) {
    contenido = sembrarPlanGrafico(semanas);
  } else {
    contenido = sembrarConModelo(semanas, modelo.id) ?? sembrarPlanGrafico(semanas);
  }

  const problemas = problemasDe(contenido, semanas);
  if (problemas.length > 0) return { ok: false, error: `CONTENIDO_INVALIDO: ${problemas[0]}` };

  const supabase = await createClient();
  const creado = await crearEnRepo(supabase, {
    entrenadorId: user.id,
    atletaId: entrada.atletaId,
    nombre,
    objetivo: entrada.objetivo,
    fechaInicio: entrada.fechaInicio,
    semanas,
    modeloId: entrada.modeloId,
    contenido,
  });
  if (!creado) return { ok: false, error: 'NO_CREADO' };

  revalidatePath(RUTA);
  return { ok: true, data: creado };
}

/**
 * Guarda el documento completo.
 *
 * SE COMPRUEBA LA ESTRUCTURA ANTES DE ESCRIBIR. Un documento incoherente que
 * llega a la base se arrastra para siempre, porque a partir de ahí cada
 * lectura lo da por bueno. Es barato comprobarlo y carísimo descubrirlo tarde.
 */
export async function accionGuardarContenido(
  id: string,
  contenido: ContenidoMacrociclo,
): Promise<ActionResult<Macrociclo>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const actual = await obtenerMacrociclo(supabase, id);
  if (!actual) return { ok: false, error: 'NO_ENCONTRADO' };

  const problemas = problemasDe(contenido, actual.semanas);
  if (problemas.length > 0) return { ok: false, error: `CONTENIDO_INVALIDO: ${problemas[0]}` };

  const guardado = await guardarMacrociclo(supabase, id, { contenido });
  if (!guardado) return { ok: false, error: 'NO_GUARDADO' };

  revalidatePath(`${RUTA}/${id}`);
  return { ok: true, data: guardado };
}

/**
 * Cambia el número de semanas y REDIMENSIONA el documento en la misma
 * operación.
 *
 * Las dos cosas juntas y no por separado: guardar `semanas` sin redimensionar
 * las filas dejaría en la base un documento que viola la invariante 1, y
 * redimensionar sin guardar `semanas` lo dejaría al revés. Una de las dos
 * escrituras podría fallar, y el estado intermedio es inconsistente en los dos
 * sentidos.
 */
export async function accionCambiarSemanas(
  id: string,
  semanas: number,
): Promise<ActionResult<Macrociclo>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const n = Math.trunc(semanas);
  if (!Number.isFinite(n) || n < MIN_SEMANAS || n > MAX_SEMANAS) {
    return { ok: false, error: 'SEMANAS_FUERA_DE_RANGO' };
  }

  const supabase = await createClient();
  const actual = await obtenerMacrociclo(supabase, id);
  if (!actual) return { ok: false, error: 'NO_ENCONTRADO' };

  const contenido = redimensionar(actual.contenido, n);
  const problemas = problemasDe(contenido, n);
  if (problemas.length > 0) return { ok: false, error: `CONTENIDO_INVALIDO: ${problemas[0]}` };

  const guardado = await guardarMacrociclo(supabase, id, { semanas: n, contenido });
  if (!guardado) return { ok: false, error: 'NO_GUARDADO' };

  revalidatePath(`${RUTA}/${id}`);
  return { ok: true, data: guardado };
}

/** Cabecera: nombre, objetivo, fecha, atleta y estado. */
export async function accionGuardarCabecera(
  id: string,
  cambios: {
    nombre?: string;
    objetivo?: string | null;
    fechaInicio?: string | null;
    atletaId?: string | null;
    estado?: EstadoMacrociclo;
  },
): Promise<ActionResult<Macrociclo>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  if (cambios.nombre !== undefined && cambios.nombre.trim() === '') {
    return { ok: false, error: 'NOMBRE_VACIO' };
  }

  const supabase = await createClient();
  const guardado = await guardarMacrociclo(supabase, id, {
    ...cambios,
    nombre: cambios.nombre?.trim(),
  });
  if (!guardado) return { ok: false, error: 'NO_ENCONTRADO' };

  revalidatePath(`${RUTA}/${id}`);
  return { ok: true, data: guardado };
}

export async function accionBorrarMacrociclo(id: string): Promise<ActionResult<{ id: string }>> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'NO_AUTENTICADO' };

  const supabase = await createClient();
  const ok = await borrarMacrociclo(supabase, id);
  if (!ok) return { ok: false, error: 'NO_BORRADO' };

  revalidatePath(RUTA);
  return { ok: true, data: { id } };
}
