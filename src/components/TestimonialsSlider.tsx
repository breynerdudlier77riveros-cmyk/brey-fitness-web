"use client";

import { useState } from "react";

interface Testimonial {
  nombre: string;
  iniciales: string;
  color: string;
  objetivo: string;
  programa: string;
  comentario: string;
  estrellas: number;
}

const testimonials: Testimonial[] = [
  {
    nombre: "Carlos M.",
    iniciales: "CM",
    color: "from-orange-600 to-amber-700",
    objetivo: "Muscle Up logrado en 8 semanas",
    programa: "Muscle Up System",
    comentario:
      "Llevaba un año intentando el muscle up por mi cuenta y no lo lograba. Con este programa entendí qué estaba haciendo mal desde el principio. La progresión está diseñada para que tu cuerpo llegue al punto exacto. En semana 8 lo hice limpio por primera vez.",
    estrellas: 5,
  },
  {
    nombre: "Laura G.",
    iniciales: "LG",
    color: "from-violet-600 to-purple-700",
    objetivo: "Front lever completo en 4 meses",
    programa: "Front Lever Master",
    comentario:
      "El nivel de detalle en los videos es increíble. No es una colección de ejercicios aleatorios — es un sistema real. Cada semana entiendes por qué estás haciendo lo que estás haciendo. Alcancé el front lever tucado en semana 6 y el full lever al cierre del programa.",
    estrellas: 5,
  },
  {
    nombre: "Andrés P.",
    iniciales: "AP",
    color: "from-sky-600 to-blue-700",
    objetivo: "15 kg de músculo en 6 meses",
    programa: "Hipertrofia Inteligente",
    comentario:
      "Antes entrenaba duro pero sin método. Este programa me enseñó que la hipertrofia no es solo volumen — es estímulo inteligente. Gané 15 kg en 6 meses, la mayoría músculo. La tabla de seguimiento semanal fue clave para no estancarme.",
    estrellas: 5,
  },
  {
    nombre: "Valentina R.",
    iniciales: "VR",
    color: "from-pink-600 to-rose-700",
    objetivo: "Transformación completa en 12 semanas",
    programa: "Entrenamiento para Mujeres",
    comentario:
      "Tenía miedo de que el entrenamiento con pesas me hiciera ver masculina. Este programa me demostró que estaba completamente equivocada. En 12 semanas cambié mi composición corporal, gané fuerza real y por primera vez en mi vida me siento orgullosa de lo que mi cuerpo puede hacer.",
    estrellas: 5,
  },
  {
    nombre: "Miguel T.",
    iniciales: "MT",
    color: "from-emerald-600 to-teal-700",
    objetivo: "Handstand estático en 10 semanas",
    programa: "Handstand Academy",
    comentario:
      "El handstand siempre me pareció algo imposible para mí. La academia lo descompone en pasos tan específicos que parece inevitable llegar. En semana 10 tuve mis primeros 20 segundos estáticos. La metodología de progresión es diferente a todo lo que había visto antes.",
    estrellas: 5,
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= n ? "text-orange-400" : "text-white/10"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSlider() {
  const [current, setCurrent] = useState(0);
  const total = testimonials.length;
  const t = testimonials[current];

  function prev() {
    setCurrent((c) => (c - 1 + total) % total);
  }
  function next() {
    setCurrent((c) => (c + 1) % total);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Card */}
      <div className="relative rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 md:p-12 overflow-hidden">
        {/* Ambient */}
        <div
          aria-hidden
          className={`absolute -top-24 -left-24 w-64 h-64 rounded-full bg-gradient-to-br ${t.color} opacity-10 blur-3xl pointer-events-none`}
        />

        <div className="relative flex flex-col md:flex-row gap-8 md:gap-12">
          {/* Left: Avatar + meta */}
          <div className="flex flex-col items-center md:items-start gap-4 md:min-w-[180px]">
            {/* Avatar */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white font-black text-lg tracking-wide">{t.iniciales}</span>
            </div>

            <div>
              <p className="font-black text-white text-base">{t.nombre}</p>
              <p className="text-white/30 text-xs mt-0.5">{t.programa}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Stars n={t.estrellas} />
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase border border-lime-500/20 bg-lime-500/[0.07] text-lime-400">
                {t.objetivo}
              </span>
            </div>
          </div>

          {/* Right: Quote */}
          <div className="flex-1">
            <svg
              className="w-8 h-8 text-orange-500/20 mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-white/60 text-base md:text-lg leading-relaxed italic">
              {t.comentario}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-8 px-1">
        {/* Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? "w-8 bg-orange-500" : "w-1.5 bg-white/15 hover:bg-white/30"
              }`}
              aria-label={`Ir al testimonio ${i + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
            aria-label="Anterior"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
            aria-label="Siguiente"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
