import Link from "next/link";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/brand/Badge";
import { Flag, ArrowRight } from "@/components/brand/icons";
import { getSistemaBySlug } from "@/data/sistemas";
import type { Diagnostico } from "@/lib/diagnostico/tipos";

interface Props {
  diagnostico: Diagnostico | null;
}

export default function DiagnosisCard({ diagnostico }: Props) {
  if (!diagnostico) {
    return (
      <DashboardCard className="h-full">
        <EmptyState
          icon={Flag}
          title="Aún no tienes un Diagnóstico"
          description="El Diagnóstico BPS analiza tu nivel y objetivo para recomendarte el Sistema correcto."
          actionLabel="Realizar Diagnóstico BPS"
          actionHref="/diagnostico"
        />
      </DashboardCard>
    );
  }

  const sistema = getSistemaBySlug(diagnostico.sistema_recomendado);
  const fecha = new Date(diagnostico.created_at).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <p className="text-white/50 text-xs">Diagnóstico del {fecha}</p>
        {!diagnostico.disponible && <Badge variant="neutral">Lista de espera</Badge>}
      </div>
      <p className="font-black text-white text-sm mb-1">
        {sistema?.nombre ?? diagnostico.sistema_recomendado}
      </p>
      {diagnostico.razones[0] && (
        <p className="text-white/50 text-xs leading-relaxed mb-4">{diagnostico.razones[0]}</p>
      )}
      <Link
        href="/app/sistema"
        className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold hover:text-orange-300 transition-colors"
      >
        Ver Mi Sistema
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
      </Link>
    </DashboardCard>
  );
}
