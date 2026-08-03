import { notFound, redirect } from "next/navigation";
import PageHeader from "@/components/app/PageHeader";
import Section from "@/components/app/Section";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { fechaISOLocal } from "@/lib/utils";
import {
  listarRegistros,
  obtenerAtleta,
  obtenerEvaluacion,
} from "@/features/performance-workspace/repository";
import { informeDeEvaluacion } from "@/features/performance-workspace/services/informe";
import { admiteInforme, admiteRegistros } from "@/features/performance-workspace/schemas/estados";
import RegistroPruebaForm from "@/features/performance-workspace/components/RegistroPruebaForm";
import RegistrosTabla from "@/features/performance-workspace/components/RegistrosTabla";
import AccionesEvaluacion from "@/features/performance-workspace/components/AccionesEvaluacion";
import ReportView from "@/components/pas/report/ReportView";
import "@/components/pas/report/print.css";

// ── Detalle de evaluación e informe (Sprint PAS-7.0) ───────────────────────
// Los motores se ejecutan UNA vez, aquí, en el servidor. `ReportView` recibe
// los DTO ya resueltos y solo compone — no vuelve a llamar a nada.
//
// La hoja de impresión del PRS se importa desde esta página: el Report System
// la trae consigo pero no la aplica a nada mientras no exista una ruta que lo
// monte. Esta es esa ruta.

interface Props {
  params: Promise<{ evaluacionId: string }>;
}

export default async function EvaluacionPage({ params }: Props) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { evaluacionId } = await params;
  const supabase = await createClient();

  const evaluacion = await obtenerEvaluacion(supabase, evaluacionId);
  if (!evaluacion) notFound();

  const atleta = await obtenerAtleta(supabase, evaluacion.atletaId);
  if (!atleta || atleta.estado === "eliminado") notFound();

  const registros = await listarRegistros(supabase, evaluacionId);

  // PAE → PIE → PPRE, una sola vez.
  const informe = informeDeEvaluacion(
    evaluacion.atletaId,
    evaluacion,
    registros,
    fechaISOLocal()
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Evaluación ${evaluacion.fecha}`}
        description={`${atleta.nombre} · ${evaluacion.tipo}`}
        actions={<AccionesEvaluacion evaluacion={evaluacion} />}
      />

      <Section label="Pruebas registradas">
        <RegistrosTabla registros={registros} />
      </Section>

      {admiteRegistros(evaluacion.estado) ? (
        <Section label="Registrar prueba">
          <RegistroPruebaForm
            evaluacionId={evaluacionId}
            fechaEvaluacion={evaluacion.fecha}
          />
        </Section>
      ) : null}

      {admiteInforme(evaluacion.estado) ? (
        <ReportView
          analisis={informe.analisis}
          interpretacion={informe.interpretacion}
          atleta={atleta.nombre}
        />
      ) : (
        <Section label="Informe">
          <p className="text-sm text-white/50">
            Esta evaluación está anulada y no se deriva ningún informe.
          </p>
        </Section>
      )}
    </div>
  );
}
