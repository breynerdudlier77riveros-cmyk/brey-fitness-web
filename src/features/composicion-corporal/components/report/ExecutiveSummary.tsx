import type { BodyCompositionAnalysis, Suficiencia } from "@/lib/bcs/analysis";
import { formatearFechaCorta } from "./formato";

// ── Resumen ejecutivo (BCS Sprint 2.0) ─────────────────────────────────────
// Presenta lo que el motor YA concluyó. No vuelve a interpretar: el titular
// y el texto salen tal cual de `analisis.resumen`, y los recuentos son
// aritmética sobre arreglos que el motor ya clasificó.
//
// El tono `atencion` significa "hay un dato que revisar", nunca un juicio
// sobre la salud de la persona (BCS Handbook 06).

const ETIQUETA_SUFICIENCIA: Record<Suficiencia, string> = {
  sin_datos: "Sin datos",
  insuficiente: "Base insuficiente",
  parcial: "Base parcial",
  suficiente: "Base suficiente",
};

interface Props {
  analisis: BodyCompositionAnalysis;
}

function Metrica({ valor, etiqueta }: { valor: number | string; etiqueta: string }) {
  return (
    <div className="px-4 py-3 border-l border-white/[0.08] first:border-l-0 first:pl-0">
      <p className="font-black text-xl text-white tabular-nums leading-none">{valor}</p>
      <p className="text-[10px] uppercase tracking-[0.1em] text-white/45 mt-1.5">{etiqueta}</p>
    </div>
  );
}

export default function ExecutiveSummary({ analisis }: Props) {
  const { resumen, hallazgos, avisos, insights, cantidadMediciones, fechaInicial, fechaFinal } = analisis;

  const cambios = hallazgos.filter((h) => h.id.startsWith("cambio:")).length;
  const alertas = avisos.filter((a) => a.tipo === "alerta").length;
  const limitaciones = avisos.filter((a) => a.tipo === "limitacion").length;

  const acento =
    resumen.tono === "atencion"
      ? "border-l-yellow-500 bg-yellow-500/[0.05]"
      : resumen.tono === "informativo"
        ? "border-l-sky-500 bg-sky-500/[0.04]"
        : "border-l-white/25 bg-white/[0.02]";

  const periodo =
    fechaInicial && fechaFinal && fechaInicial !== fechaFinal
      ? `${formatearFechaCorta(fechaInicial)} — ${formatearFechaCorta(fechaFinal)}`
      : fechaFinal
        ? formatearFechaCorta(fechaFinal)
        : "—";

  return (
    <section aria-labelledby="resumen-ejecutivo" className="rounded-2xl border border-white/[0.07] overflow-hidden">
      <div className={`border-l-4 ${acento} p-5 sm:p-6`}>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
          <h2 id="resumen-ejecutivo" className="font-black text-lg text-white">
            {resumen.titulo}
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/50 rounded-full border border-white/15 px-2.5 py-1">
            {ETIQUETA_SUFICIENCIA[resumen.suficiencia]}
          </span>
        </div>
        <p className="text-sm text-white/75 leading-relaxed max-w-2xl">{resumen.texto}</p>
      </div>

      <div className="flex flex-wrap divide-white/[0.08] border-t border-white/[0.07] px-5 sm:px-6 py-1">
        <Metrica valor={cantidadMediciones} etiqueta="Mediciones" />
        <Metrica valor={cambios} etiqueta="Cambios" />
        <Metrica valor={insights.length} etiqueta="Interpretaciones" />
        <Metrica valor={alertas} etiqueta="A revisar" />
        <Metrica valor={limitaciones} etiqueta="Limitaciones" />
        <Metrica valor={periodo} etiqueta="Periodo" />
      </div>
    </section>
  );
}
