// ── Dónde cae un valor en su norma (Sprint BCS-10.0) ───────────────────────
//
// Reutiliza `situar()` de la capa de evidencia del PAS. No es una casualidad
// ni un atajo: «dónde cae un valor dentro de unos percentiles publicados» es
// una sola pregunta, y escribir aquí una segunda implementación garantizaría
// que las dos acabaran discrepando. Esa función ya se niega a interpolar, a
// extrapolar y a convertir nada en categorías, que es todo lo que hace falta.
//
// LO QUE ESTE MÓDULO AÑADE: los tres motivos por los que puede no haber
// posición, distinguidos entre sí.
//
//   · No consta el sexo o la fecha de nacimiento  → lo rellena el profesional.
//   · No hay norma cargada para esa variable      → trabajo del sistema.
//   · La celda existe pero no se sostiene         → ni una cosa ni la otra.
//
// El tercero es el que no existía en ningún sitio y hacía falta: una tabla
// publicada puede traer una celda imposible, y decir «no hay norma para tu
// edad» cuando lo cierto es «la que hay se calculó sobre 16 personas y sale
// desordenada» son dos respuestas distintas.
//
// Módulo puro.

import { situar, type Posicion } from '@/lib/pas/evidencia';
import { edadEnFecha, type SujetoBCS } from '@/lib/bcs/identidad';
import { normaPara, type CeldaNorma, type NormaPoblacional } from '@/lib/bcs/normas';
import type { VariableId } from '@/lib/bcs/reporte';

export type MotivoSinPosicion =
  | 'SIN_SEXO'
  | 'SIN_NACIMIENTO'
  | 'SIN_NORMA'
  | 'CELDA_NO_UTILIZABLE';

export interface PosicionNormativa {
  variable: VariableId;
  posicion: Posicion | null;
  norma: NormaPoblacional | null;
  celda: CeldaNorma | null;
  motivo: MotivoSinPosicion | null;
  /** Frase ya redactada del motivo, cuando no hay posición. */
  detalleMotivo: string | null;
}

/** Dónde cae `valor` para este sujeto, o por qué no puede decirse. */
export function situarEnNorma(
  variable: VariableId,
  valor: number,
  sujeto: SujetoBCS,
  fechaMedicion: string,
): PosicionNormativa {
  const vacio = { variable, posicion: null, norma: null, celda: null };

  if (sujeto.sexo === null) {
    return {
      ...vacio,
      motivo: 'SIN_SEXO',
      detalleMotivo:
        'No consta el sexo del cliente, y los percentiles publicados se dan por sexo. Basta con ' +
        'anotarlo en su ficha.',
    };
  }

  const edad = edadEnFecha(sujeto.fechaNacimiento, fechaMedicion);
  if (edad === null) {
    return {
      ...vacio,
      motivo: 'SIN_NACIMIENTO',
      detalleMotivo:
        'No consta la fecha de nacimiento del cliente, y los percentiles se publican por banda ' +
        'de edad. Basta con anotarla en su ficha.',
    };
  }

  const encontrada = normaPara(variable, sujeto.sexo, edad);
  if (encontrada === null) {
    return {
      ...vacio,
      motivo: 'SIN_NORMA',
      detalleMotivo:
        'No hay todavía una tabla de percentiles cargada en el sistema para esta variable con ' +
        `${edad} años. No es un dato que falte por tu parte.`,
    };
  }

  const { norma, celda } = encontrada;

  if (!celda.utilizable) {
    return {
      ...vacio,
      norma,
      celda,
      motivo: 'CELDA_NO_UTILIZABLE',
      detalleMotivo: celda.motivoNoUtilizable ?? 'La celda publicada no se sostiene.',
    };
  }

  return {
    variable,
    posicion: situar(valor, { clase: 'percentiles', puntos: celda.puntos }),
    norma,
    celda,
    motivo: null,
    detalleMotivo: null,
  };
}

/** Coma decimal. Solo presentación. */
const num = (v: number): string => v.toFixed(1).replace(/[.,]0$/, '').replace('.', ',');

/**
 * La posición, en español corriente.
 *
 * Misma doctrina que el PAS: se enuncia cuánta gente queda por debajo, que es
 * lo que un percentil ES, y no se emite ninguna categoría — la fuente publica
 * percentiles, no bandas de mérito, y convertir unos en otras exige un punto
 * de corte que no está en el artículo.
 */
export function redactarPosicion(pn: PosicionNormativa, poblacion: string): string | null {
  const p = pn.posicion;
  if (p === null) return null;

  switch (p.clase) {
    case 'percentil_exacto':
      return `Tu valor coincide con el percentil ${p.p}: ${p.p} de cada 100 ${poblacion} quedan en tu marca o por debajo.`;
    case 'entre_percentiles':
      return p.inferior >= p.superior
        ? null
        : `Entre ${p.inferior} y ${p.superior} de cada 100 ${poblacion} quedan por debajo de tu valor.`;
    case 'fuera_por_debajo':
      return `Menos de ${p.primerPercentil} de cada 100 ${poblacion} quedan por debajo de tu valor: queda por fuera del percentil más bajo que publica la fuente.`;
    case 'fuera_por_encima':
      return `Más de ${p.ultimoPercentil} de cada 100 ${poblacion} quedan por debajo de tu valor: queda por fuera del percentil más alto que publica la fuente.`;
    default:
      return null;
  }
}

/** «varones de 20 a 59 años», para meter dentro de la frase. */
export function poblacionDe(celda: CeldaNorma): string {
  const quien = celda.sexo === 'M' ? 'varones' : 'mujeres';
  return celda.edadMax >= 120
    ? `${quien} de ${celda.edadMin} años en adelante`
    : `${quien} de ${celda.edadMin} a ${celda.edadMax} años`;
}

/** La advertencia de procedencia. `null` cuando no hay nada que advertir. */
export function advertenciaDe(pn: PosicionNormativa): string | null {
  if (pn.norma === null || pn.celda === null || pn.posicion === null) return null;
  return (
    `Esta tabla procede de ${pn.norma.pais} y se obtuvo con ${pn.norma.dispositivo}, no con el ` +
    `aparato de esta medición. La celda que te corresponde se calculó sobre ${pn.celda.n} ` +
    'personas. Que dos modelos del mismo fabricante den cifras intercambiables no está ' +
    'demostrado en el artículo, así que la posición se lee como orientación, no como una ' +
    'medida de tu población con tu aparato.'
  );
}

export { num as formatearValorNorma };
