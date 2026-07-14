import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, categoryBadge, typeBadge } from "@/lib/content";
import { ArrowLeft } from "@/components/brand/icons";
import Button from "@/components/brand/Button";
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
        className="inline-flex items-center gap-1.5 text-sm text-white/55 hover:text-orange-400 transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        Volver al Blog
      </Link>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${categoryBadge[post.category]}`}
        >
          {post.category}
        </span>
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${typeBadge[post.type].className}`}
        >
          {post.type}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-black leading-snug tracking-tight mb-4">
        {post.title}
      </h1>

      {/* Date + time */}
      <p className="text-white/50 text-sm mb-10">
        {post.date} · {post.readTime} de lectura
      </p>

      {/* Divider */}
      <hr className="border-white/[0.06] mb-10" />

      {/* Body */}
      <article className="space-y-6">
        {post.body.map((paragraph, i) =>
          paragraph.startsWith("### ") ? (
            <h2 key={i} className="font-black text-xl text-white pt-4">
              {paragraph.slice(4)}
            </h2>
          ) : (
            <p key={i} className="text-white/70 leading-relaxed text-[1.05rem]">
              {paragraph}
            </p>
          )
        )}
      </article>

      {/* Footer CTA */}
      <div className="mt-14 p-6 bg-white/[0.02] border border-white/[0.07] rounded-2xl text-center">
        <p className="text-white/60 font-medium mb-4">
          ¿Listo para aplicar esto y transformar tu físico?
        </p>
        <Button href="/sistemas" size="lg">
          Ver los Sistemas
        </Button>
      </div>
    </main>
  );
}
