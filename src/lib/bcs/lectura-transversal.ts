// ── Lectura de UNA medición (Sprint BCS-8.0) ───────────────────────────────
//
// LA QUEJA QUE ORIGINA ESTE MÓDULO, LITERAL:
//
//   «en el apartado de interpretación sigue vacío, no me da nada, no me dice
//    nada.»
//
//   Y era exacto. Todo lo que el informe llamaba «interpretación» hablaba del
//   ANÁLISIS, no del cuerpo:
//
//     «El análisis se apoya en una única medición…»
//     «Se identifica una incidencia en la consistencia del dato…»
//     «La interpretación permanece limitada en 5 aspectos…»
//     «3 variables registradas no admiten clasificación…»
//
//   Cuatro párrafos, cero frases sobre la persona. Un informe que solo sabe
//   hablar de sus propias limitaciones no es un informe cauto: es un informe
//   vacío que suena cauto.
//
// ── POR QUÉ NO LO HABÍA, Y POR QUÉ SÍ SE PUEDE ────────────────────────────
//
//   El sistema tenía dos ejes: comparar contra una población (bloqueado en 24
//   de 25 variables por falta de rangos publicados) y comparar contra el
//   pasado (bloqueado con una sola medición). Con los dos cerrados, no quedaba
//   nada.
//
//   Falta un tercero, que no necesita ni norma ni histórico: **las relaciones
//   entre las variables de la propia medición**. La CKB tiene un módulo entero
//   dedicado a ellas (10 · Relaciones entre variables) y ningún componente lo
//   consumía.
//
//   Que tu peso se descompone en tanta grasa y tanto no-grasa es una identidad
//   aritmética, no una estimación. Que tu IMC y tu porcentaje graso apunten en
//   direcciones distintas es un hecho comprobable sobre tus dos cifras. Que tu
//   metabolismo basal se derivó de tu masa libre de grasa está escrito en la
//   tabla de derivación de la CKB. Nada de eso exige una segunda medición.
//
// ── LO QUE ESTE MÓDULO NO HACE ────────────────────────────────────────────
//
//   · No clasifica. La única etiqueta que aparece es la del IMC, que el
//     dominio ya calculó con sus bandas publicadas, y se cita como tal.
//   · No infiere causas. La CKB (módulo 10) es explícita: ninguna de las
//     cuatro clases de relación —derivación, composición, estructural,
//     concurrente— es causal, «porque el dato no contiene la causa».
//   · No emite juicios de salud ni recomendaciones.
//
// Módulo puro. Cada lectura declara de qué módulo de la CKB o del handbook
// sale, para que pueda comprobarse una a una.

import type { Medicion } from '@/lib/bcs/tipos';
import type { FilaVariable } from '@/lib/bcs/reporte';

export interface LecturaTransversal {
  id: string;
  /** Titular corto. */
  titulo: string;
  /** La lectura, con las cifras del cliente dentro. */
  texto: string;
  /** De dónde sale la relación. Se muestra, no se esconde. */
  fundamento: string;
}

/** Coma decimal, un decimal. Solo presentación. */
const n = (v: number, dec = 1): string => v.toFixed(dec).replace('.', ',');

/**
 * Tolerancia de la identidad peso = masa grasa + masa libre de grasa.
 *
 * ±0,5 kg es la ÚNICA tolerancia numérica que el BCS Handbook 03 publica para
 * una validación cruzada. No se inventa ninguna para las demás — la de
 * agua intra + extra ≈ total no trae cifra, y por eso aquí no se comprueba.
 */
const TOLERANCIA_PESO_KG = 0.5;

/**
 * Lo que puede decirse del cuerpo con UNA medición.
 *
 * `filas` trae la ficha ya resuelta por el dominio, con la clasificación del
 * IMC calculada donde la hay. Este módulo no vuelve a clasificar nada.
 */
