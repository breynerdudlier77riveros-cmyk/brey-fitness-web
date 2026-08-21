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
//
// ── SEXO Y FECHA DE NACIMIENTO ────────────────────────────────────────────
//
// Los dos son OPCIONALES y los dos dicen para qué sirven, porque sin esa
// frase parecen burocracia. No lo son: de las cuatro variables que el BCS
// puede clasificar, dos dependen de ellos (% grasa y WHR, BCS Handbook 06), y
// el % de grasa es el número por el que un cliente abre el informe.
//
// Se piden, no se deducen. El sexo no se infiere del nombre y la edad no se
// infiere de nada: el informe prefiere decir «falta este dato» a clasificar
// con una identidad inventada.

const MENSAJE: Record<string, string> = {
  NOMBRE_VACIO: "El nombre no puede estar vacío.",
  FECHA_NACIMIENTO_INVALIDA: "La fecha de nacimiento no es válida.",
  FECHA_NACIMIENTO_FUTURA: "La fecha de nacimiento no puede ser posterior a hoy.",
  NO_AUTENTICADO: "La sesión ha caducado.",
};

interface Props {
  cliente?: Cliente;
  onCancel: () => void;
  onSaved: (cliente: Cliente) => void;
}

type Estado = "idle" | "guardando" | "error";

export default function ClienteForm({ cliente, onCancel, onSaved }: Props) {
  const [nombre, setNombre] = useState(cliente?.nombre ?? "");
  const [sexo, setSexo] = useState<string>(cliente?.sexo ?? "");
  const [nacimiento, setNacimiento] = useState(cliente?.fecha_nacimiento ?? "");
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

    // La cadena vacía es «no consta», no un valor: se envía como null para que
    // borrar el campo en la pantalla lo borre también en la fila.
    const identidad = {
      sexo: (sexo === "M" || sexo === "F" ? sexo : null) as Cliente["sexo"],
      fechaNacimiento: nacimiento.trim() === "" ? null : nacimiento,
    };

    const resultado = cliente
      ? await editarCliente(cliente.id, nombre, identidad)
      : await crearCliente(nombre, identidad);

    if (!resultado.ok) {
      setEstado("error");
      const texto = MENSAJE[resultado.error] ?? "No se pudo guardar el cliente. Inténtalo de nuevo.";
      setError(texto);
      toast.error(texto);
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
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sexo-cliente" className="block text-xs font-semibold text-white/60 mb-1.5">
            Sexo
            <span className="ml-2 font-normal text-white/35">Opcional</span>
          </label>
          {/* Fondo opaco y `color-scheme: dark`: un select translúcido deja el
              desplegable nativo en blanco sobre blanco. */}
          <select
            id="sexo-cliente"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            disabled={guardando}
            className="h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500/40 [color-scheme:dark]"
          >
            <option value="" className="bg-slate-900 text-white">
              No consta
            </option>
            <option value="M" className="bg-slate-900 text-white">
              Masculino
            </option>
            <option value="F" className="bg-slate-900 text-white">
              Femenino
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="nacimiento-cliente"
            className="block text-xs font-semibold text-white/60 mb-1.5"
          >
            Fecha de nacimiento
            <span className="ml-2 font-normal text-white/35">Opcional</span>
          </label>
          <Input
            id="nacimiento-cliente"
            type="date"
            value={nacimiento}
            onChange={(e) => setNacimiento(e.target.value)}
            disabled={guardando}
          />
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-white/35">
        Los dos son opcionales, pero sin ellos el informe no puede situar el porcentaje de grasa
        corporal ni la relación cintura-cadera: sus rangos de referencia se publican por sexo y por
        edad. Se guarda la fecha de nacimiento y no la edad, para que cada medición se interprete
        con la edad que el cliente tenía ese día.
      </p>

      {error && (
        <p role="alert" className="text-red-400 text-xs">
          {error}
        </p>
      )}

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
