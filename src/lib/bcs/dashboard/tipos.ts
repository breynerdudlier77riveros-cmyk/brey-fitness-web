// ── Contratos del Dashboard Analytics del BCS (Sprint 5.0) ─────────────────
// DTO derivado, NUNCA persistido. Describe el CONSULTORIO COMPLETO del
// entrenador, no a ninguna persona: aquí no hay interpretación clínica, solo
// recuentos y ordenaciones sobre datos que otros módulos ya produjeron.
//
// Toda la capa recibe los datos ya cargados. No consulta Supabase, no lee el
// reloj (la fecha de referencia llega como parámetro) y no muta la entrada.

import type { Cliente, ClienteEstado, EnlacePublico, Medicion } from '@/lib/bcs/tipos';

/** Entrada del orquestador: todo ya cargado por el Server Component. */
export interface EntradaDashboard {
  clientes: readonly Cliente[];
  /** Todas las mediciones del entrenador, incluidas las anuladas. */
  mediciones: readonly Medicion[];
  /** Todos los enlaces del entrenador, incluidos los revocados. */
  enlaces: readonly EnlacePublico[];
  /** Fecha de referencia `yyyy-mm-dd`. Explícita: la capa no consulta el reloj. */
  hoyISO: string;
}

// ── 1 · Resumen general ────────────────────────────────────────────────────

export interface ResumenGeneral {
  clientesActivos: number;
  clientesArchivados: number;
  clientesEliminados: number;
  totalClientes: number;
  totalMediciones: number;
  medicionesVigentes: number;
  medicionesAnuladas: number;
  /** Media de mediciones vigentes por cliente no eliminado. 0 si no hay clientes. */
  promedioMediciones: number;
  medicionesEsteMes: number;
  clientesNuevosEsteMes: number;
}

// ── 2 · Estado del consultorio ─────────────────────────────────────────────

export interface EstadoConsultorio {
  activos: number;
  archivados: number;
  sinMediciones: number;
  conUnaMedicion: number;
  conSeguimiento: number;
  conMasDeCinco: number;
  conEnlacePublico: number;
  sinSeguimiento: number;
}

// ── 3 · Actividad mensual ──────────────────────────────────────────────────

export interface MesActividad {
  /** `yyyy-mm`. */
  mes: string;
  mediciones: number;
  clientesNuevos: number;
  enlacesGenerados: number;
  enlacesRevocados: number;
}

// ── 4 · Seguimiento ────────────────────────────────────────────────────────

export interface FilaSeguimiento {
  clienteId: string;
  nombre: string;
  estado: ClienteEstado;
  /** Fecha de la última medición vigente, o null si no tiene ninguna. */
  ultimaMedicion: string | null;
  /** Días transcurridos desde esa fecha. null si no hay medición. */
  diasSinMedicion: number | null;
  totalMediciones: number;
  tieneEnlaceActivo: boolean;
}

// ── 5 · Alertas administrativas ────────────────────────────────────────────

export type TipoAlerta =
  | 'archivado_con_enlace_activo'
  | 'sin_mediciones'
  | 'multiples_enlaces_activos'
  | 'con_mediciones_anuladas'
  | 'con_inconsistencias';

export interface AlertaAdministrativa {
  id: string;
  tipo: TipoAlerta;
  clienteId: string;
  nombre: string;
  /** Enunciado del hecho. Nunca una recomendación. */
  hecho: string;
}

// ── 6 · Distribuciones ─────────────────────────────────────────────────────

export interface SegmentoDistribucion {
  etiqueta: string;
  valor: number;
}

export interface Distribuciones {
  porEstado: SegmentoDistribucion[];
  porNumeroDeMediciones: SegmentoDistribucion[];
  porEnlace: SegmentoDistribucion[];
}

// ── 7 · Actividad reciente ─────────────────────────────────────────────────

export type TipoEvento =
  | 'medicion_registrada'
  | 'cliente_creado'
  | 'enlace_generado'
  | 'enlace_revocado'
  | 'medicion_anulada';

export interface EventoReciente {
  id: string;
  tipo: TipoEvento;
  /** `yyyy-mm-dd` de la medición, o fecha de creación del registro. */
  fecha: string;
  clienteId: string;
  nombre: string;
  descripcion: string;
}

// ── 8 · Filtros ────────────────────────────────────────────────────────────

export type FiltroDashboard =
  | 'todos'
  | 'activos'
  | 'archivados'
  | 'con_seguimiento'
  | 'sin_seguimiento'
  | 'con_enlace'
  | 'sin_enlace';

// ── Series para gráficos ───────────────────────────────────────────────────

export interface PuntoSerie {
  etiqueta: string;
  valor: number;
}

export interface SeriesGraficos {
  medicionesPorMes: PuntoSerie[];
  clientesNuevosPorMes: PuntoSerie[];
  distribucionEstado: SegmentoDistribucion[];
  distribucionMediciones: SegmentoDistribucion[];
  /** Serie compacta de mediciones mensuales, para la sparkline del encabezado. */
  sparklineMediciones: number[];
}

// ── DTO canónico ───────────────────────────────────────────────────────────

export interface DashboardAnalytics {
  resumen: ResumenGeneral;
  consultorio: EstadoConsultorio;
  actividadMensual: MesActividad[];
  seguimiento: FilaSeguimiento[];
  alertas: AlertaAdministrativa[];
  distribuciones: Distribuciones;
  actividadReciente: EventoReciente[];
  series: SeriesGraficos;
  meta: {
    hoyISO: string;
    /** Meses cubiertos por la serie de actividad mensual. */
    mesesCubiertos: number;
    /** true cuando no hay ningún cliente registrado. */
    consultorioVacio: boolean;
  };
}
