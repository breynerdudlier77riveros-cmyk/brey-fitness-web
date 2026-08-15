// ── Validación de entrada (Sprint PAS-7.0) ─────────────────────────────────
// Pura y sin dependencias: las Server Actions la invocan antes de tocar la
// base, y las pruebas la ejercitan sin montar nada.
//
// Valida FORMA, nunca contenido científico. Que un valor de 1RM sea plausible
// no es asunto del Workspace: el PAE ya declara lo que no puede interpretar.

import { esFechaISO } from '@/lib/pas';
import { TIPOS_EVALUACION } from '@/lib/pas';
import type { ValorRegistro } from '@/lib/pas';
import { esPruebaRegistrable, pruebaRegistrable } from './catalogo';
import type { EntradaAtleta, EntradaEvaluacion, EntradaRegistro } from './tipos';

export type CodigoError =
  | 'NOMBRE_REQUERIDO'
  | 'NOMBRE_DEMASIADO_LARGO'
  | 'CAMPO_DEMASIADO_LARGO'
  | 'FECHA_INVALIDA'
  | 'FECHA_FUTURA'
  | 'TIPO_INVALIDO'
  | 'ATLETA_REQUERIDO'
  | 'PRUEBA_NO_CATALOGADA'
  | 'VALOR_INCOMPATIBLE'
  | 'VALOR_NO_FINITO'
  | 'SEXO_INVALIDO'
  | 'PAIS_INVALIDO'
  | 'ESTATURA_INVALIDA'
  | 'VALOR_VACIO'
  | 'PATRON_REQUERIDO';

export interface Validacion {
  ok: boolean;
  errores: CodigoError[];
}

const OK: Validacion = { ok: true, errores: [] };

function fallo(...errores: CodigoError[]): Validacion {
  return { ok: false, errores };
}

function textoLargo(valor: string | null | undefined, max: number): boolean {
  return typeof valor === 'string' && valor.length > max;
}

export function validarAtleta(entrada: EntradaAtleta): Validacion {
  const errores: CodigoError[] = [];

  if (!entrada.nombre || entrada.nombre.trim() === '') errores.push('NOMBRE_REQUERIDO');
  if (textoLargo(entrada.nombre, 120)) errores.push('NOMBRE_DEMASIADO_LARGO');

  if (
    textoLargo(entrada.documento, 40) ||
    textoLargo(entrada.codigoInterno, 40) ||
    textoLargo(entrada.deporte, 60) ||
    textoLargo(entrada.notas, 2000)
  ) {
    errores.push('CAMPO_DEMASIADO_LARGO');
  }

  if (entrada.fechaNacimiento && !esFechaISO(entrada.fechaNacimiento)) {
    errores.push('FECHA_INVALIDA');
  }

  // Las tres coordenadas normativas son OPCIONALES: un atleta sin ellas se
  // registra igual, y su informe normativo lo dirá. Lo que no se admite es un
  // valor fuera de dominio, que la base rechazaría con su CHECK y aquí se
  // detiene antes, con un error legible.
  if (entrada.sexo != null && entrada.sexo !== 'M' && entrada.sexo !== 'F') {
    errores.push('SEXO_INVALIDO');
  }

  if (entrada.pais != null && entrada.pais !== '' && !/^[A-Z]{2}$/.test(entrada.pais)) {
    errores.push('PAIS_INVALIDO');
  }

  if (
    entrada.estaturaCm != null &&
    (!Number.isFinite(entrada.estaturaCm) || entrada.estaturaCm <= 80 || entrada.estaturaCm >= 260)
  ) {
    errores.push('ESTATURA_INVALIDA');
  }

  return errores.length === 0 ? OK : { ok: false, errores };
}

export function validarEvaluacion(entrada: EntradaEvaluacion, hoyISO: string): Validacion {
  const errores: CodigoError[] = [];

  if (!entrada.atletaId || entrada.atletaId.trim() === '') errores.push('ATLETA_REQUERIDO');
  if (!TIPOS_EVALUACION.includes(entrada.tipo)) errores.push('TIPO_INVALIDO');

  if (!esFechaISO(entrada.fecha)) errores.push('FECHA_INVALIDA');
  else if (entrada.fecha > hoyISO) errores.push('FECHA_FUTURA');

  if (textoLargo(entrada.observaciones, 4000)) errores.push('CAMPO_DEMASIADO_LARGO');

  return errores.length === 0 ? OK : { ok: false, errores };
}

/** La variante del valor debe coincidir con la naturaleza que declara la prueba. */
function validarValor(valor: ValorRegistro, naturaleza: string): CodigoError | null {
  if (valor.tipo !== naturaleza) return 'VALOR_INCOMPATIBLE';

  if (valor.tipo === 'continuo' || valor.tipo === 'ordinal') {
    return Number.isFinite(valor.valor) ? null : 'VALOR_NO_FINITO';
  }
  if (valor.tipo === 'categorico') {
    return valor.valor.trim() === '' ? 'VALOR_VACIO' : null;
  }
  return null;
}

export function validarRegistro(entrada: EntradaRegistro, hoyISO: string): Validacion {
  const errores: CodigoError[] = [];

  if (!esPruebaRegistrable(entrada.pruebaId)) {
    // Sin definición no puede validarse el resto: se corta aquí.
    return fallo('PRUEBA_NO_CATALOGADA');
  }

  const prueba = pruebaRegistrable(entrada.pruebaId);
  if (!prueba) return fallo('PRUEBA_NO_CATALOGADA');

  if (!esFechaISO(entrada.fecha)) errores.push('FECHA_INVALIDA');
  else if (entrada.fecha > hoyISO) errores.push('FECHA_FUTURA');

  const errorValor = validarValor(entrada.valor, prueba.naturaleza);
  if (errorValor) errores.push(errorValor);

  if (prueba.requierePatron && (!entrada.patron || entrada.patron.trim() === '')) {
    errores.push('PATRON_REQUERIDO');
  }

  if (textoLargo(entrada.observaciones, 1000)) errores.push('CAMPO_DEMASIADO_LARGO');

  return errores.length === 0 ? OK : { ok: false, errores };
}
