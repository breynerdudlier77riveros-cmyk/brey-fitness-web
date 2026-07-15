"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { SITE_URL } from "@/lib/site";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${SITE_URL}/auth/confirm?next=/app` },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Mismo mensaje siempre, exista o no la cuenta ya — evita enumeración de emails.
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5 text-center">
        <p className="text-white font-bold text-sm mb-1">Revisa tu correo</p>
        <p className="text-white/55 text-xs leading-relaxed">
          Si <span className="text-white">{email}</span> es válido, te enviamos un link de confirmación. Ábrelo para activar tu cuenta.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Input
          id="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
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
