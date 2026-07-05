import type { ProgramSlug } from '@/lib/types';

// ── Checkout Hotmart ────────────────────────────────────────────────────────
// LANZAMIENTO: crea cada producto en Hotmart y pega aquí su enlace de pago
// (ej. "https://pay.hotmart.com/A12345678B"). Mientras un programa esté en
// null, su página muestra captura de email ("avísame cuando abra") en lugar
// del botón de compra — nunca un enlace muerto.
export const checkoutUrls: Record<ProgramSlug, string | null> = {
  'performance-start': null,
  'performance-gym': null,
  'performance-calisthenics': null,
  'performance-hybrid': null,
  'performance-elite': null,
};

export function getCheckoutUrl(slug: ProgramSlug): string | null {
  return checkoutUrls[slug];
}
