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

// ── Id de producto en Hotmart, para casar el webhook con el Sistema ───────
//
// El webhook de Hotmart (`src/app/api/webhooks/hotmart/route.ts`) recibe
// `data.product.id` — un número que Hotmart asigna al crear el producto, sin
// relación con nuestro slug. Este mapa es lo único que traduce uno al otro,
// y vive junto a `checkoutUrls` porque los dos se llenan en el MISMO
// momento: al crear el producto en el panel de Hotmart, copias su id aquí y
// su enlace de pago arriba.
//
// Con el id en null, el webhook de una compra real no encuentra a qué
// Sistema otorgar acceso y lo dice en el log — no asume ni el primer
// Sistema disponible ni ningún otro: adivinar a quién le diste acceso sería
// peor que no dárselo.
export const hotmartProductoIds: Partial<Record<string, SistemaSlug>> = {
  // '987654': 'calistenia',
};

export function sistemaDeProductoHotmart(productoId: string): SistemaSlug | null {
  return hotmartProductoIds[productoId] ?? null;
}
