import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// ── Vitest (Sprint I-03) ────────────────────────────────────────────────────
// Infraestructura mínima: solo `vitest`, sin plugin de React ni entorno DOM.
// Lo que se prueba en este Sprint es la capa de análisis del BCS, que es
// TypeScript puro sin JSX — añadir @vitejs/plugin-react traería además un
// conflicto de peers con @babel/core en este árbol de dependencias, a cambio
// de nada. Si más adelante se prueban componentes, ese plugin y jsdom se
// añaden entonces.
//
// El alias @/* se declara aquí en vez de usar vite-tsconfig-paths: es una
// sola ruta, y evita una dependencia más solo para leer tsconfig.json.

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
});
