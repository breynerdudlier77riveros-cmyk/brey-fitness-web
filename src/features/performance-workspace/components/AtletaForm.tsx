"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { accionCrearAtleta, accionEditarAtleta } from "../actions/atletas";
import type { Atleta } from "../schemas/tipos";

// ── Alta y edición de atleta (Sprint PAS-7.0) ──────────────────────────────
// Cliente porque necesita estado de formulario. Toda la validación real vive
// en `schemas/validacion.ts` y se ejecuta en el servidor: esto solo traduce
// códigos de error a texto.

const MENSAJE: Record<string, string> = {
  NOMBRE_REQUERIDO: "El nombre es obligatorio.",
  NOMBRE_DEMASIADO_LARGO: "El nombre supera los 120 caracteres.",
  CAMPO_DEMASIADO_LARGO: "Alguno de los campos supera su longitud máxima.",
  FECHA_INVALIDA: "La fecha de nacimiento no es válida.",
  ATLETA_ELIMINADO: "Este atleta está eliminado y no admite cambios.",
  NO_AUTENTICADO: "La sesión ha caducado.",
};

interface Props {
  atleta?: Atleta;
}

export default function AtletaForm({ atleta }: Props) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function enviar(datos: FormData) {
    const entrada = {
      nombre: String(datos.get("nombre") ?? ""),
      documento: String(datos.get("documento") ?? "") || undefined,
      codigoInterno: String(datos.get("codigoInterno") ?? "") || undefined,
      deporte: String(datos.get("deporte") ?? "") || undefined,
      fechaNacimiento: String(datos.get("fechaNacimiento") ?? "") || undefined,
    };

    iniciar(async () => {
      const resultado = atleta
        ? await accionEditarAtleta(atleta.id, entrada)
        : await accionCrearAtleta(entrada);

      if (!resultado.ok) {
        setError(MENSAJE[resultado.error] ?? "No se pudo guardar.");
        return;
      }

      setError(null);
      router.push(`/app/rendimiento/${resultado.data.id}`);
    });
  }

  return (
    <form action={enviar} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Nombre</span>
          <Input name="nombre" defaultValue={atleta?.nombre ?? ""} required maxLength={120} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Deporte</span>
          <Input name="deporte" defaultValue={atleta?.deporte ?? ""} maxLength={60} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Documento</span>
          <Input name="documento" defaultValue={atleta?.documento ?? ""} maxLength={40} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Código interno</span>
          <Input name="codigoInterno" defaultValue={atleta?.codigoInterno ?? ""} maxLength={40} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">
            Fecha de nacimiento
          </span>
          <Input type="date" name="fechaNacimiento" defaultValue={atleta?.fechaNacimiento ?? ""} />
        </label>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pendiente}>
        {pendiente ? "Guardando…" : atleta ? "Guardar cambios" : "Crear atleta"}
      </Button>
    </form>
  );
}
