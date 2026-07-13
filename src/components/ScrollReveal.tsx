"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
}

// Revela al entrar en viewport — mismo fade+slide de siempre, ahora sobre
// Motion en vez de IntersectionObserver+CSS a mano. API externa idéntica
// (children/delay/className) — ningún call site cambia. Motion respeta
// prefers-reduced-motion automáticamente (reduce a un fundido sin
// desplazamiento cuando el sistema lo pide).
export default function ScrollReveal({ children, delay = 0, className = "" }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.07 }}
      transition={{
        duration: 0.85,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
