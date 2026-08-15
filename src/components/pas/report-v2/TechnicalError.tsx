import { Card, CardContent } from "@/components/brand/Card";

// ── Fallo técnico, no conclusión científica (PRS-2.4) ──────────────────────
//
// LA RAZÓN DE QUE ESTE COMPONENTE EXISTA:
//
//   Si las fichas de la NKB no llegaron al artefacto de producción, o la base
//   no devuelve los registros, lo honesto es decir «no se pudo consultar».
//   Mostrar en su lugar «ninguna norma aplicable» o «no hay mediciones»
//   convertiría un fallo de despliegue en una afirmación sobre la evidencia —
//   y sobre el trabajo de quien evaluó.
//
// Se distingue a propósito de `UnavailableNorm` y de `IncompleteSubject`:
// aquellos describen el estado de la evidencia; este describe el estado del
// sistema. Un profesional tiene que poder saber cuál de los dos está leyendo.
//
// La causa técnica NO se muestra: un mensaje de Postgres o un ENOENT con rutas
// del servidor no ayuda a quien lee el informe y sí filtra detalles de la
// instalación. Va al registro del servidor, no a la pantalla.

interface Props {
  /** Qué falló. Solo determina el rótulo; el detalle lo escribe el servicio. */
  origen: "NKB" | "REGISTROS";
  /** Explicación literal del servicio. No se reescribe aquí. */
  detalle: string;
}

const ROTULO: Record<Props["origen"], string> = {
  NKB: "No se pudo consultar la base de conocimiento normativo",
  REGISTROS: "No se pudieron consultar las pruebas de esta evaluación",
};

export default function TechnicalError({ origen, detalle }: Props) {
  return (
    <Card
      className="prs2-error-tecnico border-amber-500/25 bg-amber-500/[0.04]"
      data-error-tecnico={origen}
      role="status"
    >
      <CardContent className="space-y-2 p-5">
        <p className="text-[11px] uppercase tracking-wider text-amber-400/70">
          Error técnico
        </p>
        <p className="text-sm font-medium text-white/80">{ROTULO[origen]}</p>
        <p className="text-sm leading-relaxed text-white/50">{detalle}</p>
        <p className="text-[11px] text-white/35">
          Vuelve a intentarlo. Si persiste, es un problema de la instalación y no de los datos de
          este atleta.
        </p>
      </CardContent>
    </Card>
  );
}
