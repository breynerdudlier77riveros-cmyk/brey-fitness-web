// ── Reglas de interpretación (Sprint PAS-9) ────────────────────────────────
//
// Catálogo declarativo. Cada regla reconoce una situación y redacta una frase
// escrita a mano. **No hay generación libre de lenguaje**: misma entrada, misma
// salida, siempre.
//
// LAS DOS REGLAS QUE GOBIERNAN A LAS DEMÁS:
//
//   1 · Ninguna frase clasifica. Se describe DÓNDE cae el valor, nunca qué
//       vale. «Entre el percentil 90 y el 97» es una posición medida; «tu
//       fuerza es alta» es una categoría que exigiría un punto de corte que
//       la NKB no admite.
//
//   2 · Toda frase que pueda leerse de más lleva su límite. Un cambio respecto
//       a uno mismo no describe la población; un objetivo cumplido no es una
//       norma. El límite es lo que impide que el lector complete la frase mal.
//
// El orden dentro de cada eje importa: se aplica la primera regla que
// reconozca la situación, y las más específicas van antes.

import { metaDe, type ResultadoHumano } from '@/lib/pas/informe-humano';
import type { MotivoRuptura } from '@/lib/pas/seguimiento';

import type { Regla } from './tipos';

/** Número con coma decimal, sin ceros de relleno. Solo presentación. */
function num(v: number): string {
  return v.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
}

const LIMITE_LONGITUDINAL =
  'Un cambio respecto a tu propia medición anterior no describe tu posición respecto a ninguna ' +
  'población.';

// «quien entrena» decía lo correcto, pero contiene un verbo que el propio
// filtro de prescripción caza — y una frase que necesita explicar por qué no es
// lo que parece está mal escrita. El profesional es quien lo fija, y punto.
const LIMITE_OBJETIVO =
  'Un objetivo lo fija el profesional, no una población de referencia: cumplirlo no equivale a ' +
  'situarse en ningún percentil.';

// ════════════════════════════════════════════════════════════════════════════
// EJE NORMATIVO
// ════════════════════════════════════════════════════════════════════════════

/**
 * Si la capa de evidencia tiene algo que decir sobre el eje normativo.
 *
 * LAS REGLAS DE AUSENCIA CALLAN CUANDO ELLA HABLA (PAS-10E.1).
 *
 * N-05, N-06 y N-07 se escribieron cuando la NKB era la única fuente, así que
 * su «no existe referencia» significaba «no existe nada». Ya no: la capa de
 * evidencia cubre las diez pruebas que la NKB no alcanza, y puede tener
 * fiabilidad, una referencia de otra población o un dato que falta.
 *
 * Sin este guardián, una tarjeta de salto llegaba a decir tres veces que no
 * había referencia —la interpretación, el bloque normativo y el de evidencia—
 * antes de mencionar la fiabilidad que sí existía. El atleta leía tres noes
 * seguidos y abandonaba antes del sí.
 */
function evidenciaAporta(r: ResultadoHumano): boolean {
  return r.evidencia.estado !== 'SIN_EVIDENCIA_UTILIZABLE';
}

