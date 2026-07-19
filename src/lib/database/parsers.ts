// ── Coerción numérica desde PostgREST ───────────────────────────────────────
// PostgREST (el API REST que expone Supabase sobre Postgres) serializa
// columnas `numeric` como STRING en el JSON de respuesta — para no perder
// precisión en el redondeo flotante — mientras que columnas `int`/`integer`
// sí llegan como número real. `src/lib/types.ts` declara `numeric` como
// `number | null` (la forma que el dominio necesita); esta es la ÚNICA
// función que debe cerrar esa brecha. Ningún mapper ni call site debe volver
// a escribir `Number(row.algo)` a mano — si aparece un `Number(` operando
// sobre un valor que vino de una fila de Supabase, es una señal de que
// `numOrNull()` no se está usando donde debería.
//
// No existen intOrNull()/boolOrFalse()/dateOrNull() a propósito: las
// columnas `int`, `boolean`, `date` y `timestamptz` de este esquema ya
// llegan con el tipo real esperado — construir esas funciones sin un solo
// caso que las necesite sería una capa sin propósito.

export function numOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
