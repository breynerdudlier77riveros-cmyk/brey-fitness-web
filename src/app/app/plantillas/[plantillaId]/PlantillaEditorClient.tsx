"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/brand/Button";
import { toast } from "@/components/brand/Toast";
import { ArrowLeft, Spinner, Trash } from "@/components/brand/icons";

import PlantillaEditor from "@/features/plantillas/components/PlantillaEditor";
import { cambiarEstadoPlantilla, eliminarPlantilla } from "@/lib/plantillas/actions";
import type { EnlacePlantilla, EstadoPlantilla, Plantilla } from "@/lib/plantillas/tipos";

// ── La barra de estado del editor ──────────────────────────────────────────
//
// Separada del editor a propósito: publicar, archivar y borrar operan sobre
// la plantilla COMO OBJETO, no sobre su contenido. Meterlas dentro del editor
// las mezclaría con el botón de guardar, y «publicar» y «guardar» son cosas
// distintas que en una misma fila de botones se confunden.
//
// PUBLICAR ES LO QUE HABILITA COMPARTIR, y por eso el aviso está aquí y no en
// una ayuda escondida: es la pregunta que se hace cualquiera que busque el
// botón de generar el enlace y no lo encuentre.

interface Props {
  plantilla: Plantilla;
  enlaces: EnlacePlantilla[];
  clientes: readonly { id: string; nombre: string }[];
  catalogo: readonly { nombre: string; slug: string }[];
  baseUrl: string;
}

export default function PlantillaEditorClient({
  plantilla,
  enlaces,
  clientes,
  catalogo,
  baseUrl,
}: Props) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState(false);

  async function cambiarEstado(estado: EstadoPlantilla) {
    if (ocupado) return;
    setOcupado(true);
    const resultado = await cambiarEstadoPlantilla(plantilla.id, estado);
    setOcupado(false);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    toast.success(ANUNCIO[estado]);
    router.refresh();
  }

  async function borrar() {
    if (ocupado) return;
    if (!window.confirm(`«${plantilla.nombre}» se borrará para siempre.\n\n¿Seguro?`)) return;

    setOcupado(true);
    const resultado = await eliminarPlantilla(plantilla.id);
    setOcupado(false);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    router.push("/app/plantillas");
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden flex flex-wrap items-center gap-3">
        <Link
          href="/app/plantillas"
          className="flex items-center gap-1.5 text-xs font-semibold text-white/45 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Plantillas
        </Link>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {ocupado && <Spinner className="h-4 w-4 animate-spin text-white/40" strokeWidth={2.5} />}

          {plantilla.estado === "borrador" && (
            <>
              <Button size="sm" variant="outline" onClick={() => cambiarEstado("publicada")} disabled={ocupado}>
                Publicar
              </Button>
              <button
                type="button"
                onClick={borrar}
                disabled={ocupado}
                aria-label="Borrar la plantilla"
                title="Borrar"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/30 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-40"
              >
                <Trash className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </>
          )}

          {plantilla.estado === "publicada" && (
            <Button size="sm" variant="outline" onClick={() => cambiarEstado("archivada")} disabled={ocupado}>
              Archivar
            </Button>
          )}

          {plantilla.estado === "archivada" && (
            <Button size="sm" variant="outline" onClick={() => cambiarEstado("publicada")} disabled={ocupado}>
              Desarchivar
            </Button>
          )}
        </div>
      </div>

      {plantilla.estado === "borrador" && (
        <p className="print:hidden rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-[12px] leading-relaxed text-white/45">
          En borrador. Publícala cuando esté lista y podrás generar el enlace para compartirla.
        </p>
      )}

      {plantilla.estado === "archivada" && (
        <p className="print:hidden rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04] px-4 py-2.5 text-[12px] leading-relaxed text-yellow-200/70">
          Archivada. Sus enlaces no resuelven mientras lo esté — no se han revocado, así que
          desarchivarla los devuelve a la vida.
        </p>
      )}

      <PlantillaEditor
        plantilla={plantilla}
        enlaces={enlaces}
        clientes={clientes}
        catalogo={catalogo}
        baseUrl={baseUrl}
      />
    </div>
  );
}

const ANUNCIO: Record<EstadoPlantilla, string> = {
  borrador: "Vuelta a borrador.",
  publicada: "Plantilla publicada. Ya puedes compartirla.",
  archivada: "Plantilla archivada.",
};

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  PLANTILLA_NO_ENCONTRADA: "Esta plantilla ya no existe.",
  PLANTILLA_NO_ACTUALIZADA: "No se pudo actualizar.",
  SOLO_SE_BORRA_EN_BORRADOR: "Solo se borra una plantilla en borrador. Archívala primero.",
  PLANTILLA_NO_BORRADA: "No se pudo borrar.",
};
