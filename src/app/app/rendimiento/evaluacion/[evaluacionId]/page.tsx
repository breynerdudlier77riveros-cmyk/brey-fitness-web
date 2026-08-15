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
import ReportViewV2 from "@/components/pas/report-v2/ReportViewV2";
import IncompleteSubject from "@/components/pas/report-v2/IncompleteSubject";
import { construirInformeNormativo } from "@/features/performance-workspace/services/informe-normativo";
import "@/components/pas/report/print.css";
import "@/components/pas/report-v2/print.css";

// ── Detalle de evaluación e informe (Sprint PAS-7.0) ───────────────────────
// Los motores se ejecutan UNA vez, aquí, en el servidor. `ReportView` recibe
// los DTO ya resueltos y solo compone — no vuelve a llamar a nada.
//
// La hoja de impresión del PRS se importa desde esta página: el Report System
// la trae consigo pero no la aplica a nada mientras no exista una ruta que lo
// monte. Esta es esa ruta, y desde PRS-2.1 también monta la del informe v2.
//
// El informe normativo (PRS v2) se deriva aparte del funcional (PAS v5): uno
// responde «¿qué capacidades están caracterizadas?» y el otro «¿dónde cae este
// valor respecto de su población?». Son preguntas distintas y no se mezclan.

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

  const hoyISO = fechaISOLocal();

  // PAE → PIE → PPRE, una sola vez.
  const informe = informeDeEvaluacion(evaluacion.atletaId, evaluacion, registros, hoyISO);

  // Atleta → SujetoNormativo → NIE → informe v2, también una sola vez. Devuelve
  // un estado explícito cuando el expediente no da para construir el sujeto.
  const normativo = construirInformeNormativo({
    atleta,
    registros,
    hoyISO,
    portada: {
      atleta: atleta.nombre,
      edad: null,
      sexo: null,
      fecha: evaluacion.fecha,
      profesional: null,
      codigo: evaluacion.id,
    },
  });

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
        <>
          <Section label="Perfil normativo">
            {normativo.estado === "DISPONIBLE" ? (
              <ReportViewV2 informe={normativo.informe} />
            ) : normativo.estado === "SUJETO_INCOMPLETO" ? (
              <IncompleteSubject ausentes={normativo.ausentes} detalle={normativo.detalle} />
            ) : (
              <p className="text-sm text-white/50">{normativo.detalle}</p>
            )}
          </Section>

          <ReportView
            analisis={informe.analisis}
            interpretacion={informe.interpretacion}
            atleta={atleta.nombre}
          />
        </>
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
