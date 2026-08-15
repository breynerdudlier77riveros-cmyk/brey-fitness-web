import { Card, CardContent, CardHeader, CardTitle } from "@/components/brand/Card";
import type { PanelComparabilidad, TarjetaNormativa } from "@/lib/pas/report-v2";

import ComparabilityPanel from "./ComparabilityPanel";
import EvidenceMatrix from "./EvidenceMatrix";
import NormativeRangeBar from "./NormativeRangeBar";
import ScientificBadge from "./ScientificBadge";
import WarningBlock from "./WarningBlock";

// ── Tarjeta del perfil normativo (PRS v2.0) ────────────────────────────────
//
// La unidad de lectura del informe: una norma, todo lo que se sabe de ella.
//
// El orden no es decorativo. Primero el valor y su situación —lo que se vino a
// saber—, después la barra, después de qué población y con qué método, y por
// último la evidencia, la comparabilidad y las advertencias. Quien deje de leer
// a mitad se lleva el dato correcto; quien siga, se lleva sus límites.
//
// Un ES-2 o un conflicto NO atenúan la tarjeta ni la mueven al final: la
// comparación es válida y la objeción también. Las dos cosas se muestran.

interface Props {
  tarjeta: TarjetaNormativa;
  panel: PanelComparabilidad | undefined;
}

export default function NormativeCard({ tarjeta, panel }: Props) {
  const cuestionada = tarjeta.estadoEvidencia === "CUESTIONADA";
  const enConflicto = tarjeta.conflicto !== "ninguno";

  return (
    <Card
      className="prs2-tarjeta h-full"
      data-norma={tarjeta.normaId}
      data-tipo={tarjeta.tipo}
      data-evidencia={tarjeta.estadoEvidencia}
      data-conflicto={tarjeta.conflicto}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-[11px] uppercase tracking-wider text-white/40">
          {tarjeta.variable}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl leading-none font-semibold tabular-nums text-white">
            {tarjeta.valor}
            <span className="ml-1 text-base font-normal text-white/50">{tarjeta.unidad}</span>
          </p>
          <p className="mt-1.5 text-sm text-white/80">
            {tarjeta.situacion}
            {tarjeta.resumenResultado ? (
              <span className="ml-2 font-semibold tabular-nums text-white">
                {tarjeta.resumenResultado}
              </span>
            ) : null}
          </p>
          <p className="mt-0.5 text-[11px] text-white/40">{tarjeta.poblacion}</p>
        </div>

        {tarjeta.escala ? (
          <NormativeRangeBar
            escala={tarjeta.escala}
            valor={tarjeta.valor}
            unidad={tarjeta.unidad}
            aria={tarjeta.aria}
            tipo={tarjeta.tipo}
          />
        ) : (
          <p className="text-[11px] text-white/40">
            La fuente no publica una escala representable para esta celda.
          </p>
        )}

        {/* La lectura del resultado en una frase. Describe dónde cae el valor;
            no dice qué significa, porque eso sería clasificar. */}
        {tarjeta.explicacion ? (
          <p className="prs2-explicacion text-sm leading-relaxed text-white/70">
            {tarjeta.explicacion}
          </p>
        ) : null}

        {/* El motivo literal del NIE. Es lo que impide leer la barra de más. */}
        <p className="prs2-motivo text-[11px] leading-relaxed text-white/45">{tarjeta.motivo}</p>

        <div className="flex flex-wrap gap-1.5">
          <ScientificBadge clase="tipo" texto={tarjeta.tipo} />
          <ScientificBadge clase="calidad" texto={`Calidad ${tarjeta.calidad}`} />
          <ScientificBadge clase="estado" texto={tarjeta.estadoNorma} destacado={cuestionada} />
          {enConflicto ? (
            <ScientificBadge clase="conflicto" texto="Conflicto documentado" destacado />
          ) : null}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          <dt className="text-white/35">Método</dt>
          <dd className="text-white/60">{tarjeta.metodo}</dd>
          <dt className="text-white/35">Referencia</dt>
          <dd className="text-white/60">{tarjeta.referencia}</dd>
        </dl>

        <EvidenceMatrix
          filas={tarjeta.evidencia}
          titulo={`Evidencia de la norma ${tarjeta.normaId}`}
        />

        {panel ? <ComparabilityPanel panel={panel} /> : null}

        <WarningBlock advertencias={tarjeta.advertencias} />
      </CardContent>
    </Card>
  );
}
