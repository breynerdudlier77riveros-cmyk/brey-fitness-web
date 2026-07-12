import type { ProgramSlug } from "@/lib/types";
import type { MotorDiagnostico, Respuesta, Resultado, TurnoCoach } from "./tipos";
import { ANALISIS, INTRO, cierrePorPrograma, preguntas } from "./preguntas";

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

function calcularResultado(historial: Respuesta[]): Resultado {
  const puntajes: Record<ProgramSlug, number> = {
    "performance-start": 0,
    "performance-gym": 0,
    "performance-calisthenics": 0,
    "performance-hybrid": 0,
    "performance-elite": 0,
  };

  const razones: string[] = [];
  const notas: string[] = [];

  for (const r of historial) {
    const opcion = opcionDe(r);
    for (const [slug, pts] of Object.entries(opcion.puntos ?? {})) {
      puntajes[slug as ProgramSlug] += pts;
    }
    if (opcion.razon) razones.push(opcion.razon);
    if (opcion.nota) notas.push(opcion.nota);
  }

  const programa = (Object.entries(puntajes).sort((a, b) => b[1] - a[1])[0][0]) as ProgramSlug;

  return { programa, razones, cierre: cierrePorPrograma[programa], notas };
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
