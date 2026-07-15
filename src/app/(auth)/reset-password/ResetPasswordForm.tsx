"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { SITE_URL } from "@/lib/site";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/auth/confirm?next=/update-password`,
    });

    setLoading(false);
    // Mismo mensaje exista o no la cuenta — evita enumeración de emails.
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5 text-center">
        <p className="text-white font-bold text-sm mb-1">Revisa tu correo</p>
        <p className="text-white/55 text-xs leading-relaxed">
          Si <span className="text-white">{email}</span> tiene una cuenta, te enviamos un link para restablecer tu contraseña.
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

      <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
        {loading ? "Enviando…" : "Enviar link de recuperación"}
      </Button>

      <p className="text-center text-xs text-white/50">
        <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
          Volver a iniciar sesión
        </Link>
      </p>
    </form>
  );
}
