import type { MetadataRoute } from 'next';
import { programas } from '@/data/programs';
import { ejercicios } from '@/data/exercises';
import { posts } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/programas`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/bps`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/diagnostico`, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/ejercicios`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/blog`, priority: 0.7, changeFrequency: 'weekly' },
    { url: `${SITE_URL}/calculadoras`, priority: 0.7, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/historia`, priority: 0.5, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/faq`, priority: 0.5, changeFrequency: 'monthly' },
    { url: `${SITE_URL}/privacidad`, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/terminos`, priority: 0.2, changeFrequency: 'yearly' },
    { url: `${SITE_URL}/reembolsos`, priority: 0.2, changeFrequency: 'yearly' },
  ];

  const programRoutes: MetadataRoute.Sitemap = programas.map((p) => ({
    url: `${SITE_URL}/programas/${p.slug}`,
    priority: 0.9,
    changeFrequency: 'monthly',
  }));

  const exerciseRoutes: MetadataRoute.Sitemap = ejercicios.map((e) => ({
    url: `${SITE_URL}/ejercicios/${e.slug}`,
    priority: 0.6,
    changeFrequency: 'monthly',
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.date,
    priority: 0.6,
    changeFrequency: 'monthly',
  }));

  return [...staticRoutes, ...programRoutes, ...exerciseRoutes, ...postRoutes];
}
