import type { ApendiceInforme } from "@/lib/pas/report";

// ── Portada del informe (Sprint PAS-5.0) ───────────────────────────────────
// Identifica el documento y nada más. Sin logotipos de marca, sin reclamos y
// sin ninguna cifra: un titular numérico en portada acabaría leyéndose como
// la conclusión del informe, y este informe no tiene conclusión.
//
// La fecha llega en el DTO. Este componente no lee el reloj — si lo hiciera,
// portada y pie podrían discrepar en un informe generado a medianoche.

interface Props {
  apendice: ApendiceInforme;
  /** Nombre visible del atleta. Si no se aporta, se muestra su identificador. */
  atleta?: string;
}

export default function PerformanceHeader({ apendice, atleta }: Props) {
  return (
    <header id="prs-portada" data-seccion="portada" className="prs-portada">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">
        Performance Assessment System
      </p>

      <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
        Informe de perfil funcional
      </h1>

      <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
        <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
          <dt className="text-white/50">Atleta</dt>
          <dd className="font-semibold">{atleta ?? apendice.atletaId}</dd>
        </div>

        <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
          <dt className="text-white/50">Fecha de emisión</dt>
          <dd className="font-semibold">{apendice.fecha}</dd>
        </div>
      </dl>

      <p className="mt-6 max-w-prose text-xs leading-relaxed text-white/50">
        Este documento describe qué evidencia existe sobre las capacidades del atleta y cuál falta.
        No contiene juicios, comparaciones con otras personas ni indicaciones sobre qué hacer.
      </p>
    </header>
  );
}
