"use client";

import Link from "next/link";
import { useState } from "react";
import { posts, categoryColor, typeBadge } from "@/lib/content";
import { cardStyles } from "@/components/brand/Card";

const CATEGORIES = ["Todos", "Entrenamiento", "Nutrición", "Mentalidad"] as const;

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
                : "border-white/[0.06] text-white/55 hover:bg-white/[0.04] hover:border-white/[0.12] hover:text-white/90"
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
              className={`${cardStyles.base} ${cardStyles.interactive} group flex flex-col justify-between p-7 min-h-[220px]`}
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
                <p className="text-white/55 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 mt-6 text-xs text-white/50">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-white/50 text-center py-20">
          No hay artículos en esta categoría todavía.
        </p>
      )}
    </div>
  );
}
