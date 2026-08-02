// ── Utilidades de formato del reporte (BCS Sprint 2.0) ─────────────────────
// Presentación pura: dan forma a valores que el motor ya calculó. Ninguna
// función de aquí decide nada — si un número no viene en el DTO, no se
// inventa, se muestra como ausente.

/** Versión del formato del documento, no de la aplicación. */
export const REPORTE_VERSION = "BCS v2.0";

export function formatearFechaLarga(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatearFechaCorta(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Valor + unidad. `null` se muestra como guion largo, nunca como 0. */
export function formatearValor(valor: number | null, unidad: string, decimales = 1): string {
  if (valor === null) return "—";
  return `${valor.toFixed(decimales)}${unidad ? ` ${unidad}` : ""}`;
}

/** Delta con signo explícito. Usa el menos tipográfico (−), no el guion. */
export function formatearDelta(valor: number | null, unidad: string, decimales = 1): string {
  if (valor === null) return "—";
  const signo = valor > 0 ? "+" : valor < 0 ? "−" : "";
  return `${signo}${Math.abs(valor).toFixed(decimales)}${unidad ? ` ${unidad}` : ""}`;
}

export function formatearPorcentaje(valor: number | null, decimales = 1): string {
  if (valor === null) return "—";
  const signo = valor > 0 ? "+" : valor < 0 ? "−" : "";
  return `${signo}${Math.abs(valor).toFixed(decimales)} %`;
}
