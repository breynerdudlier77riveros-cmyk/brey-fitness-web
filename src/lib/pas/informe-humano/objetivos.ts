// ── Objetivos del atleta (Sprint PAS-8) ────────────────────────────────────
//
// Contrato, no motor. Aquí se declara QUÉ es un objetivo y qué puede decirse
// de él; calcular el progreso de forma universal es otra cosa, y este módulo
// se niega a hacerlo. El porqué está más abajo, en `progresoDe`.
//
// Un objetivo pertenece al atleta y a una prueba concreta del catálogo. No es
// una norma: no describe una población, no tiene evidencia detrás y nadie lo
// publicó. Es lo que ese atleta y su profesional decidieron perseguir, y eso
// **jamás debe presentarse como una comparación normativa**.

import type { Prioridad } from './tipos';

export type TipoObjetivo =
  /** Llegar a un valor mayor: 1RM, salto, prensión. */
  | 'aumentar'
  /** Llegar a un valor menor: tiempo de sprint, tiempo de cambio de dirección. */
  | 'reducir'
  /** Acercarse a un valor, en cualquier dirección. */
  | 'alcanzar'
  /**
   * Quedarse donde se está, dentro de un rango declarado (PAS-10 §13).
   *
   * NO es «aumentar» con otro nombre, y convertirlo en eso silenciosamente es
   * justo lo que el encargo prohíbe: quien pide mantener el peso corporal entre
   * 63 y 67 kg no está pidiendo llegar a 67.
   *
   * Es además el único tipo que funciona sobre pruebas sin dirección de mejora
   * declarada —sit-and-reach, asimetría, FMS—, porque no necesita saber hacia
   * dónde se mejora: solo si el valor sigue dentro.
   */
  | 'mantener';

export type EstadoObjetivo = 'activo' | 'cumplido' | 'pausado' | 'abandonado';

/** El rango de un objetivo de mantenimiento. Ambos extremos son inclusivos. */
export interface RangoObjetivo {
  min: number;
  max: number;
}

export interface ObjetivoAtleta {
  id: string;
  atletaId: string;
  /** Prueba del catálogo con la que se mide. Nunca una capacidad abstracta. */
  pruebaId: string;
  tipo: TipoObjetivo;
  /** Texto que escribió el profesional. Se muestra tal cual. */
  nombre: string;

  /**
   * Valor de partida declarado al fijar el objetivo. `null` si no se declaró.
   *
   * Sigue siendo NULLABLE a propósito: sin punto de partida no hay recorrido
   * que medir, y rellenarlo con la primera medición del histórico inventaría
   * una decisión que el profesional no tomó.
   */
  valorInicial: number | null;
  /**
   * Cuándo se midió ese punto de partida (PAS-10 §8). `yyyy-mm-dd`.
   *
   * Un valor de partida sin fecha flota en el tiempo: no puede decirse si el
   * recorrido lleva un mes o tres años, y esa diferencia cambia por completo
   * cómo se lee el mismo porcentaje. `null` cuando no consta.
   */
  fechaPuntoDePartida: string | null;

  /**
   * El valor que se persigue. `null` SOLO en los objetivos de mantenimiento,
   * donde lo que se persigue es un rango y no un punto.
   */
  valorObjetivo: number | null;
  /** El rango a mantener. `null` salvo en `mantener` — y allí puede faltar. */
  rango: RangoObjetivo | null;

  unidad: string;
  prioridad: Prioridad;

  /**
   * Cuándo se fijó el objetivo (PAS-10 §8). `yyyy-mm-dd`.
   *
   * No es lo mismo que la fecha del punto de partida: un objetivo puede fijarse
   * hoy tomando como referencia una medición de hace seis meses. Sin esta fecha
   * no puede ordenarse la lista de objetivos ni decirse cuánto lleva vigente.
   */
  fechaInicio: string;
  /** `yyyy-mm-dd`. `null` = sin plazo. */
  fechaObjetivo: string | null;

  estado: EstadoObjetivo;
  notas: string | null;
}

/**
 * Lo que se persigue, ya redactado. `null` si el objetivo no lo declara.
 *
 * Existe para que ninguna vista tenga que decidir si mira `valorObjetivo` o
 * `rango`: esa bifurcación se resuelve una vez, aquí.
 */
export function metaDe(o: ObjetivoAtleta): string | null {
  if (o.tipo === 'mantener') {
    return o.rango === null ? null : `entre ${num(o.rango.min)} y ${num(o.rango.max)} ${o.unidad}`;
  }
  return o.valorObjetivo === null ? null : `${num(o.valorObjetivo)} ${o.unidad}`;
}

/** Coma decimal, sin ceros de relleno. Solo presentación. */
function num(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

// EL PROGRESO NO SE CALCULA AQUÍ, Y ANTES SÍ.
//
// PAS-8 tenía en este fichero un `progresoDe` que deducía la dirección del
// avance del `tipo` del objetivo. Funcionaba mientras el par inicial→objetivo
// estuviera bien puesto, y fallaba en silencio cuando no: nada impedía declarar
// «aumentar» sobre un esprint, y el porcentaje salía invertido justo cuando el
// atleta mejoraba.
//
// La dirección es una propiedad de la PRUEBA, no de la intención de quien fija
// el objetivo. Por eso ahora vive en el catálogo y el cálculo está en
// `@/lib/pas/seguimiento`, que además distingue los seis motivos por los que un
// avance puede no ser expresable. Este fichero se queda con lo que sí le
// corresponde: qué es un objetivo y cuál está activo.

/** El objetivo activo de una prueba, si lo hay. Nunca elige entre varios. */
export function objetivoDe(
  objetivos: readonly ObjetivoAtleta[],
  pruebaId: string,
): ObjetivoAtleta | null {
  const activos = objetivos.filter((o) => o.pruebaId === pruebaId && o.estado === 'activo');
  // Con más de uno no se elige: es una situación que el profesional debe
  // resolver, y quedarse con el primero ocultaría que declaró dos.
  return activos.length === 1 ? activos[0] : null;
}
