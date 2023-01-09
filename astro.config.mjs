import { defineConfig } from 'astro/config';

// https://astro.build/config
import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  site: 'https://zhangkai803.github.io',
  // base: '/zhangkai803.github.io',
  integrations: [preact()]
});