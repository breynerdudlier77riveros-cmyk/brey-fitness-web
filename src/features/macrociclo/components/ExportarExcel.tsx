"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

import Button from "@/components/brand/Button";
import { toast } from "@/components/brand/Toast";
import { Spinner } from "@/components/brand/icons";
import { libroDeMacrociclo, nombreDeArchivo } from "@/lib/macrociclo/exportar";
import type { PlantillaExportable } from "@/lib/macrociclo/exportar";
import type { Macrociclo } from "@/lib/macrociclo/tipos";

// ── Descargar el macrociclo en Excel (Sprint MAC-1) ────────────────────────
//
// El libro lo construye `libroDeMacrociclo`, que es puro y está probado
// escribiendo bytes y volviéndolos a leer. Aquí solo se dispara la descarga.
//
// ── POR QUÉ EN EL NAVEGADOR Y NO EN EL SERVIDOR ───────────────────────────
//
//   Porque no hace falta: los datos ya están en la página. Generarlo en el
//   servidor obligaría a volver a leer el macrociclo y todas sus plantillas
//   para producir exactamente lo mismo, y añadiría una ruta más que proteger.
//
//   El coste es que SheetJS viaja al cliente. Por eso este componente se
//   importa de forma diferida desde la página: quien no exporta no lo descarga.
//
// `XLSX.writeFile` monta el enlace y lo pulsa por su cuenta. Se usa en vez de
// fabricar el Blob a mano porque esa parte —nombre, tipo MIME, revocar la
// URL— es justo donde fallan los exportadores caseros en Safari.

interface Props {
  macrociclo: Macrociclo;
  plantillas: readonly PlantillaExportable[];
}

export default function ExportarExcel({ macrociclo, plantillas }: Props) {
  const [generando, setGenerando] = useState(false);

  async function exportar() {
    if (generando) return;
    setGenerando(true);
    try {
      // Un macrociclo de 104 semanas con veinte sesiones tarda un momento en
      // serializarse. Ceder el hilo deja que el botón se pinte en su estado de
      // espera antes de bloquearlo todo.
      await new Promise((r) => setTimeout(r, 0));
      const libro = libroDeMacrociclo(macrociclo, plantillas);
      XLSX.writeFile(libro, nombreDeArchivo(macrociclo), { compression: true });
      toast.success("Excel generado.");
    } catch (e) {
      // Un fallo aquí deja al usuario sin archivo y sin explicación si no se
      // dice: el navegador no muestra nada cuando una descarga no llega a
      // empezar.
      console.error("[macrociclo/exportar]", e);
      toast.error("No se pudo generar el Excel.");
    } finally {
      setGenerando(false);
    }
  }

  return (
    <Button size="sm" variant="outline" onClick={exportar} disabled={generando}>
      {generando ? (
        <>
          <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
          Generando…
        </>
      ) : (
        "Exportar a Excel"
      )}
    </Button>
  );
}
