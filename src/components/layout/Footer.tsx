import Link from "next/link";
import LeadCapture from "@/components/LeadCapture";
import SocialLinks from "@/components/SocialLinks";
import Wordmark from "@/components/brand/Wordmark";

const sections = {
  Sistemas: [
    { href: "/sistemas/hipertrofia", label: "Sistema de Hipertrofia" },
    { href: "/sistemas/calistenia", label: "Sistema de Calistenia" },
    { href: "/sistemas/hibrido", label: "Sistema Híbrido" },
    { href: "/sistemas/fuerza", label: "Sistema de Fuerza" },
    { href: "/sistemas/elite", label: "Sistema Elite" },
  ],
  Recursos: [
    { href: "/bps", label: "El Método" },
    { href: "/ejercicios", label: "Ejercicios" },
    { href: "/blog", label: "Blog" },
    { href: "/calculadoras", label: "Calculadoras" },
  ],
  Plataforma: [
    { href: "/diagnostico", label: "Diagnóstico BPS" },
    { href: "/faq", label: "Preguntas frecuentes" },
  ],
  Empresa: [
    { href: "/historia", label: "Nuestra historia" },
    { href: "/bps", label: "El Manifiesto" },
    { href: "/contacto", label: "Contacto" },
  ],
} as const;

const legalLinks = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Términos" },
  { href: "/reembolsos", label: "Reembolsos" },
] as const;

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-neutral-950">
      <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex min-h-11 items-center">
              <Wordmark className="text-3xl" />
            </Link>
            <p className="mt-6 font-display text-3xl font-black uppercase leading-[0.95] md:text-4xl">
              Entrena con ciencia, <span className="text-orange-500">no con ruido.</span>
            </p>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/65">
              Un email por semana con lo mejor de la evidencia aplicada al entrenamiento.
            </p>
            <LeadCapture source="newsletter-footer" buttonLabel="Suscribirme" compact className="mt-6 w-full max-w-md" />
            <SocialLinks className="mt-8" />
          </div>

          <nav aria-label="Pie de página" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-7">
            {(Object.entries(sections) as [string, readonly { href: string; label: string }[]][]).map(([section, links]) => (
              <div key={section}>
                <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-orange-400">{section}</p>
                <ul className="mt-4 flex flex-col">
                  {links.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="inline-flex min-h-11 items-center py-1 text-[14px] leading-snug text-white/70 transition-colors hover:text-white lg:min-h-0 lg:py-1.5"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-white/10 pt-6 font-display text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
          <p>© {new Date().getFullYear()} Brey Fitness · The Brey Performance System</p>
          <div className="flex flex-wrap gap-x-6">
            {legalLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="inline-flex min-h-11 items-center transition-colors hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
