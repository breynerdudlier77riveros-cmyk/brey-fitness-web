"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { accionRegistrarPrueba } from "../actions/evaluaciones";
import { PRUEBAS, pruebaRegistrable } from "../schemas/catalogo";
import type { ValorRegistro } from "@/lib/pas";

// ── Registro de una prueba (Sprint PAS-7.0) ────────────────────────────────
// Solo pruebas del catálogo del PAS: el desplegable se puebla de `PRUEBAS` y
// el servidor vuelve a comprobarlo. Aquí no se interpreta nada — se registra.
//
// La forma del valor la impone la naturaleza que declara la prueba, no el
// profesional: eso evita registrar un texto donde el catálogo espera un número.

const MENSAJE: Record<string, string> = {
  PRUEBA_NO_CATALOGADA: "Esa prueba no pertenece al catálogo.",
  VALOR_INCOMPATIBLE: "El valor no corresponde al tipo que declara la prueba.",
  VALOR_NO_FINITO: "El valor numérico no es válido.",
  VALOR_VACIO: "El valor no puede quedar vacío.",
  PATRON_REQUERIDO: "Esta prueba exige indicar el patrón evaluado.",
  FECHA_INVALIDA: "La fecha no es válida.",
  FECHA_FUTURA: "La fecha no puede ser posterior a hoy.",
  EVALUACION_CERRADA: "La evaluación ya no admite registros.",
};

interface Props {
  evaluacionId: string;
  fechaEvaluacion: string;
}

export default function RegistroPruebaForm({ evaluacionId, fechaEvaluacion }: Props) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pruebaId, setPruebaId] = useState(PRUEBAS[0].id);

  const prueba = pruebaRegistrable(pruebaId);

  function enviar(datos: FormData) {
    const bruto = String(datos.get("valor") ?? "");
    const naturaleza = prueba?.naturaleza ?? "continuo";

    let valor: ValorRegistro;
    if (naturaleza === "ordinal") {
      valor = { tipo: "ordinal", valor: Number(bruto), escala: Number(datos.get("escala") ?? 3) };
    } else if (naturaleza === "binario") {
      valor = { tipo: "binario", valor: bruto === "true" };
    } else if (naturaleza === "categorico") {
      valor = { tipo: "categorico", valor: bruto };
    } else {
      valor = { tipo: "continuo", valor: Number(bruto), unidad: prueba?.unidad ?? "" };
    }

    iniciar(async () => {
      const resultado = await accionRegistrarPrueba({
        evaluacionId,
        pruebaId,
        fecha: String(datos.get("fecha") ?? fechaEvaluacion),
        valor,
        patron: String(datos.get("patron") ?? "") || undefined,
      });

      if (!resultado.ok) {
        setError(MENSAJE[resultado.error] ?? "No se pudo registrar.");
        return;
      }

      setError(null);
      router.refresh();
    });
  }

  return (
    <form action={enviar} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold text-white/60">Prueba</span>
          {/* Fondo OPACO, no `bg-white/[0.03]`: el desplegable de un select
              nativo lo dibuja el navegador y no puede componer una capa
              translúcida, así que caía al blanco del sistema mientras el texto
              heredaba el blanco de la página. `color-scheme: dark` hace que el
              propio sistema operativo lo pinte en oscuro. */}
          <select
            name="pruebaId"
            value={pruebaId}
            onChange={(e) => setPruebaId(e.target.value)}
            className="h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500/40 [color-scheme:dark]"
          >
            {PRUEBAS.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {p.id} · {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">
            Valor {prueba?.unidad ? `(${prueba.unidad})` : ""}
          </span>
          <Input
            name="valor"
            type={prueba?.naturaleza === "categorico" ? "text" : "number"}
            step="any"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Fecha</span>
          <Input type="date" name="fecha" defaultValue={fechaEvaluacion} required />
        </label>

        {prueba?.requierePatron ? (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-white/60">
              Patrón evaluado
            </span>
            <Input name="patron" required maxLength={80} />
          </label>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pendiente}>
        {pendiente ? "Registrando…" : "Registrar prueba"}
      </Button>
    </form>
  );
}
