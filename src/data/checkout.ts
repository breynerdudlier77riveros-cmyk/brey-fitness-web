import type { SistemaSlug } from '@/lib/types';

// ── Checkout Hotmart ────────────────────────────────────────────────────────
// LANZAMIENTO: crea cada producto en Hotmart y pega aquí su enlace de pago
// (ej. "https://pay.hotmart.com/A12345678B").
//
// Productos del lanzamiento inicial (precios Colombia/LatAm):
//   · Sistema de Hipertrofia — $39 USD
//   · Sistema de Calistenia  — $49 USD
//   · Sistema Híbrido        — $59 USD
// Fuerza y Elite NO se venden todavía (disponible: false en sistemas.ts →
// muestran lista de espera, jamás un botón de compra).
//
// Mientras un Sistema disponible esté en null, su página muestra captura de
// email ("avísame cuando abra") en lugar del botón de compra — nunca un
// enlace muerto.
//
// PREPARADO PARA MEMBRESÍA: cuando exista la suscripción (v2.0), este mapa
// admite URLs de checkout recurrente de Hotmart/Stripe sin cambiar la
// arquitectura — el modelo de cobro vive en sistemas.ts (modeloPrecio).
export const checkoutUrls: Record<SistemaSlug, string | null> = {
  'hipertrofia': null,
  'calistenia': null,
  'hibrido': null,
  'fuerza': null,
  'elite': null,
};

export function getCheckoutUrl(slug: SistemaSlug): string | null {
  return checkoutUrls[slug];
}
