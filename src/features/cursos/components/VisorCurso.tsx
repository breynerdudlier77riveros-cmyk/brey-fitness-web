"use client";

import { useMemo, useState, useTransition } from "react";

import Button from "@/components/brand/Button";
import { toast } from "@/components/brand/Toast";
import { Check, Download, Play } from "@/components/brand/icons";
import { urlEmbeble } from "@/lib/cursos/embed";
import { leccionesEnOrden } from "@/lib/cursos/contenido";
import { accionMarcarLeccionVista, accionUrlMaterial } from "@/lib/cursos/actions";
import type { ContenidoSistema } from "@/lib/cursos/tipos";

// ── El curso, lección por lección (Sprint CURSO-1) ──────────────────────────
//
// Una sola lección montada a la vez —la seleccionada—, no un reproductor por
// cada una: con un curso de treinta lecciones eso sería treinta iframes de
// YouTube cargados a la vez. El resto de la lista es solo texto hasta que se
// hace clic, igual de deliberado que «un solo input a la vez» en la rejilla
// del macrociclo.

interface Props {
  sistemaSlug: string;
  contenido: ContenidoSistema;
  leccionesVistasIds: readonly string[];
}

export default function VisorCurso({ sistemaSlug, contenido, leccionesVistasIds }: Props) {
  const todas = useMemo(() => leccionesEnOrden(contenido), [contenido]);
  const primeraConVideo = todas.find((x) => x.leccion.videoUrl !== null) ?? todas[0];

  const [seleccionId, setSeleccionId] = useState(primeraConVideo?.leccion.id ?? null);
  const [vistas, setVistas] = useState(new Set(leccionesVistasIds));
  const [pendiente, startTransition] = useTransition();

  const actual = todas.find((x) => x.leccion.id === seleccionId) ?? null;
  const embed = actual ? urlEmbeble(actual.leccion.videoUrl, actual.leccion.origenVideo) : null;

  function marcarVista(leccionId: string) {
    if (vistas.has(leccionId)) return;
    setVistas((v) => new Set(v).add(leccionId));
    startTransition(() => {
      accionMarcarLeccionVista(sistemaSlug, leccionId);
    });
  }

  async function descargar(archivoPath: string, nombre: string) {
    const r = await accionUrlMaterial(sistemaSlug, archivoPath);
    if (!r.ok) {
      toast.error("No se pudo generar el enlace de descarga.");
      return;
    }
    const a = document.createElement("a");
    a.href = r.data;
    a.download = nombre;
    a.rel = "noopener";
    a.target = "_blank";
    a.click();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
      {/* ── El video y su material ──────────────────────────────────────── */}
      <div className="space-y-4">
        {actual ? (
          <>
            <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-black aspect-video">
              {embed ? (
                <iframe
                  key={embed}
                  src={embed}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={actual.leccion.titulo}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {actual.leccion.videoUrl ? (
                    <a
                      href={actual.leccion.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-300 text-sm underline"
                    >
                      Ver el video en su sitio original
                    </a>
                  ) : (
                    <p className="text-white/30 text-sm">Todavía sin video</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-black text-white text-lg">{actual.leccion.titulo}</h2>
              {actual.leccion.descripcion ? (
                <p className="text-white/60 text-sm mt-1.5 whitespace-pre-wrap">
                  {actual.leccion.descripcion}
                </p>
              ) : null}
            </div>

            {actual.leccion.materiales.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50">
                  Materiales
                </p>
                {actual.leccion.materiales.map((mat) => (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => descargar(mat.archivoPath, mat.nombre)}
                    className="flex items-center gap-2 w-full text-left rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-sm text-white/75 hover:bg-white/[0.05] transition-colors"
                  >
                    <Download className="w-4 h-4 shrink-0 text-white/40" />
                    {mat.nombre}
                  </button>
                ))}
              </div>
            ) : null}

            <Button
              size="sm"
              variant={vistas.has(actual.leccion.id) ? "outline" : "primary"}
              disabled={pendiente || vistas.has(actual.leccion.id)}
              onClick={() => marcarVista(actual.leccion.id)}
            >
              <Check className="w-3.5 h-3.5" />
              {vistas.has(actual.leccion.id) ? "Lección completada" : "Marcar como vista"}
            </Button>
          </>
        ) : (
          <p className="text-white/40 text-sm">Este curso todavía no tiene lecciones.</p>
        )}
      </div>

      {/* ── El índice: módulos → lecciones ──────────────────────────────── */}
      <div className="space-y-4">
        {contenido.modulos.map((modulo) => (
          <div key={modulo.id}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2 px-1">
              {modulo.titulo}
            </p>
            <div className="space-y-1">
              {modulo.lecciones.map((leccion) => {
                const activa = leccion.id === seleccionId;
                const vista = vistas.has(leccion.id);
                return (
                  <button
                    key={leccion.id}
                    type="button"
                    onClick={() => setSeleccionId(leccion.id)}
                    className={`flex items-center gap-2.5 w-full text-left rounded-xl px-3 py-2.5 text-[13px] transition-colors ${
                      activa
                        ? "bg-orange-500/10 text-orange-200 border border-orange-500/25"
                        : "text-white/65 hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    {vista ? (
                      <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Play className="w-3.5 h-3.5 shrink-0 text-white/25" />
                    )}
                    <span className="truncate">{leccion.titulo}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
