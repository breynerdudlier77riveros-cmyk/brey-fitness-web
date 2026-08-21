"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/app/PageHeader";
import Badge from "@/components/brand/Badge";
import Button from "@/components/brand/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/brand/Dialog";
import { toast } from "@/components/brand/Toast";
import { LinkIcon, Copy, Trash, ArrowLeft, Download } from "@/components/brand/icons";
import ReportView from "@/features/composicion-corporal/components/ReportView";
import CopilotPanel from "@/features/composicion-corporal/components/CopilotPanel";
import ClienteForm from "@/features/composicion-corporal/components/ClienteForm";
import MedicionForm from "@/features/composicion-corporal/components/MedicionForm";
import { EstadoVacioMediciones } from "@/features/composicion-corporal/components/EstadosVacios";
import { archivarCliente, reactivarCliente, eliminarCliente, crearEnlacePublico, revocarEnlacePublico } from "@/lib/bcs/actions";
import { SITE_URL } from "@/lib/site";
import type { Cliente, Medicion, EnlacePublico } from "@/lib/bcs/tipos";
import type { Reporte } from "@/lib/bcs/reporte";
import type { BodyCompositionAnalysis } from "@/lib/bcs/analysis";
import type { RecommendationReport } from "@/lib/bcs/recommendations";
import type { ClinicalObservationReport } from "@/lib/bcs/observation";
import type { ResultadoCopilot } from "@/lib/bcs/copilot";

type Dialogo = "ninguno" | "medicion" | "editar-cliente" | "compartir" | "confirmar-archivar" | "confirmar-eliminar";

interface Props {
  cliente: Cliente;
  reporte: Reporte | null;
  /** Computado en el Server Component — null cuando no hay reporte que analizar. */
  analisis: BodyCompositionAnalysis | null;
  /** Computadas en el Server Component junto al análisis. */
  recomendaciones: RecommendationReport | null;
  /** Redactadas por el COG en el Server Component. */
  observaciones: ClinicalObservationReport | null;
  enlaceActivo: EnlacePublico | null;
  /** Fecha de emisión (yyyy-mm-dd) para la portada y el pie del reporte impreso. */
  generadoEl: string;
  /** Nombre del profesional que emite el reporte. */
  entrenador?: string;
  /**
   * Documentos compuestos por el copiloto a partir de este mismo informe.
   *
   * Se componen en el Server Component, como todo lo demás: son puros y
   * deterministas, así que no hay ninguna razón para recalcularlos en el
   * navegador. `null` cuando no hay informe del que componerlos.
   */
  copiloto: ResultadoCopilot | null;
}

