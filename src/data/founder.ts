// ── Historia del fundador ───────────────────────────────────────────────────
// REVISAR ANTES DE LANZAR: este contenido proviene de la web anterior (GRESH,
// historia de Gresly Natalia Rincón Díaz). Si el rostro de Brey Fitness es
// otra persona, edita ÚNICAMENTE este archivo y reemplaza las fotos en
// public/historia/. La página /historia se construye entera desde estos datos.

export interface FounderPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface FounderStat {
  value: string;
  label: string;
}

export const founder = {
  nombre: 'Gresly Natalia Rincón Díaz',
  titulo: 'Atleta de calistenia · Fundadora',
  ubicacion: 'Colombia',
  fotoPerfil: {
    src: '/historia/foto-perfil.jpg',
    alt: 'Retrato de la fundadora de Brey Fitness',
    caption: '',
  } satisfies FounderPhoto,

  intro:
    'Detrás del Brey Performance System no hay una marca sin rostro. Hay años de barras, caídas, torneos y la obsesión por entender por qué un método funciona y otro no.',

  bio: [
    'Nací en Bucaramanga, Santander. Mi vida siempre estuvo ligada al deporte: fútbol desde los 11 años, después una academia de baile. Pero mi verdadero camino lo encontré de casualidad, pasando todos los días frente a un parque de barras en Girón. Así conocí la calistenia — en un municipio donde ninguna chica practicaba este deporte.',
    'Un día me animé a empezar. Al principio hubo quien se burlaba porque no hacía bien los ejercicios, y eso se sumaba al bullying que había vivido durante toda mi secundaria. Pero alguien me dijo algo que lo cambió todo: que yo podía ser la primera mujer en Girón en practicar calistenia. Acepté el reto. Me guiaba con videos de internet y viajaba una hora para poder entrenar en un sitio mejor.',
    'Para sostener el entrenamiento trabajé de todo: mesera de noche, clases en colegios y en un centro de rehabilitación, una ruta escolar de día. El tiempo restante era para las barras. He competido en cinco torneos nacionales — Street Workout Fest, Guerrera de las Barras, Batallas de Dioses — y he dado clases grupales y exhibiciones en colegios.',
    'Este deporte no es solo físico. He enfrentado batallas silenciosas con mi salud mental — un tema del que pocos hablan y que impacta directamente el rendimiento. A pesar de las caídas, nunca dejé de entrenar. De esa experiencia nace el BPS: un sistema que gestiona la fatiga, respeta la recuperación y progresa con método, porque lo aprendí en carne propia.',
  ],

  fotos: [
    {
      src: '/historia/entrenamiento1.jpg',
      alt: 'Exhibición de calistenia en un colegio de Bucaramanga',
      caption: 'Exhibición en colegio · Bucaramanga',
    },
    {
      src: '/historia/entrenamiento2.jpg',
      alt: 'Entrenamiento en parque de barras en Girón',
      caption: 'Entrenamiento · Parque de barras, Girón',
    },
    {
      src: '/historia/competencia.jpg',
      alt: 'Competencia nacional de Street Workout',
      caption: 'Competencia nacional · Street Workout',
    },
  ] satisfies FounderPhoto[],

  stats: [
    { value: '3+', label: 'Años en las barras' },
    { value: '5', label: 'Torneos nacionales' },
    { value: '1ª', label: 'Mujer en calistenia en Girón' },
  ] satisfies FounderStat[],

  cierre:
    'Mi misión con Brey Fitness es clara: que nadie tenga que entrenar años a ciegas como me tocó a mí. Un sistema con método, evidencia y progresión — desde el primer día.',
};
