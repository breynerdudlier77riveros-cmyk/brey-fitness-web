"use client";

import Link from "next/link";
import { useState } from "react";
import { posts, type Category, type ContentType } from "@/lib/content";

const CATEGORIES = ["Todos", "Entrenamiento", "Nutrición", "Mentalidad"] as const;

const typeBadge: Record<ContentType, { label: string; className: string }> = {
  Lectura: { label: "Lectura", className: "text-sky-400 border-sky-500/20 bg-sky-500/[0.07]" },
  Video:   { label: "Video",   className: "text-orange-400 border-orange-500/20 bg-orange-500/[0.07]" },
};

const categoryColor: Record<Category, string> = {
  Entrenamiento: "text-emerald-400",
  Nutrición:     "text-violet-400",
  Mentalidad:    "text-yellow-400",
};

export default function BlogGrid() {
  const [active, setActive] = useState<string>("Todos");

  const filtered =
    active === "Todos" ? posts : posts.filter((p) => p.category === active);

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
        {filtered.map((post) => {
          const badge = typeBadge[post.type];
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col justify-between p-7 rounded-3xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-sm hover:border-slate-600/60 hover:bg-slate-900 transition-all duration-500 min-h-[220px]"
            >
              {/* Badges */}
              <div className="flex items-center gap-2 mb-5">
                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}>
                  {badge.label}
                </span>
                <span className={`text-xs font-medium ${categoryColor[post.category]}`}>
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="font-black text-base text-white group-hover:text-orange-400 transition-colors duration-300 leading-snug mb-2">
                  {post.title}
                </h2>
                <p className="text-white/30 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 mt-6 text-xs text-white/20">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-white/20 text-center py-20">
          No hay artículos en esta categoría todavía.
        </p>
      )}
    </div>
  );
}
