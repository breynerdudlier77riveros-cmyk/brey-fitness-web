// ── Adaptador NKB → NIE · coordenadas de identidad por ficha ───────────────
//
// Las fichas de la NKB son documentos: sus campos CN son prosa, escrita para
// que la lea una persona. Este módulo declara las mismas coordenadas en forma
// comparable por una máquina.
//
// **No es una copia de la NKB y no contiene ni un valor normativo.** Son las
// coordenadas de identidad de 15 fichas, no las 356 normas. Los valores siguen
// viviendo únicamente en `docs/normative-knowledge-base/fichas/`.
//
// Vive en el NIE y no en la NKB por la separación de `36`: el NIE consume, la
// NKB no se modifica para acomodarlo.
//
// Cada campo indica de qué CN procede. `trazabilidad.test.ts` comprueba que lo
// declarado aquí aparece literalmente en ese campo de la ficha: si alguien
// edita una y no la otra, el test falla.

import type {
  Calidad,
  ConflictoDeclarado,
  DefinicionOperacional,
  InstrumentoId,
  Lado,
  PaisId,
  Posicion,
  RangoEstatura,
  TipoNorma,
  Unidad,
  VariableId,
} from '../tipos';

export interface CoordenadasFicha {
  fichaId: string;
  /** Nombre del fichero en `docs/normative-knowledge-base/fichas/`. */
  fichero: string;

  variable: VariableId;
  /** CN-01. Fragmento que debe aparecer literalmente en la ficha. */
  variableCN01: string;

  pais: PaisId;
  /** CN-04. */
  paisCN04: string;

  instrumento: InstrumentoId;
  /** CN-07. */
  instrumentoCN07: string;

  definicionOperacional: DefinicionOperacional;
  /** CN-02. */
  definicionCN02: string;

  /** `null` = la fuente no declara la posición corporal (`39`). */
  posicion: Posicion | null;
  /** CN-08. `null` cuando la posición no consta. */
  posicionCN08: string | null;

  lado: Lado;
  unidad: Unidad;
  /** CN-06. */
  unidadCN06: string;

  tipo: TipoNorma;
  calidad: Calidad;
  /** CN-30. */
  dimensionesDegradantes: readonly string[];
  /** CN-15: `false` cuando la fuente no publica N por celda. */
  publicaNPorCelda: boolean;
  /** CN-35 / CN-11: percentiles proyectados por un modelo, no observados. */
  valoresProyectados: boolean;
  /** `null` cuando la norma no estratifica por estatura. */
  estatura: RangoEstatura | null;
  conflicto: ConflictoDeclarado;

  restricciones: readonly string[];
  limitaciones: readonly string[];
  advertencias: readonly string[];
}

const V: VariableId = 'fuerza_prension_manual';

// Restricciones compartidas por las seis fichas brasileñas (CN-13 y CN-14).
const RESTRICCIONES_BR = [
  'Edad igual o superior a 65 años',
  'Preservación cognitiva, velocidad de marcha superior a 0,8 m/s e independencia en actividades básicas de la vida diaria',
  'Excluidos valores biológicamente implausibles y diferencias superiores a 5 kgf entre la segunda y la tercera medición',
] as const;

const LIMITACIONES_BR = [
  'Los percentiles son proyecciones de un modelo de regresión de media y dispersión, no frecuencias observadas',
  'El tamaño muestral por celda de edad × altura no consta',
  'Datos recogidos en 2009-2010',
  'No se transcriben las edades de 91 a 95 que la tabla publica, por quedar fuera del rango 65–90 declarado por la fuente',
] as const;

const ADVERTENCIAS_BR = [
  'Describe a personas mayores con envejecimiento satisfactorio según los criterios del estudio, no a la población mayor brasileña en general',
] as const;

