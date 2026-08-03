import { Card, CardContent, CardHeader, CardTitle } from "@/components/brand/Card";
import { tituloSeccion } from "@/lib/pas/report";
import type { SeccionId } from "@/lib/pas/report";

// ── Contenedor de sección del PRS (Sprint PAS-5.0) ─────────────────────────
// Envoltorio propio del informe de rendimiento. NO se reutiliza el SectionCard
// del BCS: aquel vive en `features/composicion-corporal/` y el encargo separa
// por completo ambos sistemas de informe. Lo que sí se hereda es la primitiva
// genérica `brand/Card`, que no sabe nada de composición corporal.
//
// El título y su número salen de `lib/pas/report/secciones.ts`, no del call
// site: así el orden y la numeración del informe son verificables en un solo
// sitio en vez de repartidos por el árbol de JSX.
//
// Sin acordeón, sin botones, sin estado. Un informe se lee desplazándose.

interface Props {
  id: SeccionId;
  children: React.ReactNode;
  /** Descripción corta bajo el título. Nunca interpretativa. */
  nota?: string;
}

export default function PerformanceSection({ id, children, nota }: Props) {
  return (
    <section
      id={`prs-${id}`}
      data-seccion={id}
      aria-labelledby={`prs-${id}-titulo`}
      className="prs-seccion"
    >
      <Card>
        <CardHeader>
          <CardTitle id={`prs-${id}-titulo`} className="text-base sm:text-lg">
            {tituloSeccion(id)}
          </CardTitle>
          {nota ? <p className="mt-1 text-xs text-white/50">{nota}</p> : null}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </section>
  );
}
