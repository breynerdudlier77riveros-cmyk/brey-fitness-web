import { Card, CardContent, CardHeader, CardTitle } from "@/components/brand/Card";

// ── Primer call site real de la familia Card de brand/Card.tsx ─────────────
// Esa familia (Card/CardHeader/CardTitle/CardContent/CardFooter) ya existía,
// ya está adaptada a la marca (ring→border, rounded-xl→2xl) y su propio
// comentario decía literalmente "lista para el Dashboard" — sin tener
// todavía un uso real en ningún lado. Este componente le da ese primer uso
// en vez de inventar un cuarto patrón de tarjeta además de cardStyles
// (marketing), la familia Card sin usar, y algo nuevo.
//
// title (Sprint 4, Perfil Persistente): opcional y retrocompatible — sin
// title, idéntico a como era antes (CardHeader ni se monta).

interface Props {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function DashboardCard({ children, className, title }: Props) {
  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
