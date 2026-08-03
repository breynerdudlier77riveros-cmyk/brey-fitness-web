// ── Modelo de vista del Performance Report System (Sprint PAS-5.0) ─────────
// El PRS no recalcula: REORDENA. Este modelo es la misma información de los
// dos DTO recibidos, agrupada como se va a leer.
//
// Vive en `lib/` y no en el componente por la ley de capas del ecosistema —
// ninguna decisión fuera de la presentación pura ocurre en React— y porque así
// puede probarse sin montar un DOM.

import type { CapacidadId, DominioId } from '../capacidades';
import type { EstadoCapacidadValor } from '../resultado';
import type { Interpretacion, NivelEvidencia } from '../interpretation';

/** Nivel declarado, o la ausencia de declaración. No es lo mismo. */
export type NivelMostrado = NivelEvidencia | 'no_documentado';

export interface FilaCapacidad {
  capacidad: CapacidadId;
  nombre: string;
  dominio: DominioId;
  estado: EstadoCapacidadValor;
  reservada: boolean;
  registrosElegibles: number;
  ultimaFecha: string | null;
  /** Pruebas cuya correspondencia se aplicó, según la traza del PAE. */
  pruebas: string[];
  nivel: NivelMostrado;
  /** Textos del PIE, literales. El PRS no redacta ninguno. */
  interpretaciones: Interpretacion[];
}

export interface GrupoDominio {
  dominio: DominioId;
  nombre: string;
  capacidades: FilaCapacidad[];
  /** Interpretación del PIE para el dominio, si la emitió. */
  interpretacion: Interpretacion | null;
}

export interface GrupoEvidencia {
  nivel: NivelMostrado;
  etiqueta: string;
  capacidades: FilaCapacidad[];
}

export interface GrupoCobertura {
  clave: 'cubiertas' | 'parciales' | 'desactualizadas' | 'en_conflicto' | 'desconocidas' | 'reservadas';
  etiqueta: string;
  capacidades: FilaCapacidad[];
}

export interface PruebaAplicada {
  pruebaId: string;
  capacidades: CapacidadId[];
  registros: number;
  ultimaFecha: string | null;
}

export interface Versiones {
  pae: string;
  pie: string;
  pkb: string;
  catalogo: string;
}

export interface ApendiceInforme {
  pruebas: PruebaAplicada[];
  versiones: Versiones;
  /** Fecha de cálculo heredada del PAE. El PRS no lee el reloj. */
  fecha: string;
  atletaId: string;
}

export type SeccionId =
  | 'portada'
  | 'resumen'
  | 'perfil'
  | 'dominios'
  | 'interpretaciones'
  | 'cobertura'
  | 'evidencia'
  | 'metodologia'
  | 'limitaciones'
  | 'apendice'
  | 'pie';

export interface PerformanceReportViewModel {
  filas: FilaCapacidad[];
  dominios: GrupoDominio[];
  cobertura: GrupoCobertura[];
  evidencia: GrupoEvidencia[];
  apendice: ApendiceInforme;
  /** Recuentos del PIE, sin recalcular. */
  totales: {
    capacidadesActivas: number;
    caracterizadas: number;
    parciales: number;
    desactualizadas: number;
    enConflicto: number;
    desconocidas: number;
    reservadas: number;
  };
}
