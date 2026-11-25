import Link from "next/link";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Botón del sistema (sobre la primitiva shadcn ui/button.tsx) ────────────
// Ley 2 de la Constitución de Diseño: un color, un significado.
//   primary → naranja: acción de marca (navegar, diagnosticar, explorar)
//   buy     → esmeralda: exclusivamente dinero (checkout). Único con pulse.
//   outline → secundario neutro
// Texto oscuro en primary/buy: el blanco da 2.89:1 sobre naranja-500 y
// 2.47:1 sobre esmeralda-500; WCAG AA pide 4.5:1. Con neutral-950 pasa de 7:1.
// Renderiza <Link> si recibe href interno, <a> si es externo, <button> si no.
//
// Usa variant="ghost" de shadcn como base neutra (sin color propio) y aporta
// el 100% del look de marca vía className — cn() (tailwind-merge) resuelve
// los conflictos de utilidades a favor de estas clases. h-auto neutraliza
// la altura fija (h-8/h-9) del primitivo para que la altura la siga
// determinando el padding vertical, como siempre.
//
// FOCO — identidad única en todo el sitio (ver también ui/*.tsx generados):
// el anillo de foco lo aporta SIEMPRE la primitiva shadcn subyacente
// (focus-visible:ring-ring, con --ring = naranja de marca en globals.css).
// Ningún wrapper de marca debe añadir su propio focus-visible:outline-* —
// eso fue lo que producía el doble anillo. Un solo tratamiento, un solo color,
// igual en Button/Input/Select/Checkbox/... sin importar la variante.
//
// MICROINTERACCIÓN — hover 1→1.03 / tap 0.98 (BREY v2.1), en CSS puro, no
// Motion: Button se usa docenas de veces por página; envolverlo en
// motion.create() lo convertiría en Client Component en todo el sitio para
// un efecto que transform+transition ya resuelve con GPU y sin JS. Motion
// se reserva para donde de verdad aporta (Hero, scroll-reveal, conteo de
// números). motion-reduce: cubre prefers-reduced-motion sin duplicar la
// media query ya centralizada para Motion en layout.tsx.

type Variant = "primary" | "buy" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "h-auto rounded-full font-display uppercase tracking-[0.06em] hover:scale-[1.03] active:scale-[0.98] motion-reduce:hover:scale-100 motion-reduce:active:scale-100";

// Transición solo de color y escala, nunca transition-all: animaría también el
// anillo de foco, que debe aparecer al instante al navegar con teclado.
const transicion = "transition-[background-color,color,scale]";

const variants: Record<Variant, string> = {
  primary: `rounded-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-neutral-950 ${transicion} duration-200`,
  buy: `checkout-btn rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-lg shadow-emerald-500/20 ${transicion} duration-300`,
  outline: `rounded-full border border-white/25 text-white hover:border-white hover:bg-white/[0.06] ${transicion} duration-200`,
};

// La condensada es más angosta y de ojo más pequeño que Inter: un punto más
// de tamaño por escalón mantiene el ancho y la legibilidad de antes.
const sizes: Record<Size, string> = {
  sm: "gap-2 px-4 py-2 text-sm font-bold",
  md: "gap-2 px-6 py-3 text-[15px] font-bold",
  lg: "gap-3 px-8 py-4 text-lg font-extrabold",
  xl: "gap-3 px-10 py-5 text-xl font-black",
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
  const classes = cn(
    "inline-flex items-center justify-center whitespace-nowrap",
    base,
    variants[variant],
    sizes[size],
    disabled && "opacity-60 pointer-events-none",
    className
  );

  if (href && /^https?:\/\//.test(href)) {
    return (
      <ShadcnButton asChild variant="ghost" className={classes}>
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
          {children}
        </a>
      </ShadcnButton>
    );
  }

  if (href) {
    return (
      <ShadcnButton asChild variant="ghost" className={classes}>
        <Link href={href} onClick={onClick}>
          {children}
        </Link>
      </ShadcnButton>
    );
  }

  return (
    <ShadcnButton
      variant="ghost"
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </ShadcnButton>
  );
}
