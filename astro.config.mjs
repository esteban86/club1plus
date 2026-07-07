import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// ── ÚNICO lugar para ajustar el despliegue en GitHub Pages ──
const GH_USER = "esteban86";      // usuario de GitHub
const REPO = "club1plus";         // repo en GitHub (evita el "+", no soportado en nombres)
export const SITE = `https://${GH_USER}.github.io`;
export const BASE = `/${REPO}`;

export default defineConfig({
  site: SITE,
  base: BASE,
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
