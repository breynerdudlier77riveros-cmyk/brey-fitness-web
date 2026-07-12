import type { ProgramSlug } from "@/lib/types";

// ── Contratos del Diagnóstico BPS ───────────────────────────────────────────

export interface Opcion {
  id: string;
  etiqueta: string;
  descripcion?: string;
  /** Reacción del coach al elegir esta opción. */
  reaccion: string;
  /** Fragmento que alimenta el "porqué" personalizado del resultado. */
  razon?: string;
  /** Nota complementaria en el resultado (p. ej. edad → recuperación). */
  nota?: string;
  /** Puntuación por programa. Solo la usa el motor guionado. */
  puntos?: Partial<Record<ProgramSlug, number>>;
}

export interface Pregunta {
  id: string;
  /** Mensajes del coach que formulan la pregunta. */
  coach: string[];
  opciones: Opcion[];
  opcional?: boolean;
}

export interface Respuesta {
  preguntaId: string;
  opcionId: string;
}

export interface Resultado {
  programa: ProgramSlug;
  /** Fragmentos de porqué, construidos desde las respuestas del usuario. */
  razones: string[];
  /** Cierre específico del programa recomendado. */
  cierre: string;
  /** Notas complementarias (lesiones, edad). */
  notas: string[];
}

export interface TurnoCoach {
  /** Mensajes del coach en este turno (reacción y/o siguiente pregunta). */
  mensajes: string[];
  pregunta?: Pregunta;
  resultado?: Resultado;
  /** Progreso 0–100. Llega a 100 con el resultado. */
  progreso: number;
}

/**
 * Contrato del motor de diagnóstico (decisión D6 · camino A).
 *
 * El motor es una función sobre el historial de respuestas: la interfaz
 * conversacional no sabe — ni le importa — si detrás hay un guion o un
 * modelo de lenguaje.
 *
 * MIGRACIÓN FUTURA A CLAUDE API (v2.0): implementar este mismo contrato
 * con un `fetch` a una route handler (`/api/diagnostico`) que llame al
 * modelo, y cambiar la única línea de DiagnosticoClient que instancia el
 * motor. El frontend y la experiencia no se tocan.
 */
export interface MotorDiagnostico {
  iniciar(): Promise<TurnoCoach>;
  responder(historial: Respuesta[]): Promise<TurnoCoach>;
}
