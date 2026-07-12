// ── Métricas del producto vivo (decisión D8) ────────────────────────────────
// REGLA INNEGOCIABLE: jamás números inventados. Este bloque permanece oculto
// hasta que TODOS los umbrales se alcancen con datos reales.
//
// CONEXIÓN FUTURA (v1.1+): cuando exista la base de datos de miembros,
// reemplazar este objeto estático por una consulta real (por ejemplo, una
// función `async obtenerMetricas()` contra Supabase). El componente
// EvolucionSection ya consume esta única fuente — nada más cambia.

export interface Metricas {
  usuariosActivos: number;
  programasIniciados: number;
  entrenamientosRegistrados: number;
  horasEntrenadas: number;
}

export const metricas: Metricas = {
  usuariosActivos: 0,
  programasIniciados: 0,
  entrenamientosRegistrados: 0,
  horasEntrenadas: 0,
};

/** Umbrales mínimos definidos por el fundador (D8, jul 2026). */
export const UMBRALES: Metricas = {
  usuariosActivos: 50,
  programasIniciados: 100,
  entrenamientosRegistrados: 500,
  horasEntrenadas: 1000,
};

export const etiquetasMetricas: Record<keyof Metricas, string> = {
  usuariosActivos: "Usuarios activos",
  programasIniciados: "Programas iniciados",
  entrenamientosRegistrados: "Entrenamientos registrados",
  horasEntrenadas: "Horas entrenadas",
};

/** true solo cuando TODAS las métricas reales superan su umbral. */
export function metricasListas(): boolean {
  return (Object.keys(UMBRALES) as (keyof Metricas)[]).every(
    (k) => metricas[k] >= UMBRALES[k]
  );
}
