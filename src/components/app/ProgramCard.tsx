import type { ComponentType } from "react";
import DashboardCard from "@/components/app/DashboardCard";
import Badge from "@/components/brand/Badge";
import Button from "@/components/brand/Button";
import { Flag, Bolt, UserIcon, Pause, TrendingUp, Check } from "@/components/brand/icons";
import type { EstadoUsuarioBPS } from "@/lib/engines/bps/tipos";

// ── Estado del programa (Sprint I-02) ───────────────────────────────────────
// Solo consume el `EstadoUsuarioBPS` ya derivado por
// src/lib/ciclo/estado.ts::derivarEstadoBPS (capa Application) — este
// componente no decide nada, solo traduce cada uno de los 8 estados de la
// FSM a copy de usuario. Importar el TIPO desde lib/engines/bps/tipos está
// permitido explícitamente por la regla de capas ("Presentación puede
// depender de Dominio, solo tipos") — no es un import del motor en sí.

interface Props {
  estado: EstadoUsuarioBPS;
}

interface EstadoInfo {
  label: string;
  descripcion: string;
  tono: "success" | "neutral";
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  cta?: { label: string; href: string };
}

const ESTADO_INFO: Record<EstadoUsuarioBPS, EstadoInfo> = {
  sin_diagnostico: {
    label: "Sin diagnóstico",
    descripcion: "Aún no has hecho el Diagnóstico BPS.",
    tono: "neutral",
    icon: Flag,
    cta: { label: "Realizar Diagnóstico", href: "/diagnostico" },
  },
  pendiente_diagnostico: {
    label: "Diagnóstico pendiente",
    descripcion: "Tienes un Diagnóstico sin terminar.",
    tono: "neutral",
    icon: Flag,
    cta: { label: "Completar Diagnóstico", href: "/diagnostico" },
  },
  diagnosticado: {
    label: "Diagnóstico completado",
    descripcion: "Ya tienes un Sistema recomendado, a la espera de activación.",
    tono: "neutral",
    icon: Check,
    cta: { label: "Ver Mi Sistema", href: "/app/sistema" },
  },
  pendiente_perfil: {
    label: "Perfil pendiente",
    descripcion: "Completa tu perfil para activar tu Sistema.",
    tono: "neutral",
    icon: UserIcon,
    cta: { label: "Completar Perfil", href: "/app/perfil" },
  },
  activo: {
    label: "Programa activo",
    descripcion: "Tu Sistema está en marcha.",
    tono: "success",
    icon: Bolt,
    cta: { label: "Ver Entrenamientos", href: "/app/entrenamientos" },
  },
  en_descarga: {
    label: "Semana de descarga",
    descripcion: "Esta semana tu carga se reduce a propósito.",
    tono: "neutral",
    icon: TrendingUp,
  },
  en_pausa: {
    label: "En pausa",
    descripcion: "Tu programa está pausado por ahora.",
    tono: "neutral",
    icon: Pause,
  },
  sistema_completado: {
    label: "Sistema completado",
    descripcion: "Terminaste tu Sistema actual. ¡Felicidades!",
    tono: "success",
    icon: Check,
    cta: { label: "Ver otros Sistemas", href: "/sistemas" },
  },
};

export default function ProgramCard({ estado }: Props) {
  const info = ESTADO_INFO[estado];
  const Icon = info.icon;

  return (
    <DashboardCard>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-11 h-11 rounded-2xl border border-white/[0.10] bg-white/[0.03] flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white/60" strokeWidth={1.75} />
        </div>
        <Badge variant={info.tono}>{info.label}</Badge>
      </div>
      <p className="text-white/50 text-xs leading-relaxed mb-4">{info.descripcion}</p>
      {info.cta && (
        <Button href={info.cta.href} size="sm" variant="outline">
          {info.cta.label}
        </Button>
      )}
    </DashboardCard>
  );
}
