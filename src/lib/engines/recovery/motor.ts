// ── Recovery Engine (Domain Engine, puro) ───────────────────────────────────
// Fuente exclusiva y única para el cálculo del Veredicto: IMP-ADR-01
// (Implementation Handbook 14) + API-ADR-02 (API Contract Handbook 15). No
// se vuelve a arbitrar la contradicción histórica que esos dos ADR ya
// resolvieron (Motor BPS Handbook `{si, tipo?, razon?}` vs. Progression
// Engine Handbook `{procede, tipo, razon}`) — calcularVeredicto() devuelve
// ÚNICAMENTE el objeto oficial `VeredictoRecovery`, nada más.
//
// Alcance deliberadamente angosto: el pedido de este Sprint es "el cálculo
// del Recovery Verdict", no el Recovery Engine completo. Dolor/DOMS,
// sustitución de ejercicio y restricción temporal de zona (Architecture
// Handbook 06, "Alcance") son responsabilidades DISTINTAS del mismo motor,
// fuera de lo pedido — no se implementan aquí (ver informe del Sprint).
//
// Por qué calcularVeredicto() NO usa el índice de fatiga ponderado por
// defecto: IMP-ADR-02 (Implementation Handbook) autoriza EXPLÍCITAMENTE una
// "lógica interna deliberadamente simple (ej. siempre procede: true)" y es
// igual de explícito en que la lógica real de decisión "queda pendiente de
// su propio handbook, y su ausencia se declara explícitamente, NO SE
// DISFRAZA". Recovery Engine no tiene handbook de dominio propio (AR-006) —
// el único lugar donde existe un algoritmo concreto (índice de fatiga,
// pesos 0.5/0.3/0.2, umbral 0.65) es un capítulo del Architecture Handbook
// (06) que el propio capítulo califica como "pesos inventados con criterio,
// no derivados" (P11) y que el usuario no citó como fuente para este motor
// en este Sprint. Tratarlo como si fuera la especificación asentada
// disfrazaría exactamente lo que IMP-ADR-02 pide declarar ausente. Se
// transcribe fielmente como función v1 EXPLÍCITAMENTE separada y opt-in
// (nunca invocada por el camino por defecto) para no perder la única fuente
// concreta que existe, sin otorgarle una autoridad que ningún handbook
// vigente le da todavía.

import type { VeredictoRecovery, EntradaVeredictoMinima, VentanaFatigaV1 } from "./tipos";

// ── calcularVeredicto() — contrato mínimo oficial (IMP-ADR-02) ─────────────
export function calcularVeredicto(entrada: EntradaVeredictoMinima): VeredictoRecovery {
  // I-R1 (Architecture Handbook 06) — la única regla lo bastante simple e
  // indiscutida como para no depender del índice de fatiga: la descarga
  // programada del Mesociclo se ejecuta siempre, sea cual sea el índice.
  if (entrada.semanaEsDescargaProgramada) {
    return { procede: false, subtipo: "programada", razon: "Semana de descarga programada del Mesociclo (I-R1: se ejecuta aunque el índice de fatiga sea 0)" };
  }

  // Contrato mínimo IMP-ADR-02: sin lógica de descarga reactiva vinculante todavía.
  return { procede: true, razon: "Contrato mínimo (IMP-ADR-02) — Recovery Engine no tiene handbook de dominio propio (AR-006); sin índice de fatiga reactivo vinculante" };
}

// ── calcularIndiceFatigaV1() / exigeDescargaV1() — Architecture Handbook 06,
// pseudocódigo transcrito literalmente, EXPLÍCITAMENTE no vinculante ────────
const PESO_RPE = 0.5;
const PESO_ADHERENCIA = 0.3;
const PESO_DURACION = 0.2;
const UMBRAL_DESCARGA_REACTIVA = 0.65; // "calibrable (producto)" — Architecture Handbook 06

/** Normaliza una señal cruda a [0,1]. El propio handbook no especifica la función de normalización exacta — se usa clamp simple, la forma más neutra posible sin inventar una curva. */
function normalizar(valor: number): number {
  if (Number.isNaN(valor)) return 0;
  return Math.max(0, Math.min(1, valor));
}

export function calcularIndiceFatigaV1(ventana: VentanaFatigaV1): number {
  const señalesActivas = ventana.tendenciaRPE === null ? 2 : 3;
  const pesoRPE = ventana.tendenciaRPE === null ? 0 : PESO_RPE;
  // Renormalización sobre las 2 señales restantes cuando no hay RPE (usuario Inicial) — Architecture Handbook 06, caso límite "Índice calculado sin datos de RPE".
  const factorRenormalizacion = señalesActivas === 2 ? 1 / (PESO_ADHERENCIA + PESO_DURACION) : 1;

  const componenteRPE = pesoRPE * normalizar(ventana.tendenciaRPE ?? 0);
  const componenteAdherencia = PESO_ADHERENCIA * factorRenormalizacion * normalizar(ventana.caidaAdherencia);
  const componenteDuracion = PESO_DURACION * factorRenormalizacion * normalizar(ventana.desviacionDuracion);

  return componenteRPE + componenteAdherencia + componenteDuracion;
}

/**
 * Variante v1 de calcularVeredicto() que SÍ considera el índice de fatiga
 * reactivo. No es la exportada por defecto — un llamador debe elegirla
 * explícitamente, a sabiendas de que su umbral y pesos son "decisión de
 * producto" sin validación externa (Architecture Handbook 06, sección
 * "Riesgos").
 */
export function calcularVeredictoV1(entrada: EntradaVeredictoMinima & { ventanaFatiga: VentanaFatigaV1 }): VeredictoRecovery {
  if (entrada.semanaEsDescargaProgramada) {
    return { procede: false, subtipo: "programada", razon: "Semana de descarga programada del Mesociclo (I-R1)" };
  }

  const indice = calcularIndiceFatigaV1(entrada.ventanaFatiga);
  if (indice > UMBRAL_DESCARGA_REACTIVA) {
    return {
      procede: false,
      subtipo: "reactiva",
      razon: `Índice de fatiga ${indice.toFixed(2)} > ${UMBRAL_DESCARGA_REACTIVA} (v1, no vinculante — pesos/umbral sin validar, Architecture Handbook 06)`,
    };
  }
  return { procede: true, razon: `Índice de fatiga ${indice.toFixed(2)} ≤ ${UMBRAL_DESCARGA_REACTIVA} (v1)` };
}
