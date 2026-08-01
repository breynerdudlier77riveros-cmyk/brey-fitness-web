import { AlertTriangle } from "@/components/brand/icons";
import Button from "@/components/brand/Button";

// ── Estado de error honesto (Sprint I-02) ───────────────────────────────────
// Misma familia visual que EmptyState.tsx (icono en caja + título +
// descripción), pero para el otro caso: no "sin datos todavía" sino "algo
// falló al pedirlos". onRetry, no actionHref — un error.tsx de Next.js
// siempre trae su propio reset() de la Error Boundary, y eso es lo que cada
// error.tsx pasa aquí, nunca una navegación.

interface Props {
  title: string;
  description?: string;
  onRetry: () => void;
}

export default function ErrorState({ title, description, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6">
      <div className="w-11 h-11 rounded-2xl border border-red-500/20 bg-red-500/[0.06] flex items-center justify-center mb-4">
        <AlertTriangle className="w-5 h-5 text-red-400" strokeWidth={1.75} />
      </div>
      <p className="font-bold text-white text-sm mb-1">{title}</p>
      {description && (
        <p className="text-white/50 text-xs leading-relaxed max-w-xs mb-5">{description}</p>
      )}
      <Button onClick={onRetry} size="sm" variant="outline">
        Reintentar
      </Button>
    </div>
  );
}
