import EvidenceScale from "@/components/pas/evidencia/EvidenceScale";
import type { PanelMcGill } from "@/lib/pas/informe-humano";

// ── El panel de McGill (Sprint PAS-8.x) ─────────────────────────────────────
//
// La batería no publica una norma para el tiempo aislado de cada prueba:
// publica tres criterios de EQUILIBRIO entre las tres. Cada cociente se
// dibuja con `EvidenceScale` —el mismo componente que dibuja sit-and-reach—,
// porque un punto de corte y un rango de tolerancia son formas que ya sabe
// pintar sin inventar un segundo gráfico para lo mismo. Nunca una nota, una
// categoría ni un veredicto sobre el atleta: solo «cumple» o no cumple el
// criterio que el manual escribió.
//
// Componente de servidor.

interface Props {
  panel: PanelMcGill;
}

export default function McGillPanel({ panel }: Props) {
  return (
    <div
      data-panel="mcgill"
      className="mt-5 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
        McGill · equilibrio entre las tres pruebas
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-white/50">
        El manual no publica una norma para el tiempo aislado de cada prueba: publica estos tres
        criterios de relación entre ellas.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {panel.cocientes.map((c) => (
          <div key={c.id} className="rounded-lg border border-white/[0.06] bg-white/[0.015] p-3">
            <p className="text-[11px] text-white/60">{c.nombre}</p>
            <p className="mt-1 text-[11px] text-white/35">Criterio: {c.criterio}</p>

            <EvidenceScale representacion={c.representacion} observado={c.valor} unidad="" />

            <p
              className={`text-[11px] font-medium ${c.cumple ? "text-emerald-300/80" : "text-amber-300/80"}`}
            >
              {c.cumple ? "Cumple el criterio" : "No cumple el criterio"}
            </p>
          </div>
        ))}
      </div>

      {panel.fuente ? (
        <p className="mt-3 text-[10px] text-white/25">{panel.fuente}</p>
      ) : null}
    </div>
  );
}
