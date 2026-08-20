import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// ── ÚNICO lugar para ajustar el despliegue en GitHub Pages ──
// Dominio propio (clubdel1.org) vía GitHub Pages custom domain — ver public/CNAME.
export const SITE = "https://clubdel1.org";

// Staging: build con STAGING_BASE=/repo-staging para publicar en
// esteban86.github.io/<repo>. Se sirve con noindex global (ver BaseLayout)
// y robots.txt en Disallow — nunca debe indexarse ni competir con el sitio real.
const STAGING_BASE = process.env.STAGING_BASE;

export default defineConfig({
  site: STAGING_BASE ? "https://esteban86.github.io" : SITE,
  ...(STAGING_BASE ? { base: STAGING_BASE } : {}),
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
          /\/comunidad\/?$/, /\/community\/?$/,
        ].some((re) => re.test(new URL(page).pathname)),
    }),
  ],
});
