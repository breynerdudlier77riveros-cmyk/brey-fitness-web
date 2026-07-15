"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import PasswordInput from "@/components/brand/PasswordInput";
import { toast } from "@/components/brand/Toast";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (signInError) {
      setError("Email o contraseña incorrectos.");
      toast.error("No se pudo iniciar sesión.");
      return;
    }

    toast.success("Sesión iniciada.");
    router.push("/app");
    router.refresh();
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
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="text-xs font-semibold text-white/60">
            Contraseña
          </label>
          <Link href="/reset-password" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <PasswordInput
          id="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <Button type="submit" size="lg" className="w-full justify-center" disabled={loading}>
        {loading ? "Entrando…" : "Iniciar sesión"}
      </Button>

      <p className="text-center text-xs text-white/50">
        ¿No tienes cuenta?{" "}
        <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
