// ── Atletas que parecen la misma persona (Sprint PAS-14) ───────────────────
//
// EL CASO REAL: dos fichas llamadas «breyner dudlier riveros», una con sexo y
// país y otra con los dos en blanco, y las evaluaciones repartidas entre las
// dos. El histórico partido en dos expedientes que no se ven entre sí.
//
// ── DETECTAR NO ES FUSIONAR ───────────────────────────────────────────────
//
//   Este módulo SOSPECHA. No decide, no une nada y no toca la base: dice «hay
//   dos fichas con el mismo nombre» y quien sabe si son la misma persona es el
//   profesional, no el nombre.
//
//   Dos hermanos, un padre y un hijo, o dos clientes homónimos son perfectamente
//   posibles. Fusionar por parecido sería inventar una identidad, que es
//   exactamente lo que este sistema se niega a hacer en todas partes.
//
// ── POR QUÉ SE COMPARA ASÍ ────────────────────────────────────────────────
//
//   Sin tildes, sin mayúsculas y con los espacios colapsados: «Breyner  Riveros»
//   y «breyner riveros» son la misma cadena tecleada dos veces, y esa es la
//   forma en que un duplicado aparece de verdad — no con nombres distintos,
//   sino con el mismo escrito dos veces.
//
// Módulo puro.

export interface AtletaComparable {
  id: string;
  nombre: string;
  sexo: string | null;
  fechaNacimiento: string | null;
  pais: string | null;
  estado: string;
}

export interface GrupoDuplicado {
  /** La forma normalizada que comparten. */
  clave: string;
  atletas: AtletaComparable[];
  /**
   * Si los datos de identidad se contradicen entre las fichas.
   *
   * Un dato ausente en una y presente en otra NO es contradicción: es lo que
   * una fusión arreglaría. Dos valores DISTINTOS sí lo son, y entonces casi
   * seguro no son la misma persona.
   */
  identidadEnConflicto: boolean;
}

/** Minúsculas, sin tildes y con los espacios colapsados. */
export function normalizarNombre(nombre: string): string {
  return nombre
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Agrupa por nombre normalizado y devuelve solo los grupos con más de uno.
 *
 * Los eliminados quedan fuera: su ficha existe para conservar el histórico, no
 * para volver a participar de nada.
 */
export function gruposDuplicados(atletas: readonly AtletaComparable[]): GrupoDuplicado[] {
  const porClave = new Map<string, AtletaComparable[]>();

  for (const a of atletas) {
    if (a.estado === 'eliminado') continue;
    const clave = normalizarNombre(a.nombre);
    if (clave === '') continue;
    porClave.set(clave, [...(porClave.get(clave) ?? []), a]);
  }

  const grupos: GrupoDuplicado[] = [];

  for (const [clave, lista] of porClave) {
    if (lista.length < 2) continue;
    grupos.push({ clave, atletas: lista, identidadEnConflicto: hayConflicto(lista) });
  }

  return grupos.sort((a, b) => a.clave.localeCompare(b.clave));
}

/**
 * Dos fichas se contradicen si declaran valores DISTINTOS del mismo dato.
 *
 * Ausente contra presente no cuenta: ese es justo el caso que una fusión
 * resuelve, y marcarlo como conflicto ocultaría el duplicado más común.
 */
function hayConflicto(lista: readonly AtletaComparable[]): boolean {
  const campos = ['sexo', 'fechaNacimiento', 'pais'] as const;

  return campos.some((campo) => {
    const valores = new Set(
      lista.map((a) => a[campo]).filter((v): v is string => v !== null && v !== ''),
    );
    return valores.size > 1;
  });
}

/**
 * Cuál de las fichas conviene conservar.
 *
 * La más completa: cada dato de identidad presente suma. Es una SUGERENCIA
 * para preseleccionar en pantalla — quien decide es el profesional, porque la
 * ficha más completa no tiene por qué ser la que él considera la buena.
 *
 * Empate: la primera, para que la sugerencia sea estable entre recargas y no
 * cambie de opinión sola.
 */
export function masCompleta(lista: readonly AtletaComparable[]): AtletaComparable | null {
  if (lista.length === 0) return null;

  const puntos = (a: AtletaComparable) =>
    [a.sexo, a.fechaNacimiento, a.pais].filter((v) => v !== null && v !== '').length;

  return lista.reduce((mejor, a) => (puntos(a) > puntos(mejor) ? a : mejor), lista[0]);
}
