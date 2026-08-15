import { Card, CardContent } from "@/components/brand/Card";
import type { TarjetaResumen } from "@/lib/pas/report-v2";

// ── Tarjeta del resumen ejecutivo (PRS v2.0) ───────────────────────────────
//
// Tres datos y nada más: variable, estado y evidencia.
//
// `conNorma` distingue visualmente las que tienen norma de las que no. Es una
// distinción sobre la DISPONIBILIDAD DE EVIDENCIA, no sobre el resultado: la
// tarjeta atenuada dice «no tenemos con qué compararlo», no «salió mal». Por
// eso ninguna variante usa rojo ni verde, y el estado siempre va escrito.

interface Props {
  tarjeta: TarjetaResumen;
}

export default function SummaryMetric({ tarjeta }: Props) {
  return (
    <Card
      className={`prs2-metrica h-full ${tarjeta.conNorma ? "" : "border-white/5 bg-white/[0.02]"}`}
      data-metrica={tarjeta.id}
      data-con-norma={tarjeta.conNorma}
    >
      <CardContent className="space-y-2 p-4">
        <p className="text-[11px] uppercase tracking-wider text-white/40">{tarjeta.variable}</p>

        <p
          className={`text-lg leading-tight font-semibold ${
            tarjeta.conNorma ? "text-white/90" : "text-white/45"
          }`}
        >
          {tarjeta.estado}
        </p>

        <p className="text-[11px] text-white/40">
          <span className="sr-only">Estado de la evidencia: </span>
          {tarjeta.evidencia}
        </p>
      </CardContent>
    </Card>
  );
}
