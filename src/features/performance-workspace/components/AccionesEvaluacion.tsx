"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/brand/Button";
import {
  accionCompartirEvaluacion,
  accionCompletarEvaluacion,
} from "../actions/evaluaciones";
import { transicionesEvaluacion } from "../schemas/estados";
import type { Evaluacion } from "../schemas/tipos";

// ── Acciones de una evaluación (Sprint PAS-7.0) ────────────────────────────
// Los botones disponibles salen de la máquina de estados, no de condiciones
// escritas aquí: si una transición deja de existir, el botón desaparece solo.
//
// Imprimir usa `window.print()` y la hoja del PRS. NO se crea otro sistema de
// impresión: el del Report System es el único.

const MENSAJE: Record<string, string> = {
  SIN_REGISTROS: "No hay pruebas vigentes que cerrar.",
  TRANSICION_NO_PERMITIDA: "Esa transición no está permitida.",
  EVALUACION_EN_BORRADOR: "Un borrador no se comparte: su contenido aún puede cambiar.",
  EVALUACION_ANULADA: "Una evaluación anulada no se comparte.",
};

interface Props {
  evaluacion: Evaluacion;
}

export default function AccionesEvaluacion({ evaluacion }: Props) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [aviso, setAviso] = useState<string | null>(null);

  const posibles = transicionesEvaluacion(evaluacion.estado);

  function ejecutar(accion: () => Promise<{ ok: boolean; error?: string }>) {
    iniciar(async () => {
      const resultado = await accion();
      if (!resultado.ok) {
        setAviso(MENSAJE[resultado.error ?? ""] ?? "No se pudo completar la acción.");
        return;
      }
      setAviso(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {posibles.includes("completada") && evaluacion.estado === "borrador" ? (
        <Button
          type="button"
          disabled={pendiente}
          onClick={() => ejecutar(() => accionCompletarEvaluacion(evaluacion.id))}
        >
          Cerrar evaluación
        </Button>
      ) : null}

      {posibles.includes("compartida") ? (
        <Button
          type="button"
          variant="outline"
          disabled={pendiente}
          onClick={() => ejecutar(() => accionCompartirEvaluacion(evaluacion.id))}
        >
          Generar enlace
        </Button>
      ) : null}

      <Button type="button" variant="outline" onClick={() => window.print()}>
        Imprimir
      </Button>

      {aviso ? (
        <p role="status" className="w-full text-xs text-amber-400">
          {aviso}
        </p>
      ) : null}
    </div>
  );
}
