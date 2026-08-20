// ── Resultado humano · contratos (Sprint PAS-8) ────────────────────────────
//
// LA FRONTERA QUE ESTE FICHERO DEFINE:
//
//   Por debajo hay ciencia: normas, percentiles, EQ-3, ES-2, TN-1, TN-2. Por
//   encima hay un atleta que quiere saber cómo está. Este modelo es lo que
//   cruza de un lado al otro, y su regla es simple:
//
//     **transporta, no recalcula.**
//
//   Cada campo de aquí procede de algo que otra capa ya decidió. Si un valor
//   no puede transportarse porque nadie lo calculó, se declara ausente — jamás
//   se deriva aquí para rellenar el hueco.
//
// LOS TRES EJES NO SE MEZCLAN (§8 del encargo). Un resultado puede compararse
// con una población, con su propio pasado y con un objetivo declarado. Son
// preguntas distintas y viajan en campos distintos, porque confundirlas es el
// error más caro que puede cometer este producto: presentar «mejoraste 4 kg»
// como si fuera «estás por encima de tu población», o convertir «cumpliste tu
// objetivo» en una categoría normativa que nadie publicó.

import type { ConflictoDeclarado } from '@/lib/nie';
import type { InterpretacionResultado } from '@/lib/pas/interpretacion';
import type { LecturaEvidencia } from '@/lib/pas/evidencia';
import type { MotivoSinProgreso, PosicionRango, SerieLongitudinal } from '@/lib/pas/seguimiento';

import type { EstadoObjetivo, ObjetivoAtleta, TipoObjetivo } from './objetivos';

export type Prioridad = 'alta' | 'media' | 'baja';

/**
 * Qué puede decirse de la comparación con una población.
 *
 * Los seis estados del §7 del encargo, sin colapsar. `SIN_REFERENCIA` y
 * `NO_DETERMINABLE` son especialmente distintos: el primero dice que la NKB no
 * publica nada compatible, el segundo que no sabemos si lo publica porque
 * falta un dato del método.
 */
export type EstadoReferencia =
  /** Hay una norma compatible y produjo una lectura. */
  | 'DISPONIBLE'
  /** Ninguna norma de la base corresponde a este perfil, o no cubre la variable. */
  | 'SIN_REFERENCIA'
  /** Hay normas de la variable, pero el método no es equivalente (EQ-3, unidad). */
  | 'NO_COMPARABLE'
  /** No se sabe si alguna corresponde: falta declarar cómo se midió. */
  | 'NO_DETERMINABLE';

/** Qué clase de comparación publicó la fuente. Sin traducir una en otra. */
export type ClaseReferencia = 'percentil' | 'intervalo' | 'fuera_de_rango' | 'distancia_media';

export interface ReferenciaNormativa {
  estado: EstadoReferencia;
  /** `null` salvo cuando `estado` es `DISPONIBLE`. */
  clase: ClaseReferencia | null;
  /**
   * La lectura corta, ya redactada: `P50`, `entre P90 y P97`, `z = +1,25`.
   *
   * Viene de `report-v2`, que la compuso desde el resultado del NIE. Aquí no
   * se formatea nada.
   */
  resumen: string | null;
  /** La frase completa. Describe dónde cae el valor, nunca qué significa. */
  explicacion: string | null;
  /** `Colombia · Varones · 22 años`, para saber contra quién se compara. */
  poblacion: string | null;
  /** Nombre legible del instrumento. El código va en los detalles técnicos. */
  metodo: string | null;
}

/**
 * Cómo cambió respecto a la medición anterior del propio atleta.
 *
 * **No es una comparación normativa.** Subir 4 kg no dice nada sobre la
 * población: dice algo sobre esta persona, que es otra pregunta y a menudo la
 * que más le importa.
 *
 * Solo se compara lo comparable: misma prueba, misma unidad y mismo método.
 * Dos mediciones con dinamómetros distintos no forman una tendencia, igual que
 * no formarían una comparación normativa (EQ-3).
 */
export interface Tendencia {
  disponible: boolean;
  valorAnterior: number | null;
  fechaAnterior: string | null;
  valorActual: number;
  fechaActual: string;
  /** Diferencia absoluta, en la unidad de la medición. `null` si no hay par. */
  cambioAbsoluto: number | null;
  /**
   * Cambio relativo, de 0 a 1. `null` cuando el anterior era cero — dividir
   * por él daría infinito, y un «+∞ %» no informa de nada.
   */
  cambioRelativo: number | null;
  /** Por qué no hay tendencia, cuando no la hay. Literal, para mostrar. */
  motivo: string | null;
}

