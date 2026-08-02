// ── Formato del dashboard (Sprint BCS-5.0) ─────────────────────────────────
// Presentación pura. Ningún valor se calcula aquí: solo se da forma a lo que
// el orquestador ya resolvió.

/** Antigüedad en lenguaje llano. `null` = sin ninguna medición registrada. */
export function formatearAntiguedad(dias: number | null): string {
  if (dias === null) return "Sin mediciones";
  if (dias === 0) return "Hoy";
  if (dias === 1) return "Ayer";
  if (dias < 30) return `Hace ${dias} días`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? "Hace 1 mes" : `Hace ${meses} meses`;
}

export function formatearFechaCorta(iso: string): string {
  return new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
  });
}
