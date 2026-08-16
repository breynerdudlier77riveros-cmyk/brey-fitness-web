import Link from "next/link";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { TIPOS_EVALUACION } from "@/lib/pas";
import type { EstadoEvaluacion } from "../schemas/tipos";

// ── Filtro del historial de evaluaciones (Sprint I-02) ─────────────────────
//
// Mismo criterio que `FiltrosAtletas`: `filtrarEvaluaciones` ya existía en
// `services/consultas.ts`, probada y sin ninguna superficie que la invocara.
// Esto no filtra — solo permite pedirlo.
//
// `<form method="get">` otra vez, y por las mismas razones: funciona sin
// JavaScript, la URL es la única fuente de verdad y el filtro es compartible.
//
// Las fechas usan `type="date"`, así que el navegador ya valida el formato y
// entrega `yyyy-mm-dd`, que es exactamente lo que `filtrarEvaluaciones` compara
// como cadena. No hay conversión por el camino.

interface Props {
  /** Lo aplicado ahora mismo, leído de la URL por la página. */
  valores: { estado?: string; tipo?: string; desde?: string; hasta?: string };
  /** Ruta a la que vuelve «Quitar filtros». La compone la página, que sabe el id. */
  rutaLimpia: string;
  total: number;
  visibles: number;
}

const ESTADOS: readonly { valor: EstadoEvaluacion | ""; etiqueta: string }[] = [
  { valor: "", etiqueta: "Todos los estados" },
  { valor: "borrador", etiqueta: "Borrador" },
  { valor: "completada", etiqueta: "Completada" },
  { valor: "anulada", etiqueta: "Anulada" },
];

const SELECT =
  "h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500/40 [color-scheme:dark]";

export default function FiltrosEvaluaciones({ valores, rutaLimpia, total, visibles }: Props) {
  const hayFiltro = Boolean(valores.estado || valores.tipo || valores.desde || valores.hasta);

  return (
    <form method="get" className="space-y-3" aria-label="Filtrar evaluaciones">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Estado</span>
          <select name="estado" defaultValue={valores.estado ?? ""} className={SELECT}>
            {ESTADOS.map((e) => (
              <option key={e.valor} value={e.valor} className="bg-slate-900 text-white">
                {e.etiqueta}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Tipo</span>
          <select name="tipo" defaultValue={valores.tipo ?? ""} className={SELECT}>
            <option value="" className="bg-slate-900 text-white">
              Todos los tipos
            </option>
            {TIPOS_EVALUACION.map((t) => (
              <option key={t} value={t} className="bg-slate-900 text-white">
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Desde</span>
          <Input type="date" name="desde" defaultValue={valores.desde ?? ""} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Hasta</span>
          <Input type="date" name="hasta" defaultValue={valores.hasta ?? ""} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Aplicar</Button>

        {hayFiltro ? (
          <Link
            href={rutaLimpia}
            className="text-sm text-white/50 underline-offset-4 hover:underline"
          >
            Quitar filtros
          </Link>
        ) : null}

        <p className="text-[11px] text-white/40" aria-live="polite">
          {hayFiltro
            ? `${visibles} de ${total} evaluaciones coinciden`
            : `${total} ${total === 1 ? "evaluación" : "evaluaciones"}`}
        </p>
      </div>
    </form>
  );
}
