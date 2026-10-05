// ── El contenido de un Sistema vendible (Sprint CURSO-1) ───────────────────
//
// Un Sistema (Calistenia, Hipertrofia, Híbrido...) ya vende — lo que le
// faltaba era CONTENIDO: módulos con lecciones, cada una con su video y sus
// materiales descargables. Esto es lo que se guarda en
// `sistema_contenido.contenido` (JSONB), y lo que valida `contenido.ts`
// antes de escribir nada.
//
// Módulo de tipos. Sin lógica.

/** Dónde vive el video de una lección. Nunca se sube el archivo entero aquí. */
export type OrigenVideo = 'youtube' | 'vimeo' | 'otro';

export interface Leccion {
  id: string;
  titulo: string;
  descripcion: string | null;
  /** `null` = todavía sin video enlazado. */
  videoUrl: string | null;
  origenVideo: OrigenVideo | null;
  /**
   * Si es visible sin haber comprado — la lección de muestra que vende el
   * resto. `false` por defecto: gratis es una decisión explícita, no un
   * descuido de olvidar marcar el acceso.
   */
  gratis: boolean;
  materiales: readonly Material[];
}

/** Un PDF u otro archivo descargable, alojado en el bucket `sistema-recursos`. */
export interface Material {
  id: string;
  nombre: string;
  /** Ruta dentro del bucket — nunca la URL pública, el bucket es privado. */
  archivoPath: string;
}

export interface Modulo {
  id: string;
  titulo: string;
  lecciones: readonly Leccion[];
}

/** El documento entero. Es lo que va en `sistema_contenido.contenido`. */
export interface ContenidoSistema {
  modulos: readonly Modulo[];
}

/** El acceso otorgado a un Sistema — fila de `public.compras`. */
export interface Compra {
  id: string;
  sistemaSlug: string;
  usuarioId: string | null;
  email: string;
  origen: 'hotmart' | 'manual';
  hotmartTransaccion: string | null;
  estado: 'activa' | 'reembolsada';
  createdAt: string;
  actualizadoEl: string;
}
