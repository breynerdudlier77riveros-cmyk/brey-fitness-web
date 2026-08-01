"use client";

import { useState } from "react";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { toast } from "@/components/brand/Toast";
import { Spinner } from "@/components/brand/icons";
import { crearCliente, editarCliente } from "@/lib/bcs/actions";
import type { Cliente } from "@/lib/bcs/tipos";

// ── Formulario de alta/edición de Cliente — UC-01/UC-02 ────────────────────
// Mismo patrón de estado que PerfilForm.tsx (useState por campo + enum de
// estado), pero llamando directamente a los Server Actions ya construidos
// (patrón BE-01, el mismo que ya sigue src/lib/bcs/actions.ts) en vez de
// hablar directo con el repositorio — es la vía correcta para datos de
// Entrenador→Cliente, distinta de la excepción histórica de PerfilForm.

interface Props {
  cliente?: Cliente;
  onCancel: () => void;
  onSaved: (cliente: Cliente) => void;
}

type Estado = "idle" | "guardando" | "error";

export default function ClienteForm({ cliente, onCancel, onSaved }: Props) {
  const [nombre, setNombre] = useState(cliente?.nombre ?? "");
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "guardando") return;
    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    setEstado("guardando");
    setError(null);

    const resultado = cliente ? await editarCliente(cliente.id, nombre) : await crearCliente(nombre);

    if (!resultado.ok) {
      setEstado("error");
      setError("No se pudo guardar el cliente. Inténtalo de nuevo.");
      toast.error("No se pudo guardar el cliente.");
      return;
    }

    setEstado("idle");
    toast.success(cliente ? "Cliente actualizado." : "Cliente creado.");
    onSaved(resultado.data);
  }

  const guardando = estado === "guardando";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre-cliente" className="block text-xs font-semibold text-white/60 mb-1.5">
          Nombre del cliente
        </label>
        <Input
          id="nombre-cliente"
          required
          autoFocus
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={guardando}
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" size="md" disabled={guardando}>
          {guardando ? (
            <>
              <Spinner className="w-4 h-4 animate-spin" strokeWidth={2.5} />
              Guardando…
            </>
          ) : cliente ? (
            "Guardar cambios"
          ) : (
            "Crear cliente"
          )}
        </Button>
        <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={guardando}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
