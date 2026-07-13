"use client";

import { useState } from "react";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import Select from "@/components/brand/Select";
import { Check } from "@/components/brand/icons";

// ── Lista de espera de Sistemas no disponibles ──────────────────────────────
// Captura nombre + correo + objetivo (decisión BREY v2). No vende: promete
// aviso prioritario. Los contactos llegan a Brevo con FUENTE espera-<slug>
// y atributos NOMBRE / OBJETIVO.

const objetivos = [
  "Ganar fuerza máxima",
  "Ganar masa muscular",
  "Dominar habilidades de peso corporal",
  "Combinar cargas y calistenia",
  "Transformación completa con coaching",
];

type Estado = "idle" | "enviando" | "ok" | "error";

export default function WaitlistForm({ sistemaSlug }: { sistemaSlug: string }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [objetivo, setObjetivo] = useState(objetivos[0]);
  const [estado, setEstado] = useState<Estado>("idle");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, nombre, objetivo, source: `espera-${sistemaSlug}` }),
      });
      setEstado(res.ok ? "ok" : "error");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div className="flex items-start gap-3 text-sm">
        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
        <p className="text-white/70 leading-relaxed">
          <span className="text-emerald-400 font-bold">Estás en la lista.</span>{" "}
          Serás de los primeros en saber cuando este Sistema abra.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3">
      <Input
        type="text"
        required
        maxLength={120}
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Tu nombre"
        aria-label="Tu nombre"
        className="w-full"
      />
      <Input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tu@email.com"
        aria-label="Tu email"
        className="w-full"
      />
      <Select
        value={objetivo}
        onValueChange={setObjetivo}
        options={objetivos}
        aria-label="Tu objetivo principal"
      />

      <Button type="submit" size="md" disabled={estado === "enviando"} className="w-full">
        {estado === "enviando" ? "Enviando…" : "Quiero ser de los primeros en acceder"}
      </Button>

      {estado === "error" && (
        <p className="text-xs text-red-400">
          No pudimos registrarte. Inténtalo de nuevo en unos minutos.
        </p>
      )}
      <p className="text-[10px] text-white/50">Sin spam. Solo el aviso de apertura.</p>
    </form>
  );
}
