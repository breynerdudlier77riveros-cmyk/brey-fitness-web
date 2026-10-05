// ── Modelos de periodización · andamiajes (Sprint MAC-1) ───────────────────
//
// QUÉ ES ESTO Y QUÉ NO ES.
//
//   Cinco estructuras de planificación reconocidas, cada una con sus fases en
//   su orden y con el autor al que se le atribuye. Sirven para SEMBRAR un
//   macrociclo: crean los mesociclos con su nombre y su secuencia, y las filas
//   de la rejilla vacías.
//
//   NO TRAEN NI UNA CIFRA. Ni un porcentaje de 1RM, ni un volumen, ni una
//   progresión semanal. Eso es lo que distingue una estructura documentada de
//   una prescripción inventada, y la diferencia importa:
//
//     · «El ATR ordena acumulación, transformación y realización» describe un
//       modelo publicado. Es verificable y es de quien lo publicó.
//
//     · «En acumulación se trabaja al 60-75 % de 1RM» es una prescripción
//       cuantitativa. Puede ser razonable y aun así no ser de nadie: sin la
//       fuente delante es una cifra que el sistema se inventa, y este sistema
//       no inventa cifras.
//
//   Cuando entren los libros —Matveyev, Issurin, Bompa, Verkhoshansky— las
//   cifras podrán cargarse con su cita, como se hizo con las tablas del PAS.
//   Hasta entonces las celdas salen vacías y las rellena el entrenador, que es
//   quien firma el plan.
//
// ── POR QUÉ LAS ATRIBUCIONES SON PARCIALES Y SE DECLARA ──────────────────
//
//   `atribucion` dice a quién se le atribuye el modelo; `verificado: false`
//   dice que este proyecto NO ha abierto la obra original. Las dos cosas a la
//   vez, porque una atribución sin esa advertencia se lee como una cita
//   comprobada, y no lo es.
//
// Módulo puro: datos y funciones sin efectos.

import type { Mesociclo } from './tipos';

export interface FaseModelo {
  id: string;
  nombre: string;
  /** Qué se persigue en la fase, en las palabras con que se describe. */
  proposito: string;
  color: string;
}

export interface ModeloPeriodizacion {
  id: string;
  nombre: string;
  /** A quién se atribuye. NO es una cita verificada: ver `verificado`. */
  atribucion: string;
  /**
   * `false` en los cinco: la obra original no se ha consultado en este
   * proyecto. Se declara para que nadie lea la atribución como una
   * verificación, que es la distinción E-2 de la base normativa.
   */
  verificado: boolean;
  descripcion: string;
  fases: readonly FaseModelo[];
  /**
   * Filas que el modelo sugiere planificar. VACÍAS: solo son los renglones.
   *
   * `grafico` es el color con el que la fila entra en la curva de carga, o
   * `null` si se queda en la tabla. Marcar volumen e intensidad es lo que
   * dibuja la curva clásica del plan gráfico en cuanto se siembra el plan;
   * seguirá sin tener un solo punto hasta que el entrenador escriba el primero.
   */
  filasSugeridas: readonly {
    nombre: string;
    tipo: 'texto' | 'numero' | 'porcentaje';
    unidad: string;
    grafico: string | null;
  }[];
}

/**
 * Los cuatro renglones que comparten los cinco modelos.
 *
 * Volumen e intensidad llevan color: son las dos líneas de la curva de carga
 * de toda la vida. El azul y el rojo son los del plan gráfico clásico, y se
 * conservan porque quien lleva veinte años leyendo estos cuadros los reconoce
 * antes de leer la leyenda.
 */
const FILAS_COMUNES = [
  { nombre: 'Volumen', tipo: 'numero' as const, unidad: '', grafico: '#3b82f6' },
  { nombre: 'Intensidad', tipo: 'porcentaje' as const, unidad: '%', grafico: '#ef4444' },
  { nombre: 'Contenidos', tipo: 'texto' as const, unidad: '', grafico: null },
  { nombre: 'Observaciones', tipo: 'texto' as const, unidad: '', grafico: null },
];

