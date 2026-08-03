import Link from "next/link";
import Badge from "@/components/brand/Badge";
import { ETIQUETA_ESTADO_EVALUACION } from "../schemas/estados";
import type { EntradaHistorial } from "../schemas/tipos";

// ── Historial cronológico (Sprint PAS-7.0) ─────────────────────────────────
// Tabla real: es información tabular y un lector de pantalla debe recorrerla
// por filas y columnas. Los recuentos llegan YA resueltos — este componente no
// recorre registros ni deriva capacidades.

interface Props {
  entradas: readonly EntradaHistorial[];
}

const TONO: Record<string, "success" | "neutral" | "crudo" | "fabricante"> = {
  completada: "success",
  compartida: "crudo",
  borrador: "neutral",
  archivada: "neutral",
  anulada: "fabricante",
};

export default function HistorialEvaluaciones({ entradas }: Props) {
  if (entradas.length === 0) {
    return (
      <p className="text-sm text-white/50">
        Este atleta todavía no tiene evaluaciones registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <p className="sr-only">
        Historial de {entradas.length} evaluaciones, de la más reciente a la más antigua, con
        fecha, tipo, estado, número de pruebas, número de capacidades y versión del sistema.
      </p>

      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Historial de evaluaciones</caption>
        <thead>
          <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
            <th scope="col" className="py-2 pr-3 font-semibold">Fecha</th>
            <th scope="col" className="py-2 pr-3 font-semibold">Tipo</th>
            <th scope="col" className="py-2 pr-3 font-semibold">Estado</th>
            <th scope="col" className="py-2 pr-3 font-semibold">Pruebas</th>
            <th scope="col" className="py-2 pr-3 font-semibold">Capacidades</th>
            <th scope="col" className="py-2 font-semibold">Versión</th>
          </tr>
        </thead>
        <tbody>
          {entradas.map((entrada) => (
            <tr
              key={entrada.evaluacionId}
              data-evaluacion={entrada.evaluacionId}
              className="border-b border-white/5"
            >
              <th scope="row" className="py-2 pr-3 text-left font-medium">
                <Link
                  href={`/app/rendimiento/evaluacion/${entrada.evaluacionId}`}
                  className="hover:underline"
                >
                  {entrada.fecha}
                </Link>
              </th>
              <td className="py-2 pr-3 text-white/60">{entrada.tipo}</td>
              <td className="py-2 pr-3">
                <Badge
                  variant={TONO[entrada.estado] ?? "neutral"}
                  className="px-2 py-0.5 text-[10px]"
                >
                  {ETIQUETA_ESTADO_EVALUACION[entrada.estado]}
                </Badge>
              </td>
              <td className="py-2 pr-3 tabular-nums text-white/60">{entrada.pruebas}</td>
              <td className="py-2 pr-3 tabular-nums text-white/60">{entrada.capacidades}</td>
              <td className="py-2 font-mono text-[11px] text-white/40">{entrada.versionPAS}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
