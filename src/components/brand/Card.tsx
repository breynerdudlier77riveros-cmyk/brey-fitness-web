// ── Tarjeta del sistema ─────────────────────────────────────────────────────
// La superficie base de toda la plataforma. `interactive` añade el estado
// hover estándar. Para tarjetas que son <Link>, compón con `cardStyles`.

export const cardStyles = {
  base: "rounded-2xl border border-white/[0.07] bg-white/[0.02]",
  interactive:
    "hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-300",
} as const;

interface Props {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
}

export default function Card({ children, interactive = false, className = "" }: Props) {
  return (
    <div
      className={[cardStyles.base, interactive ? cardStyles.interactive : "", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
