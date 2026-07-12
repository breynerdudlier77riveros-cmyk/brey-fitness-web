import { redesActivas } from "@/data/social";
import SocialGlyph from "@/components/ui/social-icons";

// ── Enlaces sociales dinámicos ──────────────────────────────────────────────
// Renderiza únicamente las redes con URL real (data/social.ts). Si ninguna
// existe, no renderiza nada — el layout que lo contiene no se rompe.

export default function SocialLinks({ className = "" }: { className?: string }) {
  const activas = redesActivas();
  if (activas.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {activas.map((red) => (
        <a
          key={red.etiqueta}
          href={red.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={red.etiqueta}
          title={red.etiqueta}
          className="w-9 h-9 rounded-full border border-white/[0.10] flex items-center justify-center text-white/55 hover:text-white hover:border-white/30 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
        >
          <SocialGlyph id={red.id} className="w-4 h-4" />
        </a>
      ))}
    </div>
  );
}
