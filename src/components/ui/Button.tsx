import Link from "next/link";

// ── Botón del sistema ───────────────────────────────────────────────────────
// Ley 2 de la Constitución de Diseño: un color, un significado.
//   primary → naranja: acción de marca (navegar, diagnosticar, explorar)
//   buy     → esmeralda: exclusivamente dinero (checkout). Único con pulse.
//   outline → secundario neutro
// Renderiza <Link> si recibe href interno, <a> si es externo, <button> si no.

type Variant = "primary" | "buy" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white transition-colors duration-200 focus-visible:outline-orange-400",
  buy:
    "checkout-btn rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20 transition-colors duration-300 active:scale-[0.97] focus-visible:outline-emerald-400",
  outline:
    "rounded-full border border-white/[0.12] text-white/70 hover:text-white hover:border-white/25 transition-all duration-200 focus-visible:outline-white/60",
};

const sizes: Record<Size, string> = {
  sm: "gap-2 px-4 py-2 text-xs font-bold",
  md: "gap-2 px-6 py-3 text-sm font-bold",
  lg: "gap-3 px-8 py-4 text-base font-bold",
  xl: "gap-3 px-10 py-5 text-base font-black",
};

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: Props) {
  const classes = [
    "inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2",
    variants[variant],
    sizes[size],
    disabled ? "opacity-60 pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && /^https?:\/\//.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
