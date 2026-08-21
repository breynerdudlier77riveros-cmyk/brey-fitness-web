// ── Interpretación de la evidencia (Sprint PAS-10E §20) ────────────────────
//
// Convierte una `LecturaEvidencia` en frases escritas a mano. **No hay
// generación libre de lenguaje**: misma entrada, misma salida, siempre.
//
// LA REGLA ÚNICA: se describe DÓNDE cae el valor, nunca cuánto vale.
//
//   «Se sitúa entre el percentil 90 y el 97 de la referencia»  → posición medida
//   «Tu fuerza es buena»                                        → categoría inventada
//
// Ninguna frase de este fichero contiene «bueno», «malo», «alto», «bajo»,
// «excelente», «óptimo» ni «normal» aplicados al resultado. Cuando la fuente
// define categorías —y ninguna de las registradas hoy lo hace—, se usan las
// suyas literalmente y se cita.
//
// Y cada frase que pueda leerse de más viaja con su límite.

import { fuenteDe } from './registro';
import type { LecturaEvidencia, Posicion, ReferenciaEvidencia } from './tipos';

export interface FraseEvidencia {
  /** Qué puede decirse. */
  texto: string;
  /** Qué NO puede decirse. Nunca vacío cuando hay una afirmación que acotar. */
  limite: string | null;
  /** De dónde sale, para mostrarlo junto a la frase. */
  procedencia: string | null;
}

/** Coma decimal. Solo presentación. */
const num = (v: number): string => v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');

/**
 * El país, escrito como lo escribiría una persona.
 *
 * `CA` es un código de catálogo, no español. Enseñárselo al atleta es el mismo
 * error que enseñarle un ICC: correcto por dentro, ilegible por fuera.
 */
const PAISES: Readonly<Record<string, string>> = {
  CA: 'Canadá',
  CO: 'Colombia',
};

const paisDe = (iso: string): string => PAISES[iso] ?? iso;

/**
 * Cómo se nombra la población de una referencia, en lenguaje corriente.
 *
 * Exportada desde PAS-13: la tarjeta necesita meterla dentro de una frase
 * («…de cada 100 varones de 20 a 24 años…»), y la alternativa era que se
 * fabricara la suya a partir del ámbito. Dos redacciones de la misma población
 * acabarían diciendo cosas distintas del mismo grupo.
 */
export function poblacionEnPalabras(ref: ReferenciaEvidencia): string {
  const base = poblacionDe(ref);
  return ref.ambito.pais === null ? base : `${base} de ${paisDe(ref.ambito.pais)}`;
}

function poblacionDe(ref: ReferenciaEvidencia): string {
  const partes: string[] = [];
  if (ref.ambito.sexo !== null) partes.push(ref.ambito.sexo === 'M' ? 'varones' : 'mujeres');
  if (ref.ambito.edadMin !== null && ref.ambito.edadMax !== null) {
    partes.push(`de ${ref.ambito.edadMin} a ${ref.ambito.edadMax} años`);
  }
  if (ref.ambito.contexto === 'competicion') partes.push('en competición');
  if (ref.ambito.contexto === 'escolar') partes.push('en edad escolar');
  return partes.length === 0 ? 'la población de referencia' : partes.join(', ');
}

/** La posición, redactada. Nunca añade un juicio a la ubicación. */
function situacionDe(p: Posicion, ref: ReferenciaEvidencia): string {
  const donde = poblacionDe(ref);
  switch (p.clase) {
    case 'percentil_exacto':
      return `coincide con el percentil ${p.p} publicado para ${donde}`;
    case 'entre_percentiles':
      return `se sitúa entre el percentil ${p.inferior} y el ${p.superior} publicados para ${donde}`;
    case 'fuera_por_debajo':
      return `queda por debajo del percentil ${p.primerPercentil}, que es el menor publicado para ${donde}`;
    case 'fuera_por_encima':
      return `queda por encima del percentil ${p.ultimoPercentil}, que es el mayor publicado para ${donde}`;
    case 'desviaciones':
      return `está a ${num(Math.abs(p.z))} desviaciones típicas ${p.z >= 0 ? 'por encima' : 'por debajo'} de la media publicada para ${donde}`;
    case 'dentro_del_rango':
      return `queda dentro del rango de referencia publicado para ${donde}`;
    case 'fuera_del_rango':
      return `queda fuera del rango publicado para ${donde}, por su extremo ${p.lado}`;
    case 'respecto_al_corte':
      return p.lado === 'en_el_corte'
        ? `coincide con el punto de corte publicado para ${donde}`
        : `queda ${p.lado === 'por_debajo' ? 'por debajo' : 'por encima'} del punto de corte publicado para ${donde}`;
  }
}

/** El límite propio de cada clase de posición. */
function limiteDe(p: Posicion, ref: ReferenciaEvidencia): string {
  const base = ref.limitaciones.join(' ');

  if (p.clase === 'entre_percentiles') {
    return (
      'La fuente no publica valores entre esos dos percentiles, así que no se estima ninguno ' +
      `intermedio. ${base}`
    ).trim();
  }
  if (p.clase === 'desviaciones') {
    return (
      'Esta referencia publica la media y su dispersión, no percentiles: la distancia a la media ' +
      `no equivale a una posición percentil. ${base}`
    ).trim();
  }
  if (p.clase === 'fuera_por_debajo' || p.clase === 'fuera_por_encima') {
    return (
      'La fuente no publica valores más allá de ese punto, así que no se extrapola hasta dónde ' +
      `llegaría. ${base}`
    ).trim();
  }
  return base;
}

