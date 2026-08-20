import { Card, CardContent } from "@/components/brand/Card";
import { metaDe, type ObjetivoAtleta } from "@/lib/pas/informe-humano";

// ── Objetivo declarado (Sprints PAS-8 · PAS-10) ────────────────────────────
//
// Para los objetivos que NO tienen medición en esta evaluación. Los que sí la
// tienen se muestran dentro de su tarjeta de resultado, junto al valor actual,
// porque ahí es donde significan algo.
//
// Aquí no hay progreso, y el encargo es explícito sobre por qué (§23): sin
// medición no hay desde dónde medirlo, y estimarlo con el valor inicial diría
// que no se ha avanzado cuando lo cierto es que no se ha medido. Son cosas
// distintas, y la segunda no se muestra como un 0 %.

interface Props {
  objetivo: ObjetivoAtleta;
}

const TONO: Record<string, string> = {
  alta: "text-orange-400/80",
  media: "text-white/50",
  baja: "text-white/35",
};

export default function GoalCard({ objetivo: o }: Props) {
  const meta = metaDe(o);

  return (
    <Card className="pas8-objetivo-suelto h-full border-white/5 bg-white/[0.02]" data-objetivo={o.id}>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-white/80">{o.nombre}</p>
          <span className={`text-[11px] whitespace-nowrap ${TONO[o.prioridad] ?? TONO.media}`}>
            {o.prioridad}
          </span>
        </div>

        <p className="text-sm text-white/60">
          {o.valorInicial !== null ? (
            <>
              <span className="tabular-nums">{o.valorInicial}</span>
              <span className="mx-2 text-white/30">→</span>
            </>
          ) : null}
          {/* `metaDe` resuelve de una vez si la meta es un valor o un rango.
              `null` significa que el objetivo no declara ninguna, y decirlo es
              más útil que dejar la línea a medias. */}
          {meta !== null ? (
            <span className="tabular-nums font-semibold text-white/80">{meta}</span>
          ) : (
            <span className="text-white/40">
              {o.tipo === "mantener"
                ? "Sin rango declarado"
                : "Sin valor objetivo declarado"}
            </span>
          )}
        </p>

        {/* §23 · El estado se enuncia entero: qué falta y por qué eso impide
            evaluar el avance. «Sin medición» a secas se lee como «no ha hecho
            nada», que es justo lo que no se sabe. */}
        <p className="pas10-sin-datos text-[11px] leading-relaxed text-white/35">
          Resultado actual: no disponible. No puede evaluarse el progreso porque todavía no existe
          una medición compatible en esta evaluación.
          {o.fechaPuntoDePartida !== null
            ? ` Punto de partida del ${o.fechaPuntoDePartida}.`
            : " Punto de partida: no declarado."}
          {o.fechaObjetivo ? ` Fecha objetivo: ${o.fechaObjetivo}.` : ""}
        </p>
      </CardContent>
    </Card>
  );
}
