import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // El quiz evolucionó al Diagnóstico BPS (F6) — los enlaces viejos no mueren.
      { source: "/quiz", destination: "/diagnostico", permanent: true },
    ];
  },
};

export default nextConfig;
