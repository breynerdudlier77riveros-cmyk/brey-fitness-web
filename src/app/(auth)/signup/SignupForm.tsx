"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import PasswordInput from "@/components/brand/PasswordInput";
import { toast } from "@/components/brand/Toast";
import { SITE_URL } from "@/lib/site";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function SignupForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (nombre.trim().length < 2) {
      setError("Escribe tu nombre.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Ese email no parece válido.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // raw_user_meta_data.nombre — el trigger de public.profiles lo lee
        // para nombrar el perfil real (ver supabase/schema.sql).
        data: { nombre: nombre.trim() },
        emailRedirectTo: `${SITE_URL}/auth/confirm?next=/app`,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      toast.error("No se pudo crear la cuenta.");
      return;
    }

    // Mismo mensaje siempre, exista o no la cuenta ya — evita enumeración
    // de emails. No inicia sesión automáticamente: si el proyecto exige
    // confirmación por correo (por defecto en Supabase), signUp() no
    // devuelve una sesión utilizable todavía.
    toast.success("Cuenta creada — revisa tu correo.");
    setEnviado(true);
  }

  async function handleResend() {
    setReenviando(true);
    const supabase = createClient();
    // resend() es la vía correcta para "no me llegó el correo" — volver a
    // llamar signUp() con el mismo email tiene un comportamiento ambiguo
    // (no siempre reenvía) y además está sujeto al mismo rate limit.
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${SITE_URL}/auth/confirm?next=/app` },
    });
    setReenviando(false);

    if (resendError) {
      toast.error(resendError.message);
      return;
    }
    toast.success("Correo reenviado.");
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5 text-center">
        <p className="text-white font-bold text-sm mb-1">Revisa tu correo</p>
        <p className="text-white/55 text-xs leading-relaxed mb-4">
          Si <span className="text-white">{email}</span> es válido, te enviamos un link de confirmación. Ábrelo para activar tu cuenta.
        </p>
        <button
          type="button"
          onClick={handleResend}
          disabled={reenviando}
          className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {reenviando ? "Reenviando…" : "¿No te llegó? Reenviar correo"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-xs font-semibold text-white/60 mb-1.5">
          Nombre
        </label>
        <Input
          id="nombre"
          type="text"
          required
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-white/60 mb-1.5">
          Email
        </label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-white/60 mb-1.5">
          Contraseña
        </label>
        <PasswordInput
          id="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label htmlFor="confirmar" className="block text-xs font-semibold text-white/60 mb-1.5">
          Confirmar contraseña
        </label>
        <PasswordInput
          id="confirmar"
          required
          autoComplete="new-password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          placeholder="Repite tu contraseña"
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
        {loading ? "Creando cuenta…" : "Crear cuenta"}
      </Button>

      <p className="text-center text-xs text-white/50">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
