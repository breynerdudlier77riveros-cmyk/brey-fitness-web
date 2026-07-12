// ── Presencia social de BREY (decisión D7) ──────────────────────────────────
// Componente 100% dinámico: una red con `url: null` NO se renderiza en
// ningún lugar del sitio — sin huecos ni enlaces rotos (Constitución, ley 5).
// Para activar una red: pega la URL real y aparece sola en footer y /contacto.

export type RedId =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "linkedin";

export interface RedSocial {
  id: RedId;
  /** Etiqueta visible y aria-label. */
  etiqueta: string;
  /** null = la red aún no existe → se oculta automáticamente. */
  url: string | null;
}

export const redes: RedSocial[] = [
  { id: "instagram", etiqueta: "Instagram · BREY",    url: "https://instagram.com/brey_trainersw" },
  { id: "instagram", etiqueta: "Instagram · Breyner", url: "https://instagram.com/breyner_sw" },
  { id: "tiktok",    etiqueta: "TikTok",              url: null },
  { id: "youtube",   etiqueta: "YouTube",             url: null },
  { id: "facebook",  etiqueta: "Facebook",            url: null },
  { id: "linkedin",  etiqueta: "LinkedIn",            url: null },
];

export function redesActivas(): (RedSocial & { url: string })[] {
  return redes.filter((r): r is RedSocial & { url: string } => r.url !== null);
}
