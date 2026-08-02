// Constantes del sitio. NEXT_PUBLIC_SITE_URL debe apuntar al dominio real en
// producción (ver .env.example) — la usan el sitemap, robots y los metadatos.
export const SITE_NAME = 'Brey Fitness';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

// REVISAR ANTES DE LANZAR: correo real de soporte.
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'contacto@breyfitness.com';

// Prefijo de la app privada — usado por SiteChrome.tsx (omitir Navbar/Footer
// de marketing) y robots.ts (disallow). El matcher de src/proxy.ts NO puede
// leer esta constante — Next.js exige que sea un literal estático en ese
// archivo — así que ese único lugar sigue con "/app" escrito a mano.
export const APP_PREFIX = '/app';

// Rutas de autenticación — tampoco llevan chrome de marketing (tienen su
// propio layout minimalista en app/(auth)/layout.tsx).
export const AUTH_ROUTES = ['/login', '/signup', '/reset-password', '/update-password'];

// Reporte público del BCS por token. Tampoco lleva chrome de marketing: es un
// documento clínico que el entrenador entrega a su cliente, y el cliente no
// es un visitante de la landing. Sin esto, quien abría el enlace se
// encontraba el Navbar con "Entrar"/"Crear cuenta" y el Footer con los
// enlaces legales del sitio alrededor de su informe.
export const REPORT_PREFIX = '/reportes';
