import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Brey Fitness — The Brey Performance System",
    template: "%s | Brey Fitness",
  },
  description:
    "El sistema de entrenamiento basado en evidencia más completo del mercado hispanohablante. 5 ecosistemas de programa, biblioteca de ejercicios y metodología científica.",
  keywords: ["entrenamiento", "calistenia", "gym", "fitness", "hipertrofia", "fuerza", "BPS"],
  openGraph: {
    siteName: "Brey Fitness",
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="h-full">
      <body
        className={`${inter.className} min-h-full flex flex-col bg-slate-950 text-white antialiased`}
      >
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        {plausibleDomain && (
          <script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </body>
    </html>
  );
}
