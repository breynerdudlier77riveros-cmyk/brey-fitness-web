"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { toast } from "@/components/brand/Toast";
import { Spinner } from "@/components/brand/icons";
import { accionActualizarPeso } from "../actions/evaluaciones";

// ── La masa corporal de la evaluación (Sprint PAS-14) ──────────────────────
//
// EL AGUJERO QUE TAPA.
//
//   El peso solo se podía escribir al CREAR la evaluación. Quien lo olvidaba
//   registraba sus dieciocho pruebas y se quedaba sin forma de añadirlo: las
//   normas que la literatura publica en relación con el peso —el 1RM, entre
//   ellas— quedaban descartadas para siempre en ese expediente, y el informe
//   solo decía «esta evaluación no registra la masa corporal» sin ofrecer
//   dónde arreglarlo.
//
//   Un sistema que diagnostica y no deja actuar es peor que uno que calla.
//
// ── POR QUÉ IMPORTA TANTO ESTE CAMPO ──────────────────────────────────────
//
//   No es un dato administrativo. Con él, `relativa.ts` calcula la razón peso
//   levantado ÷ masa corporal; sin él devuelve `SIN_MASA_CORPORAL` y no hay
//   nada que leer — no porque el sistema se niegue, sino porque falta el
//   divisor.
//
//   CUIDADO CON LO QUE SE PROMETE. Comprobado contra el motor: con 120 kg y
//   66 kg de masa sale `ratio 1,82 × peso corporal` y `clasificacion: null`.
//   La razón se calcula; la POSICIÓN respecto de una población es otra cosa y
//   depende de que exista una referencia compatible, que para el 1RM hoy no la
//   hay. Por eso el aviso dice que se calcula la razón y que la posición se
//   dará «si además existe una referencia publicada compatible» — prometer la
//   norma sería vender lo que el sistema declara no tener.
//
// ── EL PESO ES DEL DÍA, NO DEL ATLETA ─────────────────────────────────────
//
//   Se guarda en la evaluación y nunca en la ficha (G-01). Aplicar el peso de
//   hoy a una medición de hace meses daría una relación falsa con aspecto de
//   correcta, que es exactamente el error que el PAS ya cerró con la edad.
//
// Solo en borrador: cambiar el peso cambia toda lectura relativa a él, y
// hacerlo sobre una evaluación compartida reescribiría en silencio un informe
// que alguien ya recibió.

interface Props {
  evaluacionId: string;
  pesoKg: number | null;
}

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  NO_ENCONTRADA: "Esta evaluación ya no existe.",
  EVALUACION_CERRADA: "La evaluación ya no admite cambios.",
  PESO_FUERA_DE_RANGO: "La masa corporal tiene que estar entre 20 y 350 kg.",
  NO_ACTUALIZADA: "No se pudo guardar.",
};

export default function MasaCorporal({ evaluacionId, pesoKg }: Props) {
  const router = useRouter();
  const [valor, setValor] = useState(pesoKg === null ? "" : String(pesoKg));
  const [guardando, setGuardando] = useState(false);

  const falta = pesoKg === null;

  async function guardar() {
    if (guardando) return;

    const limpio = valor.trim().replace(",", ".");
    const numero = limpio === "" ? null : Number(limpio);
    if (numero !== null && !Number.isFinite(numero)) {
      toast.error("La masa corporal tiene que ser un número.");
      return;
    }

    setGuardando(true);
    const resultado = await accionActualizarPeso(evaluacionId, numero);
    setGuardando(false);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    toast.success(numero === null ? "Masa corporal retirada." : "Masa corporal registrada.");
    router.refresh();
  }

  return (
    <div
      className={`rounded-xl border p-4 ${
        falta ? "border-yellow-500/25 bg-yellow-500/[0.04]" : "border-white/[0.08] bg-white/[0.02]"
      }`}
    >
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">
            Masa corporal
            <span className="ml-2 font-normal text-white/35">kg, en esta fecha</span>
          </span>
          <Input
            value={valor}
            inputMode="decimal"
            placeholder="—"
            aria-label="Masa corporal en kilos"
            onChange={(e) => setValor(e.target.value)}
            disabled={guardando}
            className="w-28 text-center tabular-nums"
          />
        </label>

        <Button size="sm" onClick={guardar} disabled={guardando}>
          {guardando ? (
            <>
              <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
              Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>

      {falta ? (
        <p className="mt-3 text-[12px] leading-relaxed text-yellow-200/80">
          Sin ella no puede calcularse la fuerza relativa de ninguna prueba —el 1RM, entre ellas—
          porque falta el divisor. Con ella el informe muestra la razón{" "}
          <span className="whitespace-nowrap">peso levantado ÷ masa corporal</span>; si además
          existe una referencia publicada compatible, la sitúa, y si no, lo dice.
        </p>
      ) : null}

      <p className="mt-2 text-[11px] leading-relaxed text-white/35">
        Se guarda con esta evaluación y nunca en la ficha del atleta: el peso cambia entre fechas, y
        aplicar el de hoy a una medición de hace meses daría una relación falsa con aspecto de
        correcta.
      </p>
    </div>
  );
}