export const REGLAS_NORMATIVAS: readonly Regla<ResultadoHumano>[] = [
  {
    id: 'N-01',
    eje: 'normativo',
    cuando: 'El valor coincide exactamente con un percentil publicado',
    aplica: (r) => r.referencia.estado === 'DISPONIBLE' && r.referencia.clase === 'percentil',
    redactar: (r) => ({
      texto:
        `Tu resultado coincide con el ${r.referencia.resumen} publicado para ` +
        `${r.referencia.poblacion}.`,
      limite: null,
    }),
  },
  {
    id: 'N-02',
    eje: 'normativo',
    cuando: 'El valor cae entre dos percentiles publicados',
    aplica: (r) => r.referencia.estado === 'DISPONIBLE' && r.referencia.clase === 'intervalo',
    redactar: (r) => ({
      texto:
        `Tu resultado se sitúa ${r.referencia.resumen} de la referencia disponible para ` +
        `${r.referencia.poblacion}.`,
      // El límite de esta regla es el corazón del proyecto: no se estima un
      // percentil intermedio porque la fuente no lo publica.
      limite:
        'La fuente no publica valores entre esos dos percentiles, así que no se estima ninguno ' +
        'intermedio.',
    }),
  },
  {
    id: 'N-03',
    eje: 'normativo',
    cuando: 'El valor queda fuera del intervalo publicado',
    aplica: (r) => r.referencia.estado === 'DISPONIBLE' && r.referencia.clase === 'fuera_de_rango',
    redactar: (r) => ({
      texto:
        `Tu resultado queda ${r.referencia.resumen} de la referencia disponible para ` +
        `${r.referencia.poblacion}.`,
      limite:
        'La fuente no publica valores más allá de ese punto, así que no se extrapola hasta dónde ' +
        'llegaría.',
    }),
  },
  {
    id: 'N-04',
    eje: 'normativo',
    cuando: 'La referencia publica media y dispersión, no percentiles',
    aplica: (r) => r.referencia.estado === 'DISPONIBLE' && r.referencia.clase === 'distancia_media',
    redactar: (r) => ({
      texto:
        `Respecto a ${r.referencia.poblacion}, tu resultado está a ${r.referencia.resumen} de la ` +
        'media publicada.',
      // El error más tentador de todo el sistema: convertir esa distancia en
      // un percentil exigiría asumir una distribución que la fuente niega.
      limite:
        'Esta referencia publica la media y su dispersión, no percentiles. La distancia a la media ' +
        'no equivale a una posición percentil.',
    }),
  },
  {
    id: 'N-05',
    eje: 'normativo',
    cuando: 'No se sabe si hay referencia: falta declarar el método',
    aplica: (r) => r.referencia.estado === 'NO_DETERMINABLE' && !evidenciaAporta(r),
    redactar: () => ({
      texto:
        'No puede determinarse si existe una referencia comparable, porque no consta cómo se tomó ' +
        'la medición.',
      limite:
        'Esto no significa que no exista referencia: significa que falta el dato para saberlo. ' +
        'Declarando el método, la comparación podría hacerse.',
    }),
  },
  {
    id: 'N-06',
    eje: 'normativo',
    cuando: 'Hay referencias de la variable, pero ninguna comparable con el método',
    aplica: (r) => r.referencia.estado === 'NO_COMPARABLE' && !evidenciaAporta(r),
    redactar: () => ({
      texto:
        'Existen referencias para esta prueba, pero ninguna es comparable con el método empleado.',
      limite:
        'Dos instrumentos distintos no miden lo mismo aunque den la misma unidad. El resultado ' +
        'sigue siendo válido para seguir tu evolución.',
    }),
  },
  {
    id: 'N-07',
    eje: 'normativo',
    cuando: 'No existe ninguna referencia compatible',
    aplica: (r) => r.referencia.estado === 'SIN_REFERENCIA' && !evidenciaAporta(r),
    redactar: () => ({
      texto: 'No existe actualmente una referencia normativa compatible.',
      // El punto que el encargo subraya: sin norma no es sin análisis.
      limite:
        'La ausencia de referencia no invalida la medición: el resultado se conserva para ' +
        'seguimiento longitudinal.',
    }),
  },
];

// ════════════════════════════════════════════════════════════════════════════
// EJE LONGITUDINAL
// ════════════════════════════════════════════════════════════════════════════

/** Por qué se cortó la serie justo antes de la medición actual, si se cortó. */
function ultimaRuptura(r: ResultadoHumano): MotivoRuptura | null {
  return r.serie.rupturas[r.serie.rupturas.length - 1]?.motivo ?? null;
}

