import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dreamvar.studio',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
