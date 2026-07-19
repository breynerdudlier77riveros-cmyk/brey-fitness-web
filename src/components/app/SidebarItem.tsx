"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/brand/Tooltip";
import { useSidebarCollapse } from "@/components/app/AppShell";

interface Props {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  active: boolean;
  onNavigate?: () => void;
}

// Colapsado: solo ícono + Tooltip con el label — reutiliza el primitivo
// brand/Tooltip.tsx, que ya está montado globalmente (TooltipProvider en
// layout.tsx raíz) y hasta ahora no tenía ningún call site real.
export default function SidebarItem({ href, label, icon: Icon, active, onNavigate }: Props) {
  const { collapsed } = useSidebarCollapse();

  const link = (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
        collapsed ? "justify-center px-0 py-2.5 w-10 h-10" : "px-3 py-2.5"
      } ${
        active
          ? "bg-orange-500/[0.08] text-orange-400 border-orange-500/20"
          : "text-white/55 border-transparent hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
      {!collapsed && label}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
