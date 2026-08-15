import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Transporte de la NKB al artefacto de producción (PRS-2.4) ────────────
  //
  // `cargarNormas()` lee las fichas Markdown de la NKB con `readdirSync` sobre
  // una ruta que se compone en tiempo de ejecución. `@vercel/nft` —el trazador
  // que Next usa en `next build`— analiza `import`, `require` y uso de `fs` de
  // forma ESTÁTICA, y hoy consigue resolver esa lectura: la traza de
  // `/app/rendimiento/evaluacion/[evaluacionId]` ya incluye las quince fichas.
  //
  // Que funcione no basta. Depende de una heurística sobre código que puede
  // refactorizarse: bastaría con componer la ruta de otra manera —desde una
  // variable de entorno, desde un `map`, desde un parámetro— para que el
  // trazador dejara de verla y las fichas desaparecieran del artefacto SIN QUE
  // NADA FALLARA EN EL BUILD. El fallo aparecería en producción, como ENOENT,
  // en la primera evaluación que alguien abriera.
  //
  // Declararlas aquí convierte esa heurística en un contrato. La NKB sigue
  // teniendo UNA sola fuente de verdad —las fichas Markdown de
  // `docs/normative-knowledge-base/`—: esto no genera una segunda
  // representación, no serializa nada y no transforma el contenido. Copia los
  // mismos ficheros, tal cual, al sitio donde el proceso de producción los
  // buscará.
  //
  // El glob cubre solo `fichas/`, que es lo único que `cargarNormas` lee. Los
  // 42 módulos de doctrina de la NKB no se empaquetan: son documentación para
  // personas, y no incluirlos mantiene el artefacto pequeño sin perder ninguna
  // norma.
  //
  // La clave es la ruta de la evaluación, no `/*`: es la única que deriva un
  // informe normativo, y ampliar el glob metería las fichas en trazas que no
  // las necesitan.
  outputFileTracingIncludes: {
    "/app/rendimiento/evaluacion/[evaluacionId]": [
      "docs/normative-knowledge-base/fichas/**/*.md",
    ],
  },

  async redirects() {
    return [
      { source: "/quiz", destination: "/diagnostico", permanent: true },
      { source: "/programas", destination: "/sistemas", permanent: true },
      { source: "/programas/performance-gym", destination: "/sistemas/hipertrofia", permanent: true },
      { source: "/programas/performance-calisthenics", destination: "/sistemas/calistenia", permanent: true },
      { source: "/programas/performance-hybrid", destination: "/sistemas/hibrido", permanent: true },
      { source: "/programas/performance-elite", destination: "/sistemas/elite", permanent: true },
      { source: "/programas/performance-start", destination: "/diagnostico", permanent: true },
      { source: "/programas/:slug", destination: "/sistemas", permanent: true },
      { source: "/app/calendario", destination: "/app/entrenamientos/calendario", permanent: true },
      { source: "/app/historial", destination: "/app/entrenamientos/historial", permanent: true },
    ];
  },
};

export default nextConfig;
