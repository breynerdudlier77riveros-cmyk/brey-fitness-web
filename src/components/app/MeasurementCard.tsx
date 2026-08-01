import Link from "next/link";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { Scale, ArrowRight } from "@/components/brand/icons";

// ── Resumen de Composición Corporal (Sprint I-02) ───────────────────────────
// BCS (bcs_clientes/bcs_mediciones) es al usuario logueado actuando como
// entrenador, con SU roster de clientes presenciales — no existe ningún
// concepto de "mis propias mediciones" en el esquema. Esta tarjeta resume esa
// actividad propia (conteo de clientes activos) y enlaza al feature ya
// construido, sin cruzar el límite de contexto (Core Training nunca depende
// de BCS): es una lectura de Presentación, igual que la que ya hace
// composicion-corporal/DashboardClient.tsx en su propio KPI.

interface Props {
  totalClientesActivos: number;
}

export default function MeasurementCard({ totalClientesActivos }: Props) {
  if (totalClientesActivos === 0) {
    return (
      <DashboardCard className="h-full">
        <EmptyState
          icon={Scale}
          title="Aún no tienes clientes en Composición Corporal"
          description="Registra tu primer cliente para llevar el seguimiento de sus mediciones."
          actionLabel="Ir a Composición Corporal"
          actionHref="/app/composicion-corporal"
        />
      </DashboardCard>
    );
  }

  return (
    <Link href="/app/composicion-corporal" className="block group h-full">
      <DashboardCard interactive className="h-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-2">
              Composición Corporal
            </p>
            <p className="font-black text-2xl text-white tabular-nums">{totalClientesActivos}</p>
            <p className="text-white/50 text-xs mt-1">
              {totalClientesActivos === 1 ? "cliente activo" : "clientes activos"}
            </p>
          </div>
          <ArrowRight
            className="w-4 h-4 text-white/30 group-hover:text-orange-400 transition-colors flex-shrink-0"
            strokeWidth={2.5}
          />
        </div>
      </DashboardCard>
    </Link>
  );
}