/** Cómo se relaciona con un objetivo declarado. Nunca una categoría normativa. */
export interface RelacionObjetivo {
  disponible: boolean;
  objetivo: ObjetivoAtleta | null;
  /**
   * De 0 a 1, o `null` cuando no puede calcularse sin inventar una fórmula.
   * Ver `calcularProgreso`: la ausencia es deliberada, no una carencia.
   */
  progreso: number | null;
  /**
   * El objetivo se rebasó (PAS-10).
   *
   * `progreso` se acota a 1 porque una barra al 130 % se lee como un error,
   * pero haber ido más allá es información y no debe perderse en el tope.
   */
  superado: boolean;
  /**
   * Dónde cae el valor respecto al rango, en los objetivos de mantenimiento
   * (PAS-10 §13). `null` en todos los demás.
   *
   * Va en un campo aparte de `progreso` porque no es lo mismo: mantenerse
   * dentro de un rango no es haber recorrido una fracción de nada, y meterlo en
   * el mismo número obligaría a inventar a qué porcentaje equivale «dentro».
   */
  mantenimiento: PosicionRango | null;
  /**
   * Por qué no hay progreso calculable, en forma de código (PAS-10).
   *
   * PAS-8 solo dejaba el texto, y quien quisiera actuar sobre el motivo tenía
   * que reconocerlo por subcadenas. Los seis casos son distintos entre sí —
   * «falta el punto de partida» no es «el objetivo contradice la prueba»— y
   * colapsarlos en una frase impedía distinguirlos aguas arriba.
   */
  motivoCodigo: MotivoSinProgreso | null;
  /** Por qué no hay progreso calculable. Se muestra en vez del porcentaje. */
  motivo: string | null;
}

/**
 * Lo que la ciencia dice, para quien quiera verlo.
 *
 * No se elimina nada: se reubica. Todo lo que antes contaminaba la tarjeta
 * principal —`P-03`, `TN-1`, `ES-2`, el n de celda, la calidad— vive aquí.
 */
export interface DetallesTecnicos {
  pruebaId: string;
  normaId: string | null;
  tipoNorma: string | null;
  instrumento: string | null;
  poblacion: string | null;
  nCelda: number | null;
  calidad: string | null;
  estadoNorma: string | null;
  conflicto: ConflictoDeclarado | null;
  unidad: string | null;
  referencia: string | null;
  /** El motivo íntegro que redactó el NIE. Sin acortar. */
  motivo: string | null;
  /** Advertencias de la ficha, literales. */
  advertencias: readonly string[];
  /** Por qué se descartaron las demás normas, agrupado. */
  descartes: readonly { naturaleza: string; motivo: string; total: number }[];
}

/**
 * Un resultado, tal como lo lee una persona.
 *
 * El orden de los campos es el orden de lectura del §14: nombre humano, valor,
 * unidad, y solo después el contexto.
 */
export interface ResultadoHumano {
  /** Id de la prueba. Presente para enlazar, no para mostrarlo. */
  pruebaId: string;
  /** «Dinamometría de agarre», no `P-03`. */
  nombre: string;
  /** «Producción de fuerza». Vacío si la prueba no contribuye a ninguna capacidad. */
  dominio: string | null;
  valorObservado: number;
  unidad: string;
  fecha: string;

  referencia: ReferenciaNormativa;
  tendencia: Tendencia;
  objetivo: RelacionObjetivo;

  /**
   * Qué evidencia existe para esta prueba y qué autoriza a afirmar (PAS-10E.1).
   *
   * Se calcula SIEMPRE, tenga o no norma la prueba, porque su respuesta más
   * valiosa es precisamente la que da cuando no hay norma: distingue «falta el
   * peso del atleta» de «falta declarar el protocolo» de «la referencia es de
   * escolares» de «no hay literatura». El informe venía colapsando las cuatro.
   */
  evidencia: LecturaEvidencia;

  /**
   * Quién responde al eje normativo de esta tarjeta.
   *
   * LA REGLA DE PRECEDENCIA, resuelta aquí y no en el componente: **donde la
   * NKB tiene cobertura, manda la NKB**. Su procedimiento de admisión es más
   * estricto que este registro de trabajo, y consultar los dos para la misma
   * pregunta produciría dos respuestas para el mismo dato — que es exactamente
   * lo que pasaba con P-03, comparada por la NKB y declarada «sin evidencia»
   * por la capa nueva en la misma tarjeta.
   *
   * La capa de evidencia cubre lo que la NKB no alcanza, que hoy son diez de
   * las once pruebas.
   */
  fuenteNormativa: 'nkb' | 'evidencia' | 'ninguna';

  /**
   * Todo el historial comparable de esta prueba, no solo el par anterior→actual
   * (PAS-10).
   *
   * `tendencia` responde «¿cambió desde la última vez?». La serie responde «¿qué
   * ha pasado con esta variable?», que es otra pregunta y a menudo la que
   * importa. Las dos salen del mismo cálculo, así que no pueden contradecirse.
   *
   * Viene partida en tramos: un cambio de método o de unidad no continúa la
   * línea, la corta, y la ruptura se declara en vez de disimularse.
   */
  serie: SerieLongitudinal;

