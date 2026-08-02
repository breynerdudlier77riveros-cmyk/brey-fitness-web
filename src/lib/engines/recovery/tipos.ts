// ── Tipos del Recovery Engine (Domain Engine, puro) ─────────────────────────
// Fuente exclusiva: IMP-ADR-01 (Implementation Handbook 14) y API-ADR-02
// (API Contract Handbook 15) — la forma canónica reconciliada del Veredicto,
// ya arbitrada; este módulo no vuelve a arbitrarla. Ningún otro handbook
// (Motor BPS, Progression Engine) define esta forma de nuevo aquí: ambos la
// consumen vía type-only import de este archivo (SSoT de IMP-ADR-01).

/**
 * Forma canónica única (IMP-ADR-01/API-ADR-02): `{si, tipo?, razon?}` de
 * Motor BPS Handbook y `{procede, tipo, razon}` de Progression Engine
 * Handbook quedan reconciliados en ESTA forma — ninguno de los dos handbooks
 * originales se edita, esta es la interpretación de implementación.
 */
export interface VeredictoRecovery {
  procede: boolean;
  /** Presente solo cuando procede=false — de qué tipo es la descarga exigida. */
  subtipo?: "programada" | "reactiva";
  razon: string;
}

/** Entrada mínima del contrato IMP-ADR-02: si la semana vigente del Mesociclo es descarga programada (I-R1, Architecture Handbook 06 — se ejecuta aunque el índice de fatiga sea 0). */
export interface EntradaVeredictoMinima {
  semanaEsDescargaProgramada: boolean;
}

// ── Entradas del índice de fatiga v1 (Architecture Handbook 06, opt-in) ────
// NO son parte del contrato mínimo IMP-ADR-02 — ver comentario en motor.ts.
export interface VentanaFatigaV1 {
  /** Pendiente promedio de (RPE real − RPE objetivo) por ejercicio repetido, últimas 3 apariciones. null si no hay datos de RPE (usuario Inicial) — el índice se renormaliza sobre las otras dos señales. */
  tendenciaRPE: number | null;
  /** max(0, adherencia promedio del Bloque − adherencia semana actual). */
  caidaAdherencia: number;
  /** max(0, (duración real − duración estimada) / duración estimada). */
  desviacionDuracion: number;
}
