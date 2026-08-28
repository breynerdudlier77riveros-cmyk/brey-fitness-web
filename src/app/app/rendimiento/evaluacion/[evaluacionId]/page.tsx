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
import MasaCorporal from "@/features/performance-workspace/components/MasaCorporal";
import RegistroPruebaForm from "@/features/performance-workspace/components/RegistroPruebaForm";
import RegistrosTabla from "@/features/performance-workspace/components/RegistrosTabla";
import AccionesEvaluacion from "@/features/performance-workspace/components/AccionesEvaluacion";
import ReportView from "@/components/pas/report/ReportView";
import InformeEvaluacion from "@/components/pas/informe/InformeEvaluacion";
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

      {admiteInforme(evaluacion.estado) ? (
        /* ── PAS-14 · UN informe, un dueño por pregunta ──────────────────
           Antes se apilaban tres informes del mismo expediente: dos portadas,
           dos resúmenes ejecutivos, tres «perfiles» y dos listas de
           advertencias. El compositor los funde bajo las cuatro preguntas y
           manda el funcional al detalle plegado — nada científico se borra,
           se reubica. */
        <InformeEvaluacion
          atleta={informeAtleta}
          normativo={normativo}
          conflictos={informe.analisis.conflictos}
          funcional={
            <ReportView
              analisis={informe.analisis}
              interpretacion={informe.interpretacion}
              atleta={atleta.nombre}
            />
          }
        />
      ) : (
        <Section label="Informe">
          <p className="text-sm text-white/50">
            Esta evaluación está anulada y no se deriva ningún informe.
          </p>
        </Section>
      )}

      {/* ── PAS-15 · las herramientas, DESPUÉS y plegadas ───────────────────
          Antes la página abría con dos formularios y una tabla de dieciocho
          filas, y había que pasarlos para llegar a lo que se viene a leer. El
          informe es el producto; registrar y corregir es la herramienta.

          Plegadas y no en otra página: corregir un dato y volver a mirar el
          informe es el gesto más frecuente, y partirlo en dos vistas
          obligaría a navegar para cada corrección. */}
      <details className="rounded-2xl border border-white/[0.08]">
        <summary className="cursor-pointer list-none px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40 transition-colors hover:text-white/70">
          Registrar y corregir datos
          <span className="ml-2 font-normal tracking-normal text-white/25">
            {registros.length} {registros.length === 1 ? "prueba" : "pruebas"}
          </span>
        </summary>

        <div className="space-y-8 border-t border-white/[0.08] px-4 py-6">
      {/* La masa corporal va ANTES de las pruebas, no escondida en el alta:
          es lo que decide si esas pruebas van a tener lectura normativa. Solo
          en borrador, igual que registrar y anular. */}
      {admiteRegistros(evaluacion.estado) ? (
        <Section label="Masa corporal">
          <MasaCorporal evaluacionId={evaluacionId} pesoKg={evaluacion.pesoKg} />
        </Section>
      ) : null}

      <Section label="Pruebas registradas">
        {/* `editable` sale de la MISMA función que decide si se pueden añadir
            registros: si se pueden añadir, se pueden retirar. Dos criterios
            distintos para lo mismo acabarían divergiendo. */}
        <RegistrosTabla
          registros={registros}
          evaluacionId={evaluacionId}
          editable={admiteRegistros(evaluacion.estado)}
        />
      </Section>

      {admiteRegistros(evaluacion.estado) ? (
        <Section label="Registrar prueba">
          <RegistroPruebaForm
            evaluacionId={evaluacionId}
            fechaEvaluacion={evaluacion.fecha}
          />
        </Section>
      ) : null}
        </div>
      </details>
    </div>
  );
}
