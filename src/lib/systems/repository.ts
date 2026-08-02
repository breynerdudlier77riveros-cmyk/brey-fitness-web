// ── Repositorio de systems — único punto de acceso a esta tabla ────────────
// Encapsula la tabla catálogo-espejo `systems` (Database Handbook 04). El
// catálogo RICO (colores, iconos, fases) vive en código versionado
// (src/data/sistemas.ts, ADR-009); este repositorio solo lee el espejo
// liviano de la base de datos — destino de FKs y flags de disponibilidad/
// precio. Sirve a los endpoints GET /sistemas y GET /sistemas/{slug}
// (API Contract Handbook 07).
//
// Mismo patrón que los demás repositorios: el SupabaseClient llega como
// primer parámetro, nunca se construye adentro; ninguna fila cruda se
// devuelve sin pasar por su mapper.

import type { SupabaseClient } from '@supabase/supabase-js';
import { mapSistemaCatalogo } from '@/lib/database/mappers';
import type { SistemaCatalogo } from '@/lib/types';

export async function getSistemas(supabase: SupabaseClient): Promise<SistemaCatalogo[]> {
  const { data } = await supabase.from('systems').select('*');
  return (data ?? []).map(mapSistemaCatalogo);
}

export async function getSistemaBySlug(
  supabase: SupabaseClient,
  slug: string
): Promise<SistemaCatalogo | null> {
  const { data } = await supabase.from('systems').select('*').eq('slug', slug).maybeSingle();
  return data ? mapSistemaCatalogo(data) : null;
}
