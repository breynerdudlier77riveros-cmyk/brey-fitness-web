export type Category = "Nutrición" | "Entrenamiento" | "Mentalidad";
export type ContentType = "Lectura" | "Video";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: Category;
  type: ContentType;
  readTime: string;
  body: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  category: Category;
  duration: string;
  youtubeId?: string; // añade el ID de YouTube cuando tengas la URL
}

// ─── Colores compartidos (única fuente — BlogGrid y blog/[slug] la consumen) ──
export const categoryColor: Record<Category, string> = {
  Entrenamiento: "text-emerald-400",
  Nutrición: "text-violet-400",
  Mentalidad: "text-yellow-400",
};

/** Insignia pill de categoría, para la página de detalle del artículo. */
export const categoryBadge: Record<Category, string> = {
  Entrenamiento: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
  Nutrición: "text-violet-400 border-violet-500/20 bg-violet-500/10",
  Mentalidad: "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
};

export const typeBadge: Record<ContentType, { label: string; className: string }> = {
  Lectura: { label: "Lectura", className: "text-sky-400 border-sky-500/20 bg-sky-500/[0.07]" },
  Video: { label: "Video", className: "text-orange-400 border-orange-500/20 bg-orange-500/[0.07]" },
};

// ─── BLOG POSTS ──────────────────────────────────────────────────────────────
// Para añadir un nuevo artículo, copia un objeto del array y edita los campos.
export const posts: Post[] = [
  {
    slug: "ciencia-metodo-calistenia",
    title: "La Ciencia Detrás del Método: Sobrecarga Progresiva y Control de Fatiga",
    excerpt: "Descubre los principios científicos (sobrecarga progresiva y control de fatiga) que transforman un entrenamiento random en un sistema que produce resultados reales.",
    date: "2026-05-08",
    category: "Entrenamiento",
    type: "Lectura",
    readTime: "5 min",
    body: [
      "Si llevas meses sudando en el parque o en el gym y sientes que tu fuerza no aumenta y tu cuerpo no cambia, el problema no es tu esfuerzo. El problema es la ausencia de un método.",
      "La cruda realidad es que la mayoría de los atletas pasan años sin progresar porque confunden entrenar duro con entrenar bien. Aquí están los principios científicos exactos que marcan la diferencia.",
      "### 1. La Diferencia entre 'Sudar' y 'Progresar' (La Sobrecarga Progresiva)",
      "Según el Colegio Americano de Medicina Deportiva (ACSM), el principio más crítico del entrenamiento de fuerza es la sobrecarga progresiva. Sin ella, tu cuerpo no tiene ninguna razón fisiológica para cambiar.",
      "Para construir músculo y ganar fuerza real, debes exigirle a tu cuerpo más de lo que está acostumbrado a dar, de forma gradual y medible. Cada semana debe haber un estímulo mayor que la semana anterior.",
      "### 2. Fuerza Relativa y el Poder del Peso Corporal",
      "Un estudio publicado en el Journal of Exercise Science & Fitness (Kikuchi et al.) demostró que los ejercicios de peso corporal pueden inducir ganancias de fuerza e hipertrofia similares a las del press de banca pesado, siempre que se alcance una intensidad alta mediante progresiones más complejas.",
      "### 3. Gestión Científica de la Fatiga",
      "La investigación de Pareja-Blanco et al. demuestra que entrenar constantemente al fallo muscular sin recuperación adecuada produce estancamiento. Un sistema inteligente selecciona movimientos con alta relación estímulo-fatiga para maximizar la adaptación y minimizar el daño.",
      "**Referencias:** ACSM Progression Models in Resistance Training · Kikuchi et al., Journal of Exercise Science & Fitness · Pareja-Blanco et al., Effects of Acute Loading Induced Fatigability."
    ]
  },

  {
    slug: "como-empezar-en-el-gym",
    title: "Cómo empezar en el gym sin cometer los errores típicos",
    excerpt:
      "Guía definitiva para principiantes que quieren arrancar con el pie derecho y no tirar meses de esfuerzo.",
    date: "2026-04-01",
    category: "Entrenamiento",
    type: "Lectura",
    readTime: "6 min",
    body: [
      "Empezar en el gimnasio puede ser abrumador. Máquinas desconocidas, rutinas contradictorias en internet y la presión de «hacerlo bien» desde el primer día. Pero la verdad es más simple: la consistencia vale más que la perfección.",
      "El primer error que comete la mayoría es copiar la rutina de alguien avanzado. Tu cuerpo no está listo para ese volumen ni esa intensidad. Empieza con movimientos básicos — sentadilla, peso muerto, press de banca, remo — y domínalos antes de agregar variaciones.",
      "La progresión es lo que genera resultados. Cada semana debes intentar hacer un poco más que la anterior: un kilo más de peso, una repetición más, o un descanso ligeramente más corto. Ese progreso pequeño se acumula en resultados grandes.",
      "Duerme 7-9 horas. Bebe suficiente agua. Come proteína en cada comida. Sin estos tres pilares, el trabajo en el gimnasio producirá una fracción de lo que podría.",
    ],
  },
  {
    slug: "nutricion-para-ganar-musculo",
    title: "Nutrición para ganar músculo: lo que realmente importa",
    excerpt:
      "Los fundamentos de la dieta para hipertrofia que nadie te explica de forma sencilla.",
    date: "2026-04-15",
    category: "Nutrición",
    type: "Lectura",
    readTime: "8 min",
    body: [
      "Ganar músculo requiere dos cosas: un estímulo de entrenamiento suficiente y los materiales para construir. Esos materiales vienen de la comida, y el más importante es la proteína.",
      "Apunta a 1.6–2.2 gramos de proteína por kilogramo de peso corporal al día. No necesitas suplementos para llegar a esa cifra — huevos, pollo, carne, pescado, legumbres y lácteos son tus mejores aliados.",
      "El superávit calórico es necesario para ganar masa muscular de forma eficiente. Un superávit de 200–300 kcal sobre tu mantenimiento es suficiente para progresar sin acumular demasiada grasa.",
      "Los carbohidratos son combustible, no el enemigo. Priorízalos antes y después del entrenamiento para rendir mejor y recuperarte más rápido. Arroz, avena, pan, patata — elige los que más te gusten.",
    ],
  },
  {
    slug: "mentalidad-para-no-abandonar",
    title: "La mentalidad que te impedirá abandonar",
    excerpt:
      "Por qué la mayoría deja el gym en febrero y cómo asegurarte de no ser uno de ellos.",
    date: "2026-05-01",
    category: "Mentalidad",
    type: "Lectura",
    readTime: "5 min",
    body: [
      "El 80% de las personas que empiezan en el gimnasio en enero lo han abandonado para febrero. No porque sean débiles — sino porque se fijaron en el resultado equivocado.",
      "Si tu único objetivo es «verme bien», dependerás de verte bien para seguir motivado. Y los primeros meses los cambios son lentos e invisibles. Eso destruye la motivación.",
      "Cambia el enfoque: entrena para ser más fuerte, más consistente, más disciplinado. Esos avances se pueden medir semana a semana. Añadiste 5 kg a la sentadilla — eso es una victoria.",
      "La identidad es más poderosa que la motivación. Deja de decirte «quiero ir al gym» y empieza a decirte «soy alguien que entrena». Cada sesión refuerza esa identidad, y las identidades no se abandonan tan fácilmente.",
    ],
  },
  {
    slug: "cardio-vs-pesas",
    title: "Cardio vs. Pesas: ¿cuál elige tu objetivo?",
    excerpt:
      "La respuesta honesta a la pregunta que todo principiante se hace antes de empezar.",
    date: "2026-05-05",
    category: "Entrenamiento",
    type: "Lectura",
    readTime: "4 min",
    body: [
      "La dicotomía cardio vs. pesas es falsa. No son enemigos — son herramientas distintas para objetivos distintos. La pregunta correcta es: ¿qué quieres lograr?",
      "Si quieres perder grasa: ambos funcionan. Las pesas son más eficientes porque aumentan tu metabolismo basal. El cardio quema calorías durante la sesión. Lo ideal es combinarlos.",
      "Si quieres ganar músculo: las pesas son indispensables. El cardio moderado no interfiere con la ganancia muscular — el cardio excesivo sí.",
      "Si quieres salud general: necesitas los dos. La fuerza muscular y la capacidad cardiovascular son los mejores predictores de longevidad según la evidencia actual.",
    ],
  },
  {
    slug: "sueno-y-recuperacion",
    title: "Por qué el sueño es tu mejor suplemento",
    excerpt:
      "El factor de recuperación más subestimado y cómo optimizarlo para crecer más rápido.",
    date: "2026-05-10",
    category: "Mentalidad",
    type: "Lectura",
    readTime: "6 min",
    body: [
      "La hormona de crecimiento se libera principalmente durante el sueño profundo. Si duermes 5 horas, estás recortando tu capacidad de construir músculo a la mitad.",
      "No se trata solo de cantidad sino de calidad. Un cuarto oscuro, fresco y sin pantallas 30 minutos antes de dormir puede transformar la calidad de tu sueño sin cambiar nada más.",
      "La cafeína tiene una vida media de 5-6 horas. Un café a las 4pm todavía afecta tu sueño a las 10pm. Controla el timing y notarás la diferencia en semanas.",
      "Si entrenas duro y duermes mal, estás rompiendo tejido sin darle tiempo a reconstruirse. El entrenamiento es el estímulo. El sueño es donde ocurre la magia.",
    ],
  },
  {
    slug: "distribuir-proteina",
    title: "Cómo distribuir la proteína durante el día",
    excerpt:
      "La estrategia científica para maximizar la síntesis proteica con lo que ya comes.",
    date: "2026-05-12",
    category: "Nutrición",
    type: "Lectura",
    readTime: "5 min",
    body: [
      "Tu cuerpo tiene un límite de proteína que puede utilizar por comida para estimular la síntesis muscular — aproximadamente 40-50 g. Comer 150 g en una sola comida no es tan efectivo como distribuirlos en 3-4 tomas.",
      "Esto significa que el desayuno importa más de lo que crees. Si lo saltas o tomas solo café, pierdes una ventana de síntesis proteica completa.",
      "Las fuentes animales tienen todos los aminoácidos esenciales en proporciones óptimas. Si eres vegano, combina legumbres con cereales (arroz + lentejas) para completar el perfil.",
      "El timing post-entrenamiento es real pero no es una ventana mágica de 30 minutos. Come proteína después de entrenar, pero no entres en pánico si tardas una hora.",
    ],
  },
];

