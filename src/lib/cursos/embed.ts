// ── El enlace embebible de una lección (Sprint CURSO-1) ────────────────────
//
// PURO. `leccion.videoUrl` es el enlace que se copió y pegó —el que se ve al
// mirar el video en YouTube o Vimeo—, no el que sirve para un `<iframe>`. Las
// dos plataformas usan una URL de reproductor distinta de la de ver, y este
// módulo hace esa traducción una sola vez, en vez de en cada componente que
// necesite pintar un video.
//
// Un origen que no es 'youtube' ni 'vimeo' no produce ningún embed: se
// muestra como enlace normal (el visor decide cómo), porque no hay una regla
// general para convertir «cualquier URL» en un reproductor incrustado sin
// arriesgarse a construir un iframe que la plataforma real rechace.

import type { OrigenVideo } from './tipos';

function idDeYoutube(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtu.be') {
    const id = u.pathname.slice(1).split('/')[0];
    return id || null;
  }
  if (host === 'youtube.com') {
    if (u.pathname === '/watch') return u.searchParams.get('v');
    const m = u.pathname.match(/^\/(embed|shorts|live)\/([^/]+)/);
    if (m) return m[2];
  }
  return null;
}

function idDeVimeo(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\./, '');
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null;

  const m = u.pathname.match(/(\d+)/);
  return m ? m[1] : null;
}

/** La URL para un `<iframe src=…>`, o `null` si no se puede construir una. */
export function urlEmbeble(videoUrl: string | null, origenVideo: OrigenVideo | null): string | null {
  if (videoUrl === null) return null;

  if (origenVideo === 'youtube') {
    const id = idDeYoutube(videoUrl);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (origenVideo === 'vimeo') {
    const id = idDeVimeo(videoUrl);
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }
  return null;
}
