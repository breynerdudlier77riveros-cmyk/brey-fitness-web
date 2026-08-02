// ── Trazabilidad de los entregables (Sprint BCS-6.0) ───────────────────────
// Construye la traza de cada documento a partir de las fuentes que realmente
// se usaron. No se declara a mano en cada plantilla: se acumula, para que una
// plantilla no pueda citar una fuente que no consultó.

import type { FuentesNormalizadas } from './fuentes';
import type { FichaCopilot } from './conocimiento';
import type { TrazaEntregable } from './tipos';

/** Acumulador que cada plantilla alimenta mientras compone. */
export class Traza {
  private observaciones = new Set<string>();
  private hallazgos = new Set<string>();
  private recomendaciones = new Set<string>();
  private referencias = new Set<string>();
  private fichas = new Set<string>();
  private variables = new Set<string>();

  constructor(private readonly plantillaId: string) {}

  usarObservacion(...ids: string[]): this {
    ids.forEach((id) => this.observaciones.add(id));
    return this;
  }

  usarHallazgo(...ids: string[]): this {
    ids.forEach((id) => this.hallazgos.add(id));
    return this;
  }

  usarRecomendacion(...ids: string[]): this {
    ids.forEach((id) => this.recomendaciones.add(id));
    return this;
  }

  usarVariable(...ids: string[]): this {
    ids.forEach((id) => this.variables.add(id));
    return this;
  }

  /** Registra una ficha de la CKB junto con sus referencias, siempre juntas. */
  usarFicha(ficha: Pick<FichaCopilot, 'fichaCkb' | 'referencias'>): this {
    this.fichas.add(ficha.fichaCkb);
    ficha.referencias.forEach((r) => this.referencias.add(r));
    return this;
  }

  /** Hereda la traza de una observación del COG: ya trae fichas y referencias. */
  usarObservacionCompleta(obs: FuentesNormalizadas['observaciones'][number]): this {
    this.observaciones.add(obs.id);
    obs.referencias.forEach((r) => this.referencias.add(r));
    obs.fichas.forEach((f) => this.fichas.add(f));
    return this;
  }

  construir(): TrazaEntregable {
    return {
      plantillaId: this.plantillaId,
      observacionIds: [...this.observaciones].sort(),
      hallazgoIds: [...this.hallazgos].sort(),
      recomendacionIds: [...this.recomendaciones].sort(),
      referenciaIds: [...this.referencias].sort(),
      fichasCkb: [...this.fichas].sort(),
      variables: [...this.variables].sort(),
    };
  }
}

/** Traza vacía, para entregables que no citan ninguna fuente científica. */
export function trazaVacia(plantillaId: string): TrazaEntregable {
  return new Traza(plantillaId).construir();
}
