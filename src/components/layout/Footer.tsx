import Link from "next/link";
import LeadCapture from "@/components/LeadCapture";

const sections = {
  Programas: [
    { href: "/programas/performance-start", label: "Performance Start" },
    { href: "/programas/performance-gym", label: "Performance Gym" },
    { href: "/programas/performance-calisthenics", label: "Performance Calisthenics" },
    { href: "/programas/performance-hybrid", label: "Performance Hybrid" },
    { href: "/programas/performance-elite", label: "Performance Elite" },
  ],
  Recursos: [
    { href: "/bps", label: "El Método" },
    { href: "/ejercicios", label: "Ejercicios" },
    { href: "/blog", label: "Blog" },
    { href: "/calculadoras", label: "Calculadoras" },
  ],
  Plataforma: [
    { href: "/quiz", label: "¿Cuál es mi programa?" },
    { href: "/historia", label: "Historia" },
    { href: "/faq", label: "Preguntas frecuentes" },
  ],
} as const;

const legalLinks = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/reembolsos", label: "Reembolsos" },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Newsletter */}
        <div className="mb-14 pb-14 border-b border-white/[0.05] flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <p className="font-black text-white text-base mb-1">
              Entrena con ciencia, no con ruido.
            </p>
            <p className="text-white/55 text-xs leading-relaxed max-w-sm">
              Un email por semana con lo mejor de la evidencia aplicada al entrenamiento.
            </p>
          </div>
          <LeadCapture
            source="newsletter-footer"
            buttonLabel="Suscribirme"
            compact
            className="w-full md:max-w-sm"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-sm font-black tracking-[0.10em] uppercase">
              <span className="text-orange-400">Brey</span>
              <span className="text-white"> Fitness</span>
            </Link>
            <p className="text-white/50 text-xs mt-4 leading-relaxed max-w-[200px]">
              El sistema de entrenamiento basado en evidencia para el atleta hispanohablante.
            </p>
            <p className="text-white/40 text-[10px] mt-6 tracking-[0.15em] uppercase font-medium">
              The Brey Performance System
            </p>
          </div>

          {/* Link columns */}
          {(Object.entries(sections) as [string, readonly { href: string; label: string }[]][]).map(([section, links]) => (
            <div key={section}>
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-5">
                {section}
              </p>
              <ul className="flex flex-col gap-3">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-xs text-white/55 hover:text-white/90 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/[0.05] pt-6 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[10px] text-white/50 tracking-widest uppercase">
            © {new Date().getFullYear()} Brey Fitness · Todos los derechos reservados
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[10px] text-white/50 hover:text-white/90 tracking-widest uppercase transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
