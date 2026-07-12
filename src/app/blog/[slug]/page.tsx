import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, type Category } from "@/lib/content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: `${post.title} | Brey Fitness`, description: post.excerpt };
}

const categoryColor: Record<Category, string> = {
  Entrenamiento: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  Nutrición: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  Mentalidad: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
};

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: "es",
    author: { "@type": "Organization", name: "Brey Fitness" },
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-orange-400 transition-colors mb-10"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Volver al Blog
      </Link>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${categoryColor[post.category]}`}
        >
          {post.category}
        </span>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
            post.type === "Video"
              ? "bg-orange-500/15 text-orange-400 border-orange-500/30"
              : "bg-sky-500/15 text-sky-400 border-sky-500/30"
          }`}
        >
          {post.type}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold leading-snug tracking-normal mb-4">
        {post.title}
      </h1>

      {/* Date + time */}
      <p className="text-slate-400 text-sm mb-10">
        {post.date} · {post.readTime} de lectura
      </p>

      {/* Divider */}
      <hr className="border-slate-800 mb-10" />

      {/* Body */}
      <article className="space-y-6">
        {post.body.map((paragraph, i) =>
          paragraph.startsWith("### ") ? (
            <h2 key={i} className="font-black text-xl text-white pt-4">
              {paragraph.slice(4)}
            </h2>
          ) : (
            <p key={i} className="text-slate-300 leading-relaxed text-[1.05rem]">
              {paragraph}
            </p>
          )
        )}
      </article>

      {/* Footer CTA */}
      <div className="mt-14 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center">
        <p className="text-slate-300 font-medium mb-4">
          ¿Listo para aplicar esto y transformar tu físico?
        </p>
        <Link
          href="/sistemas"
          className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg shadow-orange-500/20"
        >
          Ver los Sistemas
        </Link>
      </div>
    </main>
  );
}
