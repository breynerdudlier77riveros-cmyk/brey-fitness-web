// ── Taxonomía del plan gráfico (Sprint MAC-3) ──────────────────────────────
//
// LO QUE CAMBIA RESPECTO A `modelos.ts`.
//
//   Los cinco modelos de periodización llevan `verificado: false` porque la
//   obra original no se había abierto. AQUÍ SÍ. Todo lo de este fichero está
//   transcrito de un libro que el proyecto tiene delante:
//
//     Forteza de la Rosa, A. «Entrenamiento deportivo: alta metodología y
//     planificación». Armenia (Colombia): Editorial Kinesis, 2009. 216 p.
//     ISBN 978-958-8269-48-1.
//
//   Cada entrada dice su PÁGINA. Eso es lo que separa esta taxonomía de una
//   lista de nombres que suenan bien: se puede ir al libro y comprobarla.
//
// ── LO QUE NO SE HACE AQUÍ ────────────────────────────────────────────────
//
//   No se prescribe. Los tipos traen su definición y, cuando el libro la
//   publica, la composición de microciclos que el autor da como ejemplo. Ni
//   una de esas composiciones se aplica sola: son plantillas que el entrenador
//   acepta o cambia, igual que las cifras de la rejilla.
//
//   Y NO SE ARMONIZAN LAS CONTRADICCIONES. El propio libro publica dos
//   escalas distintas de magnitud de carga atribuidas a Platonov 1980 (pp. 128
//   y 153). Las dos se registran con su página; elegir una sería inventar un
//   acuerdo que el libro no tiene.

/** La obra, una sola vez. Todo lo de este fichero sale de aquí. */
export const FUENTE = {
  id: 'forteza_2009',
  cita:
    'Forteza de la Rosa, A. (2009). Entrenamiento deportivo: alta metodología y ' +
    'planificación. Armenia: Editorial Kinesis. ISBN 978-958-8269-48-1',
  verificado: true,
} as const;

export interface EntradaTaxonomia {
  id: string;
  /** Cómo lo nombra el libro. */
  nombre: string;
  /** Código corto para la rejilla. Los del plan gráfico de toda la vida. */
  codigo: string;
  /** Qué es, en las palabras con que el libro lo describe. */
  descripcion: string;
  color: string;
  /** Página de la obra donde aparece. */
  pagina: number;
}

// ════════════════════════════════════════════════════════════════════════════
// PERIODOS Y ETAPAS  ·  pp. 141-147
// ════════════════════════════════════════════════════════════════════════════
//
// El libro los deriva de las tres fases de la forma deportiva —adquisición,
// conservación y pérdida temporal— y no al revés (p. 141): «estos períodos,
// en realidad son momentos consecutivos del proceso de dirección de la forma
// deportiva».

export const PERIODOS: readonly EntradaTaxonomia[] = [
  {
    id: 'preparatorio',
    nombre: 'Periodo preparatorio',
    codigo: 'PREP',
    descripcion: 'Adquisición de la forma deportiva.',
    color: '#f97316',
    pagina: 172,
  },
  {
    id: 'competitivo',
    nombre: 'Periodo competitivo',
    codigo: 'COMP',
    descripcion: 'Mantenimiento de la forma deportiva.',
    color: '#dc2626',
    pagina: 172,
  },
  {
    id: 'transitorio',
    nombre: 'Periodo transitorio',
    codigo: 'TRANS',
    descripcion: 'Pérdida temporal de la forma deportiva.',
    color: '#64748b',
    pagina: 172,
  },
];

