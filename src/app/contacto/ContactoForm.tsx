"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Check } from "@/components/ui/icons";

type Estado = "idle" | "enviando" | "ok" | "error" | "sin-servicio";

const inputStyles =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.10] text-sm text-white placeholder:text-white/50 focus:outline-none focus:border-orange-500/50 transition-colors";

export default function ContactoForm({ emailDirecto }: { emailDirecto: string }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nombre, email, mensaje }),
      });
      if (res.ok) setEstado("ok");
      else if (res.status === 503) setEstado("sin-servicio");
      else setEstado("error");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div className="flex items-start gap-3 text-sm text-emerald-400">
        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
        <p className="text-white/70 leading-relaxed">
          <span className="text-emerald-400 font-bold">Mensaje enviado.</span>{" "}
          Te respondemos en un máximo de 24–48 horas hábiles.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nombre" className="block text-xs font-bold text-white/70 mb-2">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          required
          maxLength={120}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Tu nombre"
          className={inputStyles}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-xs font-bold text-white/70 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className={inputStyles}
        />
      </div>
      <div>
        <label htmlFor="mensaje" className="block text-xs font-bold text-white/70 mb-2">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          required
          rows={5}
          maxLength={4000}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Cuéntanos en qué podemos ayudarte"
          className={`${inputStyles} resize-y min-h-[120px]`}
        />
      </div>

      <Button type="submit" size="md" disabled={estado === "enviando"} className="self-start">
        {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
      </Button>

      {estado === "sin-servicio" && (
        <p className="text-xs text-white/60 leading-relaxed">
          El formulario estará disponible muy pronto. Mientras tanto, escríbenos directo a{" "}
          <a href={`mailto:${emailDirecto}`} className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
            {emailDirecto}
          </a>
          .
        </p>
      )}
      {estado === "error" && (
        <p className="text-xs text-red-400 leading-relaxed">
          No pudimos enviar el mensaje. Inténtalo de nuevo o escríbenos a{" "}
          <a href={`mailto:${emailDirecto}`} className="underline">{emailDirecto}</a>.
        </p>
      )}

      <p className="text-[11px] text-white/50 leading-relaxed">
        Al enviar aceptas nuestra{" "}
        <a href="/privacidad" className="underline hover:text-white/80 transition-colors">
          política de privacidad
        </a>
        . Usamos tus datos únicamente para responderte.
      </p>
    </form>
  );
}
