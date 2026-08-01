// ── Contratos de la capa de análisis del BCS (Sprint I-03) ─────────────────
// DTO derivado, NUNCA persistido: se computa on-demand desde las Mediciones
// vigentes, igual que el Reporte (BCS Handbook, IN-D3). No existe tabla ni
// columna para nada de este archivo y este Sprint no crea ninguna.
//
// Toda interpretación vive aquí; la UI solo renderiza lo que este DTO ya
// dejó resuelto. Cada estructura carga su propia `razon`/`explicacion`
// para que ninguna cifra mostrada al entrenador o al cliente quede sin
// justificación trazable hasta la regla que la produjo.

import type { Procedencia, VariableId } from '@/lib/bcs/reporte';

/**
 * Cuánto respalda el dato a la interpretación que lo acompaña. Es un eje
 * transversal: lo llevan el análisis completo, cada hallazgo y cada insight,
 * porque el mismo análisis puede tener una parte bien respaldada (una
 * comparación entre dos mediciones completas) y otra que no (una tendencia
 * con dos puntos).
 */
export type Suficiencia = 'sin_datos' | 'insuficiente' | 'parcial' | 'suficiente';

// ── Comparación entre dos Mediciones ───────────────────────────────────────

export type DireccionCambio = 'aumento' | 'disminucion' | 'estable' | 'indeterminada';

/**
 * `no_definida` NO es un fallo: es el estado correcto para las 20 variables
 * a las que el BCS Design Handbook (12) no les asigna umbral de cambio
 * mínimo. Solo Peso (0.2 kg) y % grasa (0.3 pp) lo tienen, y el propio
 * handbook los declara "decisión de producto sin base clínica".
 */
export type Significancia = 'significativa' | 'insignificante' | 'no_definida';

export type DisponibilidadComparacion =
  | 'comparable'
  | 'dato_anterior_ausente'
  | 'dato_actual_ausente'
  | 'ambos_ausentes'
  | 'calculo_no_aplicable';

export interface ComparacionMetrica {
  variable: VariableId;
  etiqueta: string;
  unidad: string;
  procedencia: Procedencia;
  valorAnterior: number | null;
  valorActual: number | null;
  deltaAbsoluto: number | null;
  /** null cuando el valor anterior es 0 (división indefinida) o falta un dato. */
  deltaPorcentual: number | null;
  direccion: DireccionCambio;
  significancia: Significancia;
  disponibilidad: DisponibilidadComparacion;
  /** El umbral documentado que se aplicó, si existe alguno para esta variable. */
  umbralAplicado: number | null;
  razon: string;
}

// ── Tendencias históricas ──────────────────────────────────────────────────

export type EstadoTendencia =
  | 'insuficiente'
  | 'ascendente'
  | 'descendente'
  | 'estable'
  | 'variable'
  | 'indeterminada';

export interface TendenciaMetrica {
  variable: VariableId;
  etiqueta: string;
  unidad: string;
  estado: EstadoTendencia;
  /** Puntos NO nulos realmente usados — nunca el largo del histórico. */
  puntosUsados: number;
  primerValor: number | null;
  ultimoValor: number | null;
  cambioNeto: number | null;
  suficiencia: Suficiencia;
  razon: string;
}

// ── Hallazgos ──────────────────────────────────────────────────────────────

export type CategoriaHallazgo =
  | 'cambio_de_peso'
  | 'cambio_de_grasa'
  | 'cambio_de_masa_muscular'
  | 'cambio_de_agua'
  | 'composicion'
  | 'estabilidad'
  | 'datos_insuficientes'
  | 'calidad_de_dato';

/**
 * Deliberadamente NO es una escala clínica. `atencion` significa "revisar el
 * dato", nunca "riesgo para la persona" (BCS Handbook 06, regla no
 * negociable).
 */
export type SeveridadHallazgo = 'informativo' | 'atencion';

export interface Hallazgo {
  /** Id estable de la regla que lo produjo — sirve de clave de render y de aserción en tests. */
  id: string;
  categoria: CategoriaHallazgo;
  severidad: SeveridadHallazgo;
  titulo: string;
  descripcion: string;
  variables: VariableId[];
  /** Ids de las Mediciones que sostienen el hallazgo. */
  mediciones: string[];
  procedencia: Procedencia | null;
  suficiencia: Suficiencia;
  /**
   * Dirección del cambio que originó el hallazgo, cuando la hay. Existe para
   * que los insights puedan combinar hallazgos SIN volver a mirar las
   * Mediciones ni la comparación: sin este campo tendrían que re-derivarla,
   * que es exactamente lo que la separación de capas prohíbe.
   */
  direccion?: DireccionCambio;
  /** De dónde sale la regla — se muestra al usuario, así que va en lenguaje llano. */
  explicacion: string;
}

// ── Avisos: alerta ≠ limitación ≠ nota ─────────────────────────────────────

export type TipoAviso = 'alerta' | 'limitacion' | 'nota';

export interface Aviso {
  id: string;
  tipo: TipoAviso;
  titulo: string;
  descripcion: string;
  variables: VariableId[];
  mediciones: string[];
}

// ── Insights ───────────────────────────────────────────────────────────────

export interface Insight {
  id: string;
  titulo: string;
  descripcion: string;
  /** Ids de los Hallazgos que lo sostienen. Un insight jamás lee las Mediciones directamente. */
  hallazgosBase: string[];
  suficiencia: Suficiencia;
}

// ── Resumen ejecutivo ──────────────────────────────────────────────────────

export type TonoResumen = 'neutral' | 'informativo' | 'atencion';

export interface ResumenAnalisis {
  titulo: string;
  texto: string;
  tono: TonoResumen;
  hallazgosUsados: string[];
  suficiencia: Suficiencia;
}

// ── DTO canónico ───────────────────────────────────────────────────────────

export interface BodyCompositionAnalysis {
  /** Ids de las Mediciones usadas, de la más reciente a la más antigua. */
  medicionesAnalizadas: string[];
  medicionActualId: string | null;
  medicionAnteriorId: string | null;
  /** Fecha de la Medición más antigua analizada (yyyy-mm-dd). */
  fechaInicial: string | null;
  /** Fecha de la Medición más reciente analizada (yyyy-mm-dd). */
  fechaFinal: string | null;
  cantidadMediciones: number;
  suficiencia: Suficiencia;
  comparacion: ComparacionMetrica[];
  tendencias: TendenciaMetrica[];
  hallazgos: Hallazgo[];
  avisos: Aviso[];
  insights: Insight[];
  resumen: ResumenAnalisis;
}
