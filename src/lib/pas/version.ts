// ── Versión del Performance Assessment Engine (Sprint PAS-2.0) ─────────────
// El invariante I-11 exige que todo análisis declare con qué versiones se
// calculó. La del motor es esta constante; la del catálogo llega en la
// solicitud, y la fecha de cálculo se recibe como `hoyISO` — nunca se lee el
// reloj (ver `fechas.ts`).

/** Versión del motor de derivación. Cambia cuando cambian sus reglas. */
export const VERSION_MOTOR = 'pae-1.0.0';
