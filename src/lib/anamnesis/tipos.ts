// ── Anamnesis · tipos (Sprint ANAMNESIS-1) ─────────────────────────────────
//
// El documento es un diccionario plano clave→valor (todo string). No hay
// interfaces anidadas por sección: el formulario original (Excel) es fijo —
// no lo construye el usuario como sí ocurre con módulos/lecciones de
// `cursos` — así que un diccionario plano basta y evita duplicar ~250
// nombres de campo en un tipo anidado. `secciones.ts` es la única fuente de
// verdad de qué claves existen y cómo se validan/renderizan.

export type AnamnesisDatos = Record<string, string>;

export function datosVacios(): AnamnesisDatos {
  return {};
}

export function valorDe(datos: AnamnesisDatos, clave: string): string {
  return datos[clave] ?? '';
}

export function conValor(datos: AnamnesisDatos, clave: string, valor: string): AnamnesisDatos {
  return { ...datos, [clave]: valor };
}

/** Tipos de campo que sabe dibujar `CamposComunes.tsx`. */
export type CampoDef =
  | { tipo: 'texto'; clave: string; etiqueta: string }
  | { tipo: 'textoLargo'; clave: string; etiqueta: string; filas?: number }
  | { tipo: 'numero'; clave: string; etiqueta: string }
  | { tipo: 'siNo'; clave: string; etiqueta: string }
  | { tipo: 'opciones'; clave: string; etiqueta: string; opciones: string[]; otraClave?: string }
  | { tipo: 'casilla'; clave: string; etiqueta: string }
  | { tipo: 'nota'; texto: string };

export interface Registro {
  id: string;
  creadoPor: string;
  contenido: AnamnesisDatos;
  creadoEl: string;
  actualizadoEl: string;
}

/** Nombre a mostrar en la lista de registros guardados. */
export function nombreDe(datos: AnamnesisDatos): string {
  const nombre = valorDe(datos, 'demo.nombre').trim();
  const apellido = valorDe(datos, 'demo.apellido').trim();
  const completo = [nombre, apellido].filter(Boolean).join(' ');
  return completo || 'Sin nombre';
}
