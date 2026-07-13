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

/** Más — expandir (rota 45° a "×" al abrir, ver brand/Accordion.tsx). */
export function Plus(props: IconProps) {
  return <StrokeIcon d="M12 4.5v15m7.5-7.5h-15" {...props} />;
}

/** Signo de pregunta — pasos de "Pregunta" en el flujo del Diagnóstico. */
export function HelpCircle(props: IconProps) {
  return (
    <StrokeIcon
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
      {...props}
    />
  );
}

/** Barras — el paso "Resultado" del Diagnóstico (análisis de respuestas). */
export function ChartBar(props: IconProps) {
  return (
    <StrokeIcon
      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
      {...props}
    />
  );
}

/** Bandera — el paso "Sistema recomendado", destino del flujo del Diagnóstico. */
export function Flag(props: IconProps) {
  return (
    <StrokeIcon
      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
      {...props}
    />
  );
}

/** Rayo — identidad del Sistema de Fuerza (potencia). */
export function Bolt(props: IconProps) {
  return <StrokeIcon d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" {...props} />;
}

/** Tendencia ascendente — identidad del Sistema de Hipertrofia (crecimiento). */
export function TrendingUp(props: IconProps) {
  return (
    <StrokeIcon
      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
      {...props}
    />
  );
}

/** Ciclo — identidad del Sistema de Calistenia (progresiones continuas). */
export function Cycle(props: IconProps) {
  return (
    <StrokeIcon
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      {...props}
    />
  );
}

/** Estrella — identidad del Sistema Elite (nivel máximo). */
export function Star(props: IconProps) {
  return (
    <StrokeIcon
      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      {...props}
    />
  );
}

/** Dos círculos superpuestos — identidad del Sistema Híbrido (unir dos disciplinas). */
export function Merge({ className = "w-4 h-4", strokeWidth = 1.75 }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="9" cy="12" r="6.25" />
      <circle cx="15" cy="12" r="6.25" />
    </svg>
  );
}

/** Calendario — identidad del principio Periodización. */
export function Calendar(props: IconProps) {
  return (
    <StrokeIcon
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
      {...props}
    />
  );
}

/** Persona — identidad del principio Adaptación individual. */
export function UserIcon(props: IconProps) {
  return (
    <StrokeIcon
      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      {...props}
    />
  );
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
