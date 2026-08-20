// ── Registro de evidencia del PAS (Sprint PAS-10E §22) ─────────────────────
//
// DECLARATIVO Y CERRADO. Todo lo que este sistema puede afirmar sobre una
// prueba sale de aquí. No hay valores científicos en componentes, ni en tests,
// ni en constantes sueltas, ni en prompts: la interfaz consume, no declara.
//
// TRES REGLAS QUE GOBIERNAN EL FICHERO:
//
//   1 · Lo que ya está en la PKB se referencia por clave y NO se copia. Dos
//       copias de una cita acaban divergiendo, y entonces hay que averiguar
//       cuál era la buena.
//
//   2 · Una fuente `sin_verificar` NUNCA sostiene una comparación. Se registra
//       para poder decir «existe literatura, no la hemos comprobado», que es
//       información distinta de «no existe» y de «existe y sirve».
//
//   3 · Ningún valor de aquí se ha calculado, redondeado ni convertido. Si una
//       fuente publica el percentil 90 y no el 75, aquí hay un solo punto.
//
// Procedencia de las cifras: auditoría PAS-11, fases 1 a 4. Las tres fuentes
// nuevas se recuperaron y leyeron; las marcadas `sin_verificar` aparecieron en
// búsqueda y no se han abierto.

import type { FuenteEvidencia, ReferenciaEvidencia } from './tipos';

// ════════════════════════════════════════════════════════════════════════════
// FUENTES
// ════════════════════════════════════════════════════════════════════════════

