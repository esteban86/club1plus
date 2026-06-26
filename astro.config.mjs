import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// ── ÚNICO lugar para ajustar el despliegue en GitHub Pages ──
// Repo objetivo: "club1+" (GitHub puede convertir "+" → "-": confirmar al crear el repo).
const GH_USER = "USUARIO";        // TODO: usuario/org de GitHub
const REPO = "club1+";            // TODO: confirmar nombre real del repo
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
  integrations: [sitemap()],
});
