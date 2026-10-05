// ── El contenido de un Sistema · núcleo puro (Sprint CURSO-1) ──────────────
//
// Todo lo que decide la FORMA del contenido de un curso vive aquí, sin
// React, sin Supabase. La interfaz pinta lo que este módulo devuelve, y la
// Server Action lo guarda tal cual — mismo reparto que macrociclo/
// contenido.ts y plantillas/contenido.ts.
//
// ── LAS DOS INVARIANTES ────────────────────────────────────────────────────
//
//   1 · Los identificadores NO se reutilizan. El progreso de un comprador
//       (`progreso_leccion.leccion_id`) apunta a una lección por id; reciclar
//       uno haría que el progreso viejo se leyera sobre una lección nueva.
//
//   2 · Un módulo sin lecciones y una lección sin video son estados
//       LEGÍTIMOS mientras se construye el curso — no hay «borrador a
//       medias» prohibido. Lo único que se impide es publicar sin nada:
//       eso lo decide quien vende, no este módulo (ver `puedeVenderse`).

import { urlDeVideo } from '@/lib/plantillas/contenido';
import type { ContenidoSistema, Leccion, Material, Modulo, OrigenVideo } from './tipos';

/** Identificador estable. Mismo patrón que macrociclo/contenido.ts. */
export function nuevoId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function contenidoVacio(): ContenidoSistema {
  return { modulos: [] };
}

export function moduloNuevo(titulo: string): Modulo {
  return { id: nuevoId(), titulo: titulo.trim(), lecciones: [] };
}

export function leccionNueva(titulo: string): Leccion {
  return {
    id: nuevoId(),
    titulo: titulo.trim(),
    descripcion: null,
    videoUrl: null,
    origenVideo: null,
    gratis: false,
    materiales: [],
  };
}

/**
 * De qué plataforma es un video, por su dominio. Puramente informativo —el
 * reproductor lo usa para elegir el embed correcto— y NUNCA bloquea guardar
 * una URL de un origen que no reconoce: esas se marcan `'otro'`, no se
 * rechazan.
 */
export function detectarOrigenVideo(url: string): OrigenVideo {
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'otro';
  }
  if (host === 'youtube.com' || host === 'youtu.be' || host === 'm.youtube.com') return 'youtube';
  if (host === 'vimeo.com' || host === 'player.vimeo.com') return 'vimeo';
  return 'otro';
}

// ════════════════════════════════════════════════════════════════════════════
// EDICIONES · todas devuelven contenido nuevo, nada se muta
// ════════════════════════════════════════════════════════════════════════════

export function agregarModulo(contenido: ContenidoSistema, titulo: string): ContenidoSistema {
  const limpio = titulo.trim();
  if (limpio === '') return contenido;
  return { modulos: [...contenido.modulos, moduloNuevo(limpio)] };
}

export function renombrarModulo(
  contenido: ContenidoSistema,
  moduloId: string,
  titulo: string,
): ContenidoSistema {
  const limpio = titulo.trim();
  if (limpio === '') return contenido;
  return {
    modulos: contenido.modulos.map((m) => (m.id === moduloId ? { ...m, titulo: limpio } : m)),
  };
}

export function eliminarModulo(contenido: ContenidoSistema, moduloId: string): ContenidoSistema {
  return { modulos: contenido.modulos.filter((m) => m.id !== moduloId) };
}

/** Cambia el orden de un módulo, moviéndolo `delta` posiciones (±1 típico). */
export function moverModulo(
  contenido: ContenidoSistema,
  moduloId: string,
  delta: number,
): ContenidoSistema {
  const i = contenido.modulos.findIndex((m) => m.id === moduloId);
  const j = i + delta;
  if (i === -1 || j < 0 || j >= contenido.modulos.length) return contenido;
  const modulos = [...contenido.modulos];
  [modulos[i], modulos[j]] = [modulos[j], modulos[i]];
  return { modulos };
}

function conModulo(
  contenido: ContenidoSistema,
  moduloId: string,
  cambiar: (m: Modulo) => Modulo,
): ContenidoSistema {
  return {
    modulos: contenido.modulos.map((m) => (m.id === moduloId ? cambiar(m) : m)),
  };
}

export function agregarLeccion(
  contenido: ContenidoSistema,
  moduloId: string,
  titulo: string,
): ContenidoSistema {
  const limpio = titulo.trim();
  if (limpio === '') return contenido;
  return conModulo(contenido, moduloId, (m) => ({
    ...m,
    lecciones: [...m.lecciones, leccionNueva(limpio)],
  }));
}

export function eliminarLeccion(
  contenido: ContenidoSistema,
  moduloId: string,
  leccionId: string,
): ContenidoSistema {
  return conModulo(contenido, moduloId, (m) => ({
    ...m,
    lecciones: m.lecciones.filter((l) => l.id !== leccionId),
  }));
}

