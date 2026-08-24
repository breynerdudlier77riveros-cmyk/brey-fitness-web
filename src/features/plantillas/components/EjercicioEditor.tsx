"use client";

import Input from "@/components/brand/Input";
import { ArrowLeft, ArrowRight, Copy, Plus, Trash } from "@/components/brand/icons";
import type { EjercicioPlantilla } from "@/lib/plantillas/tipos";

// ── Un ejercicio en el editor ──────────────────────────────────────────────
//
// SE EDITA UNA SEMANA CADA VEZ, Y ES LA DECISIÓN QUE HACE USABLE EL EDITOR.
//
//   Un bloque de 4 semanas con 3 series y 3 campos por serie son 36 casillas
//   por ejercicio. Con seis ejercicios, doscientas. Ninguna pantalla —ni un
//   portátil— sostiene eso sin que el usuario se pierda entre celdas.
//
//   Así que aquí solo se ve la semana activa. La progresión completa se ve en
//   la pestaña de vista previa, que es la MISMA maquetación que verá quien
//   abra el enlace. Editar y revisar son dos actividades distintas y se
//   separan; el referente que trajo el entrenador las mezclaba, y por eso
//   había que entrecerrar los ojos para leerlo.
//
// ── LOS TRES CAMPOS SE VACÍAN DE VERDAD ───────────────────────────────────
//
//   Borrar el peso deja `null`, no `0`. Es la misma regla que el resto del
//   ecosistema: «no prescrito» y «cero» son cosas distintas, y un cero que
//   aparece solo se lee como una indicación de descarga que nadie escribió.

interface Props {
  ejercicio: EjercicioPlantilla;
  semana: number;
  /** Ejercicios del catálogo, para la lista de sugerencias del nombre. */
  listaId: string;
  onCampo: (campos: { nombre?: string; notas?: string | null; descansoSeg?: number | null }) => void;
  onSerie: (serie: number, campos: { reps?: string; pesoKg?: number | null; rir?: number | null }) => void;
  onAnadirSerie: () => void;
  onQuitarSerie: (serie: number) => void;
  onDuplicar: () => void;
  onQuitar: () => void;
  onMover: (delta: number) => void;
}

/**
 * Lo tecleado, a número o `null`.
 *
 * La coma decimal se acepta: es como se escribe un peso en español, y
 * rechazar «82,5» por teclearlo como se lee sería una trampa. Lo que no es un
 * número se descarta en vez de guardarse como NaN, que llegaría a la base
 * como null igualmente pero pasando por un estado inválido en pantalla.
 */
function aNumero(texto: string): number | null {
  const limpio = texto.trim().replace(",", ".");
  if (limpio === "") return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : null;
}

const deNumero = (v: number | null): string => (v === null ? "" : String(v).replace(".", ","));

