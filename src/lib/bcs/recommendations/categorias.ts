// ── Categorías de recomendación (Sprint BCS-4.0) ───────────────────────────
// Catálogo cerrado. Cada categoría existe porque hay al menos una regla
// respaldada que la produce — no se declaran categorías vacías "por si
// acaso": una sección que nunca se llena es ruido en un informe.

import type { CategoriaRecomendacion } from './tipos';

interface DefinicionCategoria {
  id: CategoriaRecomendacion;
  etiqueta: string;
  /** Qué tipo de acción agrupa. Se muestra al profesional. */
  descripcion: string;
}

export const CATEGORIAS: Record<CategoriaRecomendacion, DefinicionCategoria> = {
  control_de_calidad: {
    id: 'control_de_calidad',
    etiqueta: 'Control de calidad',
    descripcion: 'Verificaciones sobre el dato registrado antes de darlo por bueno.',
  },
  medicion: {
    id: 'medicion',
    etiqueta: 'Medición',
    descripcion: 'Acciones sobre el procedimiento de registro.',
  },
  seguimiento: {
    id: 'seguimiento',
    etiqueta: 'Seguimiento',
    descripcion: 'Continuidad del registro longitudinal.',
  },
  reevaluacion: {
    id: 'reevaluacion',
    etiqueta: 'Reevaluación',
    descripcion: 'Repetición de una medición concreta para confirmarla.',
  },
  composicion_corporal: {
    id: 'composicion_corporal',
    etiqueta: 'Composición corporal',
    descripcion: 'Lectura de los cambios observados en las variables.',
  },
  interpretacion: {
    id: 'interpretacion',
    etiqueta: 'Interpretación',
    descripcion: 'Alcance y límites de lo que puede concluirse.',
  },
};

/** Orden de presentación: primero lo que condiciona la lectura del resto. */
export const ORDEN_CATEGORIAS: CategoriaRecomendacion[] = [
  'control_de_calidad',
  'reevaluacion',
  'medicion',
  'composicion_corporal',
  'interpretacion',
  'seguimiento',
];
