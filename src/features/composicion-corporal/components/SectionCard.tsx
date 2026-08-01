import { Card, CardHeader, CardTitle, CardContent } from "@/components/brand/Card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/brand/Accordion";

// ── BCS-C02 · Section Card (BCS Design Handbook 06) ────────────────────────
// "Card + CardHeader/CardTitle heredados. Colapsable en mobile — usa
// Accordion heredado internamente. Estructura raíz de cada bloque del
// Reporte. Nunca anida una Section Card dentro de otra."
//
// Desktop: siempre expandida (Card normal). Mobile (<md): Accordion de un
// solo ítem, con defaultValue="abierto" para no ocultar contenido por
// defecto — colapsar es una opción del usuario, no el estado inicial.

interface Props {
  titulo: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionCard({ titulo, children, className }: Props) {
  return (
    <>
      {/* Desktop/tablet: siempre expandida */}
      <Card className={`hidden md:block ${className ?? ""}`}>
        <CardHeader>
          <CardTitle className="text-lg">{titulo}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>

      {/* Mobile: colapsable */}
      <Accordion type="single" collapsible defaultValue="abierto" className={`md:hidden ${className ?? ""}`}>
        <AccordionItem value="abierto">
          <AccordionTrigger>{titulo}</AccordionTrigger>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