export function moverLeccion(
  contenido: ContenidoSistema,
  moduloId: string,
  leccionId: string,
  delta: number,
): ContenidoSistema {
  return conModulo(contenido, moduloId, (m) => {
    const i = m.lecciones.findIndex((l) => l.id === leccionId);
    const j = i + delta;
    if (i === -1 || j < 0 || j >= m.lecciones.length) return m;
    const lecciones = [...m.lecciones];
    [lecciones[i], lecciones[j]] = [lecciones[j], lecciones[i]];
    return { ...m, lecciones };
  });
}

/**
 * Campos editables de una lección. `videoUrl` pasa por `urlDeVideo`
 * (`plantillas/contenido.ts`) — el mismo normalizador que ya usa el editor
 * de ejercicios: acepta un enlace sin `https://` y rechaza un esquema que no
 * sea http/https. Una URL que no normaliza se guarda como `null`, no como
 * texto roto: un enlace que no lleva a ningún lado es peor que ninguno.
 */
export function escribirLeccion(
  contenido: ContenidoSistema,
  moduloId: string,
  leccionId: string,
  cambio: Partial<Pick<Leccion, 'titulo' | 'descripcion' | 'videoUrl' | 'gratis'>>,
): ContenidoSistema {
  return conModulo(contenido, moduloId, (m) => ({
    ...m,
    lecciones: m.lecciones.map((l) => {
      if (l.id !== leccionId) return l;
      const siguiente = { ...l, ...cambio };
      if (cambio.videoUrl !== undefined) {
        const normalizada = urlDeVideo(cambio.videoUrl);
        siguiente.videoUrl = normalizada;
        siguiente.origenVideo = normalizada === null ? null : detectarOrigenVideo(normalizada);
      }
      if (cambio.titulo !== undefined) siguiente.titulo = cambio.titulo.trim() || l.titulo;
      return siguiente;
    }),
  }));
}

export function agregarMaterial(
  contenido: ContenidoSistema,
  moduloId: string,
  leccionId: string,
  material: Omit<Material, 'id'>,
): ContenidoSistema {
  return conModulo(contenido, moduloId, (m) => ({
    ...m,
    lecciones: m.lecciones.map((l) =>
      l.id === leccionId
        ? { ...l, materiales: [...l.materiales, { id: nuevoId(), ...material }] }
        : l,
    ),
  }));
}

export function eliminarMaterial(
  contenido: ContenidoSistema,
  moduloId: string,
  leccionId: string,
  materialId: string,
): ContenidoSistema {
  return conModulo(contenido, moduloId, (m) => ({
    ...m,
    lecciones: m.lecciones.map((l) =>
      l.id === leccionId
        ? { ...l, materiales: l.materiales.filter((mat) => mat.id !== materialId) }
        : l,
    ),
  }));
}

// ════════════════════════════════════════════════════════════════════════════
// CONSULTAS
// ════════════════════════════════════════════════════════════════════════════

/** Todas las lecciones, en el orden en que aparecen, con el id de su módulo. */
export function leccionesEnOrden(
  contenido: ContenidoSistema,
): readonly { moduloId: string; leccion: Leccion }[] {
  return contenido.modulos.flatMap((m) => m.lecciones.map((leccion) => ({ moduloId: m.id, leccion })));
}

export function leccionDe(contenido: ContenidoSistema, leccionId: string): Leccion | null {
  return leccionesEnOrden(contenido).find((x) => x.leccion.id === leccionId)?.leccion ?? null;
}

export function totalLecciones(contenido: ContenidoSistema): number {
  return leccionesEnOrden(contenido).length;
}

/**
 * Si este contenido ya tiene algo que un comprador podría ver.
 *
 * No exige que TODO esté completo —un curso crece módulo a módulo— pero un
 * Sistema publicado con cero lecciones con video sería cobrar por una
 * carpeta vacía. Se usa para avisar en el editor, no para bloquear guardar.
 */
export function tieneContenidoVendible(contenido: ContenidoSistema): boolean {
  return leccionesEnOrden(contenido).some((x) => x.leccion.videoUrl !== null);
}

/** Qué está mal en este contenido. Lista vacía = coherente. */
export function problemasDe(contenido: ContenidoSistema): string[] {
  const problemas: string[] = [];

  const ids = [
    ...contenido.modulos.map((m) => m.id),
    ...contenido.modulos.flatMap((m) => m.lecciones.map((l) => l.id)),
    ...contenido.modulos.flatMap((m) => m.lecciones.flatMap((l) => l.materiales.map((mat) => mat.id))),
  ];
  if (new Set(ids).size !== ids.length) {
    problemas.push('Hay identificadores repetidos en el contenido.');
  }

  for (const m of contenido.modulos) {
    if (m.titulo.trim() === '') problemas.push(`Un módulo no tiene título (id ${m.id}).`);
    for (const l of m.lecciones) {
      if (l.titulo.trim() === '') problemas.push(`Una lección de «${m.titulo}» no tiene título.`);
    }
  }

  return problemas;
}
