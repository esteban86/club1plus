import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// ── ÚNICO lugar para ajustar el despliegue en GitHub Pages ──
// Dominio propio (clubdel1.org) vía GitHub Pages custom domain — ver public/CNAME.
export const SITE = "https://clubdel1.org";

export default defineConfig({
  site: SITE,
  trailingSlash: "ignore",
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // fuera del sitemap: páginas noindex (demo/portal/transaccionales) y temporales
      filter: (page) =>
        ![
          /\/admin\/?$/, /\/bienvenida\/?$/, /\/welcome\/?$/,
          /\/gracias\/?$/, /\/thanks\/?$/, /\/ingresar\/?$/, /\/login\/?$/,
          /\/mi-espacio\/?$/, /\/my-space\/?$/, /\/fuentes-cuerpo\/?$/,
        ].some((re) => re.test(new URL(page).pathname)),
    }),
  ],
});
