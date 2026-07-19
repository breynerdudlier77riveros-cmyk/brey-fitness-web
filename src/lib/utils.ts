import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Iniciales para avatares (AppSidebar, UserMenu) a partir de un nombre. */
export function iniciales(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  return partes.slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

/**
 * yyyy-mm-dd en hora LOCAL (no `date.toISOString()`, que usa UTC y puede
 * apuntar al día equivocado cerca de medianoche) — para comparar contra
 * columnas `date` de Postgres (workouts.fecha_planificada, etc.).
 */
export function fechaISOLocal(d: Date = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
