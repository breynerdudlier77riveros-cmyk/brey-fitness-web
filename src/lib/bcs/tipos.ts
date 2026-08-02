// ── DTOs del Body Composition System (backend real — supabase/schema.sql) ──
// Espejan las tres tablas del BCS (Database Handbook 04). Son los DTO
// oficiales del API Contract Handbook (08): Cliente, Medicion, EnlacePublico.
//
// El BCS es un bounded context standalone (Domain Model 02): sus tipos viven
// aquí, en su propio módulo, sin depender de ningún tipo del Core Product ni
// al revés. Cliente NUNCA se relaciona con Usuario (IN-31) — comparte solo la
// identidad del Entrenador (auth.users.id) como referencia, no como dominio.

/** Estado de la máquina de Cliente — activo ⇄ archivado → eliminado (terminal, IN-30). */
export type ClienteEstado = 'activo' | 'archivado' | 'eliminado';

/** Estado de la máquina de Medición — vigente → anulada (BCS-ADR-03). */
export type MedicionEstado = 'vigente' | 'anulada';

/** Estado de la máquina de EnlacePúblico — activo → revocado (terminal, IN-28). */
export type EnlaceEstado = 'activo' | 'revocado';

/** Fila de `bcs_clientes`. El Cliente presencial del Entrenador. */
export interface Cliente {
  id: string;
  entrenador_id: string;
  nombre: string;
  estado: ClienteEstado;
  created_at: string;
}

/**
 * Fila de `bcs_mediciones` — 3 metadatos de agregado + las 25 variables
 * (mapeo IMP-ADR-06). Las 22 columnas `numeric` llegan como string vía
 * PostgREST (ver src/lib/database/parsers.ts): el mapper las pasa por
 * numOrNull. `edad_metabolica` es int (número real), `fecha` es date (string).
 */
export interface Medicion {
  id: string;
  cliente_id: string;
  estado: MedicionEstado;
  altura_cm: number | null;            // BCS-V01
  peso_kg: number | null;              // BCS-V02
  imc: number | null;                  // BCS-V03
  grasa_pct: number | null;            // BCS-V04
  masa_grasa_kg: number | null;        // BCS-V05
  masa_muscular_kg: number | null;     // BCS-V06
  masa_libre_grasa_kg: number | null;  // BCS-V07
  agua_total_l: number | null;         // BCS-V08
  agua_intracelular_l: number | null;  // BCS-V09
  agua_extracelular_l: number | null;  // BCS-V10
  proteina_kg: number | null;          // BCS-V11
  minerales_kg: number | null;         // BCS-V12
  masa_osea_kg: number | null;         // BCS-V13
  grasa_visceral_idx: number | null;   // BCS-V14
  angulo_fase_deg: number | null;      // BCS-V15
  bmr_kcal: number | null;             // BCS-V16
  edad_metabolica: number | null;      // BCS-V17
  smi: number | null;                  // BCS-V18
  circ_cintura_cm: number | null;      // BCS-V19
  circ_cadera_cm: number | null;       // BCS-V20
  whr: number | null;                  // BCS-V21
  impedancia_ohm: number | null;       // BCS-V22
  /** date de Postgres — string ISO yyyy-mm-dd. Nunca futura. */
  fecha: string;                       // BCS-V23
  observaciones: string | null;        // BCS-V24
  /** Referencia a Storage, nunca la imagen en la fila. */
  foto_url: string | null;             // BCS-V25
}

/** Fila de `bcs_enlaces_publicos`. Token de acceso público de solo lectura. */
export interface EnlacePublico {
  id: string;
  cliente_id: string;
  token: string;
  estado: EnlaceEstado;
  created_at: string;
}
