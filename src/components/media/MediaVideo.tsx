"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  src: string;
  srcMovil?: string;
  poster?: string;
  alt: string;
  sizes: string;
  prioridad?: boolean;
  controlesClassName?: string;
}

// Póster primero (next/image optimizado: es lo que se pinta al instante y
// cuenta para el LCP) y el video encima, que aparece con un fundido solo cuando
// de verdad está reproduciendo. Arranca por play(), no por autoPlay:
// - movimiento reducido o "ahorro de datos" → se queda en el póster, sin descargar el video;
// - fuera de pantalla se pausa solo (batería, CPU) y sigue al volver, salvo que
//   la persona lo haya pausado a mano.
// El botón de pausa lo exige WCAG 2.2.2 (movimiento de más de 5 s).
export default function MediaVideo({
  src,
  srcMovil,
  poster,
  alt,
  sizes,
  prioridad = false,
  controlesClassName = "bottom-5 right-5",
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const pausadoAMano = useRef(false);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const conexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || conexion?.saveData) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          if (!pausadoAMano.current) {
            video.play().then(
              () => setReproduciendo(true),
              () => setReproduciendo(false)
            );
          }
        } else if (!video.paused) {
          video.pause();
          setReproduciendo(false);
        }
      },
      { threshold: 0.15 }
    );
    observador.observe(video);
    return () => observador.disconnect();
  }, []);

  function alternar() {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      pausadoAMano.current = false;
      video.play().then(
        () => setReproduciendo(true),
        () => setReproduciendo(false)
      );
    } else {
      pausadoAMano.current = true;
      video.pause();
      setReproduciendo(false);
    }
  }

  return (
    <>
      {poster && (
        <Image
          src={poster}
          alt=""
          fill
          sizes={sizes}
          loading={prioridad ? "eager" : "lazy"}
          fetchPriority={prioridad ? "high" : "auto"}
          className="object-cover"
        />
      )}
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
        onPlaying={() => setMostrar(true)}
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
          mostrar ? "opacity-100" : "opacity-0"
        )}
      >
        {/* El navegador elige la primera <source> cuyo media coincide. */}
        <source src={src} type="video/mp4" media="(min-width: 768px)" />
        <source src={srcMovil ?? src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={alternar}
        aria-label={reproduciendo ? "Pausar video" : "Reproducir video"}
        className={cn(
          "absolute z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/40 bg-black/30 px-5 font-display text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors hover:bg-white/10",
          controlesClassName
        )}
      >
        <span aria-hidden className={cn("size-1.5 rounded-full", reproduciendo ? "bg-orange-500" : "bg-white/60")} />
        {reproduciendo ? "Pausa" : "Reproducir"}
      </button>
    </>
  );
}
