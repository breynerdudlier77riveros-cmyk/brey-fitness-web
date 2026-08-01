import Link from "next/link";
import { Card } from "@/components/brand/Card";
import Badge from "@/components/brand/Badge";
import { LinkIcon } from "@/components/brand/icons";
import { iniciales } from "@/lib/utils";
import type { Cliente } from "@/lib/bcs/tipos";

// ── Tarjeta de Cliente — Dashboard del Entrenador (BCS Design Handbook 07) ──
// "History Card (BCS-C03), de cliente, no de medición" para la Zona 3 de
// recientes. El indicador de EnlacePúblico activo debe ser visible sin
// entrar a la ficha (07) — se pasa como prop ya resuelta por el caller
// (evita N+1: el Dashboard solo lo resuelve para los ≤6 clientes de la
// Zona 3, no para la lista paginada completa — ver informe del Sprint).

interface Props {
  cliente: Cliente;
  /** undefined = no resuelto para esta fila (lista paginada completa). */
  enlaceActivo?: boolean;
}

export default function ClienteCard({ cliente, enlaceActivo }: Props) {
  return (
    <Link href={`/app/composicion-corporal/${cliente.id}`}>
      <Card interactive className="p-4 h-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-[10px]">{iniciales(cliente.nombre)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white truncate">{cliente.nombre}</p>
            {cliente.estado === "archivado" && (
              <Badge variant="neutral" className="text-[9px] px-1.5 py-0 mt-0.5">
                Archivado
              </Badge>
            )}
          </div>
          {enlaceActivo && (
            <span title="Tiene un enlace público activo" className="flex-shrink-0 text-orange-400">
              <LinkIcon className="w-3.5 h-3.5" strokeWidth={2} />
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}
