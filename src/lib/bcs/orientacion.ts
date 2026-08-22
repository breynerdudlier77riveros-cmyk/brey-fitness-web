// ── Qué hacer, según el objetivo (Sprint BCS-9.0) ──────────────────────────
//
// LA QUEJA, LITERAL: «no me recomienda nada y no me dice nada».
//
// Es la segunda vez que se pide, así que se construye. Lo que sigue explica
// exactamente qué se puede sostener y por qué la forma es esta y no otra.
//
// ── POR QUÉ NO SE RECOMIENDA A PARTIR DE UN VALOR ─────────────────────────
//
//   La forma que se pidió como ejemplo era:
//
//     «grasa visceral alta → problemas metabólicos → déficit calórico»
//
//   Esa cadena rompe tres reglas escritas en este repositorio, y ninguna es
//   un criterio mío:
//
//     · «alta» exige un rango, y la CKB (04) declara NO admisible clasificar
//       el índice visceral con rangos de fuente comercial.
//     · «problemas metabólicos» es un enunciado de riesgo de salud, que el
//       BCS Handbook 06 prohíbe como regla no negociable.
//     · «se recomienda» a partir del valor atribuye una causa al dato, y la
//       CKB repite en cada ficha que **el dato no contiene la causa**.
//
// ── LO QUE SÍ SOSTIENE, Y ES MÁS ÚTIL ─────────────────────────────────────
//
//   La misma CKB dice, en la ficha de hipertrofia, cuál es el hueco exacto:
//
//     «Presentar la ganancia muscular como "buena": depende de un objetivo
//      que el dato no incluye.»
//
//   El objetivo. Eso es lo que falta, y no es un dato de composición: lo pone
//   el profesional. En cuanto está puesto, la CKB SÍ tiene qué decir sobre
//   cómo se mueve cada cosa, verificado y con DOI:
//
//     · tensión mecánica, proximidad al fallo y volumen de series suficiente
//       como determinantes de hipertrofia;
//     · entrenamiento de fuerza progresivo e ingesta proteica como variables
//       influyentes en recomposición;
//     · el estímulo mecánico y la proteína como lo que decide qué proporción
//       de una pérdida de peso sale de masa magra.
//
//   Así que la orientación se indexa POR OBJETIVO, no por valor. La cadena
//   deja de ser «tu número está mal, haz esto» y pasa a ser «para esto que
//   quieres conseguir, esto es lo que la evidencia señala». La primera
//   inventa un diagnóstico; la segunda es lo que un profesional hace.
//
// CADA PUNTO VIAJA CON SU FICHA, SUS REFERENCIAS Y SU NIVEL DE EVIDENCIA, y
// con las lecturas que la propia ficha declara no admisibles. Sin eso esto
// sería exactamente lo que el sistema existe para no hacer.
//
// Módulo puro y declarativo. No lee el análisis ni conoce ningún valor del
// cliente: por construcción no puede derivar una recomendación de una cifra.

/** Los objetivos que la base de conocimiento verificada puede sostener hoy. */
export type ObjetivoComposicion =
  /** Aumentar masa muscular. */
  | 'ganar_musculo'
  /** Bajar grasa manteniendo o subiendo el músculo. */
  | 'recomposicion'
  /** Perder peso limitando la parte que sale de masa magra. */
  | 'perder_peso';

export interface Orientacion {
  objetivo: ObjetivoComposicion;
  titulo: string;
  /** Qué es el objetivo, en los términos de la ficha. */
  definicion: string;
  /** Lo que la evidencia señala como determinante. Cada punto, una acción. */
  palancas: readonly string[];
  /** Qué esperar, y en qué plazo. Nunca una cifra para un individuo. */
  expectativa: string;
  /** Lo que NO puede concluirse. Literal de la ficha. */
  noAdmisible: readonly string[];
  /** Trazabilidad: ficha de la CKB, módulo, nivel y referencias. */
  fuente: {
    ficha: string;
    modulo: string;
    nivelEvidencia: string;
    referencias: readonly string[];
  };
}