export const MODELOS: readonly ModeloPeriodizacion[] = [
  {
    id: 'clasico',
    nombre: 'Clásico / tradicional',
    atribucion: 'Se atribuye a L. P. Matveyev (1965)',
    verificado: false,
    descripcion:
      'Un solo pico de forma por temporada. El volumen alto y la intensidad baja del periodo ' +
      'preparatorio van cediendo terreno a lo contrario según se acerca la competición.',
    fases: [
      {
        id: 'prep_general',
        nombre: 'Preparatorio general',
        proposito: 'Base amplia de trabajo, poco específica',
        color: '#3b82f6',
      },
      {
        id: 'prep_especifico',
        nombre: 'Preparatorio específico',
        proposito: 'El trabajo se acerca a las exigencias de la competición',
        color: '#8b5cf6',
      },
      {
        id: 'competitivo',
        nombre: 'Competitivo',
        proposito: 'Mantener la forma durante el calendario de competición',
        color: '#f59e0b',
      },
      {
        id: 'transicion',
        nombre: 'Transición',
        proposito: 'Recuperación entre temporadas',
        color: '#64748b',
      },
    ],
    filasSugeridas: FILAS_COMUNES,
  },
  {
    id: 'atr',
    nombre: 'ATR · Acumulación · Transformación · Realización',
    atribucion: 'Se atribuye a Y. Issurin y V. Kaverin (1985)',
    verificado: false,
    descripcion:
      'Bloques concentrados que se repiten a lo largo del año en vez de un único pico. Cada ' +
      'bloque acumula capacidades, las transforma en trabajo específico y las realiza en ' +
      'competición.',
    fases: [
      {
        id: 'acumulacion',
        nombre: 'Acumulación',
        proposito: 'Acumular capacidades básicas',
        color: '#3b82f6',
      },
      {
        id: 'transformacion',
        nombre: 'Transformación',
        proposito: 'Convertir lo acumulado en trabajo específico',
        color: '#8b5cf6',
      },
      {
        id: 'realizacion',
        nombre: 'Realización',
        proposito: 'Llegar a la competición con lo transformado',
        color: '#f59e0b',
      },
    ],
    filasSugeridas: FILAS_COMUNES,
  },
  {
    id: 'bloques',
    nombre: 'Bloques concentrados',
    atribucion: 'Se atribuye a Y. Verkhoshansky',
    verificado: false,
    descripcion:
      'Cargas concentradas sobre pocas capacidades a la vez, contando con que el efecto se ' +
      'exprese con retardo una vez retirada la carga.',
    fases: [
      {
        id: 'bloque_carga',
        nombre: 'Bloque de carga concentrada',
        proposito: 'Carga alta sobre pocas capacidades',
        color: '#ef4444',
      },
      {
        id: 'bloque_restitucion',
        nombre: 'Restitución',
        proposito: 'Retirada de la carga para que el efecto se exprese',
        color: '#22c55e',
      },
      {
        id: 'bloque_realizacion',
        nombre: 'Realización',
        proposito: 'Trabajo específico de competición',
        color: '#f59e0b',
      },
    ],
    filasSugeridas: FILAS_COMUNES,
  },
  {
    id: 'ondulatorio',
    nombre: 'Ondulatorio',
    atribucion: 'Se atribuye a C. Poliquin (1988); estudiado por M. Rhea y cols. (2002)',
    verificado: false,
    descripcion:
      'La carga varía entre sesiones o entre semanas en lugar de progresar en una sola ' +
      'dirección. Convive con un macrociclo: lo que ondula es el contenido de cada semana.',
    fases: [
      {
        id: 'onda_acumulacion',
        nombre: 'Acumulación',
        proposito: 'Semanas de carga creciente',
        color: '#3b82f6',
      },
      {
        id: 'onda_descarga',
        nombre: 'Descarga',
        proposito: 'Semana de carga reducida',
        color: '#22c55e',
      },
    ],
    filasSugeridas: [
      ...FILAS_COMUNES,
      { nombre: 'Ondulación', tipo: 'texto' as const, unidad: '', grafico: null },
    ],
  },
  {
    id: 'conjugado',
    nombre: 'Conjugado',
    atribucion: 'Se atribuye a Y. Verkhoshansky; difundido por L. Simmons',
    verificado: false,
    descripcion:
      'Varias capacidades se entrenan a la vez durante todo el ciclo, rotando los ejercicios ' +
      'para sostener el estímulo sin abandonar ninguna cualidad.',
    fases: [
      {
        id: 'conj_esfuerzo_maximo',
        nombre: 'Esfuerzo máximo',
        proposito: 'Cargas máximas, rotando ejercicio',
        color: '#ef4444',
      },
      {
        id: 'conj_esfuerzo_dinamico',
        nombre: 'Esfuerzo dinámico',
        proposito: 'Velocidad de ejecución con carga submáxima',
        color: '#8b5cf6',
      },
      {
        id: 'conj_repeticiones',
        nombre: 'Esfuerzo repetido',
        proposito: 'Trabajo acumulado y accesorio',
        color: '#3b82f6',
      },
    ],
    filasSugeridas: FILAS_COMUNES,
  },
];

