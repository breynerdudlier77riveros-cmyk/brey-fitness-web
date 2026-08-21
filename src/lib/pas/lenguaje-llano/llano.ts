// ── Lenguaje llano (Sprint PAS-13) ─────────────────────────────────────────
//
// EL PROBLEMA QUE RESUELVE:
//
//   La tarjeta enseñaba «entre P90 y P97» y «ICC 0,91–0,97». Las dos cifras
//   son correctas y las dos son ilegibles para quien se hizo la prueba. Un
//   informe que hay que traducir no es un informe.
//
// LO QUE ESTE MÓDULO **NO** HACE, Y ES SU RAZÓN DE SER:
//
//   · No clasifica. No existe «excelente», «bueno», «bajo» ni «normal» en
//     ninguna cadena de este fichero. Traducir un percentil a palabras es
//     decir qué significa el número; ponerle una etiqueta es inventar un punto
//     de corte que nadie publicó.
//   · No interpola, no extrapola y no convierte z en percentil. Recibe una
//     posición YA calculada y solo la pone en español.
//   · No decide qué es mejor. Se limita a enunciar la dirección que el
//     catálogo declara, y cuando el catálogo la deja en `null` dice por qué.
//
// LA FRASE CENTRAL, Y POR QUÉ ESTÁ ESCRITA ASÍ:
//
//   «Entre 20 y 30 de cada 100 varones de 20 a 24 años quedan por debajo de
//    tu marca.»
//
//   Es la definición literal de un percentil, dicha con palabras. Y es una
//   afirmación sobre NÚMEROS, no sobre calidad: se sostiene igual en una
//   prueba donde más alto es mejor y en una donde más alto es peor, y por eso
//   puede emitirse antes de saber cuál de las dos es.
//
//   La dirección va en una segunda frase, aparte. Que el lector componga la
//   lectura con las dos es precisamente lo que un sistema que no clasifica
//   puede ofrecerle; fundirlas en una sola frase sería emitir el juicio.
//
// Módulo puro: misma entrada, misma salida, siempre.

import { pruebaRegistrable } from '@/features/performance-workspace/schemas/catalogo';
import type { Posicion } from '@/lib/pas/evidencia';

export interface LecturaLlana {
  /**
   * La frase principal, sin jerga. Es lo que sustituye al «entre P90 y P97»
   * en la cara visible de la tarjeta.
   */
  texto: string;
  /**
   * Cómo se lee la escala en esta prueba, según el catálogo. Va SIEMPRE
   * separada de `texto`: es la parte que convierte un número en una lectura, y
   * mezclarlas produciría exactamente la clasificación que no se puede emitir.
   */
  sentido: string;
  /**
   * La misma lectura, para donde solo quepa una línea (el perfil por
   * dominios, una celda de tabla).
   *
   * NO es el rótulo técnico abreviado: es la frase llana recortada a lo
   * esencial —cuánta gente queda por debajo— sin la población, que en una
   * vista de once pruebas ya está implícita en el nombre de la prueba y se
   * repetiría once veces. Sigue sin contener ninguna categoría.
   */
  resumen: string;
  /** La forma técnica de lo mismo. Para los detalles, nunca para la tarjeta. */
  tecnico: string;
}

/** Coma decimal. Solo presentación. */
const num = (v: number): string => v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');

/**
 * Por qué una prueba no declara dirección de mejora.
 *
 * El catálogo documenta las tres razones y son distintas entre sí. Repetir
 * «no se declara dirección» en los tres casos escondería que en el sit-and-reach
 * el motivo es fisiológico y en el FMS es aritmético.
 */
const SIN_DIRECCION: Readonly<Record<string, string>> = {
  'P-06':
    'En esta prueba no hay un «mejor» automático: más distancia es más rango de movimiento, ' +
    'pero el exceso de rango también existe y el protocolo no define dónde está el punto justo.',
  'P-08':
    'En esta prueba lo que informa es la diferencia entre las dos piernas, no el valor de una ' +
    'sola. Un número mayor en un lado no es por sí mismo mejor.',
  'P-09':
    'Es una puntuación compuesta: sus puntos no se suman ni se restan como kilos, así que subir ' +
    'de puntuación no equivale a mejorar una cantidad.',
};

