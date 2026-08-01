import type { ComponentType } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import { Check, Bolt, Lock, Clock } from "@/components/brand/icons";

// ── Módulos futuros (Sprint I-02) ───────────────────────────────────────────
// Estático — sin repositorio, sin decisión de negocio, cada estado está
// verificado contra el código real (no contra lo que documenta un handbook,
// que puede estar desactualizado frente a lo que ya existe en disco). Estilo
// propio por estado en vez de nuevas variantes en brand/Badge.tsx: esas 5
// variantes extra ya están reservadas para la procedencia del BCS Design
// Handbook (un color, un significado) — mismo criterio que cardStyles o el
// color por ítem de CalendarioGrid para lo que no encaja en un enum fijo.

export type ModuleStatus = "disponible" | "en_desarrollo" | "bloqueado" | "proximamente";

export interface ModuleStatusItem {
  nombre: string;
  estado: ModuleStatus;
  descripcion: string;
}

interface EstadoEstilo {
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  className: string;
}

const ESTADO_ESTILO: Record<ModuleStatus, EstadoEstilo> = {
  disponible: {
    label: "Disponible",
    icon: Check,
    className: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  },
  en_desarrollo: {
    label: "En desarrollo",
    icon: Bolt,
    className: "border-orange-500/25 bg-orange-500/10 text-orange-400",
  },
  bloqueado: {
    label: "Bloqueado",
    icon: Lock,
    className: "border-white/15 bg-white/[0.04] text-white/50",
  },
  proximamente: {
    label: "Próximamente",
    icon: Clock,
    className: "border-white/15 bg-white/[0.04] text-white/50",
  },
};

const MODULOS_DEFAULT: ModuleStatusItem[] = [
  {
    nombre: "Entrenamiento",
    estado: "en_desarrollo",
    descripcion: "Calendario y registro de sesiones ya funcionan; la generación automática de tu plan semanal está en construcción.",
  },
  {
    nombre: "Progresión",
    estado: "en_desarrollo",
    descripcion: "El motor de progresión ya existe; falta conectar la generación automática de tu próxima semana.",
  },
  {
    nombre: "Recuperación",
    estado: "bloqueado",
    descripcion: "Aún no tiene especificación propia — en diseño.",
  },
  {
    nombre: "Nutrición",
    estado: "proximamente",
    descripcion: "Todavía no está en desarrollo.",
  },
  {
    nombre: "Analíticas",
    estado: "proximamente",
    descripcion: "Todavía no está en desarrollo.",
  },
];

interface Props {
  modulos?: ModuleStatusItem[];
}

export default function ModuleStatusCard({ modulos = MODULOS_DEFAULT }: Props) {
  return (
    <DashboardCard>
      <div className="space-y-1">
        {modulos.map((modulo) => {
          const estilo = ESTADO_ESTILO[modulo.estado];
          const Icon = estilo.icon;
          return (
            <div
              key={modulo.nombre}
              className="flex items-center gap-3 py-2.5 border-b border-white/[0.05] last:border-0"
            >
              <div className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center flex-shrink-0">
                <Icon className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-bold">{modulo.nombre}</p>
                <p className="text-white/40 text-[11px] mt-0.5 leading-snug">{modulo.descripcion}</p>
              </div>
              <span
                className={`flex-shrink-0 inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${estilo.className}`}
              >
                {estilo.label}
              </span>
            </div>
          );
        })}
      </div>
    </DashboardCard>
  );
}