export const FUENTES: readonly FuenteEvidencia[] = [
  // ── Ya admitidas en la PKB: aquí solo se apuntan ─────────────────────────
  {
    id: 'grgic_1rm_2020',
    estado: 'admitida',
    claveExterna: 'grgic_1rm_2020',
    cita: null,
    poblacion: '32 estudios, 1595 participantes; ambos sexos, con y sin experiencia previa',
    sostiene: 'Que la medición de 1RM se repite de forma consistente entre sesiones.',
    noSostiene:
      'No publica cambio mínimo detectable. Un CV no es un MDC, y una fiabilidad alta no dice ' +
      'que un cambio observado sea real.',
  },
  {
    id: 'grgic_imtp_2022',
    estado: 'admitida',
    claveExterna: 'grgic_imtp_2022',
    cita: null,
    poblacion: '16 estudios de calidad buena a excelente; atletas y jóvenes',
    sostiene: 'Que el pico de fuerza isométrica se repite de forma consistente, bilateral y unilateral.',
    noSostiene: 'No publica MDC ni valores normativos de ninguna población.',
  },
  {
    id: 'rsi_metaanalisis_2021',
    estado: 'admitida',
    claveExterna: 'rsi_metaanalisis_2021',
    cita: null,
    poblacion: 'Individuos sanos a lo largo del ciclo vital',
    sostiene:
      'Que el RSI se repite bien cuando hay familiarización previa, y que se asocia con medidas ' +
      'de rendimiento.',
    noSostiene:
      'Una asociación no permite clasificar a nadie. La propia fuente desaconseja informar el ' +
      'índice sin la altura de salto y el tiempo de contacto que lo componen.',
  },
  {
    id: 'plisky_ybt_2021',
    estado: 'admitida',
    claveExterna: 'plisky_ybt_2021',
    cita: null,
    poblacion: 'Adultos sanos y deportistas de varias modalidades',
    sostiene: 'Fiabilidad intraevaluador alta y validez discriminante entre grupos.',
    noSostiene:
      'La validez predictiva de lesión es limitada y la fuente desaconseja expresamente los ' +
      'puntos de corte generales.',
  },
  {
    id: 'mayorga_sit_reach_2014',
    estado: 'admitida',
    claveExterna: 'mayorga_sit_reach_2014',
    cita: null,
    poblacion: 'Adultos jóvenes recreacionales y adultos mayores',
    sostiene: 'Validez de criterio moderada para extensibilidad isquiosural.',
    noSostiene:
      'Validez baja para extensibilidad lumbar. No publica valores normativos de ninguna clase.',
  },
  {
    id: 'mayorga_20msr_2015',
    estado: 'admitida',
    claveExterna: 'mayorga_20msr_2015',
    cita: null,
    poblacion: 'Niños, adolescentes y adultos, según protocolo',
    sostiene: 'Validez de criterio moderada a alta del test frente a VO₂máx medido.',
    noSostiene:
      'La validez depende del protocolo y de la ecuación. El VO₂máx resultante es una ESTIMACIÓN, ' +
      'nunca una medición.',
  },
  {
    id: 'moran_fms_2017',
    estado: 'admitida',
    claveExterna: 'moran_fms_2017',
    cita: null,
    poblacion: 'Revisión sistemática con meta-análisis sobre poblaciones deportivas',
    sostiene:
      'Que la asociación entre la puntuación compuesta del FMS y la lesión posterior NO respalda ' +
      'su uso como herramienta de predicción.',
    noSostiene:
      'No respalda ningún punto de corte. El umbral de 14 no puede usarse para predecir lesión.',
  },

  // ── Nuevas, recuperadas y leídas en la fase 2 de PAS-11 ──────────────────
  {
    id: 'ramirez_velez_fuprecol_2017',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores:
        'Ramírez-Vélez R, Palacios-López A, Prieto-Benavides DH, Correa-Bautista JE, ' +
        'Izquierdo M, Alonso-Martínez A, Lobelo F',
      anio: 2017,
      titulo:
        'Normative reference values for the 20 m shuttle-run test in a population-based sample ' +
        'of school-aged youth in Bogota, Colombia: the FUPRECOL study',
      publicacion: 'American Journal of Human Biology 29(1):e22902',
      localizador: 'doi:10.1002/ajhb.22902 · PMID 27500986',
    },
    poblacion: '7244 escolares de Bogotá (55,7 % niñas), 9 a 17,9 años, colegios públicos',
    sostiene:
      'Situar a un escolar de Bogotá de 9 a 17,9 años respecto a los percentiles publicados de ' +
      'estadios completados.',
    noSostiene:
      'No representa a la población adulta, ni a otras ciudades, ni a colegios privados. El ' +
      'VO₂pico es estimado con la ecuación de Léger (1988) y puede infraestimar hasta un 12 %.',
  },
  {
    id: 'bagchi_cmj_2024',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Bagchi A, Raizada S, Thapa RK, Stefanica V, Ceylan HI',
      anio: 2024,
      titulo:
        'Reliability and Accuracy of Portable Devices for Measuring Countermovement Jump Height ' +
        'in Physically Active Adults',
      publicacion: 'Life (Basel) 14(11):1394',
      localizador: 'doi:10.3390/life14111394',
    },
    poblacion: '22 deportistas universitarios (16 varones, 6 mujeres), 19,7 ± 1,2 años',
    sostiene:
      'Que la altura de CMJ se repite de forma consistente en plataforma de fuerza, alfombra de ' +
      'contacto y análisis de vídeo.',
    noSostiene:
      'NO publica SEM ni MDC. La muestra es pequeña y heterogénea en modalidad deportiva. No ' +
      'contiene ningún valor normativo.',
  },
  {
    id: 'van_den_hoek_powerlifting_2024',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores:
        'van den Hoek DJ, Beaumont PL, van den Hoek AK, Owen PJ, Garrett JM, Buhmann R, Latella C',
      anio: 2024,
      titulo:
        'Normative data for the squat, bench press and deadlift exercises in powerlifting: Data ' +
        'from 809,986 competition entries',
      publicacion: 'Journal of Science and Medicine in Sport 27(10):734-742',
      localizador: 'doi:10.1016/j.jsams.2024.07.005',
    },
    poblacion:
      '809 986 inscripciones en competición de powerlifting sin equipamiento y con control ' +
      'antidopaje; 571 650 varones y 238 336 mujeres',
    sostiene:
      'Situar a un competidor de powerlifting respecto a otros competidores, en fuerza relativa ' +
      'a la masa corporal.',
    noSostiene:
      'NO es una norma poblacional: la muestra son competidores federados. Un percentil aquí no ' +
      'dice dónde cae alguien en la población general.',
  },

  {
    id: 'hoffmann_chms_2019',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores:
        'Hoffmann MD, Colley RC, Doyon CY, Wong SL, Tomkinson GR, Lang JJ',
      anio: 2019,
      titulo: 'Normative-referenced percentile values for physical fitness among Canadians',
      publicacion: 'Health Reports 30(10), Statistics Canada, Catalogue 82-003-X',
      localizador: 'doi:10.25318/82-003-x201901000002-eng · PMID 31617933',
    },
    poblacion:
      '5188 canadienses (50,1 % mujeres) de 6 a 69 años, muestra nacionalmente representativa; ' +
      'Canadian Health Measures Survey, ciclo 5 (2016-2017)',
    sostiene:
      'Situar a un adulto canadiense de población general respecto a los percentiles publicados ' +
      'de altura de salto y de alcance en sit-and-reach, por edad y sexo.',
    noSostiene:
      'No representa a ninguna población fuera de Canadá. Los propios autores advierten que una ' +
      'norma no equivale a un punto de corte de salud: rendir por encima de un percentil no ' +
      'implica un nivel saludable.',
  },

  {
    id: 'triplett_fms_2021',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Triplett CR, Dorrel BS, Symonds ML, Selland CA, Jensen DD, Poole CN',
      anio: 2021,
      titulo:
        'Functional Movement Screen Detected Asymmetry & Normative Values Among College-Aged ' +
        'Students',
      publicacion: 'International Journal of Sports Physical Therapy 16(2):450-458',
      localizador: 'doi:10.26603/001c.19443 · PMID 33842040',
    },
    poblacion: '100 universitarios estadounidenses (57 mujeres, 43 varones), 18 a 26 años',
    sostiene:
      'Que la puntuación compuesta media de una muestra universitaria fue 14,40, con valores ' +
      'observados entre 7 y 19.',
    noSostiene:
      'NO permite situar a nadie: publica media, moda y recorrido observado, pero ninguna ' +
      'distribución ni percentiles. Un recorrido muestral no es un rango de referencia, y usarlo ' +
      'como escala convertiría el mínimo y el máximo de 100 personas en los extremos de una norma.',
  },
  {
    id: 'alkhathami_fms_2021',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Alkhathami K, Alshehre Y, Wang-Price S, Brizzolara K',
      anio: 2021,
      titulo:
        'Reliability and Validity of the Functional Movement Screen with a Modified Scoring ' +
        'System for Young Adults with Low Back Pain',
      publicacion: 'International Journal of Sports Physical Therapy 16(3):620-627',
      localizador: 'doi:10.26603/001c.23427 · PMID 35655963',
    },
    poblacion:
      '44 adultos jóvenes (22 con dolor lumbar recurrente, 22 asintomáticos), edad media 26,7 años',
    sostiene:
      'Que el FMS puntuado con un SISTEMA MODIFICADO se repite de forma muy consistente: ICC 0,99 ' +
      'entre evaluadores en tiempo real, SEM 0,38 puntos y MDC95 de 1,05 puntos.',
    noSostiene:
      'Sus cifras corresponden a un sistema de puntuación MODIFICADO, no al FMS estándar de 0 a ' +
      '21. Trasladar ese MDC a una puntuación estándar sería aplicar el error de una prueba a ' +
      'otra distinta. Tampoco publica valores normativos.',
  },

  {
    id: 'rouis_etnia_salto_2016',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Rouis M, Coudrat L, Jaafar H, Attiogbé E, Vandewalle H, Driss T',
      anio: 2016,
      titulo:
        'Effects of ethnicity on the relationship between vertical jump and maximal power on a ' +
        'cycle ergometer',
      publicacion: 'Journal of Human Kinetics 51:209-216',
      localizador: 'doi:10.1515/hukin-2015-0184 · PMID 28149384',
    },
    poblacion: '31 varones sanos: 15 afrocaribeños (24,4 ± 2,6 años) y 16 caucásicos (26,3 ± 3,5)',
    // Esta fuente NO sirve para situar a nadie. Sirve para justificar una REGLA
    // DE COMPATIBILIDAD, que es un uso distinto y merece decirse así.
    sostiene:
      'Que la altura de salto con contramovimiento difiere de forma acusada entre grupos de ' +
      'ascendencia distinta: 62,9 ± 6,7 cm frente a 52,9 ± 4,4 cm, p < 0,001, con brazos libres. ' +
      'Es la evidencia que sostiene mantener el país como condición de compatibilidad en P-04.',
    noSostiene:
      'NO es una norma ni un benchmark: 31 varones no describen ninguna población. Tampoco ' +
      'autoriza a clasificar a nadie por su ascendencia, ni a corregir un resultado por ella. ' +
      'Solo demuestra que la composición poblacional de la muestra importa.',
  },

  // ── Localizadas y NO recuperadas. No sostienen nada todavía ──────────────
  {
    id: 'tomkinson_20msr_2017',
    estado: 'sin_verificar',
    claveExterna: null,
    cita: {
      autores: 'Tomkinson GR et al.',
      anio: 2017,
      titulo:
        'International normative 20 m shuttle run values from 1 142 026 children and youth ' +
        'representing 50 countries',
      publicacion: 'British Journal of Sports Medicine 51(21):1545-1554',
      localizador: 'PMID 27208067',
    },
    poblacion: 'Niños y adolescentes de 9 a 17 años, 50 países',
    sostiene: 'Nada todavía: la publicación no se ha recuperado.',
    noSostiene: 'Nada puede afirmarse a partir de una fuente sin verificar en origen.',
  },
  {
    id: 'comfort_imtp_2019',
    estado: 'sin_verificar',
    claveExterna: null,
    cita: {
      autores: "Comfort P, Dos'Santos T, Beckham GK, Stone MH, Guppy SN, Haff GG",
      anio: 2019,
      titulo: 'Standardization and methodological considerations for the isometric midthigh pull',
      publicacion: 'Strength and Conditioning Journal 41(2):57-79',
      localizador: 'sin DOI verificado',
    },
    poblacion: 'Revisión metodológica; no aporta muestra propia',
    sostiene: 'Nada todavía: la publicación no se ha recuperado.',
    noSostiene: 'Nada puede afirmarse a partir de una fuente sin verificar en origen.',
  },
  {
    id: 'chimera_ybt_2015',
    estado: 'sin_verificar',
    claveExterna: null,
    cita: {
      autores: 'Chimera NJ et al.',
      anio: 2015,
      titulo: 'MDC de la puntuación compuesta del Y-Balance normalizada',
      publicacion: 'Citado por una base de datos de instrumentos, no por el artículo',
      localizador: 'sin localizador verificado',
    },
    poblacion: 'Atletas universitarios de División I',
    sostiene: 'Nada todavía: la cifra procede de una base secundaria, no del artículo.',
    noSostiene: 'Nada puede afirmarse a partir de una fuente sin verificar en origen.',
  },
  {
    id: 'cod_505_fiabilidad',
    estado: 'sin_verificar',
    claveExterna: null,
    cita: {
      autores: 'Sin verificar',
      anio: 2018,
      titulo: 'Fiabilidad del 505 modificado y del déficit de cambio de dirección',
      publicacion: 'Science and Medicine in Football',
      localizador: 'sin localizador verificado',
    },
    poblacion: '110 futbolistas de academia, sub-12 a sub-18',
    sostiene: 'Nada todavía: la publicación no se ha recuperado.',
    noSostiene: 'Nada puede afirmarse a partir de una fuente sin verificar en origen.',
  },
  {
    id: 'fms_fiabilidad_interevaluador',
    estado: 'sin_verificar',
    claveExterna: null,
    cita: {
      autores: 'Varios estudios',
      anio: 2013,
      titulo: 'Fiabilidad interevaluador de la puntuación compuesta del FMS',
      publicacion: 'Varias revistas',
      localizador: 'sin localizador verificado',
    },
    poblacion: 'Evaluadores de formación variable',
    sostiene: 'Nada todavía: ninguna de las publicaciones se ha recuperado.',
    noSostiene: 'Nada puede afirmarse a partir de una fuente sin verificar en origen.',
  },
  {
    id: 'sprint_referencia_futbol',
    estado: 'sin_verificar',
    claveExterna: null,
    cita: {
      autores: 'Sin verificar',
      anio: 2016,
      titulo: 'Reference values for sprint performance in male soccer players aged 9-35 years',
      publicacion: 'Sin verificar',
      localizador: 'sin localizador verificado',
    },
    poblacion: '474 futbolistas varones de 9 a 35 años',
    sostiene: 'Nada todavía: la publicación no se ha recuperado.',
    noSostiene: 'Nada puede afirmarse a partir de una fuente sin verificar en origen.',
  },
];

