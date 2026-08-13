// ── Normative Interpretation Engine · contratos (Sprint NIE-1.1 + NIE-1.2) ──
//
// El NIE consume la NKB; no la modifica y no la duplica. Los valores
// normativos siguen viviendo en `docs/normative-knowledge-base/fichas/`.
//
// Este sprint implementa EXISTENCIA → CANDIDATURA → APLICABILIDAD.
// No calcula posición normativa, no clasifica y no interpreta.
//
// Vocabulario alineado con `36-contrato-consumo-nie.md`.

// ─── Vocabulario de coordenadas ─────────────────────────────────────────────

/** Variable normativa. Se compara por identidad exacta, nunca por semántica. */
export type VariableId = 'fuerza_prension_manual';

/** Unidades presentes en la NKB. **No son convertibles entre sí** (`39`). */
export type Unidad = 'kg' | 'kgf' | 'lbf';

export type Sexo = 'M' | 'F';

/**
 * Instrumento, por modelo. Dos aparatos de la misma marca son instrumentos
 * distintos: Takei TKK 5101 ≠ Takei T-18 SMEDLY III (`39`).
 */
export type InstrumentoId =
  | 'takei-tkk-5101'
  | 'takei-t18-tkk-smedley-iii'
  | 'camry-digital'
  | 'jamar-pc-5030-j1'
  | 'jamar-j00105'
  | 'smedley-s';

/** Cómo se consolida la medición. No hay equivalencias entre variantes. */
export type DefinicionOperacional =
  | 'media_ambas_manos'
  | 'maximo_ambas_manos'
  | 'mejor_mano_derecha'
  | 'mejor_mano_izquierda'
  | 'mejor_mano_dominante'
  | 'mejor_mano_no_dominante'
  | 'media_2a_y_3a_mano_dominante';

export type Posicion = 'bipedestacion' | 'sedestacion';

/** Lado medido. `ambas` = la norma consolida las dos manos en un solo valor. */
export type Lado = 'derecha' | 'izquierda' | 'dominante' | 'no_dominante' | 'ambas';

/** Código ISO-3166-1 alfa-2. La geografía es una dimensión, no una etiqueta. */
export type PaisId = 'CO' | 'CL' | 'BR' | 'DE';

export type EstadoNorma = 'ES-1' | 'ES-2' | 'ES-3' | 'ES-4' | 'ES-5';

export type Calidad = 'alta' | 'moderada' | 'baja' | 'muy_baja';

export type TipoNorma = 'TN-1' | 'TN-2' | 'TN-3' | 'TN-4' | 'TN-5' | 'TN-6' | 'TN-7';

/** Relación entre métodos. EQ-3 es la relación por defecto y la única en uso. */
export type Equivalencia = 'EQ-1' | 'EQ-2' | 'EQ-3';

/** Conflicto declarado **por la NKB**. El NIE lo propaga; no lo descubre. */
export type ConflictoDeclarado = 'ninguno' | 'CONFLICTO' | 'CONFLICTO_NO_DETERMINABLE';

// ─── La norma, tal como el motor la consume ─────────────────────────────────

/** Rango etario cubierto por una celda. Cerrado por ambos extremos. */
export interface RangoEtario {
  min: number;
  max: number;
}

/** Un percentil tal como lo publica la fuente. Ni uno más (`21`). */
export interface PercentilPublicado {
  /** 2.5, 3, 5, 10… tal como encabeza la columna en la ficha. */
  percentil: number;
  valor: number;
}

/**
 * Los estadísticos publicados de una celda.
 *
 * Unión discriminada porque TN-1 y TN-2 **no son la misma cosa** y no deben
 * poder confundirse: una dice dónde cae el percentil 25, la otra cuál es la
 * media. Ambas pueden ser ciertas a la vez y ninguna se deriva de la otra.
 */
export type ValoresNormativos =
  | { tipo: 'percentiles'; percentiles: readonly PercentilPublicado[] }
  | { tipo: 'media_dispersion'; media: number; desviacionTipica: number };

