// ── Macrociclo · núcleo puro (Sprint MAC-1) ────────────────────────────────
//
// Todo lo que decide la FORMA de la rejilla vive aquí, sin React, sin
// Supabase y sin reloj. La interfaz pinta lo que este módulo devuelve.
//
// ── LAS TRES INVARIANTES ──────────────────────────────────────────────────
//
//   1 · Toda fila tiene EXACTAMENTE `semanas` valores. Una fila más corta
//       desplazaría sus datos una columna a la izquierda al pintarla, y el
//       volumen de la semana 8 aparecería bajo la 7 sin que nada avisara.
//
//   2 · Los mesociclos NO se solapan ni exceden el total. Se guardan por
//       longitud, así que el orden del array es la posición, y lo único que
//       hay que vigilar es la suma.
//
//   3 · Los identificadores NO se reutilizan. Un día apunta a una plantilla
//       por id y una celda a una fila por id; reciclar uno haría que un dato
//       viejo apareciera en un sitio nuevo.
//
// ── LO QUE ESTE MÓDULO NO HACE ────────────────────────────────────────────
//
//   No calcula cargas, no propone progresiones y no juzga un plan. Suma lo
//   que hay escrito cuando se le pide, y nada más.

import type {
  BandaPlan,
  Competencia,
  ContenidoMacrociclo,
  DiaPlan,
  FilaPlan,
  Mesociclo,
  SemanaPlan,
  TipoFila,
  TramoBanda,
} from './tipos';
import { MAX_SEMANAS, MIN_SEMANAS } from './tipos';
import { mesociclosDelModelo, modeloDe } from './modelos';

/**
 * Identificador estable.
 *
 * `crypto.randomUUID` existe en Node y en todos los navegadores que soporta
 * el proyecto; el respaldo cubre un contexto no seguro, donde la API no está
 * disponible pero la aplicación tiene que seguir funcionando.
 */
export function nuevoId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function contenidoVacio(semanas = 0): ContenidoMacrociclo {
  return {
    bandas: [],
    mesociclos: [],
    semanas: Array.from({ length: Math.max(0, Math.trunc(semanas)) }, semanaVacia),
    competencias: [],
    filas: [],
    dias: [],
  };
}

/** Una semana sin nada decidido todavía. Todo `null`, que NO es todo cero. */
export function semanaVacia(): SemanaPlan {
  return {
    tipoMicrociclo: null,
    sesiones: null,
    horas: null,
    diasEntrenamiento: null,
    diasDescanso: null,
    notas: null,
  };
}

/** Una banda de cabecera vacía: periodo, etapas, o la que haga falta. */
export function bandaNueva(nombre: string, tramos: TramoBanda[] = []): BandaPlan {
  return { id: nuevoId(), nombre, tramos };
}

export function tramoNuevo(
  nombre: string,
  semanas: number,
  color = '#64748b',
  tipoId: string | null = null,
): TramoBanda {
  return { id: nuevoId(), nombre, semanas: Math.max(1, Math.trunc(semanas)), color, tipoId };
}

export function filaNueva(
  nombre: string,
  semanas: number,
  tipo: TipoFila = 'texto',
  unidad = '',
  grafico: string | null = null,
  grupo: string | null = null,
): FilaPlan {
  return {
    id: nuevoId(),
    nombre,
    tipo,
    unidad,
    // Nulos, no cadenas vacías: «no planificado» y «planificado como nada» son
    // cosas distintas, y el exportador necesita distinguirlas para no llenar
    // el Excel de celdas que parecen rellenas.
    valores: Array.from({ length: semanas }, () => null),
    grafico,
    grupo,
  };
}