// ─── VIDEOS ──────────────────────────────────────────────────────────────────
// Para añadir un nuevo video, copia un objeto y edita los campos.
export const videos: Video[] = [
  {
    id: "sentadilla-perfecta",
    title: "Cómo hacer la sentadilla perfecta",
    description:
      "Técnica paso a paso para dominar el rey de los ejercicios y evitar lesiones.",
    category: "Entrenamiento",
    duration: "12:34",
  },
  {
    id: "rutina-full-body",
    title: "Rutina Full Body en 30 minutos",
    description:
      "Entrena todo el cuerpo en media hora. Ideal para días con poco tiempo.",
    category: "Entrenamiento",
    duration: "31:05",
  },
  {
    id: "meal-prep-semanal",
    title: "Meal Prep semanal fitness",
    description:
      "Prepara comida para toda la semana en 90 minutos. Recetas simples y nutritivas.",
    category: "Nutrición",
    duration: "18:22",
  },
  {
    id: "superavit-calorico",
    title: "Cómo calcular tu superávit calórico",
    description:
      "Aprende a calcular cuántas calorías necesitas para ganar músculo sin acumular grasa.",
    category: "Nutrición",
    duration: "09:15",
  },
  {
    id: "mentalidad-atleta",
    title: "La mentalidad del atleta",
    description:
      "Cómo pensar como un atleta aunque estés empezando. Hábitos y sistemas que funcionan.",
    category: "Mentalidad",
    duration: "14:48",
  },
  {
    id: "superar-estancamiento",
    title: "Cómo superar un estancamiento",
    description:
      "Qué hacer cuando llevas semanas sin progresar. Soluciones concretas y aplicables.",
    category: "Mentalidad",
    duration: "11:02",
  },
];
