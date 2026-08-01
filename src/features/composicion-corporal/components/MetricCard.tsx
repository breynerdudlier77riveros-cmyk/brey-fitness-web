import { Card } from "@/components/brand/Card";
import TrendIndicator from "@/features/composicion-corporal/components/TrendIndicator";
import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import type { Delta, Procedencia } from "@/lib/bcs/reporte";

// ── BCS-C01 · Metric Card (BCS Design Handbook 06) ─────────────────────────
// "Card heredado + valor en tabular figures + badge de tendencia (BCS-C06) +
// badge de procedencia". Solo lectura — usa cardStyles.base, NUNCA
// .interactive (contraejemplo explícito: no es clicable). role="group" con
// aria-label describiendo la métrica completa (Accesibilidad 15).

interface Props {
  etiqueta: string;
  valor: number;
  unidad: string;
  procedencia: Procedencia;
  delta?: Delta;
  clasificacionEtiqueta?: string;
}

export default function MetricCard({ etiqueta, valor, unidad, procedencia, delta, clasificacionEtiqueta }: Props) {
  const valorTexto = `${valor.toFixed(1)}${unidad ? ` ${unidad}` : ""}`;
  const deltaTexto = delta
    ? `, ${delta.absoluto > 0 ? "subió" : delta.absoluto < 0 ? "bajó" : "sin cambio de"} ${Math.abs(delta.absoluto).toFixed(1)}${unidad ? ` ${unidad}` : ""}`
    : "";
  const ariaLabel = `${etiqueta}: ${valorTexto}${deltaTexto}`;

  return (
    <Card role="group" aria-label={ariaLabel} className="p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50">{etiqueta}</p>
        <ProcedenciaBadge procedencia={procedencia} />
      </div>
      <p className="font-black text-2xl text-white tabular-nums">{valorTexto}</p>
      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {delta && <TrendIndicator delta={delta} unidad={unidad} />}
        {clasificacionEtiqueta && (
          <span className="text-[11px] font-semibold text-white/60">{clasificacionEtiqueta}</span>
        )}
      </div>
    </Card>
  );
}
