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

import { DECILES_POWERLIFTING } from './deciles-powerlifting';
import { PERCENTILES_CHMS } from './percentiles-chms';
import {
  GRUPOS_BANDAS,
  INTERVALOS_SFT,
  SOLAPES_EN_LA_FUENTE,
  type GrupoBandas,
} from './tablas-poblacion-general';
import type { FuenteEvidencia, ReferenciaEvidencia } from './tipos';

/** De qué fuente es cada tabla de bandas. Una tabla, una primaria. */
const FUENTE_DE_TABLA: Readonly<Record<GrupoBandas['tabla'], string>> = {
  cooper: 'cooper_vo2_1979',
  aha: 'aha_vo2_1972',
  rivera: 'rivera_vo2_pr_1986',
  harvard_largo: 'harvard_iac_lopategui',
  harvard_corto: 'harvard_iac_lopategui',
};

/**
 * Qué condición de registro exige cada tabla para poder aplicarse.
 *
 * Las tres del VO2máx no exigen ninguna ecuación concreta —clasifican un
 * VO2máx, venga de donde venga—, pero las DOS DEL ESCALÓN sí exigen su método:
 * el manual publica una tabla por método y un índice de 70 cae en un tramo
 * distinto según cuál se usara. Sin esa condición declarada, el sistema
 * aplicaría las dos tablas al mismo número y produciría el conflicto él solo.
 */
const PROTOCOLO_DE_TABLA: Readonly<Record<GrupoBandas['tabla'], Readonly<Record<string, string>>>> = {
  cooper: {},
  aha: {},
  rivera: {},
  harvard_largo: { metodo: 'largo' },
  harvard_corto: { metodo: 'corto' },
};

const LIMITACIONES_DE_TABLA: Readonly<Record<GrupoBandas['tabla'], readonly string[]>> = {
  cooper: [
    'La reproducción consultada NO declara sobre qué muestra se construyó esta tabla.',
    'Publicada en 1979. Transcrita de un manual de laboratorio, no del original.',
  ],
  aha: [
    'Publicada en 1972 por la American Heart Association, sin tamaño de muestra en la ' +
      'reproducción consultada.',
    'Sus bandas de 50-65 y 60-69 se solapan tal como están impresas.',
  ],
  rivera: [
    'Adultos PUERTORRIQUEÑOS. Es la única de las cuatro tablas con población latinoamericana, ' +
      'y aun así no es colombiana.',
    'Las bandas masculinas de 50-65 y «más de 60» se solapan; las femeninas se detienen en ' +
      '«más de 50» y no separan a una mujer de 52 de una de 80.',
  ],
  harvard_largo: [
    'El manual no declara la muestra sobre la que se fijaron estos cortes, ni estratifica por ' +
      'edad ni por sexo.',
    'Corresponde al método LARGO: el índice se calcula con la suma de los tres pulsos de ' +
      'recuperación.',
  ],
  harvard_corto: [
    'El manual no declara la muestra sobre la que se fijaron estos cortes, ni estratifica por ' +
      'edad ni por sexo.',
    'Corresponde al método CORTO: el índice se calcula solo con el pulso del primer minuto.',
    'Sus tramos se solapan en 40, 60 y 80, tal como están impresos.',
  ],
};

/**
 * Lo que cada prueba del CHMS arrastra consigo: su protocolo y sus
 * limitaciones. Es lo ÚNICO que distingue una banda de salto de una de
 * sit-and-reach — los percentiles vienen del fichero generado, iguales para
 * las sesenta y seis.
 *
 * EL PAÍS SE MANTIENE COMO CONDICIÓN EN LAS DOS, y por motivos distintos que
 * conviene no confundir:
 *
 *   · **Salto** — `rouis_etnia_salto_2016` documenta ~10 cm de diferencia
 *     entre grupos de ascendencia distinta con brazos libres, que es el mismo
 *     protocolo que usa esta fuente. Diez centímetros cruzan cuatro bandas de
 *     percentil de esta misma tabla.
 *
 *   · **Sit-and-reach** — mide una DISTANCIA ALCANZADA, y quien tiene brazos
 *     largos y piernas cortas alcanza más sin ser más extensible. Las
 *     proporciones de segmentos varían sistemáticamente entre poblaciones.
 *
 * Mantenerlo como condición no significa descartar la norma para un
 * colombiano: desde PAS-13 la norma se aplica y la población de origen viaja
 * con ella para que la frase la nombre. Lo que no puede hacerse es
 * presentarla como si fuera propia.
 */
