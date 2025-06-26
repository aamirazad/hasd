// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import alpinejs from "@astrojs/alpinejs";

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
            POCKETBASE__SUPER_PASSWORD: envField.string({
                context: "server",
                access: "secret",
            }),
        },
    },
    integrations: [alpinejs()],
});
