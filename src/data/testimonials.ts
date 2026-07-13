// ── Testimonios reales ──────────────────────────────────────────────────────
// INTEGRIDAD: aquí solo van testimonios de personas reales, con su permiso.
// Mientras el array esté vacío, la sección de testimonios no se muestra en
// ninguna página (no se renderiza nada). Los testimonios inventados destruyen
// la credibilidad de una marca que vende evidencia científica.
//
// Para añadir uno: nombre (o nombre + inicial), iniciales para el avatar,
// Testimonio REAL de una persona real, resultado concreto y su comentario.
//
// BREY v2.1 — "Casos reales": se extiende el tipo (tiempo, progreso, foto)
// para mostrar más que una cita — sin inventar nada nuevo, cada campo sigue
// exigiendo un dato real cuando llegue el primer testimonio.

export interface Testimonial {
  nombre: string;
  iniciales: string;
  color: string; // gradiente tailwind del avatar, ej. "from-orange-600 to-amber-700"
  objetivo: string; // resultado concreto, ej. "Primera dominada en 6 semanas"
  sistema: string; // uno de los 5 Sistemas del BPS
  tiempo: string; // duración real hasta el resultado, ej. "12 semanas"
  comentario: string;
  estrellas: number; // 1–5
  /** Serie corta real (ej. peso o volumen semanal) para el mini-gráfico. Vacío = no se muestra gráfico. */
  progreso?: number[];
  /** Foto real opcional — sin ella, se usan las iniciales como avatar (nunca una foto de stock). */
  foto?: { src: string; alt: string };
}

export const testimonios: Testimonial[] = [];
