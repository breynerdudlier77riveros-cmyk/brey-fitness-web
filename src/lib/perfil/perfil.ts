// ── Vocabulario y validación del Perfil Persistente (Sprint 4) ─────────────
// Fuente única para PerfilForm (feedback instantáneo) — los mismos límites
// viven como CHECK constraints en Postgres (supabase/migration_perfil_
// persistente.sql), que es la barrera real de integridad; esta función es
// para que el usuario no tenga que esperar un round-trip a Supabase para
// enterarse de un dato inválido.
//
// objetivo/experiencia/lugar copian las etiquetas EXACTAS del Diagnóstico
// BPS (src/lib/diagnostico/preguntas.ts) — un solo vocabulario en toda la
// app, no una segunda taxonomía paralela.

export const SEXO_OPCIONES = ['Masculino', 'Femenino', 'Prefiero no decirlo'] as const;

export const OBJETIVO_OPCIONES = [
  'Ganar músculo y masa',
  'Perder grasa y definir',
  'Ganar fuerza máxima',
  'Dominar habilidades de peso corporal',
  'Transformación completa',
] as const;

/** Autopercibido y general — distinto de profiles.nivel_actual (asignado por el Diagnóstico, acoplado a un Sistema). */
export const NIVEL_OPCIONES = ['Principiante', 'Intermedio', 'Avanzado'] as const;

export const LUGAR_OPCIONES = ['Gym', 'Casa o parque', 'Ambos'] as const;

export const EXPERIENCIA_OPCIONES = ['Menos de 1 año', '1 – 3 años', 'Más de 3 años'] as const;

export const LIMITES = {
  pesoMinKg: 20,
  alturaMinCm: 80,
  diasMin: 1,
  diasMax: 7,
  duracionMin: 0,
} as const;

/** Estado de un <input>/<select> controlado: todo string, se parsea recién al validar/guardar. */
export interface PerfilFormValues {
  nombre: string;
  avatar_url: string;
  edad: string;
  sexo: string;
  peso_kg: string;
  altura_cm: string;
  objetivo: string;
  nivel_experiencia: string;
  lugar_entrenamiento: string;
  dias_por_semana: string;
  duracion_sesion_min: string;
  experiencia: string;
  lesiones: string;
  observaciones: string;
}

export type PerfilErrores = Partial<Record<keyof PerfilFormValues, string>>;

/** Función pura: mismo input → mismos errores. Campos vacíos son válidos (todo es opcional salvo nombre). */
export function validarPerfil(values: PerfilFormValues): PerfilErrores {
  const errores: PerfilErrores = {};

  if (!values.nombre.trim()) {
    errores.nombre = 'El nombre no puede estar vacío.';
  }

  if (values.peso_kg && Number(values.peso_kg) <= LIMITES.pesoMinKg) {
    errores.peso_kg = `El peso debe ser mayor a ${LIMITES.pesoMinKg} kg.`;
  }

  if (values.altura_cm && Number(values.altura_cm) <= LIMITES.alturaMinCm) {
    errores.altura_cm = `La altura debe ser mayor a ${LIMITES.alturaMinCm} cm.`;
  }

  if (values.duracion_sesion_min && Number(values.duracion_sesion_min) <= LIMITES.duracionMin) {
    errores.duracion_sesion_min = 'La duración debe ser mayor a 0.';
  }

  if (values.dias_por_semana) {
    const dias = Number(values.dias_por_semana);
    if (dias < LIMITES.diasMin || dias > LIMITES.diasMax) {
      errores.dias_por_semana = `Los días deben estar entre ${LIMITES.diasMin} y ${LIMITES.diasMax}.`;
    }
  }

  return errores;
}

/** Forma que recibe `profiles.update(...)` — mismos 14 campos editables de PerfilFormValues, ya parseados. */
export interface ProfileUpdateInput {
  nombre: string;
  avatar_url: string | null;
  edad: number | null;
  sexo: string | null;
  peso_kg: number | null;
  altura_cm: number | null;
  objetivo: string | null;
  nivel_experiencia: string | null;
  lugar_entrenamiento: string | null;
  dias_por_semana: number | null;
  duracion_sesion_min: number | null;
  experiencia: string | null;
  lesiones: string | null;
  observaciones: string | null;
}

/** Conversión pura string→number/null — se asume ya validado (llamar después de validarPerfil sin errores). */
export function buildUpdatePayload(values: PerfilFormValues): ProfileUpdateInput {
  return {
    nombre: values.nombre.trim(),
    avatar_url: values.avatar_url.trim() || null,
    edad: values.edad ? Number(values.edad) : null,
    sexo: values.sexo || null,
    peso_kg: values.peso_kg ? Number(values.peso_kg) : null,
    altura_cm: values.altura_cm ? Number(values.altura_cm) : null,
    objetivo: values.objetivo || null,
    nivel_experiencia: values.nivel_experiencia || null,
    lugar_entrenamiento: values.lugar_entrenamiento || null,
    dias_por_semana: values.dias_por_semana ? Number(values.dias_por_semana) : null,
    duracion_sesion_min: values.duracion_sesion_min ? Number(values.duracion_sesion_min) : null,
    experiencia: values.experiencia || null,
    lesiones: values.lesiones.trim() || null,
    observaciones: values.observaciones.trim() || null,
  };
}
