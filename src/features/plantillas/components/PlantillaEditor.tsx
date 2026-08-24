"use client";

import { useMemo, useState } from "react";

import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import Textarea from "@/components/brand/Textarea";
import { toast } from "@/components/brand/Toast";
import { ArrowLeft, ArrowRight, Copy, Plus, Printer, Spinner, Trash } from "@/components/brand/icons";

import EjercicioEditor from "./EjercicioEditor";
import SessionView from "./SessionView";
import CompartirPanel from "./CompartirPanel";

import { guardarContenido } from "@/lib/plantillas/actions";
import { diaNuevo, problemasDe, redimensionar, seriesQueSePierden } from "@/lib/plantillas/contenido";
import {
  anadirDia,
  anadirEjercicio,
  anadirSerie,
  asegurarBloque,
  copiarSemana,
  duplicarEjercicio,
  editarEjercicio,
  editarSerie,
  moverDia,
  moverEjercicio,
  notasDia,
  quitarBloque,
  quitarDia,
  quitarEjercicio,
  quitarSerie,
  renombrarDia,
} from "@/lib/plantillas/editar";
import {
  ETIQUETA_BLOQUE,
  TIPOS_BLOQUE,
  type Contenido,
  type EnlacePlantilla,
  type Plantilla,
  type TipoBloque,
} from "@/lib/plantillas/tipos";

// ── El editor ──────────────────────────────────────────────────────────────
//
// SOLO EL AUTOR LLEGA AQUÍ. La RLS de `plantillas` acota cada consulta a
// `auth.uid() = entrenador_id`, así que esta pantalla no vuelve a comprobar
// permisos: si alguien abriera el id de otro, la página no habría cargado.
//
// ── EDITAR Y REVISAR SON DOS PESTAÑAS ─────────────────────────────────────
//
//   «Editar» muestra UNA semana, con sus casillas. «Vista previa» muestra el
//   documento entero con la misma maquetación que verá quien abra el enlace.
//
//   No es una separación estética. Son dos actividades con necesidades
//   opuestas: editar quiere campos grandes y pocos a la vez; revisar quiere
//   la progresión completa de un vistazo. El referente que trajo el
//   entrenador intentaba las dos cosas en la misma rejilla, y por eso costaba
//   leerlo.
//
// ── EL ESTADO NO SE AUTOGUARDA, Y ES DELIBERADO ───────────────────────────
//
//   Una plantilla publicada la están mirando otras personas por su enlace.
//   Autoguardar publicaría cada tecleo a medias —una carga de «8» camino de
//   «85»— en el documento que un cliente tiene abierto. Se guarda cuando el
//   autor lo dice.
//
//   El precio es poder perder cambios al cerrar la pestaña. Se avisa con el
//   punto naranja del botón, que es lo que un editor debe hacer: enseñar que
//   hay algo pendiente, no decidir por su cuenta.

interface Props {
  plantilla: Plantilla;
  enlaces: EnlacePlantilla[];
  /** Clientes del BCS, para poder asignar la plantilla a uno. */
  clientes: readonly { id: string; nombre: string }[];
  /** Nombres del catálogo, para sugerir al teclear un ejercicio. */
  catalogo: readonly { nombre: string; slug: string }[];
  baseUrl: string;
}

type Pestana = "editar" | "vista";

