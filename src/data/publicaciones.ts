// ── Publicaciones científicas ───────────────────────────────────────────────
// Misma regla de oro que founder.ts: solo publicaciones reales y verificables.
// Cada entrada lleva DOI, y los datos se transcriben de la página del artículo
// (no de la memoria). Si algún día hay una segunda, se añade al array y las
// dos vistas que lo consumen —/blog y "Tu entrenador" en la home— se adaptan
// solas, incluido el recuento.
//
// Nota de transcripción: la revista imprime el quinto autor como
// "Yerson daniel Achury"; aquí se escribe con la mayúscula que le corresponde.

export interface Publicacion {
  titulo: string;
  /** En el orden publicado. El primero es el autor principal. */
  autores: string[];
  revista: string;
  /** Volumen(número), tal y como lo pide la cita de la revista. */
  numero: string;
  anio: number;
  /** ISO, para el atributo dateTime de <time>. */
  fecha: string;
  doi: string;
  url: string;
  pdf: string;
  /** Descripción propia, no el resumen literal de la revista. */
  descripcion: string;
  temas: string[];
  licencia: { nombre: string; url: string };
}

export const publicaciones: Publicacion[] = [
  {
    titulo: "Los efectos del entrenamiento de resistencia en adultos con diabetes mellitus tipo 2",
    autores: [
      "Breyner Riveros",
      "Jhohan Alberto Pineda",
      "Nelson Enrique Toscano",
      "Maria Camila Hernández",
      "Yerson Daniel Achury",
      "Carlos Eduardo Sarmiento",
      "Oscar Mauricio Santamaria",
    ],
    revista: "Documentos de trabajo ECISA",
    numero: "8(8)",
    anio: 2026,
    fecha: "2026-10-30",
    doi: "https://doi.org/10.22490/ECISA.10127",
    url: "https://publicaciones.unad.edu.co/index.php/wp_ecisa/es/article/view/10127",
    pdf: "https://publicaciones.unad.edu.co/index.php/wp_ecisa/es/article/view/10127/8083",
    descripcion:
      "Revisión del estado del arte sobre el entrenamiento de fuerza en personas con diabetes tipo 2, a partir de la evidencia publicada desde 2018. El trabajo analiza qué ocurre con la masa libre de grasa, la fuerza, la glucosa en ayunas y la hemoglobina glicosilada según la intensidad del programa, y concluye que el entrenamiento de fuerza es parte fundamental del manejo de la enfermedad cuando se adapta a las capacidades y al contexto de cada persona.",
    temas: [
      "Diabetes mellitus tipo 2",
      "Entrenamiento de resistencia",
      "Composición corporal",
      "Fuerza muscular",
    ],
    licencia: {
      nombre: "CC BY-NC-SA 4.0",
      url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
    },
  },
];

/** Cita en formato APA, construida con los mismos datos (una sola fuente). */
export function citaApa(p: Publicacion): string {
  const autores =
    p.autores.length > 1
      ? `${p.autores.slice(0, -1).join(", ")} y ${p.autores[p.autores.length - 1]}`
      : p.autores[0];
  return `${autores} (${p.anio}). ${p.titulo}. ${p.revista}, ${p.numero}. ${p.doi}`;
}
