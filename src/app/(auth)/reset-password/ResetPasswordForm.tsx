"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { toast } from "@/components/brand/Toast";
import { SITE_URL } from "@/lib/site";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Compartida entre el envío inicial y "reenviar" — resetPasswordForEmail()
  // ya es su propio mecanismo de reenvío, a diferencia de signUp(), así que
  // no hace falta un método distinto: solo exponer un botón que la vuelva
  // a llamar con el mismo email.
  async function enviarLink() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/auth/confirm?next=/update-password`,
    });
    setLoading(false);
    // Mismo mensaje exista o no la cuenta — evita enumeración de emails.
    toast.success("Link de recuperación enviado.");
    setEnviado(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await enviarLink();
  }

  if (enviado) {
    return (
      <div className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.05] p-5 text-center">
        <p className="text-white font-bold text-sm mb-1">Revisa tu correo</p>
        <p className="text-white/55 text-xs leading-relaxed mb-4">
          Si <span className="text-white">{email}</span> tiene una cuenta, te enviamos un link para restablecer tu contraseña.
        </p>
        <button
          type="button"
          onClick={enviarLink}
          disabled={loading}
          className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Reenviando…" : "¿No te llegó? Reenviar correo"}
        </button>
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
