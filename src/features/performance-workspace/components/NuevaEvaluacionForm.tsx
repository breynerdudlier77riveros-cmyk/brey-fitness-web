"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { accionCrearEvaluacion } from "../actions/evaluaciones";
import type { TipoEvaluacion } from "@/lib/pas";

// ── Alta de evaluación (Sprint PAS-7.0) ────────────────────────────────────
// Los seis tipos son los del PAS. El Workspace no inventa ninguno ni infiere
// cuál corresponde: el tipo lo declara quien evalúa (PAS §06).

const TIPOS: readonly { id: TipoEvaluacion; nombre: string }[] = [
  { id: "T-01", nombre: "Inicial" },
  { id: "T-02", nombre: "Seguimiento" },
  { id: "T-03", nombre: "Reevaluación" },
  { id: "T-04", nombre: "Control" },
  { id: "T-05", nombre: "Alta" },
  { id: "T-06", nombre: "Competencia" },
];

const MENSAJE: Record<string, string> = {
  FECHA_INVALIDA: "La fecha no es válida.",
  FECHA_FUTURA: "La fecha no puede ser posterior a hoy.",
  TIPO_INVALIDO: "El tipo de evaluación no es válido.",
  ATLETA_REQUERIDO: "Falta el atleta.",
  NO_AUTENTICADO: "La sesión ha caducado.",
};

interface Props {
  atletaId: string;
  fechaPorDefecto: string;
}

export default function NuevaEvaluacionForm({ atletaId, fechaPorDefecto }: Props) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function enviar(datos: FormData) {
    iniciar(async () => {
      const resultado = await accionCrearEvaluacion({
        atletaId,
        tipo: String(datos.get("tipo") ?? "T-01") as TipoEvaluacion,
        fecha: String(datos.get("fecha") ?? fechaPorDefecto),
      });

      if (!resultado.ok) {
        setError(MENSAJE[resultado.error] ?? "No se pudo crear la evaluación.");
        return;
      }

      setError(null);
      router.push(`/app/rendimiento/evaluacion/${resultado.data.id}`);
    });
  }

  return (
    <form action={enviar} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Tipo</span>
          {/* Fondo opaco y `color-scheme: dark`: ver la nota en
              RegistroPruebaForm. Un select translúcido deja el desplegable
              nativo en blanco sobre blanco. */}
          <select
            name="tipo"
            defaultValue="T-01"
            className="h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500/40 [color-scheme:dark]"
          >
            {TIPOS.map((tipo) => (
              <option key={tipo.id} value={tipo.id} className="bg-slate-900 text-white">
                {tipo.id} · {tipo.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Fecha</span>
          <Input type="date" name="fecha" defaultValue={fechaPorDefecto} required />
        </label>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pendiente}>
        {pendiente ? "Creando…" : "Crear evaluación"}
      </Button>
    </form>
  );
}
