import { defineConfig, passthroughImageService } from "astro/config";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import UnoCSS from "@unocss/astro";
import icon from "astro-icon";
import solidJs from "@astrojs/solid-js";

import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  site: "https://wanderoutside.club",
  integrations: [
    sitemap(),
    robotsTxt({
      sitemap: [
        "https://wanderoutside.club/sitemap-index.xml",
        "https://wanderoutside.club/sitemap-0.xml",
      ],
    }),
    solidJs(),
    UnoCSS({ injectReset: true }),
    icon(),
  ],
  image: {
    service: passthroughImageService(),
  },
  vite: {
    assetsInclude: "**/*.riv",
  },
  output: "server",
  adapter: vercel(),
});
