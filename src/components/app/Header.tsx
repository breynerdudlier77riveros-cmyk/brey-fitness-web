import { Search, Bell } from "@/components/brand/icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/brand/Tooltip";
import UserMenu from "@/components/layout/UserMenu";
import Breadcrumb from "@/components/app/Breadcrumb";
import type { NavUser } from "@/lib/supabase/user";

interface Props {
  user: NavUser;
}

// Solo desktop (hidden md:flex): en mobile, Sidebar.tsx ya tiene su propia
// barra superior compacta (logo + hamburguesa) — un segundo header apilado
// encima sería redundante en pantallas chicas.
//
// Buscador y notificaciones son placeholders a propósito, tal como se
// pidieron. aria-disabled, no disabled: disabled saca el control del tab
// order y un usuario de teclado nunca podría alcanzarlo para enterarse de
// que existe — con Tooltip (primitivo ya montado globalmente, sin call
// site real hasta ahora) mostrando "Próximamente" sí queda descubrible.
//
// UserMenu es el mismo componente que ya usa el Navbar de marketing — no
// se construye un "UserDropdown" nuevo: ya es exactamente eso (avatar +
// nombre + Mi Perfil + Dashboard + Cerrar sesión), ya vive en una carpeta
// compartida, y sus links internos siguen siendo correctos usado desde
// dentro de /app.
export default function Header({ user }: Props) {
  return (
    <header className="print:hidden sticky top-0 z-30 hidden md:flex items-center justify-between gap-4 h-16 px-6 border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-xl">
      <Breadcrumb />

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-disabled="true"
              aria-label="Buscar (próximamente)"
              className="p-2 rounded-lg text-white/40 hover:text-white/60 transition-colors cursor-not-allowed"
            >
              <Search className="w-4 h-4" strokeWidth={2} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Próximamente</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              aria-disabled="true"
              aria-label="Notificaciones (próximamente)"
              className="p-2 rounded-lg text-white/40 hover:text-white/60 transition-colors cursor-not-allowed"
            >
              <Bell className="w-4 h-4" strokeWidth={2} />
            </button>
          </TooltipTrigger>
          <TooltipContent>Próximamente</TooltipContent>
        </Tooltip>

        <div aria-hidden className="w-px h-5 bg-white/[0.08] mx-1.5" />

        <UserMenu user={user} />
      </div>
    </header>
  );
}
