"use client";

import Button from "@/components/brand/Button";
import { toast } from "@/components/brand/Toast";
import { Copy, Download } from "@/components/brand/icons";

// ── Vista pública (BCS Design Handbook 08) ─────────────────────────────────
// "El cliente NO comparte desde esta vista — solo el entrenador comparte la
// URL. La vista pública SÍ incluye 'Copiar enlace' (para reenviarse a sí
// mismo entre dispositivos)." + "Descargar/Imprimir": visible y prominente,
// dispara el flujo de exportación (14) reutilizando el mismo layout en
// pantalla — window.print() + @page (globals.css) + print:grid-cols-2 en
// ReportView, sin librería nueva (ninguna especificada por el handbook).
// print:hidden — nunca aparece en el PDF/impresión resultante.

export default function AccionesReporte() {
  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Enlace copiado.");
        }}
      >
        <Copy className="w-3.5 h-3.5" strokeWidth={2} />
        Copiar enlace
      </Button>
      <Button size="sm" onClick={() => window.print()}>
        <Download className="w-3.5 h-3.5" strokeWidth={2} />
        Descargar / Imprimir
      </Button>
    </div>
  );
}
