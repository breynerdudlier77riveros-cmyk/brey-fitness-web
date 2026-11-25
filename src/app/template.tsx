"use client";

import { motion } from "motion/react";

// ── Transición entre páginas (BREY v3.0, Fase 2) ────────────────────────────
// template.tsx se remonta en cada navegación (a diferencia de layout.tsx),
// así que un rise sutil aquí basta para que cada página entre con
// intención — sin la complejidad de animar la salida con AnimatePresence,
// que no encaja de forma robusta con el modelo de navegación de App Router.
// Respeta prefers-reduced-motion vía MotionConfig en layout.tsx.
// Sin fundido de opacidad a propósito: con opacity 0 inicial el HTML llega
// invisible hasta que hidrata el JS, lo que deja la página en blanco en
// móviles lentos y retrasa el LCP.

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 8 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
