import { notFound, redirect } from "next/navigation";
import PageHeader from "@/components/app/PageHeader";
import Section from "@/components/app/Section";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { fechaISOLocal } from "@/lib/utils";
import {
  leerRegistros,
  listarEvaluaciones,
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
import TechnicalError from "@/components/pas/report-v2/TechnicalError";
import PerformanceReport from "@/components/pas/informe/PerformanceReport";
import { construirInformeAtleta } from "@/features/performance-workspace/services/informe-atleta";
import { resolverSujeto } from "@/features/performance-workspace/services/sujeto";
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

  // Para el informe normativo se lee aparte, distinguiendo «no hay registros»
  // de «no se pudieron leer»: un fallo de la base no autoriza a afirmar que el
  // profesional no midió nada.
  const lectura = await leerRegistros(supabase, evaluacionId);
  const hoyISO = fechaISOLocal();

  // ── PAS-8 · las mediciones anteriores del atleta ────────────────────────
  // El eje longitudinal necesita el histórico, y solo el histórico: se excluye
  // la evaluación actual o el resultado se compararía consigo mismo.
  const otrasEvaluaciones = (await listarEvaluaciones(supabase, evaluacion.atletaId)).filter(
    (e) => e.id !== evaluacionId && e.estado !== "anulada",
  );
  const previas = (
    await Promise.all(
      otrasEvaluaciones.map(async (e) => {
        const regs = await listarRegistros(supabase, e.id);
        return regs
          .filter((r) => r.estado === "vigente" && r.valor.tipo === "continuo")
          .map((r) => {
            const v = r.valor as Extract<typeof r.valor, { tipo: "continuo" }>;
            return {
              pruebaId: r.pruebaId,
              valor: v.valor,
              unidad: v.unidad,
              fecha: r.fecha,
              condiciones: r.condiciones,
            };
          });
      }),
    )
  ).flat();

  // Los objetivos llegan vacíos: `pas_objetivos` existe como migración escrita
  // y sin aplicar (PAS-8). El contrato ya los soporta; el día que la tabla
  // exista, cambia esta lectura y nada más.
  const objetivos: never[] = [];

  // La edad se deriva de la FECHA DE LA EVALUACION, no de hoy (PAS-12 §10).
  // Con `hoyISO` una medición del año pasado se comparaba contra las normas de
  // la edad que el atleta tiene ahora, y las fichas de dinamometría de la NKB
  // estratifican por años de uno en uno.
  const sujeto = resolverSujeto(atleta, evaluacion.fecha);

  const informeAtleta = construirInformeAtleta({
    atleta,
    registros: lectura,
    previas,
    objetivos,
    hoyISO,
    fecha: evaluacion.fecha,
    codigo: evaluacion.id,
    edad: sujeto.sujeto.edad,
    sexo: atleta.sexo,
    pesoKg: evaluacion.pesoKg,
  });

  // PAE → PIE → PPRE, una sola vez.
  const informe = informeDeEvaluacion(evaluacion.atletaId, evaluacion, registros, hoyISO);

  // Atleta → SujetoNormativo → NIE → informe v2, también una sola vez. Devuelve
  // un estado explícito cuando el expediente no da para construir el sujeto.
  const normativo = construirInformeNormativo({
    atleta,
    registros: lectura,
    hoyISO,
    portada: {
      atleta: atleta.nombre,
      // La edad y el sexo iban a `null` y la portada los pinta: el informe
      // normativo salía sin identificar al sujeto, enseñando solo la fecha.
      // Los dos estaban resueltos aquí mismo —`sujeto` se calcula arriba para
      // el informe del atleta— así que era un cable suelto, no un dato que
      // faltara. Se pasa lo MISMO que consume el otro informe: dos portadas
      // del mismo expediente no pueden decir cosas distintas.
      edad: sujeto.sujeto.edad,
      sexo: atleta.sexo,
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
          {/* ── PAS-8 · el informe del atleta, primero ──────────────────
              Responde «¿cómo estoy?» antes que «¿por qué?». El perfil
              normativo y el funcional siguen debajo, intactos: la información
              científica no se elimina, se reubica. */}
          {informeAtleta.estado === "DISPONIBLE" ? (
            <PerformanceReport informe={informeAtleta.informe} />
          ) : null}

          <Section label="Perfil normativo">
            {normativo.estado === "DISPONIBLE" ? (
              <ReportViewV2 informe={normativo.informe} />
            ) : normativo.estado === "ERROR_TECNICO" ? (
              <TechnicalError origen={normativo.origen} detalle={normativo.detalle} />
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