/** Qué lado de la escala es mejor, o el motivo de que no pueda decirse. */
export function sentidoDe(pruebaId: string): string {
  const prueba = pruebaRegistrable(pruebaId);
  if (prueba === undefined) return 'El catálogo no describe esta prueba.';
  // «Cuanto más alto, mejor» diría lo mismo, pero mete «alto» en una frase
  // que va pegada al resultado del atleta. `alto` y `bajo` son también dos de
  // las categorías que el sistema tiene prohibido emitir, y el auditor no
  // puede —ni debe— distinguir cuándo describen la escala y cuándo describen a
  // la persona. Se evitan las dos palabras y no hay nada que distinguir.
  if (prueba.direccion === 'mayor_mejor') {
    return 'En esta prueba, un número mayor es mejor resultado.';
  }
  if (prueba.direccion === 'menor_mejor') {
    return 'En esta prueba, un número menor es mejor resultado.';
  }
  return (
    SIN_DIRECCION[pruebaId] ??
    'El catálogo no declara para esta prueba si un número mayor es mejor o peor.'
  );
}

/**
 * «Entre 20 y 30 de cada 100 … quedan por debajo de tu marca.»
 *
 * Una sola fórmula para los cuatro casos percentílicos: cuánta gente queda por
 * debajo. Es lo que un percentil ES, así que no hay nada que suponer.
 *
 * GUARDA DELIBERADA: solo se emite si las etiquetas de percentil crecen con el
 * valor. `situar()` ordena la tabla por VALOR y arrastra la etiqueta que la
 * fuente le puso; si alguna fuente publicara la suya invertida —P90 en el
 * extremo bajo—, contar personas a partir de esa etiqueta diría exactamente lo
 * contrario de la verdad. Ninguna de las registradas hoy lo hace, y por eso
 * mismo la comprobación tiene que estar escrita: la que rompa la suposición
 * entrará dentro de dos años y nadie recordará que existía.
 */
function cuantaGente(p: Posicion, poblacion: string): string | null {
  switch (p.clase) {
    case 'percentil_exacto':
      return `${p.p} de cada 100 ${poblacion} quedan en tu marca o por debajo de ella.`;

    case 'entre_percentiles':
      if (p.inferior >= p.superior) return null;
      return `Entre ${p.inferior} y ${p.superior} de cada 100 ${poblacion} quedan por debajo de tu marca.`;

    case 'fuera_por_debajo':
      return (
        `Menos de ${p.primerPercentil} de cada 100 ${poblacion} quedan por debajo de tu marca: ` +
        'tu resultado no llega al valor más pequeño que publica la fuente.'
      );

    case 'fuera_por_encima':
      return (
        `Más de ${p.ultimoPercentil} de cada 100 ${poblacion} quedan por debajo de tu marca: ` +
        'tu resultado pasa del valor más grande que publica la fuente.'
      );

    default:
      return null;
  }
}

/**
 * La misma lectura en una línea, sin la población.
 *
 * Comparte la guarda de `cuantaGente`: si las etiquetas de percentil no crecen
 * con el valor, tampoco aquí se cuenta gente. Dos formas de la misma frase con
 * criterios distintos acabarían contradiciéndose en la misma pantalla.
 */