export default function PlantillaEditor({
  plantilla,
  enlaces,
  clientes,
  catalogo,
  baseUrl,
}: Props) {
  const [nombre, setNombre] = useState(plantilla.nombre);
  const [descripcion, setDescripcion] = useState(plantilla.descripcion ?? "");
  const [semanas, setSemanas] = useState(plantilla.semanas);
  const [contenido, setContenido] = useState<Contenido>(plantilla.contenido);
  const [semanaActiva, setSemanaActiva] = useState(0);
  const [pestana, setPestana] = useState<Pestana>("editar");
  const [sucio, setSucio] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const listaId = `catalogo-${plantilla.id}`;
  const porNombre = useMemo(
    () => new Map(catalogo.map((c) => [c.nombre.toLowerCase(), c.slug])),
    [catalogo],
  );

  /** Todo cambio del documento pasa por aquí: un solo sitio marca «sucio». */
  function editar(f: (c: Contenido) => Contenido) {
    setContenido((actual) => f(actual));
    setSucio(true);
  }

  /**
   * Cambiar el número de semanas redimensiona el documento en el acto.
   *
   * Si el recorte destruye series escritas se pregunta antes. `confirm` y no
   * un diálogo propio: es una confirmación destructiva de una sola frase, y
   * montar un `Dialog` para ella añadiría estado a una pantalla que ya tiene
   * bastante.
   */
  function cambiarSemanas(valor: number) {
    if (!Number.isInteger(valor) || valor < 1 || valor > 24) return;

    if (valor < semanas) {
      const perdidas = seriesQueSePierden(contenido, valor);
      if (perdidas > 0) {
        const frase =
          perdidas === 1
            ? "Se perderá 1 serie ya escrita."
            : `Se perderán ${perdidas} series ya escritas.`;
        if (!window.confirm(`${frase}\n\n¿Recortar el bloque a ${valor} semanas?`)) return;
      }
    }

    setSemanas(valor);
    setContenido((c) => redimensionar(c, valor));
    setSemanaActiva((s) => Math.min(s, valor - 1));
    setSucio(true);
  }

  /** Al escribir un nombre del catálogo, se enlaza su ficha automáticamente. */
  function nombrarEjercicio(ejercicioId: string, nuevoNombre: string) {
    editar((c) =>
      editarEjercicio(c, ejercicioId, {
        nombre: nuevoNombre,
        slug: porNombre.get(nuevoNombre.trim().toLowerCase()) ?? null,
      }),
    );
  }

  async function guardar() {
    if (guardando) return;

    const problemas = problemasDe(contenido, semanas);
    if (problemas.length > 0) {
      toast.error(problemas[0]);
      return;
    }

    setGuardando(true);
    const resultado = await guardarContenido(plantilla.id, {
      nombre,
      descripcion: descripcion.trim() === "" ? null : descripcion,
      semanas,
      contenido,
    });
    setGuardando(false);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    setSucio(false);
    toast.success("Plantilla guardada.");
  }

  return (
    <div className="space-y-6">
      {/* ── Cabecera ── */}
      <div className="print:hidden space-y-3">
        <Input
          value={nombre}
          aria-label="Nombre de la plantilla"
          placeholder="Nombre de la plantilla"
          onChange={(e) => {
            setNombre(e.target.value);
            setSucio(true);
          }}
          className="text-lg font-black"
        />
        <Textarea
          value={descripcion}
          rows={2}
          aria-label="Descripción"
          placeholder="Para quién es, qué objetivo persigue, qué material hace falta…"
          onChange={(e) => {
            setDescripcion(e.target.value);
            setSucio(true);
          }}
          className="text-sm"
        />

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-white/60">
            Semanas del bloque
            <Input
              value={String(semanas)}
              inputMode="numeric"
              aria-label="Semanas del bloque"
              onChange={(e) => cambiarSemanas(Number(e.target.value))}
              className="w-16 py-1.5 text-center text-sm tabular-nums"
            />
          </label>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" strokeWidth={2} />
              Imprimir
            </Button>
            <Button size="sm" onClick={guardar} disabled={guardando}>
              {guardando ? (
                <>
                  <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
                  Guardando…
                </>
              ) : (
                <>
                  {sucio && (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-white"
                      title="Hay cambios sin guardar"
                    />
                  )}
                  Guardar
                </>
              )}
            </Button>
          </div>
        </div>

        {sucio && (
          <p className="text-[11px] text-white/35">
            Hay cambios sin guardar. No se publican solos: quien tenga el enlace abierto sigue
            viendo la última versión guardada.
          </p>
        )}
      </div>

      {/* ── Pestañas ── */}
      <div className="print:hidden flex gap-1 border-b border-white/[0.08]">
        {(["editar", "vista"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPestana(p)}
            className={`-mb-px border-b-2 px-3 py-2 text-xs font-bold transition-colors ${
              pestana === p
                ? "border-orange-500 text-white"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {p === "editar" ? "Editar" : "Vista previa"}
          </button>
        ))}
      </div>

      {/* ── El documento se dibuja SIEMPRE, aunque estés editando ──────────
          Antes solo existía en la pestaña de vista previa, y como el editor
          entero es `print:hidden`, imprimir desde «Editar» producía un
          documento SIN NADA. El navegador no dice «esto está vacío»: se queda
          girando en «generando vista previa», y parece que el botón está roto.

          Así que en modo edición se dibuja igual, oculto en pantalla y
          visible en papel. Imprimir hace lo mismo estés en la pestaña que
          estés, que es lo que cualquiera espera de ese botón. */}
      <div className={pestana === "vista" ? undefined : "hidden print:block"}>
        <SessionView contenido={contenido} semanas={semanas} />
      </div>

      {pestana === "editar" && (
        <div className="space-y-6 print:hidden">
          <SelectorSemana
            semanas={semanas}
            activa={semanaActiva}
            onCambiar={setSemanaActiva}
            onCopiar={(hasta) => {
              editar((c) => copiarSemana(c, semanaActiva, hasta));
              toast.success(`Semana ${semanaActiva + 1} copiada a la ${hasta + 1}.`);
            }}
          />

          {contenido.dias.map((dia, iDia) => (
            <section key={dia.id} className="rounded-2xl border border-white/[0.08] p-4">
              <div className="mb-4 flex items-start gap-2">
                <Input
                  value={dia.nombre}
                  aria-label={`Nombre del día ${iDia + 1}`}
                  placeholder={`Día ${iDia + 1}`}
                  onChange={(e) => editar((c) => renombrarDia(c, dia.id, e.target.value))}
                  className="flex-1 py-2 text-sm font-black"
                />
                <button
                  type="button"
                  aria-label="Subir el día"
                  onClick={() => editar((c) => moverDia(c, dia.id, -1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/35 transition-colors hover:text-white/70"
                >
                  <ArrowLeft className="h-4 w-4 rotate-90" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-label="Bajar el día"
                  onClick={() => editar((c) => moverDia(c, dia.id, 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/35 transition-colors hover:text-white/70"
                >
                  <ArrowRight className="h-4 w-4 rotate-90" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-label="Quitar el día"
                  onClick={() => {
                    if (window.confirm(`¿Quitar «${dia.nombre}» y todos sus ejercicios?`)) {
                      editar((c) => quitarDia(c, dia.id));
                    }
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-white/30 transition-colors hover:border-red-500/30 hover:text-red-400"
                >
                  <Trash className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>

              <Input
                value={dia.notas ?? ""}
                aria-label={`Nota del día ${iDia + 1}`}
                placeholder="Nota del día (opcional)"
                onChange={(e) => editar((c) => notasDia(c, dia.id, e.target.value))}
                className="mb-4 py-1.5 text-xs"
              />

              <div className="space-y-5">
                {dia.bloques.map((bloque) => (
                  <div key={bloque.id}>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                        {ETIQUETA_BLOQUE[bloque.tipo]}
                      </h3>
                      {bloque.ejercicios.length === 0 && (
                        <button
                          type="button"
                          onClick={() => editar((c) => quitarBloque(c, dia.id, bloque.id))}
                          className="text-[10px] text-white/25 underline underline-offset-2 hover:text-white/50"
                        >
                          quitar bloque
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {bloque.ejercicios.map((ejercicio) => (
                        <EjercicioEditor
                          key={ejercicio.id}
                          ejercicio={ejercicio}
                          semana={semanaActiva}
                          listaId={listaId}
                          onCampo={(campos) =>
                            campos.nombre !== undefined
                              ? nombrarEjercicio(ejercicio.id, campos.nombre)
                              : editar((c) => editarEjercicio(c, ejercicio.id, campos))
                          }
                          onSerie={(serie, campos) =>
                            editar((c) => editarSerie(c, ejercicio.id, semanaActiva, serie, campos))
                          }
                          onAnadirSerie={() =>
                            editar((c) => anadirSerie(c, ejercicio.id, semanaActiva))
                          }
                          onQuitarSerie={(serie) =>
                            editar((c) => quitarSerie(c, ejercicio.id, semanaActiva, serie))
                          }
                          onDuplicar={() => editar((c) => duplicarEjercicio(c, ejercicio.id))}
                          onQuitar={() => editar((c) => quitarEjercicio(c, ejercicio.id))}
                          onMover={(delta) => editar((c) => moverEjercicio(c, ejercicio.id, delta))}
                        />
                      ))}

                      <button
                        type="button"
                        onClick={() =>
                          editar((c) => anadirEjercicio(c, dia.id, bloque.id, "", semanas))
                        }
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/[0.10] py-2 text-[11px] font-semibold text-white/35 transition-colors hover:border-white/25 hover:text-white/70"
                      >
                        <Plus className="h-3 w-3" strokeWidth={2.5} />
                        Añadir ejercicio a {ETIQUETA_BLOQUE[bloque.tipo].toLowerCase()}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <BloquesQueFaltan
                presentes={dia.bloques.map((b) => b.tipo)}
                onAnadir={(tipo) => editar((c) => asegurarBloque(c, dia.id, tipo))}
              />
            </section>
          ))}

          <button
            type="button"
            onClick={() =>
              editar((c) => anadirDia(c, diaNuevo(`Día ${contenido.dias.length + 1}`)))
            }
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.10] py-4 text-sm font-bold text-white/40 transition-colors hover:border-white/25 hover:text-white"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Añadir día
          </button>
        </div>
      )}

      {/* La lista de sugerencias vive una sola vez, fuera de las pestañas. */}
      <datalist id={listaId}>
        {catalogo.map((c) => (
          <option key={c.slug} value={c.nombre} />
        ))}
      </datalist>

      <div className="print:hidden">
        <CompartilPanelSeguro
          plantilla={plantilla}
          enlaces={enlaces}
          clientes={clientes}
          baseUrl={baseUrl}
          sucio={sucio}
        />
      </div>
    </div>
  );
}

/**
 * El panel de compartir, con un aviso si hay cambios sin guardar.
 *
 * Compartir un enlace mientras hay cambios pendientes manda a alguien a un
 * documento que no es el que el autor está viendo. No se bloquea —a veces es
 * justo lo que se quiere— pero se dice.
 */
function CompartilPanelSeguro({
  plantilla,
  enlaces,
  clientes,
  baseUrl,
  sucio,
}: {
  plantilla: Plantilla;
  enlaces: EnlacePlantilla[];
  clientes: readonly { id: string; nombre: string }[];
  baseUrl: string;
  sucio: boolean;
}) {
  return (
    <div className="space-y-2">
      {sucio && (
        <p className="text-[11px] leading-relaxed text-yellow-200/70">
          Tienes cambios sin guardar. Quien abra el enlace ahora verá la última versión guardada,
          no lo que estás viendo tú.
        </p>
      )}
      <CompartirPanel
        plantilla={plantilla}
        enlaces={enlaces}
        clientes={clientes}
        baseUrl={baseUrl}
      />
    </div>
  );
}

function SelectorSemana({
  semanas,
  activa,
  onCambiar,
  onCopiar,
}: {
  semanas: number;
  activa: number;
  onCambiar: (i: number) => void;
  onCopiar: (hasta: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] p-2">
      <span className="px-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
        Editando
      </span>

      <div className="flex flex-wrap gap-1">
        {Array.from({ length: semanas }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onCambiar(i)}
            aria-pressed={i === activa}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
              i === activa
                ? "bg-orange-500 text-white"
                : "text-white/45 hover:bg-white/[0.06] hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {activa < semanas - 1 && (
        <button
          type="button"
          onClick={() => onCopiar(activa + 1)}
          className="ml-auto flex items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-white/50 transition-colors hover:border-white/20 hover:text-white"
        >
          <Copy className="h-3 w-3" strokeWidth={2} />
          Copiar a la semana {activa + 2}
        </button>
      )}
    </div>
  );
}

/** Los bloques que este día todavía no tiene. Uno de cada tipo, como mucho. */
function BloquesQueFaltan({
  presentes,
  onAnadir,
}: {
  presentes: TipoBloque[];
  onAnadir: (tipo: TipoBloque) => void;
}) {
  const faltan = TIPOS_BLOQUE.filter((t) => !presentes.includes(t));
  if (faltan.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-3">
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/25">
        Añadir bloque
      </span>
      {faltan.map((tipo) => (
        <button
          key={tipo}
          type="button"
          onClick={() => onAnadir(tipo)}
          className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-white/45 transition-colors hover:border-white/20 hover:text-white"
        >
          {ETIQUETA_BLOQUE[tipo]}
        </button>
      ))}
    </div>
  );
}

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  NOMBRE_VACIO: "La plantilla necesita un nombre.",
  NOMBRE_LARGO: "El nombre es demasiado largo.",
  PLANTILLA_NO_ENCONTRADA: "Esta plantilla ya no existe.",
  PLANTILLA_NO_ACTUALIZADA: "No se pudo guardar. Inténtalo de nuevo.",
};
