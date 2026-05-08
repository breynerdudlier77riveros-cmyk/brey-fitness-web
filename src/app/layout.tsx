import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Brey Fitness",
  description: "Transforma tu físico con entrenamiento, nutrición y comunidad.",
};

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/productos", label: "Productos" },
  { href: "/videos", label: "Videos" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-950 text-white antialiased`}>

        {/* ── Glassmorphism Navbar ── */}
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-2xl">
          <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="text-xl font-black leading-snug whitespace-nowrap tracking-normal">
              <span className="text-orange-400">Brey</span>
              <span className="text-white"> Fitness</span>
            </Link>

            <ul className="flex gap-7 text-sm font-medium text-white/40">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-white/[0.05] text-center text-xs text-white/20 py-10 tracking-wider">
          © {new Date().getFullYear()} BREY FITNESS · TODOS LOS DERECHOS RESERVADOS
        </footer>

      </body>
    </html>
  );
}