/** Genera las cinco fichas brasileñas que comparten todo salvo el estrato. */
function brasil(
  fichaId: string,
  fichero: string,
  estatura: RangoEstatura,
  extraAdvertencias: readonly string[] = [],
): CoordenadasFicha {
  return {
    fichaId,
    fichero,
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual de la **mano dominante**',
    pais: 'BR',
    paisCN04: 'residentes en Brasil',
    instrumento: 'jamar-j00105',
    instrumentoCN07: 'JAMAR hidráulico J00105',
    definicionOperacional: 'media_2a_y_3a_mano_dominante',
    definicionCN02: 'Media de la segunda y tercera de tres repeticiones con la mano dominante',
    posicion: 'sedestacion',
    posicionCN08: 'Sentado en silla sin apoyabrazos',
    lado: 'dominante',
    unidad: 'kgf',
    unidadCN06: 'Kilogramo-fuerza (kgf)',
    tipo: 'TN-1',
    calidad: 'moderada',
    dimensionesDegradantes: ['D-02', 'D-05'],
    publicaNPorCelda: false,
    valoresProyectados: true,
    estatura,
    conflicto: 'ninguno',
    restricciones: RESTRICCIONES_BR,
    limitaciones: LIMITACIONES_BR,
    advertencias: [...ADVERTENCIAS_BR, ...extraAdvertencias],
  };
}

