// ── Catálogo congelado de capacidades y familias (Sprint PAS-2.0) ──────────
// Transcripción literal de `docs/performance-system/03-capacidades.md` y
// `04-pruebas.md`. Ni una capacidad más, ni una menos, ni un nombre cambiado.
//
// Este archivo NO declara ninguna correspondencia prueba→capacidad: el Sprint 1
// las difirió al Sprint 3 (PAS-ADR-06) y afirmarlas aquí sería inventar
// ciencia. Las correspondencias llegan al motor como dato, en el catálogo de
// pruebas de la solicitud.

export type DominioId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type CapacidadId =
  | 'A-01' | 'A-02' | 'A-03' | 'A-04' | 'A-05'
  | 'B-01' | 'B-02' | 'B-03' | 'B-04'
  | 'C-01' | 'C-02' | 'C-03'
  | 'D-01' | 'D-02' | 'D-03' | 'D-04'
  | 'E-01' | 'E-02'
  | 'F-01' | 'F-02';

export type FamiliaId =
  | 'F-A' | 'F-B' | 'F-C' | 'F-D' | 'F-E' | 'F-F'
  | 'F-G' | 'F-H' | 'F-I' | 'F-J' | 'F-K';

export interface DefinicionCapacidad {
  id: CapacidadId;
  dominio: DominioId;
  nombre: string;
  /** Reservada hasta el Sprint 5: no admite pruebas ni estado derivado. */
  reservada: boolean;
}

export const DOMINIOS: Readonly<Record<DominioId, string>> = {
  A: 'Producción de fuerza',
  B: 'Rango y control articular',
  C: 'Metabólico',
  D: 'Neuromuscular y coordinativo',
  E: 'Técnico',
  F: 'Tolerancia y disponibilidad',
};

export const CAPACIDADES: readonly DefinicionCapacidad[] = [
  { id: 'A-01', dominio: 'A', nombre: 'Fuerza máxima', reservada: false },
  { id: 'A-02', dominio: 'A', nombre: 'Fuerza resistencia', reservada: false },
  { id: 'A-03', dominio: 'A', nombre: 'Potencia', reservada: false },
  { id: 'A-04', dominio: 'A', nombre: 'Fuerza reactiva', reservada: false },
  { id: 'A-05', dominio: 'A', nombre: 'Fuerza de agarre', reservada: false },
  { id: 'B-01', dominio: 'B', nombre: 'Movilidad', reservada: false },
  { id: 'B-02', dominio: 'B', nombre: 'Flexibilidad', reservada: false },
  { id: 'B-03', dominio: 'B', nombre: 'Estabilidad', reservada: false },
  { id: 'B-04', dominio: 'B', nombre: 'Control motor', reservada: false },
  { id: 'C-01', dominio: 'C', nombre: 'Resistencia aeróbica', reservada: false },
  { id: 'C-02', dominio: 'C', nombre: 'Resistencia anaeróbica', reservada: false },
  { id: 'C-03', dominio: 'C', nombre: 'Capacidad de recuperación intra-sesión', reservada: false },
  { id: 'D-01', dominio: 'D', nombre: 'Velocidad', reservada: false },
  { id: 'D-02', dominio: 'D', nombre: 'Agilidad', reservada: false },
  { id: 'D-03', dominio: 'D', nombre: 'Coordinación', reservada: false },
  { id: 'D-04', dominio: 'D', nombre: 'Equilibrio', reservada: false },
  { id: 'E-01', dominio: 'E', nombre: 'Competencia técnica', reservada: false },
  { id: 'E-02', dominio: 'E', nombre: 'Repertorio de habilidad', reservada: false },
  { id: 'F-01', dominio: 'F', nombre: 'Tolerancia a la carga', reservada: true },
  { id: 'F-02', dominio: 'F', nombre: 'Disponibilidad funcional', reservada: true },
] as const;

export const FAMILIAS: Readonly<Record<FamiliaId, string>> = {
  'F-A': 'Pruebas de fuerza',
  'F-B': 'Pruebas de salto',
  'F-C': 'Pruebas de agarre',
  'F-D': 'Pruebas de carrera y desplazamiento',
  'F-E': 'Pruebas de movilidad y flexibilidad',
  'F-F': 'Pruebas de equilibrio',
  'F-G': 'Pruebas de estabilidad y control',
  'F-H': 'Pruebas de habilidad y técnica',
  'F-I': 'Pruebas de calistenia',
  'F-J': 'Pruebas antropométricas',
  'F-K': 'Pruebas de tolerancia y disponibilidad',
};

/** Familias reservadas hasta el Sprint 5, igual que sus capacidades. */
export const FAMILIAS_RESERVADAS: readonly FamiliaId[] = ['F-K'];

/**
 * Familia que se registra como contexto y no evalúa ninguna capacidad
 * funcional por sí misma (`04-pruebas.md`). Una definición de F-J que declare
 * contribuciones es un conflicto, no un dato.
 */
export const FAMILIAS_SOLO_CONTEXTO: readonly FamiliaId[] = ['F-J'];

const INDICE = new Map<string, DefinicionCapacidad>(CAPACIDADES.map((c) => [c.id, c]));

export function esCapacidad(id: string): id is CapacidadId {
  return INDICE.has(id);
}

export function definicionCapacidad(id: CapacidadId): DefinicionCapacidad {
  const encontrada = INDICE.get(id);
  // Inalcanzable con un CapacidadId válido; el guard existe para que un `as`
  // en la frontera del módulo falle aquí y no varias capas más abajo.
  if (!encontrada) throw new Error(`Capacidad desconocida: ${id}`);
  return encontrada;
}

export function esFamilia(id: string): id is FamiliaId {
  return id in FAMILIAS;
}

/** Las 18 capacidades activas en v1.0: todas menos las dos reservadas. */
export const CAPACIDADES_ACTIVAS: readonly DefinicionCapacidad[] = CAPACIDADES.filter(
  (c) => !c.reservada
);

export const CAPACIDADES_RESERVADAS: readonly DefinicionCapacidad[] = CAPACIDADES.filter(
  (c) => c.reservada
);