export function leerMedicion(
  m: Medicion,
  filas: readonly FilaVariable[],
): readonly LecturaTransversal[] {
  const lecturas: LecturaTransversal[] = [];

  // ── 1 · De qué está hecho el peso ────────────────────────────────────────
  //
  // `Peso = masa grasa + masa libre de grasa` es una IDENTIDAD de composición
  // (CKB 10), no una estimación con margen: si el aparato dio las tres cifras,
  // la frase es exacta. Es lo primero que cualquiera quiere saber y el informe
  // no lo decía en ninguna parte.
  if (m.peso_kg !== null && m.masa_grasa_kg !== null) {
    const magra = m.masa_libre_grasa_kg ?? m.peso_kg - m.masa_grasa_kg;
    lecturas.push({
      id: 'composicion-del-peso',
      titulo: 'De qué está hecho tu peso',
      texto:
        `De tus ${n(m.peso_kg)} kg, ${n(m.masa_grasa_kg)} kg son masa grasa y ${n(magra)} kg ` +
        'son todo lo demás: músculo, hueso, órganos y agua. ' +
        (m.masa_muscular_kg !== null
          ? `Dentro de esa parte, el aparato estima ${n(m.masa_muscular_kg)} kg de músculo ` +
            'esquelético. Los dos números no se suman entre sí: el músculo está contenido en la ' +
            'masa libre de grasa, no al lado.'
          : ''),
      fundamento: 'CKB 10 · relación de composición: peso = masa grasa + masa libre de grasa.',
    });
  }

  // ── 2 · La consistencia interna, cuando SE CUMPLE ───────────────────────
  //
  // El sistema ya comprobaba esta identidad, pero solo hablaba cuando fallaba.
  // Que cuadre también es información, y es la única forma que tiene el lector
  // de saber que se comprobó.
  if (m.peso_kg !== null && m.masa_grasa_kg !== null && m.masa_libre_grasa_kg !== null) {
    const desvio = Math.abs(m.masa_grasa_kg + m.masa_libre_grasa_kg - m.peso_kg);
    if (desvio <= TOLERANCIA_PESO_KG) {
      lecturas.push({
        id: 'consistencia-interna',
        titulo: 'Las cifras cuadran entre sí',
        texto:
          `Tu masa grasa y tu masa libre de grasa reconstruyen tu peso con una diferencia de ` +
          `${n(desvio, 2)} kg, dentro de la tolerancia de ±${n(TOLERANCIA_PESO_KG)} kg que ` +
          'documenta el catálogo. No prueba que el porcentaje graso sea exacto —eso depende del ' +
          'algoritmo del aparato— pero descarta un error de transcripción en esas tres cifras.',
        fundamento: 'BCS Handbook 03 · validación cruzada masa grasa + masa libre ≈ peso (±0,5 kg).',
      });
    }
  }

  // ── 3 · IMC frente a porcentaje graso ────────────────────────────────────
  //
  // LA LECTURA MÁS ÚTIL QUE ADMITE UNA SOLA MEDICIÓN, y la que el informe
  // dejaba a medias: clasificaba el IMC, mostraba el porcentaje graso tres
  // tarjetas más allá, y no juntaba nunca los dos. El aviso poblacional del
  // handbook dice literalmente «considerar junto al % de grasa corporal
  // registrado» — esto es hacerlo.
  const imc = filas.find((f) => f.id === 'imc');
  if (imc?.clasificacion && m.grasa_pct !== null) {
    lecturas.push({
      id: 'imc-vs-grasa',
      titulo: 'Qué dice tu IMC y qué dice tu grasa corporal',
      texto:
        `Tu IMC de ${n(imc.valor)} kg/m² cae en la banda «${imc.clasificacion.etiqueta}» de las ` +
        `categorías generales para adultos. Tu grasa corporal registrada es ${n(m.grasa_pct)} %. ` +
        'El IMC solo conoce tu peso y tu estatura: no distingue de qué está hecho ese peso, y su ' +
        'rango está documentado como poco fiable en personas con mucha masa muscular. El ' +
        'porcentaje graso sí distingue. Cuando los dos no coinciden, el que tiene menos ' +
        'resolución sobre la composición es el IMC.',
      fundamento:
        'BCS Handbook 06 · aviso poblacional del IMC. CKB 10 · el IMC es derivado de peso y talla.',
    });
  }

  // ── 4 · El metabolismo basal no se midió ─────────────────────────────────
  if (m.bmr_kcal !== null) {
    lecturas.push({
      id: 'bmr-derivado',
      titulo: 'De dónde sale tu metabolismo basal',
      texto:
        `Los ${n(m.bmr_kcal, 0)} kcal/día que muestra el informe no se midieron: el aparato los ` +
        'calculó a partir de tu masa libre de grasa con una ecuación de población. Por eso suben ' +
        'cuando sube el tejido magro, y por eso su exactitud depende de a quién se aplique — en ' +
        'personas entrenadas varias ecuaciones de uso general se desvían de forma sistemática.',
      fundamento:
        'CKB 10 · relación de derivación composición → metabolismo basal. CKB 12 · §7, ecuaciones dependientes de población.',
    });
  }

  // ── 5 · El agua, y qué parte de ella es celular ──────────────────────────
  //
  // La proporción se enuncia SIN clasificarla: la CKB declara no admisible
  // clasificar el cociente ECW/TBW con rangos de fabricante, y prohíbe
  // trasladar a una persona sana el valor pronóstico obtenido en pacientes de
  // hemodiálisis u oncológicos. Decir cuánta agua hay y dónde está no es
  // ninguna de las dos cosas.
  if (m.agua_total_l !== null && m.peso_kg !== null) {
    const pct = (m.agua_total_l / m.peso_kg) * 100;
    const reparto =
      m.agua_intracelular_l !== null && m.agua_extracelular_l !== null
        ? ` De esa agua, ${n(m.agua_intracelular_l)} L están dentro de las células y ` +
          `${n(m.agua_extracelular_l)} L fuera. El compartimento intracelular acompaña a la masa ` +
          'celular activa, así que se lee junto al músculo.'
        : ' El aparato no separó el agua de dentro y la de fuera de las células en esta medición.';

    lecturas.push({
      id: 'agua',
      titulo: 'Cuánta agua tienes y dónde está',
      texto:
        `Tus ${n(m.agua_total_l)} L de agua son el ${n(pct)} % de tu peso, y son el componente ` +
        `más grande de tu cuerpo.${reparto} Esta cifra es también la que más se mueve entre dos ` +
        'días por la comida, la bebida y la hora de la medición.',
      fundamento: 'CKB 05 · compartimentos hídricos. CKB 10 · relación estructural músculo ↔ agua intracelular.',
    });
  }

  return lecturas;
}