const CHMS: Readonly<
  Record<
    'P-04' | 'P-06',
    { protocolo: Readonly<Record<string, string>>; limitaciones: readonly string[] }
  >
> = {
  'P-04': {
    protocolo: { brazos: 'libres' },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Plataforma Leonardo Mechanograph; salto bilateral con contramovimiento y BRAZOS LIBRES.',
      'Se tomó el mejor de tres intentos válidos.',
      'Se han transcrito las 32 bandas que publica la fuente, de 8 a 69 años.',
    ],
  },
  'P-06': {
    protocolo: { version: 'clasico' },
    limitaciones: [
      'Muestra nacionalmente representativa de CANADÁ. No describe a ninguna otra población.',
      'Flexómetro con el cero calibrado de modo que tocar los dedos equivale a 26 cm: un valor medido con otra calibración no es comparable.',
      'Se tomó el mejor de dos intentos válidos, tras estiramiento previo.',
      'Se han transcrito las 34 bandas que publica la fuente, de 6 a 69 años.',
    ],
  },
};

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
  {
    id: 'cook_fms_2006',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Cook, G., Burton, L., y Hoogenboom, B.',
      anio: 2006,
      titulo:
        'Pre-participation screening: the use of fundamental movements as an assessment of ' +
        'function - part 1 and part 2',
      publicacion: 'North American Journal of Sports Physical Therapy, 1(2) 62-72 y 1(3) 132-139',
      localizador: 'PMID 21522216 (parte 1) · PMID 21522225 (parte 2)',
    },
    poblacion: 'No es un estudio de muestra: define el protocolo y la escala de las 7 pruebas.',
    sostiene:
      'El protocolo original: qué mide cada una de las 7 pruebas, cuáles se puntúan por lado ' +
      '(el lado más bajo es la puntuación de esa prueba), en cuáles hay una prueba de despeje ' +
      'que convierte el resultado en 0 si duele, y la escala de 0 a 3 con la que se puntúa cada ' +
      'una.',
    noSostiene:
      'No publica ninguna norma poblacional ni punto de corte: eso es lo que evalúa (y ' +
      'descarta) `moran_fms_2017`. Aquí solo vive CÓMO se puntúa, no qué significa el total.',
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

  // ══════════════════════════════════════════════════════════════════════════
  // POBLACIÓN GENERAL · Sprint PAS-18
  // ══════════════════════════════════════════════════════════════════════════
  //
  // LA CADENA, QUE AQUÍ IMPORTA MÁS QUE DE COSTUMBRE:
  //
  //   Estas cinco tablas llegan en documentos DOCENTES —dos manuales de
  //   laboratorio, un apunte universitario, un manual de certificación— que
  //   reproducen tablas de otros. Lo que se tiene en la mano es la
  //   reproducción; el estudio original no se ha abierto.
  //
  //   Se cita la PRIMARIA, porque es de quien son los datos y es lo que hay
  //   que poder ir a comprobar. Y cada referencia declara por dónde llegó,
  //   porque «Cooper 1979» leído en un manual de 2025 y «Cooper 1979» leído en
  //   Cooper no son la misma verificación (NKB `13`, nivel E-2).
  //
  //   Ninguna es `admitida`: no han pasado el procedimiento de la NKB. Son
  //   `propuesta`, que es exactamente lo que son.

  {
    id: 'rikli_jones_sft_2001',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Rikli, R. E., & Jones, C. J.',
      anio: 2001,
      titulo: 'Senior Fitness Test Manual',
      publicacion: 'Champaign, IL: Human Kinetics',
      localizador:
        'ISBN 978-0-7360-3356-6. Tabla transcrita de: García Merino, S. «Valoración de la ' +
        'condición física en personas mayores: Senior Fitness Test», Universidad Europea de ' +
        'Madrid, pp. 8-10 (intervalo normal por sexo y edad).',
    },
    poblacion:
      'Más de 7.000 mayores independientes de 60 a 94 años, de 267 lugares de Estados Unidos',
    sostiene:
      'Situar el resultado de cada una de las siete pruebas dentro del intervalo entre el ' +
      'percentil 25 y el 75 que publica para su sexo y su banda de edad.',
    noSostiene:
      'No es una norma colombiana ni latinoamericana. No define categorías: quedar fuera del ' +
      'intervalo no es un diagnóstico ni un grado, solo dice que la mitad central del grupo de ' +
      'referencia no llegaba ahí. Y no se ha leído el manual original: la tabla llega por un ' +
      'documento docente que la traduce.',
  },
  {
    id: 'cooper_vo2_1979',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Cooper, K. H.',
      anio: 1979,
      titulo: 'El Camino del Aeróbics',
      publicacion: 'México: Editorial Diana',
      localizador:
        'pp. 295-296. Transcrita de la tabla L4:2 de: Lopategui Corsino, E. «Prueba de ' +
        'caminata de una milla (Rockport)», http://www.saludmed.com/LabFisio/Lab-F-Men1.html',
    },
    poblacion: 'No declarada en la reproducción consultada',
    sostiene:
      'Situar un VO2máx estimado en el tramo que esta tabla concreta nombra, para su sexo y su ' +
      'banda de edad, de los 13 a más de 60 años.',
    // Las etiquetas de los seis tramos NO se reproducen aquí: viven en
    // `tablas-poblacion-general.ts`, que es su sitio. Un adjetivo de mérito en
    // este campo lo convertiría en algo que el sistema afirma, y `admision`
    // tiene un test que lo impide — con razón.
    noSostiene:
      'La reproducción NO declara sobre qué muestra se construyó la tabla, así que no puede ' +
      'decirse a qué población representa. Los nombres de sus seis tramos son suyos y no ' +
      'coinciden con los de las otras tres tablas del mismo documento.',
  },
  {
    id: 'aha_vo2_1972',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'American Heart Association',
      anio: 1972,
      titulo: 'Exercise Testing and Training of Apparently Healthy Individuals: A Handbook for Physicians',
      publicacion: 'Dallas: American Heart Association',
      localizador:
        'p. 15. Transcrita de la tabla L4:4 de: Lopategui Corsino, E. ' +
        'http://www.saludmed.com/LabFisio/Lab-F-Men1.html',
    },
    poblacion: 'Adultos aparentemente sanos. La reproducción no publica el tamaño de la muestra',
    sostiene:
      'Situar un VO2máx estimado en el tramo que esta tabla nombra, de los 20 a los 69 años.',
    noSostiene:
      'Tiene medio siglo y la reproducción no declara su muestra. Sus bandas de edad se solapan ' +
      '—50-65 y 60-69 a la vez— tal como están impresas.',
  },
  {
    id: 'rivera_vo2_pr_1986',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Rivera, M. A.',
      anio: 1986,
      titulo: 'The maximal aerobic capacity of adult puerto ricans',
      publicacion: 'Boletín de la Asociación Médica de Puerto Rico, 78(10), p. 429',
      localizador:
        'Boletín de la Asoc. Médica de PR, 78(10), p. 429. Transcrita de la tabla L4:1 de: ' +
        'Lopategui Corsino, E. http://www.saludmed.com/LabFisio/Lab-F-Men1.html',
    },
    poblacion: 'Adultos puertorriqueños',
    sostiene:
      'Situar un VO2máx estimado en su tramo. Es la ÚNICA de las cuatro con población ' +
      'latinoamericana, y por eso se registra pese a sus defectos.',
    noSostiene:
      'Puerto Rico no es Colombia. Sus bandas masculinas se solapan (50-65 y más de 60) y las ' +
      'femeninas se detienen en «más de 50», sin separar a una mujer de 52 de una de 80.',
  },
  {
    id: 'rockport_kline_lopategui',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Kline, G. M., y cols.',
      anio: 1987,
      titulo:
        'Estimation of VO2max from a one-mile track walk, gender, age and body weight',
      publicacion: 'Medicine and Science in Sports and Exercise, 19(3), 253-259',
      localizador:
        'PMID 3600239. Las tres ecuaciones se transcriben de: Lopategui Corsino, E. «Prueba de ' +
        'caminata de una milla (Rockport)», pp. 5-6, ' +
        'http://www.saludmed.com/LabFisio/Lab-F-Men1.html',
    },
    poblacion: 'Adultos sanos de 30 a 69 años (muestra original de validación de Rockport)',
    sostiene:
      'Estimar el consumo de oxígeno máximo relativo a la masa corporal a partir del tiempo en ' +
      'caminar una milla, la frecuencia cardiaca al terminar, la masa, la edad y el sexo.',
    noSostiene:
      'Es una ESTIMACIÓN por regresión, no una medición: el error típico de la ecuación viaja ' +
      'con cada resultado y la fuente consultada no lo publica. Las tres ecuaciones dan cifras ' +
      'distintas para el mismo paseo, y la segunda ni siquiera usa la edad. No mide el VO2máx ' +
      'ni sustituye a una prueba de esfuerzo.',
  },
  {
    id: 'harvard_iac_lopategui',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Lopategui Corsino, E.',
      anio: 2008,
      titulo: 'Prueba del escalón de Harvard · Experimento de laboratorio F-16',
      publicacion: 'Saludmed',
      localizador: 'http://www.saludmed.com/LabFisio/Lab-F-Men1.html · citando a Adams, G. M. (1998)',
    },
    poblacion: 'No declarada. El manual no publica sobre qué muestra se fijaron los cortes',
    sostiene:
      'Situar el índice de aptitud cardiorrespiratoria en el tramo que el manual nombra, ' +
      'usando la tabla del método con el que se calculó.',
    noSostiene:
      'No consta la muestra ni la edad ni el sexo de quien produjo estos cortes, así que la ' +
      'tabla se aplica a todo el mundo por igual y eso es una limitación, no una virtud. El ' +
      'propio documento se contradice sobre la duración en mujeres —dice 6 minutos en la ' +
      'preparación y 4 en la administración— y sus tramos del método corto se solapan en 40, ' +
      '60 y 80.',
  },
  {
    id: 'mcgill_torso_ace_2015',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'American Council on Exercise',
      anio: 2015,
      titulo: "McGill's Torso Muscular Endurance Test Battery",
      publicacion: 'ACE Certified Medical Exercise Specialist',
      localizador:
        'https://www.acefitness.org · sección 02-10-CMES, figura 4 (hoja de registro y ' +
        'criterios de relación), p. 4.',
    },
    poblacion: 'No declarada',
    sostiene:
      'Comparar los tres tiempos ENTRE SÍ mediante los tres cocientes que el manual publica, ' +
      'cada uno con su criterio.',
    noSostiene:
      'No publica ningún valor normativo para los tiempos por separado: aguantar 90 segundos no ' +
      'se puede situar respecto a nadie. Lo único que sostiene es el equilibrio entre las tres ' +
      'pruebas del mismo sujeto, y no declara sobre qué muestra se fijaron esos cocientes.',
  },
  {
    id: 'leger_1988_20msr',
    estado: 'propuesta',
    claveExterna: null,
    cita: {
      autores: 'Léger, L. A., Mercier, D., Gadoury, C., y Lambert, J.',
      anio: 1988,
      titulo: 'The multistage 20 metre shuttle run test for aerobic fitness',
      publicacion: 'Journal of Sports Sciences, 6(2), 93-101',
      localizador:
        'DOI 10.1080/02640418808729800. Ecuación transcrita y verificada contra: Bandyopadhyay, ' +
        'A. (2011). Validity of 20 meter multi-stage shuttle run test for estimation of maximum ' +
        'oxygen uptake in male university students. Indian Journal of Physiology and ' +
        'Pharmacology, 55(3), 221-226, p. 223, que reproduce la fórmula completa con sus cuatro ' +
        'coeficientes.',
    },
    poblacion:
      '188 niños y niñas de 8 a 19 años (muestra de calibración de la ecuación). Revalidada para ' +
      'adultos de 18 a 50 años (n=77) en Léger, L., y Gadoury, C. (1989). Validity of the 20 ' +
      'meter shuttle run test with 1 min stages to predict VO2max in adults. Canadian Journal of ' +
      'Sport Sciences, 14(1), 21-26, manteniendo la edad fija en 18 años para todo mayor de edad.',
    sostiene:
      'Estimar el VO2máx (mL·kg⁻¹·min⁻¹) a partir del último estadio completado en la ' +
      'Course-navette y la edad, con la ecuación: 31,025 + (3,238 × velocidad) − (3,248 × edad) + ' +
      '(0,1536 × velocidad × edad), donde velocidad = 8 + 0,5 × estadio.',
    noSostiene:
      'Es una ESTIMACIÓN por regresión, no una medición directa de gases. El término de edad se ' +
      'calibró entre 8 y 19 años: usarlo tal cual en un adulto de 40 extrapolaría la ecuación ' +
      'fuera de donde se ajustó, así que para cualquier edad mayor de 18 se usa 18 — la ' +
      'revalidación de 1989 hizo exactamente eso, no una elección de este sistema. Con esa ' +
      'corrección, el error típico de la estimación en adultos no consta en las fuentes ' +
      'consultadas.',
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
  // ── P-01 · 1RM · deciles de fuerza relativa ──────────────────────────────
  //
  // Sustituyen a las dos entradas anteriores, que traían solo el percentil 90
  // y —lo importante— NO declaraban de qué levantamiento eran. Ese 2,83 es la
  // sentadilla; aplicado a un press de banca comparaba contra la norma de otro
  // ejercicio sin que nada lo impidiera.
  //
  // Ahora son 30 referencias: 3 levantamientos × 2 sexos × 5 bandas de edad,
  // cada una con sus nueve deciles. Se construyen desde
  // `deciles-powerlifting.ts`, que es el fichero generado y verificado — aquí
  // solo se les pone el ámbito y las limitaciones que comparten todas.
  ...DECILES_POWERLIFTING.map((d) => ({
    id: `P-01/powerlifting/${d.patron}/${d.sexo}/${d.banda.min}`,
    pruebaId: 'P-01',
    fuenteId: 'van_den_hoek_powerlifting_2024',
    tipo: 'BENCHMARK' as const,
    nivel: 'C' as const,
    ambito: {
      edadMin: d.banda.min,
      edadMax: d.banda.max,
      sexo: d.sexo,
      pais: null,
      contexto: 'competicion',
      protocolo: { determinacion: 'medido_directo' },
      unidad: 'ratio_peso',
      patron: d.patron,
    },
    representacion: { clase: 'percentiles' as const, puntos: d.puntos },
    limitaciones: [
      'La muestra son competidores federados de powerlifting con control antidopaje, no ' +
        'población general: un practicante recreativo caerá en los percentiles bajos sin que ' +
        'eso signifique nada sobre su entrenamiento.',
      'El valor es la razón entre la carga levantada y la masa corporal, no kilos absolutos.',
      'Son deciles: sitúan el resultado dentro de una distribución. NO son categorías de ' +
        'nivel, y la fuente no publica ninguna.',
      ...(d.patron === 'press_banca' && d.sexo === 'M' && d.banda.min === 18
        ? [
            'El resumen del artículo da 1,95 para este percentil 90 y la Tabla 4 da 1,96. Se ' +
              'transcribe la tabla, que es el dato primario.',
          ]
        : []),
    ],
    variablesAtleta: ['peso_kg'],
  })),
  {
    id: 'P-01/fiabilidad',
    pruebaId: 'P-01',
    fuenteId: 'grgic_1rm_2020',
    tipo: 'FIABILIDAD',
    nivel: 'D',
    ambito: {
      edadMin: null, edadMax: null, sexo: null, pais: null,
      contexto: 'general', protocolo: SIN_PROTOCOLO, unidad: 'kg',
      patron: null,
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
      patron: null,
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
      patron: null,
    },
    representacion: { clase: 'fiabilidad', icc: [0.981, 0.987], cvPct: 6.1 },
    limitaciones: [
      'Muestra de 22 deportistas universitarios de modalidades heterogéneas.',
      'La fuente NO publica SEM ni MDC, así que no autoriza a decir si un cambio es real.',
      'Los saltos se realizaron a intensidad moderada-alta, no máxima.',
    ],
    variablesAtleta: [],
  },

  // ── P-04 y P-06 · las 66 normas canadienses (Sprint PAS-17) ──────────────
  //
  // AQUÍ HABÍA OCHO BANDAS TECLEADAS A MANO: varones y mujeres de 20 a 24 y de
  // 25 a 29. Las otras cincuenta y ocho llevaban desde PAS-12 transcritas y
  // verificadas en las fichas `CMJ-CA-TN1-percentiles.md` (32 normas, 8 a 69
  // años) y `SAR-CA-TN1-percentiles.md` (34 normas, 6 a 69 años), y no
  // llegaban hasta aquí. Un niño de 12, un adulto de 45 y una mujer de 60
  // salían sin posición en dos de las cinco pruebas que la tienen — no porque
  // faltara ciencia, sino porque faltaba el cable.
  //
  // NO SE ADMITE NINGUNA NORMA NUEVA. La fuente ya estaba admitida, la ficha ya
  // estaba verificada y las cifras son las mismas: lo único que cambia es
  // cuántas de ellas llegan a la pantalla. El generador lo demuestra
  // comparando punto por punto estas ocho bandas con lo que lee de la ficha.
  ...PERCENTILES_CHMS.map((b) => ({
    id: `${b.prueba}/chms/${b.sexo.toLowerCase()}-${b.edadMin}-${b.edadMax}`,
    pruebaId: b.prueba,
    fuenteId: 'hoffmann_chms_2019',
    tipo: 'NORMATIVA' as const,
    nivel: 'A' as const,
    ambito: {
      edadMin: b.edadMin,
      edadMax: b.edadMax,
      sexo: b.sexo,
      pais: 'CA',
      contexto: 'general' as const,
      protocolo: CHMS[b.prueba].protocolo,
      unidad: 'cm',
      patron: null,
    },
    representacion: { clase: 'percentiles' as const, puntos: b.puntos },
    limitaciones: [
      ...CHMS[b.prueba].limitaciones,
      // El hueco se declara EN LA BANDA QUE LO TIENE, no en las sesenta y seis.
      // Dos celdas se perdieron en la extracción del PDF y las fichas prohíben
      // reconstruirlas; decirlo en todas convertiría el aviso en decorado.
      ...(b.puntos.length === 11
        ? []
        : [
            `Esta banda se publica con once percentiles y aquí salen ${b.puntos.length}: ` +
              'la extracción del PDF perdió una celda y la ficha de la NKB prohíbe estimarla.',
          ]),
    ],
    variablesAtleta: ['edad', 'sexo'],
  })),

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
      patron: null,
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
      patron: null,
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
      patron: null,
    },
    representacion: { clase: 'fiabilidad', icc: [0.85, 0.91], cvPct: null },
    limitaciones: [
      'Es fiabilidad intraevaluador: no dice nada sobre la concordancia entre evaluadores.',
      'La fuente desaconseja expresamente aplicar puntos de corte generales.',
    ],
    variablesAtleta: [],
  },

  // ── Senior Fitness Test · 98 intervalos normales (PAS-18) ────────────────
  //
  // Un `rango`, no unos percentiles: la fuente publica el tramo entre el P25 y
  // el P75 y nada más. La posición que sale de aquí es «dentro» o «fuera», y
  // fuera por arriba y fuera por abajo son cosas distintas — que es justo lo
  // que necesita quien valora a una persona mayor.
  ...INTERVALOS_SFT.map((s) => ({
    id: `${s.prueba}/sft/${s.sexo.toLowerCase()}-${s.edadMin}-${s.edadMax}`,
    pruebaId: s.prueba,
    fuenteId: 'rikli_jones_sft_2001',
    tipo: 'NORMATIVA' as const,
    nivel: 'B' as const,
    ambito: {
      edadMin: s.edadMin,
      edadMax: s.edadMax,
      sexo: s.sexo,
      // País `null` A PROPÓSITO, y es la única de las tablas nuevas que lo
      // hace. La muestra es estadounidense, pero la batería se administra
      // igual en todas partes y el documento que la trae es europeo: fijar
      // 'US' la habría marcado como ajena a un colombiano sin que eso añada
      // ninguna cautela que las limitaciones no digan ya.
      pais: null,
      contexto: 'general',
      protocolo: { protocolo: 'rikli_jones' },
      unidad: s.unidad,
      patron: null,
    },
    representacion: { clase: 'rango' as const, min: s.min, max: s.max },
    limitaciones: [
      'Muestra estadounidense: más de 7.000 mayores independientes de 60 a 94 años.',
      'Es el intervalo entre el percentil 25 y el 75, no una categoría: quedar fuera no es un ' +
        'grado ni un diagnóstico.',
      'La batería se diseñó para personas mayores AUTÓNOMAS. No describe a quien ya depende de ' +
        'ayuda para moverse.',
      'Transcrita de un documento docente que traduce el manual original, no del manual.',
    ],
    variablesAtleta: ['edad', 'sexo'],
  })),

  // ── VO2máx y escalón · bandas con nombre (PAS-18) ────────────────────────
  //
  // CUATRO TABLAS PARA EL MISMO NÚMERO, Y NO COINCIDEN. Un varón de 25 años
  // con 44 mL/kg/min es «Promedio» para Rivera y «Bueno» para Cooper y para la
  // AHA. Las cuatro se registran y NINGUNA se elige: `leerEvidencia` las
  // devuelve todas y la frase dice cuántas hay (PAS-ADR-04).
  //
  // Es incómodo de leer y es la verdad. Enseñar una sola etiqueta obligaría a
  // decidir cuál de las cuatro es la buena, y eso no lo ha decidido nadie.
  ...GRUPOS_BANDAS.map((g) => ({
    id: `${g.prueba}/${g.tabla}/${g.sexo === null ? 'todos' : g.sexo.toLowerCase()}-${g.edadMin ?? 'x'}`,
    pruebaId: g.prueba,
    fuenteId: FUENTE_DE_TABLA[g.tabla],
    tipo: 'NORMATIVA' as const,
    nivel: 'C' as const,
    ambito: {
      edadMin: g.edadMin,
      edadMax: g.edadMax,
      sexo: g.sexo,
      pais: g.tabla === 'rivera' ? 'PR' : null,
      contexto: 'general',
      protocolo: PROTOCOLO_DE_TABLA[g.tabla],
      unidad: g.unidad,
      patron: null,
    },
    representacion: { clase: 'bandas' as const, bandas: g.bandas },
    limitaciones: [
      ...LIMITACIONES_DE_TABLA[g.tabla],
      'Los nombres de los tramos son los de esta tabla. Otras tablas de la misma prueba parten ' +
        'los tramos en otros sitios y los llaman de otra manera.',
      ...(SOLAPES_EN_LA_FUENTE.some((s) =>
        s.startsWith(`${g.tabla}/${g.sexo ?? '-'}/${g.edadMin ?? '-'}:`),
      )
        ? [
            'Esta tabla imprime dos tramos que se tocan en un mismo valor. Se conserva tal cual: ' +
              'un intervalo explícito manda sobre un extremo abierto, y si el empate es entre dos ' +
              'intervalos cerrados no se sitúa.',
          ]
        : []),
    ],
    variablesAtleta: g.sexo === null ? [] : ['edad', 'sexo'],
  })),

  // ── McGill · los tres cocientes (PAS-18) ─────────────────────────────────
  //
  // La batería NO publica normas para los tiempos sueltos. Lo que publica son
  // tres criterios de EQUILIBRIO entre las tres pruebas del mismo sujeto, y
  // por eso viven en la capa de cálculo y no como referencia de una prueba:
  // un cociente no es una prueba del catálogo.
  //
  // Aquí solo queda constancia de que los tiempos, por sí solos, no sitúan a
  // nadie. Es la diferencia entre «no hay literatura» y «la literatura dice
  // expresamente que este número aislado no significa nada».
  ...(['P-21', 'P-22', 'P-23'] as const).map((prueba) => ({
    id: `${prueba}/mcgill/sin-norma`,
    pruebaId: prueba,
    fuenteId: 'mcgill_torso_ace_2015',
    tipo: 'NORMATIVA' as const,
    nivel: 'C' as const,
    ambito: {
      edadMin: null,
      edadMax: null,
      sexo: null,
      pais: null,
      contexto: 'general',
      protocolo: {},
      unidad: 's',
      patron: null,
    },
    representacion: {
      clase: 'valores_sin_transcribir' as const,
      queSePublica:
        'tres criterios de relación entre las tres pruebas (flexión:extensión menor que 1,0; ' +
        'puente derecho:izquierdo a menos de 0,05 de 1,0; puente:extensión menor que 0,75), no ' +
        'valores normativos para cada tiempo por separado',
    },
    limitaciones: [
      'La fuente no publica norma para el tiempo aislado de esta prueba: solo los cocientes ' +
        'entre las tres.',
    ],
    variablesAtleta: [],
  })),
];

/** Todas las referencias declaradas para una prueba, sin filtrar. */
export function referenciasDe(pruebaId: string): readonly ReferenciaEvidencia[] {
  return REFERENCIAS.filter((r) => r.pruebaId === pruebaId);
}
