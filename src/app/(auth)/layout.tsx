import Link from "next/link";

// ── Shell minimalista para login/signup/reset-password/update-password ─────
// Ni el Navbar/Footer de marketing ni el sidebar del Dashboard — una tarjeta
// centrada. SiteChrome.tsx ya sabe omitir el chrome de marketing en estas
// rutas (ver componente).

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-10 text-sm font-black tracking-[0.10em] uppercase">
        <span className="text-orange-400">Brey</span> <span className="text-white">Fitness</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 sm:p-8">
        {children}
      </div>
    </div>
  );
}
