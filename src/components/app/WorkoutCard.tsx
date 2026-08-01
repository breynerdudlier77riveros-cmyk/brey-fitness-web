import Link from "next/link";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { Bolt, ArrowRight } from "@/components/brand/icons";
import type { Workout } from "@/lib/types";

interface Props {
  workout: Workout | null;
}

export default function WorkoutCard({ workout }: Props) {
  if (!workout) {
    return (
      <DashboardCard className="h-full">
        <EmptyState
          icon={Bolt}
          title="Aún no tienes un entrenamiento programado"
          actionLabel="Ver calendario"
          actionHref="/app/entrenamientos/calendario"
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard className="h-full">
      <div className="flex items-center justify-between gap-4 mb-1">
        <p className="font-black text-white text-sm">{workout.nombre}</p>
        {workout.duracion_estimada_min && (
          <span className="text-white/50 text-xs flex-shrink-0">{workout.duracion_estimada_min} min</span>
        )}
      </div>
      {workout.semana && workout.semana_total && (
        <p className="text-white/50 text-xs mb-4">
          Semana {workout.semana} de {workout.semana_total}
        </p>
      )}
      <p className="text-white/40 text-xs mb-4">{workout.ejercicios.length} ejercicios planificados</p>
      <Link
        href="/app/entrenamientos/calendario"
        className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-bold hover:text-orange-300 transition-colors"
      >
        Ver calendario
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
      </Link>
    </DashboardCard>
  );
}
