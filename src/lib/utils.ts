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
