// ── Sembrar el plan gráfico (Sprint MAC-3) ─────────────────────────────────
//
// QUÉ SIEMBRA Y QUÉ NO.
//
//   Siembra RENGLONES: las bandas de periodo y etapa, y una fila por cada
//   contenido de preparación que el libro enumera. Todas VACÍAS.
//
//   No siembra ni una celda. Un plan recién creado se parece al cuadro que
//   todo entrenador reconoce, y no dice nada todavía — que es exactamente lo
//   que es: un plan sin escribir.
//
// ── POR QUÉ LAS CAPACIDADES NACEN COMO MARCAS ────────────────────────────
//
//   Porque es como se rellenan en el plan gráfico: una `X` donde la capacidad
//   se trabaja esa semana y un `=` donde se mantiene. Nacer como número
//   obligaría a inventar una cifra para decir «esta semana sí», que es
//   justamente lo que no se puede hacer.
//
//   Cualquier fila puede pasarse a porcentaje después, y entonces el reparto
//   por direcciones del capítulo 6 del libro se escribe encima. Eso es una
//   decisión del entrenador, no un supuesto del sistema.

import { bandaNueva, contenidoVacio, filaNueva, tramoNuevo } from './contenido';
import { mesociclosDelModelo, modeloDe } from './modelos';
import { nuevoId } from './contenido';
import { ETAPAS, GRUPOS_CAPACIDADES, PERIODOS } from './taxonomia';
import type { ContenidoMacrociclo } from './tipos';

/**
 * Las dos filas que van a la curva de carga, con los colores del plan gráfico
 * clásico: volumen en azul, intensidad en rojo.
 */
const FILAS_DE_CARGA = [
  { nombre: 'Volumen', tipo: 'numero' as const, unidad: '', grafico: '#3b82f6' },
  { nombre: 'Intensidad', tipo: 'porcentaje' as const, unidad: '%', grafico: '#ef4444' },
];

/**
 * El esqueleto del plan gráfico: bandas de periodo y etapa, y las filas de
 * todos los contenidos de preparación.
 *
 * Los tramos de las bandas se reparten a partes iguales entre los tipos del
 * catálogo. NO es una recomendación de duración: es visiblemente neutro, y se
 * ve a simple vista que hay que ajustarlo. Cuánto dura cada periodo ES la
 * decisión del entrenador, y el libro no publica una respuesta única.
 */
export function sembrarPlanGrafico(semanas: number): ContenidoMacrociclo {
  const n = Math.max(1, Math.trunc(semanas));

  const filas = [
    ...FILAS_DE_CARGA.map((f) => filaNueva(f.nombre, n, f.tipo, f.unidad, f.grafico, null)),
    ...GRUPOS_CAPACIDADES.flatMap((g) =>
      g.capacidades.map((c) => filaNueva(c, n, 'marca', '', null, g.id)),
    ),
    filaNueva('Contenidos', n, 'texto', '', null, null),
    filaNueva('Observaciones', n, 'texto', '', null, null),
  ];

  return {
    ...contenidoVacio(n),
    bandas: [
      bandaNueva(
        'Periodo',
        repartirEnTramos(
          n,
          PERIODOS.map((p) => ({ nombre: p.nombre, color: p.color, tipoId: p.id })),
        ),
      ),
      bandaNueva(
        'Etapa',
        repartirEnTramos(
          n,
          ETAPAS.map((e) => ({ nombre: e.nombre, color: e.color, tipoId: e.id })),
        ),
      ),
    ],
    filas,
  };
}

/** Como `sembrarPlanGrafico`, pero con los mesociclos de un modelo encima. */
export function sembrarConModelo(semanas: number, modeloId: string): ContenidoMacrociclo | null {
  const modelo = modeloDe(modeloId);
  if (modelo === null) return null;

  const base = sembrarPlanGrafico(semanas);
  return { ...base, mesociclos: mesociclosDelModelo(modelo.id, semanas, nuevoId) };
}

/**
 * Reparte `total` semanas entre unos cuantos tramos, a partes iguales.
 *
 * Con menos semanas que tramos, los últimos se quedan fuera en vez de crear
 * tramos de cero semanas: un tramo que no ocupa ninguna semana rompe la
 * invariante y no se puede pintar.
 */
export function repartirEnTramos(
  total: number,
  plantillas: readonly { nombre: string; color: string; tipoId: string }[],
) {
  const n = Math.max(0, Math.trunc(total));
  if (n === 0 || plantillas.length === 0) return [];

  const cuantos = Math.min(n, plantillas.length);
  const base = Math.floor(n / cuantos);
  const resto = n % cuantos;

  return plantillas
    .slice(0, cuantos)
    .map((p, i) => tramoNuevo(p.nombre, base + (i < resto ? 1 : 0), p.color, p.tipoId));
}
