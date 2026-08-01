import { REPORTE_VERSION, formatearFechaLarga } from "./formato";

// ── Pie de cierre del reporte (BCS Sprint 2.0) ─────────────────────────────
// El NÚMERO DE PÁGINA no se imprime aquí: lo aporta el pie nativo del
// navegador. Generarlo en CSS exigiría `@page { @bottom-center { content:
// counter(page) } }`, del estándar Paged Media, que ni Chrome ni Firefox ni
// Edge implementan; un contador propio daría números incorrectos en cuanto
// el contenido repagine.

interface Props {
  clienteNombre: string;
  generadoEl: string;
}

/**
 * Marcador de QR — deliberadamente NO es un código real. Generarlo exigiría
 * una librería (prohibido en este sprint) y, sobre todo, una URL de
 * verificación que todavía no existe: un QR que no lleva a ninguna parte
 * sería peor que un espacio reservado honesto.
 */
function QrPlaceholder() {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className="w-14 h-14 rounded border border-white/[0.14] grid grid-cols-3 grid-rows-3 gap-0.5 p-1.5 flex-shrink-0"
      >
        {/* Patrón estático que evoca un QR sin simular uno funcional. */}
        {[1, 1, 1, 1, 0, 1, 1, 1, 0].map((activo, i) => (
          <span key={i} className={activo ? "bg-white/25 rounded-[1px]" : ""} />
        ))}
      </div>
      <p className="text-[9px] leading-tight text-white/35 max-w-[9rem]">
        Espacio reservado para el código de verificación del reporte.
      </p>
    </div>
  );
}

export default function ReportFooter({ clienteNombre, generadoEl }: Props) {
  const anio = generadoEl.slice(0, 4);

  return (
    <footer className="print-solo mt-12 pt-5 border-t border-white/[0.10]">
      <div className="flex items-start justify-between gap-8 flex-wrap">
        <QrPlaceholder />

        <div className="text-right text-[10px] leading-relaxed text-white/45 ml-auto">
          <p className="font-black tracking-[0.12em] uppercase text-white/70">
            <span className="text-orange-400">Brey</span> Performance System
          </p>
          <p>{clienteNombre} · Reporte de composición corporal</p>
          <p>
            {REPORTE_VERSION} · Emitido el {formatearFechaLarga(generadoEl)}
          </p>
          <p>© {anio} BREY. Documento de uso profesional.</p>
        </div>
      </div>
    </footer>
  );
}
