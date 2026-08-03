import Link from "next/link";
import Badge from "@/components/brand/Badge";
import { ETIQUETA_ESTADO_ATLETA } from "../schemas/estados";
import type { Atleta } from "../schemas/tipos";

// ── Tarjeta de atleta (Sprint PAS-7.0) ─────────────────────────────────────
// Muestra lo registrado. No deriva nada: los recuentos de evaluaciones llegan
// resueltos desde el Server Component que la usa.

interface Props {
  atleta: Atleta;
  evaluaciones?: number;
}

export default function AtletaCard({ atleta, evaluaciones }: Props) {
  return (
    <Link
      href={`/app/rendimiento/${atleta.id}`}
      className="block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{atleta.nombre}</h3>
          <p className="mt-0.5 truncate text-xs text-white/50">
            {[atleta.deporte, atleta.codigoInterno, atleta.documento]
              .filter(Boolean)
              .join(" · ") || "Sin datos adicionales"}
          </p>
        </div>

        <Badge
          variant={atleta.estado === "activo" ? "success" : "neutral"}
          className="shrink-0 px-2 py-0.5 text-[10px]"
        >
          {ETIQUETA_ESTADO_ATLETA[atleta.estado]}
        </Badge>
      </div>

      {evaluaciones !== undefined ? (
        <p className="mt-3 text-xs text-white/40">
          {evaluaciones === 0
            ? "Sin evaluaciones registradas"
            : `${evaluaciones} ${evaluaciones === 1 ? "evaluación" : "evaluaciones"}`}
        </p>
      ) : null}
    </Link>
  );
}
