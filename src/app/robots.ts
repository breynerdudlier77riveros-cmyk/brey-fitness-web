import type { MetadataRoute } from 'next';
import { SITE_URL, APP_PREFIX } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', `${APP_PREFIX}/`],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
