// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://hasd.aamira.me",

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      POCKETBASE_SUPER_EMAIL: envField.string({
        context: "server",
        access: "secret",
      }),
      POCKETBASE_SUPER_PASSWORD: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },

  experimental: {
    fonts: [
      {
        provider: "local",
        name: "Inter",
        cssVariable: "--font-inter",
        variants: [
          {
            weight: "100 900",
            style: "normal",
            src: ["./src/assets/fonts/InterVariable.woff2"],
          },
        ],
      },
    ],
  },
});
