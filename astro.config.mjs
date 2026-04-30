// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://altitudemusic.be',
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-BE', en: 'en-BE', nl: 'nl-BE' },
      },
      changefreq: 'weekly',
      priority: 0.7,
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname === '/fr/' || url.pathname === '/en/' || url.pathname === '/nl/') {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (url.pathname.includes('/blog/') && url.pathname !== '/fr/blog/' && url.pathname !== '/en/blog/' && url.pathname !== '/nl/blog/') {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'nl'],
    routing: { prefixDefaultLocale: true },
  },
});