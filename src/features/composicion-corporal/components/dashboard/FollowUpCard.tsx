import FollowUpTimeline from "./FollowUpTimeline";
import type { FilaSeguimiento } from "@/lib/bcs/dashboard";

// ── Tarjeta de seguimiento (zona 4) ────────────────────────────────────────
// Envuelve la línea de tiempo con el recuento y la nota de alcance. La nota
// es obligatoria: sin ella, una lista ordenada por antigüedad se lee como una
// lista de prioridad, que es justo lo que el sistema no puede establecer.

interface Props {
  filas: FilaSeguimiento[];
  limite?: number;
}

export default function FollowUpCard({ filas, limite = 10 }: Props) {
  const sinMediciones = filas.filter((f) => f.diasSinMedicion === null).length;

  return (
    <div>
      <p className="text-xs text-white/45 mb-3">
        {filas.length} {filas.length === 1 ? "cliente" : "clientes"}, ordenados por antigüedad de su
        última medición
        {sinMediciones > 0 && ` · ${sinMediciones} sin ninguna medición`}.
      </p>

      <FollowUpTimeline filas={filas} limite={limite} />

      <p className="text-[10px] text-white/30 mt-3 leading-relaxed">
        El sistema muestra el tiempo transcurrido. No establece cada cuánto repetir una medición:
        ninguna fuente del ecosistema documenta una periodicidad.
      </p>
    </div>
  );
}
