import { MAPEOS } from '@/lib/pas/normativo';

/** El id real que declara el mapeo. Nunca se teclea a mano. */
const PRUEBA_PRENSION = MAPEOS[0].pruebaId;

// ── Fixtures del informe v2 (PRS v2.0) ─────────────────────────────────────
//
// Todas parten de normas REALES de la NKB, cargadas por el adaptador. No hay
// ni un percentil escrito a mano: si una ficha cambia, estos tests lo notan.

import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { consultarEvaluacion, type SujetoNormativo } from '@/lib/pas/normativo';
import type { RegistroPrueba } from '@/lib/pas/tipos';

import { componerInformeNormativo, type DatosPortada } from '../vista';

export const NORMAS = cargarNormas();

export const PORTADA: DatosPortada = {
  atleta: 'Atleta de prueba',
  edad: 20,
  sexo: 'Masculino',
  fecha: '2026-08-14',
  profesional: 'Evaluador de prueba',
  codigo: 'PRS2-TEST-0001',
};

/** Universitario colombiano de 20 años: activa TN-1 y TN-2 a la vez. */
export const SUJETO_CO_20: SujetoNormativo = {
  edad: 20,
  sexo: 'M',
  estaturaM: null,
  pais: 'CO',
};

/** Escolar colombiano de 15 años: la norma ENSIN, en ES-2 y con conflicto. */
export const SUJETO_CO_15: SujetoNormativo = {
  edad: 15,
  sexo: 'M',
  estaturaM: null,
  pais: 'CO',
};

/** Brasileño de 70 años: única población cuya unidad admite conversión. */
export const SUJETO_BR_70: SujetoNormativo = {
  edad: 70,
  sexo: 'M',
  estaturaM: 1.75,
  pais: 'BR',
};

/** Sin edad ni sexo: todo queda NO_DETERMINABLE. */
export const SUJETO_SIN_DATOS: SujetoNormativo = {
  edad: null,
  sexo: null,
  estaturaM: null,
  pais: null,
};

const BASE: Omit<RegistroPrueba, 'id' | 'valor' | 'condiciones'> = {
  pruebaId: PRUEBA_PRENSION,
  fecha: '2026-08-14',
  estado: 'vigente',
  precondicionesCumplidas: true,
  patron: null,
  observaciones: null,
  metadatos: {},
};

export const COND_UNI = {
  dinamometro: 'takei-t18',
  consolidacion: 'media_ambas_manos',
  posicion: 'bipedestacion',
  mano: 'ambas',
};

export const COND_ENSIN = {
  dinamometro: 'takei-tkk-5101',
  consolidacion: 'media_ambas_manos',
  posicion: 'bipedestacion',
  mano: 'ambas',
};

export const COND_BR = {
  dinamometro: 'jamar-j00105',
  consolidacion: 'media_2a_y_3a_mano_dominante',
  posicion: 'sedestacion',
  mano: 'dominante',
};

export function registro(
  id: string,
  valor: number,
  unidad: string,
  condiciones: Record<string, string>,
  extra: Partial<RegistroPrueba> = {},
): RegistroPrueba {
  return {
    ...BASE,
    id,
    valor: { tipo: 'continuo', valor, unidad },
    condiciones,
    ...extra,
  };
}

/** Registro de una prueba que la NKB no cubre. */
export function registroSinNorma(id: string, pruebaId: string): RegistroPrueba {
  return { ...BASE, id, pruebaId, valor: { tipo: 'continuo', valor: 42, unidad: 'cm' }, condiciones: {} };
}

/** El camino completo: registros → NIE → modelo de vista. */
export function informe(
  registros: readonly RegistroPrueba[],
  sujeto: SujetoNormativo,
  portada: DatosPortada = PORTADA,
) {
  return componerInformeNormativo(consultarEvaluacion(registros, sujeto, NORMAS), portada);
}

/** El caso nominal: 37,5 kg de un universitario de 20 años. */
export const informeUni = () => informe([registro('r1', 37.5, 'kg', COND_UNI)], SUJETO_CO_20);

/** El caso ENSIN: 30,7 kg de un escolar de 15, con ES-2 y conflicto. */
export const informeEnsin = () => informe([registro('r1', 30.7, 'kg', COND_ENSIN)], SUJETO_CO_15);
