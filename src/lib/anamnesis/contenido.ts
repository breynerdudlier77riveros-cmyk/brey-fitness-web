// ── Anamnesis · núcleo puro ─────────────────────────────────────────────────
//
// Sin React ni Supabase. El documento es un diccionario plano (ver tipos.ts):
// no hay nada que "estructuralmente" pueda quedar inválido (no hay ids que
// puedan duplicarse, no hay arrays que reordenar), así que a diferencia de
// `cursos/contenido.ts` o `macrociclo/contenido.ts` aquí no hace falta un
// `problemasDe` que recorra el documento — guardar un diccionario con
// cualquier combinación de claves/valores string siempre es válido.

import type { AnamnesisDatos } from './tipos';

/** Limpia claves con string vacío para no acumular basura en el JSONB. */
export function normalizar(datos: AnamnesisDatos): AnamnesisDatos {
  const limpio: AnamnesisDatos = {};
  for (const [clave, valor] of Object.entries(datos)) {
    if (valor !== '') limpio[clave] = valor;
  }
  return limpio;
}
