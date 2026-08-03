import type { ApendiceInforme } from "@/lib/pas/report";

// ── Pie del informe (Sprint PAS-5.0) ───────────────────────────────────────
// No es el pie de marketing del sitio: no lleva enlaces, ni redes, ni menú.
// Repite las coordenadas mínimas para que una página suelta impresa siga
// siendo identificable, y declara el alcance del documento.

interface Props {
  apendice: ApendiceInforme;
}

export default function PerformanceFooter({ apendice }: Props) {
  return (
    <footer
      id="prs-pie"
      data-seccion="pie"
      className="prs-pie border-t border-white/10 pt-4 text-[11px] leading-relaxed text-white/40"
    >
      <p>
        Informe de perfil funcional · {apendice.atletaId} · {apendice.fecha} ·{" "}
        <span className="font-mono">
          {apendice.versiones.pae} / {apendice.versiones.pie} / {apendice.versiones.pkb}
        </span>
      </p>

      <p className="mt-1.5 max-w-prose">
        Describe qué evidencia existe sobre las capacidades evaluadas y cuál falta. No constituye
        una valoración de la persona, no compara con otras personas y no indica qué hacer a
        continuación.
      </p>
    </footer>
  );
}
