import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://printhub.africa", // keep in sync with site.url in src/data/site.ts
  trailingSlash: "always",
  integrations: [tailwind()],
  output: "static",
});