export const ORIENTACIONES: readonly Orientacion[] = [
  {
    objetivo: 'ganar_musculo',
    titulo: 'Si el objetivo es aumentar masa muscular',
    definicion:
      'Aumento del tamaño del tejido muscular esquelético por incremento del contenido proteico contráctil de sus fibras. El crecimiento neto ocurre cuando la síntesis proteica supera de forma sostenida a la degradación.',
    palancas: [
      'Tensión mecánica. De los tres factores del modelo convencional —tensión mecánica, estrés metabólico y daño muscular— es el que tiene respaldo más consistente como determinante principal.',
      'Proximidad al fallo del esfuerzo. La evidencia localizada la señala como determinante clave, con una revisión sistemática con metaanálisis detrás.',
      'Volumen de series suficiente por grupo muscular. El otro determinante clave que la misma evidencia identifica.',
      'Disponibilidad de sustrato: ingesta proteica y energética. Sin ella el estímulo mecánico no basta, porque el crecimiento requiere las dos cosas a la vez.',
      'La carga no es el factor limitante: cargas moderadas y altas producen hipertrofia comparable cuando el volumen se iguala.',
    ],
    expectativa:
      'Incremento lento y progresivo. La velocidad y la magnitud dependen del historial de entrenamiento, la edad y el punto de partida, y la evidencia poblacional no permite anticipar una cifra para una persona concreta.',
    noAdmisible: [
      'Atribuir un aumento de masa muscular a una intervención concreta a partir del dato de composición: el dato no contiene la causa.',
      'Proyectar la ganancia futura a partir de dos mediciones.',
      'Interpretar un aumento en pocos días como tejido nuevo — a corto plazo mandan la hidratación y el glucógeno.',
    ],
    fuente: {
      ficha: 'hipertrofia-muscular',
      modulo: 'CKB 03 · Masa muscular',
      nivelEvidencia: 'moderado',
      referencias: ['proximidad_fallo_hipertrofia_2023', 'barakat_recomposicion_2020'],
    },
  },

  {
    objetivo: 'recomposicion',
    titulo: 'Si el objetivo es bajar grasa sin perder músculo',
    definicion:
      'Aumento de masa muscular con descenso simultáneo de masa grasa, con el peso estable, en descenso leve o en ascenso leve. Masa magra y masa grasa responden a señales distintas, y ambos procesos pueden coexistir mientras ninguna de las dos señales sea lo bastante extrema como para anular la otra.',
    palancas: [
      'Entrenamiento de fuerza progresivo. Es una de las dos variables que la ficha describe como influyentes.',
      'Ingesta proteica suficiente. Es la otra: sostiene la síntesis proteica muscular mientras hay déficit.',
      'Déficit energético moderado, no extremo. Moviliza sustrato del tejido adiposo; llevado al extremo anula la otra señal y la pérdida empieza a salir de masa magra.',
    ],
    expectativa:
      'La evidencia documenta el fenómeno de forma más robusta en personas no entrenadas previamente y con mayor porcentaje graso inicial. En personas entrenadas y magras sigue siendo posible bajo condiciones específicas, pero el ritmo de ganancia muscular en déficit es lento.',
    noAdmisible: [
      'Calificar el patrón como «bueno» o «exitoso»: depende de un objetivo que el dato no contiene.',
      'Prometer o proyectar recomposición futura a partir de dos mediciones.',
      'Afirmar que hubo recomposición cuando la magnitud del cambio cabe dentro del error de la técnica.',
    ],
    fuente: {
      ficha: 'patron-recomposicion',
      modulo: 'CKB 09 · Patrones de cambio',
      nivelEvidencia: 'moderado — revisión narrativa, no metaanálisis',
      referencias: ['barakat_recomposicion_2020'],
    },
  },

  {
    objetivo: 'perder_peso',
    titulo: 'Si el objetivo es perder peso',
    definicion:
      'En un déficit energético el organismo moviliza sustrato de varios compartimentos. La cuestión no es cuánto peso baja, sino qué proporción de esa bajada sale de masa magra y cuál de masa grasa.',
    palancas: [
      'Estímulo de entrenamiento de fuerza. Sin estímulo mecánico suficiente, la masa magra participa más en la pérdida — es el mecanismo que la ficha describe.',
      'Ingesta proteica. El otro factor del que depende ese reparto.',
      'Vigilar la masa muscular y el agua intracelular junto al peso, no el peso solo: bajan juntas cuando la pérdida arrastra tejido magro.',
    ],
    expectativa:
      'Se espera un descenso conjunto de peso, masa muscular y con frecuencia agua intracelular — esta última por composición del propio tejido, no como fenómeno aparte. Una deshidratación puntual reproduce parte de ese patrón sin que haya pérdida real de tejido, y es la confusión más habitual.',
    noAdmisible: [
      'Llamar «sarcopenia» a un descenso de masa muscular observado por bioimpedancia: el marco del EWGSOP2 define una enfermedad muscular por fuerza baja, con instrumentos que este sistema no recoge.',
      'Dar por perdido tejido sin descartar antes una variación de agua.',
      'Atribuir la causa —dieta, entrenamiento, descanso— a partir del patrón.',
    ],
    fuente: {
      ficha: 'patron-perdida-peso-con-perdida-muscular',
      modulo: 'CKB 09 · Patrones de cambio',
      nivelEvidencia: 'moderado',
      referencias: ['ewgsop2_sarcopenia', 'barakat_recomposicion_2020'],
    },
  },
];

export function orientacionDe(objetivo: ObjetivoComposicion): Orientacion | null {
  return ORIENTACIONES.find((o) => o.objetivo === objetivo) ?? null;
}