export const ETAPAS: readonly EntradaTaxonomia[] = [
  {
    id: 'prep_general',
    nombre: 'Preparación general',
    codigo: 'EPG',
    descripcion:
      'Crear la base para la preparación especial y competitiva. La cantidad de ejercicios ' +
      'es mucho mayor que la calidad en la ejecución.',
    color: '#3b82f6',
    pagina: 146,
  },
  {
    id: 'prep_especifica',
    nombre: 'Preparación específica',
    codigo: 'EPE',
    descripcion:
      'El trabajo se acerca a las exigencias de la competición. El ritmo de ejecución y la ' +
      'calidad aumentan; disminuye la cantidad de ejercicios.',
    color: '#8b5cf6',
    pagina: 146,
  },
  {
    id: 'pre_competitiva',
    nombre: 'Pre-competitiva',
    codigo: 'EPC',
    descripcion:
      'Preparación inmediata para la competencia fundamental (EPIC): se modela el ejercicio ' +
      'competitivo, el régimen de competencias y las condiciones exteriores.',
    color: '#f59e0b',
    pagina: 147,
  },
  {
    id: 'competitiva',
    nombre: 'Competitiva',
    codigo: 'EC',
    descripcion: 'Preparación funcional inmediata para las competencias.',
    color: '#dc2626',
    pagina: 146,
  },
  {
    id: 'transitoria',
    nombre: 'Transitoria',
    codigo: 'ET',
    descripcion: 'Alivio de la preparación. Descanso activo.',
    color: '#64748b',
    pagina: 146,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// TIPOS DE MICROCICLO  ·  pp. 159-161
// ════════════════════════════════════════════════════════════════════════════
//
// Los códigos de una y dos letras son los que se leen en cualquier plan
// gráfico —O, CH, A, C, R—. Se conservan porque quien lleva años leyendo
// estos cuadros los reconoce sin leyenda.

export const TIPOS_MICROCICLO: readonly EntradaTaxonomia[] = [
  {
    id: 'corriente',
    nombre: 'Corriente',
    codigo: 'O',
    descripcion:
      'Crecimiento uniforme de las cargas, volumen considerable y nivel limitado de ' +
      'intensidad en la mayoría de las sesiones por separado.',
    color: '#22c55e',
    pagina: 159,
  },
  {
    id: 'choque',
    nombre: 'Choque',
    codigo: 'CH',
    descripcion:
      'A la par del volumen creciente de las cargas, alta intensidad sumaria, concentrando ' +
      'las sesiones en el tiempo.',
    color: '#dc2626',
    pagina: 159,
  },
  {
    id: 'aproximacion',
    nombre: 'Aproximación',
    codigo: 'A',
    descripcion:
      'Se organiza según las reglas de acercamiento a las competencias: modela el régimen y ' +
      'el programa del próximo certamen.',
    color: '#f59e0b',
    pagina: 160,
  },
  {
    id: 'competitivo',
    nombre: 'Competitivo',
    codigo: 'C',
    descripcion:
      'Régimen establecido por el reglamento oficial del torneo. Incluye la fase de ' +
      '«disposición operativa» del día anterior y las fases entre salidas.',
    color: '#a855f7',
    pagina: 160,
  },
  {
    id: 'restablecimiento',
    nombre: 'Restablecimiento',
    codigo: 'R',
    descripcion:
      'Magnitud disminuida de la carga, aumento de las sesiones de descanso activo. Sigue a ' +
      'las competencias tensas o a una serie de microciclos de choque.',
    color: '#0ea5e9',
    pagina: 160,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// TIPOS DE MESOCICLO  ·  pp. 163-168
// ════════════════════════════════════════════════════════════════════════════

export interface TipoMesociclo extends EntradaTaxonomia {
  /**
   * La composición de microciclos que el libro da como ejemplo, por id.
   *
   * ES UN EJEMPLO DEL AUTOR, NO UNA RECETA. El libro las escribe como
   * «pueden combinarse con los siguientes microciclos» (p. 165). Se guarda
   * porque sembrar un mesociclo con la composición publicada ahorra escribirla
   * a mano, y porque queda a la vista de dónde salió.
   */
  composicion: readonly string[];
}

export const TIPOS_MESOCICLO: readonly TipoMesociclo[] = [
  {
    id: 'entrante',
    nombre: 'Entrante',
    codigo: 'ME',
    descripcion:
      'Inicia la preparación en el macrociclo. Intensidad más baja que en los mesociclos ' +
      'principales, pero el volumen puede alcanzar magnitudes considerables.',
    color: '#3b82f6',
    composicion: ['corriente', 'corriente', 'restablecimiento'],
    pagina: 163,
  },
  {
    id: 'basico_desarrollador',
    nombre: 'Básico desarrollador',
    codigo: 'MBD',
    descripcion:
      'Lleva al deportista a un nivel nuevo de capacidad de trabajo. Aumento considerable de ' +
      'las cargas sumarias del entrenamiento.',
    color: '#7c3aed',
    composicion: ['corriente', 'choque', 'choque', 'choque', 'restablecimiento'],
    pagina: 164,
  },
  {
    id: 'basico_estabilizador',
    nombre: 'Básico estabilizador',
    codigo: 'MBE',
    descripcion:
      'Interrumpe temporalmente el crecimiento de la carga en los niveles alcanzados, lo que ' +
      'posibilita adaptarse a las exigencias del mesociclo anterior.',
    color: '#0ea5e9',
    composicion: ['corriente', 'corriente', 'aproximacion', 'competitivo', 'restablecimiento'],
    pagina: 164,
  },
  {
    id: 'preparatorio_control',
    nombre: 'Preparatorio de control',
    codigo: 'MPC',
    descripcion:
      'Forma de transición entre los básicos y los de competición. Las competencias adquieren ' +
      'significado de entrenamiento y de control.',
    color: '#14b8a6',
    composicion: [
      'corriente',
      'competitivo',
      'aproximacion',
      'competitivo',
      'restablecimiento',
    ],
    pagina: 165,
  },
  {
    id: 'precompetitivo',
    nombre: 'Precompetitivo',
    codigo: 'MPV',
    descripcion:
      'Típico de la preparación inmediata al torneo principal. Modela con la mayor ' +
      'aproximación posible el régimen de actuación de la competencia.',
    color: '#f59e0b',
    composicion: ['aproximacion', 'aproximacion', 'competitivo', 'aproximacion'],
    pagina: 165,
  },
  {
    id: 'competitivo',
    nombre: 'Competitivo',
    codigo: 'MC',
    descripcion:
      'Tipo principal en el periodo de las competencias más importantes. Su organización ' +
      'depende del calendario y del número de salidas del deportista.',
    color: '#dc2626',
    composicion: [
      'aproximacion',
      'competitivo',
      'competitivo',
      'competitivo',
      'restablecimiento',
    ],
    pagina: 166,
  },
  {
    id: 'restablecimiento_mantenedor',
    nombre: 'Restablecimiento mantenedor',
    codigo: 'MRM',
    descripcion:
      'Régimen más suave, para aliviar las exigencias sin que el efecto acumulado desencadene ' +
      'un desentrenamiento. Se usa cuando el calendario competitivo es muy prolongado.',
    color: '#22c55e',
    composicion: ['restablecimiento', 'corriente', 'restablecimiento'],
    pagina: 167,
  },
  {
    id: 'preparatorio_restablecimiento',
    nombre: 'Preparatorio de restablecimiento',
    codigo: 'MPR',
    descripcion:
      'Similar al básico pero con más microciclos de restablecimiento. Recupera al deportista ' +
      'al final del ciclo grande.',
    color: '#64748b',
    composicion: [
      'restablecimiento',
      'corriente',
      'corriente',
      'restablecimiento',
      'restablecimiento',
    ],
    pagina: 167,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// COMPETENCIAS  ·  pp. 146, 165
// ════════════════════════════════════════════════════════════════════════════

export const CATEGORIAS_COMPETENCIA: readonly EntradaTaxonomia[] = [
  {
    id: 'preparatoria',
    nombre: 'Preparatoria',
    codigo: 'c.p',
    descripcion:
      'De limitada importancia, más bien como control de entrenamiento, sin una preparación ' +
      'especial competitiva.',
    color: '#14b8a6',
    pagina: 146,
  },
  {
    id: 'control',
    nombre: 'De control',
    codigo: 'c.c',
    descripcion:
      'Adquiere significado de entrenamiento y de control; en ella se descubren deficiencias ' +
      'técnico-tácticas o de preparación física.',
    color: '#f59e0b',
    pagina: 165,
  },
  {
    id: 'fundamental',
    nombre: 'Fundamental',
    codigo: 'C.F',
    descripcion:
      'La competencia para la que se modela la preparación inmediata (EPIC). De ella depende ' +
      'el resultado final de todo el proceso.',
    color: '#dc2626',
    pagina: 147,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// CONTENIDOS DE PREPARACIÓN  ·  pp. 10, 146-147
// ════════════════════════════════════════════════════════════════════════════
//
// El libro enumera los contenidos de preparación como «físicos, técnicos,
// tácticos, teóricos, psicológicos» (p. 10) y les dedica una fila a cada uno
// en el cuadro de particularidades de los periodos (pp. 146-147).
//
// Las capacidades físicas se reparten en general y especial porque esa es la
// división que el libro usa en todo el capítulo 5, y porque es la que sostiene
// el reparto de porcentajes del capítulo 6.

export interface GrupoCapacidades {
  id: string;
  nombre: string;
  color: string;
  capacidades: readonly string[];
  pagina: number;
}

export const GRUPOS_CAPACIDADES: readonly GrupoCapacidades[] = [
  {
    id: 'fisica_general',
    nombre: 'Preparación física general',
    color: '#3b82f6',
    capacidades: ['Fuerza', 'Velocidad', 'Resistencia', 'Flexibilidad', 'Coordinación'],
    pagina: 146,
  },
  {
    id: 'fisica_especial',
    nombre: 'Preparación física especial',
    color: '#8b5cf6',
    capacidades: ['Fuerza', 'Velocidad', 'Resistencia', 'Flexibilidad', 'Coordinación'],
    pagina: 146,
  },
  {
    id: 'tecnico_tactica',
    nombre: 'Preparación técnico-táctica',
    color: '#f59e0b',
    capacidades: ['Técnica', 'Táctica'],
    pagina: 146,
  },
  {
    id: 'teorica_psicologica',
    nombre: 'Preparación teórica y psicológica',
    color: '#14b8a6',
    capacidades: ['Teórica', 'Psicología'],
    pagina: 147,
  },
  {
    id: 'control',
    nombre: 'Controles y campamentos',
    color: '#64748b',
    // NO lleva «Competencias»: esas tienen su propia banda, con nombre y
    // categoría. Una fila de marcas llamada igual que la banda dejaría dos
    // sitios donde apuntar la misma competencia, y acabarían discrepando.
    capacidades: ['Controles', 'Campamentos'],
    pagina: 146,
  },
];

// ── Búsqueda ───────────────────────────────────────────────────────────────

const indice = <T extends { id: string }>(xs: readonly T[]) => new Map(xs.map((x) => [x.id, x]));

const I_PERIODO = indice(PERIODOS);
const I_ETAPA = indice(ETAPAS);
const I_MICRO = indice(TIPOS_MICROCICLO);
const I_MESO = indice(TIPOS_MESOCICLO);
const I_COMP = indice(CATEGORIAS_COMPETENCIA);

export const periodoDe = (id: string | null) => (id === null ? null : I_PERIODO.get(id) ?? null);
export const etapaDe = (id: string | null) => (id === null ? null : I_ETAPA.get(id) ?? null);
export const tipoMicrocicloDe = (id: string | null) =>
  id === null ? null : I_MICRO.get(id) ?? null;
export const tipoMesocicloDe = (id: string | null) => (id === null ? null : I_MESO.get(id) ?? null);
export const categoriaCompetenciaDe = (id: string | null) =>
  id === null ? null : I_COMP.get(id) ?? null;
