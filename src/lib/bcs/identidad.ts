// ── Identidad del sujeto y bloqueos de clasificación (Sprint BCS-7.0) ──────
//
// EL DEFECTO QUE CIERRA:
//
//   El informe decía, para las tres variables que no puede clasificar:
//
//     «Requiere sexo y edad del Cliente — ningún campo de Cliente ni Medición
//      los captura hoy.»
//
//   Era cierto cuando se escribió y ahora es falso: los campos existen. Pero
//   el problema de fondo no era que la frase envejeciera — es que **una sola
//   frase describía cuatro situaciones distintas**, y solo una de ellas es
//   accionable por quien lee el informe:
//
//     · Falta el sexo del cliente        → lo rellena el profesional, hoy.
//     · Falta la fecha de nacimiento     → lo rellena el profesional, hoy.
//     · Falta el dispositivo de la medición → se anota al medir.
//     · La fuente existe y falta cargarla   → no es culpa de nadie del otro
//                                             lado de la pantalla.
//
//   Es exactamente la distinción que el PAS hace entre `NO_DETERMINABLE` y
//   `SIN_EVIDENCIA_UTILIZABLE`: una cierra la puerta, la otra dice qué falta
//   para abrirla. Colapsarlas hace pedir al profesional un dato que ya tiene.
//
// LA EDAD SE CALCULA A LA FECHA DE LA MEDICIÓN, NUNCA A LA DE HOY.
//
//   Una medición de hace dos años se interpreta con la edad que el cliente
//   tenía ese día. Usar la de hoy metería a un cliente en la banda equivocada
//   y produciría una clasificación que parece correcta. Es el mismo error que
//   el PAS cerró en G-01 con la masa corporal por evaluación.
//
// Módulo puro: misma entrada, misma salida, siempre. No consulta el reloj.

import type { Cliente, Medicion } from '@/lib/bcs/tipos';
import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';

/** Lo que el informe sabe del cliente. `null` significa «no consta». */
export interface SujetoBCS {
  sexo: Cliente['sexo'];
  fechaNacimiento: string | null;
}

/** Sujeto sin ningún dato. Lo que se asume cuando nadie lo aporta. */
export const SUJETO_DESCONOCIDO: SujetoBCS = { sexo: null, fechaNacimiento: null };

/** Un `Cliente` visto como sujeto. Traducción, no lógica. */
export function sujetoDe(cliente: Pick<Cliente, 'sexo' | 'fecha_nacimiento'>): SujetoBCS {
  return { sexo: cliente.sexo, fechaNacimiento: cliente.fecha_nacimiento };
}

/**
 * Años cumplidos en `fechaISO`. `null` si falta el nacimiento o es posterior.
 *
 * Aritmética sobre las tres partes de la fecha, no sobre `Date`: construir un
 * `Date` a partir de `yyyy-mm-dd` lo interpreta en UTC y lo compara con la
 * zona del servidor, de modo que la misma persona cumple años un día antes o
 * después según dónde corra el proceso.
 */
export function edadEnFecha(fechaNacimiento: string | null, fechaISO: string): number | null {
  if (fechaNacimiento === null) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaISO)) return null;

  const [an, mn, dn] = fechaNacimiento.split('-').map(Number);
  const [ar, mr, dr] = fechaISO.split('-').map(Number);

  let edad = ar - an;
  // Todavía no ha llegado su cumpleaños ese año.
  if (mr < mn || (mr === mn && dr < dn)) edad -= 1;

  return edad < 0 ? null : edad;
}

/** Quién puede resolver un bloqueo. Decide a quién se le pide el dato. */
export type OrigenBloqueo =
  /** Falta un dato de la ficha del cliente. Lo rellena el profesional. */
  | 'cliente'
  /** Falta una condición de la medición. Se anota al medir. */
  | 'medicion'
  /** La referencia existe y está identificada; falta cargarla en el sistema. */
  | 'sistema'
  /** No hay referencia aplicable a este sujeto, y no la hay para nadie. */
  | 'sin_referencia';

export interface BloqueoClasificacion {
  variable: VariableId;
  origen: OrigenBloqueo;
  /** El dato concreto que falta. `null` cuando no falta ningún dato. */
  falta: 'sexo' | 'fecha_nacimiento' | 'dispositivo' | null;
  /** Frase ya redactada: qué ocurre y qué haría falta. */
  detalle: string;
}

const SIN_SEXO =
  'No consta el sexo del cliente, y los rangos de referencia de esta variable se publican por ' +
  'sexo. Basta con anotarlo en su ficha.';