export const COORDENADAS: readonly CoordenadasFicha[] = [
  // ── Colombia · escolares · ENSIN-2015 ────────────────────────────────────
  {
    fichaId: 'HGS-CO-TN1',
    fichero: 'HGS-CO-TN1-percentiles-escolares.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual, absoluta',
    pais: 'CO',
    paisCN04: 'Población civil no institucionalizada de Colombia',
    instrumento: 'takei-tkk-5101',
    instrumentoCN07: 'Takei TKK 5101',
    definicionOperacional: 'media_ambas_manos',
    definicionCN02: 'Media de los valores de ambas manos',
    posicion: 'bipedestacion',
    posicionCN08: 'Bipedestación',
    lado: 'ambas',
    unidad: 'kg',
    unidadCN06: 'Kilogramos',
    tipo: 'TN-1',
    calidad: 'moderada',
    dimensionesDegradantes: ['D-02', 'D-04'],
    publicaNPorCelda: true,
    valoresProyectados: false,
    estatura: null,
    conflicto: 'CONFLICTO_NO_DETERMINABLE',
    restricciones: [
      'Población civil no institucionalizada, residente habitual del hogar',
      'La fuente no detalla criterios de exclusión',
    ],
    limitaciones: [
      'Análisis secundario: el protocolo lo fijó la encuesta, no el estudio',
      'Criterios de exclusión no declarados',
      'Celdas de 6 a 12 años con N entre 52 y 79',
      'Datos de 2015',
    ],
    advertencias: [
      'Norma en ES-2 · Cuestionada: otro análisis de las mismas mediciones de la ENSIN-2015 publica percentiles que difieren hasta 4,5 kg en el P50',
      'El valor depende del estimador empleado, que la identidad normativa no captura',
    ],
  },

  // ── Colombia · universitarios ────────────────────────────────────────────
  {
    fichaId: 'HGS-CO-UNI-TN1',
    fichero: 'HGS-CO-UNI-TN1-percentiles.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual, absoluta',
    pais: 'CO',
    paisCN04: 'Estudiantes universitarios',
    instrumento: 'takei-t18-tkk-smedley-iii',
    instrumentoCN07: 'T-18 TKK SMEDLY III',
    definicionOperacional: 'media_ambas_manos',
    definicionCN02: 'Media de los máximos de ambas manos',
    posicion: 'bipedestacion',
    posicionCN08: 'De pie',
    lado: 'ambas',
    unidad: 'kg',
    unidadCN06: 'Kilogramos',
    tipo: 'TN-1',
    calidad: 'moderada',
    dimensionesDegradantes: ['D-01', 'D-04'],
    publicaNPorCelda: true,
    valoresProyectados: true,
    estatura: null,
    conflicto: 'ninguno',
    restricciones: [
      'Sin restricción de movimiento en las extremidades superiores',
      'Excluidos deportistas de nivel de élite',
      'Excluidos IMC ≥ 35 y diagnóstico de enfermedad sistémica mayor',
    ],
    limitaciones: [
      'Colectivo universitario de dos ciudades, no población general',
      'Voluntarios captados por anuncio',
      'Datos de 2012-2014',
    ],
    advertencias: [
      'No representa a la población adulta colombiana, sino a estudiantes universitarios voluntarios de Bogotá y Cali',
    ],
  },
  {
    fichaId: 'HGS-CO-UNI-TN2',
    fichero: 'HGS-CO-UNI-TN2-media-dispersion.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual, absoluta',
    pais: 'CO',
    paisCN04: 'Estudiantes universitarios',
    instrumento: 'takei-t18-tkk-smedley-iii',
    instrumentoCN07: 'T-18 TKK SMEDLY III',
    definicionOperacional: 'media_ambas_manos',
    definicionCN02: 'Media de los máximos de ambas manos',
    posicion: 'bipedestacion',
    posicionCN08: 'De pie',
    lado: 'ambas',
    unidad: 'kg',
    unidadCN06: 'Kilogramos',
    tipo: 'TN-2',
    calidad: 'moderada',
    dimensionesDegradantes: ['D-01', 'D-04'],
    publicaNPorCelda: true,
    valoresProyectados: false,
    estatura: null,
    conflicto: 'ninguno',
    restricciones: [
      'Sin restricción de movimiento en las extremidades superiores',
      'Excluidos deportistas de nivel de élite',
      'Excluidos IMC ≥ 35 y diagnóstico de enfermedad sistémica mayor',
    ],
    limitaciones: [
      'Colectivo universitario de dos ciudades, no población general',
      'Voluntarios captados por anuncio',
      'Datos de 2012-2014',
    ],
    advertencias: [
      'La fuente declara que la distribución NO es normal: derivar percentiles de esta media y esta desviación típica está descartado por evidencia expresa',
    ],
  },

  // ── Colombia · Cúcuta ────────────────────────────────────────────────────
  {
    fichaId: 'HGS-CO-CUC-TN1-D',
    fichero: 'HGS-CO-CUC-TN1-mano-dominante.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual de la **mano dominante**, absoluta',
    pais: 'CO',
    paisCN04: 'ciudad de San José de Cúcuta',
    instrumento: 'camry-digital',
    instrumentoCN07: 'Dinamómetro digital Camry',
    definicionOperacional: 'mejor_mano_dominante',
    definicionCN02: 'Valor más alto de la mano dominante',
    posicion: 'bipedestacion',
    posicionCN08: 'De pie, en posición firme',
    lado: 'dominante',
    unidad: 'kg',
    unidadCN06: 'Kilogramos',
    tipo: 'TN-1',
    calidad: 'baja',
    dimensionesDegradantes: ['D-01', 'D-02'],
    publicaNPorCelda: true,
    valoresProyectados: false,
    estatura: null,
    conflicto: 'ninguno',
    restricciones: [
      'Vivir en la ciudad de San José de Cúcuta',
      'No presentar dolor reciente en manos o brazos',
      'Excluidos quienes entrenaron fuerza en los últimos tres meses',
      'Excluidos trabajos con uso continuo de las extremidades superiores',
      'Excluidas las personas ambidiestras',
    ],
    limitaciones: [
      'Muestreo no probabilístico de tipo intencional',
      'Una sola ciudad',
      'Seis de las doce celdas por debajo de 25 personas',
      'Datos de 2016',
    ],
    advertencias: [
      'La propia fuente declara que sus datos no se pueden generalizar a toda la población de Cúcuta',
      'Las categorías de deficiente a excelente que publica la fuente NO forman parte de la NKB (RN-04)',
    ],
  },
  {
    fichaId: 'HGS-CO-CUC-TN1-ND',
    fichero: 'HGS-CO-CUC-TN1-mano-no-dominante.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual de la **mano no dominante**, absoluta',
    pais: 'CO',
    paisCN04: 'ciudad de San José de Cúcuta',
    instrumento: 'camry-digital',
    instrumentoCN07: 'Dinamómetro digital Camry',
    definicionOperacional: 'mejor_mano_no_dominante',
    definicionCN02: 'Valor más alto de la mano no dominante',
    posicion: 'bipedestacion',
    posicionCN08: 'De pie, en posición firme',
    lado: 'no_dominante',
    unidad: 'kg',
    unidadCN06: 'Kilogramos',
    tipo: 'TN-1',
    calidad: 'baja',
    dimensionesDegradantes: ['D-01', 'D-02'],
    publicaNPorCelda: true,
    valoresProyectados: false,
    estatura: null,
    conflicto: 'ninguno',
    restricciones: [
      'Vivir en la ciudad de San José de Cúcuta',
      'No presentar dolor reciente en manos o brazos',
      'Excluidos quienes entrenaron fuerza en los últimos tres meses',
      'Excluidas las personas ambidiestras',
    ],
    limitaciones: [
      'Muestreo no probabilístico de tipo intencional',
      'Una sola ciudad',
      'Datos de 2016',
    ],
    advertencias: [
      'La propia fuente declara que sus datos no se pueden generalizar a toda la población de Cúcuta',
      'La dominancia se preguntó, no se midió: no equivale a la lateralidad anatómica',
    ],
  },

  // ── Chile · Región del Maule ─────────────────────────────────────────────
  {
    fichaId: 'HGS-CL-TN1-D',
    fichero: 'HGS-CL-TN1-percentiles-mano-derecha.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual de la **mano derecha**, absoluta',
    pais: 'CL',
    paisCN04: 'Región del Maule, Chile',
    instrumento: 'jamar-pc-5030-j1',
    instrumentoCN07: 'JAMAR',
    definicionOperacional: 'mejor_mano_derecha',
    definicionCN02: 'Mejor de dos intentos con la mano derecha',
    posicion: 'sedestacion',
    posicionCN08: 'Sedestación en silla estándar de respaldo recto',
    lado: 'derecha',
    unidad: 'lbf',
    unidadCN06: 'Libras-fuerza (lbf)',
    tipo: 'TN-1',
    calidad: 'moderada',
    dimensionesDegradantes: ['D-01', 'D-04'],
    publicaNPorCelda: true,
    valoresProyectados: true,
    estatura: null,
    conflicto: 'ninguno',
    restricciones: [
      'Escolares matriculados en 12 establecimientos públicos de la Región del Maule',
      'Excluidos fumadores y quienes no obtuvieron consentimiento parental',
    ],
    limitaciones: [
      'Solo sector público',
      'Una región, no el país',
      'Datos de 2015',
      'Unidad en libras-fuerza',
    ],
    advertencias: [
      'No representa a Chile, sino a escolares de escuela pública de una región',
      'Los parámetros L, M y S publicados no autorizan a calcular percentiles que la fuente no tabula',
    ],
  },
  {
    fichaId: 'HGS-CL-TN1-I',
    fichero: 'HGS-CL-TN1-percentiles-mano-izquierda.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual de la **mano izquierda**, absoluta',
    pais: 'CL',
    paisCN04: 'Región del Maule, Chile',
    instrumento: 'jamar-pc-5030-j1',
    instrumentoCN07: 'JAMAR',
    definicionOperacional: 'mejor_mano_izquierda',
    definicionCN02: 'Mejor de dos intentos con la mano izquierda',
    posicion: 'sedestacion',
    posicionCN08: 'Sedestación en silla estándar de respaldo recto',
    lado: 'izquierda',
    unidad: 'lbf',
    unidadCN06: 'Libras-fuerza (lbf)',
    tipo: 'TN-1',
    calidad: 'moderada',
    dimensionesDegradantes: ['D-01', 'D-04'],
    publicaNPorCelda: true,
    valoresProyectados: true,
    estatura: null,
    conflicto: 'ninguno',
    restricciones: [
      'Escolares matriculados en 12 establecimientos públicos de la Región del Maule',
      'Excluidos fumadores y quienes no obtuvieron consentimiento parental',
    ],
    limitaciones: [
      'Solo sector público',
      'Una región, no el país',
      'Datos de 2015',
      'No se declara la lateralidad dominante de los sujetos',
    ],
    advertencias: [
      'No son «la mano no dominante»: la fuente no informa de la lateralidad de los sujetos',
      'No representa a Chile, sino a escolares de escuela pública de una región',
    ],
  },

  // ── Alemania ─────────────────────────────────────────────────────────────
  {
    fichaId: 'HGS-DE-TN2',
    fichero: 'HGS-DE-TN2-media-dispersion.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual',
    pais: 'DE',
    paisCN04: 'Alemania',
    instrumento: 'smedley-s',
    instrumentoCN07: 'Smedley S',
    definicionOperacional: 'maximo_ambas_manos',
    definicionCN02: 'Valor máximo alcanzado con cualquiera de las dos manos',
    // La ficha describe el protocolo como «dos mediciones por mano» y no dice
    // si el sujeto está de pie o sentado. CN-33 lo admite: protocolo incompleto.
    posicion: null,
    posicionCN08: null,
    lado: 'ambas',
    unidad: 'kg',
    unidadCN06: 'Kilogramos',
    tipo: 'TN-2',
    calidad: 'moderada',
    dimensionesDegradantes: ['D-03', 'D-05'],
    publicaNPorCelda: true,
    valoresProyectados: false,
    estatura: null,
    conflicto: 'ninguno',
    restricciones: [
      'Panel de hogares alemán',
      'Excluido el 5% con peor puntuación en salud física autopercibida',
    ],
    limitaciones: [
      'Protocolo descrito de forma incompleta',
      'La forma de la distribución no consta',
      'Valores no estandarizados por altura',
    ],
    advertencias: [
      'No autoriza derivar percentiles: la forma de la distribución no consta',
      'No describe a la población alemana completa',
    ],
  },
  {
    fichaId: 'HGS-DE-TN1',
    fichero: 'HGS-DE-TN1-mediana.md',
    variable: V,
    variableCN01: 'Fuerza máxima de prensión manual',
    pais: 'DE',
    paisCN04: 'Alemania',
    instrumento: 'smedley-s',
    instrumentoCN07: 'Smedley S',
    definicionOperacional: 'maximo_ambas_manos',
    definicionCN02: 'Máximo de dos intentos por mano, tomando el mayor de ambas manos',
    // La ficha describe el protocolo como «dos mediciones por mano» y no dice
    // si el sujeto está de pie o sentado. CN-33 lo admite: protocolo incompleto.
    posicion: null,
    posicionCN08: null,
    lado: 'ambas',
    unidad: 'kg',
    unidadCN06: 'Kilogramos',
    tipo: 'TN-1',
    calidad: 'moderada',
    dimensionesDegradantes: ['D-03', 'D-05'],
    publicaNPorCelda: true,
    valoresProyectados: false,
    estatura: null,
    conflicto: 'ninguno',
    restricciones: [
      'Panel de hogares alemán',
      'Excluido el 5% con peor puntuación en salud física autopercibida',
    ],
    limitaciones: ['Un único percentil', 'Protocolo incompleto', 'Población acotada'],
    advertencias: [
      'Publica un único percentil, el P50: no permite situar un valor en ningún otro punto de la distribución',
      'Por encima de la mediana no es bueno, suficiente ni esperable',
    ],
  },

  // ── Brasil · seis estratos sexo × estatura ───────────────────────────────
  brasil('HGS-BR-TN1', 'HGS-BR-TN1-percentiles.md', { minExclusivo: 1.7, maxInclusivo: null }),
  brasil('HGS-BR-TN1-M167', 'HGS-BR-TN1-varones-160-170.md', { minExclusivo: 1.6, maxInclusivo: 1.7 }, [
    'Cinco de sus normas están en ES-2: el P50 publicado para 86–90 años supera al P75 de su propia fila',
  ]),
  brasil('HGS-BR-TN1-M16', 'HGS-BR-TN1-varones-hasta-160.md', { minExclusivo: null, maxInclusivo: 1.6 }),
  brasil('HGS-BR-TN1-F16', 'HGS-BR-TN1-mujeres-sobre-160.md', { minExclusivo: 1.6, maxInclusivo: null }),
  brasil('HGS-BR-TN1-F156', 'HGS-BR-TN1-mujeres-150-160.md', { minExclusivo: 1.5, maxInclusivo: 1.6 }),
  brasil('HGS-BR-TN1-F15', 'HGS-BR-TN1-mujeres-hasta-150.md', { minExclusivo: null, maxInclusivo: 1.5 }),
];

export function coordenadasDe(fichaId: string): CoordenadasFicha | undefined {
  return COORDENADAS.find((c) => c.fichaId === fichaId);
}
