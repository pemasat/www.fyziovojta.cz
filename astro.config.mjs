// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.fyziovojta.cz',
  // zachová původní adresy /zivotopis.html, /kontakt.html…
  build: { format: 'file' },
  trailingSlash: 'never',
  integrations: [sitemap()],
});
