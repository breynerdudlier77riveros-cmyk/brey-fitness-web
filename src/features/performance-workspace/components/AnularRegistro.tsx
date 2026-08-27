"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "@/components/brand/Toast";
import { Spinner, Trash } from "@/components/brand/icons";
import { accionAnularRegistro } from "../actions/evaluaciones";

// ── Anular un registro (Sprint PAS-14) ─────────────────────────────────────
//
// LA ACCIÓN EXISTÍA Y NO TENÍA BOTÓN.
//
//   `accionAnularRegistro` lleva escrita desde PAS-7 y ningún componente la
//   llamaba. El resultado, visto en datos reales: cuatro valores de 1RM del
//   mismo día —100, 120, 150 y 50 kg— y ninguna forma de retirar los que
//   sobraban desde la pantalla. El sistema detectaba el conflicto, lo avisaba,
//   y dejaba al profesional sin salida.
//
// ── ANULAR NO ES BORRAR, Y ESO CAMBIA EL TEXTO ────────────────────────────
//
//   El registro se queda: deja de participar en el análisis, no deja de
//   existir (PAS I-02). Ocultarlo haría indistinguible «nunca se midió» de «se
//   midió y se retiró», que son dos cosas muy distintas en un expediente.
//
//   Por eso la confirmación dice «dejará de contar» y no «se borrará»: es lo
//   que de verdad ocurre, y quien lo lee tiene que poder confiar en la frase.
//
// ── ES TERMINAL ───────────────────────────────────────────────────────────
//
//   La máquina de estados no admite volver de `anulado` a `vigente`. Se avisa
//   antes, porque una acción sin vuelta atrás que no se anuncia es una trampa.
//   Corregir un valor es registrar uno nuevo, no revivir el viejo.

interface Props {
  registroId: string;
  evaluacionId: string;
  /** Para nombrarlo en la confirmación: «1RM · 50 kg» dice más que un id. */
  descripcion: string;
}

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  NO_ENCONTRADA: "Esta evaluación ya no existe.",
  EVALUACION_CERRADA:
    "La evaluación ya no admite cambios. Solo un borrador puede anular registros.",
  NO_ANULADO: "No se pudo anular el registro.",
};

export default function AnularRegistro({ registroId, evaluacionId, descripcion }: Props) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState(false);

  async function anular() {
    if (ocupado) return;
    if (
      !window.confirm(
        `${descripcion}\n\nDejará de contar en el análisis. El registro se conserva marcado ` +
          `como anulado y NO se puede reactivar: para corregir el valor, registra uno nuevo.\n\n` +
          `¿Anularlo?`,
      )
    ) {
      return;
    }

    setOcupado(true);
    const resultado = await accionAnularRegistro(registroId, evaluacionId);
    setOcupado(false);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    toast.success("Registro anulado.");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={anular}
      disabled={ocupado}
      aria-label={`Anular ${descripcion}`}
      title="Anular este registro"
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] text-white/30 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-40"
    >
      {ocupado ? (
        <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
      ) : (
        <Trash className="h-3.5 w-3.5" strokeWidth={2} />
      )}
    </button>
  );
}