/**
 * Parámetros L, M y S del método LMS, cuando la fuente los publica.
 *
 * Se conservan porque la fuente los publica y porque son lo que hace
 * reproducible la norma. **No autorizan a calcular percentiles que la fuente no
 * tabula**: eso sería una derivación OR-3 que `21` no permite, y las fichas
 * chilenas lo dicen expresamente.
 */
export interface ParametrosModelo {
  L: number;
  M: number;
  S: number;
}

/** Rango de estatura en metros, cuando la norma estratifica por ella. */
export interface RangoEstatura {
  /** Exclusivo: la fuente publica «> 1,60». `null` = sin límite inferior. */
  minExclusivo: number | null;
  /** Inclusivo: la fuente publica «≤ 1,70». `null` = sin límite superior. */
  maxInclusivo: number | null;
}

/**
 * Una norma de la NKB, con lo que hace falta para resolver candidatura y
 * aplicabilidad. **No incluye los valores normativos**: este sprint no calcula
 * nada, y pedirlos invitaría a hacerlo.
 */
export interface NormaNKB {
  /** Id de la fila en su ficha, p. ej. `HGS-CO-UNI-M-18`. */
  id: string;
  /** Id de la ficha que la contiene, p. ej. `HGS-CO-UNI-TN1`. */
  fichaId: string;

  // Identidad
  variable: VariableId;
  pais: PaisId;
  /** Población tal como la declara CN-04. Prosa: se muestra, no se compara. */
  poblacion: string;
  instrumento: InstrumentoId;
  definicionOperacional: DefinicionOperacional;
  /**
   * `null` = la fuente no la declara. Ocurre con las dos fichas alemanas, cuyo
   * CN-33 reconoce «protocolo incompleto» (`39`). No se supone.
   */
  posicion: Posicion | null;
  lado: Lado;
  unidad: Unidad;
  tipo: TipoNorma;

  // Estrato de esta celda concreta
  edad: RangoEtario;
  sexo: Sexo;
  /** `null` = la norma no estratifica por estatura. */
  estatura: RangoEstatura | null;

  /**
   * Los estadísticos que publica la fuente para esta celda.
   *
   * Entran en el resultado porque proceden de la NKB. El NIE **no los crea, no
   * los modifica, no los convierte y no los interpola**: solo los transporta.
   */
  valores: ValoresNormativos;
  /** `null` salvo en las fichas que publican L, M y S. */
  parametrosModelo: ParametrosModelo | null;

  // Estado y calidad — ejes independientes (`38`)
  estado: EstadoNorma;
  calidad: Calidad;
  /** Dimensiones D-01…D-06 que degradaron la calidad (CN-30). */
  dimensionesDegradantes: readonly string[];
  /** `null` = la fuente no publica N por celda. No se estima (`16`). */
  nCelda: number | null;
  /** Los percentiles son proyecciones del modelo de la fuente, no observados. */
  valoresProyectados: boolean;

  // Procedencia y límites
  referencia: string;
  /** Fichero de la NKB del que se leyó. */
  fichero: string;
  /** Cabecera de la tabla de la que procede la fila, tal como la publica. */
  tabla: string;
  /** CN-34: dónde declaró la fuente que aplica. */
  alcance: string;
  /** CN-13 y CN-14: a quién incluyó y excluyó el estudio. */
  restricciones: readonly string[];
  /** CN-32 y CN-33. */
  limitaciones: readonly string[];
  /** Advertencias que deben viajar con cualquier uso de la norma. */
  advertencias: readonly string[];
  /** Conflicto declarado por la NKB (CN-39). */
  conflicto: ConflictoDeclarado;
}

// ─── Entrada ────────────────────────────────────────────────────────────────

