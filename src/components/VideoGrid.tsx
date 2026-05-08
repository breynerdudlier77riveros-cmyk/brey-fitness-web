"use client";

import { useState } from "react";
import { videos, type Category } from "@/lib/content";

const CATEGORIES = ["Todos", "Entrenamiento", "Nutrición", "Mentalidad"] as const;

const categoryColor: Record<Category, string> = {
  Entrenamiento: "text-emerald-400",
  Nutrición:     "text-violet-400",
  Mentalidad:    "text-yellow-400",
};

/* ── Play button: transparent by default, naranja on hover ── */
function PlayIcon({ large = false }: { large?: boolean }) {
  const wrap = large ? "w-14 h-14 rounded-2xl" : "w-11 h-11 rounded-xl";
  const icon = large ? "w-6 h-6" : "w-5 h-5";
  return (
    <div
      className={`${wrap} bg-white/[0.08] border border-white/[0.1] group-hover:bg-orange-500/80 group-hover:border-orange-500/30 flex items-center justify-center backdrop-blur-sm transition-all duration-500`}
    >
      <svg className={`${icon} text-white ml-0.5`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

/* ── Shared card base classes ── */
const CARD_BASE =
  "group bg-slate-900/80 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-slate-600/60 hover:bg-slate-900 transition-all duration-500 cursor-pointer flex flex-col";

export default function VideoGrid() {
  const [active, setActive] = useState<string>("Todos");

  const filtered =
    active === "Todos" ? videos : videos.filter((v) => v.category === active);

  return (
    <div>
      {/* ── Sleek filters ── */}
      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-xl text-sm font-medium border transition-all duration-500 ${
              active === cat
                ? "bg-white/[0.09] border-white/[0.18] text-white"
                : "border-white/[0.06] text-white/30 hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-white/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((video, i) => {
          const featured = i === 0 && filtered.length > 1;

          return (
            <div
              key={video.id}
              className={`${CARD_BASE} ${featured ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              {/* Thumbnail */}
              <div
                className={`relative bg-slate-800/60 flex items-center justify-center ${
                  featured ? "aspect-[21/9]" : "aspect-video"
                }`}
              >
                {video.youtubeId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <PlayIcon large={featured} />
                )}

                {/* Category badge */}
                <span
                  className={`absolute top-3 left-3 text-xs font-medium ${categoryColor[video.category]} bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/[0.07]`}
                >
                  {video.category}
                </span>

                {/* Duration — monospaced, glass */}
                <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white/70 text-xs px-2.5 py-1 rounded-lg font-mono tracking-wider border border-white/[0.07]">
                  {video.duration}
                </span>
              </div>

              {/* Info */}
              <div className={`flex flex-col gap-2 flex-1 ${featured ? "p-7" : "p-5"}`}>
                <h3
                  className={`font-black text-white group-hover:text-orange-400 transition-colors duration-300 leading-snug ${
                    featured ? "text-xl sm:text-2xl" : "text-sm"
                  }`}
                >
                  {video.title}
                </h3>
                <p
                  className={`text-white/35 leading-relaxed ${
                    featured ? "text-sm" : "text-xs line-clamp-2"
                  }`}
                >
                  {video.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-white/20 text-center py-20">
          No hay videos en esta categoría todavía.
        </p>
      )}
    </div>
  );
}
