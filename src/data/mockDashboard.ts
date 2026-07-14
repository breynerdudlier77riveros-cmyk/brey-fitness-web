// ── Datos simulados del Dashboard (BREY v1.1 — validación de UX) ───────────
// Sin backend todavía: esta es la superficie de datos que el Dashboard real
// consumirá cuando exista /api. Los valores son ficticios pero coherentes
// entre sí (mismo atleta, mismo Sistema, misma semana) para que la UI se
// sienta habitada, no como un placeholder. Continúa la narrativa de
// DashboardPreview.tsx (Sistema de Hipertrofia, semana 7 de 16).

export interface EjercicioSesion {
  nombre: string;
  series: number;
  reps: string;
  peso?: number;
  intensidad: string;
  completado: boolean;
}

export interface SesionHoy {
  nombreSesion: string;
  sistema: string;
  semana: number;
  semanaTotal: number;
  duracionEstimada: string;
  ejercicios: EjercicioSesion[];
}

export const entrenamientoHoy: SesionHoy = {
  nombreSesion: "Empuje · Fuerza",
  sistema: "Sistema de Hipertrofia",
  semana: 7,
  semanaTotal: 16,
  duracionEstimada: "55 min",
  ejercicios: [
    { nombre: "Press banca",           series: 4, reps: "5",     peso: 82,  intensidad: "RPE 8",  completado: true },
    { nombre: "Press militar",         series: 3, reps: "8",     peso: 42,  intensidad: "RIR 2",  completado: true },
    { nombre: "Fondos lastrados",      series: 3, reps: "AMRAP", peso: 15,  intensidad: "RIR 1",  completado: false },
    { nombre: "Elevaciones laterales", series: 3, reps: "12-15", peso: 10,  intensidad: "RIR 1",  completado: false },
    { nombre: "Extensión de tríceps",  series: 3, reps: "10-12", peso: 25,  intensidad: "RIR 2",  completado: false },
  ],
};

export type EstadoDia = "completado" | "hoy" | "planificado" | "descanso" | "perdido";

/**
 * Offset en días respecto a hoy (negativo = pasado, 0 = hoy, positivo = futuro).
 * Cubre -34..+6 (41 días) — suficiente para pintar 5 semanas completas
 * (lunes a domingo) en /app/calendario sin huecos, sea cual sea el día
 * de la semana en que se abra el Dashboard.
 */
export const patronCalendario: { offset: number; estado: EstadoDia; sesion?: string }[] = [
  { offset: -34, estado: "completado", sesion: "Empuje · Fuerza" },
  { offset: -33, estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -32, estado: "completado", sesion: "Pierna · Fuerza" },
  { offset: -31, estado: "descanso" },
  { offset: -30, estado: "completado", sesion: "Empuje · Fuerza" },
  { offset: -29, estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -28, estado: "descanso" },
  { offset: -27, estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -26, estado: "completado", sesion: "Pierna · Fuerza" },
  { offset: -25, estado: "descanso" },
  { offset: -24, estado: "completado", sesion: "Empuje · Fuerza" },
  { offset: -23, estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -22, estado: "perdido", sesion: "Pierna · Fuerza" },
  { offset: -21, estado: "descanso" },
  { offset: -20, estado: "completado", sesion: "Empuje · Fuerza" },
  { offset: -19, estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -18, estado: "completado", sesion: "Pierna · Fuerza" },
  { offset: -17, estado: "descanso" },
  { offset: -16, estado: "completado", sesion: "Empuje · Fuerza" },
  { offset: -15, estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -14, estado: "completado", sesion: "Pierna · Fuerza" },
  { offset: -13, estado: "descanso" },
  { offset: -12, estado: "completado", sesion: "Empuje · Fuerza" },
  { offset: -11, estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -10, estado: "completado", sesion: "Pierna · Fuerza" },
  { offset: -9,  estado: "descanso" },
  { offset: -8,  estado: "completado", sesion: "Empuje · Fuerza" },
  { offset: -7,  estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -6,  estado: "completado", sesion: "Pierna · Fuerza" },
  { offset: -5,  estado: "descanso" },
  { offset: -4,  estado: "completado", sesion: "Empuje · Fuerza" },
  { offset: -3,  estado: "completado", sesion: "Tirón · Volumen" },
  { offset: -2,  estado: "completado", sesion: "Pierna · Fuerza" },
  { offset: -1,  estado: "descanso" },
  { offset: 0,   estado: "hoy",        sesion: "Empuje · Fuerza" },
  { offset: 1,   estado: "planificado", sesion: "Tirón · Volumen" },
  { offset: 2,   estado: "planificado", sesion: "Pierna · Fuerza" },
  { offset: 3,   estado: "descanso" },
  { offset: 4,   estado: "planificado", sesion: "Empuje · Fuerza" },
  { offset: 5,   estado: "planificado", sesion: "Tirón · Volumen" },
  { offset: 6,   estado: "planificado", sesion: "Pierna · Fuerza" },
];

