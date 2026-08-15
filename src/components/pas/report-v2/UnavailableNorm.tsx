import { Card, CardContent } from "@/components/brand/Card";
import type { TarjetaSinNorma } from "@/lib/pas/report-v2";

// ── Capacidad sin norma admisible (PRS v2.0) ───────────────────────────────
//
// La tarjeta gris. Y el texto importa tanto como el color:
//
//   «Norma no disponible» habla de NUESTRA base de conocimiento.
//   «Insuficiente» hablaría del atleta.
//
// Son afirmaciones sobre cosas distintas, y confundirlas es el error que la NKB
// persigue desde su primer módulo. Por eso el detalle es literal del eslabón y
// no se reescribe aquí — hay un test que comprueba que ni «insuficiente», ni
// «bajo», ni «deficiente» aparecen en este componente.

interface Props {
  tarjeta: TarjetaSinNorma;
}

export default function UnavailableNorm({ tarjeta }: Props) {
  return (
    <Card className="prs2-sin-norma h-full border-white/5 bg-white/[0.02]" data-sin-norma={tarjeta.id}>
      <CardContent className="space-y-1.5 p-4">
        <p className="text-sm font-medium text-white/60">{tarjeta.variable}</p>
        <p className="text-[11px] uppercase tracking-wider text-white/35">Norma no disponible</p>
        <p className="text-sm leading-relaxed text-white/45">{tarjeta.detalle}</p>
      </CardContent>
    </Card>
  );
}