/** La cita corta con la que se acompaña una frase. */
function procedenciaDe(ref: ReferenciaEvidencia): string | null {
  const f = fuenteDe(ref.fuenteId);
  if (f === null) return null;
  if (f.cita !== null) {
    return `${f.cita.autores.split(',')[0]} y cols. (${f.cita.anio}). ${f.cita.publicacion}.`;
  }
  return `Fuente registrada en la base de conocimiento con la clave ${f.claveExterna}.`;
}

// ════════════════════════════════════════════════════════════════════════════

/**
 * La frase que corresponde a una lectura de evidencia.
 *
 * Los estados sin comparación NO devuelven `null`: devuelven la explicación de
 * qué falta. Ese es el cambio de fondo del sprint — «sin evidencia» era una
 * puerta cerrada, y casi siempre lo que había era una puerta con la llave
 * puesta en el otro lado.
 */
export function redactar(lectura: LecturaEvidencia): FraseEvidencia {
  switch (lectura.estado) {
    case 'EVIDENCIA_COMPATIBLE': {
      const { referencia, posicion, poblacionAjena } = lectura.compatibles[0];
      if (posicion === null) {
        return {
          texto: 'Existe una referencia compatible, pero no permite situar este valor en una escala.',
          limite: referencia.limitaciones.join(' ') || null,
          procedencia: procedenciaDe(referencia),
        };
      }
      const varias =
        lectura.compatibles.length > 1
          ? ` Hay ${lectura.compatibles.length} referencias compatibles y no se elige entre ellas.`
          : '';

      // Cuando la norma es de otra población, decirlo NO es una nota al pie:
      // es parte de la afirmación. Un percentil canadiense presentado a secas
      // se lee como colombiano.
      const ajena =
        poblacionAjena && referencia.ambito.pais !== null
          ? ` La referencia es de ${paisDe(referencia.ambito.pais)}, no de tu país: es la norma ` +
            'publicada disponible para esta prueba, medida con el mismo protocolo.'
          : '';

      return {
        texto: `Tu resultado ${situacionDe(posicion, referencia)}.${varias}${ajena}`,
        limite: limiteDe(posicion, referencia) || null,
        procedencia: procedenciaDe(referencia),
      };
    }

    case 'NO_DETERMINABLE': {
      const c = lectura.carencias.find((x) => x.origen === 'atleta')!;
      return {
        texto:
          'Existe evidencia de referencia para esta prueba, pero falta un dato del atleta para ' +
          'poder situar el resultado.',
        limite: c.detalle,
        procedencia: null,
      };
    }

    case 'NO_COMPARABLE': {
      const c = lectura.carencias.find((x) => x.origen === 'registro')!;
      return {
        texto:
          'Existe evidencia de referencia para esta prueba, pero no consta cómo se tomó la ' +
          'medición.',
        limite: c.detalle,
        procedencia: null,
      };
    }

    case 'EVIDENCIA_PARCIAL': {
      const delSistema = lectura.carencias.find((x) => x.origen === 'sistema');
      if (delSistema) {
        return {
          texto:
            'Existe una referencia compatible y verificada para esta prueba, pendiente de ' +
            'incorporar al sistema.',
          limite: delSistema.detalle,
          procedencia: null,
        };
      }
      const tipos = [...new Set(lectura.complementarias.map((r) => r.tipo))];
      const legible = tipos
        .map((t) => (t === 'FIABILIDAD' ? 'fiabilidad' : t === 'ERROR_MEDICION' ? 'error de medición' : 'validez'))
        .join(' y ');
      return {
        // Se enuncia primero lo que EXISTE. La versión anterior abría con «No
        // hay una referencia…», y era la tercera negación seguida de la
        // tarjeta: para cuando llegaba el «pero sí», ya nadie leía.
        texto:
          `Esta prueba tiene evidencia publicada de ${legible}. Lo que no existe todavía es una ` +
          'referencia que sitúe tu resultado respecto a una población.',
        limite:
          'La fiabilidad dice que la prueba se repite bien, no dónde cae este resultado ni si un ' +
          'cambio es real. El valor se conserva para seguimiento longitudinal.',
        procedencia: lectura.complementarias[0] ? procedenciaDe(lectura.complementarias[0]) : null,
      };
    }

    case 'EVIDENCIA_NO_COMPATIBLE': {
      const d = lectura.descartadas[0];
      return {
        texto:
          'Existe evidencia sobre esta prueba, pero no se ha identificado una referencia ' +
          'compatible con este protocolo y este perfil.',
        limite: d.motivo,
        procedencia: null,
      };
    }

    case 'SIN_EVIDENCIA_UTILIZABLE':
      return {
        texto:
          'No se ha localizado evidencia convertible en referencia para esta prueba. El resultado ' +
          'se conserva para seguimiento longitudinal.',
        limite:
          'La ausencia de referencia no invalida la medición: sigue sirviendo para comparar al ' +
          'atleta consigo mismo.',
        procedencia: null,
      };
  }
}