const INDICE = new Map(MODELOS.map((m) => [m.id, m]));

export function modeloDe(id: string): ModeloPeriodizacion | null {
  return INDICE.get(id) ?? null;
}

export function faseDe(modeloId: string, faseId: string): FaseModelo | null {
  return modeloDe(modeloId)?.fases.find((f) => f.id === faseId) ?? null;
}

const INDICE_FASE = new Map(MODELOS.flatMap((m) => m.fases.map((f) => [f.id, m])));

/**
 * A qué modelo pertenece una fase, por el `faseId` de un mesociclo.
 *
 * Los ids de fase son únicos en todo el catálogo (lo comprueba un test), así
 * que la búsqueda no es ambigua. Sirve para saber, mirando el mesociclo que ya
 * hay en un rango de semanas, qué modelo lo sembró — sin guardar esa relación
 * dos veces en el documento.
 */
export function modeloDeFase(faseId: string | null): ModeloPeriodizacion | null {
  return faseId === null ? null : (INDICE_FASE.get(faseId) ?? null);
}

/**
 * Reparte `semanas` entre las fases del modelo, en orden.
 *
 * ── POR QUÉ UN REPARTO A PARTES IGUALES Y NO UNO «BUENO» ────────────────
 *
 *   Porque cuánto debe durar cada fase ES la decisión del entrenador, y la
 *   literatura no publica una respuesta única ni universal. Un reparto que
 *   diera 6 semanas a acumulación y 2 a realización estaría afirmando una
 *   proporción que nadie ha escrito aquí.
 *
 *   A partes iguales no es una recomendación: es visiblemente neutro, y se ve
 *   a simple vista que hay que ajustarlo. El resto que no cabe se reparte
 *   desde la PRIMERA fase, porque quedarse corto al final dejaría la última
 *   fase —la que toca la competición— con menos semanas que las demás sin que
 *   nadie lo haya decidido.
 */
export function repartirSemanas(total: number, fases: number): number[] {
  if (fases <= 0 || total <= 0) return [];

  // Con menos semanas que fases, las primeras se llevan una cada una y las
  // últimas se quedan fuera: es preferible a crear mesociclos de cero semanas.
  if (total <= fases) return Array.from({ length: total }, () => 1);

  const base = Math.floor(total / fases);
  const resto = total % fases;
  return Array.from({ length: fases }, (_, i) => base + (i < resto ? 1 : 0));
}

/** Los mesociclos que produce sembrar un macrociclo con un modelo. */
export function mesociclosDelModelo(
  modeloId: string,
  semanas: number,
  nuevoId: () => string,
): Mesociclo[] {
  const modelo = modeloDe(modeloId);
  if (modelo === null) return [];

  const reparto = repartirSemanas(semanas, modelo.fases.length);
  return reparto.map((n, i) => ({
    id: nuevoId(),
    nombre: modelo.fases[i].nombre,
    semanas: n,
    faseId: modelo.fases[i].id,
    // El modelo no dice de qué TIPO —entrante, básico, competitivo— es cada
    // fase: son dos taxonomías distintas, y cruzarlas aquí inventaría una
    // equivalencia que ninguna de las dos obras publica.
    tipoId: null,
    color: modelo.fases[i].color,
    notas: null,
  }));
}
