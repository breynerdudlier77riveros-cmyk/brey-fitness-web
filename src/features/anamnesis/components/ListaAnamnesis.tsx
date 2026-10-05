"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import DashboardCard from "@/components/app/DashboardCard";
import Button from "@/components/brand/Button";
import { Trash } from "@/components/brand/icons";
import { toast } from "@/components/brand/Toast";
import { accionCrear, accionEliminar } from "@/lib/anamnesis/actions";
import { nombreDe, type Registro } from "@/lib/anamnesis/tipos";

interface Props {
  registrosIniciales: Registro[];
}

export default function ListaAnamnesis({ registrosIniciales }: Props) {
  const [registros, setRegistros] = useState(registrosIniciales);
  const [creando, setCreando] = useState(false);
  const router = useRouter();

  async function crear() {
    setCreando(true);
    const r = await accionCrear();
    setCreando(false);
    if (!r.ok) {
      toast.error(`No se pudo crear la ficha: ${r.error}`);
      return;
    }
    router.push(`/app/admin/anamnesis/${r.data.id}`);
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar esta ficha de anamnesis? No se puede deshacer.")) return;
    const r = await accionEliminar(id);
    if (!r.ok) {
      toast.error(`No se pudo eliminar: ${r.error}`);
      return;
    }
    setRegistros((rs) => rs.filter((reg) => reg.id !== id));
  }

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Button onClick={crear} disabled={creando}>
          Nueva ficha
        </Button>
      </div>

      {registros.length === 0 ? (
        <p className="text-sm text-white/40 border border-dashed border-white/10 rounded-xl p-8 text-center">
          Todavía no hay ninguna ficha de anamnesis. Crea la primera arriba.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {registros.map((registro) => (
            <DashboardCard key={registro.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-white">{nombreDe(registro.contenido)}</p>
                  <p className="text-white/40 text-[11px] mt-1">
                    Actualizada el {new Date(registro.actualizadoEl).toLocaleDateString("es-CO")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => eliminar(registro.id)}
                  className="text-white/30 hover:text-red-400"
                  title="Eliminar ficha"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4">
                <Button href={`/app/admin/anamnesis/${registro.id}`} size="sm">
                  Abrir ficha
                </Button>
              </div>
            </DashboardCard>
          ))}
        </div>
      )}
    </div>
  );
}
