import type { EstadoConsultorio } from "@/lib/bcs/dashboard";

// ── Estado del consultorio (zona 2) ────────────────────────────────────────

function Fila({ etiqueta, valor, nota }: { etiqueta: string; valor: number; nota?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-white/[0.05] last:border-0">
      <dt className="text-sm text-white/60">
        {etiqueta}
        {nota && <span className="block text-[10px] text-white/30 mt-0.5">{nota}</span>}
      </dt>
      <dd className="text-sm font-bold text-white tabular-nums">{valor}</dd>
    </div>
  );
}

export default function ClientStatusCard({ consultorio }: { consultorio: EstadoConsultorio }) {
  return (
    <dl>
      <Fila etiqueta="Activos" valor={consultorio.activos} />
      <Fila etiqueta="Archivados" valor={consultorio.archivados} />
      <Fila etiqueta="Sin mediciones" valor={consultorio.sinMediciones} />
      <Fila etiqueta="Con 1 medición" valor={consultorio.conUnaMedicion} />
      <Fila
        etiqueta="Con seguimiento"
        valor={consultorio.conSeguimiento}
        nota="Dos o más mediciones vigentes"
      />
      <Fila etiqueta="Con más de 5" valor={consultorio.conMasDeCinco} />
      <Fila etiqueta="Con enlace público" valor={consultorio.conEnlacePublico} />
      <Fila
        etiqueta="Sin seguimiento"
        valor={consultorio.sinSeguimiento}
        nota="Todavía no hay dos mediciones que comparar"
      />
    </dl>
  );
}