function resumenDe(p: Posicion): string {
  switch (p.clase) {
    case 'percentil_exacto':
      return `${p.p} de cada 100 por debajo`;
    case 'entre_percentiles':
      return p.inferior >= p.superior
        ? 'entre dos valores publicados'
        : `${p.inferior}–${p.superior} de cada 100 por debajo`;
    case 'fuera_por_debajo':
      return `menos de ${p.primerPercentil} de cada 100 por debajo`;
    case 'fuera_por_encima':
      return `más de ${p.ultimoPercentil} de cada 100 por debajo`;
    case 'desviaciones':
      // Sin cifra: la fuente no publica percentiles y el resumen no puede
      // insinuar una posición que la frase larga se niega a dar.
      return `${p.z >= 0 ? 'por encima' : 'por debajo'} de la media publicada`;
    case 'dentro_del_rango':
      return 'dentro del rango publicado';
    case 'fuera_del_rango':
      return `fuera del rango, por el extremo ${p.lado}`;
    case 'respecto_al_corte':
      return p.lado === 'en_el_corte'
        ? 'en el punto de corte publicado'
        : `${p.lado === 'por_debajo' ? 'por debajo' : 'por encima'} del punto de corte`;
  }
}

/**
 * La posición, en español corriente.
 *
 * `poblacion` ya viene redactada por quien la conoce («varones de 20 a 24 años
 * de Canadá»). Este módulo no la construye: no sabe de dónde salió la norma.
 */
export function enLlano(pruebaId: string, p: Posicion, poblacion: string): LecturaLlana {
  const sentido = sentidoDe(pruebaId);
  const gente = cuantaGente(p, poblacion);

  switch (p.clase) {
    case 'percentil_exacto':
      return { texto: gente!, sentido, resumen: resumenDe(p), tecnico: `Percentil ${p.p}` };

    case 'entre_percentiles':
      return {
        texto:
          gente ??
          `Tu marca queda entre dos de los valores que la fuente publica para ${poblacion}.`,
        sentido,
        resumen: resumenDe(p),
        tecnico: `Entre el percentil ${p.inferior} y el ${p.superior}`,
      };

    case 'fuera_por_debajo':
      return {
        texto: gente!,
        sentido,
        resumen: resumenDe(p),
        tecnico: `Por debajo del percentil ${p.primerPercentil}, el menor publicado`,
      };

    case 'fuera_por_encima':
      return {
        texto: gente!,
        sentido,
        resumen: resumenDe(p),
        tecnico: `Por encima del percentil ${p.ultimoPercentil}, el mayor publicado`,
      };

    case 'desviaciones':
      // Aquí NO se dice a cuánta gente supera, y es la omisión más importante
      // del módulo: esta fuente publicó una media y una dispersión, no una
      // tabla de percentiles. Pasar de una a otra exige suponer la forma de la
      // distribución, que es justo lo que el sistema lleva doce sprints sin
      // hacer. Se dice lo que sí se sabe, y se dice también qué no.
      return {
        texto:
          `Tu marca queda ${p.z >= 0 ? 'por encima' : 'por debajo'} de la media de ${poblacion}. ` +
          'Esta fuente publica la media del grupo, no una tabla de percentiles, así que no puede ' +
          'decirse a cuánta gente superas.',
        sentido,
        resumen: resumenDe(p),
        tecnico: `${num(Math.abs(p.z))} desviaciones típicas ${p.z >= 0 ? 'por encima' : 'por debajo'} de la media`,
      };

    case 'dentro_del_rango':
      return {
        texto: `Tu marca cae dentro del rango que la fuente publica para ${poblacion}.`,
        sentido,
        resumen: resumenDe(p),
        tecnico: 'Dentro del rango de referencia',
      };

    case 'fuera_del_rango':
      return {
        texto:
          `Tu marca queda ${p.lado === 'superior' ? 'por encima' : 'por debajo'} del rango que ` +
          `la fuente publica para ${poblacion}.`,
        sentido,
        resumen: resumenDe(p),
        tecnico: `Fuera del rango de referencia, por el extremo ${p.lado}`,
      };

    case 'respecto_al_corte':
      return {
        texto:
          p.lado === 'en_el_corte'
            ? `Tu marca coincide exactamente con el valor de corte publicado para ${poblacion}.`
            : `Tu marca queda ${p.lado === 'por_debajo' ? 'por debajo' : 'por encima'} del valor ` +
              `de corte publicado para ${poblacion}.`,
        sentido,
        resumen: resumenDe(p),
        tecnico: 'Respecto al punto de corte publicado',
      };
  }
}
