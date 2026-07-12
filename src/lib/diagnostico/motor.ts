import type { SistemaSlug } from "@/lib/types";
import { getSistemaBySlug } from "@/data/sistemas";
import type { MotorDiagnostico, Respuesta, Resultado, TurnoCoach } from "./tipos";
import { ANALISIS, INTRO, cierrePorSistema, preguntas } from "./preguntas";

// ── Motor guionado (camino A) ───────────────────────────────────────────────
// Implementación local y determinista del contrato MotorDiagnostico.
// Es una función pura del historial: mismo historial → mismo turno.
// El motor de Claude API (v2.0) implementará el mismo contrato contra una
// route handler; DiagnosticoClient solo cambia la instancia del motor.

function opcionDe(r: Respuesta) {
  const pregunta = preguntas.find((p) => p.id === r.preguntaId);
  const opcion = pregunta?.opciones.find((o) => o.id === r.opcionId);
  if (!pregunta || !opcion) {
    throw new Error(`Respuesta desconocida: ${r.preguntaId}/${r.opcionId}`);
  }
  return opcion;
}

function respuestaDe(historial: Respuesta[], preguntaId: string): string | undefined {
  return historial.find((r) => r.preguntaId === preguntaId)?.opcionId;
}

/**
 * El nivel NO es un producto: es el punto de entrada dentro del Sistema.
 * Se deriva de experiencia + situación + lesiones y se mapea a los niveles
 * internos definidos en data/sistemas.ts.
 */
function calcularNivelEntrada(sistema: SistemaSlug, historial: Respuesta[]): string | null {
  const niveles = getSistemaBySlug(sistema)?.niveles ?? [];
  if (niveles.length === 0) return null; // Elite: individualizado 1:1

  const experiencia = respuestaDe(historial, "experiencia");
  const situacion = respuestaDe(historial, "situacion");
  const lesiones = respuestaDe(historial, "lesiones");
  const objetivo = respuestaDe(historial, "objetivo");

  let indice: number;
  if (experiencia === "principiante" || situacion === "cero" || lesiones === "si") {
    indice = 0;
  } else if (experiencia === "intermedio") {
    indice = 1;
  } else {
    indice = 2;
    // Calistenia avanzada con objetivo de habilidades → entrada directa a Skills.
    if (sistema === "calistenia" && objetivo === "habilidades" && niveles.length > 3) {
      indice = 3;
    }
  }

  return niveles[Math.min(indice, niveles.length - 1)].nombre;
}

/**
 * Cuando el Sistema recomendado aún no está disponible, el diagnóstico
 * sigue siendo honesto (recomienda lo correcto + lista de espera) pero
 * ofrece el mejor camino disponible HOY.
 */
function calcularAlternativa(
  sistema: SistemaSlug,
  historial: Respuesta[]
): Resultado["alternativa"] {
  const lugar = respuestaDe(historial, "lugar");

  if (sistema === "fuerza") {
    return {
      sistema: "hibrido",
      razon:
        "El Sistema Híbrido entrena la fuerza absoluta con barra dentro de una periodización completa — y está disponible hoy.",
    };
  }
  // Elite
  return lugar === "casa"
    ? {
        sistema: "calistenia",
        razon:
          "Mientras Elite llega, el Sistema de Calistenia es el camino más completo para entrenar donde tú entrenas — disponible hoy.",
      }
    : {
        sistema: "hibrido",
        razon:
          "Mientras Elite llega, el Sistema Híbrido es el camino más completo del BPS — cargas y peso corporal, disponible hoy.",
      };
}

function calcularResultado(historial: Respuesta[]): Resultado {
  // Orden = desempate: ante igualdad gana el Sistema disponible.
  const puntajes: Record<SistemaSlug, number> = {
    hipertrofia: 0,
    calistenia: 0,
    hibrido: 0,
    fuerza: 0,
    elite: 0,
  };

  const razones: string[] = [];
  const notas: string[] = [];

  for (const r of historial) {
    const opcion = opcionDe(r);
    for (const [slug, pts] of Object.entries(opcion.puntos ?? {})) {
      puntajes[slug as SistemaSlug] += pts;
    }
    if (opcion.razon) razones.push(opcion.razon);
    if (opcion.nota) notas.push(opcion.nota);
  }

  const sistema = (Object.entries(puntajes).sort((a, b) => b[1] - a[1])[0][0]) as SistemaSlug;
  const disponible = getSistemaBySlug(sistema)?.disponible ?? false;

  return {
    sistema,
    nivelEntrada: calcularNivelEntrada(sistema, historial),
    disponible,
    ...(disponible ? {} : { alternativa: calcularAlternativa(sistema, historial) }),
    razones,
    cierre: cierrePorSistema[sistema],
    notas,
  };
}

export const motorGuionado: MotorDiagnostico = {
  async iniciar(): Promise<TurnoCoach> {
    return {
      mensajes: [...INTRO, ...preguntas[0].coach],
      pregunta: preguntas[0],
      progreso: 0,
    };
  },

  async responder(historial: Respuesta[]): Promise<TurnoCoach> {
    const indice = historial.length;
    const ultima = historial[indice - 1];
    const reaccion = ultima ? [opcionDe(ultima).reaccion] : [];

    if (indice < preguntas.length) {
      const siguiente = preguntas[indice];
      return {
        mensajes: [...reaccion, ...siguiente.coach],
        pregunta: siguiente,
        progreso: Math.round((indice / preguntas.length) * 100),
      };
    }

    return {
      mensajes: [...reaccion, ANALISIS],
      resultado: calcularResultado(historial),
      progreso: 100,
    };
  },
};
