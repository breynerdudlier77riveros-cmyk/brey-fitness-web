"use client";

import { useState } from "react";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import Textarea from "@/components/brand/Textarea";
import { toast } from "@/components/brand/Toast";
import { Spinner } from "@/components/brand/icons";
import { registrarMedicion, corregirMedicion } from "@/lib/bcs/actions";
import { CATALOGO, CATEGORIAS, type VariableId } from "@/lib/bcs/reporte";
import { fechaISOLocal } from "@/lib/utils";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Formulario de Nueva Medición / Corrección — UC-05/UC-06 ────────────────
// Los 22 campos numéricos se generan desde el mismo CATALOGO que ya usa
// ReportView — una sola fuente de verdad para etiqueta/unidad/categoría,
// nunca una segunda lista de 22 <Field> escritos a mano que podría
// desincronizarse. Todos opcionales salvo `fecha` (BCS Handbook 03: única
// obligatoria y bloqueante si falta).
//
// UC-06 (corregir) nunca edita en sitio: envía un registro nuevo completo
// y el Server Action ya se encarga de anular el original (BCS-ADR-03) —
// este formulario solo decide qué Server Action llamar.

type ValoresNumericos = Record<VariableId, string>;

function valoresIniciales(medicion?: Medicion): ValoresNumericos {
  const ids = Object.keys(CATALOGO) as VariableId[];
  return ids.reduce((acc, id) => {
    const valor = medicion?.[id];
    acc[id] = valor !== null && valor !== undefined ? String(valor) : "";
    return acc;
  }, {} as ValoresNumericos);
}

// fechaISOLocal (no toISOString(), que es UTC): en Colombia —UTC-5— toda
// medición registrada entre las 19:00 y medianoche caía en el día siguiente,
// así que el formulario se abría fechado MAÑANA y el `max` del input dejaba
// elegirlo. utils.ts ya documenta este mismo problema para las columnas
// `date` de Postgres.
function hoyISO() {
  return fechaISOLocal();
}

interface Props {
  clienteId: string;
  medicionOriginal?: Medicion; // presente = UC-06 corregir; ausente = UC-05 registrar
  onCancel: () => void;
  onSaved: (medicion: Medicion) => void;
}

type Estado = "idle" | "guardando" | "error";

export default function MedicionForm({ clienteId, medicionOriginal, onCancel, onSaved }: Props) {
  const [valores, setValores] = useState<ValoresNumericos>(() => valoresIniciales(medicionOriginal));
  const [fecha, setFecha] = useState(medicionOriginal?.fecha ?? hoyISO());
  const [observaciones, setObservaciones] = useState(medicionOriginal?.observaciones ?? "");
  const [fotoUrl, setFotoUrl] = useState(medicionOriginal?.foto_url ?? "");
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState<string | null>(null);

  function set(id: VariableId, valor: string) {
    setValores((prev) => ({ ...prev, [id]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "guardando") return;

    if (fecha > hoyISO()) {
      setError("La fecha no puede ser futura.");
      return;
    }

    setEstado("guardando");
    setError(null);

    const ids = Object.keys(CATALOGO) as VariableId[];
    const numeros = ids.reduce((acc, id) => {
      acc[id] = valores[id].trim() ? Number(valores[id]) : null;
      return acc;
    }, {} as Record<VariableId, number | null>);

    const payload = {
      cliente_id: clienteId,
      fecha,
      observaciones: observaciones.trim() || null,
      foto_url: fotoUrl.trim() || null,
      ...numeros,
    } as Omit<Medicion, "id" | "estado">;

    const resultado = medicionOriginal
      ? await corregirMedicion(medicionOriginal.id, payload)
      : await registrarMedicion(payload);

    if (!resultado.ok) {
      setEstado("error");
      const mensaje =
        resultado.error === "VALOR_FUERA_DE_RANGO_FISICO"
          ? "Alguno de los valores no es físicamente posible (por ejemplo, una masa mayor que el peso total). Revisa los datos."
          : resultado.error === "FECHA_FUTURA"
            ? "La fecha no puede ser futura."
            : resultado.error === "MEDICION_NO_ANULADA"
              ? "Se guardó la corrección, pero no se pudo anular la medición original: ahora aparecen las dos en el historial. Vuelve a intentarlo o revisa el historial."
              : "No se pudo guardar la medición. Inténtalo de nuevo.";
      setError(mensaje);
      toast.error(mensaje);
      return;
    }

    setEstado("idle");
    toast.success(medicionOriginal ? "Medición corregida." : "Medición registrada.");
    onSaved(resultado.data);
  }

  const guardando = estado === "guardando";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fecha-medicion" className="block text-xs font-semibold text-white/60 mb-1.5">
            Fecha <span className="text-orange-400">*</span>
          </label>
          <Input
            id="fecha-medicion"
            type="date"
            required
            max={hoyISO()}
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            disabled={guardando}
          />
        </div>
        <div>
          <label htmlFor="foto-url" className="block text-xs font-semibold text-white/60 mb-1.5">
            Fotografía (URL)
          </label>
          <Input
            id="foto-url"
            type="url"
            placeholder="https://…"
            value={fotoUrl}
            onChange={(e) => setFotoUrl(e.target.value)}
            disabled={guardando}
          />
        </div>
      </div>

      {CATEGORIAS.map(({ id: categoria, etiqueta }) => {
        const variables = (Object.keys(CATALOGO) as VariableId[]).filter((v) => CATALOGO[v].categoria === categoria);
        return (
          <div key={categoria}>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">{etiqueta}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {variables.map((id) => {
                const def = CATALOGO[id];
                return (
                  <div key={id}>
                    <label htmlFor={`campo-${id}`} className="block text-xs font-semibold text-white/60 mb-1.5">
                      {def.etiqueta} {def.unidad && <span className="text-white/35">({def.unidad})</span>}
                    </label>
                    <Input
                      id={`campo-${id}`}
                      type="number"
                      step="0.01"
                      value={valores[id]}
                      onChange={(e) => set(id, e.target.value)}
                      disabled={guardando}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div>
        <label htmlFor="observaciones-medicion" className="block text-xs font-semibold text-white/60 mb-1.5">
          Observaciones
        </label>
        <Textarea
          id="observaciones-medicion"
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          disabled={guardando}
        />
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <div className="flex items-center gap-3 sticky bottom-0 bg-slate-950/90 backdrop-blur-sm py-3 -mx-1 px-1">
        <Button type="submit" size="md" disabled={guardando}>
          {guardando ? (
            <>
              <Spinner className="w-4 h-4 animate-spin" strokeWidth={2.5} />
              Guardando…
            </>
          ) : medicionOriginal ? (
            "Guardar corrección"
          ) : (
            "Registrar medición"
          )}
        </Button>
        <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={guardando}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
