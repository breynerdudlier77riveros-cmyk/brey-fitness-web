"use client";

import { useRef, useState } from "react";

import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import Textarea from "@/components/brand/Textarea";
import Checkbox from "@/components/brand/Checkbox";
import { toast } from "@/components/brand/Toast";
import { Download, Play, Plus, Trash } from "@/components/brand/icons";
import {
  agregarLeccion,
  agregarModulo,
  eliminarLeccion,
  eliminarModulo,
  escribirLeccion,
  moverLeccion,
  moverModulo,
  renombrarModulo,
} from "@/lib/cursos/contenido";
import {
  accionEliminarMaterial,
  accionGuardarContenido,
  accionSubirMaterial,
} from "@/lib/cursos/actions";
import type { ContenidoSistema } from "@/lib/cursos/tipos";

// ── Editor de contenido de un Sistema (Sprint CURSO-1) ─────────────────────
//
// CADA EDICIÓN SE GUARDA DE INMEDIATO, NO AL SALIR.
//
//   A diferencia de la rejilla del macrociclo —miles de celdas, guardado
//   diferido para no saturar la red— aquí un admin edita unos pocos módulos
//   de vez en cuando. Guardar en el acto evita el problema real de este
//   editor: subir un PDF llama a una Server Action que LEE el contenido
//   actual de la base de datos antes de añadir el material. Con una edición
//   sin guardar todavía en el cliente, esa subida la pisaría sin que nadie
//   lo notara. Guardando siempre antes de dejar tocar «Subir», ese contenido
//   ya está en la base cuando la subida lo vuelve a leer.

interface Props {
  sistemaSlug: string;
  contenidoInicial: ContenidoSistema;
}

