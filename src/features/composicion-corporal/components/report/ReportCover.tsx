import type { BodyCompositionAnalysis, Suficiencia } from "@/lib/bcs/analysis";
import { REPORTE_VERSION, formatearFechaLarga } from "./formato";

// ── Portada del reporte (BCS Sprint 2.0) ───────────────────────────────────
// Solo sobre papel (.print-solo): en pantalla el reporte ya tiene cabecera
// propia y una portada ahí sería ruido.
//
// La marca es tipográfica, no una imagen: así no depende de una descarga que
// el navegador podría omitir al imprimir ni de un asset que versionar.

const ESTADO_REPORTE: Record<Suficiencia, string> = {
  sin_datos: "Sin datos suficientes",
  insuficiente: "Preliminar — una sola medición",
  parcial: "Parcial — dos mediciones",
  suficiente: "Completo",
};

interface Props {
  clienteNombre: string;
  analisis: BodyCompositionAnalysis;
  /** Profesional que emite el reporte. Ausente en la vista pública por token. */
  entrenador?: string;
  /** Fecha de emisión (yyyy-mm-dd), inyectada por la página. */
  generadoEl: string;
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-6 py-2.5 border-b border-white/[0.07]">
      <dt className="text-[11px] uppercase tracking-[0.12em] text-white/50">{etiqueta}</dt>
      <dd className="text-sm font-bold text-white text-right">{valor}</dd>
    </div>
  );
}

export default function ReportCover({ clienteNombre, analisis, entrenador, generadoEl }: Props) {
  const { fechaInicial, fechaFinal, cantidadMediciones, suficiencia } = analisis;

  const periodo =
    fechaInicial && fechaFinal && fechaInicial !== fechaFinal
      ? `${formatearFechaLarga(fechaInicial)} — ${formatearFechaLarga(fechaFinal)}`
      : fechaFinal
        ? formatearFechaLarga(fechaFinal)
        : "Sin mediciones registradas";

  return (
    <section className="print-solo print-portada" aria-label="Portada del reporte">
      <div className="flex flex-col justify-center min-h-[62vh]">
        <div className="flex items-center gap-2 mb-16">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-sm font-black tracking-[0.14em] uppercase">
            <span className="text-orange-400">Brey</span>{" "}
            <span className="text-white">Performance System</span>
          </span>
        </div>

        <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-3">
          Reporte de composición corporal
        </p>
        <h1 className="text-3xl font-black text-white mb-12">{clienteNombre}</h1>

        <dl className="max-w-md">
          <Dato etiqueta="Periodo analizado" valor={periodo} />
          <Dato etiqueta="Mediciones incluidas" valor={String(cantidadMediciones)} />
          {entrenador && <Dato etiqueta="Profesional a cargo" valor={entrenador} />}
          <Dato etiqueta="Estado del reporte" valor={ESTADO_REPORTE[suficiencia]} />
          <Dato etiqueta="Fecha de emisión" valor={formatearFechaLarga(generadoEl)} />
          <Dato etiqueta="Versión" valor={REPORTE_VERSION} />
        </dl>

        <div className="max-w-md mt-12">
          <p className="text-[11px] uppercase tracking-[0.12em] text-white/50 mb-2">Nota metodológica</p>
          <p className="text-[10px] leading-relaxed text-white/40">
            Este documento describe la evolución de variables de composición corporal obtenidas por
            bioimpedancia. No constituye un diagnóstico médico ni una evaluación del estado de salud.
            Las clasificaciones que incluye son posiciones dentro de rangos de referencia citados, y
            las variables que no pudieron interpretarse se declaran explícitamente en la sección de
            Metodología, nunca se omiten en silencio.
          </p>
        </div>
      </div>
    </section>
  );
}
