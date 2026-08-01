// ── Tendencias históricas (Sprint I-03) ────────────────────────────────────
// Deliberadamente descriptivas, no estadísticas: NO hay regresión, ni
// suavizado, ni proyección, ni extrapolación. El BCS Handbook (07) solo
// especifica el mínimo de puntos para dibujar una línea (2 Mediciones
// vigentes con la variable presente); no define cómo etiquetar una serie
// como "ascendente" o "estable". Por eso el criterio de abajo es el mínimo
// razonable —comparar los deltas consecutivos— y cada resultado lleva en su
// `razon` la advertencia de que describe lo observado, sin afirmar que
// vaya a continuar.
//
// Consecuencia importante: `estable` solo se emite cuando el dato lo prueba
// sin necesidad de un número inventado — o todos los deltas son exactamente
// 0, o la variable tiene umbral documentado (Peso, % grasa) y todo el
// movimiento cabe dentro de él. Una serie que se mueve poco en una variable
// sin umbral se etiqueta `variable`, nunca `estable`.

import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import type { Medicion } from '@/lib/bcs/tipos';
import type { EstadoTendencia, Suficiencia, TendenciaMetrica } from './tipos';

const VARIABLES = Object.keys(CATALOGO) as VariableId[];

interface Resuelto {
  estado: EstadoTendencia;
  razon: string;
}

function resolverEstado(valores: number[], etiqueta: string, umbral: number | undefined): Resuelto {
  const deltas = valores.slice(1).map((v, i) => v - valores[i]);
  const cambioNeto = valores[valores.length - 1] - valores[0];

  if (deltas.every((d) => d === 0)) {
    return { estado: 'estable', razon: `${etiqueta} registró el mismo valor en las ${valores.length} mediciones usadas.` };
  }

  if (umbral !== undefined && deltas.every((d) => Math.abs(d) < umbral) && Math.abs(cambioNeto) < umbral) {
    return {
      estado: 'estable',
      razon: `Todo el movimiento de ${etiqueta} entre mediciones se mantuvo por debajo del umbral de ${umbral} definido para esta variable.`,
    };
  }

  const subeSiempre = deltas.every((d) => d >= 0);
  const bajaSiempre = deltas.every((d) => d <= 0);

  if (subeSiempre && cambioNeto > 0) {
    return {
      estado: 'ascendente',
      razon: `${etiqueta} subió o se mantuvo en cada intervalo de las ${valores.length} mediciones usadas. Describe lo observado, no anticipa lo que vendrá.`,
    };
  }

  if (bajaSiempre && cambioNeto < 0) {
    return {
      estado: 'descendente',
      razon: `${etiqueta} bajó o se mantuvo en cada intervalo de las ${valores.length} mediciones usadas. Describe lo observado, no anticipa lo que vendrá.`,
    };
  }

  return {
    estado: 'variable',
    razon: `${etiqueta} subió en unos intervalos y bajó en otros, sin una dirección sostenida en las ${valores.length} mediciones usadas.`,
  };
}

/**
 * Calcula la tendencia de cada variable sobre el histórico completo.
 *
 * @param historicoAsc Mediciones ordenadas de la MÁS ANTIGUA a la más
 *   reciente. El orden lo garantiza el orquestador; esta función no reordena
 *   ni muta lo que recibe.
 */
export function calcularTendencias(historicoAsc: readonly Medicion[]): TendenciaMetrica[] {
  return VARIABLES.map((variable) => {
    const def = CATALOGO[variable];
    const valores = historicoAsc
      .map((m) => m[variable])
      .filter((v): v is number => v !== null && v !== undefined);

    const base = {
      variable,
      etiqueta: def.etiqueta,
      unidad: def.unidad,
      puntosUsados: valores.length,
    };

    if (valores.length === 0) {
      return {
        ...base,
        estado: 'insuficiente' as EstadoTendencia,
        primerValor: null,
        ultimoValor: null,
        cambioNeto: null,
        suficiencia: 'sin_datos' as Suficiencia,
        razon: `No hay ningún registro de ${def.etiqueta} en el histórico.`,
      };
    }

    const primerValor = valores[0];
    const ultimoValor = valores[valores.length - 1];

    if (valores.length === 1) {
      return {
        ...base,
        estado: 'insuficiente' as EstadoTendencia,
        primerValor,
        ultimoValor,
        cambioNeto: null,
        suficiencia: 'insuficiente' as Suficiencia,
        razon: `Solo hay una medición con ${def.etiqueta} registrada: se necesitan al menos 2 para hablar de evolución.`,
      };
    }

    const cambioNeto = ultimoValor - primerValor;

    // Con exactamente 2 puntos hay dirección, pero no una tendencia
    // sostenida — el handbook exige 2 Mediciones para dibujar la línea, no
    // para afirmar que la serie "va" hacia algún lado.
    if (valores.length === 2) {
      const estado: EstadoTendencia =
        cambioNeto === 0 ? 'estable' : cambioNeto > 0 ? 'ascendente' : 'descendente';
      return {
        ...base,
        estado,
        primerValor,
        ultimoValor,
        cambioNeto,
        suficiencia: 'parcial' as Suficiencia,
        razon: `Comparación entre las 2 únicas mediciones con ${def.etiqueta} registrada. Con dos puntos se describe la diferencia entre ellos, no una tendencia sostenida.`,
      };
    }

    const { estado, razon } = resolverEstado(valores, def.etiqueta, def.umbralInsignificante);
    return {
      ...base,
      estado,
      primerValor,
      ultimoValor,
      cambioNeto,
      suficiencia: 'suficiente' as Suficiencia,
      razon,
    };
  });
}
