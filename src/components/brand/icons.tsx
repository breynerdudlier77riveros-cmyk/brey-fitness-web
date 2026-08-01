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

/** Chevron hacia la izquierda — enlaces "volver". */
export function ArrowLeft(props: IconProps) {
  return <StrokeIcon d="m15.75 19.5-7.5-7.5 7.5-7.5" {...props} />;
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

/** Diana — paso "Objetivo" del flujo del Diagnóstico. */
export function Target({ className = "w-4 h-4", strokeWidth = 1.75 }: IconProps) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Reloj — paso "Tiempo disponible" del flujo del Diagnóstico. */
export function Clock(props: IconProps) {
  return <StrokeIcon d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" {...props} />;
}

/** Pausa — ProgramCard, estado en_pausa de la FSM del Motor BPS. */
export function Pause(props: IconProps) {
  return <StrokeIcon d="M15.75 5.25v13.5m-7.5-13.5v13.5" {...props} />;
}

/** Llama — calculadora de calorías (TDEE). */
export function Flame(props: IconProps) {
  return (
    <StrokeIcon
      d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
      {...props}
    />
  );
}

/** Corazón — calculadora de frecuencia cardíaca. */
export function Heart(props: IconProps) {
  return (
    <StrokeIcon
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      {...props}
    />
  );
}

/** Ojo — mostrar contraseña. */
export function Eye(props: IconProps) {
  return (
    <StrokeIcon
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      {...props}
    />
  );
}

/** Ojo tachado — ocultar contraseña. */
export function EyeOff(props: IconProps) {
  return (
    <StrokeIcon
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
      {...props}
    />
  );
}

/** Libro abierto — Biblioteca. */
export function Book(props: IconProps) {
  return (
    <StrokeIcon
      d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      {...props}
    />
  );
}

/** Engranaje — Configuración. */
export function Settings(props: IconProps) {
  return (
    <StrokeIcon
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      {...props}
    />
  );
}

/** Lupa — buscador (placeholder, sin funcionalidad todavía). */
export function Search(props: IconProps) {
  return (
    <StrokeIcon
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      {...props}
    />
  );
}

/** Campana — notificaciones (placeholder, sin funcionalidad todavía). */
export function Bell(props: IconProps) {
  return (
    <StrokeIcon
      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
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

/** Arco de carga — aplicar `animate-spin` en el call site (PerfilForm, botón Guardar). */
export function Spinner(props: IconProps) {
  return <StrokeIcon d="M12 3a9 9 0 1 0 9 9" {...props} />;
}

/** Báscula — identidad del BCS (Composición Corporal) en el Sidebar. */
export function Scale(props: IconProps) {
  return (
    <StrokeIcon
      d="M12 3v18m0-18a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM4.5 9h3l-3 8.25a4.5 4.5 0 0 0 6 0L7.5 9m9 0h3L16.5 17.25a4.5 4.5 0 0 0 6 0L19.5 9"
      {...props}
    />
  );
}

/** Triángulo de advertencia — Warning Card (BCS-C04), valor sospechoso. */
export function AlertTriangle(props: IconProps) {
  return (
    <StrokeIcon
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
      {...props}
    />
  );
}

/** Ícono "i" en círculo — Info Card (BCS-C05), aviso poblacional. */
export function InfoIcon(props: IconProps) {
  return (
    <StrokeIcon
      d="M11.25 11.25h1.5v5.25m-1.5 0h3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
      {...props}
    />
  );
}

/** Flecha diagonal ascendente — Indicador de tendencia (BCS-C06), mejora. */
export function TrendUp(props: IconProps) {
  return <StrokeIcon d="m2.25 18 6.47-6.47a.75.75 0 0 1 1.06 0L12.5 14.25l8.25-8.25M15.75 6h5.25v5.25" {...props} />;
}

/** Flecha diagonal descendente — Indicador de tendencia (BCS-C06), retroceso. */
export function TrendDown(props: IconProps) {
  return <StrokeIcon d="m2.25 6 6.47 6.47a.75.75 0 0 0 1.06 0l2.72-2.72 8.25 8.25M15.75 18h5.25v-5.25" {...props} />;
}

/** Flecha horizontal — Indicador de tendencia (BCS-C06), cambio insignificante o sin dirección. */
export function TrendFlat(props: IconProps) {
  return <StrokeIcon d="M4.5 12h15m0 0-5.25-5.25M19.5 12l-5.25 5.25" {...props} />;
}

/** Eslabón de cadena — copiar / generar EnlacePúblico (BCS). */
export function LinkIcon(props: IconProps) {
  return (
    <StrokeIcon
      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
      {...props}
    />
  );
}

/** Dos rectángulos superpuestos — copiar al portapapeles. */
export function Copy(props: IconProps) {
  return (
    <StrokeIcon
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
      {...props}
    />
  );
}

/** Bote de basura — eliminar permanentemente (acción terciaria, irreversible). */
export function Trash(props: IconProps) {
  return (
    <StrokeIcon
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      {...props}
    />
  );
}

/** Flecha hacia abajo con bandeja — descargar / exportar PDF. */
export function Download(props: IconProps) {
  return (
    <StrokeIcon
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      {...props}
    />
  );
}

/** Impresora — imprimir el Reporte. */
export function Printer(props: IconProps) {
  return (
    <StrokeIcon
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0M6.72 13.829v-4.66c0-1.088.717-2.05 1.76-2.311a43.98 43.98 0 0 1 7.04 0c1.043.261 1.76 1.223 1.76 2.31v4.661M6.72 13.829a42.652 42.652 0 0 0-4.474.643 39.365 39.365 0 0 1-.14-2.53l.001-.098c.024-1.07.774-1.986 1.816-2.201a43.223 43.223 0 0 1 1.317-.242M17.28 13.829a42.652 42.652 0 0 1 4.474.643 39.365 39.365 0 0 0 .14-2.53v-.098c-.024-1.07-.774-1.986-1.816-2.201a43.223 43.223 0 0 0-1.317-.242m-1.48 8.958H18a2.25 2.25 0 0 0 2.25-2.25v-.443M6.72 20.66H6a2.25 2.25 0 0 1-2.25-2.25v-.443m15 .443v-.443c0-.492-.184-.94-.487-1.28m-14.026 1.28c0-.492.184-.94.487-1.28M9 12.75h6M9 16.5h6"
      {...props}
    />
  );
}

/** Wifi tachado — estado Offline / sin conexión. */
export function WifiOff(props: IconProps) {
  return (
    <StrokeIcon
      d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 18.75h.008v.008H12v-.008ZM3 3l18 18"
      {...props}
    />
  );
}

/** Cámara — galería de fotografías de progreso. */
export function Camera(props: IconProps) {
  return (
    <StrokeIcon
      d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-4.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316ZM16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
      {...props}
    />
  );
}
