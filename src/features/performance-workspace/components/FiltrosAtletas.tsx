import Link from "next/link";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import type { EstadoAtleta } from "../schemas/tipos";

// ── Búsqueda y filtros de atletas (Sprint I-02) ────────────────────────────
//
// LO QUE ESTE COMPONENTE NO HACE, Y ES LO IMPORTANTE:
//
//   No filtra. `filtrarAtletas` ya existía en `services/consultas.ts`, probada,
//   y la página ya la llamaba con los `searchParams`. Lo único que faltaba era
//   la superficie para fijarlos: hasta ahora había que escribir la URL a mano.
//
// Es un `<form method="get">` que apunta a la propia ruta. Esa elección tiene
// consecuencias buenas y deliberadas:
//
//   · Funciona sin JavaScript. Un Server Component lee `searchParams` y ya
//     está: no hace falta hidratar nada para buscar.
//   · No duplica estado. La URL es la única fuente, así que el filtro es
//     compartible, marcable y sobrevive a una recarga.
//   · Es determinista. Sin `useState`, sin `useEffect`, sin carrera entre lo
//     que se teclea y lo que se navega.
//
// Los `defaultValue` vienen de la propia URL, de modo que al recargar la página
// los controles muestran lo que está aplicado y no un formulario en blanco que
// contradiga la lista de abajo.

interface Props {
  /** Lo aplicado ahora mismo, leído de la URL por la página. */
  valores: { q?: string; estado?: string; deporte?: string };
  /**
   * Deportes presentes entre los atletas del profesional.
   *
   * Salen de `deportesDisponibles()`, no de una lista fija: ofrecer un deporte
   * que nadie practica daría un filtro que siempre devuelve vacío.
   */
  deportes: readonly string[];
  /** Cuántos atletas hay en total, antes de filtrar. */
  total: number;
  /** Cuántos quedan tras aplicar los filtros. */
  visibles: number;
}

const ESTADOS: readonly { valor: EstadoAtleta | ""; etiqueta: string }[] = [
  { valor: "", etiqueta: "Activos y archivados" },
  { valor: "activo", etiqueta: "Solo activos" },
  { valor: "archivado", etiqueta: "Solo archivados" },
];

/** Clase compartida con los demás desplegables del Workspace. */
const SELECT =
  "h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500/40 [color-scheme:dark]";

export default function FiltrosAtletas({ valores, deportes, total, visibles }: Props) {
  const hayFiltro = Boolean(valores.q || valores.estado || valores.deporte);

  return (
    <form method="get" className="space-y-3" role="search" aria-label="Buscar atletas">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block lg:col-span-2">
          <span className="mb-1 block text-xs font-semibold text-white/60">Buscar</span>
          <Input
            type="search"
            name="q"
            defaultValue={valores.q ?? ""}
            placeholder="Nombre, documento o código interno"
            maxLength={120}
          />
        </label>

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
          <span className="mb-1 block text-xs font-semibold text-white/60">Deporte</span>
          <select
            name="deporte"
            defaultValue={valores.deporte ?? ""}
            className={SELECT}
            disabled={deportes.length === 0}
          >
            <option value="" className="bg-slate-900 text-white">
              {deportes.length === 0 ? "Ninguno declarado" : "Todos"}
            </option>
            {deportes.map((d) => (
              <option key={d} value={d} className="bg-slate-900 text-white">
                {d}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">Aplicar</Button>

        {/* Un enlace, no un botón: limpiar es navegar a la ruta sin parámetros.
            `Link` en vez de `<a>` para que la navegación sea del enrutador y no
            una recarga completa — el resto del formulario sí funciona sin
            JavaScript, pero esto no tiene por qué costar una recarga. */}
        {hayFiltro ? (
          <Link
            href="/app/rendimiento"
            className="text-sm text-white/50 underline-offset-4 hover:underline"
          >
            Quitar filtros
          </Link>
        ) : null}

        {/* El recuento se anuncia: quien usa lector de pantalla necesita saber
            que la lista cambió, y el número es la única señal de que lo hizo. */}
        <p className="text-[11px] text-white/40" aria-live="polite">
          {hayFiltro
            ? `${visibles} de ${total} atletas coinciden`
            : `${total} ${total === 1 ? "atleta" : "atletas"}`}
        </p>
      </div>
    </form>
  );
}
