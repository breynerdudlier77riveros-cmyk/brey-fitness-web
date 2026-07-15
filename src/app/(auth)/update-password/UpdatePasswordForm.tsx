"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/brand/Button";
import PasswordInput from "@/components/brand/PasswordInput";
import { toast } from "@/components/brand/Toast";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

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
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      toast.error("No se pudo actualizar la contraseña.");
      return;
    }

    toast.success("Contraseña actualizada.");
    router.push("/app");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-white/60 mb-1.5">
          Nueva contraseña
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
          Confirmar nueva contraseña
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
        {loading ? "Guardando…" : "Actualizar contraseña"}
      </Button>
    </form>
  );
}
