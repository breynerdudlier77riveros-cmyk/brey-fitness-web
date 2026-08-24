"use client";

import Button from "@/components/brand/Button";
import { toast } from "@/components/brand/Toast";
import { Copy, Download } from "@/components/brand/icons";

// ── Acciones de la vista pública ───────────────────────────────────────────
//
// Las mismas dos que la vista pública del reporte, y por las mismas razones:
// copiar el enlace sirve para reenviárselo uno mismo entre el móvil y el
// portátil, e imprimir es cómo esta página llega al gimnasio, donde la
// cobertura falla y el móvil se queda sin batería.
//
// `print:hidden`: los botones no salen en el papel.
//
// La impresión reutiliza la maquetación de pantalla —`@page` en globals.css
// más los `print:break-inside-avoid` de SessionView— sin ninguna librería.

export default function AccionesSesion() {
  async function copiar() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Enlace copiado.");
    } catch {
      // Sin permiso de portapapeles o sin HTTPS. No se finge que funcionó:
      // el usuario se iría creyendo que lo tiene.
      toast.error("No se pudo copiar. Copia la dirección de la barra del navegador.");
    }
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2 print:hidden">
      <Button size="sm" variant="outline" onClick={copiar}>
        <Copy className="h-3.5 w-3.5" strokeWidth={2} />
        Copiar enlace
      </Button>
      <Button size="sm" onClick={() => window.print()}>
        <Download className="h-3.5 w-3.5" strokeWidth={2} />
        Descargar / Imprimir
      </Button>
    </div>
  );
}
