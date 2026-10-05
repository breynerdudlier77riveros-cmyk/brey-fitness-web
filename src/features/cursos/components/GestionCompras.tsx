"use client";

import { useState, useTransition } from "react";

import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import Badge from "@/components/brand/Badge";
import { toast } from "@/components/brand/Toast";
import { accionOtorgarAccesoManual, accionRevocarAcceso } from "@/lib/cursos/actions";
import type { Compra } from "@/lib/cursos/tipos";

// ── Accesos otorgados a un Sistema (Sprint CURSO-1) ────────────────────────
//
// Hotmart otorga solo. Aquí el admin ve la lista y puede otorgar A MANO
// —cortesías, soporte, alguien que pagó por fuera de Hotmart— o revocar. No
// hay edición de otros campos: una compra es un hecho (quién, cuándo, de
// dónde), no un formulario para reescribir la historia.

interface Props {
  sistemaSlug: string;
  comprasIniciales: readonly Compra[];
}

export default function GestionCompras({ sistemaSlug, comprasIniciales }: Props) {
  const [compras, setCompras] = useState(comprasIniciales);
  const [email, setEmail] = useState("");
  const [pendiente, startTransition] = useTransition();

  function otorgar() {
    const limpio = email.trim().toLowerCase();
    if (limpio === "") return;
    startTransition(async () => {
      const r = await accionOtorgarAccesoManual(sistemaSlug, limpio);
      if (!r.ok) {
        toast.error(`No se pudo otorgar acceso: ${r.error}`);
        return;
      }
      toast.success(`Acceso otorgado a ${limpio}.`);
      setEmail("");
      setCompras((c) => {
        const sinEse = c.filter((x) => x.email !== limpio);
        return [
          {
            id: `local-${limpio}`,
            sistemaSlug,
            usuarioId: null,
            email: limpio,
            origen: "manual",
            hotmartTransaccion: null,
            estado: "activa",
            createdAt: new Date().toISOString(),
            actualizadoEl: new Date().toISOString(),
          },
          ...sinEse,
        ];
      });
    });
  }

  function revocar(correo: string) {
    if (!confirm(`¿Quitar el acceso de ${correo}?`)) return;
    startTransition(async () => {
      const r = await accionRevocarAcceso(sistemaSlug, correo);
      if (!r.ok) {
        toast.error(`No se pudo revocar: ${r.error}`);
        return;
      }
      setCompras((c) => c.map((x) => (x.email === correo ? { ...x, estado: "reembolsada" } : x)));
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          className="max-w-xs"
        />
        <Button size="sm" onClick={otorgar} disabled={pendiente}>
          Otorgar acceso manual
        </Button>
      </div>

      {compras.length === 0 ? (
        <p className="text-sm text-white/40">Todavía nadie tiene acceso a este Sistema.</p>
      ) : (
        <div className="rounded-xl border border-white/[0.08] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] text-left text-[11px] uppercase tracking-wider text-white/35">
                <th className="px-3 py-2 font-normal">Correo</th>
                <th className="px-3 py-2 font-normal">Origen</th>
                <th className="px-3 py-2 font-normal">Estado</th>
                <th className="px-3 py-2 font-normal">Desde</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {compras.map((c) => (
                <tr key={c.id} className="border-b border-white/[0.05] last:border-0">
                  <td className="px-3 py-2 text-white/80">{c.email}</td>
                  <td className="px-3 py-2 text-white/50">
                    {c.origen === "hotmart" ? "Hotmart" : "Manual"}
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant={c.estado === "activa" ? "success" : "neutral"}>
                      {c.estado === "activa" ? "Activa" : "Reembolsada"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-white/40">
                    {new Date(c.createdAt).toLocaleDateString("es-CO")}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {c.estado === "activa" ? (
                      <button
                        type="button"
                        onClick={() => revocar(c.email)}
                        disabled={pendiente}
                        className="text-[11px] text-white/40 hover:text-red-400"
                      >
                        Quitar acceso
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
