// ── El panel del FMS por sus siete pruebas (Sprint PAS-8.x) ────────────────
//
// El FMS de Cook, Burton y Hoogenboom (2006) no es un número: es la suma de
// siete pruebas puntuadas de 0 a 3, y cinco de esas siete se puntúan a cada
// lado y toman EL MÁS BAJO como resultado de la prueba — así lo publica el
// protocolo, no una regla de este sistema. Esa composición es aritmética
// sobre las propias mediciones del atleta, no una comparación con ninguna
// población, y por eso vive aquí con la misma excepción que ya cubren
// `tendenciaDe` y el panel de McGill.
//
// ── POR QUÉ EL TOTAL NO LLEVA NINGUNA ETIQUETA ────────────────────────────
//
//   La PKB ya lo dice para P-09 (`docs/performance-knowledge-base/
//   02-pruebas.md`): tres revisiones sistemáticas independientes coinciden en
//   que la puntuación compuesta no respalda predecir lesión, y el punto de
//   corte de 14 está expresamente PROHIBIDO como umbral de riesgo
//   (`moran_fms_2017`). Este módulo suma los siete números y se detiene ahí:
//   ni «riesgo», ni «bien», ni «mal».
//
// Módulo puro.

import type { PanelFms, PruebaFms } from './tipos';

export interface MedicionFms {
  pruebaId: string;
  valor: number;
  condiciones: Readonly<Record<string, string>>;
}

/** Las 7 pruebas, en el orden de Cook (2006). `bilateral` = se puntúa a cada lado. */
const PRUEBAS_FMS: readonly { id: string; bilateral: boolean }[] = [
  { id: 'P-24', bilateral: false }, // Sentadilla profunda
  { id: 'P-25', bilateral: true }, // Paso de valla
  { id: 'P-26', bilateral: true }, // Zancada en línea
  { id: 'P-27', bilateral: true }, // Movilidad de hombro
  { id: 'P-28', bilateral: true }, // Elevación de pierna recta
  { id: 'P-29', bilateral: false }, // Estabilidad de tronco
  { id: 'P-30', bilateral: true }, // Estabilidad rotatoria
];

/**
 * La puntuación final de una prueba, o `null` si falta.
 *
 * Con más de un registro se toma el ÚLTIMO, el mismo criterio que el resto
 * del sistema usa para un registro repetido. En una bilateral, sin los DOS
 * lados no hay mínimo que tomar: no se compone con uno solo.
 */
function puntuacionFinal(
  mediciones: readonly MedicionFms[],
  prueba: { id: string; bilateral: boolean },
): number | null {
  const registros = mediciones.filter((m) => m.pruebaId === prueba.id);

  if (!prueba.bilateral) {
    return registros.length === 0 ? null : registros[registros.length - 1].valor;
  }

  const ultimaDeLado = (lado: string): number | null => {
    const deLado = registros.filter((m) => m.condiciones.lado === lado);
    return deLado.length === 0 ? null : deLado[deLado.length - 1].valor;
  };
  const derecho = ultimaDeLado('derecho');
  const izquierdo = ultimaDeLado('izquierdo');
  if (derecho === null || izquierdo === null) return null;
  return Math.min(derecho, izquierdo);
}

/**
 * El panel del FMS, si las siete pruebas están completas.
 *
 * Con una sola ausente —o una bilateral con un solo lado— no se compone
 * nada: un total con un séptimo inventado no es un total, es una suposición,
 * y es exactamente lo que este sistema no hace.
 */
export function panelFmsDe(
  mediciones: readonly MedicionFms[],
  nombres: Readonly<Record<string, string>>,
): PanelFms | null {
  const pruebas: PruebaFms[] = [];
  for (const prueba of PRUEBAS_FMS) {
    const puntuacion = puntuacionFinal(mediciones, prueba);
    if (puntuacion === null) return null;
    pruebas.push({ pruebaId: prueba.id, nombre: nombres[prueba.id] ?? prueba.id, puntuacion });
  }

  return {
    pruebas,
    total: pruebas.reduce((suma, p) => suma + p.puntuacion, 0),
    maximo: 21,
  };
}
