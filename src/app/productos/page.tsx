import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos | Brey Fitness",
  description: "Programas y guías para acelerar tu transformación.",
};

const productos = [
  {
    id: "programa-hipertrofia",
    nombre: "Programa Hipertrofia 12 Semanas",
    precio: "$29.99",
    badge: "Más vendido",
    badgeColor: "text-orange-400 border-orange-500/20 bg-orange-500/[0.07]",
    descripcion:
      "El plan de entrenamiento más completo para ganar masa muscular de forma progresiva. Incluye periodización, técnicas avanzadas y tabla de seguimiento semana a semana.",
    featured: true,
  },
  {
    id: "guia-nutricion",
    nombre: "Guía de Nutrición Deportiva",
    precio: "$19.99",
    badge: "E-book",
    badgeColor: "text-sky-400 border-sky-500/20 bg-sky-500/[0.07]",
    descripcion:
      "Planes de alimentación y recetas fitness para cada objetivo.",
    featured: false,
  },
  {
    id: "suplementacion-basica",
    nombre: "Pack Suplementación Básica",
    precio: "$49.99",
    badge: "Bundle",
    badgeColor: "text-emerald-400 border-emerald-500/20 bg-emerald-500/[0.07]",
    descripcion:
      "Proteína, creatina y multivitamínico seleccionados para comenzar con lo esencial.",
    featured: false,
  },
];

function IconPackage() {
  return (
    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}

export default function ProductosPage() {
  const [featured, ...rest] = productos;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">

      {/* ── Header ── */}
      <div className="mb-10 md:mb-14">
        <p className="text-[11px] tracking-[0.22em] uppercase text-white/25 mb-3 font-medium">
          Catálogo
        </p>
        <h1 className="font-black text-4xl sm:text-5xl text-white mb-3">
          Productos
        </h1>
        <p className="text-white/35 max-w-lg leading-relaxed">
          Programas y guías diseñados para acelerar tu transformación, sin importar tu punto de partida.
        </p>
      </div>

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[300px] gap-4">

        {/* Featured product — full width on md, 2-col × 2-row on lg */}
        <Link
          href={`/productos/${featured.id}`}
          className="group md:col-span-2 lg:col-span-2 lg:row-span-2 flex flex-col bg-slate-900/80 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-slate-600/60 hover:bg-slate-900 transition-all duration-500"
        >
          {/* Image placeholder with gradient */}
          <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/60 flex items-center justify-center relative min-h-[200px]">
            <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
              <IconPackage />
            </div>
            {/* Badge */}
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${featured.badgeColor}`}>
              {featured.badge}
            </span>
          </div>

          {/* Info */}
          <div className="p-7 flex flex-col gap-3">
            <h2 className="font-black text-xl sm:text-2xl text-white group-hover:text-orange-400 transition-colors duration-300 leading-snug">
              {featured.nombre}
            </h2>
            <p className="text-white/35 text-sm leading-relaxed">{featured.descripcion}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="font-black text-3xl text-white">{featured.precio}</p>
              <span className="inline-flex items-center gap-1.5 text-sm text-white/40 group-hover:text-white/70 transition-colors">
                Ver programa
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </div>
          </div>
        </Link>

        {/* Regular products */}
        {rest.map((p) => (
          <Link
            key={p.id}
            href={`/productos/${p.id}`}
            className="group flex flex-col bg-slate-900/80 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-slate-600/60 hover:bg-slate-900 transition-all duration-500"
          >
            {/* Image placeholder */}
            <div className="flex-1 bg-gradient-to-br from-slate-800/80 to-slate-900/60 flex items-center justify-center relative min-h-[120px]">
              <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center">
                <IconPackage />
              </div>
              <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${p.badgeColor}`}>
                {p.badge}
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col gap-2">
              <h2 className="font-black text-base text-white group-hover:text-orange-400 transition-colors duration-300 leading-snug">
                {p.nombre}
              </h2>
              <p className="text-white/30 text-xs leading-relaxed line-clamp-2">{p.descripcion}</p>
              <p className="font-black text-xl text-white mt-1">{p.precio}</p>
            </div>
          </Link>
        ))}

      </div>
    </main>
  );
}
