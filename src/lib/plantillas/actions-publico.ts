'use server';

// ── Plantillas · acceso anónimo por token ──────────────────────────────────
//
// El único punto del subsistema invocable sin sesión, y el único que usa el
// cliente admin. Mismo camino que el UC-09 del BCS, y por la misma razón: la
// RLS de las dos tablas exige `auth.uid()`, y quien abre el enlace no tiene
// ninguno.
//
// ── UN SOLO ESTADO DE FALLO, Y ES DELIBERADO ──────────────────────────────
//
//   El BCS distingue TOKEN_INVALIDO de TOKEN_REVOCADO en la capa de
//   aplicación y los funde en la pantalla, para no revelar si un token
//   existió. Aquí se funden ya aquí, porque hay un tercer caso —la plantilla
//   está archivada— y tres códigos que obligatoriamente pintan lo mismo son
//   tres oportunidades de que alguien pinte uno distinto por descuido.
//
//   Lo que se pierde: el registro de por qué falló. Lo que se gana: es
//   imposible filtrarlo desde la vista.
//
// ── LO QUE SE DEVUELVE YA VIENE RESUELTO ──────────────────────────────────
//
//   Si el enlace es de un cliente, los ajustes ya están aplicados sobre el
//   contenido. La vista pública no recibe «la plantilla y unos ajustes»: eso
//   la obligaría a componerlos, y sería el segundo sitio del código que sabe
//   cómo se aplican. Recibe el documento que toca enseñar.

import { createAdminClient } from '@/lib/supabase/admin';
import { aplicarAjustes } from '@/lib/plantillas/contenido';
import { resolverToken } from '@/lib/plantillas/repository';
import type { Contenido } from '@/lib/plantillas/tipos';
import type { ActionResult } from '@/lib/types';

/** Lo que ve quien abre el enlace. Sin ids internos ni rastro del token. */
export interface PlantillaPublica {
  nombre: string;
  descripcion: string | null;
  semanas: number;
  contenido: Contenido;
  /** Nombre del destinatario, si el enlace está asignado a un cliente. */
  para: string | null;
  /** Nota que el entrenador dejó en el enlace. */
  nota: string | null;
}

export async function obtenerPlantillaPublica(
  token: string,
): Promise<ActionResult<PlantillaPublica>> {
  if (!token.trim()) return { ok: false, error: 'ENLACE_NO_DISPONIBLE' };

  const admin = createAdminClient();
  const resuelto = await resolverToken(admin, token);
  if (!resuelto) return { ok: false, error: 'ENLACE_NO_DISPONIBLE' };

  const { enlace, plantilla } = resuelto;

  // Un enlace emitido antes de publicar no debería existir —la acción de
  // crear lo impide— pero si existiera, un borrador no se enseña.
  if (plantilla.estado !== 'publicada') return { ok: false, error: 'ENLACE_NO_DISPONIBLE' };

  const contenido = aplicarAjustes(plantilla.contenido, enlace.ajustes);

  // El nombre del cliente se lee aparte y solo si el enlace es suyo. En el
  // genérico no se consulta: no hay a quién nombrar, y una consulta de más
  // sería una fila de la tabla de clientes leída sin motivo.
  let para: string | null = null;
  if (enlace.cliente_id !== null) {
    const { data } = await admin
      .from('bcs_clientes')
      .select('nombre')
      .eq('id', enlace.cliente_id)
      .maybeSingle();
    para = (data?.nombre as string | undefined) ?? null;
  }

  return {
    ok: true,
    data: {
      nombre: plantilla.nombre,
      descripcion: plantilla.descripcion,
      semanas: plantilla.semanas,
      contenido,
      para,
      nota: enlace.nota,
    },
  };
}