export default function EjercicioEditor({
  ejercicio,
  semana,
  listaId,
  onCampo,
  onSerie,
  onAnadirSerie,
  onQuitarSerie,
  onDuplicar,
  onQuitar,
  onMover,
}: Props) {
  const series = ejercicio.semanas[semana]?.series ?? [];

  return (
    <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
      <div className="mb-3 flex items-start gap-2">
        <div className="min-w-0 flex-1 space-y-2">
          <Input
            value={ejercicio.nombre}
            list={listaId}
            placeholder="Nombre del ejercicio"
            aria-label="Nombre del ejercicio"
            onChange={(e) => onCampo({ nombre: e.target.value })}
            className="py-2 text-sm font-semibold"
          />

          <div className="flex flex-wrap gap-2">
            <Input
              value={ejercicio.notas ?? ""}
              placeholder="Nota (tempo, ejecución, señal…)"
              aria-label={`Nota de ${ejercicio.nombre || "el ejercicio"}`}
              onChange={(e) => onCampo({ notas: e.target.value.trim() === "" ? null : e.target.value })}
              className="min-w-40 flex-1 py-1.5 text-xs"
            />
            <Input
              value={ejercicio.descansoSeg === null ? "" : String(ejercicio.descansoSeg)}
              inputMode="numeric"
              placeholder="Descanso (s)"
              aria-label={`Descanso en segundos de ${ejercicio.nombre || "el ejercicio"}`}
              onChange={(e) => onCampo({ descansoSeg: aNumero(e.target.value) })}
              className="w-32 py-1.5 text-xs"
            />
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col gap-1">
          <IconoBoton etiqueta="Subir" onClick={() => onMover(-1)}>
            <ArrowLeft className="h-3.5 w-3.5 rotate-90" strokeWidth={2} />
          </IconoBoton>
          <IconoBoton etiqueta="Bajar" onClick={() => onMover(1)}>
            <ArrowRight className="h-3.5 w-3.5 rotate-90" strokeWidth={2} />
          </IconoBoton>
        </div>
      </div>

      {/* ── Series de la semana activa ── */}
      <div className="space-y-1.5">
        <div className="flex gap-2 px-1 text-[9px] font-bold uppercase tracking-wider text-white/25">
          <span className="w-6">#</span>
          <span className="flex-1">Reps</span>
          <span className="w-20">Kg</span>
          <span className="w-16">RIR</span>
          <span className="w-7" />
        </div>

        {series.map((serie, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-6 text-center text-[11px] font-semibold text-white/30">{i + 1}</span>

            <Input
              value={serie.reps}
              placeholder="8-10"
              aria-label={`Repeticiones de la serie ${i + 1}`}
              onChange={(e) => onSerie(i, { reps: e.target.value })}
              className="min-w-0 flex-1 py-1.5 text-center text-xs tabular-nums"
            />
            <Input
              value={deNumero(serie.pesoKg)}
              inputMode="decimal"
              placeholder="—"
              aria-label={`Peso en kilos de la serie ${i + 1}`}
              onChange={(e) => onSerie(i, { pesoKg: aNumero(e.target.value) })}
              className="w-20 py-1.5 text-center text-xs tabular-nums"
            />
            <Input
              value={deNumero(serie.rir)}
              inputMode="numeric"
              placeholder="—"
              aria-label={`Repeticiones en reserva de la serie ${i + 1}`}
              onChange={(e) => onSerie(i, { rir: aNumero(e.target.value) })}
              className="w-16 py-1.5 text-center text-xs tabular-nums"
            />

            <IconoBoton
              etiqueta={`Quitar la serie ${i + 1}`}
              onClick={() => onQuitarSerie(i)}
              peligro
            >
              <Trash className="h-3.5 w-3.5" strokeWidth={2} />
            </IconoBoton>
          </div>
        ))}

        {series.length === 0 && (
          <p className="px-1 py-2 text-[11px] text-white/30">
            Sin series en esta semana. Es válido: puede ser una semana de descarga en la que este
            ejercicio no se hace.
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-2.5">
        <MiniBoton onClick={onAnadirSerie}>
          <Plus className="h-3 w-3" strokeWidth={2.5} />
          Serie
        </MiniBoton>
        <MiniBoton onClick={onDuplicar}>
          <Copy className="h-3 w-3" strokeWidth={2} />
          Duplicar ejercicio
        </MiniBoton>
        <MiniBoton onClick={onQuitar} peligro>
          <Trash className="h-3 w-3" strokeWidth={2} />
          Quitar
        </MiniBoton>
      </div>
    </article>
  );
}

function IconoBoton({
  children,
  etiqueta,
  onClick,
  peligro = false,
}: {
  children: React.ReactNode;
  etiqueta: string;
  onClick: () => void;
  peligro?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={etiqueta}
      title={etiqueta}
      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] transition-colors ${
        peligro
          ? "text-white/30 hover:border-red-500/30 hover:text-red-400"
          : "text-white/35 hover:border-white/20 hover:text-white/70"
      }`}
    >
      {children}
    </button>
  );
}

function MiniBoton({
  children,
  onClick,
  peligro = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  peligro?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] font-semibold transition-colors ${
        peligro
          ? "text-white/35 hover:border-red-500/30 hover:text-red-400"
          : "text-white/50 hover:border-white/20 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
