import type { SistemaSlug } from "@/lib/types";
import type { Pregunta } from "./tipos";

// ── Guion del Diagnóstico BPS (arquitectura Sistemas, BREY v2) ──────────────
// La voz es la de un entrenador que escucha: reacciona a cada respuesta
// antes de seguir. El scoring apunta a los 5 Sistemas; el nivel de entrada
// se calcula aparte (experiencia + situación + lesiones) porque el nivel es
// configuración interna, no un producto.
// La pregunta de edad es opcional y NO puntúa: solo ajusta las notas de
// recuperación del resultado.

export const INTRO = [
  "Hola. Soy tu diagnóstico BPS.",
  "Siete preguntas — dos minutos — y te digo exactamente qué Sistema es el tuyo, y desde qué nivel empiezas.",
];

export const ANALISIS = "Listo. Déjame cruzar todo lo que me contaste…";

export const preguntas: Pregunta[] = [
  {
    id: "objetivo",
    coach: ["Primero lo importante: ¿qué quieres lograr con tu entrenamiento?"],
    opciones: [
      {
        id: "musculo",
        etiqueta: "Ganar músculo y masa",
        descripcion: "Un físico más desarrollado y voluminoso.",
        reaccion: "Hipertrofia. Bien — es de lo que más evidencia científica tenemos.",
        razon: "tu objetivo es ganar masa muscular",
        puntos: { hipertrofia: 3, hibrido: 1, elite: 1 },
      },
      {
        id: "grasa",
        etiqueta: "Perder grasa y definir",
        descripcion: "Reducir grasa corporal preservando el músculo.",
        reaccion: "Definir preservando músculo es cuestión de método, no de sufrimiento.",
        razon: "quieres perder grasa sin sacrificar músculo",
        puntos: { hipertrofia: 2, calistenia: 1, hibrido: 1 },
      },
      {
        id: "fuerza",
        etiqueta: "Ganar fuerza máxima",
        descripcion: "Levantar más — o dominar mi peso corporal.",
        reaccion: "Fuerza. La base de todo lo demás.",
        razon: "buscas fuerza máxima",
        puntos: { fuerza: 3, hibrido: 2, hipertrofia: 1 },
      },
      {
        id: "habilidades",
        etiqueta: "Dominar habilidades de peso corporal",
        descripcion: "Muscle up, handstand, front lever, planche.",
        reaccion: "Muscle up, planche… ese camino exige progresiones inteligentes, no fuerza bruta.",
        razon: "quieres dominar habilidades de peso corporal",
        puntos: { calistenia: 3, hibrido: 1, elite: 1 },
      },
      {
        id: "todo",
        etiqueta: "Transformación completa",
        descripcion: "Fuerza, físico, habilidades y rendimiento en un solo camino.",
        reaccion: "Transformación completa. Ambicioso — me gusta.",
        razon: "buscas una transformación completa",
        puntos: { elite: 3, hibrido: 1, hipertrofia: 1, calistenia: 1 },
      },
    ],
  },
  {
    id: "experiencia",
    coach: ["¿Cuánto tiempo llevas entrenando en serio?"],
    opciones: [
      {
        id: "principiante",
        etiqueta: "Menos de 1 año",
        descripcion: "Empiezo desde cero o llevo poco con método.",
        reaccion: "Empezar bien vale más que empezar rápido. Tu nivel de entrada lo reflejará.",
        razon: "estás construyendo tu base",
        puntos: {},
      },
      {
        id: "intermedio",
        etiqueta: "1 – 3 años",
        descripcion: "Tengo base, pero quiero más estructura.",
        reaccion: "Base construida. Ahora lo que marca la diferencia es la estructura.",
        razon: "llevas 1–3 años y necesitas estructura real",
        puntos: { hipertrofia: 1, calistenia: 1, hibrido: 1 },
      },
      {
        id: "avanzado",
        etiqueta: "Más de 3 años",
        descripcion: "Busco el siguiente nivel de rendimiento.",
        reaccion: "Nivel avanzado. Entonces el margen está en los detalles.",
        razon: "llevas más de 3 años y buscas el siguiente nivel",
        puntos: { hibrido: 2, elite: 2, fuerza: 1 },
      },
    ],
  },
  {
    id: "lugar",
    coach: ["¿Dónde vas a entrenar la mayoría de los días?"],
    opciones: [
      {
        id: "gym",
        etiqueta: "Gym",
        descripcion: "Pesas, máquinas y equipamiento completo.",
        reaccion: "Gym completo — todas las herramientas sobre la mesa.",
        razon: "entrenas en gym",
        puntos: { hipertrofia: 3, fuerza: 3, hibrido: 1, elite: 1 },
      },
      {
        id: "casa",
        etiqueta: "Casa o parque",
        descripcion: "Mi peso corporal o equipo mínimo.",
        reaccion: "Tu cuerpo y unas barras. Suficiente para llegar mucho más lejos de lo que crees.",
        razon: "entrenas con tu peso corporal",
        puntos: { calistenia: 3 },
      },
      {
        id: "ambos",
        etiqueta: "Ambos",
        descripcion: "Tengo acceso a gym y también entreno fuera.",
        reaccion: "Flexibilidad total. Eso abre opciones interesantes.",
        razon: "quieres flexibilidad entre cargas y peso corporal",
        puntos: { hibrido: 3, calistenia: 1, hipertrofia: 1, elite: 1 },
      },
    ],
  },
  {
    id: "tiempo",
    coach: ["Seamos realistas: ¿cuánto tiempo tienes por sesión?"],
    opciones: [
      {
        id: "t30",
        etiqueta: "30 – 45 minutos",
        descripcion: "Tiempo limitado — necesito sesiones compactas.",
        reaccion: "Sesiones compactas. La densidad va a ser tu aliada.",
        razon: "tienes 30–45 minutos por sesión",
        puntos: { hipertrofia: 1, calistenia: 1 },
      },
      {
        id: "t60",
        etiqueta: "45 – 60 minutos",
        descripcion: "Una hora me funciona.",
        reaccion: "Una hora bien planificada rinde más de lo que la gente cree.",
        razon: "dispones de una hora por sesión",
        puntos: { hipertrofia: 1, calistenia: 1, hibrido: 1, fuerza: 1 },
      },
      {
        id: "t90",
        etiqueta: "60 – 90 minutos",
        descripcion: "Puedo hacer sesiones completas.",
        reaccion: "Tiempo de sobra para sesiones completas.",
        razon: "puedes entrenar 60–90 minutos",
        puntos: { hipertrofia: 2, calistenia: 2, hibrido: 1, fuerza: 1 },
      },
      {
        id: "t120",
        etiqueta: "Más de 90 minutos",
        descripcion: "El entrenamiento es mi prioridad.",
        reaccion: "El entrenamiento es tu prioridad. Se nota.",
        razon: "el tiempo no es tu límite",
        puntos: { hibrido: 2, elite: 2, fuerza: 1, calistenia: 1 },
      },
    ],
  },
  {
    id: "lesiones",
    coach: ["¿Alguna lesión o limitación activa que deba tener en cuenta?"],
    opciones: [
      {
        id: "no",
        etiqueta: "No, estoy al 100%",
        descripcion: "Sin restricciones físicas.",
        reaccion: "Perfecto — al 100%.",
        puntos: { hipertrofia: 1, calistenia: 1, hibrido: 1, fuerza: 1, elite: 1 },
      },
      {
        id: "si",
        etiqueta: "Sí, prefiero empezar con precaución",
        descripcion: "Tengo algo que necesito tener en cuenta.",
        reaccion: "Gracias por decirlo. Empezar con precaución no es retroceder — es estrategia.",
        nota: "Mencionaste una lesión o limitación: tu nivel de entrada prioriza técnica y progresión gradual, pero con una lesión activa la evaluación de un profesional de la salud siempre va primero.",
        puntos: {},
      },
    ],
  },
  {
    id: "situacion",
    coach: ["Última de diagnóstico: ¿qué describe mejor tu momento actual?"],
    opciones: [
      {
        id: "cero",
        etiqueta: "Empiezo desde cero",
        descripcion: "Primeras veces entrenando en serio.",
        reaccion: "Todos los que admiras empezaron exactamente ahí.",
        razon: "estás empezando desde cero",
        puntos: {},
      },
      {
        id: "sinestructura",
        etiqueta: "Entreno, pero sin estructura",
        descripcion: "Llevo tiempo, pero sin un sistema claro.",
        reaccion: "Esfuerzo sin sistema — el caso más común, y el que más rápido mejora.",
        razon: "has entrenado pero sin un sistema real",
        puntos: { hipertrofia: 1, calistenia: 1 },
      },
      {
        id: "estancado",
        etiqueta: "Llevo meses estancado",
        descripcion: "El progreso se detuvo. Necesito otro estímulo.",
        reaccion: "El estancamiento no es falta de esfuerzo. Es falta de variables nuevas.",
        razon: "llevas meses estancado y necesitas otro estímulo",
        puntos: { hibrido: 1, elite: 1, fuerza: 1 },
      },
      {
        id: "completo",
        etiqueta: "Quiero el camino más completo",
        descripcion: "El máximo nivel de personalización y apoyo.",
        reaccion: "El máximo nivel de personalización. Anotado.",
        razon: "quieres el camino más completo disponible",
        puntos: { elite: 3, hibrido: 1 },
      },
    ],
  },
  {
    id: "edad",
    opcional: true,
    coach: [
      "Una más — y es opcional: ¿tu edad?",
      "No cambia la recomendación. Solo ajusta cómo te hablo de recuperación.",
    ],
    opciones: [
      {
        id: "e17",
        etiqueta: "Menos de 18",
        reaccion: "Tu mejor ventaja es el tiempo. Úsalo bien.",
        nota: "Con menos de 18 años, la prioridad absoluta es la técnica y una progresión conservadora — el tiempo juega a tu favor como a nadie.",
      },
      {
        id: "e29",
        etiqueta: "18 – 29",
        reaccion: "La edad de oro de la recuperación.",
        nota: "Entre los 18 y 29 la capacidad de recuperación está en su punto más alto: es el momento de construir base con volumen inteligente.",
      },
      {
        id: "e45",
        etiqueta: "30 – 45",
        reaccion: "Buena edad para entrenar con cabeza.",
        nota: "Entre los 30 y 45 el entrenamiento funciona igual de bien — la diferencia la hace tratar el sueño y la recuperación con la misma seriedad que las series.",
      },
      {
        id: "e46",
        etiqueta: "Más de 45",
        reaccion: "La experiencia manda — y la recuperación también.",
        nota: "A partir de los 45 la recuperación es la variable reina: más calidad por sesión y articulaciones cuidadas. El progreso sigue llegando.",
      },
      {
        id: "nodigo",
        etiqueta: "Prefiero no decirlo",
        reaccion: "Sin problema.",
      },
    ],
  },
];

// Cierre del porqué, específico del Sistema ganador.
export const cierrePorSistema: Record<SistemaSlug, string> = {
  hipertrofia:
    "El Sistema de Hipertrofia convierte esas condiciones en 16 semanas periodizadas: técnica, volumen científico, sobrecarga y definición.",
  calistenia:
    "El Sistema de Calistenia es ese camino: 24 semanas de progresiones — de los fundamentos a las skills — con niveles que se adaptan a ti.",
  hibrido:
    "El Sistema Híbrido une ambos mundos en 20 semanas: fuerza con barra y dominio del peso corporal en una sola periodización.",
  fuerza:
    "El Sistema de Fuerza es tu camino natural: los básicos con barra, periodizados y autorregulados bajo el BPS.",
  elite:
    "El Sistema Elite es el nivel máximo: acceso total a los Sistemas más coaching directo e individualización completa.",
};
