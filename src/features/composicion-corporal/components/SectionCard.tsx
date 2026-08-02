import { Card, CardHeader, CardTitle, CardContent } from "@/components/brand/Card";

// ── BCS-C02 · Section Card (BCS Design Handbook 06) ────────────────────────
// "Card + CardHeader/CardTitle heredados. Estructura raíz de cada bloque del
// Reporte. Nunca anida una Section Card dentro de otra."
//
// Sprint 3.0 — se elimina la variante de acordeón para móvil que este
// componente montaba EN PARALELO a la tarjeta. Renderizaba el contenido dos
// veces en el DOM y solo ocultaba una con CSS: el reporte pesaba el doble,
// cada gráfico se dibujaba dos veces (125 SVG medidos en un reporte de 3
// mediciones) y aparecían 3 botones de acordeón que no pintan nada en un
// documento clínico. Un informe se lee desplazándose, no plegándose.
//
// Consecuencia buscada: en móvil las secciones quedan siempre abiertas, y en
// impresión ya no hay que forzar cuál de las dos variantes sale — solo existe
// una.

interface Props {
  titulo: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ titulo, children, className }: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