export interface ProgresoSemana {
  etiqueta: string;
  tonelaje: number;
}

/** Tonelaje relativo (%) de las últimas 8 semanas — misma serie que DashboardPreview extendida. */
export const progresoSemanal: ProgresoSemana[] = [
  { etiqueta: "S1", tonelaje: 38 },
  { etiqueta: "S2", tonelaje: 44 },
  { etiqueta: "S3", tonelaje: 52 },
  { etiqueta: "S4", tonelaje: 46 },
  { etiqueta: "S5", tonelaje: 60 },
  { etiqueta: "S6", tonelaje: 65 },
  { etiqueta: "S7", tonelaje: 70 },
  { etiqueta: "S8", tonelaje: 84 },
];

export interface RecordReciente {
  ejercicio: string;
  valor: string;
  mejora: string;
  fecha: string;
}

export const recordsRecientes: RecordReciente[] = [
  { ejercicio: "Press banca",  valor: "82 kg × 5", mejora: "+3 kg",  fecha: "Hace 4 días" },
  { ejercicio: "Sentadilla",   valor: "110 kg × 3", mejora: "+5 kg", fecha: "Hace 6 días" },
  { ejercicio: "Peso muerto",  valor: "140 kg × 1", mejora: "+8 kg", fecha: "Hace 10 días" },
];

export interface Objetivo {
  titulo: string;
  descripcion: string;
  progreso: number;
  metricaActual: string;
  metricaObjetivo: string;
  semanasRestantes: number;
}

export const objetivoActual: Objetivo = {
  titulo: "Ganar fuerza en tren superior",
  descripcion: "Llevar el press banca a 90 kg × 5 antes de cerrar el Sistema de Hipertrofia.",
  progreso: 68,
  metricaActual: "82 kg",
  metricaObjetivo: "90 kg",
  semanasRestantes: 9,
};

export interface SesionHistorial {
  offsetDias: number;
  nombre: string;
  duracion: string;
  volumen: string;
  completado: boolean;
}

export const historialSesiones: SesionHistorial[] = [
  { offsetDias: -2,  nombre: "Pierna · Fuerza",   duracion: "58 min", volumen: "9,240 kg",  completado: true },
  { offsetDias: -3,  nombre: "Tirón · Volumen",   duracion: "52 min", volumen: "7,860 kg",  completado: true },
  { offsetDias: -4,  nombre: "Empuje · Fuerza",   duracion: "55 min", volumen: "8,120 kg",  completado: true },
  { offsetDias: -6,  nombre: "Pierna · Fuerza",   duracion: "61 min", volumen: "9,050 kg",  completado: true },
  { offsetDias: -7,  nombre: "Tirón · Volumen",   duracion: "49 min", volumen: "7,410 kg",  completado: true },
  { offsetDias: -8,  nombre: "Empuje · Fuerza",   duracion: "54 min", volumen: "7,980 kg",  completado: true },
  { offsetDias: -10, nombre: "Pierna · Fuerza",   duracion: "0 min",  volumen: "0 kg",      completado: false },
  { offsetDias: -11, nombre: "Tirón · Volumen",   duracion: "50 min", volumen: "7,220 kg",  completado: true },
  { offsetDias: -12, nombre: "Empuje · Fuerza",   duracion: "56 min", volumen: "7,740 kg",  completado: true },
];
