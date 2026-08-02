"use client";

import Button from "@/components/brand/Button";
import { Download } from "@/components/brand/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/brand/Tooltip";

// ── Exportación (arquitectura preparada, sin implementar) ──────────────────
// El sprint pide dejar el panel listo, NO implementar la exportación. Los tres
// formatos se declaran deshabilitados con `aria-disabled` —nunca `disabled`—
// para que un usuario de teclado pueda alcanzarlos y descubrir que existen,
// mismo criterio que el Header del Core Product.
//
// Imprimir SÍ funciona: usa la impresión nativa del navegador, ya soportada
// por el CSS de impresión del dashboard.

const FORMATOS = [
  { id: "csv", etiqueta: "CSV" },
  { id: "json", etiqueta: "JSON" },
  { id: "pdf", etiqueta: "PDF" },
] as const;

export default function DashboardExportPanel() {
  return (
    <div className="flex items-center gap-2 flex-wrap print:hidden">
      {FORMATOS.map((f) => (
        <Tooltip key={f.id}>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-disabled="true"
              aria-label={`Exportar a ${f.etiqueta} (próximamente)`}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.10] px-3 py-1.5 text-xs font-bold text-white/35 cursor-not-allowed"
            >
              {f.etiqueta}
            </button>
          </TooltipTrigger>
          <TooltipContent>Próximamente</TooltipContent>
        </Tooltip>
      ))}

      <Button size="sm" variant="outline" onClick={() => window.print()}>
        <Download className="w-3.5 h-3.5" strokeWidth={2} />
        Imprimir
      </Button>
    </div>
  );
}
