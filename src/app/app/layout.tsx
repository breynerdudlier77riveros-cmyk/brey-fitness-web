import type { Metadata } from "next";
import AppSidebar from "@/components/app/AppSidebar";

// ── Shell del Dashboard (BREY v1.1) ─────────────────────────────────────────
// Deliberadamente SIN Navbar/Footer de marketing (ver SiteChrome.tsx) — esto
// debe sentirse como una aplicación, no como una página. noindex: es una
// herramienta interna sobre datos simulados, no contenido público.

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard | Brey" },
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
