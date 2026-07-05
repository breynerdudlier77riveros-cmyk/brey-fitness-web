// Constantes del sitio. NEXT_PUBLIC_SITE_URL debe apuntar al dominio real en
// producción (ver .env.example) — la usan el sitemap, robots y los metadatos.
export const SITE_NAME = 'Brey Fitness';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// REVISAR ANTES DE LANZAR: correo real de soporte.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contacto@breyfitness.com';
