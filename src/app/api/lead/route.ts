const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Crea o actualiza un contacto en Brevo. Requiere BREVO_API_KEY (y opcional
// BREVO_LIST_ID) en el entorno — ver .env.example y LANZAMIENTO.md.
// Acepta atributos opcionales para la lista de espera de Sistemas:
// `nombre` y `objetivo` llegan a Brevo como NOMBRE y OBJETIVO.
export async function POST(request: Request) {
  let email = '';
  let source = 'web';
  let nombre = '';
  let objetivo = '';
  try {
    const body = await request.json();
    email = String(body.email ?? '').trim().toLowerCase();
    source = String(body.source ?? 'web').slice(0, 80);
    nombre = String(body.nombre ?? '').trim().slice(0, 120);
    objetivo = String(body.objetivo ?? '').trim().slice(0, 120);
  } catch {
    return Response.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn(`[lead] BREVO_API_KEY sin configurar — lead perdido: ${email} (${source})`);
    return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const listId = Number(process.env.BREVO_LIST_ID);
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      updateEnabled: true,
      attributes: {
        FUENTE: source,
        ...(nombre ? { NOMBRE: nombre } : {}),
        ...(objetivo ? { OBJETIVO: objetivo } : {}),
      },
      ...(Number.isFinite(listId) && listId > 0 ? { listIds: [listId] } : {}),
    }),
  });

  // 201 creado · 204 actualizado · duplicado también cuenta como éxito
  if (res.ok || res.status === 204) {
    return Response.json({ ok: true });
  }

  const detail = await res.text().catch(() => '');
  if (detail.includes('duplicate_parameter')) {
    return Response.json({ ok: true });
  }

  console.error(`[lead] Brevo respondió ${res.status}: ${detail.slice(0, 300)}`);
  return Response.json({ ok: false, error: 'provider_error' }, { status: 502 });
}
