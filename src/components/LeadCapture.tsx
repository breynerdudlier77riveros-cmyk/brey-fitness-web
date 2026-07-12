"use client";

import { useState } from "react";
import { Check } from "@/components/ui/icons";
import Button from "@/components/ui/Button";

interface Props {
  source: string;
  title?: string;
  buttonLabel?: string;
  compact?: boolean;
  className?: string;
}

type Status = "idle" | "loading" | "ok" | "error";

export default function LeadCapture({
  source,
  title,
  buttonLabel = "Avísame",
  compact = false,
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (res.ok) {
        setStatus("ok");
        setMessage("Listo — revisa tu correo pronto.");
      } else if (res.status === 400) {
        setStatus("error");
        setMessage("Ese email no parece válido. Revísalo e inténtalo de nuevo.");
      } else {
        setStatus("error");
        setMessage("El registro estará disponible muy pronto. Inténtalo más tarde.");
      }
    } catch {
      setStatus("error");
      setMessage("No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.");
    }
  }

  if (status === "ok") {
    return (
      <div className={`flex items-center gap-2.5 text-sm text-emerald-400 ${className}`}>
        <Check className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
        {message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {title && !compact && (
        <p className="text-sm font-semibold text-white/70 mb-3">{title}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          aria-label="Tu email"
          className="flex-1 min-w-0 px-4 py-3 rounded-full bg-white/[0.04] border border-white/[0.10] text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500/50 transition-colors"
        />
        <Button type="submit" size="md" disabled={status === "loading"}>
          {status === "loading" ? "Enviando…" : buttonLabel}
        </Button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-400 mt-2">{message}</p>
      )}
      <p className="text-[10px] text-white/50 mt-2">
        Sin spam. Puedes darte de baja cuando quieras.
      </p>
    </form>
  );
}
