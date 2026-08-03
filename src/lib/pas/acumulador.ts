// ── Acumulador de conflictos (Sprint PAS-2.0) ──────────────────────────────
// Construye conflictos con forma uniforme y un id derivado de `tipo` + clave.
// El id es determinista a propósito: dos ejecuciones sobre los mismos datos
// producen los mismos ids, que es lo que permite comparar análisis y hacer
// aserciones estables en las pruebas.

import type { Conflicto, TipoConflicto } from './resultado';

export type PartesConflicto = Partial<Omit<Conflicto, 'id' | 'tipo' | 'regla'>>;

export interface AcumuladorConflictos {
  lista: Conflicto[];
  push: (
    tipo: TipoConflicto,
    clave: string,
    regla: string,
    partes?: PartesConflicto
  ) => void;
}

export function crearAcumulador(): AcumuladorConflictos {
  const lista: Conflicto[] = [];

  return {
    lista,
    push(tipo, clave, regla, partes = {}) {
      lista.push({
        id: `${tipo}:${clave}`,
        tipo,
        regla,
        evaluaciones: partes.evaluaciones ?? [],
        registros: partes.registros ?? [],
        pruebas: partes.pruebas ?? [],
        capacidades: partes.capacidades ?? [],
        detalle: partes.detalle ?? {},
      });
    },
  };
}