export function mesocicloNuevo(
  nombre: string,
  semanas: number,
  color = '#64748b',
  tipoId: string | null = null,
): Mesociclo {
  return {
    id: nuevoId(),
    nombre,
    semanas: Math.max(1, semanas),
    faseId: null,
    tipoId,
    color,
    notas: null,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// LA REJILLA
// ════════════════════════════════════════════════════════════════════════════

/** En qué semana empieza cada mesociclo, en base cero. Derivado, no guardado. */
export function iniciosDeMesociclo(mesociclos: readonly { semanas: number }[]): number[] {
  const inicios: number[] = [];
  let acumulado = 0;
  for (const m of mesociclos) {
    inicios.push(acumulado);
    acumulado += m.semanas;
  }
  return inicios;
}

/** Igual que `iniciosDeMesociclo`, para los tramos de una banda: mismo problema. */
export const iniciosDeTramos = iniciosDeMesociclo;

/**
 * Cuántas semanas cubre una lista de tramos contiguos. Puede ser menor que el
 * total: un plan a medio escribir tiene semanas sin asignar, y eso se ve.
 *
 * Sirve para mesociclos y para los tramos de cualquier banda porque el
 * problema es el mismo —nombres sobre semanas contiguas— y duplicar la suma
 * en dos funciones idénticas es cómo acaban discrepando.
 */
export function semanasCubiertas(tramos: readonly { semanas: number }[]): number {
  return tramos.reduce((n, m) => n + m.semanas, 0);
}

/**
 * A qué mesociclo pertenece una semana, o `null` si ninguna la cubre.
 *
 * Una semana descubierta es un estado legítimo —el entrenador aún no ha
 * decidido esa parte— y se pinta como tal. Asignarla al mesociclo anterior
 * «porque queda cerca» inventaría una decisión que nadie tomó.
 */
export function mesocicloDeSemana(
  mesociclos: readonly Mesociclo[],
  semana: number,
): Mesociclo | null {
  let acumulado = 0;
  for (const m of mesociclos) {
    if (semana >= acumulado && semana < acumulado + m.semanas) return m;
    acumulado += m.semanas;
  }
  return null;
}

/** La clave de una celda del calendario. Una sola forma, en un solo sitio. */
export const claveDia = (semana: number, dia: number): string => `${semana}:${dia}`;

/** Índice de días por `semana:dia`, para pintar la rejilla sin recorrerla. */
export function indiceDias(dias: readonly DiaPlan[]): Map<string, DiaPlan> {
  return new Map(dias.map((d) => [claveDia(d.semana, d.dia), d]));
}

// ════════════════════════════════════════════════════════════════════════════
// CAMBIAR EL TAMAÑO
// ════════════════════════════════════════════════════════════════════════════

/**
 * Lleva el contenido a `semanas` columnas, conservando lo que cabe.
 *
 * AL CRECER se añaden nulos al final: las semanas nuevas están vacías, no
 * copian a la última. AL ENCOGER se recorta por el final, y lo que se pierde
 * se puede consultar antes con `loQueSePierde` — borrar semanas de trabajo sin
 * avisar es la clase de sorpresa que hace desconfiar de una herramienta.
 *
 * Los mesociclos se recortan en cascada: el que quede a medias pierde solo las
 * semanas que sobran, y el que quede entero fuera desaparece.
 */
export function redimensionar(
  contenido: ContenidoMacrociclo,
  semanas: number,
): ContenidoMacrociclo {
  const n = Math.min(MAX_SEMANAS, Math.max(MIN_SEMANAS, Math.trunc(semanas)));

  const filas = contenido.filas.map((f) => ({
    ...f,
    valores: Array.from({ length: n }, (_, i) => f.valores[i] ?? null),
  }));

  return {
    bandas: contenido.bandas.map((b) => ({ ...b, tramos: recortarTramos(b.tramos, n) })),
    mesociclos: recortarTramos(contenido.mesociclos, n),
    // Al crecer, las semanas nuevas salen sin nada decidido; al encoger se
    // recortan por el final, igual que las celdas.
    semanas: Array.from({ length: n }, (_, i) => contenido.semanas[i] ?? semanaVacia()),
    competencias: contenido.competencias.filter((c) => c.semana < n),
    filas,
    dias: contenido.dias.filter((d) => d.semana < n),
  };
}

/**
 * Recorta una lista de tramos contiguos para que quepa en `n` semanas.
 *
 * En cascada: el que queda a medias pierde solo lo que sobra y el que queda
 * entero fuera desaparece. Una sola función para mesociclos y bandas, porque
 * dos copias de esta cascada acabarían recortando distinto.
 */
function recortarTramos<T extends { semanas: number }>(tramos: readonly T[], n: number): T[] {
  const salida: T[] = [];
  let acumulado = 0;
  for (const t of tramos) {
    if (acumulado >= n) break;
    const cabe = Math.min(t.semanas, n - acumulado);
    salida.push({ ...t, semanas: cabe });
    acumulado += cabe;
  }
  return salida;
}

/** Qué se perdería al encoger a `semanas`. Se pregunta ANTES de encoger. */
export function loQueSePierde(
  contenido: ContenidoMacrociclo,
  semanas: number,
): { celdas: number; dias: number; mesociclos: number; competencias: number } {
  const n = Math.max(MIN_SEMANAS, Math.trunc(semanas));

  let celdas = 0;
  for (const f of contenido.filas) {
    for (let i = n; i < f.valores.length; i++) {
      if (f.valores[i] !== null && f.valores[i] !== '') celdas++;
    }
  }

  let acumulado = 0;
  let mesociclos = 0;
  for (const m of contenido.mesociclos) {
    if (acumulado >= n) mesociclos++;
    acumulado += m.semanas;
  }

  return {
    celdas,
    dias: contenido.dias.filter((d) => d.semana >= n).length,
    mesociclos,
    competencias: contenido.competencias.filter((c) => c.semana >= n).length,
  };
}

// ════════════════════════════════════════════════════════════════════════════
// EDICIONES
// ════════════════════════════════════════════════════════════════════════════

/** Escribe una celda. Devuelve contenido nuevo: nada se muta. */
export function escribirCelda(
  contenido: ContenidoMacrociclo,
  filaId: string,
  semana: number,
  valor: string | null,
): ContenidoMacrociclo {
  return {
    ...contenido,
    filas: contenido.filas.map((f) => {
      if (f.id !== filaId) return f;
      // Fuera de rango se ignora en vez de alargar la fila: alargarla rompería
      // la invariante 1 en silencio, y el fallo aparecería tres pantallas
      // después, al exportar.
      if (semana < 0 || semana >= f.valores.length) return f;
      const valores = [...f.valores];
      valores[semana] = valor === '' ? null : valor;
      return { ...f, valores };
    }),
  };
}

/**
 * Colores disponibles para dibujar una fila en la curva.
 *
 * El azul y el rojo van primero porque son los del plan gráfico clásico
 * —volumen y carga— y quien lleva años leyendo estos cuadros los reconoce
 * antes que la leyenda. Los otros cuatro son para un tercer o cuarto renglón.
 */
export const COLORES_CURVA: readonly string[] = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#f59e0b',
  '#a855f7',
  '#14b8a6',
];

/**
 * Mete o saca una fila de la curva.
 *
 * Sin color, elige el primero que no esté en uso: dos líneas del mismo color
 * son dos líneas que no se distinguen, y el entrenador tendría que ir a
 * buscar un selector para arreglar algo que el sistema podía evitar. Si se
 * acaban los colores se reutiliza el primero, que es peor que un color libre
 * y mejor que negarse a dibujar.
 */
export function alternarGrafico(
  contenido: ContenidoMacrociclo,
  filaId: string,
  color?: string,
): ContenidoMacrociclo {
  const fila = contenido.filas.find((f) => f.id === filaId);
  if (fila === undefined) return contenido;

  let siguiente: string | null;
  if (color !== undefined) {
    siguiente = color;
  } else if (fila.grafico !== null) {
    siguiente = null;
  } else {
    const usados = new Set(
      contenido.filas.filter((f) => f.id !== filaId && f.grafico !== null).map((f) => f.grafico),
    );
    siguiente = COLORES_CURVA.find((c) => !usados.has(c)) ?? COLORES_CURVA[0];
  }

  return {
    ...contenido,
    filas: contenido.filas.map((f) => (f.id === filaId ? { ...f, grafico: siguiente } : f)),
  };
}

/**
 * Cambia cómo se lee una fila: texto, marca, número o porcentaje.
 *
 * LOS VALORES NO SE CONVIERTEN. Pasar «Fuerza» de marca a porcentaje deja las
 * `X` escritas tal cual; la curva simplemente no las leerá como puntos hasta
 * que se escriban números encima.
 *
 * Convertirlas —una `X` a 100, pongamos— inventaría una cifra que nadie ha
 * escrito, que es la regla que sostiene el subsistema entero.
 */
export function cambiarTipoFila(
  contenido: ContenidoMacrociclo,
  filaId: string,
  tipo: TipoFila,
  unidad?: string,
): ContenidoMacrociclo {
  return {
    ...contenido,
    filas: contenido.filas.map((f) =>
      f.id === filaId ? { ...f, tipo, unidad: unidad !== undefined ? unidad : f.unidad } : f,
    ),
  };
}

/** Asigna (o quita) la plantilla y la etiqueta de un día. */
export function escribirDia(
  contenido: ContenidoMacrociclo,
  semana: number,
  dia: number,
  cambio: { plantillaId?: string | null; etiqueta?: string | null },
): ContenidoMacrociclo {
  const resto = contenido.dias.filter((d) => !(d.semana === semana && d.dia === dia));
  const previo = contenido.dias.find((d) => d.semana === semana && d.dia === dia);

  const siguiente: DiaPlan = {
    semana,
    dia,
    plantillaId: cambio.plantillaId !== undefined ? cambio.plantillaId : (previo?.plantillaId ?? null),
    etiqueta: cambio.etiqueta !== undefined ? cambio.etiqueta : (previo?.etiqueta ?? null),
  };

  // Un día sin plantilla y sin etiqueta no es un día: es una celda vacía, y
  // guardarla llenaría el documento de registros que no dicen nada.
  if (siguiente.plantillaId === null && (siguiente.etiqueta === null || siguiente.etiqueta === '')) {
    return { ...contenido, dias: resto };
  }

  return { ...contenido, dias: [...resto, siguiente] };
}

/**
 * Cambia la longitud de un mesociclo SIN mover el total de semanas.
 *
 * Lo que gana uno lo pierde el siguiente. Si no hay siguiente, no se puede
 * crecer: hacerlo empujaría el mesociclo fuera del macrociclo, que es
 * exactamente la incoherencia que la invariante 2 impide.
 */
export function redimensionarMesociclo(
  contenido: ContenidoMacrociclo,
  mesocicloId: string,
  semanas: number,
): ContenidoMacrociclo {
  return { ...contenido, mesociclos: ajustarContiguo(contenido.mesociclos, mesocicloId, semanas) };
}

/** Cambia el nombre de un mesociclo. Vacío se ignora: un nombre en blanco no es un nombre. */
export function renombrarMesociclo(
  contenido: ContenidoMacrociclo,
  mesocicloId: string,
  nombre: string,
): ContenidoMacrociclo {
  const limpio = nombre.trim();
  if (limpio === '') return contenido;
  return {
    ...contenido,
    mesociclos: contenido.mesociclos.map((m) =>
      m.id === mesocicloId ? { ...m, nombre: limpio } : m,
    ),
  };
}

// ════════════════════════════════════════════════════════════════════════════
// LA SEMANA Y SUS COMPETENCIAS  (Sprint MAC-3)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Escribe los atributos de una semana: tipo de microciclo, sesiones, horas,
 * días de entrenamiento y de descanso.
 *
 * Fuera de rango se ignora, igual que al escribir una celda: alargar la lista
 * rompería en silencio la invariante de que hay exactamente una entrada por
 * semana, y el fallo aparecería al exportar, tres pantallas después.
 */
export function escribirSemana(
  contenido: ContenidoMacrociclo,
  semana: number,
  cambio: Partial<SemanaPlan>,
): ContenidoMacrociclo {
  if (semana < 0 || semana >= contenido.semanas.length) return contenido;
  const semanas = [...contenido.semanas];
  semanas[semana] = { ...semanas[semana], ...cambio };
  return { ...contenido, semanas };
}

/** Añade o reemplaza una competencia. Sin id, se crea una nueva. */
export function escribirCompetencia(
  contenido: ContenidoMacrociclo,
  entrada: Omit<Competencia, 'id'> & { id?: string },
): ContenidoMacrociclo {
  const nombre = entrada.nombre.trim();
  // Una competencia sin nombre no es una competencia: es una celda pulsada
  // sin querer, y guardarla pintaría una marca que no significa nada.
  if (nombre === '') return contenido;

  const c: Competencia = {
    id: entrada.id ?? nuevoId(),
    semana: entrada.semana,
    nombre,
    categoria: entrada.categoria,
    ambito: entrada.ambito,
  };

  const resto = contenido.competencias.filter((x) => x.id !== c.id);
  return { ...contenido, competencias: [...resto, c] };
}

export function borrarCompetencia(
  contenido: ContenidoMacrociclo,
  id: string,
): ContenidoMacrociclo {
  return { ...contenido, competencias: contenido.competencias.filter((c) => c.id !== id) };
}

/** Las competencias de cada semana, indexadas para pintar sin recorrer. */
export function indiceCompetencias(
  competencias: readonly Competencia[],
): Map<number, Competencia[]> {
  const m = new Map<number, Competencia[]>();
  for (const c of competencias) {
    const lista = m.get(c.semana);
    if (lista === undefined) m.set(c.semana, [c]);
    else lista.push(c);
  }
  return m;
}

/**
 * Cambia la longitud de un tramo de una banda, robándoselo al siguiente.
 *
 * Misma regla que en los mesociclos y por la misma razón: el total de semanas
 * del macrociclo no lo decide una banda, así que crecer sin vecino sacaría el
 * tramo fuera del plan.
 */
export function redimensionarTramo(
  contenido: ContenidoMacrociclo,
  bandaId: string,
  tramoId: string,
  semanas: number,
): ContenidoMacrociclo {
  return {
    ...contenido,
    bandas: contenido.bandas.map((b) =>
      b.id === bandaId ? { ...b, tramos: ajustarContiguo(b.tramos, tramoId, semanas) } : b,
    ),
  };
}

/** Cambia el nombre de un tramo de una banda. Vacío se ignora, igual que en un mesociclo. */
export function renombrarTramo(
  contenido: ContenidoMacrociclo,
  bandaId: string,
  tramoId: string,
  nombre: string,
): ContenidoMacrociclo {
  const limpio = nombre.trim();
  if (limpio === '') return contenido;
  return {
    ...contenido,
    bandas: contenido.bandas.map((b) =>
      b.id === bandaId
        ? { ...b, tramos: b.tramos.map((t) => (t.id === tramoId ? { ...t, nombre: limpio } : t)) }
        : b,
    ),
  };
}

/**
 * Sustituye los mesociclos que caen en `[inicio, inicio + semanas)` por los de
 * un modelo, sin tocar nada fuera de ese tramo.
 *
 * ── ESTO ES LO QUE HACE POSIBLE COMBINAR DOS MODELOS EN UN MACROCICLO ────
 *
 *   `sembrarConModelo` sustituye TODOS los mesociclos del plan. Para que un
 *   periodo lleve ATR y el siguiente Clásico hace falta tocar solo el tramo
 *   de ese periodo — el resto del plan, con lo que el entrenador ya haya
 *   escrito en él, se queda exactamente como estaba.
 *
 *   Un mesociclo que caía a caballo de un borde del rango se recorta, no se
 *   rompe: la parte que queda FUERA del rango conserva su nombre, su color y
 *   sus notas, y solo desaparece la parte que estaba DENTRO, que es la que se
 *   sustituye.
 *
 *   `modeloId: null` no aplica ningún modelo: vacía el rango y lo deja «sin
 *   asignar», que es como se ve cualquier semana sin mesociclo. Es la forma
 *   de deshacer una asignación anterior sin inventar un mesociclo de relleno.
 */
export function aplicarModeloEnRango(
  contenido: ContenidoMacrociclo,
  inicio: number,
  semanas: number,
  modeloId: string | null,
): ContenidoMacrociclo {
  const ini = Math.max(0, Math.trunc(inicio));
  const n = Math.max(1, Math.trunc(semanas));
  const fin = ini + n;

  let nuevos: Mesociclo[] = [];
  if (modeloId !== null) {
    const modelo = modeloDe(modeloId);
    if (modelo === null) return contenido;
    nuevos = mesociclosDelModelo(modelo.id, n, nuevoId);
  }

  const antes: Mesociclo[] = [];
  const despues: Mesociclo[] = [];
  let acumulado = 0;
  for (const m of contenido.mesociclos) {
    const inicioM = acumulado;
    const finM = acumulado + m.semanas;
    acumulado = finM;

    if (finM <= ini) {
      antes.push(m);
      continue;
    }
    if (inicioM >= fin) {
      despues.push(m);
      continue;
    }
    // Se solapa con el rango: lo de fuera se conserva, recortado.
    const sobranteAntes = Math.max(0, ini - inicioM);
    const sobranteDespues = Math.max(0, finM - fin);
    if (sobranteAntes > 0) antes.push({ ...m, semanas: sobranteAntes });
    if (sobranteDespues > 0) {
      // Si el mismo mesociclo también dejó un trozo ANTES, esto no es un
      // recorte: es una partición en dos, y las dos mitades no pueden
      // compartir id sin romper la invariante 3.
      despues.push({ ...m, id: sobranteAntes > 0 ? nuevoId() : m.id, semanas: sobranteDespues });
    }
  }

  return { ...contenido, mesociclos: [...antes, ...nuevos, ...despues] };
}

/**
 * El ajuste contiguo: lo que gana uno lo pierde el siguiente.
 *
 * Una sola implementación para mesociclos y bandas. Cuando esto vivía dos
 * veces, arreglar el caso del último tramo en una copia dejaba la otra
 * permitiendo que creciera fuera del plan.
 */
function ajustarContiguo<T extends { id: string; semanas: number }>(
  tramos: readonly T[],
  id: string,
  semanas: number,
): T[] {
  const i = tramos.findIndex((t) => t.id === id);
  if (i === -1) return [...tramos];

  const objetivo = Math.max(1, Math.trunc(semanas));
  const delta = objetivo - tramos[i].semanas;
  if (delta === 0) return [...tramos];

  const salida = [...tramos];
  const siguiente = salida[i + 1];

  if (siguiente === undefined) {
    // Sin vecino solo se puede encoger; lo liberado queda descubierto, que es
    // un estado legítimo y visible.
    if (delta > 0) return salida;
    salida[i] = { ...salida[i], semanas: objetivo };
    return salida;
  }

  const nuevoSiguiente = siguiente.semanas - delta;
  if (nuevoSiguiente < 1) return salida;

  salida[i] = { ...salida[i], semanas: objetivo };
  salida[i + 1] = { ...siguiente, semanas: nuevoSiguiente };
  return salida;
}

// ════════════════════════════════════════════════════════════════════════════
// AUDITORÍA
// ════════════════════════════════════════════════════════════════════════════

/**
 * Qué está mal en este contenido. Lista vacía = coherente.
 *
 * Se comprueba al guardar y en un test. Un documento incoherente que llega a
 * la base de datos se arrastra para siempre, porque a partir de ahí cada
 * lectura lo da por bueno.
 */
export function problemasDe(contenido: ContenidoMacrociclo, semanas: number): string[] {
  const problemas: string[] = [];

  for (const f of contenido.filas) {
    if (f.valores.length !== semanas) {
      problemas.push(
        `La fila «${f.nombre}» tiene ${f.valores.length} valores y el macrociclo ${semanas} semanas.`,
      );
    }
  }

  // La lista de semanas es la invariante 1 aplicada a los atributos de la
  // semana: sin ella, la última semana del plan da `undefined` al pintarla.
  if (contenido.semanas.length !== semanas) {
    problemas.push(
      `Hay ${contenido.semanas.length} entradas de semana y el macrociclo tiene ${semanas}.`,
    );
  }

  for (const b of contenido.bandas) {
    const suma = semanasCubiertas(b.tramos);
    if (suma > semanas) {
      problemas.push(
        `La banda «${b.nombre}» suma ${suma} semanas y el macrociclo solo tiene ${semanas}.`,
      );
    }
    for (const t of b.tramos) {
      if (t.semanas < 1) {
        problemas.push(`El tramo «${t.nombre}» de «${b.nombre}» no ocupa ninguna semana.`);
      }
    }
  }

  for (const c of contenido.competencias) {
    if (c.semana < 0 || c.semana >= semanas) {
      problemas.push(`La competencia «${c.nombre}» cae en la semana ${c.semana + 1}, fuera del plan.`);
    }
  }

  const cubiertas = semanasCubiertas(contenido.mesociclos);
  if (cubiertas > semanas) {
    problemas.push(
      `Los mesociclos suman ${cubiertas} semanas y el macrociclo solo tiene ${semanas}.`,
    );
  }

  for (const m of contenido.mesociclos) {
    if (m.semanas < 1) problemas.push(`El mesociclo «${m.nombre}» no ocupa ninguna semana.`);
  }

  for (const d of contenido.dias) {
    if (d.semana < 0 || d.semana >= semanas) {
      problemas.push(`Hay un día en la semana ${d.semana + 1}, fuera del macrociclo.`);
    }
    if (d.dia < 0 || d.dia > 6) problemas.push(`Hay un día con índice ${d.dia}, fuera de la semana.`);
  }

  // La invariante 3 abarca TODO lo que se direcciona por id. Reciclar uno
  // haría que un dato viejo apareciera en un sitio nuevo, y la rejilla usa el
  // id como clave de React: dos iguales y el navegador pinta uno solo.
  const ids = [
    ...contenido.filas.map((f) => f.id),
    ...contenido.mesociclos.map((m) => m.id),
    ...contenido.bandas.map((b) => b.id),
    ...contenido.bandas.flatMap((b) => b.tramos.map((t) => t.id)),
    ...contenido.competencias.map((c) => c.id),
  ];
  if (new Set(ids).size !== ids.length) {
    problemas.push('Hay identificadores repetidos en el documento.');
  }

  const claves = contenido.dias.map((d) => claveDia(d.semana, d.dia));
  if (new Set(claves).size !== claves.length) {
    problemas.push('Hay más de una entrada para el mismo día.');
  }

  return problemas;
}

/** Las plantillas distintas que usa el plan, en el orden en que aparecen. */
export function plantillasUsadas(contenido: ContenidoMacrociclo): string[] {
  const vistas = new Set<string>();
  const orden = [...contenido.dias].sort(
    (a, b) => a.semana - b.semana || a.dia - b.dia,
  );
  for (const d of orden) {
    if (d.plantillaId !== null) vistas.add(d.plantillaId);
  }
  return [...vistas];
}
