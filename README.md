# El Club del 1+ — Sitio web

Sitio multipágina bilingüe (ES/EN) en Astro. Estático, desplegado en GitHub Pages bajo el
dominio propio **clubdel1.org**. Donación vía Treli (sin backend). Fiel al design system
"El Club del 1+".

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321/
npm run check    # tipos (astro check)
npm test         # vitest
npm run build    # genera dist/
```

## Despliegue (GitHub Pages, dominio propio)

1. `astro.config.mjs` fija `SITE = "https://clubdel1.org"` — único lugar a ajustar si
   cambia el dominio (`robots.txt` y el sitemap se derivan de ahí).
2. `public/CNAME` contiene `clubdel1.org` — GitHub Pages lo necesita para servir el
   dominio propio; no borrar.
3. DNS en el proveedor del dominio (hoy GoDaddy): registros A del apex a las IPs de
   GitHub Pages (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) y `www` como
   `CNAME` a `esteban86.github.io`.
4. En el repo: Settings → Pages → Custom domain = `clubdel1.org` (ya fijado vía API;
   "Enforce HTTPS" se habilita solo una vez GitHub valida el DNS).
5. Push a `main`: el workflow `.github/workflows/deploy.yml` construye y publica.

## Editar contenido

- Textos de UI / navegación: `src/i18n/es.json` y `src/i18n/en.json` (mismas claves).
- Tiers, historias, stats, aliados, equipo: `src/content/**` (Markdown + frontmatter,
  un archivo por idioma con campo `lang`).
- **URLs de Treli:** en cada `src/content/tiers/*.md` (`urlMonthly`, `urlOneTime`).
  Mientras estén vacías, los botones caen al fallback `TIER_FALLBACK` en `src/lib/donate.ts`.

## Estructura

- `src/layouts/BaseLayout.astro` — head SEO/OG/hreflang/JSON-LD, view transitions, nav, footer.
- `src/components/brand/` — componentes de marca (Button, Highlight, LogoBadge, etc.).
- `src/components/sections/` — secciones (Hero, Mission, Impact, Stories, Tiers, DonateCTA, Nav, Footer).
- `src/pages/` — páginas ES en la raíz, EN bajo `en/`.
- `src/styles/tokens.css` — tokens del design system; `global.css` — base + utilidades.

## Pendientes (flags)

- Fuente real de marca (hoy: Hanken Grotesk, sustitución del design system).
- URLs reales de Treli por tier (incluido el link de monto libre).
- Fotos reales de beneficiarias/equipo (campo `photo` en las colecciones; hoy se muestran iniciales).

## Stack

Astro 5 · TypeScript · @astrojs/sitemap · @fontsource · Vitest · GitHub Actions.
