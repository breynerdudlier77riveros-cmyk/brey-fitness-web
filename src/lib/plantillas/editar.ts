// ── Plantillas · edición estructural ───────────────────────────────────────
//
// Las transformaciones que hace el editor, fuera del editor.
//
// Podrían vivir dentro del componente —son quince funciones cortas— y ese es
// justo el problema: quince manipulaciones de una estructura de cuatro
// niveles metidas entre `useState` y JSX son quince sitios donde romper la
// invariante de las semanas sin que ningún test lo note.
//
// Aquí son puras, se prueban solas, y el componente queda como lo que debe
// ser: una pantalla que llama a funciones con nombre.
//
// ── TODAS DEVUELVEN UNA COPIA ─────────────────────────────────────────────
//
//   Ninguna muta la entrada. React compara por referencia, y una mutación en
//   sitio produce el bug más caro de diagnosticar que existe en un editor:
//   los datos cambian y la pantalla no.
//
// ── LOS IDs NUNCA SE REUTILIZAN ───────────────────────────────────────────
//
//   `duplicarEjercicio` renueva el id de la copia. Es la operación que más
//   fácilmente rompería la invariante 2 —los ajustes por cliente direccionan
//   por id— y haría que las cargas de un cliente cayeran sobre dos ejercicios
//   a la vez.
//
// Módulo puro.

import { ejercicioNuevo, nuevoId, serieVacia } from './contenido';
import type {
  Bloque,
  Contenido,
  Dia,
  EjercicioPlantilla,
  Serie,
  TipoBloque,
} from './tipos';

// ── Recorrido genérico ─────────────────────────────────────────────────────
//
// Las tres funciones de abajo son el único sitio que sabe cómo está anidada
// la estructura. Todo lo demás se expresa con ellas, así que añadir un nivel
// algún día se toca aquí y no en quince operaciones.

const mapDias = (c: Contenido, f: (d: Dia) => Dia): Contenido => ({ dias: c.dias.map(f) });

const mapDia = (c: Contenido, diaId: string, f: (d: Dia) => Dia): Contenido =>
  mapDias(c, (d) => (d.id === diaId ? f(d) : d));

const mapBloque = (
  c: Contenido,
  diaId: string,
  bloqueId: string,
  f: (b: Bloque) => Bloque,
): Contenido =>
  mapDia(c, diaId, (d) => ({
    ...d,
    bloques: d.bloques.map((b) => (b.id === bloqueId ? f(b) : b)),
  }));

/** Aplica `f` al ejercicio con ese id, esté donde esté. */
export const mapEjercicio = (
  c: Contenido,
  ejercicioId: string,
  f: (e: EjercicioPlantilla) => EjercicioPlantilla,
): Contenido =>
  mapDias(c, (d) => ({
    ...d,
    bloques: d.bloques.map((b) => ({
      ...b,
      ejercicios: b.ejercicios.map((e) => (e.id === ejercicioId ? f(e) : e)),
    })),
  }));

// ── Días ───────────────────────────────────────────────────────────────────

export const anadirDia = (c: Contenido, dia: Dia): Contenido => ({ dias: [...c.dias, dia] });

export const renombrarDia = (c: Contenido, diaId: string, nombre: string): Contenido =>
  mapDia(c, diaId, (d) => ({ ...d, nombre }));

export const notasDia = (c: Contenido, diaId: string, notas: string): Contenido =>
  mapDia(c, diaId, (d) => ({ ...d, notas: notas.trim() === '' ? null : notas }));

export const quitarDia = (c: Contenido, diaId: string): Contenido => ({
  dias: c.dias.filter((d) => d.id !== diaId),
});

/**
 * Mueve un día una posición. `delta` es -1 o 1.
 *
 * Fuera de rango NO es un error: se devuelve el contenido tal cual. Un editor
 * que lanza porque pulsaste «subir» en el primer elemento es un editor que
 * obliga a comprobar antes de cada clic.
 */
export function moverDia(c: Contenido, diaId: string, delta: number): Contenido {
  const i = c.dias.findIndex((d) => d.id === diaId);
  const j = i + delta;
  if (i === -1 || j < 0 || j >= c.dias.length) return c;

  const dias = [...c.dias];
  [dias[i], dias[j]] = [dias[j], dias[i]];
  return { dias };
}

// ── Bloques ────────────────────────────────────────────────────────────────

/**
 * Añade un bloque de ese tipo si el día no lo tenía.
 *
 * Dos bloques del mismo tipo en un día serían dos encabezados «Accesorios»
 * seguidos, y nadie sabría en cuál escribir.
 */
export function asegurarBloque(c: Contenido, diaId: string, tipo: TipoBloque): Contenido {
  return mapDia(c, diaId, (d) =>
    d.bloques.some((b) => b.tipo === tipo)
      ? d
      : { ...d, bloques: [...d.bloques, { id: nuevoId(), tipo, ejercicios: [] }] },
  );
}

/** Quita el bloque. Se lleva sus ejercicios: quien lo pulsa los está viendo. */
export const quitarBloque = (c: Contenido, diaId: string, bloqueId: string): Contenido =>
  mapDia(c, diaId, (d) => ({ ...d, bloques: d.bloques.filter((b) => b.id !== bloqueId) }));

