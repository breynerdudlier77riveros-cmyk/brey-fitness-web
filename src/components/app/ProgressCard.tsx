import Link from "next/link";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { TrendingUp, ArrowRight, TrendUp, TrendDown, TrendFlat } from "@/components/brand/icons";

interface Props {
  semanaActualKg: number;
  semanaAnteriorKg: number;
  entrenamientosCompletados: number;
}

export default function ProgressCard({
  semanaActualKg,
  semanaAnteriorKg,
  entrenamientosCompletados,
}: Props) {
  if (entrenamientosCompletados === 0) {
    return (
      <DashboardCard className="h-full">
        <EmptyState
          icon={TrendingUp}
          title="Aún no hay actividad reciente"
          actionLabel="Ver Progreso"
          actionHref="/app/progreso"
        />
      </DashboardCard>
    );
  }

  const delta = semanaAnteriorKg > 0 ? ((semanaActualKg - semanaAnteriorKg) / semanaAnteriorKg) * 100 : null;
  const plano = delta === null || Math.abs(delta) < 1;
  const TrendIcon = plano ? TrendFlat : delta! > 0 ? TrendUp : TrendDown;
  const trendColor = plano ? "text-white/40" : delta! > 0 ? "text-emerald-400" : "text-red-400";

  return (
    <DashboardCard className="h-full">
      <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-2">
        Últimos 14 días
      </p>
      <div className="flex items-end justify-between gap-3 mb-4">
        <div>
          <p className="font-black text-2xl text-white tabular-nums">{entrenamientosCompletados}</p>
          <p className="text-white/50 text-xs mt-1">entrenamientos completados</p>
        </div>
        {delta !== null && (
          <div className={`flex items-center gap-1 text-xs font-bold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" strokeWidth={2} />
            {Math.abs(delta).toFixed(0)}%
          </div>
        )}
      </div>
      <Link
        href="/app/progreso"
        className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold hover:text-orange-300 transition-colors"
      >
        Ver Progreso
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
      </Link>
    </DashboardCard>
  );
}
