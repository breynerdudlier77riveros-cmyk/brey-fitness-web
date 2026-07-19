import type { ComponentType } from "react";
import Button from "@/components/brand/Button";

// ── Estado vacío honesto — el componente más reutilizado de /app ───────────
// Reemplaza los datos simulados de mockDashboard.ts: cuando una tabla real
// (workouts, workout_logs, profiles.sistema_actual) no tiene filas para el
// usuario, esto es lo que se muestra — nunca un número inventado.

interface Props {
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      <div className="w-11 h-11 rounded-2xl border border-white/[0.10] bg-white/[0.03] flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-white/40" strokeWidth={1.75} />
      </div>
      <p className="font-bold text-white text-sm mb-1">{title}</p>
      {description && (
        <p className="text-white/50 text-xs leading-relaxed max-w-xs mb-5">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Button href={actionHref} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
