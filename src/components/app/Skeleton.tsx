// ── Primitivas de esqueleto (Sprint I-02) ───────────────────────────────────
// Extraídas de las Bar/CardSkeleton privadas que app/loading.tsx ya definía
// inline, para que cada loading.tsx nuevo (perfil, progreso, sistema,
// entrenamientos/*, configuracion) use exactamente el mismo lenguaje visual
// en vez de reinventar sus propios divs animate-pulse. .bcs-skeleton (otro
// sistema, con su propio keyframe en globals.css) se queda exclusivo de
// Composición Corporal — no se toca ni se generaliza aquí.

interface BarProps {
  className?: string;
}

export function SkeletonBar({ className = "" }: BarProps) {
  return (
    <div className={`rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none ${className}`} />
  );
}

interface BlockProps {
  className?: string;
}

export function SkeletonBlock({ className = "" }: BlockProps) {
  return (
    <div className={`rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-7 ${className}`} />
  );
}