  /**
   * Interpretación profesional, un eje por campo (PAS-9).
   *
   * PAS-8 dejó aquí un hueco a propósito. Lo llena el motor de reglas de
   * PAS-9, que es determinista: cada frase sale de una plantilla escrita a
   * mano y ninguna clasifica.
   *
   * `texto` es la lectura corrida de los tres ejes, para donde solo quepa una
   * línea. Los límites de cada afirmación viajan en `porEje` — es donde vive
   * lo que NO puede afirmarse, y eso no se resume.
   */
  interpretacion: {
    disponible: boolean;
    texto: string | null;
    porEje: InterpretacionResultado;
  };

  detalles: DetallesTecnicos;
}

/** Un dominio con sus resultados, para el resumen de cabecera. */
export interface GrupoDominio {
  id: string;
  nombre: string;
  resultados: readonly ResultadoHumano[];
  /** Cuántos tienen referencia normativa utilizable. */
  conReferencia: number;
}

/**
 * Los objetivos del atleta, clasificados (PAS-10 §9).
 *
 * ATENCIÓN A LA NATURALEZA DE ESTAS LISTAS: `activos`, `alcanzados` y
 * `pausados` SON una partición por estado —ningún objetivo cae en dos—, pero
 * `sinDatos` y `sinPuntoDePartida` son VISTAS sobre `activos`: el mismo
 * objetivo puede aparecer en las dos, y sumar las cinco cifras contaría de más.
 *
 * Se declara aquí porque la diferencia no se ve en el tipo y equivocarse
 * produce un resumen que miente sin que nada falle.
 *
 * Los objetivos abandonados no tienen lista: el profesional los retiró, y
 * seguir mostrándolos convertiría una decisión suya en ruido permanente.
 */
export interface PanelObjetivos {
  /** Vigentes. */
  activos: readonly ObjetivoAtleta[];
  /** Marcados como cumplidos por el profesional. No lo decide el sistema. */
  alcanzados: readonly ObjetivoAtleta[];
  pausados: readonly ObjetivoAtleta[];
  /** Activos sin ninguna medición compatible en esta evaluación (§23). */
  sinDatos: readonly ObjetivoAtleta[];
  /** Activos que no declaran desde dónde se partía (§12). */
  sinPuntoDePartida: readonly ObjetivoAtleta[];
  /** Pruebas con más de un objetivo activo. No se elige entre ellos (§25). */
  enConflicto: readonly { pruebaId: string; objetivos: readonly ObjetivoAtleta[] }[];
}

/** Qué falta para poder decir más. Nunca un juicio sobre el atleta. */
export type CodigoAlerta =
  | 'METODO_SIN_DECLARAR'
  | 'OBJETIVO_SIN_PUNTO_DE_PARTIDA'
  | 'SERIE_INTERRUMPIDA'
  | 'OBJETIVOS_EN_CONFLICTO';

export interface Alerta {
  codigo: CodigoAlerta;
  /** Frase ya redactada, en primera lectura. */
  texto: string;
  /** A cuántos resultados u objetivos afecta. */
  total: number;
}

/**
 * La cabecera del informe (PAS-10 §22).
 *
 * SOLO CUENTAS COMPROBABLES. Ninguna de estas cifras resume el rendimiento del
 * atleta en un número: no hay puntuación global, ni media de percentiles, ni
 * «nivel». Eso exigiría ponderar pruebas entre sí, y nadie ha publicado esos
 * pesos — inventarlos aquí sería crear una clasificación por la puerta de atrás.
 *
 * Lo que sí puede decirse es cuánto se midió y cuánto de eso pudo compararse,
 * que es exactamente lo que un profesional necesita ver antes de bajar al
 * detalle.
 */
export interface ResumenAtleta {
  /** Pruebas distintas medidas. NO es el número de tarjetas: una medición con
   *  dos normas comparables produce dos resultados y una sola prueba. */
  pruebasEvaluadas: number;
  resultados: number;
  conReferencia: number;
  /** Resultados con una medición anterior comparable. */
  conEvolucion: number;
  objetivosActivos: number;
  objetivosAlcanzados: number;
  alertas: readonly Alerta[];
}

/** Lo que la ruta entrega a la vista. */
export interface InformeHumano {
  atleta: { nombre: string; edad: number | null; sexo: string | null };
  fecha: string;
  codigo: string;

  /** Todos los resultados, en el orden en que se registraron. */
  resultados: readonly ResultadoHumano[];
  /** Los mismos, agrupados por dominio. Es una vista, no una selección. */
  dominios: readonly GrupoDominio[];
  /** Objetivos activos del atleta, tengan o no medición en esta evaluación. */
  objetivos: readonly ObjetivoAtleta[];
  /** Los mismos y los demás, clasificados por estado y por lo que les falta. */
  panelObjetivos: PanelObjetivos;
  /** Las cuentas de cabecera. Ninguna resume el rendimiento en una cifra. */
  resumen: ResumenAtleta;

  /** Frase de cabecera sobre qué evidencia hubo. Sin juicio. */
  estadoGeneral: string;
  /** Advertencias del conjunto, literales del NIE. */
  advertencias: readonly string[];
}

export type { EstadoObjetivo, ObjetivoAtleta, TipoObjetivo };
