import { InfoIcon } from "@/components/brand/icons";

// ── BCS-C05 · Info Card (BCS Design Handbook 06) ───────────────────────────
// "Variante de Card con borde izquierdo azul + ícono de información.
// NUNCA una cifra propia. Uso: junto a clasificaciones con aviso
// poblacional (IMC, WHR). NUNCA para errores ni advertencias." role="note".

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function InfoCard({ children, className }: Props) {
  return (
    <div
      role="note"
      className={`flex gap-3 rounded-2xl border border-sky-500/25 bg-sky-500/[0.06] border-l-4 border-l-sky-500 p-4 ${className ?? ""}`}
    >
      <InfoIcon className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
      <p className="text-sm text-sky-100/80 leading-relaxed">{children}</p>
    </div>
  );
}
