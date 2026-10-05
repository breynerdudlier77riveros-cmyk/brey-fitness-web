import EvidenceScale from "@/components/pas/evidencia/EvidenceScale";
import { poblacionEnPalabras } from "@/lib/pas/evidencia";
import type { PanelVo2Estimado } from "@/lib/pas/informe-humano";

import EvidenceBlock from "./EvidenceBlock";

// ── El VO2máx estimado de la Course-navette (Sprint PAS-8.x) ────────────────
//
// LA MISMA SECCIÓN «TU POSICIÓN» QUE CUALQUIER OTRA PRUEBA, Y NO UNA COPIA.
//
//   La Course-navette solo tiene evidencia publicada para escolares de
//   Bogotá, así que para cualquier otro perfil se queda «sin evidencia»
//   aunque el dato sirva para estimar el VO2máx y situarlo en las mismas
//   tablas de Cooper, AHA y Rivera que ya clasifican la caminata Rockport
//   (P-12). Antes esta tarjeta solo enseñaba el texto; le faltaba el gráfico
//   que SÍ existe para esas tablas —el mismo que dibuja sit-and-reach— porque
//   se construyó su propia lectura en vez de reusar `EvidenceScale`.
//
// Componente de servidor.

interface Props {
  panel: PanelVo2Estimado;
}

const num = (v: number): string => v.toFixed(1).replace(".", ",");

export default function Vo2EstimadoPanel({ panel }: Props) {
  const compatible = panel.evidencia.compatibles[0] ?? null;

  return (
    <div
      data-panel="vo2-estimado"
      className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
        VO2máx estimado desde la Course-navette
      </p>

      <p className="mt-3 text-3xl font-semibold leading-none tabular-nums text-white">
        {num(panel.valor)}
        <span className="ml-1.5 text-base font-normal text-white/45">{panel.unidad}</span>
      </p>

      {/* «Tu posición», igual que en cualquier otra tarjeta: el gráfico lo
          dibuja `EvidenceScale`, con la forma que decida la fuente que
          coincidió (bandas de Cooper, AHA o Rivera). Sin referencia
          compatible, `EvidenceBlock` dice qué hay y qué falta. */}
      {compatible ? (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <EvidenceScale
            representacion={compatible.referencia.representacion}
            observado={panel.valor}
            unidad={panel.unidad}
          />
          <p className="mt-1.5 text-[11px] text-white/35">
            Comparado con: {poblacionEnPalabras(compatible.referencia)}
          </p>
        </div>
      ) : (
        <div className="mt-3 border-t border-white/[0.06] pt-3">
          <EvidenceBlock evidencia={panel.evidencia} normativaCubierta={false} />
        </div>
      )}

      <p className="mt-3 border-t border-white/[0.06] pt-3 text-[10px] leading-relaxed text-white/25">
        Es una ESTIMACIÓN por ecuación, no una medición directa de gases: {panel.formula}.
        {panel.fuente ? ` ${panel.fuente}` : ""}
      </p>
    </div>
  );
}
