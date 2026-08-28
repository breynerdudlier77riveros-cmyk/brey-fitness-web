// ── Duplicados y divergencias (Sprint PAS-2.0) ─────────────────────────────
// Agrupa registros por prueba y fecha, y distingue tres situaciones que se
// parecen y significan cosas distintas:
//
//   · duplicado exacto     → el mismo hecho registrado dos veces
//   · resultado divergente → dos hechos incompatibles del mismo día
//   · repetición           → varios intentos, legítimos si la prueba los admite
//
// Ninguna de las tres se resuelve aquí (PAS-ADR-04). Se reportan.

import type { RegistroPrueba, ValorRegistro } from './tipos';

/** Clave canónica de un valor. Determinista y estable entre ejecuciones. */
export function claveValor(valor: ValorRegistro): string {
  switch (valor.tipo) {
    case 'continuo':
      return `continuo:${valor.valor}:${valor.unidad}`;
    case 'ordinal':
      return `ordinal:${valor.valor}/${valor.escala}`;
    case 'binario':
      return `binario:${valor.valor}`;
    case 'categorico':
      return `categorico:${valor.valor}`;
  }
}

export interface GrupoRegistros {
  pruebaId: string;
  fecha: string;
  /** El patrón que comparten. `null` en las pruebas que no lo declaran. */
  patron: string | null;
  registros: RegistroPrueba[];
  /** Valores distintos presentes en el grupo. */
  valoresDistintos: string[];
}

/**
 * Agrupa por `pruebaId` + `fecha` + `patron`. Solo se comparan registros del
 * MISMO día: dos resultados de fechas distintas no son incompatibles, son
 * evolución, y el PAS no interpreta evolución (`02-state-model.md`).
 *
 * ── EL PATRÓN ENTRA EN LA CLAVE, Y ES UNA CORRECCIÓN ──────────────────────
 *
 *   Antes la clave era solo prueba + fecha, y eso producía conflictos falsos
 *   en el caso más normal que existe. Visto en datos reales, un mismo día:
 *
 *     P-01 · 120 kg · Sentadilla
 *     P-01 · 100 kg · press banca
 *     P-01 ·  50 kg · Dominadas
 *     P-01 · 150 kg · Peso muerto
 *
 *   Cuatro 1RM que el motor declaraba «resultado divergente», como si fueran
 *   cuatro versiones incompatibles del mismo hecho. Son cuatro ejercicios
 *   distintos. Un peso muerto y un press de banca no se contradicen.
 *
 *   El propio catálogo ya lo decía: P-01 declara `requierePatron: true`, o
 *   sea que el patrón forma parte de la identidad de la medición. La clave no
 *   lo reflejaba.
 *
 *   Un `patron` nulo agrupa con los demás nulos, que es el comportamiento
 *   anterior para las pruebas que no lo piden.
 *
 * Los grupos salen ordenados para que dos ejecuciones produzcan la misma
 * lista.
 */
export function agrupar(registros: readonly RegistroPrueba[]): GrupoRegistros[] {
  const mapa = new Map<string, RegistroPrueba[]>();

  for (const registro of registros) {
    const clave = `${registro.pruebaId}|${registro.fecha}|${registro.patron ?? ''}`;
    const grupo = mapa.get(clave);
    if (grupo) grupo.push(registro);
    else mapa.set(clave, [registro]);
  }

  return [...mapa.entries()]
    .map(([clave, lista]) => {
      const [pruebaId, fecha, patron] = clave.split('|');
      const valores = [...new Set(lista.map((r) => claveValor(r.valor)))].sort();
      return {
        pruebaId,
        fecha,
        patron: patron === '' ? null : patron,
        registros: lista,
        valoresDistintos: valores,
      };
    })
    .sort(
      (a, b) =>
        a.pruebaId.localeCompare(b.pruebaId) ||
        a.fecha.localeCompare(b.fecha) ||
        (a.patron ?? '').localeCompare(b.patron ?? ''),
    );
}

/** Más de un registro con valor idéntico: el mismo hecho registrado dos veces. */
export function esDuplicadoExacto(grupo: GrupoRegistros): boolean {
  return grupo.registros.length > 1 && grupo.valoresDistintos.length === 1;
}

/**
 * Dos o más valores distintos para la misma prueba el mismo día.
 *
 * Que la prueba admita repetición NO elimina la divergencia: sigue habiendo
 * dos resultados incompatibles, y consolidarlos exigiría una regla —quedarse
 * con el mejor, promediar— que este motor tiene prohibida (I-07).
 */
export function esDivergente(grupo: GrupoRegistros): boolean {
  return grupo.valoresDistintos.length > 1;
}

/** Repetición sobre una prueba que no la admite. */
export function esRepeticionNoAdmitida(grupo: GrupoRegistros, repetible: boolean): boolean {
  return !repetible && grupo.registros.length > 1;
}

/** Ids de los registros de un grupo, ordenados. */
export function idsDe(grupo: GrupoRegistros): string[] {
  return grupo.registros.map((r) => r.id).sort();
}
