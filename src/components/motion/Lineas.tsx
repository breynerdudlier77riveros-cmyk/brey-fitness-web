import { Fragment, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  as?: "h1" | "h2" | "h3" | "p";
  /** Cada elemento es una línea con su propia máscara. */
  lineas: ReactNode[];
  className?: string;
  /** "scroll": sube al entrar en pantalla. "carga": entrada del hero, sin esperar a JS. */
  modo?: "scroll" | "carga";
  /** Milisegundos antes de la primera línea. */
  retardo?: number;
  id?: string;
}

// Titular que sube línea a línea desde su máscara (globals.css: .linea).
// El espacio entre líneas no se ve (está entre bloques) pero evita que un
// lector de pantalla junte la última palabra de una línea con la siguiente.
export default function Lineas({ as: Tag = "h2", lineas, className, modo = "scroll", retardo = 0, id }: Props) {
  return (
    <Tag
      id={id}
      className={cn(modo === "carga" && "entra-linea", className)}
      data-reveal={modo === "scroll" ? "lines" : undefined}
      style={retardo ? ({ "--retardo": `${retardo}ms` } as CSSProperties) : undefined}
    >
      {lineas.map((linea, i) => (
        <Fragment key={i}>
          <span className="linea">
            <span style={{ "--l": i } as CSSProperties}>{linea}</span>
          </span>
          {i < lineas.length - 1 && " "}
        </Fragment>
      ))}
    </Tag>
  );
}
