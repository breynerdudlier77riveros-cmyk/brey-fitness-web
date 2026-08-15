// ── Del atleta al sujeto normativo (Sprint PRS-2.1) ────────────────────────
//
// Capa de APLICACIÓN. Traduce lo que el Workspace sabe del atleta a las
// coordenadas que el NIE necesita, y **declara lo que no sabe**.
//
// LA INCOMPATIBILIDAD QUE ESTE MÓDULO NO OCULTA:
//
//   `pas_atletas` guarda `fecha_nacimiento`, y nada más de la identidad del
//   sujeto. No guarda sexo, ni país, ni estatura. El NIE exige sexo y país como
//   coordenadas obligatorias, porque todas las normas de prensión de la NKB
//   estratifican por sexo y ninguna cubre a una población que no sea la suya.
//
//   `Profile` sí tiene sexo y altura, pero describe al PROFESIONAL que evalúa,
//   no al atleta evaluado. Tomarlos de ahí normalizaría la fuerza de un atleta
//   de veinte años contra las normas del sexo y la edad de quien lo mide.
//
// Por eso este módulo NO rellena esos campos desde ninguna parte. Devuelve un
// sujeto incompleto que nombra lo que falta, y la pantalla lo dice. El día que
// `pas_atletas` declare el sexo, cambia la lectura, no el contrato.

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
export function resolverSujeto(atleta: Atleta, hoyISO: string): ResolucionSujeto {
  const edad =
    atleta.fechaNacimiento === null ? null : edadEnAnios(atleta.fechaNacimiento, hoyISO);

  // Ni `sexo`, ni `pais`, ni `estaturaM` tienen origen en el Workspace. Van a
  // `null` porque no se saben, no porque no importen.
  const sujeto: SujetoNormativo = { edad, sexo: null, estaturaM: null, pais: null };

  const ausentes = IMPRESCINDIBLES.filter((c) => {
    if (c === 'edad') return sujeto.edad === null;
    if (c === 'sexo') return sujeto.sexo === null;
    return sujeto.pais === null;
  });

  if (ausentes.length === 0) return { estado: 'COMPLETO', sujeto };
  return { estado: 'INCOMPLETO', sujeto, ausentes, detalle: DETALLE };
}
