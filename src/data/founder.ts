// ── Fundador: Breyner Riveros (decisión D4, jul 2026) ───────────────────────
// REGLA DE ORO DE ESTE ARCHIVO: solo datos verdaderos y verificables.
// La autoridad falsa destruye marcas. Nada de "experto mundial", "el mejor",
// ni cifras infladas. Los slots vacíos se ocultan solos en la interfaz.
//
// PENDIENTES DEL FUNDADOR:
// 1. FOTO: añade una fotografía profesional en public/historia/ y apunta
//    `fotoPerfil` a ella. Mientras sea null, se muestra el monograma BR.
// 2. FORMACIÓN: está en su versión más conservadora ("estudiante de último
//    año"). Si ya estás titulado, cámbiala a
//    "Licenciado en Educación Física y Deportes".
// 3. CERTIFICACIONES: añade cada certificación real al array cuando la
//    obtengas — la tarjeta aparece sola cuando el array tenga datos.

export interface FounderPhoto {
  src: string;
  alt: string;
  caption: string;
}

export interface FounderStat {
  value: string;
  label: string;
}

export interface CredencialCard {
  titulo: string;
  items: string[];
}

export const founder = {
  nombre: 'Breyner Riveros',
  titulo: 'Educador físico · Atleta de calistenia · Entrenador',
  ubicacion: 'Colombia',

  // REVISAR: foto profesional pendiente — null muestra el monograma BR.
  fotoPerfil: null as FounderPhoto | null,

  // Manifiesto personal — palabras del fundador, verbatim.
  manifiesto:
    'Mi objetivo no es vender rutinas. Mi objetivo es ayudar a las personas a entrenar con criterio. Durante años he combinado la práctica de la calistenia, el entrenamiento de fuerza y mi formación en educación física para desarrollar una metodología basada en biomecánica, fisiología del ejercicio y planificación del entrenamiento.',

  intro:
    'Detrás del Brey Performance System hay barras, competencia, formación en educación física y una obsesión: que la gente entrene con criterio, no con rutinas copiadas.',

  bio: [
    'La calistenia fue mi escuela. Más de seis años entrenando en las barras y compitiendo en Street Workout me enseñaron algo que ningún libro enseña igual: el progreso real no se improvisa. Cada habilidad que hoy parece imposible se construye con paciencia, método y miles de repeticiones bien pensadas.',
    'La práctica sola no me bastaba — quería entender el porqué. La formación en educación física y deportes me dio el otro lado de la ecuación: biomecánica, fisiología del ejercicio y planificación del entrenamiento. Como entrenador personal aprendí a traducir esa ciencia a personas reales, con cuerpos, horarios y objetivos distintos.',
    'El Brey Performance System nace de unir esos dos mundos. Del atleta que sabe lo que se siente estancarse, y del educador físico que sabe por qué ocurre y cómo salir. He desarrollado proyectos de investigación y mi norte es uno solo: entrenamiento basado en evidencia, no en tendencias.',
  ],

  fotos: [] as FounderPhoto[],

  stats: [
    { value: '+6', label: 'Años entrenando calistenia' },
    { value: '5', label: 'Sistemas de entrenamiento diseñados' },
    { value: '4', label: 'Especialidades del sistema' },
  ] satisfies FounderStat[],

  credenciales: [
    {
      titulo: 'Formación',
      items: [
        // REVISAR: si ya estás titulado → "Licenciado en Educación Física y Deportes"
        'Licenciatura en Educación Física y Deportes — estudiante de último año',
      ],
    },
    {
      titulo: 'Experiencia',
      items: [
        '+6 años entrenando calistenia',
        'Competidor de Street Workout',
        'Entrenador personal',
      ],
    },
    {
      titulo: 'Investigación',
      items: [
        'Desarrollo de proyectos de investigación',
        'Entrenamiento basado en evidencia',
      ],
    },
    {
      titulo: 'Especialidades',
      items: ['Calistenia', 'Hipertrofia', 'Fuerza', 'Planificación'],
    },
  ] satisfies CredencialCard[],

  // Se muestra solo cuando tenga datos (certificaciones reales, no promesas).
  certificaciones: [] as string[],

  cierre:
    'Mi objetivo no es vender rutinas. Es que entrenes con criterio — y que dentro de diez años sigas entrenando.',
};
