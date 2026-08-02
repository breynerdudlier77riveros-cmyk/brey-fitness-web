// ── Tarjeta de métrica del dashboard (Sprint BCS-5.0) ──────────────────────
// Distinta de la MetricCard del Core Product (@/components/app/MetricCard):
// esta admite una nota de contexto y una sparkline, que allí no existen. Se
// mantienen separadas a propósito — fusionarlas obligaría a la del Core
// Product a cargar conceptos que no usa.

import Sparkline from "./Sparkline";

interface Props {
  etiqueta: string;
  valor: number | string;
  /** Contexto breve. No es un juicio sobre la cifra. */
  nota?: string;
  /** Serie compacta opcional, para ver la forma sin abrir un gráfico. */
  serie?: number[];
}

export default function MetricCard({ etiqueta, valor, nota, serie }: Props) {
  return (
    <article
      role="group"
      aria-label={`${etiqueta}: ${valor}${nota ? `. ${nota}` : ""}`}
      className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4"
    >
      <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/45 mb-2">
        {etiqueta}
      </p>
      <p className="font-black text-2xl text-white tabular-nums leading-none">{valor}</p>

      {serie && serie.length > 1 && (
        <div className="mt-3">
          <Sparkline valores={serie} etiqueta={etiqueta} />
        </div>
      )}

      {nota && <p className="text-[11px] text-white/40 mt-2 leading-snug">{nota}</p>}
    </article>
  );
}
