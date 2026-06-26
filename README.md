# El Club del 1+ — Sitio web

Sitio multipágina bilingüe (ES/EN) en Astro. Estático, desplegado en GitHub Pages.
Donación vía Treli (sin backend). Fiel al design system "El Club del 1+".

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321/club1plus/
npm run check    # tipos (astro check)
npm test         # vitest
npm run build    # genera dist/
```

## Despliegue (GitHub Pages)

1. Crear el repo en GitHub con el nombre **`club1plus`** (evita el `+`, no soportado
   en nombres de repo de GitHub).
2. En `astro.config.mjs`, fijá `GH_USER` con tu usuario/org de GitHub (`REPO` ya es
   `club1plus`; es el único lugar — `robots.txt` y el sitemap se derivan de ahí).
3. En el repo: Settings → Pages → Source = **GitHub Actions**.
4. Push a `main`: el workflow `.github/workflows/deploy.yml` construye y publica.

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
- URLs reales de Treli por tier.
- Imagen OG diseñada 1200×630 (`public/og-default.png` es un placeholder).
- Fotos reales de beneficiarias/equipo (campo `photo` en las colecciones; hoy se muestran iniciales).
- Confirmar usuario/repo de GitHub en `astro.config.mjs`.

## Stack

Astro 5 · TypeScript · @astrojs/sitemap · @fontsource · Vitest · GitHub Actions.
