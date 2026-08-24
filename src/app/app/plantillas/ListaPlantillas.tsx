"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/brand/Dialog";
import { toast } from "@/components/brand/Toast";
import { Cycle, LinkIcon, Plus, Spinner } from "@/components/brand/icons";

import { crearPlantilla } from "@/lib/plantillas/actions";
import type { Plantilla } from "@/lib/plantillas/tipos";

// ── Lista de plantillas ────────────────────────────────────────────────────
//
// Lo que cada fila tiene que responder de un vistazo: si está publicada, de
// cuántas semanas es, y si hay alguien con un enlace vivo. Ese último dato es
// el que decide si editarla es inocuo o no — cambiar una plantilla que tres
// clientes tienen abierta no es lo mismo que cambiar un borrador.

interface Fila {
  plantilla: Plantilla;
  enlacesActivos: number;
}

const ETIQUETA_ESTADO: Record<Plantilla["estado"], string> = {
  borrador: "Borrador",
  publicada: "Publicada",
  archivada: "Archivada",
};

const COLOR_ESTADO: Record<Plantilla["estado"], string> = {
  borrador: "border-white/[0.12] text-white/45",
  publicada: "border-emerald-500/30 text-emerald-300/80",
  archivada: "border-white/[0.08] text-white/25",
};

export default function ListaPlantillas({ filas }: { filas: Fila[] }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [semanas, setSemanas] = useState("4");
  const [creando, setCreando] = useState(false);

  async function crear() {
    if (creando) return;
    const limpio = nombre.trim();
    if (limpio === "") {
      toast.error("La plantilla necesita un nombre.");
      return;
    }

    setCreando(true);
    const resultado = await crearPlantilla(limpio, Number(semanas) || 4);
    setCreando(false);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }

    setAbierto(false);
    setNombre("");
    // Directo al editor: crear una plantilla y quedarse en la lista obliga a
    // un clic más para hacer lo único que se puede hacer con ella.
    router.push(`/app/plantillas/${resultado.data.id}`);
  }

  return (
    <>
      <PageHeader
        title="Plantillas de sesión"
        description="Programas de entrenamiento que escribes tú y compartes por enlace. Solo tú puedes editarlos."
        actions={
          <Button size="md" onClick={() => setAbierto(true)}>
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Nueva plantilla
          </Button>
        }
      />

      {filas.length === 0 ? (
        <EmptyState
          icon={Cycle}
          title="Todavía no tienes plantillas"
          description="Una plantilla es un bloque de entrenamiento: sus días, sus ejercicios y cómo progresan semana a semana. Se comparte por enlace y quien lo abre solo puede leerla."
        />
      ) : (
        <ul className="space-y-2">
          {filas.map(({ plantilla, enlacesActivos }) => (
            <li key={plantilla.id}>
              <Link
                href={`/app/plantillas/${plantilla.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 transition-colors hover:border-white/20"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">{plantilla.nombre}</p>
                  {plantilla.descripcion && (
                    <p className="mt-0.5 truncate text-[12px] text-white/40">
                      {plantilla.descripcion}
                    </p>
                  )}
                </div>

                <span className="text-[11px] tabular-nums text-white/40">
                  {plantilla.semanas} {plantilla.semanas === 1 ? "semana" : "semanas"}
                </span>

                <span className="text-[11px] tabular-nums text-white/40">
                  {plantilla.contenido.dias.length}{" "}
                  {plantilla.contenido.dias.length === 1 ? "día" : "días"}
                </span>

                {enlacesActivos > 0 && (
                  <span className="flex items-center gap-1 text-[11px] text-white/40">
                    <LinkIcon className="h-3 w-3" strokeWidth={2} />
                    {enlacesActivos}
                  </span>
                )}

                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${COLOR_ESTADO[plantilla.estado]}`}
                >
                  {ETIQUETA_ESTADO[plantilla.estado]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva plantilla</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
          <div>
            <label
              htmlFor="nombre-plantilla"
              className="mb-1.5 block text-xs font-semibold text-white/60"
            >
              Nombre
            </label>
            <Input
              id="nombre-plantilla"
              autoFocus
              value={nombre}
              placeholder="Hipertrofia intermedio · Bloque 1"
              onChange={(e) => setNombre(e.target.value)}
              disabled={creando}
            />
          </div>

          <div>
            <label
              htmlFor="semanas-plantilla"
              className="mb-1.5 block text-xs font-semibold text-white/60"
            >
              Semanas del bloque
            </label>
            <Input
              id="semanas-plantilla"
              value={semanas}
              inputMode="numeric"
              onChange={(e) => setSemanas(e.target.value)}
              disabled={creando}
              className="w-24 text-center tabular-nums"
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-white/35">
              Se puede cambiar después. Ampliar copia la última semana; recortar avisa antes de
              perder lo escrito.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button size="md" onClick={crear} disabled={creando}>
              {creando ? (
                <>
                  <Spinner className="h-4 w-4 animate-spin" strokeWidth={2.5} />
                  Creando…
                </>
              ) : (
                "Crear"
              )}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => setAbierto(false)}
              disabled={creando}
            >
              Cancelar
            </Button>
          </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  NOMBRE_VACIO: "La plantilla necesita un nombre.",
  NOMBRE_LARGO: "El nombre es demasiado largo.",
  SEMANAS_FUERA_DE_RANGO: "Las semanas tienen que estar entre 1 y 24.",
  PLANTILLA_NO_CREADA: "No se pudo crear la plantilla.",
};
