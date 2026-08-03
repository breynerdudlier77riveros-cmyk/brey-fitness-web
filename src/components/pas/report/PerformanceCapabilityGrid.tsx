import Badge from "@/components/brand/Badge";
import { ETIQUETA_ESTADO, ETIQUETA_NIVEL } from "@/lib/pas/report";
import type { FilaCapacidad } from "@/lib/pas/report";

// ── Rejilla de capacidades (Sprint PAS-5.0) ────────────────────────────────
// Tabla real, no una cuadrícula de <div>: es información tabular y un lector
// de pantalla debe poder recorrerla por filas y columnas. Se acompaña de un
// resumen `sr-only` que describe la tabla antes de entrar en ella.
//
// El color del estado es informativo, nunca valorativo: «desconocida» no se
// pinta en rojo porque no es un error del atleta, es una ausencia de dato.

interface Props {
  capacidades: readonly FilaCapacidad[];
  /** Rótulo accesible de la tabla. */
  titulo: string;
}

const TONO: Record<string, "success" | "neutral" | "crudo" | "fabricante"> = {
  evaluada: "success",
  parcialmente_evaluada: "crudo",
  desactualizada: "fabricante",
  en_conflicto: "fabricante",
  desconocida: "neutral",
};

export default function PerformanceCapabilityGrid({ capacidades, titulo }: Props) {
  if (capacidades.length === 0) {
    return <p className="text-sm text-white/50">Ninguna capacidad en este grupo.</p>;
  }

  return (
    <div className="prs-tabla">
      <p className="sr-only">
        {titulo}. Tabla de {capacidades.length} capacidades con cuatro columnas: capacidad, estado,
        cobertura de registros y nivel de evidencia.
      </p>

      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{titulo}</caption>
        <thead>
          <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
            <th scope="col" className="py-2 pr-3 font-semibold">Capacidad</th>
            <th scope="col" className="py-2 pr-3 font-semibold">Estado</th>
            <th scope="col" className="py-2 pr-3 font-semibold">Registros</th>
            <th scope="col" className="py-2 font-semibold">Evidencia</th>
          </tr>
        </thead>
        <tbody>
          {capacidades.map((fila) => (
            <tr
              key={fila.capacidad}
              data-capacidad={fila.capacidad}
              data-estado={fila.estado}
              className="prs-fila border-b border-white/5 align-top"
            >
              <th scope="row" className="py-2 pr-3 text-left font-medium">
                {fila.nombre}
                <span className="ml-1.5 text-[11px] font-normal text-white/40">
                  {fila.capacidad}
                </span>
              </th>

              <td className="py-2 pr-3">
                {fila.reservada ? (
                  <Badge variant="neutral" className="px-2 py-0.5 text-[10px]">
                    Fuera de alcance
                  </Badge>
                ) : (
                  <Badge variant={TONO[fila.estado] ?? "neutral"} className="px-2 py-0.5 text-[10px]">
                    {ETIQUETA_ESTADO[fila.estado] ?? fila.estado}
                  </Badge>
                )}
              </td>

              <td className="py-2 pr-3 tabular-nums text-white/60">
                {fila.registrosElegibles}
                {fila.ultimaFecha ? (
                  <span className="ml-1.5 text-[11px] text-white/40">{fila.ultimaFecha}</span>
                ) : null}
              </td>

              <td className="py-2 text-white/60">{ETIQUETA_NIVEL[fila.nivel]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
