import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ── Confirma links de correo (registro y recuperación de contraseña) ───────
// Un solo handler para ambos flujos — el parámetro `type` los distingue.
// Usa verifyOtp({token_hash, type}), NO exchangeCodeForSession(code): las
// plantillas de email por defecto de Supabase no emiten un `code` PKCE, y
// aunque se reconfiguraran, PKCE exige abrir el link en el MISMO navegador
// donde se pidió — un fallo real y común (pedir el reset en el computador,
// abrir el correo en el celular). verifyOtp no tiene esa restricción.
//
// Requiere que las plantillas de email en el Dashboard de Supabase
// (Authentication → Email Templates) apunten a
// {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup
// (y type=recovery en la plantilla de reset) — paso manual, no automatizable.

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/app";

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=confirmacion", origin));
}
