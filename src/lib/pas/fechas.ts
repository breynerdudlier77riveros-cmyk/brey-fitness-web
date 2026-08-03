// ── Fechas del PAE (Sprint PAS-2.0) ────────────────────────────────────────
// Sin reloj: ninguna función de este módulo averigua qué día es. Quien
// necesite «hoy» lo recibe como argumento, igual que en el resto de capas
// puras del ecosistema.
//
// `Date.parse` sobre una cadena explícita es determinista — lo prohibido es
// `new Date()` y `Date.now()`, que leen el reloj del proceso.

const PATRON_ISO = /^\d{4}-\d{2}-\d{2}$/;

/**
 * `true` si la cadena es una fecha `yyyy-mm-dd` REAL.
 *
 * El round-trip es lo que descarta `2026-02-30`: `Date.parse` la acepta y la
 * desplaza a marzo, así que comparar la fecha reconstruida contra la original
 * es la única comprobación fiable.
 */
export function esFechaISO(valor: string): boolean {
  if (!PATRON_ISO.test(valor)) return false;

  const ms = Date.parse(`${valor}T00:00:00Z`);
  if (Number.isNaN(ms)) return false;

  return new Date(ms).toISOString().slice(0, 10) === valor;
}

/** Días calendario entre dos fechas ISO. Negativo si `hasta` es anterior. */
export function diasEntre(desdeISO: string, hastaISO: string): number {
  const a = Date.parse(`${desdeISO}T00:00:00Z`);
  const b = Date.parse(`${hastaISO}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return Math.round((b - a) / 86_400_000);
}

/** `-1`, `0` o `1`. Sobre ISO, el orden lexicográfico es el cronológico. */
export function compararFechas(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/** La más reciente de una lista. `null` si está vacía. */
export function fechaMasReciente(fechas: readonly string[]): string | null {
  if (fechas.length === 0) return null;
  return fechas.reduce((max, f) => (compararFechas(f, max) > 0 ? f : max));
}

/**
 * `true` si `fecha` es posterior a `hoyISO`.
 *
 * Una fecha futura no es un error de vigencia sino un dato imposible: se
 * reporta como conflicto, no como caducidad.
 */
export function esFutura(fecha: string, hoyISO: string): boolean {
  return compararFechas(fecha, hoyISO) > 0;
}

/**
 * `true` si el registro sigue dentro de su ventana de vigencia (EL-02).
 *
 * `vigenciaDias === null` significa que la definición de prueba no la declara.
 * El motor NO inventa un valor por defecto: trata el registro como vigente y
 * emite la limitación `vigencia_no_declarada`, que es lo honesto — suponer una
 * caducidad inventada excluiría datos reales sin respaldo.
 */
export function dentroDeVigencia(
  fechaRegistro: string,
  hoyISO: string,
  vigenciaDias: number | null
): boolean {
  if (vigenciaDias === null) return true;
  const transcurridos = diasEntre(fechaRegistro, hoyISO);
  if (Number.isNaN(transcurridos)) return false;
  return transcurridos <= vigenciaDias;
}