const SIN_NACIMIENTO =
  'No consta la fecha de nacimiento del cliente, y los rangos de referencia de esta variable se ' +
  'publican por edad. Basta con anotarla en su ficha.';

const SIN_DISPOSITIVO =
  'No consta con qué analizador se tomó esta medición. Dos aparatos distintos publican escalas ' +
  'distintas para esta variable, así que sin saber cuál fue no puede aplicarse ninguna.';

/**
 * Por qué no se clasifica una variable para ESTE sujeto y ESTA medición.
 *
 * `null` significa que no hay bloqueo: la variable se clasifica, o no es de
 * las clasificables y por tanto no hay nada que desbloquear.
 *
 * El orden de las comprobaciones es el orden en que se pueden resolver: los
 * datos que el profesional tiene a mano primero, y lo que depende del sistema
 * al final. Enunciar el bloqueo del sistema mientras falta el sexo escondería
 * el paso que sí puede darse hoy.
 */
export function bloqueoDe(
  variable: VariableId,
  sujeto: SujetoBCS,
  medicion: Pick<Medicion, 'dispositivo' | 'fecha'>,
): BloqueoClasificacion | null {
  const def = CATALOGO[variable];
  if (!def?.clasificableEnEspecificacion) return null;
  if (variable === 'imc') return null; // Única con bandas universales cargadas.

  const bloqueo = (origen: OrigenBloqueo, falta: BloqueoClasificacion['falta'], detalle: string) =>
    ({ variable, origen, falta, detalle }) satisfies BloqueoClasificacion;

  // La escala de grasa visceral la define el fabricante del aparato, no una
  // población: no depende del sexo ni de la edad (BCS Handbook 03, BCS-V14).
  if (variable === 'grasa_visceral_idx') {
    if (medicion.dispositivo === null || medicion.dispositivo.trim() === '') {
      return bloqueo('medicion', 'dispositivo', SIN_DISPOSITIVO);
    }
    return bloqueo(
      'sistema',
      null,
      `La escala de ${medicion.dispositivo} está identificada pero todavía no está cargada en el ` +
        'sistema. No es un dato que falte por tu parte.',
    );
  }

  if (sujeto.sexo === null) return bloqueo('cliente', 'sexo', SIN_SEXO);

  if (variable === 'whr') {
    return bloqueo(
      'sistema',
      null,
      'La referencia es la de la OMS (Waist circumference and waist–hip ratio: report of a WHO ' +
        'expert consultation, 2011), está identificada y verificada, y su tabla todavía no está ' +
        'transcrita al sistema. No es un dato que falte por tu parte.',
    );
  }

  // % grasa corporal: los rangos son por sexo Y edad, y además el propio valor
  // depende del algoritmo del fabricante (BCS Handbook 03: «dos dispositivos
  // distintos pueden reportar valores diferentes para la misma persona el
  // mismo día»). Hacen falta las tres cosas.
  if (variable === 'grasa_pct') {
    const edad = edadEnFecha(sujeto.fechaNacimiento, medicion.fecha);
    if (edad === null) return bloqueo('cliente', 'fecha_nacimiento', SIN_NACIMIENTO);

    // El handbook (06) lo declara como caso límite abierto: los rangos de
    // adultos no aplican a menores y v1 no tiene rangos pediátricos. Se dice,
    // en vez de clasificar con la tabla equivocada.
    if (edad < 18) {
      return bloqueo(
        'sin_referencia',
        null,
        `El cliente tenía ${edad} años en esta medición, y los rangos de referencia disponibles ` +
          'son de población adulta. No se aplican a menores y el sistema no incorpora rangos ' +
          'pediátricos.',
      );
    }

    if (medicion.dispositivo === null || medicion.dispositivo.trim() === '') {
      return bloqueo('medicion', 'dispositivo', SIN_DISPOSITIVO);
    }

    return bloqueo(
      'sistema',
      null,
      `Los rangos de ${medicion.dispositivo} por sexo y edad están identificados pero todavía no ` +
        'están cargados en el sistema. No es un dato que falte por tu parte.',
    );
  }

  return null;
}

/** Todo lo que impide clasificar en una medición, ya redactado. */
export function bloqueosDe(
  medicion: Medicion,
  sujeto: SujetoBCS,
): readonly BloqueoClasificacion[] {
  return (Object.keys(CATALOGO) as VariableId[])
    .filter((id) => medicion[id] !== null && medicion[id] !== undefined)
    .map((id) => bloqueoDe(id, sujeto, medicion))
    .filter((b): b is BloqueoClasificacion => b !== null);
}