export const REGLAS_LONGITUDINALES: readonly Regla<ResultadoHumano>[] = [
  {
    id: 'L-01',
    eje: 'longitudinal',
    cuando: 'Hay medición anterior comparable y el valor subió',
    aplica: (r) => r.tendencia.disponible && (r.tendencia.cambioAbsoluto ?? 0) > 0,
    redactar: (r) => ({
      texto:
        `Respecto a tu medición del ${r.tendencia.fechaAnterior}, el valor aumentó ` +
        `${num(r.tendencia.cambioAbsoluto!)} ${r.unidad}.`,
      limite: LIMITE_LONGITUDINAL,
    }),
  },
  {
    id: 'L-02',
    eje: 'longitudinal',
    cuando: 'Hay medición anterior comparable y el valor bajó',
    aplica: (r) => r.tendencia.disponible && (r.tendencia.cambioAbsoluto ?? 0) < 0,
    redactar: (r) => ({
      texto:
        `Respecto a tu medición del ${r.tendencia.fechaAnterior}, el valor disminuyó ` +
        `${num(Math.abs(r.tendencia.cambioAbsoluto!))} ${r.unidad}.`,
      // Deliberadamente sin adjetivo. Una bajada puede deberse a fatiga, a la
      // hora del día o a la fase de entrenamiento, y el motor no lo sabe.
      limite:
        `${LIMITE_LONGITUDINAL} Una sola comparación tampoco establece una tendencia: haría falta ` +
        'más de un punto.',
    }),
  },
  {
    id: 'L-03',
    eje: 'longitudinal',
    cuando: 'Hay medición anterior comparable y el valor es idéntico',
    aplica: (r) => r.tendencia.disponible && r.tendencia.cambioAbsoluto === 0,
    redactar: (r) => ({
      texto: `El valor es el mismo que en tu medición del ${r.tendencia.fechaAnterior}.`,
      limite: LIMITE_LONGITUDINAL,
    }),
  },
  {
    id: 'L-04',
    eje: 'longitudinal',
    cuando: 'Hay mediciones anteriores, pero con otro método',
    // PAS-10: la condición se lee de la serie, no de una subcadena del motivo.
    // Reconocer una situación por el texto que la describe ata la regla a la
    // redacción, y basta reescribir una frase para que la regla deje de saltar
    // sin que nada falle.
    aplica: (r) => !r.tendencia.disponible && ultimaRuptura(r) === 'metodo',
    redactar: () => ({
      texto:
        'Hay mediciones anteriores de esta prueba, pero se tomaron con otro método y no pueden ' +
        'compararse entre sí.',
      limite:
        'Comparar valores obtenidos con protocolos distintos describiría el cambio de instrumento, ' +
        'no el del atleta.',
    }),
  },
  {
    id: 'L-06',
    eje: 'longitudinal',
    cuando: 'Hay mediciones anteriores, pero registradas en otra unidad',
    aplica: (r) => !r.tendencia.disponible && ultimaRuptura(r) === 'unidad',
    redactar: () => ({
      texto:
        'Hay mediciones anteriores de esta prueba, pero se registraron en otra unidad y no pueden ' +
        'compararse entre sí.',
      // El caso que PAS-8 escondía: decía «no hay medición anterior», que era
      // falso. Las hay; lo que no hay es una conversión que este sistema pueda
      // aplicar sin que alguien la autorice.
      limite:
        'Convertir entre unidades sin una equivalencia autorizada introduciría un valor que nadie ' +
        'midió.',
    }),
  },
  {
    id: 'L-05',
    eje: 'longitudinal',
    cuando: 'Es la primera medición de esta prueba',
    aplica: (r) => !r.tendencia.disponible,
    redactar: () => ({
      texto: 'Es la primera medición registrada de esta prueba.',
      limite: 'A partir de la siguiente podrá compararse tu evolución.',
    }),
  },
];