// ── Ejercicios ─────────────────────────────────────────────────────────────

export const anadirEjercicio = (
  c: Contenido,
  diaId: string,
  bloqueId: string,
  nombre: string,
  semanas: number,
  slug: string | null = null,
): Contenido =>
  mapBloque(c, diaId, bloqueId, (b) => ({
    ...b,
    ejercicios: [...b.ejercicios, ejercicioNuevo(nombre, semanas, slug)],
  }));

export const editarEjercicio = (
  c: Contenido,
  ejercicioId: string,
  campos: Partial<Pick<EjercicioPlantilla, 'nombre' | 'slug' | 'notas' | 'descansoSeg' | 'video'>>,
): Contenido => mapEjercicio(c, ejercicioId, (e) => ({ ...e, ...campos }));

export const quitarEjercicio = (c: Contenido, ejercicioId: string): Contenido =>
  mapDias(c, (d) => ({
    ...d,
    bloques: d.bloques.map((b) => ({
      ...b,
      ejercicios: b.ejercicios.filter((e) => e.id !== ejercicioId),
    })),
  }));

/**
 * Copia un ejercicio justo debajo, con id nuevo.
 *
 * El id nuevo es lo que hace correcta esta operación: sin él, los ajustes de
 * un cliente sobre el original caerían también sobre la copia, y `problemasDe`
 * rechazaría el documento al guardar.
 */
export function duplicarEjercicio(c: Contenido, ejercicioId: string): Contenido {
  return mapDias(c, (d) => ({
    ...d,
    bloques: d.bloques.map((b) => {
      const i = b.ejercicios.findIndex((e) => e.id === ejercicioId);
      if (i === -1) return b;

      const original = b.ejercicios[i];
      const copia: EjercicioPlantilla = {
        ...original,
        id: nuevoId(),
        semanas: original.semanas.map((s) => ({ series: s.series.map((x) => ({ ...x })) })),
      };

      const ejercicios = [...b.ejercicios];
      ejercicios.splice(i + 1, 0, copia);
      return { ...b, ejercicios };
    }),
  }));
}

/** Mueve un ejercicio dentro de su bloque. Fuera de rango no hace nada. */
export function moverEjercicio(c: Contenido, ejercicioId: string, delta: number): Contenido {
  return mapDias(c, (d) => ({
    ...d,
    bloques: d.bloques.map((b) => {
      const i = b.ejercicios.findIndex((e) => e.id === ejercicioId);
      const j = i + delta;
      if (i === -1 || j < 0 || j >= b.ejercicios.length) return b;

      const ejercicios = [...b.ejercicios];
      [ejercicios[i], ejercicios[j]] = [ejercicios[j], ejercicios[i]];
      return { ...b, ejercicios };
    }),
  }));
}

// ── Series ─────────────────────────────────────────────────────────────────

/**
 * Añade una serie a UNA semana.
 *
 * Solo a esa: subir de 3 a 4 series en la semana 3 y dejar 3 en las anteriores
 * es una progresión legítima, y propagarlo a todas la impediría.
 */
export const anadirSerie = (c: Contenido, ejercicioId: string, semana: number): Contenido =>
  mapEjercicio(c, ejercicioId, (e) => ({
    ...e,
    semanas: e.semanas.map((s, i) =>
      i === semana ? { series: [...s.series, ultimaOVacia(s.series)] } : s,
    ),
  }));

/** La serie nueva copia la anterior; si no hay, nace vacía. */
const ultimaOVacia = (series: Serie[]): Serie =>
  series.length === 0 ? serieVacia() : { ...series[series.length - 1] };

export const quitarSerie = (c: Contenido, ejercicioId: string, semana: number, serie: number): Contenido =>
  mapEjercicio(c, ejercicioId, (e) => ({
    ...e,
    semanas: e.semanas.map((s, i) =>
      i === semana ? { series: s.series.filter((_, j) => j !== serie) } : s,
    ),
  }));

export const editarSerie = (
  c: Contenido,
  ejercicioId: string,
  semana: number,
  serie: number,
  campos: Partial<Serie>,
): Contenido =>
  mapEjercicio(c, ejercicioId, (e) => ({
    ...e,
    semanas: e.semanas.map((s, i) =>
      i !== semana
        ? s
        : { series: s.series.map((x, j) => (j === serie ? { ...x, ...campos } : x)) },
    ),
  }));

/**
 * Copia una semana entera sobre otra, en todos los ejercicios.
 *
 * Es la operación que hace usable el editor: se rellena la semana 1 y se
 * propaga, en vez de teclear cuatro veces lo mismo. NO es una progresión
 * sugerida —copia igual, no incrementa— porque el sistema no propone cargas.
 */
export function copiarSemana(c: Contenido, desde: number, hasta: number): Contenido {
  if (desde === hasta) return c;
  return mapDias(c, (d) => ({
    ...d,
    bloques: d.bloques.map((b) => ({
      ...b,
      ejercicios: b.ejercicios.map((e) => {
        const origen = e.semanas[desde];
        if (!origen || !e.semanas[hasta]) return e;
        return {
          ...e,
          semanas: e.semanas.map((s, i) =>
            i === hasta ? { series: origen.series.map((x) => ({ ...x })) } : s,
          ),
        };
      }),
    })),
  }));
}