/**
 * Contexto de evaluación.
 *
 * **No contiene el valor medido, y no debe contenerlo.** La aplicabilidad
 * depende del contexto normativo, nunca de si el resultado del sujeto «encaja»
 * con la norma. Que el valor no esté aquí lo hace imposible por construcción.
 *
 * Todo campo es `null` cuando no consta. `null` significa *no se sabe*, y
 * produce NO_DETERMINABLE — nunca un valor por defecto silencioso.
 */
export interface ContextoEvaluacion {
  variable: VariableId | null;
  edad: number | null;
  sexo: Sexo | null;
  pais: PaisId | null;
  instrumento: InstrumentoId | null;
  unidad: Unidad | null;
  definicionOperacional: DefinicionOperacional | null;
  posicion: Posicion | null;
  lado: Lado | null;
  /** En metros. Necesaria solo frente a normas estratificadas por estatura. */
  estaturaM: number | null;
  metadatos: Record<string, string>;
}

// ─── Estados ────────────────────────────────────────────────────────────────

/** Resultado de comparar una coordenada del contexto con la de la norma. */
export type EstadoDimension =
  /** Coinciden. */
  | 'MATCH'
  /** Difieren de forma demostrable. Basta uno para excluir la norma. */
  | 'MISMATCH'
  /** Falta información en el contexto. No se asume, no se infiere. */
  | 'NO_DETERMINABLE'
  /** La norma no estratifica por esta dimensión: nada que comparar. */
  | 'NO_APLICA';

/** Caso especial de MISMATCH: se nombra aparte porque el contrato lo exige. */
export const UNIT_MISMATCH = 'UNIT_MISMATCH' as const;

export type DimensionId =
  | 'variable'
  | 'pais'
  | 'instrumento'
  | 'unidad'
  | 'definicion_operacional'
  | 'posicion'
  | 'lado'
  | 'edad'
  | 'sexo'
  | 'estatura';

export interface ComparacionDimension {
  dimension: DimensionId;
  estado: EstadoDimension;
  /** Lo que declara la norma, en texto legible. */
  esperado: string;
  /** Lo que aporta el contexto. `null` = no consta. */
  recibido: string | null;
  /** Motivo legible. Es lo que hace auditable la decisión. */
  motivo: string;
  /** Marca reservada al desajuste de unidad (`39`). */
  codigo?: typeof UNIT_MISMATCH;
}

/** Estados de consumo de `36` y `38`. Ninguno significa diagnóstico. */
export type EstadoAplicabilidad =
  | 'APLICABLE'
  | 'APLICABLE_CON_RESERVAS'
  | 'NO_APLICABLE'
  | 'NO_DETERMINABLE'
  | 'CONFLICTO'
  | 'CONFLICTO_NO_DETERMINABLE';

/** Estado global de la resolución. Añade los dos que no son por candidata. */
export type EstadoResolucion = EstadoAplicabilidad | 'SIN_NORMA_ADMISIBLE';

/** Por qué una candidata quedó APLICABLE_CON_RESERVAS. Nunca se puntúa. */
export type MotivoReserva =
  | 'estado_cuestionado'
  | 'calidad_baja'
  | 'n_celda_no_consta'
  | 'valores_proyectados'
  | 'conflicto_declarado';

// ─── Salida ─────────────────────────────────────────────────────────────────

/**
 * Traza documental completa: norma → ficha → tabla → fila → fuente primaria.
 *
 * Ninguna candidata puede existir sin ella.
 */
export interface Procedencia {
  normaId: string;
  fichaId: string;
  /** Fichero de la NKB del que procede. */
  fichero: string;
  /** Cabecera de la tabla, tal como la publica la ficha. */
  tabla: string;
  /** Estrato al que corresponde la fila. */
  fila: string;
  /** Clave en `_evidencia/referencias.yaml`. */
  referencia: string;
}

// ─── NIE-1.3.2 · estados de interpretación ──────────────────────────────────

