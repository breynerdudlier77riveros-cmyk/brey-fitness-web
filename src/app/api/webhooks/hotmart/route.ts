import { createAdminClient } from '@/lib/supabase/admin';
import { sistemaDeProductoHotmart } from '@/data/checkout';
import { interpretarEventoHotmart } from '@/lib/cursos/hotmart';
import { otorgarAcceso, registrarEventoHotmart, revocarAcceso } from '@/lib/cursos/repository';

// ── Webhook de Hotmart (Sprint CURSO-1) ─────────────────────────────────────
//
// Otorga o revoca acceso a un Sistema cuando Hotmart avisa de una compra,
// un reembolso o una cancelación. Usa Service Role Key (createAdminClient):
// esta ruta no tiene sesión de usuario — ES el servidor de Hotmart quien
// llama, nunca un navegador con cookies de este sitio.
//
// ── EL HOTTOK ES UN TOKEN ESTÁTICO, NO UNA FIRMA ──────────────────────────
//
//   Hotmart no firma el cuerpo con HMAC: manda el mismo token de la cuenta,
//   sin cambiar, en el header X-HOTMART-HOTTOK de cada notificación. La
//   comprobación es una simple igualdad — pero en tiempo constante, para no
//   filtrar el token byte a byte por cuánto tarda en fallar la comparación.
//
// ── SIEMPRE 200, INCLUSO CUANDO NO SE HIZO NADA ───────────────────────────
//
//   Hotmart reintenta si no recibe 200 a tiempo. Un producto sin mapear en
//   `hotmartProductoIds`, un email ausente o un evento que no otorga ni
//   revoca NO son errores del webhook — son estados que se registran (para
//   poder auditarlos) y se responden con 200, para que Hotmart no insista
//   reintentando algo que nunca va a cambiar de resultado. Solo un fallo
//   real (Hottok inválido, cuerpo no es JSON) responde con otro código.

function tokenValido(recibido: string | null, esperado: string): boolean {
  if (recibido === null || recibido.length !== esperado.length) return false;
  // Comparación en tiempo constante: recorre todo el string siempre, en vez
  // de salir en la primera diferencia (que es lo que haría `===`).
  let difiere = 0;
  for (let i = 0; i < esperado.length; i++) {
    difiere |= recibido.charCodeAt(i) ^ esperado.charCodeAt(i);
  }
  return difiere === 0;
}

export async function POST(request: Request) {
  const hottok = process.env.HOTMART_HOTTOK;
  if (!hottok) {
    console.error('[webhook/hotmart] HOTMART_HOTTOK sin configurar — notificación rechazada.');
    return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const recibido = request.headers.get('x-hotmart-hottok');
  if (!tokenValido(recibido, hottok)) {
    console.warn('[webhook/hotmart] Hottok inválido en una notificación.');
    return Response.json({ ok: false, error: 'invalid_hottok' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  const evento = interpretarEventoHotmart(payload);
  const supabaseAdmin = createAdminClient();

  // Idempotencia: un reintento del MISMO evento no vuelve a otorgar ni
  // revocar. Sin `idEvento` no hay con qué deduplicar — se procesa igual
  // (es mejor procesar dos veces un evento sin id que no procesarlo nunca),
  // pero queda registrado como tal.
  if (evento.idEvento) {
    const esNuevo = await registrarEventoHotmart(supabaseAdmin, {
      idEvento: evento.idEvento,
      evento: evento.eventoCrudo,
      payload,
    });
    if (!esNuevo) {
      return Response.json({ ok: true, procesado: false, razon: 'evento_duplicado' });
    }
  }

  if (evento.categoria === 'sin_accion') {
    return Response.json({ ok: true, procesado: false, razon: 'evento_sin_accion' });
  }

  if (!evento.email) {
    console.warn(`[webhook/hotmart] ${evento.eventoCrudo} sin email de comprador — ignorado.`);
    return Response.json({ ok: true, procesado: false, razon: 'sin_email' });
  }

  const sistemaSlug = evento.productoId ? sistemaDeProductoHotmart(evento.productoId) : null;
  if (!sistemaSlug) {
    console.warn(
      `[webhook/hotmart] Producto Hotmart '${evento.productoId}' sin Sistema asignado en ` +
        'hotmartProductoIds (src/data/checkout.ts) — no se otorgó ni revocó nada.',
    );
    return Response.json({ ok: true, procesado: false, razon: 'producto_sin_mapear' });
  }

  if (evento.categoria === 'otorga_acceso') {
    await otorgarAcceso(supabaseAdmin, {
      sistemaSlug,
      email: evento.email,
      origen: 'hotmart',
      hotmartTransaccion: evento.idEvento,
    });
  } else {
    await revocarAcceso(supabaseAdmin, sistemaSlug, evento.email);
  }

  return Response.json({ ok: true, procesado: true, sistemaSlug, categoria: evento.categoria });
}
