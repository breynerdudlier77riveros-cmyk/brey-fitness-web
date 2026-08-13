// ── NIE-1.4 · comparación estructurada de candidatas ───────────────────────
//
// Describe **en qué se diferencian** dos o más normas. No declara cuál es
// mejor, no las ordena y no propone ninguna.
//
// La diferencia entre describir y recomendar es todo el módulo: aquí se puede
// decir «existen dos normas aplicables con distinto tipo normativo», y no se
// puede decir «la TN-2 es superior».
//
// Módulo puro.

import type {
  Candidata,
  CategoriaDiferencia,
  ComparacionCandidatas,
  Diferencia,
} from './tipos';

/** Un campo comparable: cómo se lee de una candidata y qué clase de diferencia produce. */
interface CampoComparable {
  campo: string;
  categoria: CategoriaDiferencia;
  leer: (c: Candidata) => string;
  /** Qué implica que difieran. Nunca cuál conviene. */
  nota: string;
}

const CAMPOS: readonly CampoComparable[] = [
  {
    campo: 'variable',
    categoria: 'identidad',
    leer: (c) => c.variable,
    nota: 'Describen variables distintas: no son normas alternativas para lo mismo',
  },
  {
    campo: 'poblacion',
    categoria: 'identidad',
    leer: (c) => `${c.pais} · ${c.poblacion}`,
    nota: 'Describen poblaciones distintas. La pertenencia poblacional la decide quien evalúa, no este motor',
  },
  {
    campo: 'estrato',
    categoria: 'identidad',
    leer: (c) => c.estrato,
    nota: 'Corresponden a estratos distintos dentro de su población',
  },
  {
    campo: 'instrumento',
    categoria: 'metodologica',
    leer: (c) => c.instrumento,
    nota: 'Instrumentos distintos. La relación por defecto entre métodos es EQ-3: no son intercambiables',
  },
  {
    campo: 'tipo_normativo',
    categoria: 'tipo_normativo',
    leer: (c) => c.tipo,
    nota: 'Tipos de norma distintos. Afirman cosas distintas sobre la misma distribución y ambas pueden ser ciertas a la vez',
  },
  {
    campo: 'unidad',
    categoria: 'unidad',
    leer: (c) => c.unidad,
    nota: 'Unidades distintas. La NKB no convierte, de modo que sus valores no son comparables entre sí',
  },
  {
    campo: 'calidad',
    categoria: 'calidad',
    leer: (c) => c.calidad,
    nota: 'Distinto grado de respaldo de la evidencia. La calidad no establece prioridad de uso',
  },
  {
    campo: 'n_celda',
    categoria: 'calidad',
    leer: (c) => (c.nCelda === null ? 'no consta' : String(c.nCelda)),
    nota: 'Distinta cantidad de evidencia en la celda concreta. No existe umbral de N ni ponderación por él',
  },
  {
    campo: 'estado',
    categoria: 'estado',
    leer: (c) => c.estadoNorma,
    nota: 'Distinto estado en la NKB. Una norma cuestionada sigue siendo utilizable con su advertencia delante',
  },
  {
    campo: 'conflicto',
    categoria: 'estado',
    leer: (c) => c.conflicto,
    nota: 'Solo una arrastra un conflicto declarado por la NKB. El motor lo propaga; no lo resuelve',
  },
  {
    campo: 'procedencia',
    categoria: 'procedencia',
    leer: (c) => c.procedencia.referencia,
    nota: 'Proceden de fuentes primarias distintas',
  },
  {
    campo: 'restricciones',
    categoria: 'identidad',
    leer: (c) => [...c.restricciones].join(' · '),
    nota: 'Los estudios incluyeron y excluyeron a personas distintas',
  },
];

function redactarResumen(
  n: number,
  coincidencias: readonly string[],
  diferencias: readonly Diferencia[],
): string {
  if (n === 0) return 'No hay candidatas que comparar.';
  if (n === 1) return 'Una sola candidata: no hay comparación que hacer.';
  if (diferencias.length === 0) {
    return `${n} candidatas que coinciden en todas las coordenadas comparadas.`;
  }

  const categorias = [...new Set(diferencias.map((d) => d.categoria))];
  const campos = diferencias.map((d) => d.campo).join(', ');
  return (
    `${n} candidatas que coinciden en ${coincidencias.length} coordenadas y difieren en ` +
    `${diferencias.length} (${campos}). Categorías: ${categorias.join(', ')}. ` +
    'La elección entre ellas no corresponde a este motor.'
  );
}

/**
 * Compara candidatas campo a campo.
 *
 * Cada campo produce o bien una coincidencia o bien una diferencia clasificada.
 * **No existe la categoría «mejor»** y no debe añadirse: en cuanto exista,
 * alguien la usará para ordenar.
 */
export function compararCandidatas(
  candidatas: readonly Candidata[],
): ComparacionCandidatas {
  const normas = candidatas.map((c) => c.normaId);
  const coincidencias: string[] = [];
  const diferencias: Diferencia[] = [];

  if (candidatas.length >= 2) {
    for (const campo of CAMPOS) {
      const porNorma = Object.fromEntries(
        candidatas.map((c) => [c.normaId, campo.leer(c)]),
      ) as Record<string, string>;

      const distintos = new Set(Object.values(porNorma));
      if (distintos.size === 1) coincidencias.push(campo.campo);
      else {
        diferencias.push({
          campo: campo.campo,
          categoria: campo.categoria,
          porNorma,
          nota: campo.nota,
        });
      }
    }
  }

  return {
    normas,
    coincidencias,
    diferencias,
    resumen: redactarResumen(candidatas.length, coincidencias, diferencias),
  };
}

/**
 * Diferencia de valores entre dos normas.
 *
 * **Que dos normas publiquen valores distintos NO es un conflicto.** Puede
 * deberse a población, método, estrato o tipo distintos, que es lo habitual.
 * El conflicto lo establece la NKB y solo ella (`22`, `40`): este motor no lo
 * descubre comparando números, y por eso esta función devuelve una descripción
 * y nunca un veredicto.
 */
export function describirDiferenciaDeValores(a: Candidata, b: Candidata): string {
  if (a.unidad !== b.unidad) {
    return (
      `Los valores de ${a.normaId} (${a.unidad}) y ${b.normaId} (${b.unidad}) están en unidades ` +
      'distintas y no son comparables. La NKB no convierte.'
    );
  }
  if (a.valores.tipo !== b.valores.tipo) {
    return (
      `${a.normaId} publica ${a.valores.tipo} y ${b.normaId} publica ${b.valores.tipo}. ` +
      'No afirman lo mismo sobre la distribución, de modo que sus valores no se contraponen.'
    );
  }
  const conflicto = a.conflicto !== 'ninguno' || b.conflicto !== 'ninguno';
  return conflicto
    ? 'La NKB declara un conflicto sobre alguna de estas normas. La advertencia viaja con la candidata y no se resuelve aquí.'
    : 'Publican valores distintos. Difieren en alguna coordenada, y eso no constituye conflicto normativo.';
}
