import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TooltipProvider } from "@/components/brand/Tooltip";
import { Toaster } from "@/components/brand/Toast";
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
    "Sistemas de entrenamiento construidos bajo la metodología BPS. Evidencia científica, diagnóstico personalizado y un ecosistema que evoluciona contigo.",
  openGraph: {
    siteName: "Brey Fitness",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
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
        {/* reducedMotion="user": todo motion.* de la app respeta
            prefers-reduced-motion desde este único punto — ningún
            componente individual necesita llamar useReducedMotion(). */}
        <MotionConfig reducedMotion="user">
          <TooltipProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </TooltipProvider>
          <Toaster />
        </MotionConfig>
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
