"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

// ── Coreografía de entrada del Hero (Motion) ────────────────────────────────
// Reemplaza las clases hero-enter/hero-enter-2/3/4 + preview-in de
// globals.css. Extraído a un componente cliente aparte porque app/page.tsx
// es un Server Component — motion.* no puede vivir ahí directo. La página
// sigue componiendo JSX estático normal como children de estas piezas.

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const previewItem: Variants = {
  hidden: { opacity: 0, y: 26, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function HeroStagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}

export function HeroItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

export function HeroPreviewItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={previewItem}>
      {children}
    </motion.div>
  );
}