export function fuenteDe(id: string): FuenteEvidencia | null {
  return FUENTES.find((f) => f.id === id) ?? null;
}

// ════════════════════════════════════════════════════════════════════════════
// REFERENCIAS
// ════════════════════════════════════════════════════════════════════════════

const SIN_PROTOCOLO: Readonly<Record<string, string>> = {};

export const REFERENCIAS: readonly ReferenciaEvidencia[] = [
  // ── P-01 · 1RM ───────────────────────────────────────────────────────────
  {
    id: 'P-01/powerlifting/p90',
    pruebaId: 'P-01',
    fuenteId: 'van_den_hoek_powerlifting_2024',
    tipo: 'BENCHMARK',
    nivel: 'C',
    ambito: {
      edadMin: 18,
      edadMax: 35,
      sexo: 'M',
      pais: null,
      contexto: 'competicion',
      protocolo: { determinacion: 'medido_directo' },
      unidad: 'ratio_peso',
    },
    // Un único punto porque es el único que se leyó. Rellenar P10..P75 con
    // valores plausibles sería exactamente lo que este registro impide.
    representacion: { clase: 'percentiles', puntos: [{ p: 90, valor: 2.83 }] },
    limitaciones: [
      'La muestra son competidores federados de powerlifting, no población general.',
      'El valor es la razón entre la carga levantada y la masa corporal, no kilos absolutos.',
      'Solo se ha transcrito el percentil 90 de la categoría 18-35 años.',
    ],
    variablesAtleta: ['peso_kg'],
  },
  {
    id: 'P-01/powerlifting/p90-f',
    pruebaId: 'P-01',
    fuenteId: 'van_den_hoek_powerlifting_2024',
    tipo: 'BENCHMARK',
    nivel: 'C',
    ambito: {
      edadMin: 18,
      edadMax: 35,
      sexo: 'F',
      pais: null,
      contexto: 'competicion',
      protocolo: { determinacion: 'medido_directo' },
      unidad: 'ratio_peso',
    },
    representacion: { clase: 'percentiles', puntos: [{ p: 90, valor: 2.26 }] },
    limitaciones: [
      'La muestra son competidoras federadas de powerlifting, no población general.',
      'El valor es la razón entre la carga levantada y la masa corporal, no kilos absolutos.',
      'Solo se ha transcrito el percentil 90 de la categoría 18-35 años.',
    ],
    variablesAtleta: ['peso_kg'],
  },
  {
    id: 'P-01/fiabilidad',
    pruebaId: 'P-01',
    fuenteId: 'grgic_1rm_2020',
    tipo: 'FIABILIDAD',
    nivel: 'D',
    ambito: {
      edadMin: null, edadMax: null, sexo: null, pais: null,
      contexto: 'general', protocolo: SIN_PROTOCOLO, unidad: 'kg',
    },
    representacion: { clase: 'fiabilidad', icc: [0.64, 0.99], cvPct: 4.2 },
    limitaciones: [
      'El CV es la mediana de 32 estudios con protocolos distintos.',
      'La fuente no publica cambio mínimo detectable.',
    ],
    variablesAtleta: [],
  },

  // ── P-02 · IMTP ──────────────────────────────────────────────────────────
  {
    id: 'P-02/fiabilidad',
    pruebaId: 'P-02',
    fuenteId: 'grgic_imtp_2022',
    tipo: 'FIABILIDAD',
    nivel: 'D',
    ambito: {
      edadMin: null, edadMax: null, sexo: null, pais: null,
      contexto: 'deportiva', protocolo: SIN_PROTOCOLO, unidad: 'N',
    },
    representacion: { clase: 'fiabilidad', icc: [0.73, 0.99], cvPct: 4.9 },
    limitaciones: [
      'La población estudiada son atletas y jóvenes; no cubre adultos mayores ni sedentarios.',
      'La fuente no publica cambio mínimo detectable.',
    ],
    variablesAtleta: [],
  },

  // ── P-04 · CMJ ───────────────────────────────────────────────────────────
  {
    id: 'P-04/fiabilidad',
    pruebaId: 'P-04',
    fuenteId: 'bagchi_cmj_2024',
    tipo: 'FIABILIDAD',
    nivel: 'D',
    ambito: {
      edadMin: 18, edadMax: 25, sexo: null, pais: null,
      contexto: 'deportiva', protocolo: SIN_PROTOCOLO, unidad: 'cm',
    },
    representacion: { clase: 'fiabilidad', icc: [0.981, 0.987], cvPct: 6.1 },
    limitaciones: [
      'Muestra de 22 deportistas universitarios de modalidades heterogéneas.',
      'La fuente NO publica SEM ni MDC, así que no autoriza a decir si un cambio es real.',
      'Los saltos se realizaron a intensidad moderada-alta, no máxima.',
    ],
    variablesAtleta: [],
  },

  {
    id: 'P-04/chms/m-20-24',
    pruebaId: 'P-04',
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 20,
      edadMax: 24,
      sexo: 'M',
      pais: 'CA',
      contexto: 'general',
      // G-06 RESUELTO (PAS-11.2): el país SE MANTIENE como condición para el
      // salto. `rouis_etnia_salto_2016` documenta ~10 cm de diferencia entre
      // grupos de ascendencia distinta con brazos libres —el mismo protocolo
      // que usa esta fuente—, y 10 cm cruzan cuatro bandas de percentil de esta
      // misma tabla. La composición de una muestra nacional canadiense no es la
      // de una colombiana, así que trasladarla sería una suposición con
      // evidencia en contra.
      protocolo: { brazos: 'libres' },
      unidad: 'cm',
    },
    representacion: {
      clase: 'percentiles',
      puntos: [{ p: 5, valor: 32.6 }, { p: 10, valor: 36.6 }, { p: 20, valor: 41.2 }, { p: 30, valor: 44.3 }, { p: 40, valor: 47 }, { p: 50, valor: 49.4 }, { p: 60, valor: 51.7 }, { p: 70, valor: 54.1 }, { p: 80, valor: 56.9 }, { p: 90, valor: 60.7 }, { p: 95, valor: 63.8 }],
    },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Plataforma Leonardo Mechanograph; salto bilateral con contramovimiento y BRAZOS LIBRES.',
      'Se tomó el mejor de tres intentos válidos.',
      'Solo se han transcrito las bandas de 20 a 29 años; la fuente publica de 8 a 69.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },
  {
    id: 'P-04/chms/m-25-29',
    pruebaId: 'P-04',
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 25,
      edadMax: 29,
      sexo: 'M',
      pais: 'CA',
      contexto: 'general',
      protocolo: { brazos: 'libres' },
      unidad: 'cm',
    },
    representacion: {
      clase: 'percentiles',
      puntos: [{ p: 5, valor: 31.5 }, { p: 10, valor: 35.5 }, { p: 20, valor: 40 }, { p: 30, valor: 43.1 }, { p: 40, valor: 45.7 }, { p: 50, valor: 48 }, { p: 60, valor: 50.3 }, { p: 70, valor: 52.6 }, { p: 80, valor: 55.3 }, { p: 90, valor: 59 }, { p: 95, valor: 61.9 }],
    },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Plataforma Leonardo Mechanograph; salto bilateral con contramovimiento y BRAZOS LIBRES.',
      'Se tomó el mejor de tres intentos válidos.',
      'Solo se han transcrito las bandas de 20 a 29 años; la fuente publica de 8 a 69.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },
  {
    id: 'P-04/chms/f-20-24',
    pruebaId: 'P-04',
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 20,
      edadMax: 24,
      sexo: 'F',
      pais: 'CA',
      contexto: 'general',
      protocolo: { brazos: 'libres' },
      unidad: 'cm',
    },
    representacion: {
      clase: 'percentiles',
      puntos: [{ p: 5, valor: 22.8 }, { p: 10, valor: 24.7 }, { p: 20, valor: 27.1 }, { p: 30, valor: 28.9 }, { p: 40, valor: 30.4 }, { p: 50, valor: 31.8 }, { p: 60, valor: 33.3 }, { p: 70, valor: 34.8 }, { p: 80, valor: 36.7 }, { p: 90, valor: 39.3 }, { p: 95, valor: 41.4 }],
    },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Plataforma Leonardo Mechanograph; salto bilateral con contramovimiento y BRAZOS LIBRES.',
      'Se tomó el mejor de tres intentos válidos.',
      'Solo se han transcrito las bandas de 20 a 29 años; la fuente publica de 8 a 69.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },
  {
    id: 'P-04/chms/f-25-29',
    pruebaId: 'P-04',
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 25,
      edadMax: 29,
      sexo: 'F',
      pais: 'CA',
      contexto: 'general',
      protocolo: { brazos: 'libres' },
      unidad: 'cm',
    },
    representacion: {
      clase: 'percentiles',
      puntos: [{ p: 5, valor: 22.2 }, { p: 10, valor: 24.1 }, { p: 20, valor: 26.5 }, { p: 30, valor: 28.3 }, { p: 40, valor: 29.9 }, { p: 50, valor: 31.3 }, { p: 60, valor: 32.8 }, { p: 70, valor: 34.3 }, { p: 80, valor: 36.2 }, { p: 90, valor: 38.8 }, { p: 95, valor: 41 }],
    },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Plataforma Leonardo Mechanograph; salto bilateral con contramovimiento y BRAZOS LIBRES.',
      'Se tomó el mejor de tres intentos válidos.',
      'Solo se han transcrito las bandas de 20 a 29 años; la fuente publica de 8 a 69.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },
  {
    id: 'P-06/chms/m-20-24',
    pruebaId: 'P-06',
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 20,
      edadMax: 24,
      sexo: 'M',
      pais: 'CA',
      contexto: 'general',
      // G-06 RESUELTO (PAS-11.2): el país SE MANTIENE también aquí, y por un
      // motivo que la propia PKB ya registraba: el sit-and-reach mide una
      // DISTANCIA ALCANZADA, y quien tiene brazos largos y piernas cortas
      // alcanza más sin ser más extensible. Las proporciones de segmentos
      // varían sistemáticamente entre poblaciones, así que la composición de la
      // muestra confunde la comparación de forma directa.
      protocolo: { version: 'clasico' },
      unidad: 'cm',
    },
    representacion: {
      clase: 'percentiles',
      puntos: [{ p: 5, valor: 8.9 }, { p: 10, valor: 11.7 }, { p: 20, valor: 15.5 }, { p: 30, valor: 18.7 }, { p: 40, valor: 21.7 }, { p: 50, valor: 24.6 }, { p: 60, valor: 27.5 }, { p: 70, valor: 30.4 }, { p: 80, valor: 33.5 }, { p: 90, valor: 37.2 }, { p: 95, valor: 39.9 }],
    },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Flexómetro con el cero calibrado de modo que tocar los dedos equivale a 26 cm: un valor medido con otra calibración no es comparable.',
      'Se tomó el mejor de dos intentos válidos, tras estiramiento previo.',
      'Solo se han transcrito las bandas de 20 a 29 años; la fuente publica de 6 a 69.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },
  {
    id: 'P-06/chms/m-25-29',
    pruebaId: 'P-06',
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 25,
      edadMax: 29,
      sexo: 'M',
      pais: 'CA',
      contexto: 'general',
      protocolo: { version: 'clasico' },
      unidad: 'cm',
    },
    representacion: {
      clase: 'percentiles',
      puntos: [{ p: 5, valor: 8.8 }, { p: 10, valor: 11.6 }, { p: 20, valor: 15.4 }, { p: 30, valor: 18.6 }, { p: 40, valor: 21.6 }, { p: 50, valor: 24.5 }, { p: 60, valor: 27.4 }, { p: 70, valor: 30.3 }, { p: 80, valor: 33.4 }, { p: 90, valor: 37.1 }, { p: 95, valor: 39.7 }],
    },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Flexómetro con el cero calibrado de modo que tocar los dedos equivale a 26 cm: un valor medido con otra calibración no es comparable.',
      'Se tomó el mejor de dos intentos válidos, tras estiramiento previo.',
      'Solo se han transcrito las bandas de 20 a 29 años; la fuente publica de 6 a 69.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },
  {
    id: 'P-06/chms/f-20-24',
    pruebaId: 'P-06',
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 20,
      edadMax: 24,
      sexo: 'F',
      pais: 'CA',
      contexto: 'general',
      protocolo: { version: 'clasico' },
      unidad: 'cm',
    },
    representacion: {
      clase: 'percentiles',
      puntos: [{ p: 5, valor: 14.4 }, { p: 10, valor: 18.3 }, { p: 20, valor: 22.9 }, { p: 30, valor: 26.1 }, { p: 40, valor: 28.7 }, { p: 50, valor: 31.1 }, { p: 60, valor: 33.5 }, { p: 70, valor: 36 }, { p: 80, valor: 38.8 }, { p: 90, valor: 42.6 }, { p: 95, valor: 45.7 }],
    },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Flexómetro con el cero calibrado de modo que tocar los dedos equivale a 26 cm: un valor medido con otra calibración no es comparable.',
      'Se tomó el mejor de dos intentos válidos, tras estiramiento previo.',
      'Solo se han transcrito las bandas de 20 a 29 años; la fuente publica de 6 a 69.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },
  {
    id: 'P-06/chms/f-25-29',
    pruebaId: 'P-06',
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 25,
      edadMax: 29,
      sexo: 'F',
      pais: 'CA',
      contexto: 'general',
      protocolo: { version: 'clasico' },
      unidad: 'cm',
    },
    representacion: {
      clase: 'percentiles',
      puntos: [{ p: 5, valor: 14.1 }, { p: 10, valor: 17.9 }, { p: 20, valor: 22.5 }, { p: 30, valor: 25.8 }, { p: 40, valor: 28.5 }, { p: 50, valor: 31.1 }, { p: 60, valor: 33.7 }, { p: 70, valor: 36.2 }, { p: 80, valor: 39.1 }, { p: 90, valor: 42.9 }, { p: 95, valor: 45.8 }],
    },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Flexómetro con el cero calibrado de modo que tocar los dedos equivale a 26 cm: un valor medido con otra calibración no es comparable.',
      'Se tomó el mejor de dos intentos válidos, tras estiramiento previo.',
      'Solo se han transcrito las bandas de 20 a 29 años; la fuente publica de 6 a 69.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },

  // ── P-05 · RSI ───────────────────────────────────────────────────────────
  {
    id: 'P-05/fiabilidad',
    pruebaId: 'P-05',
    fuenteId: 'rsi_metaanalisis_2021',
    tipo: 'FIABILIDAD',
    nivel: 'D',
    ambito: {
      edadMin: null, edadMax: null, sexo: null, pais: null,
      contexto: 'general', protocolo: { instruccion: 'maxima_altura' }, unidad: 'ratio',
    },
    representacion: { clase: 'fiabilidad', icc: [0.8, 0.99], cvPct: 10 },
    limitaciones: [
      'La fiabilidad publicada exige familiarización previa con la tarea.',
      'El índice oculta sus componentes: la fuente desaconseja informarlo sin la altura de salto ' +
        'y el tiempo de contacto.',
    ],
    variablesAtleta: [],
  },

  // ── P-07 · Course-navette ────────────────────────────────────────────────
  {
    id: 'P-07/fuprecol/escolares-bogota',
    pruebaId: 'P-07',
    fuenteId: 'ramirez_velez_fuprecol_2017',
    tipo: 'NORMATIVA',
    nivel: 'A',
    ambito: {
      edadMin: 9,
      edadMax: 17,
      sexo: null,
      pais: 'CO',
      contexto: 'escolar',
      protocolo: { ecuacion: 'leger_1988' },
      unidad: 'estadios',
    },
    // La fuente publica P3 a P97 por edad y sexo. Todavía no se ha transcrito
    // la tabla, y decirlo es más útil que fingir que no existe.
    representacion: {
      clase: 'valores_sin_transcribir',
      queSePublica:
        'Percentiles 3, 10, 25, 50, 75, 90 y 97 de estadios completados y de VO₂pico estimado, ' +
        'por edad y sexo, con valores ajustados por altitud',
    },
    limitaciones: [
      'Muestra de colegios públicos de una sola ciudad; no representa al conjunto de Colombia.',
      'Bogotá está a 2625 m: los valores sin ajustar por altitud no son trasladables.',
      'El VO₂pico es estimado con la ecuación de Léger (1988), no medido, y puede infraestimar ' +
        'hasta un 12 %.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  },

  // ── P-08 · Y-Balance ─────────────────────────────────────────────────────
  {
    id: 'P-08/fiabilidad',
    pruebaId: 'P-08',
    fuenteId: 'plisky_ybt_2021',
    tipo: 'FIABILIDAD',
    nivel: 'D',
    ambito: {
      edadMin: null, edadMax: null, sexo: null, pais: null,
      contexto: 'deportiva',
      protocolo: { normalizado: 'porcentaje_longitud_pierna' },
      unidad: '% long. pierna',
    },
    representacion: { clase: 'fiabilidad', icc: [0.85, 0.91], cvPct: null },
    limitaciones: [
      'Es fiabilidad intraevaluador: no dice nada sobre la concordancia entre evaluadores.',
      'La fuente desaconseja expresamente aplicar puntos de corte generales.',
    ],
    variablesAtleta: [],
  },
];

/** Todas las referencias declaradas para una prueba, sin filtrar. */
export function referenciasDe(pruebaId: string): readonly ReferenciaEvidencia[] {
  return REFERENCIAS.filter((r) => r.pruebaId === pruebaId);
}
