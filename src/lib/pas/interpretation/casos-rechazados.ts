// ── Casos rechazados (Sprint PAS-4.0) ──────────────────────────────────────
// Lo que el PIE JAMÁS producirá, con el motivo. Se declaran en el código —y
// no solo en la documentación— para que una prueba pueda comprobar que
// ninguno aparece en la salida.
//
// Un catálogo de prohibiciones que solo vive en un README no impide nada.

export interface CasoRechazado {
  id: string;
  /** El texto que no se emitirá, tal como se formularía. */
  ejemplo: string;
  motivo: string;
  /** Límite del PAS o módulo de la PKB que lo prohíbe. */
  fundamento: string;
}

export const CASOS_RECHAZADOS: readonly CasoRechazado[] = [
  {
    id: 'CR-01',
    ejemplo: 'Debe entrenar fuerza.',
    motivo: 'Decide contenido de entrenamiento.',
    fundamento: 'PAS L-01 e I-12: el sistema no decide qué hacer.',
  },
  {
    id: 'CR-02',
    ejemplo: 'Debe hacer pliometría.',
    motivo: 'Prescribe un método concreto.',
    fundamento: 'PAS L-01. Corresponde al Workout Engine.',
  },
  {
    id: 'CR-03',
    ejemplo: 'Tiene alto riesgo.',
    motivo: 'Clasificación de riesgo, clínica y predictiva.',
    fundamento: 'PAS L-03 y L-05. PKB §08, grupo 1.',
  },
  {
    id: 'CR-04',
    ejemplo: 'Está lesionado.',
    motivo: 'Afirmación clínica sobre el estado de salud.',
    fundamento: 'PAS L-03. Fuera del ecosistema.',
  },
  {
    id: 'CR-05',
    ejemplo: 'Su rendimiento será superior al promedio.',
    motivo: 'Proyección de un desenlace futuro.',
    fundamento: 'PAS L-05 e I-13: el sistema no proyecta.',
  },
  {
    id: 'CR-06',
    ejemplo: 'Necesita fisioterapia.',
    motivo: 'Derivación asistencial.',
    fundamento: 'PAS L-03. Ninguna fuente de la base lo respalda.',
  },
  {
    id: 'CR-07',
    ejemplo: 'Debe reevaluarse en ocho semanas.',
    motivo: 'Fija una periodicidad.',
    fundamento: 'PAS §07: ninguna fuente del ecosistema documenta periodicidad.',
  },
  {
    id: 'CR-08',
    ejemplo: 'Esta prueba demuestra que la capacidad está desarrollada.',
    motivo: 'Convierte una medida en demostración de una dimensión.',
    fundamento: 'PKB §05: validez de constructo no verificada en ninguna prueba.',
  },
  {
    id: 'CR-09',
    ejemplo: 'La prueba confirma el nivel del atleta.',
    motivo: 'Una prueba no confirma; aporta una observación.',
    fundamento: 'PKB §07, limitación L-A: la prueba es una muestra.',
  },
  {
    id: 'CR-10',
    ejemplo: 'Su deporte ideal es el atletismo.',
    motivo: 'Decide una orientación deportiva.',
    fundamento: 'PKB §08, grupo 4. Exigiría un modelo de demandas por deporte.',
  },
  {
    id: 'CR-11',
    ejemplo: 'Su posición ideal es la de extremo.',
    motivo: 'Igual que el anterior, con granularidad táctica.',
    fundamento: 'PKB §08, grupo 4.',
  },
  {
    id: 'CR-12',
    ejemplo: 'No podrá alcanzar ese registro.',
    motivo: 'Predicción negativa sobre un desenlace futuro.',
    fundamento: 'PAS L-05 e I-13.',
  },
  {
    id: 'CR-13',
    ejemplo: 'Ha experimentado una progresión respecto a la evaluación anterior.',
    motivo: 'Afirma un cambio sin cambio mínimo detectable.',
    fundamento: 'PKB §06 y §08, grupo 5: ninguna fuente aporta MDC ni SEM.',
  },
  {
    id: 'CR-14',
    ejemplo: 'Presenta un desequilibrio entre ambos lados.',
    motivo: 'Presupone un valor de referencia correcto.',
    fundamento: 'PKB §08, grupo 4. PAS: término prohibido.',
  },
  {
    id: 'CR-15',
    ejemplo: 'Su fuerza está por debajo de lo esperado para su edad.',
    motivo: 'Comparación normativa y juicio de valor.',
    fundamento: 'PAS L-04 e I-13: el sistema no compara atletas entre sí.',
  },
];

export const TOTAL_CASOS_RECHAZADOS = CASOS_RECHAZADOS.length;
