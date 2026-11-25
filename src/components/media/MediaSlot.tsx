import Image from "next/image";
import type { MediaSlotData } from "@/data/media";
import { cn } from "@/lib/utils";
import MediaVideo from "./MediaVideo";

const enDesarrollo = process.env.NODE_ENV !== "production";

interface Props {
  slot: MediaSlotData;
  sizes: string;
  className?: string;
  prioridad?: boolean;
  zoom?: boolean;
  /** Desplazamiento vertical suave ligado al scroll (CSS .parallax, globals.css). */
  parallax?: boolean;
  /** Encuadre de la imagen (object-position), p. ej. "object-[60%_50%]". */
  encuadre?: string;
  /** Capa de degradado sobre la imagen, para leer texto encima. */
  velo?: string;
  controlesClassName?: string;
  notaClassName?: string;
}

// Sin z-index propio a propósito: así el botón de pausa del video (z-20) puede
// quedar por encima del texto del hero (z-10), que vive fuera de este marco.
// overflow-clip y no overflow-hidden: hidden convierte el marco en contenedor
// de scroll y el parallax (animation-timeline: view()) se mediría contra él,
// que nunca se mueve.
export default function MediaSlot({
  slot,
  sizes,
  className,
  prioridad = false,
  zoom = false,
  parallax = false,
  encuadre,
  velo,
  controlesClassName,
  notaClassName = "inset-x-5 top-5",
}: Props) {
  const marco = cn("relative overflow-clip", className);
  const capaVelo = velo ? <div aria-hidden className={cn("absolute inset-0", velo)} /> : null;

  if (slot.tipo === "video" && slot.src) {
    return (
      <div className={marco}>
        <MediaVideo
          src={slot.src}
          srcMovil={slot.srcMovil ?? undefined}
          poster={slot.poster ?? undefined}
          alt={slot.alt}
          sizes={sizes}
          prioridad={prioridad}
          controlesClassName={controlesClassName}
        />
        {capaVelo}
      </div>
    );
  }

  const imagen = slot.tipo === "video" ? slot.poster : slot.src;
  if (imagen) {
    const foto = (
      <Image
        src={imagen}
        alt={slot.alt}
        fill
        sizes={sizes}
        loading={prioridad ? "eager" : "lazy"}
        fetchPriority={prioridad ? "high" : "auto"}
        className={cn(
          "object-cover",
          encuadre,
          zoom && "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
        )}
      />
    );
    return (
      <div className={marco}>
        {/* El parallax mueve una capa 8 % más alta que el marco, así nunca asoma el borde. */}
        {parallax ? <div className="parallax absolute inset-x-0 -inset-y-[8%]">{foto}</div> : foto}
        {capaVelo}
      </div>
    );
  }

  return (
    <div aria-hidden className={cn(marco, "bg-neutral-900")}>
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_20%,rgba(255,105,0,0.16),transparent_70%)]" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.03)_0_1px,transparent_1px_14px)]" />
      {capaVelo}
      {enDesarrollo && (
        <p
          className={cn(
            "absolute font-display text-xs font-semibold uppercase leading-snug tracking-[0.14em] text-white/55",
            notaClassName
          )}
        >
          {slot.tipo} · {slot.formato}
          <br />
          {slot.pide}
        </p>
      )}
    </div>
  );
}
