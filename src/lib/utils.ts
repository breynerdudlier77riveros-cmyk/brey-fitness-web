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

/**
 * Unidad de despliegue para peso/altura (Sprint I-02, Configuración). No es
 * una columna de `profiles` — `profiles.peso_kg`/`altura_cm` siguen siendo
 * siempre métricos; esto solo controla cómo se muestran. Preferencia de
 * dispositivo (ver PreferencesProvider), no un campo de dominio.
 */
export type UnidadSistema = "metrico" | "imperial";

/** kg (siempre el valor real almacenado) → texto en la unidad activa. */
export function formatPeso(kg: number | null, unidades: UnidadSistema): string {
  if (kg === null) return "—";
  if (unidades === "imperial") return `${(kg * 2.20462).toFixed(1)} lb`;
  return `${kg} kg`;
}

/** cm (siempre el valor real almacenado) → texto en la unidad activa. */
export function formatAltura(cm: number | null, unidades: UnidadSistema): string {
  if (cm === null) return "—";
  if (unidades === "imperial") {
    const totalPulgadas = cm / 2.54;
    const pies = Math.floor(totalPulgadas / 12);
    const pulgadas = Math.round(totalPulgadas % 12);
    return `${pies}′${pulgadas}″`;
  }
  return `${cm} cm`;
}
