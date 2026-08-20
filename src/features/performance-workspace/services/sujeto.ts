// ── Del atleta al sujeto normativo (Sprint PRS-2.1) ────────────────────────
//
// Capa de APLICACIÓN. Traduce lo que el Workspace sabe del atleta a las
// coordenadas que el NIE necesita, y **declara lo que no sabe**.
//
// DE DÓNDE SALE CADA COORDENADA (auditado en PRS-2.2):
//
//   edad      ← `pas_atletas.fecha_nacimiento`, derivada con la FECHA DE LA
//               EVALUACION (PAS-12), no con la de hoy
//   sexo      ← `pas_atletas.sexo`, en el vocabulario del NIE
//   pais      ← `pas_atletas.pais`, ISO-3166-1 alfa-2
//   estatura  ← `pas_atletas.estatura_cm`, convertida a metros
//
// Ninguna sale de `Profile`, y es deliberado: `Profile` describe al PROFESIONAL
// que evalúa, no al atleta evaluado. Tomar de ahí el sexo o la altura
// normalizaría la fuerza de un atleta de veinte años contra las normas del
// sexo y la edad de quien lo mide. La firma de `resolverSujeto` ni siquiera lo
// recibe, para que la tentación no exista.
//
// Lo que no consta viaja como `null`, nunca como valor por defecto: el NIE
// responde `NO_DETERMINABLE`, que es la verdad.

import type { SujetoNormativo } from '@/lib/pas/normativo';
import type { Atleta } from '../schemas/tipos';

/** Coordenada de identidad que el NIE necesita y el Workspace no registra. */
export type CoordenadaAusente = 'edad' | 'sexo' | 'pais' | 'estatura';

export type ResolucionSujeto =
  | { estado: 'COMPLETO'; sujeto: SujetoNormativo }
  | {
      estado: 'INCOMPLETO';
      /** El sujeto tal como se pudo construir. Los huecos van en `null`. */
      sujeto: SujetoNormativo;
      /** Qué falta, por nombre. La pantalla lo enumera sin adivinar. */
      ausentes: readonly CoordenadaAusente[];
      /** Explicación literal, para renderizar sin reescribir. */
      detalle: string;
    };

/**
 * Coordenadas sin las cuales el NIE no puede situar a nadie.
 *
 * `estatura` queda fuera a propósito: solo la estratifican las seis fichas
 * brasileñas, y su ausencia no impide comparar contra las demás. Exigirla
 * bloquearía casos que la evidencia sí permite resolver.
 */
const IMPRESCINDIBLES: readonly CoordenadaAusente[] = ['edad', 'sexo', 'pais'];

const DETALLE =
  'El expediente del atleta no registra todas las coordenadas que exige una comparación ' +
  'normativa. No se completan con los datos del profesional que evalúa ni con ningún valor ' +
  'por defecto: hacerlo compararía al atleta contra una población que no es la suya.';

/**
 * Años cumplidos entre dos fechas `yyyy-mm-dd`.
 *
 * `hoyISO` se recibe: ninguna capa de este proyecto lee el reloj por su cuenta.
 * Devuelve `null` ante cualquier fecha que no pueda leerse — una edad mal
 * derivada es peor que una edad ausente, porque la ausencia se ve.
 */
export function edadEnAnios(fechaNacimiento: string, hoyISO: string): number | null {
  const nac = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaNacimiento);
  const hoy = /^(\d{4})-(\d{2})-(\d{2})$/.exec(hoyISO);
  if (!nac || !hoy) return null;

  const [, an, mn, dn] = nac.map(Number) as unknown as [string, number, number, number];
  const [, ah, mh, dh] = hoy.map(Number) as unknown as [string, number, number, number];

  let edad = ah - an;
  if (mh < mn || (mh === mn && dh < dn)) edad -= 1;

  return edad >= 0 && edad < 130 ? edad : null;
}

/**
 * Resuelve el sujeto normativo de un atleta.
 *
 * No recibe el `Profile` del profesional, y es deliberado: si no lo tiene, no
 * puede caer en la tentación de usarlo. La firma es la garantía.
 */
export function resolverSujeto(atleta: Atleta, fechaReferencia: string): ResolucionSujeto {
  // LA FECHA DE REFERENCIA ES LA DE LA EVALUACION, NO LA DE HOY (PAS-12 §10).
  //
  // Antes llegaba `hoyISO`, y eso comparaba una medicion antigua contra las
  // normas de la edad que el atleta tiene AHORA. Las fichas de dinamometria de
  // la NKB estratifican por anios de uno en uno, asi que cumplir anios movia el
  // resultado a otra celda sin que nadie tocara el dato.
  //
  // Es el mismo error que G-01 con el peso: un dato del presente reinterpretando
  // una medicion del pasado.
  const edad =
    atleta.fechaNacimiento === null
      ? null
      : edadEnAnios(atleta.fechaNacimiento, fechaReferencia);

  const sujeto: SujetoNormativo = {
    edad,
    sexo: atleta.sexo,
    // Centímetros en la base, metros en el NIE. Es un cambio de escala dentro
    // de la MISMA magnitud, no una conversión entre unidades de las que el NIE
    // prohíbe: ahí lo prohibido es equiparar masa con fuerza (kg ↔ kgf), no
    // dividir una longitud por cien.
    estaturaM: atleta.estaturaCm === null ? null : atleta.estaturaCm / 100,
    pais: atleta.pais as SujetoNormativo['pais'],
  };

  const ausentes = IMPRESCINDIBLES.filter((c) => {
    if (c === 'edad') return sujeto.edad === null;
    if (c === 'sexo') return sujeto.sexo === null;
    return sujeto.pais === null;
  });

  if (ausentes.length === 0) return { estado: 'COMPLETO', sujeto };
  return { estado: 'INCOMPLETO', sujeto, ausentes, detalle: DETALLE };
}
