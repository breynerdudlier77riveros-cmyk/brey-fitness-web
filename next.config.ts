import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // El quiz evolucionó al Diagnóstico BPS (F6) — los enlaces viejos no mueren.
      { source: "/quiz", destination: "/diagnostico", permanent: true },
      // Arquitectura BREY v2: Programas → Sistemas (v1.6).
      { source: "/programas", destination: "/sistemas", permanent: true },
      { source: "/programas/performance-gym", destination: "/sistemas/hipertrofia", permanent: true },
      { source: "/programas/performance-calisthenics", destination: "/sistemas/calistenia", permanent: true },
      { source: "/programas/performance-hybrid", destination: "/sistemas/hibrido", permanent: true },
      { source: "/programas/performance-elite", destination: "/sistemas/elite", permanent: true },
      // Start ya no es un producto: el nivel lo asigna el Diagnóstico.
      { source: "/programas/performance-start", destination: "/diagnostico", permanent: true },
      { source: "/programas/:slug", destination: "/sistemas", permanent: true },
      // Core Product: Calendario/Historial se anidaron bajo Entrenamientos.
      { source: "/app/calendario", destination: "/app/entrenamientos/calendario", permanent: true },
      { source: "/app/historial", destination: "/app/entrenamientos/historial", permanent: true },
    ];
  },
};

export default nextConfig;
