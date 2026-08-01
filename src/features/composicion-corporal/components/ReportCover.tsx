// ── Portada y pie del Reporte impreso (Sprint BCS-1.2) ─────────────────────
// Solo existen sobre papel (.print-solo): en pantalla el reporte ya tiene su
// propia cabecera, y una portada ahí sería ruido. Las reglas de visibilidad y
// el salto de página viven en globals.css (@media print).
//
// Sin logo en imagen: la marca es tipográfica (mismo BrandMark que Sidebar),
// así que no depende de una descarga que el navegador podría omitir al
// imprimir ni de un asset que haya que versionar.

interface PortadaProps {
  clienteNombre: string;
  /** Fecha de la medición más reciente incluida (yyyy-mm-dd). */
  fechaUltimaMedicion: string | null;
  /** Rango cubierto por el histórico, cuando hay más de una medición. */
  fechaPrimeraMedicion: string | null;
  totalMediciones: number;
  /** Profesional que emite el reporte. Ausente en la vista pública por token. */
  entrenador?: string;
  /** Fecha de generación del documento (yyyy-mm-dd), inyectada por la página. */
  generadoEl: string;
}

function formatearFechaLarga(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-6 py-2 border-b border-white/[0.07]">
      <span className="text-xs uppercase tracking-[0.12em] text-white/50">{etiqueta}</span>
      <span className="text-sm font-bold text-white text-right">{valor}</span>
    </div>
  );
}

export function ReportCover({
  clienteNombre,
  fechaUltimaMedicion,
  fechaPrimeraMedicion,
  totalMediciones,
  entrenador,
  generadoEl,
}: PortadaProps) {
  const periodo =
    fechaPrimeraMedicion && fechaUltimaMedicion && fechaPrimeraMedicion !== fechaUltimaMedicion
      ? `${formatearFechaLarga(fechaPrimeraMedicion)} — ${formatearFechaLarga(fechaUltimaMedicion)}`
      : fechaUltimaMedicion
        ? formatearFechaLarga(fechaUltimaMedicion)
        : "Sin mediciones registradas";

  return (
    <div className="print-solo print-portada">
      <div className="flex flex-col justify-center min-h-[60vh]">
        <div className="flex items-center gap-2 mb-16">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-sm font-black tracking-[0.14em] uppercase">
            <span className="text-orange-400">Brey</span> <span className="text-white">Performance System</span>
          </span>
        </div>

        <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">
          Reporte de composición corporal
        </p>
        <h1 className="text-3xl font-black text-white mb-12">{clienteNombre}</h1>

        <div className="max-w-md">
          <Dato etiqueta="Periodo analizado" valor={periodo} />
          <Dato
            etiqueta="Mediciones incluidas"
            valor={String(totalMediciones)}
          />
          {entrenador && <Dato etiqueta="Profesional a cargo" valor={entrenador} />}
          <Dato etiqueta="Fecha de emisión" valor={formatearFechaLarga(generadoEl)} />
        </div>

        <p className="text-[10px] leading-relaxed text-white/40 max-w-md mt-12">
          Este documento describe la evolución de variables de composición corporal medidas por
          bioimpedancia. No constituye un diagnóstico médico ni una evaluación de salud: las
          clasificaciones que incluye son posiciones dentro de rangos de referencia citados, y las
          limitaciones de interpretación se detallan en el propio reporte.
        </p>
      </div>
    </div>
  );
}

interface PieProps {
  clienteNombre: string;
  generadoEl: string;
}

/**
 * Pie de cierre del documento. El NÚMERO DE PÁGINA no se imprime aquí: sale
 * del pie nativo del navegador. Generarlo en CSS exigiría `@page { @bottom-
 * center { content: counter(page) } }`, del estándar Paged Media, que ni
 * Chrome ni Firefox ni Edge implementan — falsearlo con un contador propio
 * daría números incorrectos en cuanto el contenido repagine.
 */
export function ReportFooter({ clienteNombre, generadoEl }: PieProps) {
  return (
    <div className="print-solo mt-10 pt-4 border-t border-white/[0.07]">
      <div className="flex items-center justify-between gap-4 text-[10px] text-white/50">
        <span>{clienteNombre} · Reporte de composición corporal</span>
        <span>
          Generado el {formatearFechaLarga(generadoEl)} · BCS v1 ·{" "}
          <span className="font-bold text-orange-400">Brey</span>
        </span>
      </div>
    </div>
  );
}