/**
 * Resultado de intentar interpretar un valor observado contra una norma.
 *
 * **Es un cuarto eje**, independiente de los tres que ya existen:
 *
 * | Eje | Responde |
 * |---|---|
 * | `EstadoAplicabilidad` | ¿Corresponde esta norma a este caso? |
 * | `Calidad` | ¿Cuánto respalda la evidencia a esta norma? |
 * | `ConflictoDeclarado` | ¿La NKB registró una objeción sobre ella? |
 * | **`EstadoInterpretacion`** | **¿Qué se pudo hacer con el valor observado?** |
 *
 * Mezclarlos ocultaría precisamente lo que hay que ver: una norma puede ser
 * aplicable, de calidad Baja, cuestionada, y aun así producir un resultado
 * matemático perfectamente definido.
 *
 * Ninguno de estos estados es un diagnóstico.
 */
export type EstadoInterpretacion =
  /** El valor coincide exactamente con un percentil publicado. */
  | 'COINCIDE_CON_PERCENTIL'
  /** Cae entre dos percentiles publicados. **No se interpola.** */
  | 'ENTRE_PERCENTILES_PUBLICADOS'
  /** Queda por debajo del menor percentil que la fuente publica. */
  | 'POR_DEBAJO_DEL_MENOR_PUBLICADO'
  /** Queda por encima del mayor percentil que la fuente publica. */
  | 'POR_ENCIMA_DEL_MAYOR_PUBLICADO'
  /** Operación aritmética ejecutada sobre lo que la fuente publica. */
  | 'CALCULADA'
  /** Matemáticamente posible, científicamente no autorizada. */
  | 'OPERACION_NO_AUTORIZADA'
  /** La norma no aporta lo que la operación necesita. */
  | 'DATOS_INSUFICIENTES'
  /** La norma no corresponde a este caso: no se interpreta nada. */
  | 'NORMA_NO_APLICABLE'
  /** Unidades distintas. No se convierte (`39`). */
  | 'UNIDAD_INCOMPATIBLE'
  /** No hay ninguna norma admisible que interpretar. */
  | 'SIN_NORMA_APLICABLE'
  /** Se pidió un punto de corte y no existe ninguno admisible (`41`). */
  | 'SIN_PUNTO_DE_CORTE_ADMISIBLE'
  /** Se pidió una clasificación y no existe ninguna norma TN-7 admisible. */
  | 'SIN_CLASIFICACION_ADMISIBLE'
  /**
   * No se dan las condiciones para comparar. Es el estado que el motor
   * **prefiere** frente a producir una comparación que no puede sostener.
   */
  | 'NO_COMPARABLE'
  /**
   * No comparable porque los métodos están en EQ-3.
   *
   * Se nombra aparte de `NO_COMPARABLE` porque el motivo importa: aquí no falta
   * información ni coincide todo lo demás por casualidad. La unidad puede ser
   * convertible, la población idéntica y la edad la misma, y sigue sin poder
   * compararse. **La unidad no resuelve un problema metodológico.**
   */
  | 'NO_COMPARABLE_EQ3'
  /**
   * Varias normas comparables que **no dicen lo mismo**.
   *
   * Estado del conjunto, no de ninguna de ellas. Aparece cuando hay más de una
   * norma comparable y sus estados difieren —lo normal si una es TN-1 y otra
   * TN-2—. El motor no resuelve el empate ni toma la primera: expone que hay
   * que leer cada norma con la suya.
   */
  | 'ESTADOS_DIVERGENTES';

// ─── NIE-1.6 · ejes de unidad y de evidencia ────────────────────────────────

/**
 * Estado de la unidad en una comparación. **Eje propio**: no se mezcla con la
 * aplicabilidad ni con la interpretación.
 */
export type EstadoUnidad =
  /** Observado y norma ya están en la misma unidad. */
  | 'MISMA_UNIDAD'
  /** El par está autorizado y se convirtió **porque se pidió**. */
  | 'CONVERSION_AUTORIZADA'
  /**
   * El par está autorizado pero **nadie pidió convertir**. No se convierte en
   * silencio: la comparación se detiene y el consumidor decide.
   */
  | 'CONVERSION_DISPONIBLE_NO_SOLICITADA'
  /** El par no está autorizado (`39`, `08`). */
  | 'CONVERSION_NO_AUTORIZADA'
  /** Unidades distintas sin par declarado. */
  | 'UNIT_MISMATCH';

