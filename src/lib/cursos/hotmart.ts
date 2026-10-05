// ── Interpretar una notificación de Hotmart (Sprint CURSO-1) ───────────────
//
// PURO. Recibe el cuerpo JSON que Hotmart manda al webhook y dice qué
// significa — no toca la base de datos, no verifica el Hottok (eso es un
// header, y comparar un header no es interpretar un payload: vive en la
// ruta, `src/app/api/webhooks/hotmart/route.ts`).
//
// ── POR QUÉ SE LEE CON RUTAS ALTERNATIVAS Y NO UNA SOLA ───────────────────
//
//   Hotmart no documenta un único payload estable entre versiones ni entre
//   tipos de producto (venta única vs. suscripción): el comprador aparece
//   como `data.buyer`, a veces `data.subscriber`. Exigir una sola forma
//   dejaría el webhook roto en silencio el día que Hotmart mande la otra. Se
//   intenta cada ruta conocida, en orden, y se usa la primera que aparece.
//
// ── POR QUÉ EL ESTADO ES UN CONJUNTO CERRADO Y NO EL STRING CRUDO ─────────
//
//   Hotmart publica más de un nombre para «esto ya no da acceso»
//   (`CANCELED`, `REFUNDED`, `CHARGEBACK`, `EXPIRED`...). Otorgar o revocar
//   acceso con un `switch` que compara el string crudo es el sitio exacto
//   donde una variante nueva pasa desapercibida. Aquí se reduce a dos
//   categorías con nombre, y lo que no encaja en ninguna se declara — no se
//   asume.

/** Lo mínimo que hace falta para decidir qué hacer con una notificación. */
export interface EventoHotmart {
  /** Tal como lo mandó Hotmart — para guardarlo en el log crudo. */
  eventoCrudo: string;
  /** Id de la notificación o de la transacción. Clave de idempotencia. */
  idEvento: string | null;
  email: string | null;
  /** Id del producto en Hotmart, para casarlo con `hotmartProductoIds`. */
  productoId: string | null;
  categoria: 'otorga_acceso' | 'revoca_acceso' | 'sin_accion';
}

const EVENTOS_QUE_OTORGAN = new Set([
  'PURCHASE_APPROVED',
  'PURCHASE_COMPLETE',
  'PURCHASE_COMPLETED',
  'SUBSCRIPTION_REACTIVATED',
]);

const EVENTOS_QUE_REVOCAN = new Set([
  'PURCHASE_CANCELED',
  'PURCHASE_CANCELLED',
  'PURCHASE_REFUNDED',
  'PURCHASE_CHARGEBACK',
  'PURCHASE_EXPIRED',
  'SUBSCRIPTION_CANCELLATION',
  'SUBSCRIPTION_CANCELED',
  'SUBSCRIPTION_CANCELLED',
]);

/** Lee un campo de texto de una ruta anidada, o `null` si no es texto. */
function texto(valor: unknown): string | null {
  return typeof valor === 'string' && valor.trim() !== '' ? valor.trim() : null;
}

function campo(objeto: unknown, ...ruta: string[]): unknown {
  let actual: unknown = objeto;
  for (const clave of ruta) {
    if (typeof actual !== 'object' || actual === null) return undefined;
    actual = (actual as Record<string, unknown>)[clave];
  }
  return actual;
}

/** El primer valor no nulo de una lista de rutas, ya como texto. */
function primeraRuta(payload: unknown, rutas: readonly string[][]): string | null {
  for (const ruta of rutas) {
    const valor = texto(campo(payload, ...ruta));
    if (valor !== null) return valor;
  }
  return null;
}

export function interpretarEventoHotmart(payload: unknown): EventoHotmart {
  const eventoCrudo =
    texto(campo(payload, 'event')) ?? texto(campo(payload, 'data', 'purchase', 'status')) ?? 'DESCONOCIDO';
  const nombreEvento = eventoCrudo.toUpperCase();

  const email = primeraRuta(payload, [
    ['data', 'buyer', 'email'],
    ['data', 'shopper', 'email'],
    ['data', 'subscriber', 'email'],
    ['buyer', 'email'],
    ['email'],
  ])?.toLowerCase() ?? null;

  const idEvento = primeraRuta(payload, [
    ['id'],
    ['data', 'purchase', 'transaction'],
    ['transaction'],
  ]);

  const productoId = primeraRuta(payload, [
    ['data', 'product', 'id'],
    ['product', 'id'],
    ['prod'],
  ]);

  const categoria: EventoHotmart['categoria'] = EVENTOS_QUE_OTORGAN.has(nombreEvento)
    ? 'otorga_acceso'
    : EVENTOS_QUE_REVOCAN.has(nombreEvento)
      ? 'revoca_acceso'
      : 'sin_accion';

  return { eventoCrudo, idEvento, email, productoId, categoria };
}
