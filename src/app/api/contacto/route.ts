import { CONTACT_EMAIL } from '@/lib/site';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Reenvía el mensaje del formulario de /contacto al buzón corporativo usando
// el email transaccional de Brevo. Requiere BREVO_API_KEY y que el remitente
// (CONTACT_EMAIL) esté verificado como sender en Brevo — ver LANZAMIENTO.md.
// Sin la clave: 503 y la interfaz ofrece el email directo (nunca un formulario
// que finge enviar).
export async function POST(request: Request) {
  let nombre = '';
  let email = '';
  let mensaje = '';
  try {
    const body = await request.json();
    nombre = String(body.nombre ?? '').trim().slice(0, 120);
    email = String(body.email ?? '').trim().toLowerCase();
    mensaje = String(body.mensaje ?? '').trim().slice(0, 4000);
  } catch {
    return Response.json({ ok: false, error: 'invalid_body' }, { status: 400 });
  }

  if (!EMAIL_RE.test(email) || nombre.length === 0 || mensaje.length === 0) {
    return Response.json({ ok: false, error: 'invalid_fields' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn(`[contacto] BREVO_API_KEY sin configurar — mensaje perdido de: ${email}`);
    return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Web Brey Fitness', email: CONTACT_EMAIL },
      to: [{ email: CONTACT_EMAIL }],
      replyTo: { email, name: nombre },
      subject: `Contacto web — ${nombre}`,
      textContent: `Nombre: ${nombre}\nEmail: ${email}\n\n${mensaje}`,
    }),
  });

  if (res.ok) {
    return Response.json({ ok: true });
  }

  const detail = await res.text().catch(() => '');
  console.error(`[contacto] Brevo respondió ${res.status}: ${detail.slice(0, 300)}`);
  return Response.json({ ok: false, error: 'provider_error' }, { status: 502 });
}