/** Estado de la evidencia que sostiene la norma. Eje propio. */
export type EstadoEvidencia = 'ACTIVA' | 'CUESTIONADA';

/** Lo que la operación produjo. Unión discriminada: nunca un número desnudo. */
export type ResultadoEstadistico =
  | {
      tipo: 'percentil_exacto';
      percentil: number;
      valorNormativo: number;
    }
  | {
      tipo: 'entre_percentiles';
      /** `null` cuando el valor queda por debajo del menor publicado. */
      inferior: PercentilPublicado | null;
      /** `null` cuando queda por encima del mayor publicado. */
      superior: PercentilPublicado | null;
    }
  | {
      tipo: 'puntuacion_z';
      z: number;
      media: number;
      desviacionTipica: number;
    };

// ─── NIE-1.4 · comparación estructurada ─────────────────────────────────────

/**
 * Naturaleza de una diferencia entre dos normas.
 *
 * **No existe una categoría «mejor»**, y no debe añadirse: describir en qué se
 * diferencian dos normas es del NIE; decidir cuál usar, no.
 */
export type CategoriaDiferencia =
  | 'identidad'
  | 'metodologica'
  | 'calidad'
  | 'estado'
  | 'unidad'
  | 'procedencia'
  | 'tipo_normativo';

export interface Diferencia {
  campo: string;
  categoria: CategoriaDiferencia;
  /** Qué declara cada norma, por id. */
  porNorma: Readonly<Record<string, string>>;
  /** Qué implica la diferencia. Nunca cuál conviene. */
  nota: string;
}

export interface ComparacionCandidatas {
  normas: readonly string[];
  coincidencias: readonly string[];
  diferencias: readonly Diferencia[];
  /** Lectura en una línea. Descriptiva, jamás comparativa de mérito. */
  resumen: string;
}

export interface Candidata {
  normaId: string;
  fichaId: string;
  variable: VariableId;
  instrumento: InstrumentoId;
  poblacion: string;
  pais: PaisId;
  /** Descripción legible del estrato de esta celda. */
  estrato: string;
  tipo: TipoNorma;
  unidad: Unidad;

  /** Los estadísticos publicados. Transportados desde la NKB, sin tocar. */
  valores: ValoresNormativos;
  parametrosModelo: ParametrosModelo | null;

  /** Estado de la norma en la NKB. ES-2 no se descarta ni se convierte. */
  estadoNorma: EstadoNorma;
  calidad: Calidad;
  dimensionesDegradantes: readonly string[];
  nCelda: number | null;

  aplicabilidad: EstadoAplicabilidad;
  /** Vacío salvo en APLICABLE_CON_RESERVAS. No es una puntuación. */
  motivosReserva: readonly MotivoReserva[];

  dimensiones: readonly ComparacionDimension[];
  coincidencias: readonly DimensionId[];
  discrepancias: readonly DimensionId[];
  camposFaltantes: readonly DimensionId[];

  restricciones: readonly string[];
  limitaciones: readonly string[];
  advertencias: readonly string[];
  conflicto: ConflictoDeclarado;
  procedencia: Procedencia;
}

export interface ResolucionNormativa {
  contexto: ContextoEvaluacion;
  /** **Todas** las candidatas halladas, sin ordenar por conveniencia. */
  candidatas: readonly Candidata[];
  estadoGlobal: EstadoResolucion;
  /** Recuento por estado de aplicabilidad, para auditar de un vistazo. */
  resumen: Readonly<Record<EstadoAplicabilidad, number>>;
  /** Advertencias de la resolución en conjunto, no de una candidata. */
  advertencias: readonly string[];
}
