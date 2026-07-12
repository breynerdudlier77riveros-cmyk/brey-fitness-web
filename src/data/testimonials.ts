// ── Testimonios reales ──────────────────────────────────────────────────────
// INTEGRIDAD: aquí solo van testimonios de personas reales, con su permiso.
// Mientras el array esté vacío, la sección de testimonios no se muestra en
// ninguna página (no se renderiza nada). Los testimonios inventados destruyen
// la credibilidad de una marca que vende evidencia científica.
//
// Para añadir uno: nombre (o nombre + inicial), iniciales para el avatar,
// Testimonio REAL de una persona real, resultado concreto y su comentario.

export interface Testimonial {
  nombre: string;
  iniciales: string;
  color: string; // gradiente tailwind del avatar, ej. "from-orange-600 to-amber-700"
  objetivo: string; // resultado concreto, ej. "Primera dominada en 6 semanas"
  sistema: string; // uno de los 5 Sistemas del BPS
  comentario: string;
  estrellas: number; // 1–5
}

export const testimonios: Testimonial[] = [];
