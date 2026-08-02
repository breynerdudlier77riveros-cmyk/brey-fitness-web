import Button from "@/components/brand/Button";
import { Scale } from "@/components/brand/icons";

// ── Estado vacío del dashboard (Sprint BCS-5.0) ────────────────────────────
// Se muestra cuando el consultorio no tiene ningún cliente contable. No
// inventa cifras en cero: un dashboard lleno de ceros sugiere actividad
// medida que resultó nula, cuando lo que ocurre es que aún no hay nada.

export default function EmptyAnalyticsState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-11 h-11 rounded-2xl border border-white/[0.10] bg-white/[0.03] flex items-center justify-center mb-4">
        <Scale className="w-5 h-5 text-white/40" strokeWidth={1.75} />
      </div>
      <p className="font-bold text-white text-sm mb-1">Todavía no hay datos que analizar</p>
      <p className="text-white/50 text-xs leading-relaxed max-w-sm mb-5">
        Las métricas del consultorio aparecen cuando existe al menos un cliente registrado.
      </p>
      <Button href="/app/composicion-corporal" size="sm">
        Ir a Composición Corporal
      </Button>
    </div>
  );
}
