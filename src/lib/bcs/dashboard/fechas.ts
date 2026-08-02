// ── Utilidades de fecha del Dashboard (Sprint BCS-5.0) ─────────────────────
// Puras y sin reloj: toda función que necesite «hoy» lo recibe como argumento.
// Trabajan sobre cadenas `yyyy-mm-dd` y `yyyy-mm`, que es como llegan las
// fechas desde Postgres, sin construir objetos Date salvo para aritmética.

/** `yyyy-mm` de una fecha `yyyy-mm-dd` o de un timestamp ISO. */
export function mesDe(fechaISO: string): string {
  return fechaISO.slice(0, 7);
}

/** Días calendario entre dos fechas `yyyy-mm-dd`. Negativo si la segunda es anterior. */
export function diasEntre(desdeISO: string, hastaISO: string): number {
  const a = Date.parse(`${desdeISO.slice(0, 10)}T00:00:00Z`);
  const b = Date.parse(`${hastaISO.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return NaN;
  return Math.round((b - a) / 86_400_000);
}

/**
 * Los últimos `n` meses hasta el de `hoyISO`, en orden ascendente.
 * Se calcula sobre componentes numéricos para no depender de la zona horaria.
 */
export function ultimosMeses(hoyISO: string, n: number): string[] {
  const anio = Number(hoyISO.slice(0, 4));
  const mes = Number(hoyISO.slice(5, 7));
  const meses: string[] = [];

  for (let i = n - 1; i >= 0; i -= 1) {
    const total = anio * 12 + (mes - 1) - i;
    const a = Math.floor(total / 12);
    const m = (total % 12) + 1;
    meses.push(`${a}-${String(m).padStart(2, '0')}`);
  }

  return meses;
}

/** Etiqueta corta de un mes `yyyy-mm`, para ejes de gráfico. */
export function etiquetaMes(mes: string): string {
  const NOMBRES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const indice = Number(mes.slice(5, 7)) - 1;
  return NOMBRES[indice] ?? mes;
}
