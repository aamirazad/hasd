// @ts-check
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://hasd.aamira.me",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sanity({
      projectId: "jds1gc8w",
      dataset: "production",
      // Set useCdn to false if you're building statically.
      useCdn: false,
    }),
  ],
});
