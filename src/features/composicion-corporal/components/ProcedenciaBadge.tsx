import Badge from "@/components/brand/Badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/brand/Tooltip";
import { PROCEDENCIA_INFO } from "@/features/composicion-corporal/procedencia";
import type { Procedencia } from "@/lib/bcs/reporte";

// ── Badge de procedencia — las 5 variantes obligatorias del BCS Handbook ───
// Nunca solo el emoji: el texto completo va siempre en un <span> con
// aria-label (lectores de pantalla) y en un Tooltip (hover/mantener
// presionado) — Design Handbook 15/18. En <360px el badge se reduce
// visualmente al emoji vía `hidden xs:inline` en el texto, pero el aria-label
// permanece siempre.

interface Props {
  procedencia: Procedencia;
  className?: string;
}

export default function ProcedenciaBadge({ procedencia, className }: Props) {
  const info = PROCEDENCIA_INFO[procedencia];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant={info.badgeVariant}
          className={`px-2 py-0.5 text-[10px] tracking-[0.04em] gap-1 ${className ?? ""}`}
          aria-label={info.etiqueta}
        >
          <span aria-hidden="true">{info.emoji}</span>
          <span className="hidden min-[420px]:inline">{info.etiqueta}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>{info.etiqueta}</TooltipContent>
    </Tooltip>
  );
}
