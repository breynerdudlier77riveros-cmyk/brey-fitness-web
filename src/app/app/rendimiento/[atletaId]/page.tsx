import { notFound, redirect } from "next/navigation";
import PageHeader from "@/components/app/PageHeader";
import Section from "@/components/app/Section";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { fechaISOLocal } from "@/lib/utils";
import {
  listarEvaluaciones,
  listarRegistros,
  obtenerAtleta,
} from "@/features/performance-workspace/repository";
import {
  construirHistorial,
  filtrarEvaluaciones,
} from "@/features/performance-workspace/services/consultas";
import { informeDeEvaluacion } from "@/features/performance-workspace/services/informe";
import HistorialEvaluaciones from "@/features/performance-workspace/components/HistorialEvaluaciones";
import NuevaEvaluacionForm from "@/features/performance-workspace/components/NuevaEvaluacionForm";
import FiltrosEvaluaciones from "@/features/performance-workspace/components/FiltrosEvaluaciones";
import { VERSION_MOTOR } from "@/lib/pas";

// ── Detalle de atleta e historial (Sprint PAS-7.0) ─────────────────────────
// Los recuentos del historial salen del informe YA derivado de cada
// evaluación: el Workspace no recorre registros para contar capacidades.
//
// Coste asumido: derivar N informes para pintar el historial. Es la única vía
// honesta de mostrar «cuántas capacidades» sin duplicar la lógica del PAE en
// una consulta SQL — y duplicarla sería exactamente lo que este sprint prohíbe.

interface Props {
  params: Promise<{ atletaId: string }>;
  searchParams: Promise<{ estado?: string; tipo?: string; desde?: string; hasta?: string }>;
}

export default async function AtletaPage({ params, searchParams }: Props) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { atletaId } = await params;
  const supabase = await createClient();

  const atleta = await obtenerAtleta(supabase, atletaId);
  if (!atleta || atleta.estado === "eliminado") notFound();

  const todas = await listarEvaluaciones(supabase, atletaId);
  const hoy = fechaISOLocal();

  // Se filtra ANTES de derivar los informes: cada uno cuesta un PAE completo,
  // y derivar los que no se van a mostrar sería trabajo tirado.
  const { estado, tipo, desde, hasta } = await searchParams;
  const evaluaciones = filtrarEvaluaciones(todas, {
    estado: estado as never,
    tipo: tipo as never,
    desde,
    hasta,
  });

  const recuentos = await Promise.all(
    evaluaciones.map(async (evaluacion) => {
      const registros = await listarRegistros(supabase, evaluacion.id);
      const informe = informeDeEvaluacion(atletaId, evaluacion, registros, hoy);

      return {
        evaluacionId: evaluacion.id,
        pruebas: registros.filter((r) => r.estado === "vigente").length,
        capacidades: informe.interpretacion.cobertura.caracterizadas,
      };
    })
  );

  const historial = construirHistorial(evaluaciones, recuentos, VERSION_MOTOR);

  return (
    <div className="space-y-8">
      <PageHeader
        title={atleta.nombre}
        description={
          [atleta.deporte, atleta.codigoInterno].filter(Boolean).join(" · ") ||
          "Sin datos adicionales"
        }
      />

      <Section label="Historial de evaluaciones">
        <div className="mb-5">
          <FiltrosEvaluaciones
            valores={{ estado, tipo, desde, hasta }}
            rutaLimpia={`/app/rendimiento/${atletaId}`}
            total={todas.length}
            visibles={evaluaciones.length}
          />
        </div>

        <HistorialEvaluaciones entradas={historial} />
      </Section>

      <Section label="Nueva evaluación">
        <NuevaEvaluacionForm atletaId={atletaId} fechaPorDefecto={hoy} />
      </Section>
    </div>
  );
}