// ════════════════════════════════════════════════════════════════════════════
// EJE DE OBJETIVO
// ════════════════════════════════════════════════════════════════════════════

/**
 * «Tu objetivo es X», con X resuelto sea valor o rango.
 *
 * Cuando el objetivo no declara ninguna meta, la frase lo dice en vez de dejar
 * un hueco: un objetivo sin meta declarada es un dato del expediente, no un
 * fallo de redacción que haya que disimular.
 */
function enunciarObjetivo(r: ResultadoHumano): string {
  const o = r.objetivo.objetivo!;
  const meta = metaDe(o);
  return meta === null
    ? `Tienes declarado el objetivo «${o.nombre}».`
    : `Tu objetivo es ${meta} («${o.nombre}»).`;
}

export const REGLAS_OBJETIVO: readonly Regla<ResultadoHumano>[] = [
  {
    id: 'O-01',
    eje: 'objetivo',
    cuando: 'El valor alcanzó o superó el objetivo declarado',
    aplica: (r) => r.objetivo.disponible && r.objetivo.progreso === 1,
    redactar: (r) => ({
      texto:
        (r.objetivo.superado
          ? `Has superado el objetivo «${r.objetivo.objetivo!.nombre}»: `
          : `Has alcanzado el objetivo «${r.objetivo.objetivo!.nombre}»: `) +
        `${metaDe(r.objetivo.objetivo!)}.`,
      limite: LIMITE_OBJETIVO,
    }),
  },
  {
    id: 'O-02',
    eje: 'objetivo',
    cuando: 'Hay progreso calculable hacia el objetivo',
    aplica: (r) => r.objetivo.disponible && r.objetivo.progreso !== null,
    redactar: (r) => ({
      texto:
        `Llevas el ${Math.round(r.objetivo.progreso! * 100)} % del recorrido hacia ` +
        `«${r.objetivo.objetivo!.nombre}» (${metaDe(r.objetivo.objetivo!)}).`,
      limite: LIMITE_OBJETIVO,
    }),
  },
  // ── Mantenimiento (§13) ──────────────────────────────────────────────────
  //
  // Van antes que las de motivo porque describen un caso CALCULABLE: hay
  // respuesta, solo que no es un porcentaje. Convertir «dentro del rango» en
  // «100 % del recorrido» sería inventar un trayecto que nadie se propuso.
  ...(
    [
      [
        'O-10',
        'dentro',
        'El valor se mantiene dentro del rango declarado',
        'sigue dentro del rango que te propusiste',
      ],
      [
        'O-11',
        'por_encima',
        'El valor queda por encima del rango declarado',
        'queda por encima del rango que te propusiste',
      ],
      [
        'O-12',
        'por_debajo',
        'El valor queda por debajo del rango declarado',
        'queda por debajo del rango que te propusiste',
      ],
    ] as const
  ).map(([id, posicion, cuando, frase]) => ({
    id,
    eje: 'objetivo' as const,
    cuando,
    aplica: (r: ResultadoHumano) => r.objetivo.disponible && r.objetivo.mantenimiento === posicion,
    redactar: (r: ResultadoHumano) => ({
      texto: `Tu resultado ${frase}: ${metaDe(r.objetivo.objetivo!)}.`,
      // Quedar fuera del rango no se adjetiva: puede deberse a la fase de
      // entrenamiento, a la hora de la medición o a que el rango se fijó para
      // otro momento del año, y el motor no sabe cuál de las tres.
      limite:
        `${LIMITE_OBJETIVO} Un rango de mantenimiento describe una decisión de entrenamiento, no ` +
        'un intervalo de referencia poblacional.',
    }),
  })),

  // ── Objetivo declarado, pero el avance no es expresable ───────────────────
  //
  // PAS-8 tenía aquí una sola regla que atribuía SIEMPRE la ausencia de
  // porcentaje a que faltaba el punto de partida. Con seis motivos posibles eso
  // era, cinco veces de cada seis, una explicación falsa. Cada motivo tiene
  // ahora su frase, y la del catálogo no culpa a quien fijó el objetivo.
  ...(
    [
      [
        'O-03',
        'SIN_PUNTO_DE_PARTIDA',
        'Hay objetivo, pero sin punto de partida declarado',
        'El objetivo no declara desde qué valor se partía, así que el avance no puede expresarse ' +
          'como porcentaje.',
      ],
      [
        'O-05',
        'SIN_DIRECCION_DECLARADA',
        'Hay objetivo, pero el catálogo no declara hacia dónde mejora la prueba',
        'Esta prueba no tiene una única dirección de mejora declarada, así que no puede decirse ' +
          'qué lado del recorrido es avance. El par de valores sigue siendo el dato.',
      ],
      [
        'O-06',
        'DIRECCION_CONTRADICE_OBJETIVO',
        'El objetivo declarado va en sentido contrario al de la prueba',
        'El objetivo apunta en sentido contrario al de la prueba. Hasta que se resuelva, un ' +
          'porcentaje diría lo contrario de lo que ocurre.',
      ],
      [
        'O-07',
        'UNIDADES_INCOMPATIBLES',
        'El objetivo y la medición están en unidades distintas',
        'El objetivo está en otra unidad que la medición, y convertir entre ellas sin una ' +
          'equivalencia autorizada introduciría un valor que nadie fijó.',
      ],
      [
        'O-08',
        'RECORRIDO_NULO',
        'El punto de partida y el objetivo coinciden',
        'El punto de partida y el objetivo coinciden, así que no hay recorrido del que expresar ' +
          'una fracción.',
      ],
      [
        'O-09',
        'SIN_MEDICION_ACTUAL',
        'Hay objetivo, pero ninguna medición compatible con la que evaluarlo',
        'Todavía no hay una medición compatible con este objetivo. El objetivo sigue activo.',
      ],
      [
        'O-13',
        'SIN_VALOR_OBJETIVO',
        'El objetivo no declara qué valor se persigue',
        'El objetivo no declara qué valor se persigue, así que no hay meta contra la que medir el ' +
          'avance.',
      ],
      [
        'O-14',
        'SIN_RANGO_DEFINIDO',
        'Es un objetivo de mantenimiento sin rango declarado',
        'Es un objetivo de mantenimiento y no declara entre qué valores. Elegir un rango sería ' +
          'fijar el objetivo en lugar del profesional.',
      ],
      [
        'O-15',
        'RANGO_INVERTIDO',
        'El rango declarado tiene el mínimo por encima del máximo',
        'El rango declarado tiene el mínimo por encima del máximo. Darle la vuelta supondría ' +
          'decidir cuál de los dos extremos se escribió mal.',
      ],
    ] as const
  ).map(([id, codigo, cuando, limite]) => ({
    id,
    eje: 'objetivo' as const,
    cuando,
    aplica: (r: ResultadoHumano) =>
      r.objetivo.disponible && r.objetivo.motivoCodigo === codigo,
    redactar: (r: ResultadoHumano) => ({
      texto: enunciarObjetivo(r),
      limite,
    }),
  })),
  {
    id: 'O-04',
    eje: 'objetivo',
    cuando: 'Hay más de un objetivo activo para la misma prueba',
    aplica: (r) => !r.objetivo.disponible && (r.objetivo.motivo ?? '').includes('más de un'),
    redactar: () => ({
      texto: 'Hay más de un objetivo activo para esta prueba.',
      limite: 'Mientras haya varios, el sistema no elige cuál seguir.',
    }),
  },
];

/** Todas, para auditar la cobertura y los identificadores. */
export const TODAS_LAS_REGLAS: readonly Regla<ResultadoHumano>[] = [
  ...REGLAS_NORMATIVAS,
  ...REGLAS_LONGITUDINALES,
  ...REGLAS_OBJETIVO,
];
