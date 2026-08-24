// ── Plantillas de sesión · tipos del dominio ───────────────────────────────
//
// UN EDITOR DE DOCUMENTOS, NO UN MOTOR.
//
//   Todo lo que hay aquí lo escribe el entrenador. El sistema no calcula
//   cargas, no propone progresiones y no juzga si un RIR es apropiado. No es
//   una limitación pendiente de resolver: es la línea que mantiene coherente
//   al resto del ecosistema.
//
//   El BCS se niega a clasificar un porcentaje graso sin una tabla publicada
//   detrás. Esa negativa solo significa algo si el sistema no está, en la
//   pantalla de al lado, recomendando 80 kg de press de banca sin más aval que
//   una fórmula que a nadie le consta. Aquí el aval es el nombre del
//   entrenador, y por eso el sistema se calla.
//
// ── LA ESTRUCTURA, Y POR QUÉ TIENE ESTA FORMA ─────────────────────────────
//
//   Plantilla → Día → Bloque → Ejercicio → [semana] → Serie
//
//   · DÍA es la sesión: «Día 1 · Empuje».
//   · BLOQUE separa calentamiento de trabajo principal y de accesorios. El
//     calentamiento no es un ejercicio más con menos peso: es otra cosa, y
//     mezclarlo en la misma lista lo convierte en ruido que se salta.
//   · EJERCICIO tiene un nombre y, si existe en el catálogo, un `slug` que
//     enlaza a su ficha. El nombre es libre: el catálogo tiene veinte
//     ejercicios y un entrenador usa muchos más. Obligar a elegir de una lista
//     corta produciría nombres forzados, que es peor que un texto libre.
//   · SEMANAS es un array cuya longitud es la del bloque. Cada semana tiene
//     sus propias series, que es lo que permite la progresión de la foto.
//   · SERIE es la unidad mínima: repeticiones, peso y RIR, los tres
//     opcionales por separado.
//
//   Los tres campos de la serie son opcionales de forma independiente, y eso
//   es deliberado. Un entrenador que prescribe «3×8 sin especificar carga»
//   está diciendo algo distinto de uno que prescribe «3×8 a 60 kg», y la
//   estructura tiene que poder representar los dos sin rellenar huecos con
//   ceros que luego se lean como una indicación.
//
// Módulo de tipos. Sin lógica.

/** Los cuatro momentos de una sesión. El orden es el de ejecución. */
export type TipoBloque = 'calentamiento' | 'principal' | 'accesorio' | 'enfriamiento';

export const TIPOS_BLOQUE: readonly TipoBloque[] = [
  'calentamiento',
  'principal',
  'accesorio',
  'enfriamiento',
];

export const ETIQUETA_BLOQUE: Readonly<Record<TipoBloque, string>> = {
  calentamiento: 'Calentamiento',
  principal: 'Trabajo principal',
  accesorio: 'Accesorios',
  enfriamiento: 'Vuelta a la calma',
};

/**
 * Una serie. Los tres datos son independientes y opcionales.
 *
 * `reps` es texto y no número a propósito: «8», «8-10», «al fallo» y «30 s»
 * son prescripciones legítimas y las tres caben en la misma casilla. Un campo
 * numérico obligaría a inventar una convención para las otras tres.
 */
export interface Serie {
  reps: string;
  /** Carga en kilos. `null` = no prescrita, que no es lo mismo que cero. */
  pesoKg: number | null;
  /** Repeticiones en reserva. `null` = no prescrito. */
  rir: number | null;
  notas: string | null;
}

/** Lo que se hace de un ejercicio en UNA semana del bloque. */
export interface SemanaEjercicio {
  series: Serie[];
}

export interface EjercicioPlantilla {
  /** Estable durante toda la vida de la plantilla: los ajustes lo direccionan. */
  id: string;
  nombre: string;
  /** Ficha del catálogo, si el nombre coincidió con una. Enlaza a /ejercicios/[slug]. */
  slug: string | null;
  notas: string | null;
  descansoSeg: number | null;
  /** Una entrada por semana. Su longitud SIEMPRE es `plantilla.semanas`. */
  semanas: SemanaEjercicio[];
}

export interface Bloque {
  id: string;
  tipo: TipoBloque;
  ejercicios: EjercicioPlantilla[];
}

export interface Dia {
  id: string;
  nombre: string;
  notas: string | null;
  bloques: Bloque[];
}

/** El documento entero. Es lo que va en la columna `contenido`. */
export interface Contenido {
  dias: Dia[];
}

export type EstadoPlantilla = 'borrador' | 'publicada' | 'archivada';

export interface Plantilla {
  id: string;
  entrenador_id: string;
  nombre: string;
  descripcion: string | null;
  semanas: number;
  contenido: Contenido;
  estado: EstadoPlantilla;
  created_at: string;
  actualizado_el: string;
}

/**
 * Lo que cambia para UN cliente respecto de la plantilla madre.
 *
 * Clave: `${ejercicioId}:${semana}:${serie}`, con `semana` y `serie` en base
 * cero. Solo se guarda lo que difiere — un ajuste que repitiera la plantilla
 * entera dejaría de propagarse cuando el entrenador la corrigiera.
 */
export type Ajustes = Record<string, AjusteSerie>;

export interface AjusteSerie {
  reps?: string;
  pesoKg?: number | null;
  rir?: number | null;
}

export type EstadoEnlace = 'activo' | 'revocado';

export interface EnlacePlantilla {
  id: string;
  plantilla_id: string;
  /** `null` = enlace genérico. Puesto = asignada a ese cliente. */
  cliente_id: string | null;
  token: string;
  ajustes: Ajustes;
  nota: string | null;
  estado: EstadoEnlace;
  created_at: string;
}