export default function ClienteDetailClient({
  cliente: clienteInicial,
  reporte,
  analisis,
  recomendaciones,
  observaciones,
  enlaceActivo: enlaceInicial,
  generadoEl,
  entrenador,
  copiloto,
}: Props) {
  const router = useRouter();
  const [cliente, setCliente] = useState(clienteInicial);
  const [enlace, setEnlace] = useState(enlaceInicial);
  const [dialogo, setDialogo] = useState<Dialogo>("ninguno");
  const [medicionParaCorregir, setMedicionParaCorregir] = useState<Medicion | undefined>(undefined);
  const [procesando, setProcesando] = useState(false);

  function cerrarDialogo() {
    setDialogo("ninguno");
    setMedicionParaCorregir(undefined);
  }

  function handleMedicionGuardada() {
    cerrarDialogo();
    router.refresh();
  }

  function abrirCorregir(medicion: Medicion) {
    setMedicionParaCorregir(medicion);
    setDialogo("medicion");
  }

  async function handleArchivar() {
    setProcesando(true);
    const resultado = cliente.estado === "archivado" ? await reactivarCliente(cliente.id) : await archivarCliente(cliente.id);
    setProcesando(false);
    if (!resultado.ok) {
      toast.error("No se pudo actualizar el estado del cliente.");
      return;
    }
    setCliente(resultado.data);
    setDialogo("ninguno");
    toast.success(cliente.estado === "archivado" ? "Cliente reactivado." : "Cliente archivado.");
  }

  async function handleEliminar() {
    setProcesando(true);
    const resultado = await eliminarCliente(cliente.id);
    setProcesando(false);
    if (!resultado.ok) {
      toast.error("No se pudo eliminar el cliente.");
      return;
    }
    toast.success("Cliente eliminado.");
    router.push("/app/composicion-corporal");
  }

  async function handleGenerarEnlace() {
    setProcesando(true);
    const resultado = await crearEnlacePublico(cliente.id);
    setProcesando(false);
    if (!resultado.ok) {
      toast.error("No se pudo generar el enlace.");
      return;
    }
    setEnlace(resultado.data);
    toast.success("Enlace generado.");
  }

  async function handleRevocarEnlace() {
    if (!enlace) return;
    setProcesando(true);
    const resultado = await revocarEnlacePublico(enlace.id);
    setProcesando(false);
    if (!resultado.ok) {
      toast.error("No se pudo revocar el enlace.");
      return;
    }
    setEnlace(null);
    toast.success("Enlace revocado.");
  }

  function handleCopiarEnlace() {
    if (!enlace) return;
    navigator.clipboard.writeText(`${SITE_URL}/reportes/${enlace.token}`);
    toast.success("Enlace copiado.");
  }

  // IN-D2 (BCS Handbook): Eliminado es terminal, sin transición de vuelta.
  // El repositorio no expone borrado físico todavía (ver bcs/actions.ts) —
  // la fila puede seguir siendo alcanzable por URL directa; esta vista
  // trata ese estado como de solo lectura, sin acciones.
  if (cliente.estado === "eliminado") {
    return (
      <>
        <Link href="/app/composicion-corporal" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors mb-4">
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          Todos los clientes
        </Link>
        <PageHeader title={cliente.nombre} description="Este cliente fue eliminado." />
      </>
    );
  }

  return (
    <>
      <Link href="/app/composicion-corporal" className="print:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white transition-colors mb-4">
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
        Todos los clientes
      </Link>

      <PageHeader
        title={cliente.nombre}
        description={cliente.estado === "archivado" ? "Cliente archivado" : undefined}
        actions={
          <div className="flex items-center gap-2 flex-wrap print:hidden">
            {cliente.estado === "archivado" && (
              <Badge variant="neutral" className="mr-1">
                Archivado
              </Badge>
            )}
            <Button size="sm" onClick={() => setDialogo("medicion")}>
              Registrar medición
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDialogo("compartir")}>
              <LinkIcon className="w-3.5 h-3.5" strokeWidth={2} />
              Compartir
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDialogo("editar-cliente")}>
              Editar
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDialogo("confirmar-archivar")}>
              {cliente.estado === "archivado" ? "Reactivar" : "Archivar"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Download className="w-3.5 h-3.5" strokeWidth={2} />
              Exportar
            </Button>
          </div>
        }
      />

      {reporte && analisis && recomendaciones && observaciones ? (
        <ReportView
          reporte={reporte}
          analisis={analisis}
          recomendaciones={recomendaciones}
          observaciones={observaciones}
          generadoEl={generadoEl}
          entrenador={entrenador}
          explicacionPaciente={
            copiloto?.entregables.find((e) => e.tipo === "explicacion_paciente") ?? null
          }
          onCorregirMedicion={abrirCorregir}
        />
      ) : (
        <EstadoVacioMediciones onRegistrar={() => setDialogo("medicion")} />
      )}

      {/* `print:hidden`: son herramientas para preparar la consulta, no parte
          del documento que se imprime y se entrega. */}
      {copiloto ? (
        <div className="print:hidden mt-10 pt-8 border-t border-white/[0.06]">
          <CopilotPanel resultado={copiloto} />
        </div>
      ) : null}

      <div className="print:hidden mt-10 pt-6 border-t border-white/[0.06]">
        <button
          onClick={() => setDialogo("confirmar-eliminar")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/35 hover:text-red-400 transition-colors cursor-pointer"
        >
          <Trash className="w-3.5 h-3.5" strokeWidth={2} />
          Eliminar cliente permanentemente
        </button>
      </div>

      {/* Registrar / Corregir medición */}
      <Dialog open={dialogo === "medicion"} onOpenChange={(open) => !open && cerrarDialogo()}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{medicionParaCorregir ? "Corregir medición" : "Nueva medición"}</DialogTitle>
          </DialogHeader>
          <MedicionForm
            clienteId={cliente.id}
            medicionOriginal={medicionParaCorregir}
            onCancel={cerrarDialogo}
            onSaved={handleMedicionGuardada}
          />
        </DialogContent>
      </Dialog>

      {/* Editar cliente */}
      <Dialog open={dialogo === "editar-cliente"} onOpenChange={(open) => !open && cerrarDialogo()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
          </DialogHeader>
          <ClienteForm
            cliente={cliente}
            onCancel={cerrarDialogo}
            onSaved={(actualizado) => {
              setCliente(actualizado);
              cerrarDialogo();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Compartir enlace público */}
      <Dialog open={dialogo === "compartir"} onOpenChange={(open) => !open && cerrarDialogo()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reporte público</DialogTitle>
          </DialogHeader>
          {enlace ? (
            <div className="space-y-4">
              <p className="text-sm text-white/60">
                Cualquier persona con este enlace puede ver el reporte de {cliente.nombre}, sin necesidad de iniciar sesión.
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.10] bg-white/[0.04] px-4 py-3">
                <span className="text-xs text-white/70 truncate flex-1">{`${SITE_URL}/reportes/${enlace.token}`}</span>
                <button onClick={handleCopiarEnlace} className="flex-shrink-0 text-white/50 hover:text-white transition-colors cursor-pointer" aria-label="Copiar enlace">
                  <Copy className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={handleRevocarEnlace} disabled={procesando}>
                Revocar enlace
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-white/60">
                Genera un enlace público para que {cliente.nombre} vea su propio reporte de composición corporal.
              </p>
              <Button size="sm" onClick={handleGenerarEnlace} disabled={procesando}>
                Generar enlace
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmar archivar/reactivar */}
      <Dialog open={dialogo === "confirmar-archivar"} onOpenChange={(open) => !open && cerrarDialogo()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{cliente.estado === "archivado" ? "¿Reactivar cliente?" : "¿Archivar cliente?"}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/60">
            {cliente.estado === "archivado"
              ? "El cliente volverá a aparecer en tu lista de clientes activos."
              : "El cliente dejará de aparecer en tu lista activa. Su historial completo se conserva y podrás reactivarlo cuando quieras."}
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={cerrarDialogo} disabled={procesando}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleArchivar} disabled={procesando}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmar eliminación permanente */}
      <Dialog open={dialogo === "confirmar-eliminar"} onOpenChange={(open) => !open && cerrarDialogo()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar a {cliente.nombre} permanentemente?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/60">
            Esta acción no se puede deshacer. Se revocará cualquier enlace público activo. El historial de mediciones deja de estar accesible desde aquí.
          </p>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={cerrarDialogo} disabled={procesando}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleEliminar} disabled={procesando}>
              Eliminar permanentemente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
