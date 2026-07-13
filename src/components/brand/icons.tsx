// ── Iconos del sistema ──────────────────────────────────────────────────────
// Fuente única para los iconos de trazo (Heroicons outline). Ley 7 de la
// Constitución de Diseño: primitivas antes que páginas — nunca SVG inline.

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

function StrokeIcon({
  d,
  className = "w-4 h-4",
  strokeWidth = 2.5,
}: IconProps & { d: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/** Chevron hacia la derecha — enlaces y CTAs. */
export function ArrowRight(props: IconProps) {
  return <StrokeIcon d="m8.25 4.5 7.5 7.5-7.5 7.5" {...props} />;
}

/** Flecha larga hacia la derecha — botón de compra. */
export function ArrowLong(props: IconProps) {
  return <StrokeIcon d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" {...props} />;
}

/** Check — estados de éxito y listas de incluidos. */
export function Check(props: IconProps) {
  return <StrokeIcon d="M4.5 12.75l6 6 9-13.5" {...props} />;
}

/** X — cerrar y listas de errores/problemas. */
export function Close(props: IconProps) {
  return <StrokeIcon d="M6 18L18 6M6 6l12 12" {...props} />;
}

/** Hamburguesa — menú móvil. */
export function Menu(props: IconProps) {
  return <StrokeIcon d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" {...props} />;
}

/** Candado — señal de pago seguro. */
export function Lock(props: IconProps) {
  return (
    <StrokeIcon
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      {...props}
    />
  );
}
