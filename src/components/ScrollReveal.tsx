import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Milisegundos de retardo (para escalonar listas). */
  delay?: number;
  className?: string;
}

// Fundido corto al entrar en pantalla. Lo dispara components/motion/Revelado
// (montado en SiteChrome) y lo anima globals.css ("Capa de movimiento"):
// sin JS o con movimiento reducido el contenido se ve quieto desde el inicio.
export default function ScrollReveal({ children, delay = 0, className = "" }: Props) {
  return (
    <div
      data-reveal="up"
      className={className}
      style={delay ? ({ "--retardo": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
