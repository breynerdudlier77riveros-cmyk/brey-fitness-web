// ── Patrones con norma publicada (Sprint PAS-15) ───────────────────────────
//
// POR QUÉ ESTE MÓDULO EXISTE.
//
//   El 1RM declara `requierePatron: true`: sin saber QUÉ se levantó, la cifra
//   no significa nada. Hasta ahora el patrón era texto libre, y en datos
//   reales llegó escrito como «Sentadilla», «press banca», «Peso muerto» y
//   «Dominadas» — cuatro formatos distintos para cuatro ejercicios.
//
//   Texto libre está bien para registrar. Lo que no puede hacerse con texto
//   libre es DECIDIR a qué norma se compara: «press banca» y «press banca
//   inclinado» se parecen y no son lo mismo, y aplicar la norma del primero al
//   segundo sería comparar contra una población que hizo otro ejercicio.
//
// ── LA EQUIVALENCIA ES EXACTA, NUNCA APROXIMADA ───────────────────────────
//
//   Se normaliza (minúsculas, sin tildes, espacios colapsados) y se compara
//   contra una lista cerrada de alias. Lo que no está en la lista NO tiene
//   patrón canónico, y por tanto no tiene norma.
//
//   Nada de coincidencias parciales ni de «contiene la palabra sentadilla».
//   «Sentadilla búlgara» contiene «sentadilla» y no es una sentadilla con
//   barra: emparejarlas produciría exactamente el error que este módulo
//   existe para impedir.
//
// Módulo puro.

/** Los patrones para los que hay norma publicada y verificada. */
export type PatronCanonico = 'sentadilla' | 'press_banca' | 'peso_muerto';

export const PATRONES_CANONICOS: readonly PatronCanonico[] = [
  'sentadilla',
  'press_banca',
  'peso_muerto',
];

export const ETIQUETA_PATRON: Readonly<Record<PatronCanonico, string>> = {
  sentadilla: 'Sentadilla con barra',
  press_banca: 'Press de banca',
  peso_muerto: 'Peso muerto',
};

/**
 * Cómo lo escribe la gente.
 *
 * Lista cerrada y deliberadamente corta. Cada entrada es una forma que un
 * profesional teclea de verdad para EXACTAMENTE ese levantamiento; añadir una
 * variante del ejercicio aquí (inclinado, búlgara, sumo) sería declarar que
 * comparte norma con el original, y eso lo decide la literatura, no esta
 * lista.
 */
const ALIAS: Readonly<Record<string, PatronCanonico>> = {
  sentadilla: 'sentadilla',
  'sentadilla con barra': 'sentadilla',
  'sentadilla trasera': 'sentadilla',
  'back squat': 'sentadilla',
  squat: 'sentadilla',

  'press banca': 'press_banca',
  'press de banca': 'press_banca',
  'press de banca con barra': 'press_banca',
  'press banca con barra': 'press_banca',
  'bench press': 'press_banca',
  banca: 'press_banca',

  'peso muerto': 'peso_muerto',
  'peso muerto convencional': 'peso_muerto',
  deadlift: 'peso_muerto',
};

/** Minúsculas, sin tildes, espacios colapsados. Solo para comparar. */
export function normalizarPatron(texto: string): string {
  return texto
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * El patrón canónico de un texto libre, o `null` si no hay equivalencia exacta.
 *
 * `null` NO es un error: es la respuesta correcta para «Dominadas», que es un
 * ejercicio legítimo sin norma publicada en esta fuente. Lo que significa es
 * que ese registro se guarda igual y no se compara con nada.
 */
export function patronCanonico(texto: string | null | undefined): PatronCanonico | null {
  if (typeof texto !== 'string') return null;
  const clave = normalizarPatron(texto);
  if (clave === '') return null;

  // IDEMPOTENTE. Un id canónico se devuelve a sí mismo, y esto no es adorno:
  // las referencias guardan el id (`press_banca`) y las mediciones guardan lo
  // que tecleó el profesional (`press banca`), así que la función recibe las
  // dos formas. Sin esta línea, `press_banca` no estaba en los alias —solo
  // `press banca`, con espacio— y la norma de press de banca se descartaba a
  // sí misma por «ser de otro levantamiento».
  //
  // Se coló porque `sentadilla` sí figuraba en los alias mapeándose a sí
  // misma, así que ese levantamiento funcionaba y los otros dos no. Un caso
  // que pasa por casualidad es peor que uno que falla siempre.
  if ((PATRONES_CANONICOS as readonly string[]).includes(clave)) {
    return clave as PatronCanonico;
  }

  return ALIAS[clave] ?? null;
}

/** Si un texto libre tiene norma disponible. Para avisarlo en el formulario. */
export const tieneNorma = (texto: string | null | undefined): boolean =>
  patronCanonico(texto) !== null;
