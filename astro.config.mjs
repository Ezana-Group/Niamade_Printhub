import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import sanity from "@sanity/astro";

export default defineConfig({
  site: "https://printhub.africa", // keep in sync with site.url in src/data/site.ts
  trailingSlash: "always",
  integrations: [
    tailwind(),
    react(),
    sanity({
      projectId: "m7x6icn3",
      dataset: "production",
      studioBasePath: "/admin",
    }),
  ],
  output: "static",
});
