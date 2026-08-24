import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";

// App de socios — Worker separado del sitio estático, desplegado en app.clubdel1.org.
export default defineConfig({
  site: "https://app.clubdel1.org",
  output: "server",
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
});