export default function EditorContenido({ sistemaSlug, contenidoInicial }: Props) {
  const [contenido, setContenido] = useState<ContenidoSistema>(contenidoInicial);
  const [guardando, setGuardando] = useState(false);
  const inputArchivo = useRef<Record<string, HTMLInputElement | null>>({});

  async function aplicar(siguiente: ContenidoSistema) {
    setContenido(siguiente);
    setGuardando(true);
    const r = await accionGuardarContenido(sistemaSlug, siguiente);
    setGuardando(false);
    if (!r.ok) toast.error(`No se pudo guardar: ${r.error}`);
  }

  async function subirMaterial(moduloId: string, leccionId: string, archivo: File) {
    const formData = new FormData();
    formData.set("archivo", archivo);
    setGuardando(true);
    const r = await accionSubirMaterial(sistemaSlug, moduloId, leccionId, formData);
    setGuardando(false);
    if (!r.ok) {
      toast.error(`No se pudo subir el archivo: ${r.error}`);
      return;
    }
    setContenido((c) => ({
      modulos: c.modulos.map((m) =>
        m.id !== moduloId
          ? m
          : {
              ...m,
              lecciones: m.lecciones.map((l) =>
                l.id === leccionId ? { ...l, materiales: [...l.materiales, r.data] } : l,
              ),
            },
      ),
    }));
  }

  async function quitarMaterial(
    moduloId: string,
    leccionId: string,
    materialId: string,
    archivoPath: string,
  ) {
    const r = await accionEliminarMaterial(sistemaSlug, moduloId, leccionId, materialId, archivoPath);
    if (!r.ok) {
      toast.error(`No se pudo eliminar: ${r.error}`);
      return;
    }
    setContenido((c) => ({
      modulos: c.modulos.map((m) =>
        m.id !== moduloId
          ? m
          : {
              ...m,
              lecciones: m.lecciones.map((l) =>
                l.id === leccionId
                  ? { ...l, materiales: l.materiales.filter((mat) => mat.id !== materialId) }
                  : l,
              ),
            },
      ),
    }));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <span
          className={`text-[11px] ${guardando ? "text-amber-300/70" : "text-white/30"}`}
        >
          {guardando ? "Guardando…" : "Guardado"}
        </span>
        <NuevoModulo onCrear={(titulo) => aplicar(agregarModulo(contenido, titulo))} />
      </div>

      {contenido.modulos.length === 0 ? (
        <p className="text-sm text-white/40 border border-dashed border-white/10 rounded-xl p-6 text-center">
          Este Sistema todavía no tiene módulos. Crea el primero arriba.
        </p>
      ) : null}

      {contenido.modulos.map((modulo, i) => (
        <div key={modulo.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex items-center gap-2">
            <Input
              value={modulo.titulo}
              onChange={(e) =>
                setContenido((c) => ({
                  modulos: c.modulos.map((m) =>
                    m.id === modulo.id ? { ...m, titulo: e.target.value } : m,
                  ),
                }))
              }
              onBlur={(e) => aplicar(renombrarModulo(contenido, modulo.id, e.target.value))}
              className="font-black text-white max-w-md"
            />
            <button
              type="button"
              disabled={i === 0}
              onClick={() => aplicar(moverModulo(contenido, modulo.id, -1))}
              className="text-white/40 hover:text-white disabled:opacity-20 px-1.5"
              title="Mover arriba"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={i === contenido.modulos.length - 1}
              onClick={() => aplicar(moverModulo(contenido, modulo.id, 1))}
              className="text-white/40 hover:text-white disabled:opacity-20 px-1.5"
              title="Mover abajo"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`¿Eliminar el módulo «${modulo.titulo}» y sus lecciones?`)) {
                  aplicar(eliminarModulo(contenido, modulo.id));
                }
              }}
              className="ml-auto text-white/30 hover:text-red-400"
              title="Eliminar módulo"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {modulo.lecciones.map((leccion, j) => (
              <div
                key={leccion.id}
                className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3.5"
              >
                <div className="flex items-start gap-2">
                  <Play className="w-4 h-4 mt-2.5 text-white/25 shrink-0" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Input
                      value={leccion.titulo}
                      onChange={(e) =>
                        setContenido((c) => ({
                          modulos: c.modulos.map((m) =>
                            m.id !== modulo.id
                              ? m
                              : {
                                  ...m,
                                  lecciones: m.lecciones.map((l) =>
                                    l.id === leccion.id ? { ...l, titulo: e.target.value } : l,
                                  ),
                                },
                          ),
                        }))
                      }
                      onBlur={(e) =>
                        aplicar(escribirLeccion(contenido, modulo.id, leccion.id, { titulo: e.target.value }))
                      }
                      placeholder="Título de la lección"
                    />
                    <Textarea
                      value={leccion.descripcion ?? ""}
                      onChange={(e) =>
                        setContenido((c) => ({
                          modulos: c.modulos.map((m) =>
                            m.id !== modulo.id
                              ? m
                              : {
                                  ...m,
                                  lecciones: m.lecciones.map((l) =>
                                    l.id === leccion.id
                                      ? { ...l, descripcion: e.target.value || null }
                                      : l,
                                  ),
                                },
                          ),
                        }))
                      }
                      onBlur={(e) =>
                        aplicar(
                          escribirLeccion(contenido, modulo.id, leccion.id, {
                            descripcion: e.target.value || null,
                          }),
                        )
                      }
                      placeholder="Descripción (opcional)"
                      rows={2}
                      className="text-sm"
                    />
                    <Input
                      value={leccion.videoUrl ?? ""}
                      onChange={(e) =>
                        setContenido((c) => ({
                          modulos: c.modulos.map((m) =>
                            m.id !== modulo.id
                              ? m
                              : {
                                  ...m,
                                  lecciones: m.lecciones.map((l) =>
                                    l.id === leccion.id ? { ...l, videoUrl: e.target.value } : l,
                                  ),
                                },
                          ),
                        }))
                      }
                      onBlur={(e) =>
                        aplicar(
                          escribirLeccion(contenido, modulo.id, leccion.id, { videoUrl: e.target.value }),
                        )
                      }
                      placeholder="Enlace del video (YouTube o Vimeo, puede ser 'no listado')"
                      className="text-sm"
                    />
                    {leccion.videoUrl ? (
                      <p className="text-[11px] text-white/30">
                        {leccion.origenVideo === "youtube"
                          ? "YouTube"
                          : leccion.origenVideo === "vimeo"
                            ? "Vimeo"
                            : "Enlace externo"}{" "}
                        · {leccion.videoUrl}
                      </p>
                    ) : null}

                    <label className="flex items-center gap-2 text-[12px] text-white/60">
                      <Checkbox
                        checked={leccion.gratis}
                        onCheckedChange={(v) =>
                          aplicar(
                            escribirLeccion(contenido, modulo.id, leccion.id, { gratis: v === true }),
                          )
                        }
                      />
                      Vista previa gratuita (visible sin comprar)
                    </label>

                    {/* ── Materiales descargables ──────────────────────── */}
                    <div className="pt-1.5 space-y-1.5">
                      {leccion.materiales.map((mat) => (
                        <div
                          key={mat.id}
                          className="flex items-center gap-2 text-[12px] text-white/60 rounded-lg border border-white/[0.06] px-2.5 py-1.5"
                        >
                          <Download className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{mat.nombre}</span>
                          <button
                            type="button"
                            onClick={() => quitarMaterial(modulo.id, leccion.id, mat.id, mat.archivoPath)}
                            className="ml-auto text-white/30 hover:text-red-400"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <input
                        ref={(el) => {
                          inputArchivo.current[leccion.id] = el;
                        }}
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const archivo = e.target.files?.[0];
                          e.target.value = "";
                          if (archivo) subirMaterial(modulo.id, leccion.id, archivo);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={guardando}
                        onClick={() => inputArchivo.current[leccion.id]?.click()}
                      >
                        Subir PDF
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={j === 0}
                      onClick={() => aplicar(moverLeccion(contenido, modulo.id, leccion.id, -1))}
                      className="text-white/40 hover:text-white disabled:opacity-20 px-1"
                      title="Mover arriba"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={j === modulo.lecciones.length - 1}
                      onClick={() => aplicar(moverLeccion(contenido, modulo.id, leccion.id, 1))}
                      className="text-white/40 hover:text-white disabled:opacity-20 px-1"
                      title="Mover abajo"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar la lección «${leccion.titulo}»?`)) {
                          aplicar(eliminarLeccion(contenido, modulo.id, leccion.id));
                        }
                      }}
                      className="text-white/30 hover:text-red-400 px-1"
                      title="Eliminar lección"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <NuevaLeccion onCrear={(titulo) => aplicar(agregarLeccion(contenido, modulo.id, titulo))} />
          </div>
        </div>
      ))}
    </div>
  );
}

function NuevoModulo({ onCrear }: { onCrear: (titulo: string) => void }) {
  const [valor, setValor] = useState("");
  return (
    <div className="flex gap-2">
      <Input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Nombre del nuevo módulo"
        className="w-56"
      />
      <Button
        size="sm"
        onClick={() => {
          if (valor.trim() === "") return;
          onCrear(valor);
          setValor("");
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Módulo
      </Button>
    </div>
  );
}

function NuevaLeccion({ onCrear }: { onCrear: (titulo: string) => void }) {
  const [valor, setValor] = useState("");
  return (
    <div className="flex gap-2 pl-1">
      <Input
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Título de la nueva lección"
        className="text-sm"
      />
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          if (valor.trim() === "") return;
          onCrear(valor);
          setValor("");
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        Lección
      </Button>
    </div>
  );
}
