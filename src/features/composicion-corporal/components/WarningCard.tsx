import { AlertTriangle } from "@/components/brand/icons";

// ── BCS-C04 · Warning Card (BCS Design Handbook 06) ────────────────────────
// "Variante de Card con borde izquierdo amarillo + ícono de advertencia +
// texto. NUNCA una acción de 'corregir' inline. NUNCA el rojo de error —
// amarillo y rojo no son intercambiables (Ley 2)." role="status" +
// aria-live="polite" (Accesibilidad 15) porque puede aparecer dinámicamente
// tras registrar una medición.

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function WarningCard({ children, className }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex gap-3 rounded-2xl border border-yellow-500/25 bg-yellow-500/[0.06] border-l-4 border-l-yellow-500 p-4 ${className ?? ""}`}
    >
      <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
      <p className="text-sm text-yellow-100/80 leading-relaxed">{children}</p>
    </div>
  );
}
