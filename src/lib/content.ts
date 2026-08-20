export type Category = "Nutrición" | "Entrenamiento" | "Mentalidad";
export type ContentType = "Lectura" | "Video";

/** Referencia bibliográfica verificada. Se cita en el cuerpo como [1], [2]… */
export interface Reference {
  id: number;
  authors: string;
  title: string;
  /** Revista, año, volumen(número):páginas */
  source: string;
  doi?: string;
  /** Aclaración sobre qué aporta o qué límite tiene. */
  note?: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: Category;
  type: ContentType;
  readTime: string;
  body: string[];
  references?: Reference[];
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
    slug: "front-lever-biomecanica-cuatro-progresiones",
    title:
      "Front Lever: las cuatro palancas. Por qué el salto más duro está al principio y no al final",
    excerpt:
      "El front lever no se entrena con fuerza de voluntad, sino con brazos de momento. Cálculo del torque de cada progresión, los músculos que lo sostienen y por qué el half no cuesta más que el tuck avanzado por fuerza, sino por asimetría.",
    date: "2026-08-19",
    category: "Entrenamiento",
    type: "Lectura",
    readTime: "14 min",
    body: [
      "Cuelgas de la barra con los brazos rectos y el cuerpo horizontal, mirando al cielo. Desde fuera parece un ejercicio de espalda. Desde dentro es un problema de física: tu cuerpo es una palanca y tú eres el punto de apoyo.",
      "[IMG:/blog/front-lever/full.jpg|**Front lever completo.** Cuerpo horizontal, piernas juntas, brazos rectos. Es el destino de una progresión que casi todo el mundo interpreta al revés.]",
      "> Aviso de honestidad: **no existe literatura biomecánica revisada por pares específica del front lever**. Busqué y lo que hay son análisis de electromiografía de dominadas y jalones, útiles por analogía pero no sobre esta figura. Los números de esta guía no salen de un estudio: salen de un **cálculo** con los parámetros antropométricos de de Leva [1], que son el estándar en biomecánica. Se distingue en todo momento qué está medido y qué está derivado.",

      "### 1. Lo que realmente estás sosteniendo",
      "La gravedad tira de cada parte de tu cuerpo hacia abajo. Como esas partes están **alejadas** del hombro, cada una genera un giro que intenta rotarte hacia el suelo. La suma de todos esos giros es el momento que tus dorsales tienen que igualar.",
      "> **Momento = peso del segmento × distancia horizontal hasta el hombro**",
      "Y ese momento no depende solo de cuánto pesas. Depende, sobre todo, de **a qué distancia del hombro está repartido ese peso**. Por eso doblar las rodillas funciona: no pesas menos, pero acercas la masa al eje.",
      "Cada progresión del front lever es la misma figura con el peso más lejos. Nada más.",

      "### 2. Las cuatro palancas, con número",
      "Aplicando los parámetros de de Leva [1] a un atleta modelo de **70 kg y 1,75 m**, y midiendo la distancia horizontal desde el hombro hasta el centro de masas de todo lo que los brazos sostienen:",
      "| Posición | Brazo de momento | Momento en el hombro | % del full | Salto |",
      "| Tuck cerrado | 0,14 H · 24 cm | 146 N·m | 54% | — |",
      "| Tuck avanzado | 0,19 H · 34 cm | 210 N·m | 77% | **+23 puntos** |",
      "| Half · una pierna | 0,19 H · 34 cm | 209 N·m | 77% | +0, pero asimétrico |",
      "| Straddle | 0,23 H · 40 cm | 247 N·m | 91% | +14 puntos |",
      "| Full | 0,25 H · 44 cm | 271 N·m | 100% | +9 puntos |",
      "**H** es tu altura. El brazo de momento escala con ella, así que los porcentajes valen para cualquiera; los newton por metro son de ese atleta modelo.",
      "[DATO:271 N·m|Momento que deben resistir los dorsales en un front lever completo. Es como sostener una barra de 28 kg a un metro por delante del hombro.]",

      "### 3. El escalón que nadie avisa",
      "Mira la última columna. El salto de **tuck a tuck avanzado son 23 puntos**. El de straddle a full, nueve. El primer escalón de la progresión es más del doble de grande que el último.",
      "[IMG:/blog/front-lever/tuck.jpg|**Tuck cerrado.** Las rodillas al pecho acercan la masa al hombro y el brazo de momento cae a la mitad. Es la posición más fácil de conseguir y la más fácil de hacer mal: si la cadera queda por debajo de la línea de los hombros, no estás haciendo un front lever.]",
      "[IMG:/blog/front-lever/avanzado.jpg|**Tuck avanzado.** La cadera se abre y las rodillas siguen dobladas. Aquí es donde el momento sube 23 puntos de golpe, y donde se atasca casi todo el mundo.]",
      "Ahí es donde la gente se estanca, y casi nadie entiende por qué: viene de conseguir el tuck en pocas semanas, asume que el ritmo se mantiene, y se encuentra con el muro más alto del camino justo después de su primera victoria.",
      "No es falta de constancia. Es que abrir las caderas manteniendo las rodillas dobladas aleja el centro de masas mucho más de lo que parece a simple vista.",

      "### 4. Por qué el half cuesta si pide el mismo momento",
      "El tuck avanzado y el half exigen prácticamente **el mismo momento**: 210 frente a 209 N·m. Y sin embargo el half se siente más difícil. La razón no está en la fuerza de los dorsales.",
      "[IMG:/blog/front-lever/half.jpg|**Half front lever.** Una pierna extendida y la otra recogida. El momento es el mismo que en el tuck avanzado; lo que cambia es que la figura deja de ser simétrica.]",
      "El tuck avanzado es **simétrico**. El half no. Al extender una sola pierna aparece un giro en el plano horizontal que ninguna de las otras posiciones genera, y que tienen que frenar los oblicuos. Estás pagando por una **cualidad distinta**, no por más de la misma.",
      "Consecuencia práctica: si el half te tumba, probablemente no necesites más dorsal. Necesitas antirrotación.",

      "### 5. Qué músculos trabajan, y para qué",
      "Una lista de músculos no sirve de nada si no dice qué hace cada uno. En el front lever hay cuatro trabajos simultáneos.",
      "#### Producir el momento en el hombro",
      "- **Dorsal ancho.** El motor. Con el brazo por encima de la cabeza y el cuerpo colgando, es quien produce la extensión de hombro que impide que te caigas.",
      "- **Redondo mayor.** Trabaja en paralelo al dorsal, misma acción.",
      "- **Porción larga del tríceps.** Cruza el hombro, así que aporta extensión, y además mantiene el codo bloqueado. Por eso el front lever quema el tríceps de una forma que sorprende la primera vez.",
      "- **Deltoides posterior** y **fibras esternales del pectoral mayor**, que desde una posición de brazo elevado tiran del húmero hacia abajo.",
      "#### Estabilizar la escápula",
      "- **Trapecio inferior, romboides y serrato anterior.** El hombro no tiene dónde apoyarse: la escápula flota sobre las costillas. Si no la fijas, el dorsal tira de un anclaje que se mueve.",
      "#### Impedir que la cadera se hunda",
      "- **Recto del abdomen, oblicuos y transverso.** El fallo más común no es soltar la barra: es que el cuerpo se rompe por la mitad.",
      "- **Glúteo mayor e isquiosurales**, que extienden la cadera y sostienen la pelvis en su sitio.",
      "> La mayoría de la gente no falla el front lever por los dorsales. Falla por el abdomen, unos segundos antes.",

      "### 6. Programación mes a mes",
      "Doce meses, asumiendo que partes de **8 a 10 dominadas estrictas** y hombros sin dolor. Tres reglas gobiernan todo el plan:",
      "- **La palanca se alarga cuando el tiempo está ganado**, nunca antes.",
      "- **No entrenes al fallo cada sesión.** El trabajo de brazo recto carga tendones, que se adaptan bastante más despacio que el músculo.",
      "- **Dos o tres sesiones por semana**, con 48 h entre ellas. Más frecuencia no acelera nada aquí.",
      "#### Meses 1-2 · Cimientos y tuck",
      "El objetivo real no es el tuck: es enseñarle al hombro a trabajar con el brazo recto bajo tensión, que es una habilidad nueva aunque lleves años entrenando.",
      "- Escapular pulls 4×8 · colgado activo 4×20 s · tuck 5×10-15 s · german hang 3×20 s · hollow body 4×30 s",
      "- **Salida:** tuck 3×20 s con la espalda horizontal.",
      "#### Meses 3-5 · Tuck avanzado, el muro",
      "Tres meses y no dos, a propósito: es el salto de 23 puntos. Aquí entra la carga para que la fuerza suba más rápido que la exigencia de la palanca.",
      "- Tuck avanzado 5×8-12 s · front lever raises 4×6 · dominadas lastradas 4×5 · jalón de brazo recto 3×12 · dragon flag negativo 4×5",
      "- **Salida:** tuck avanzado 3×15 s.",
      "#### Meses 6-8 · Half, aparece la asimetría",
      "El momento apenas sube. El foco cambia: ahora se trata de no dejar que el cuerpo gire.",
      "- Half 4×8-10 s **por lado** · tuck avanzado 3×15 s · dominadas lastradas 4×4 · dragon flag 4×4 · antirrotación 3×10 por lado",
      "- **Salida:** half 3×12 s por lado, sin giro de cadera.",
      "#### Meses 9-10 · Straddle",
      "Primera posición que se parece a un front lever de verdad. Aquí la movilidad de cadera empieza a importar: cuanto más abras, más corto el brazo de momento.",
      "- Straddle 5×5-8 s · half 3×10 s por lado · raises desde tuck avanzado 4×5 · dominadas lastradas 5×3",
      "- **Salida:** straddle 3×8 s.",
      "#### Meses 11-12 · Full",
      "El último 9%. Se ataca sobre todo con negativas: bajar desde el inverted hang te expone al momento completo más tiempo del que podrías sostenerlo estático.",
      "- Negativas 5× bajada de 5-8 s · intentos de full 5×3-5 s · straddle 3×8 s · dominadas lastradas 5×3",
      "- **Objetivo:** full 5 s limpios, y después construir hasta 10 s.",
      "> Sobre los doce meses: es una estructura, no una promesa. He visto gente hacerlo en ocho y gente tardar dos años. Lo que **no** es normal es saltarse los criterios de salida. Ahí es donde aparecen los codos.",

      "### 7. Los seis errores que estancan",
      "- **Codos doblados.** Acorta la palanca y convierte el ejercicio en otra cosa. Si el codo cede, la posición te queda grande hoy.",
      "- **Cadera hundida.** El error universal. Sin retroversión de pelvis, la lumbar se extiende y el abdomen deja de trabajar.",
      "- **Escápulas descontroladas.** Si los hombros se van hacia las orejas, el dorsal trabaja desde una base inestable.",
      "- **Cuello estirado hacia delante.** Mirar los pies rompe la línea y añade tensión cervical innecesaria.",
      "- **Alargar la palanca antes de tiempo.** Si no aguantas 15 s en tuck avanzado, el half solo te va a enseñar a hacerlo mal.",
      "- **Apnea.** Limita el tiempo de sostén y sube la tensión arterial sin necesidad.",
      "> El trabajo de brazo recto es la causa más frecuente de tendinopatía en calistenia, y no avisa: llega de golpe tras semanas sintiéndote bien. Si notas molestia en la cara interna del codo, baja una progresión y dale dos semanas. Perder dos semanas cuesta mucho menos que perder cuatro meses.",

      "### 8. Lo que hay que recordar",
      "- El front lever es un problema de **brazo de momento**, no de fuerza bruta.",
      "- El **tuck cerrado ronda la mitad** de la exigencia del full.",
      "- El salto más duro de toda la progresión es **tuck → tuck avanzado**, con 23 puntos.",
      "- El **half no pide más momento** que el tuck avanzado: pide antirrotación.",
      "- Los últimos escalones son cada vez **más pequeños en el papel** y más duros en la barra, porque los pagas cuando ya estás al límite.",
      "- Nada de esto está medido en un laboratorio sobre esta figura. Está **calculado** sobre una base antropométrica estándar [1], y así conviene leerlo.",
    ],
    references: [
      {
        id: 1,
        authors: "de Leva P.",
        title: "Adjustments to Zatsiorsky-Seluyanov's segment inertia parameters.",
        source: "Journal of Biomechanics. 1996;29(9):1223-1230",
        doi: "10.1016/0021-9290(95)00178-6",
        note: "Base antropométrica de todos los cálculos de momento de esta guía: masas relativas de segmento y posición de sus centros de masas. Los brazos de momento son derivados, no medidos.",
      },
    ],
  },
  {
    slug: "full-planche-biomecanica-torque-progresiones",
    title: "Full Planche: la guía biomecánica. Torque, palancas y por qué la half planche es la progresión que más se le acerca",
    excerpt:
      "Qué hace difícil la planche no es la fuerza, es el torque. Análisis del brazo de palanca de cada progresión, la anatomía real medida con electromiografía y por qué la half planche exige el 92% de la full.",
    date: "2026-08-09",
    category: "Entrenamiento",
    type: "Lectura",
    readTime: "14 min",
    body: [
      "La full planche es el elemento de fuerza estática más malinterpretado de la calistenia. Se entrena como si fuera un problema de fuerza bruta —más repeticiones, más aguante, más ganas— cuando en realidad es un problema de **física de palancas**.",
      "Esta guía desarma el movimiento desde la biomecánica: cuánto torque exige, dónde se genera, qué músculos lo sostienen según los estudios que lo han medido con electromiografía, y por qué la **half planche** es la progresión que mejor reproduce la exigencia real de la full.",
      "> Aviso de honestidad: en gimnasia artística la planche se llama *support scale*, y ahí sí existe literatura científica. En calistenia, casi nada de la metodología de progresiones ha sido validada en estudios. En esta guía se distingue en todo momento **qué está medido** y **qué es práctica de entrenamiento**.",

      "### 1. El problema no es tu fuerza. Es el brazo de palanca",
      "Cuando sostienes una planche, tus hombros no están «levantando tu peso». Están resistiendo un **momento de fuerza**: la tendencia de tu cuerpo a rotar hacia abajo alrededor del hombro.",
      "Ese momento —el torque— se calcula así:",
      "> **Torque = Peso del segmento × distancia horizontal hasta el hombro**",
      "La palabra clave es **horizontal**. No importa cuánto pesas: importa **a qué distancia del hombro está repartido ese peso**. Y como la distancia multiplica, alejar masa del hombro es brutalmente más caro que añadir masa cerca de él.",
      "Por eso una persona de 60 kg puede fallar la planche y sostener sin problema un pino a pulso: en el pino, todo tu cuerpo está apilado **encima** del hombro, la distancia horizontal es casi cero y el torque también.",
      "[IMG:/blog/planche/pino.jpg|**Pino.** Todo el peso corporal cae en vertical sobre el hombro: la distancia horizontal es casi cero y el torque, también.]",
      "[IMG:/blog/planche/full-parallettes.jpg|**Full planche.** El mismo atleta, el mismo peso, los mismos hombros. Lo único que ha cambiado es que ahora la masa está proyectada 46 cm por delante del hombro en lugar de encima. Esa distancia es toda la dificultad.]",

      "### 2. Cuánto torque exige realmente una full planche",
      "Para ponerle número hay que saber cuánto pesa cada segmento del cuerpo y dónde está su centro de masas. Eso está resuelto desde hace décadas: los parámetros inerciales de segmento de **de Leva** [1] son el estándar en biomecánica y son los que se usan aquí.",
      "Con un atleta modelo de **70 kg y 1,75 m**, sumando el momento de cabeza, tronco, muslos, piernas y pies respecto a la articulación del hombro:",
      "[DATO:286 N·m|Torque que deben resistir los hombros en una full planche. Equivale a sostener una barra de 29 kg a un metro de distancia.]",
      "El brazo de palanca efectivo sale a **46 cm**: es como si toda la masa suspendida —63 kg— colgara de un punto situado a medio metro por delante del hombro.",
      "Ese número explica por qué la planche no se consigue «aguantando más». Si tu hombro no produce ~286 N·m, la posición es físicamente imposible, por mucha voluntad que le pongas.",

      "### 3. La tabla que ordena todas las progresiones",
      "Aplicando el mismo cálculo a cada progresión clásica se obtiene, por fin, una jerarquía objetiva. Todos los valores son para el mismo atleta modelo:",
      "| Progresión | Torque | Brazo de palanca | % de la full |",
      "| --- | --- | --- | --- |",
      "| **Full planche** | 286 N·m | 46 cm | **100%** |",
      "| **Half lay planche** (rodillas 90°) | 265 N·m | 43 cm | **92%** |",
      "| Straddle planche (45°/lado) | 260 N·m | 42 cm | 91% |",
      "| **Half lay planche** (talones a glúteos) | 249 N·m | 40 cm | 87% |",
      "| Straddle planche (60°/lado) | 242 N·m | 39 cm | 85% |",
      "| Advanced tuck planche | 201 N·m | 33 cm | 70% |",
      "| Tuck planche | 168 N·m | 27 cm | 59% |",
      "Léela despacio, porque hay dos cosas que rompen la intuición.",
      "#### El salto grande está abajo, no arriba",
      "Entre tuck y advanced tuck hay **11 puntos** de diferencia. Entre half planche y full hay **8**. La gente asume que lo duro es el último tramo; los números dicen que el escalón más caro de toda la progresión está al principio, cuando pasas de rodillas al pecho a muslos verticales.",
      "#### El straddle no es tan fácil como parece",
      "Abrir las piernas 45° por lado solo descuenta un 9% del torque. Para bajar de verdad la exigencia hay que abrir muchísimo (60° por lado, y aun así te quedas en el 85%). El straddle **no es un atajo**: es prácticamente una full planche con las piernas separadas.",

      "### 4. Por qué la half planche es la progresión más cercana a la full",
      "Aquí está el hallazgo importante, y es puramente anatómico.",
      "En la half planche —o *half lay planche*, como se la conoce habitualmente— flexionas las rodillas manteniendo los muslos en línea con el tronco. Y ahí ocurre algo que la vista no capta: **no retiras masa de la palanca, retiras solo la masa equivocada**.",
      "- El **muslo** pesa 14,2% de tu masa corporal por pierna [1] y, en la half planche, **sigue entero, horizontal y proyectado hacia delante**.",
      "- La **pierna y el pie** juntos pesan 5,7% por lado, y son los únicos que se pliegan hacia atrás.",
      "Es decir: doblas las rodillas, la posición se ve mucho más fácil, y sin embargo has quitado menos del 6% de la masa corporal de la parte lejana de la palanca. De ahí el 92%.",
      "[DATO:92%|Del torque de la full planche es lo que exige una half planche con rodillas a 90°. Es la progresión que más fielmente reproduce su demanda mecánica.]",
      "Compáralo con el advanced tuck, que se queda en el 70%. La diferencia entre ambos no es el ángulo de la rodilla: es **dónde acaba el muslo**. En el advanced tuck el muslo se pone vertical y saca de la palanca el segmento pesado. En la half planche el muslo se queda dentro.",
      "> Esa es la razón mecánica por la que la half planche es el mejor simulador de la full planche: **conserva el segmento que más pesa en la posición que más torque genera.**",
      "Obsérvese el salto entre tuck y advanced tuck —11 puntos— frente al que separa la half lay de la full: solo 8.",

      "### 5. Qué músculos sostienen realmente la planche",
      "Aquí dejamos la física y pasamos a lo que se ha medido en laboratorio.",
      "En 2025, Rosaci y colaboradores publicaron el análisis electromiográfico más específico que existe sobre este elemento [2]. Estudiaron a **siete gimnastas especialistas en anillas** (23,9 ± 4,0 años; 65,6 ± 3,1 kg; 13 años de experiencia) sosteniendo el *support scale* —el nombre técnico de la planche— y midieron la excitación de cada músculo.",
      "El orden de activación fue este:",
      "| Músculo | Excitación (µV) |",
      "| --- | --- |",
      "| **Deltoides anterior** | 2043,2 ± 763,1 |",
      "| **Bíceps braquial** | 1737,7 ± 668,5 |",
      "| **Serrato anterior** | 1442,1 ± 443,4 |",
      "#### El deltoides anterior es el motor",
      "Sin sorpresa: es el flexor de hombro, y la planche es una lucha contra la extensión del hombro. Es el músculo que paga los 286 N·m.",
      "#### El bíceps es el segundo, y esto sí sorprende",
      "Casi nadie entrena la planche pensando en el bíceps, y sin embargo aparece en segundo lugar, muy por encima de lo que la intuición sugiere. Con el codo bloqueado en extensión, el bíceps trabaja como **estabilizador anterior del hombro y del codo**, impidiendo que la articulación colapse hacia atrás.",
      "#### El serrato anterior es el que casi nadie entrena",
      "El tercer músculo más activo es el que sostiene la **protracción escapular**: mantiene la escápula pegada y adelantada contra la caja torácica. La normativa técnica del elemento exige explícitamente «abducción escapular» [2]. Si tu serrato no aguanta, la escápula se retrae, el hombro pierde su base y la posición se cae aunque tu deltoides tuviera fuerza de sobra.",
      "[IMG:/blog/planche/serrato.jpg|El **serrato anterior**, en rojo. Nace en las costillas y se inserta en el borde interno de la escápula: al contraerse tira de ella hacia delante y la mantiene pegada a la caja torácica. Eso es la protracción escapular que el elemento exige. Ilustración de [Anatomography](https://commons.wikimedia.org/wiki/File:Serratus_anterior_muscles_lateral.png), [CC BY-SA 2.1 JP](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.es).]",

      "### 6. La lección de especificidad que ya está demostrada",
      "Esta es, para mí, la parte más útil de toda la evidencia disponible, y va directa a cómo entrenas.",
      "Rosaci comparó la planche con **cinco ejercicios preparatorios** distintos [2]. El resultado fue claro y desigual:",
      "- El que mejor reprodujo el patrón muscular fue la **planche asistida en polea**, que mantiene la posición y la línea de carga reales.",
      "- El que peor lo reprodujo fue el trabajo con **bandas elásticas en decúbito prono**, que redujo la participación del bíceps un **80%**.",
      "Trece años antes, Bernasconi y colaboradores habían llegado a la misma conclusión estudiando ocho músculos del hombro [3]: el contrapeso conservaba mejor el pectoral mayor, las mancuernas sobreactivaban el deltoides y la barra reducía la participación del serrato. Su conclusión sigue vigente:",
      "> «Los ejercicios de entrenamiento deben elegirse conociendo la coordinación muscular específica que induce cada uno.» [3]",
      "La revisión sistemática de Malíř y colaboradores, sobre **37 estudios y 263 gimnastas de élite**, cierra el argumento: los elementos estáticos de anillas exigen una **altísima especificidad de entrenamiento** [4].",
      "#### Qué significa esto en la práctica",
      "Que un ejercicio «trabaje los mismos músculos» no basta. Si cambia la posición del cuerpo, cambia la línea de carga, y con ella cambia el patrón de coordinación. Un ejercicio que quita el bíceps de la ecuación **no te está preparando para la planche**, por muy duro que resulte.",
      "Y por eso la half planche es tan valiosa: no es un ejercicio parecido, es **la misma posición con menos palanca**. Conserva la línea de carga, la protracción escapular, la extensión de codo y la lucha del deltoides. Solo baja el torque un 8%.",

      "### 7. La progresión, ordenada por torque",
      "Esta es la secuencia que se desprende del análisis. **Aquí ya no estamos en terreno científico**: el orden se apoya en la mecánica calculada arriba, pero ninguna progresión de calistenia ha sido validada en un ensayo. Trátalo como lo que es: una guía razonada, no un protocolo demostrado.",
      "#### Fase 1 · Tuck planche — 59%",
      "Rodillas al pecho, espalda redondeada, escápulas protraídas. El objetivo aquí **no es aguantar**: es aprender a empujar el suelo lejos de ti y a mantener el codo bloqueado.",
      "[IMG:/blog/planche/rana.jpg|Posición de partida: rodillas recogidas y peso sobre las manos. A medida que ganes fuerza, el objetivo es ir bloqueando el codo y despegar las rodillas de los brazos hasta sostenerte solo con el hombro.]",
      "#### Fase 2 · Advanced tuck planche — 70%",
      "Muslos verticales, espalda **plana**, cadera a la altura de los hombros. Es el mayor salto de exigencia de toda la progresión. Si la espalda se redondea, has vuelto a la fase 1 sin darte cuenta.",
      "[IMG:/blog/planche/advanced-tuck.jpg|Advanced tuck planche: espalda plana, codos bloqueados y cadera a la altura de los hombros. *Imagen generada con inteligencia artificial, con fines ilustrativos.*]",
      "#### Fase 3 · Half planche o *half lay planche* — 87 a 92%",
      "Piernas juntas, **muslos alineados con el tronco** y rodillas flexionadas, con las tibias apuntando hacia arriba y atrás. **Aquí es donde se construye realmente la full planche.**",
      "Los tres puntos que definen la posición y que hay que vigilar:",
      "- **El muslo no baja ni sube:** continúa la línea del tronco. Si la cadera se eleva, estás pikeando y perdiendo torque sin darte cuenta.",
      "- **Las rodillas se flexionan, no la cadera.** Es la diferencia exacta con el advanced tuck, y es la que separa el 92% del 70%.",
      "- **Escápulas protraídas y codos bloqueados**, igual que en la full.",
      "El ángulo de rodilla es tu dial de intensidad, y es un dial fino: de talones en glúteos (87%) a rodillas a 90° (92%) hay un margen estrecho y muy aprovechable para progresar semana a semana sin cambiar de ejercicio.",
      "[IMG:/blog/planche/half-lay.jpg|Half lay planche: muslos en línea con el tronco, rodillas flexionadas y codos bloqueados. El 92% del torque de la full. *Imagen generada con inteligencia artificial, con fines ilustrativos.*]",
      "#### Fase 4 · Straddle planche — 85 a 91%",
      "Piernas extendidas y abiertas. Nótese que **una straddle abierta exige menos que una half planche cerrada**. No es el paso siguiente obligatorio: es una rama paralela, útil si tienes buena movilidad de cadera.",
      "[IMG:/blog/planche/straddle.jpg|Straddle planche: piernas extendidas y separadas, cadera a la altura de los hombros. **Este atleta la sostiene apoyado en dos dedos por mano**, una variante extrema que no forma parte de la progresión: fíjate en la posición del cuerpo, no en las manos. Foto de [CmdCourgette](https://commons.wikimedia.org/wiki/File:Straddle_planche_2_doigts.jpg), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es).]",
      "#### Fase 5 · Full planche — 100%",
      "Cuerpo recto, piernas juntas, cadera a la altura de los hombros.",
      "[IMG:/blog/planche/full-bn.jpg|Full planche completa: cuerpo recto, piernas juntas, cadera a la altura de los hombros y codos bloqueados. Esta es la posición que exige los 286 N·m. Foto de [Jonathanfv](https://commons.wikimedia.org/wiki/File:Planche.jpg), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/deed.es).]",

      "### 8. Lo que la evidencia todavía no puede decirte",
      "Un artículo honesto tiene que marcar sus propios límites. Estos son los de este:",
      "- **Los estudios son de gimnastas de anillas, no de calistenia.** Las anillas son inestables y eso aumenta la demanda de estabilizadores. La planche en suelo o paralelas es un entorno más rígido y los valores de activación no son directamente transferibles.",
      "- **Las muestras son pequeñas.** Siete gimnastas [2], ocho [5]. Son atletas de altísimo nivel y los estudios lo son de calidad, pero con esos tamaños no se puede afirmar cuánto varía la respuesta entre personas.",
      "- **Ningún estudio ha comparado progresiones de calistenia entre sí.** La tabla de torque de esta guía es un **cálculo mecánico**, no un experimento: describe la física de la posición, no cómo responde tu cuerpo al entrenarla.",
      "- **No existe evidencia sobre series, repeticiones ni frecuencia óptimas para la planche.** Lo único cercano es un estudio de cuatro semanas de trabajo excéntrico en gimnastas de élite que mejoró la estabilidad del patrón muscular en el *support scale* [5], pero es un protocolo de anillas con isocinético, no una receta de calistenia.",
      "> Si alguien te da un número exacto de series y repeticiones para conseguir la planche «según la ciencia», está inventando. Ese estudio no existe.",

      "### 9. Resumen operativo",
      "- La planche es un problema de **torque**, no de fuerza absoluta. Tu enemigo es la distancia horizontal al hombro.",
      "- Una full planche exige unos **286 N·m** en un atleta de 70 kg, con un brazo de palanca efectivo de **46 cm**.",
      "- La **half planche con rodillas flexionadas alcanza el 92%** de esa exigencia, porque el muslo —el segmento pesado— permanece dentro de la palanca.",
      "- El salto más duro de la progresión no es el último, es **tuck → advanced tuck**.",
      "- Los músculos que sostienen el elemento, medidos con EMG, son **deltoides anterior, bíceps braquial y serrato anterior**, por ese orden [2].",
      "- La especificidad está demostrada: los ejercicios que cambian la línea de carga **no reproducen** el patrón muscular del elemento [2][3][4].",
    ],
    references: [
      {
        id: 1,
        authors: "de Leva P.",
        title: "Adjustments to Zatsiorsky-Seluyanov's segment inertia parameters.",
        source: "Journal of Biomechanics. 1996;29(9):1223-1230",
        doi: "10.1016/0021-9290(95)00178-6",
        note: "Base antropométrica de todos los cálculos de torque de esta guía: masas relativas de segmento y posición de sus centros de masas.",
      },
      {
        id: 2,
        authors: "Rosaci G, Nigro F, Cortesi M, Ciacci S, Bartolomei S, Fantozzi S.",
        title:
          "Electromyographic Analysis of the Support Scale in Gymnastics and Its Related Preconditioning Strengthening Exercises.",
        source: "Journal of Strength and Conditioning Research. 2025;39(6):680-686",
        doi: "10.1519/JSC.0000000000005074",
        note: "Fuente principal. El propio artículo denomina al support scale «planche». n = 7 gimnastas especialistas en anillas.",
      },
      {
        id: 3,
        authors: "Bernasconi SM, Tordi NR, Parratte BM, Rouillon JDR.",
        title:
          "Can shoulder muscle coordination during the support scale at ring height be replicated during training exercises in gymnastics?",
        source: "Journal of Strength and Conditioning Research. 2009;23(8):2381-2388",
        doi: "10.1519/JSC.0b013e3181bac69f",
        note: "Comparó contrapeso, mancuernas y barra frente al elemento real, midiendo ocho músculos del hombro.",
      },
      {
        id: 4,
        authors: "Malíř R, Chrudimský J, Šteffl M, Stastny P.",
        title:
          "A Systematic Review of Dynamic, Kinematic, and Muscle Activity during Gymnastic Still Rings Elements.",
        source: "Sports. 2023;11(3):50",
        doi: "10.3390/sports11030050",
        note: "Revisión sistemática de 37 estudios y 263 gimnastas de élite.",
      },
      {
        id: 5,
        authors: "Göpfert B, Schärer C, Tacchelli L, Gross M, Lüthy F, Hübner K.",
        title:
          "Frequency Shifts in Muscle Activation during Static Strength Elements on the Rings before and after an Eccentric Training Intervention in Male Gymnasts.",
        source: "Journal of Functional Morphology and Kinesiology. 2022;7(1):28",
        doi: "10.3390/jfmk7010028",
        note: "Intervención de cuatro semanas de trabajo excéntrico isocinético en ocho gimnastas de élite.",
      },
    ],
  },

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
