import { TrendUp, TrendDown, TrendFlat } from "@/components/brand/icons";
import type { Delta } from "@/lib/bcs/reporte";

// ── BCS-C06 · Indicador de tendencia (BCS Design Handbook 06) ──────────────
// Ícono + texto corto SIEMPRE juntos — "nunca solo color, nunca solo ícono,
// nunca ↑/↓ sin el valor numérico del delta" (contraejemplo explícito).
// Colores: Emerald si la dirección coincide con "mejora"; Red si es
// "retroceso"; Neutral si Peso/IMC (u otra variable) sin dirección
// asignada, o si el cambio es insignificante.

const ESTILOS: Record<Delta["tipo"], { color: string; Icon: typeof TrendUp }> = {
  positivo: { color: "text-emerald-400", Icon: TrendUp },
  negativo: { color: "text-red-400", Icon: TrendDown },
  insignificante: { color: "text-white/50", Icon: TrendFlat },
  sin_direccion: { color: "text-white/50", Icon: TrendFlat },
};

interface Props {
  delta: Delta;
  unidad: string;
  className?: string;
}

export default function TrendIndicator({ delta, unidad, className }: Props) {
  const { color, Icon } = ESTILOS[delta.tipo];
  const signo = delta.absoluto > 0 ? "+" : delta.absoluto < 0 ? "−" : "";
  const texto = `${signo}${Math.abs(delta.absoluto).toFixed(1)}${unidad ? ` ${unidad}` : ""}`;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold tabular-nums ${color} ${className ?? ""}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.25} />
      {texto}
    </span>
  );
}
