import { founder } from "@/data/founder";

// ── Fotos y videos de la home ───────────────────────────────────────────────
// Mientras `src` sea null, el espacio muestra un fondo neutro (en desarrollo
// lleva además una nota con lo que va ahí). Para llenarlo: copia el archivo a
// public/media/ y escribe su ruta, p. ej. src: "/media/hero.mp4".
// El retrato sale de founder.fotoPerfil: se edita allí y sirve también en /historia.
//
// Video del hero (original 1124.mp4, 4K HEVC 36 MB — Chrome/Firefox no lo
// reproducen): convertido a H.264 sin audio con ffmpeg.
//   hero-1080.mp4  1920×1080 CRF 25 ≈ 4,1 MB → pantallas ≥ 768 px
//   hero-movil.mp4 recorte central 960×1080 CRF 27 ≈ 1,9 MB → celular
//   hero-poster.jpg primer fotograma: se ve al instante y con movimiento reducido
// calistenia es un fotograma 4K del mismo video; manifiesto y planche son
// fotografías propias (nov 2026), recortadas a 3:4 con ffmpeg.

export interface MediaSlotData {
  tipo: "foto" | "video";
  src: string | null;
  /** Solo video: versión liviana para pantallas < 768 px. */
  srcMovil?: string | null;
  /** Solo video: fotograma fijo que se ve mientras carga y con movimiento reducido. */
  poster?: string | null;
  alt: string;
  formato: string;
  pide: string;
}

export const media = {
  hero: {
    tipo: "video",
    src: "/media/hero-1080.mp4",
    srcMovil: "/media/hero-movil.mp4",
    poster: "/media/hero-poster.jpg",
    alt: "Breyner Riveros haciendo front lever, planche y muscle up en las barras de un parque",
    formato: "16:9 horizontal · 8 a 15 s en bucle · sin audio",
    pide: "Tú ejecutando una skill (front lever, planche o muscle up) en el parque, con luz de tarde",
  },
  manifiesto: {
    tipo: "foto",
    src: "/media/manifiesto-planche.jpg",
    alt: "Breyner sosteniendo una planche sobre parallettes en el andén de un parque",
    formato: "3:4 vertical",
    pide: "Tú corrigiendo la técnica de un atleta: coaching real, no posado",
  },
  sistemaCalistenia: {
    tipo: "foto",
    src: "/media/calistenia-front-lever.jpg",
    alt: "Front lever en la barra del parque al anochecer",
    formato: "4:5 vertical",
    pide: "Front lever o planche en barras del parque, cuerpo completo en el encuadre",
  },
  sistemaHipertrofia: {
    tipo: "foto",
    src: null,
    alt: "Entrenamiento con mancuernas en el gimnasio",
    formato: "4:5 vertical",
    pide: "Ejercicio con pesas en el gimnasio (press o remo con mancuernas), luz natural",
  },
  sistemaHibrido: {
    tipo: "foto",
    src: null,
    alt: "Sesión que combina barra olímpica y calistenia",
    formato: "4:5 vertical",
    pide: "Sesión que mezcle gym y calistenia: peso muerto o dominadas lastradas",
  },
  planche: {
    tipo: "foto",
    src: "/media/planche-competencia.jpg",
    alt: "Breyner sosteniendo una planche sobre las barras paralelas, con público al fondo",
    formato: "3:4 vertical (se recorta a lo ancho en pantallas grandes)",
    pide: "Una skill sostenida, a todo lo ancho",
  },
  fundadorRetrato: {
    tipo: "foto",
    src: founder.fotoPerfil?.src ?? null,
    alt: founder.fotoPerfil?.alt ?? "Retrato de Breyner Riveros",
    formato: "4:5 vertical",
    pide: "Retrato profesional mirando a cámara, ropa de entrenamiento sobria, fondo limpio",
  },
} satisfies Record<string, MediaSlotData>;
