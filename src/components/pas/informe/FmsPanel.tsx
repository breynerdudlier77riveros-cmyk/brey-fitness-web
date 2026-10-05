import type { PanelFms } from "@/lib/pas/informe-humano";

// ── El panel del FMS por sus siete pruebas (Sprint PAS-8.x) ─────────────────
//
// Muestra las siete puntuaciones y su suma. NO muestra ninguna banda, ningún
// «riesgo» ni el punto de corte de 14: tres revisiones sistemáticas
// independientes coinciden en que la puntuación compuesta del FMS no respalda
// usarse para predecir lesión, y ese umbral está expresamente prohibido como
// corte de riesgo (`moran_fms_2017`, ficha P-09 de la base de conocimiento).
//
// Componente de servidor.

interface Props {
  panel: PanelFms;
}

export default function FmsPanel({ panel }: Props) {
  return (
    <div
      data-panel="fms"
      className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
        FMS · las siete pruebas
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {panel.pruebas.map((p) => (
          <div key={p.pruebaId} className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-2.5">
            <p className="text-[10px] leading-snug text-white/50">{p.nombre.replace(/^FMS · /, "")}</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-white">{p.puntuacion}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-baseline gap-2 border-t border-white/[0.06] pt-3">
        <span className="text-2xl font-semibold tabular-nums text-white">{panel.total}</span>
        <span className="text-[12px] text-white/45">de {panel.maximo}</span>
      </div>

      <p className="mt-2 text-[10px] leading-relaxed text-white/25">
        Es la suma de las siete puntuaciones, sin clasificar: ninguna revisión sistemática respalda
        un punto de corte para este total, y el de 14 en particular está descartado como umbral de
        riesgo.
      </p>
    </div>
  );
}
