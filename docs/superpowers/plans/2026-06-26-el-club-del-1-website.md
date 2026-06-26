# El Club del 1+ — Sitio Web — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir el sitio web multipágina bilingüe (ES/EN) de El Club del 1+ en Astro, fiel al design system rebrandeado a "1+", desplegable en GitHub Pages, con donación vía Treli y mejores prácticas de rendimiento/a11y/SEO/i18n.

**Architecture:** Astro estático (output `static`). Los tokens CSS del design system se portan tal cual; cada componente y sección se reimplementa como `.astro` con CSS scoped/por token. i18n nativo de Astro (ES en raíz, EN bajo `/en`). Contenido editable en Content Collections (zod). JS mínimo: `<ClientRouter />` (view transitions), un toggle de donación y un observer de reveal, todo vanilla. Donación = enlaces a checkout hospedado de Treli (sin backend).

**Tech Stack:** Astro 5, TypeScript, `@astrojs/sitemap`, `astro-icon` + `@iconify-json/lucide` (SVG inline, sin runtime), `@fontsource-variable/hanken-grotesk` + `@fontsource/space-mono` (self-host), Vitest + `astro/container` para tests de render, GitHub Actions (`withastro/action`) para deploy.

**Convenciones globales:**
- El design system de referencia vive en `.ds-source/` (gitignored). NO se importa; se porta.
- `base` y `site` viven en **un solo lugar**: `astro.config.mjs`. Repo objetivo: `club1+` (⚠️ GitHub puede convertirlo a `club1-`; confirmar URL real al crear el repo).
- Idiomas: `es` (default, raíz) y `en` (bajo `/en`). Nunca usar "1%"; la unidad es "tu +".
- Commits: mensajes en español, imperativo, con `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

---

## File Structure

```
astro.config.mjs            # site, base, i18n, integraciones (sitemap, icon)
vitest.config.ts            # getViteConfig de astro/config
tsconfig.json
package.json
.github/workflows/deploy.yml

public/
  logo-badge-green.svg  logo-badge-dark.svg   # copiados del DS
  favicon.svg  og-default.png  robots.txt

src/
  styles/
    tokens.css              # colors+typography+spacing+radius+effects (portado del DS)
    global.css              # reset, base, motivos +, scrims, reveal, reduced-motion, utils
  i18n/
    es.json  en.json        # strings de UI/nav/CTAs
    routes.ts               # mapa de rutas equivalentes ES↔EN (para hreflang + switcher)
    utils.ts                # getLangFromUrl, useTranslations, withBase, getRoute
  content/
    config.ts               # colecciones: stories, tiers, stats, partners, team (zod)
    stories/*.md  tiers/*.md  stats/*.md  partners/*.md  team/*.md
  components/
    brand/
      Button.astro  Highlight.astro  Overline.astro  CircledWord.astro
      ChevronPill.astro  LogoBadge.astro  BrandSymbol.astro  AvatarRing.astro
      StatBar.astro  Badge.astro  Card.astro
    sections/
      Nav.astro  Footer.astro  LanguageSwitcher.astro
      Hero.astro  Mission.astro  Impact.astro  Stories.astro
      Tiers.astro  DonateCTA.astro
  layouts/
    BaseLayout.astro        # <head> SEO/OG/hreflang/JSON-LD, fonts, ClientRouter, skip-link, Nav, Footer
  lib/
    donate.ts               # treliLink(tier, frequency) — lógica pura testeable
  pages/
    index.astro  modelo.astro  impacto.astro  beneficiarias.astro  nosotros.astro  donar.astro  404.astro
    en/index.astro  en/model.astro  en/impact.astro  en/stories.astro  en/about.astro  en/donate.astro

tests/
  i18n.test.ts  donate.test.ts  content.test.ts
  components/button.test.ts  components/highlight.test.ts  components/logobadge.test.ts
  components/statbar.test.ts  components/tiers.test.ts
```

---

## Task 1: Scaffold del proyecto Astro

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (temporal)

- [ ] **Step 1: Verificar Node**

Run: `node -v`
Expected: `v18.20.8+`, `v20.3+`, o `v22+`/`v24+` (cualquiera ≥ 20.3). Si es menor, instalar Node 22 LTS antes de seguir.

- [ ] **Step 2: Inicializar package.json**

Create `package.json`:

```json
{
  "name": "club1plus-web",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Instalar Astro y dependencias**

Run:
```bash
npm install astro@^5 @astrojs/sitemap@^3 astro-icon@^1 @iconify-json/lucide@^1
npm install @fontsource-variable/hanken-grotesk @fontsource/space-mono
npm install -D typescript @astrojs/check vitest
```
Expected: instala sin errores; `node_modules/` creado.

- [ ] **Step 4: Crear astro.config.mjs**

Create `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

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
  integrations: [icon(), sitemap()],
});
```

- [ ] **Step 5: Crear tsconfig.json**

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", ".ds-source", "node_modules"]
}
```

- [ ] **Step 6: Página temporal para validar el arranque**

Create `src/pages/index.astro`:

```astro
---
---
<!doctype html>
<html lang="es">
  <head><meta charset="utf-8" /><title>El Club del 1+</title></head>
  <body><h1>El Club del 1+</h1></body>
</html>
```

- [ ] **Step 7: Verificar build**

Run: `npm run build`
Expected: build OK, genera `dist/` sin errores.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro con i18n, sitemap, icon y fontsource

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Portar tokens y CSS global

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Copy: `.ds-source/assets/logo-badge-green.svg`, `.ds-source/assets/logo-badge-dark.svg` → `public/`

- [ ] **Step 1: Copiar assets de logo**

Run:
```bash
mkdir -p public
cp ".ds-source/assets/logo-badge-green.svg" public/logo-badge-green.svg
cp ".ds-source/assets/logo-badge-dark.svg" public/logo-badge-dark.svg
```
Expected: dos SVG en `public/`.

- [ ] **Step 2: Construir tokens.css desde el DS (sin el @import de Google Fonts)**

Crea `src/styles/tokens.css` concatenando el contenido de estos archivos del DS, **en este orden**, omitiendo `tokens/fonts.css` (las fuentes se self-hostean por fontsource en Task 3):

```bash
{
  echo "/* tokens — portado de .ds-source/tokens (sin @import de fuentes) */";
  cat ".ds-source/tokens/colors.css";
  cat ".ds-source/tokens/typography.css";
  cat ".ds-source/tokens/spacing.css";
  cat ".ds-source/tokens/radius.css";
  cat ".ds-source/tokens/effects.css";
} > src/styles/tokens.css
```
Expected: `src/styles/tokens.css` con todas las `:root { --… }` (colores, tipografía, spacing, radius, effects, motivos `--pattern-plus-*`). Verificar que NO contenga ningún `@import url("https://fonts.googleapis...`.

- [ ] **Step 3: Crear global.css**

Create `src/styles/global.css`:

```css
@import "./tokens.css";

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body {
  margin: 0;
  font: var(--text-body-role);
  color: var(--text-body);
  background: var(--surface-base);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img, svg, video { display: block; max-width: 100%; }
a { color: inherit; }
h1, h2, h3, p { margin: 0; }
ul { margin: 0; padding: 0; }

/* Focus visible — anillo verde de marca */
:focus-visible { outline: none; box-shadow: var(--focus-shadow); border-radius: var(--radius-xs); }

/* Skip link accesible */
.skip-link {
  position: absolute; left: 8px; top: -48px; z-index: 100;
  background: var(--ink-900); color: var(--green-400);
  font: var(--text-overline); text-transform: uppercase;
  padding: 10px 16px; border-radius: var(--radius-pill);
  transition: top var(--dur-base) var(--ease-out);
}
.skip-link:focus { top: 8px; }

/* Layout helpers */
.container { max-width: var(--maxw-content); margin-inline: auto; padding-inline: clamp(20px, 5vw, 40px); }
.section { padding-block: clamp(56px, 9vw, 88px); }
.ground-green { background: var(--green-400); color: var(--ink-900); }
.ground-ink   { background: var(--ink-800);  color: var(--text-on-dark); }
.ground-paper { background: var(--paper-50);  color: var(--text-body); }
.ground-paper-100 { background: var(--paper-100); color: var(--text-body); }
.plus-texture-green { background-image: var(--pattern-plus-green); }
.plus-texture-ink   { background-image: var(--pattern-plus-ink); }

/* Display headline helper */
.display {
  font-family: var(--font-display); font-weight: 900;
  line-height: var(--lh-tight); letter-spacing: -0.03em; color: inherit;
}

/* Reveal-on-scroll (activado por JS añadiendo .is-in) */
.reveal { opacity: 0; transform: translateY(16px); transition: opacity var(--dur-slow) var(--ease-out), transform var(--dur-slow) var(--ease-overshoot); }
.reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
  .reveal { opacity: 1; transform: none; }
}
```

- [ ] **Step 4: Verificar build con estilos**

Edita `src/pages/index.astro` para importar el CSS y validar que compila:

```astro
---
import "../styles/global.css";
---
<!doctype html>
<html lang="es">
  <head><meta charset="utf-8" /><title>El Club del 1+</title></head>
  <body class="ground-green"><h1 class="display">creando riqueza.</h1></body>
</html>
```

Run: `npm run build`
Expected: build OK; en `dist/` el HTML referencia el CSS compilado.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: portar tokens del DS y crear CSS global (reset, grounds, reveal, a11y)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Fuentes self-host + setup de Vitest

**Files:**
- Modify: `src/styles/global.css` (imports de fuentes)
- Create: `vitest.config.ts`, `tests/smoke.test.ts`

- [ ] **Step 1: Importar las fuentes self-host en global.css**

Añade al **inicio** de `src/styles/global.css` (antes del `@import "./tokens.css";`):

```css
@import "@fontsource-variable/hanken-grotesk";
@import "@fontsource/space-mono/400.css";
@import "@fontsource/space-mono/700.css";
```

- [ ] **Step 2: Crear vitest.config.ts**

Create `vitest.config.ts`:

```ts
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Test smoke del container API**

Create `tests/smoke.test.ts`:

```ts
import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

test("AstroContainer renderiza HTML", async () => {
  const container = await AstroContainer.create();
  expect(container).toBeDefined();
});
```

- [ ] **Step 4: Ejecutar test**

Run: `npm test`
Expected: 1 test PASS.

- [ ] **Step 5: Verificar build con fuentes**

Run: `npm run build`
Expected: build OK; `dist/_astro/` incluye archivos de fuente (woff2).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: self-host fuentes (Hanken Grotesk + Space Mono) y configurar Vitest

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: i18n — diccionarios, rutas y utilidades (TDD)

**Files:**
- Create: `src/i18n/es.json`, `src/i18n/en.json`, `src/i18n/routes.ts`, `src/i18n/utils.ts`
- Test: `tests/i18n.test.ts`

- [ ] **Step 1: Crear el mapa de rutas equivalentes**

Create `src/i18n/routes.ts`:

```ts
export type Lang = "es" | "en";

// Clave de página → ruta (sin base) por idioma. Fuente única para hreflang y switcher.
export const ROUTES = {
  home:          { es: "/",              en: "/en/" },
  modelo:        { es: "/modelo",        en: "/en/model" },
  impacto:       { es: "/impacto",       en: "/en/impact" },
  beneficiarias: { es: "/beneficiarias", en: "/en/stories" },
  nosotros:      { es: "/nosotros",      en: "/en/about" },
  donar:         { es: "/donar",         en: "/en/donate" },
} as const;

export type RouteKey = keyof typeof ROUTES;
export const LANGS: Lang[] = ["es", "en"];
```

- [ ] **Step 2: Escribir el test de utils (failing)**

Create `tests/i18n.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getLangFromUrl, useTranslations, getRoute, otherLang } from "../src/i18n/utils";

describe("i18n utils", () => {
  it("detecta es por defecto en la raíz", () => {
    expect(getLangFromUrl(new URL("https://x.io/club1plus/"))).toBe("es");
  });
  it("detecta en bajo /en", () => {
    expect(getLangFromUrl(new URL("https://x.io/club1plus/en/model"))).toBe("en");
  });
  it("traduce una clave conocida", () => {
    const t = useTranslations("es");
    expect(t("nav.donate")).toBe("Sé socio");
  });
  it("hace fallback a es si falta la clave en en", () => {
    const t = useTranslations("en");
    expect(typeof t("nav.donate")).toBe("string");
  });
  it("resuelve la ruta de una página por idioma", () => {
    expect(getRoute("modelo", "es")).toBe("/modelo");
    expect(getRoute("modelo", "en")).toBe("/en/model");
  });
  it("otherLang invierte el idioma", () => {
    expect(otherLang("es")).toBe("en");
    expect(otherLang("en")).toBe("es");
  });
});
```

- [ ] **Step 3: Ejecutar test (verificar que falla)**

Run: `npm test -- tests/i18n.test.ts`
Expected: FAIL (módulo `utils` no existe / sin diccionarios).

- [ ] **Step 4: Crear diccionarios**

Create `src/i18n/es.json`:

```json
{
  "site.title": "El Club del 1+",
  "site.tagline": "La mejor forma de eliminar la pobreza es creando riqueza.",
  "site.description": "Asociamos amigos comprometidos que suman un aporte mensual para dar una renta básica a madres cabeza de familia. Creando riqueza, no caridad.",
  "nav.model": "El modelo",
  "nav.impact": "Impacto",
  "nav.stories": "Beneficiarias",
  "nav.about": "Nosotros",
  "nav.donate": "Sé socio",
  "nav.menu": "Menú",
  "nav.langLabel": "English",
  "cta.join": "Súmate",
  "cta.learn": "Conoce el modelo",
  "footer.rights": "El Club del 1+ · Startup social · Medellín, Colombia",
  "footer.tagline": "Convierte tu + en la luz del cambio.",
  "a11y.skip": "Saltar al contenido"
}
```

Create `src/i18n/en.json`:

```json
{
  "site.title": "El Club del 1+",
  "site.tagline": "The best way to end poverty is by creating wealth.",
  "site.description": "We bring together committed friends who add a monthly contribution to fund a basic income for female heads of household. Creating wealth, not charity.",
  "nav.model": "The model",
  "nav.impact": "Impact",
  "nav.stories": "Beneficiaries",
  "nav.about": "About",
  "nav.donate": "Become a member",
  "nav.menu": "Menu",
  "nav.langLabel": "Español",
  "cta.join": "Join",
  "cta.learn": "See the model",
  "footer.rights": "El Club del 1+ · Social startup · Medellín, Colombia",
  "footer.tagline": "Turn your + into the light of change.",
  "a11y.skip": "Skip to content"
}
```

- [ ] **Step 5: Implementar utils**

Create `src/i18n/utils.ts`:

```ts
import es from "./es.json";
import en from "./en.json";
import { ROUTES, type Lang, type RouteKey } from "./routes";

const DICTS: Record<Lang, Record<string, string>> = { es, en };

/** Detecta el idioma a partir del primer segmento de la ruta (tras la base). */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split("/").filter(Boolean);
  // base puede ser el primer segmento (p.ej. "club1+"); buscamos "en" en cualquiera de los dos primeros.
  if (seg[0] === "en" || seg[1] === "en") return "en";
  return "es";
}

/** Devuelve un traductor t(key) con fallback a español. */
export function useTranslations(lang: Lang) {
  return function t(key: string): string {
    return DICTS[lang]?.[key] ?? DICTS.es[key] ?? key;
  };
}

/** Ruta (sin base) de una página por idioma. */
export function getRoute(key: RouteKey, lang: Lang): string {
  return ROUTES[key][lang];
}

export function otherLang(lang: Lang): Lang {
  return lang === "es" ? "en" : "es";
}
```

- [ ] **Step 6: Ejecutar test (verificar que pasa)**

Run: `npm test -- tests/i18n.test.ts`
Expected: 6 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: i18n — diccionarios es/en, mapa de rutas y utils con tests

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Lógica de donación Treli (TDD)

**Files:**
- Create: `src/lib/donate.ts`
- Test: `tests/donate.test.ts`

- [ ] **Step 1: Escribir test (failing)**

Create `tests/donate.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { treliLink, TIER_FALLBACK } from "../src/lib/donate";

describe("treliLink", () => {
  const tier = { slug: "aliado", urlMonthly: "https://treli.co/x/mensual", urlOneTime: "https://treli.co/x/unico" };
  it("elige la URL mensual", () => {
    expect(treliLink(tier, "monthly")).toBe("https://treli.co/x/mensual");
  });
  it("elige la URL de pago único", () => {
    expect(treliLink(tier, "one-time")).toBe("https://treli.co/x/unico");
  });
  it("hace fallback si falta la URL de la frecuencia", () => {
    expect(treliLink({ slug: "a", urlMonthly: "", urlOneTime: "" }, "monthly")).toBe(TIER_FALLBACK);
  });
});
```

- [ ] **Step 2: Ejecutar test (verificar que falla)**

Run: `npm test -- tests/donate.test.ts`
Expected: FAIL (módulo no existe).

- [ ] **Step 3: Implementar**

Create `src/lib/donate.ts`:

```ts
export type Frequency = "monthly" | "one-time";

export interface TierLinks {
  slug: string;
  urlMonthly: string;
  urlOneTime: string;
}

// Placeholder hasta tener las URLs reales de Treli.
export const TIER_FALLBACK = "https://treli.co/"; // TODO: URL Treli real (catálogo del Club)

export function treliLink(tier: TierLinks, freq: Frequency): string {
  const url = freq === "monthly" ? tier.urlMonthly : tier.urlOneTime;
  return url && url.length > 0 ? url : TIER_FALLBACK;
}
```

- [ ] **Step 4: Ejecutar test (verificar que pasa)**

Run: `npm test -- tests/donate.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: lógica pura de enlaces de donación Treli con tests

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Content Collections (esquemas + seed) (TDD)

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/tiers/*.md`, `stories/*.md`, `stats/*.md`, `partners/*.md`, `team/*.md`
- Test: `tests/content.test.ts`

- [ ] **Step 1: Definir colecciones con zod**

Create `src/content/config.ts`:

```ts
import { defineCollection, z } from "astro:content";

const lang = z.enum(["es", "en"]);

const tiers = defineCollection({
  type: "content",
  schema: z.object({
    lang,
    name: z.string(),
    symbol: z.enum(["plus", "rise", "spark", "equals", "ring"]),
    amount: z.string(),
    note: z.string(),
    accent: z.enum(["green", "coral", "marigold"]),
    featured: z.boolean().default(false),
    perks: z.array(z.string()),
    order: z.number(),
    urlMonthly: z.string().default(""),
    urlOneTime: z.string().default(""),
  }),
});

const stories = defineCollection({
  type: "content",
  schema: z.object({
    lang,
    name: z.string(),
    role: z.string(),
    quote: z.string(),
    location: z.string().optional(),
    photo: z.string().optional(),
    order: z.number(),
  }),
});

const stats = defineCollection({
  type: "content",
  schema: z.object({
    lang,
    label: z.string(),
    value: z.number(),          // 0–100 para la barra
    display: z.string(),        // texto mostrado, p.ej. "12.1%"
    source: z.string().optional(),
    order: z.number(),
  }),
});

const partners = defineCollection({
  type: "content",
  schema: z.object({ lang, name: z.string(), url: z.string().optional(), order: z.number() }),
});

const team = defineCollection({
  type: "content",
  schema: z.object({ lang, name: z.string(), role: z.string(), photo: z.string().optional(), order: z.number() }),
});

export const collections = { tiers, stories, stats, partners, team };
```

- [ ] **Step 2: Seed — tiers (ES)**

Create `src/content/tiers/amigo.es.md`:

```md
---
lang: es
name: Amigo
symbol: plus
amount: $20.000
note: Sumas tu + cada mes
accent: green
featured: false
order: 1
perks:
  - Recibo deducible
  - Reporte de impacto trimestral
urlMonthly: ""   # TODO: URL Treli real
urlOneTime: ""   # TODO: URL Treli real
---
```

Create `src/content/tiers/aliado.es.md`:

```md
---
lang: es
name: Aliado
symbol: rise
amount: $50.000
note: El aporte más común
accent: coral
featured: true
order: 2
perks:
  - Todo lo de Amigo
  - Conoces a una beneficiaria
  - Carné de socio
urlMonthly: ""   # TODO: URL Treli real
urlOneTime: ""   # TODO: URL Treli real
---
```

Create `src/content/tiers/mecenas.es.md`:

```md
---
lang: es
name: Mecenas
symbol: spark
amount: $150.000
note: Impulsas a una familia
accent: marigold
featured: false
order: 3
perks:
  - Todo lo de Aliado
  - Encuentro anual del Club
  - Mención como aliado
urlMonthly: ""   # TODO: URL Treli real
urlOneTime: ""   # TODO: URL Treli real
---
```

- [ ] **Step 3: Seed — tiers (EN)**

Create `src/content/tiers/amigo.en.md`:

```md
---
lang: en
name: Friend
symbol: plus
amount: $5/mo
note: Add your + every month
accent: green
featured: false
order: 1
perks:
  - Tax-deductible receipt
  - Quarterly impact report
urlMonthly: ""   # TODO: real Treli URL
urlOneTime: ""   # TODO: real Treli URL
---
```

Create `src/content/tiers/aliado.en.md`:

```md
---
lang: en
name: Ally
symbol: rise
amount: $13/mo
note: The most common contribution
accent: coral
featured: true
order: 2
perks:
  - Everything in Friend
  - Meet a beneficiary
  - Member card
urlMonthly: ""   # TODO: real Treli URL
urlOneTime: ""   # TODO: real Treli URL
---
```

Create `src/content/tiers/mecenas.en.md`:

```md
---
lang: en
name: Patron
symbol: spark
amount: $40/mo
note: You power a whole family
accent: marigold
featured: false
order: 3
perks:
  - Everything in Ally
  - Annual Club gathering
  - Named as a partner
urlMonthly: ""   # TODO: real Treli URL
urlOneTime: ""   # TODO: real Treli URL
---
```

- [ ] **Step 4: Seed — stories (ES + EN)**

Create `src/content/stories/yolanda.es.md`:

```md
---
lang: es
name: Yolanda
role: Beneficiaria · emprendedora
quote: "Mis hijos son mi inspiración. Hoy puedo darles lo mejor."
location: Medellín
order: 1
---
```

Create `src/content/stories/maryurieth.es.md`:

```md
---
lang: es
name: Maryurieth Arrieta
role: Vende mecato y copias en el metrocable de Santo Domingo
quote: "Desde que pertenezco al Club puedo hacer cosas que antes no podía."
location: Santo Domingo, Medellín
order: 2
---
```

Create `src/content/stories/yolanda.en.md`:

```md
---
lang: en
name: Yolanda
role: Beneficiary · entrepreneur
quote: "My kids are my inspiration. Today I can give them my best."
location: Medellín
order: 1
---
```

Create `src/content/stories/maryurieth.en.md`:

```md
---
lang: en
name: Maryurieth Arrieta
role: Sells snacks and copies at the Santo Domingo metrocable
quote: "Since I joined the Club I can do things I couldn't before."
location: Santo Domingo, Medellín
order: 2
---
```

- [ ] **Step 5: Seed — stats (ES + EN)**

Create `src/content/stats/income-gap.es.md`:

```md
---
lang: es
label: Las mujeres en Colombia reciben menos ingresos por su trabajo
value: 12
display: "-12.1%"
source: DANE
order: 1
---
```

Create `src/content/stats/poverty-line.es.md`:

```md
---
lang: es
label: Pobreza monetaria por debajo del ingreso per cápita (2021)
value: 36
display: "$352.480"
source: DANE
order: 2
---
```

Create `src/content/stats/beneficiarias.es.md`:

```md
---
lang: es
label: Beneficiarias evaluadas por expertos en impacto social
value: 100
display: "36"
source: Cubo Social
order: 3
---
```

Create `src/content/stats/income-gap.en.md`:

```md
---
lang: en
label: Women in Colombia receive less income for their work
value: 12
display: "-12.1%"
source: DANE
order: 1
---
```

Create `src/content/stats/poverty-line.en.md`:

```md
---
lang: en
label: Monetary poverty below per-capita income (2021)
value: 36
display: "$352,480"
source: DANE
order: 2
---
```

Create `src/content/stats/beneficiarias.en.md`:

```md
---
lang: en
label: Beneficiaries evaluated by social-impact experts
value: 100
display: "36"
source: Cubo Social
order: 3
---
```

- [ ] **Step 6: Seed — partners y team (ES + EN)**

Create `src/content/partners/proantioquia.es.md`:

```md
---
lang: es
name: Proantioquia
order: 1
---
```

Create `src/content/partners/cubo-social.es.md`:

```md
---
lang: es
name: Cubo Social
order: 2
---
```

Create `src/content/partners/proantioquia.en.md`:

```md
---
lang: en
name: Proantioquia
order: 1
---
```

Create `src/content/partners/cubo-social.en.md`:

```md
---
lang: en
name: Cubo Social
order: 2
---
```

Create `src/content/team/direccion.es.md`:

```md
---
lang: es
name: Equipo del Club
role: Dirección y operación
order: 1
---
```

Create `src/content/team/direccion.en.md`:

```md
---
lang: en
name: Club team
role: Leadership & operations
order: 1
---
```

- [ ] **Step 7: Test — las colecciones cargan y filtran por idioma**

Create `tests/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection } from "astro:content";

describe("content collections", () => {
  it("hay 3 tiers por idioma, ordenados", async () => {
    const es = (await getCollection("tiers", (e) => e.data.lang === "es")).sort((a, b) => a.data.order - b.data.order);
    expect(es.length).toBe(3);
    expect(es[0].data.name).toBe("Amigo");
    expect(es.find((t) => t.data.featured)?.data.name).toBe("Aliado");
  });
  it("hay stats en en", async () => {
    const en = await getCollection("stats", (e) => e.data.lang === "en");
    expect(en.length).toBeGreaterThanOrEqual(3);
  });
});
```

> Nota: `getCollection` requiere el entorno de Astro; `getViteConfig` ya lo provee a Vitest. Si la importación de `astro:content` fallara en test, mover esta verificación al build (`npm run build` valida los schemas zod igualmente).

- [ ] **Step 8: Ejecutar test + build**

Run: `npm test -- tests/content.test.ts`
Expected: PASS.
Run: `npm run build`
Expected: build OK; zod valida todos los frontmatter sin error.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: content collections (tiers, stories, stats, partners, team) con seed es/en

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Componentes de marca — texto (Button, Highlight, Overline, Badge) (TDD)

**Files:**
- Create: `src/components/brand/Button.astro`, `Highlight.astro`, `Overline.astro`, `Badge.astro`
- Test: `tests/components/button.test.ts`, `tests/components/highlight.test.ts`

- [ ] **Step 1: Test de Button (failing)**

Create `tests/components/button.test.ts`:

```ts
import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Button from "../../src/components/brand/Button.astro";

test("Button renderiza como <a> con href y slot", async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Button, {
    props: { href: "/donar", variant: "dark", size: "lg" },
    slots: { default: "Sé socio" },
  });
  expect(html).toContain("Sé socio");
  expect(html).toContain('href="/donar"');
  expect(html).toContain("<a");
});

test("Button sin href es <button>", async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Button, { slots: { default: "Enviar" } });
  expect(html).toContain("<button");
});
```

- [ ] **Step 2: Ejecutar (falla)**

Run: `npm test -- tests/components/button.test.ts`
Expected: FAIL (no existe Button.astro).

- [ ] **Step 3: Implementar Button.astro**

Create `src/components/brand/Button.astro`:

```astro
---
interface Props {
  variant?: "primary" | "dark" | "outline" | "outline-on-dark" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  full?: boolean;
  type?: "button" | "submit";
  class?: string;
  [key: string]: any;
}
const { variant = "primary", size = "md", href, full = false, type = "button", class: cls = "", ...rest } = Astro.props;
const Tag = href ? "a" : "button";
const extra = href ? { href, ...(rest.target ? { rel: "noopener noreferrer" } : {}) } : { type };
---
<Tag class:list={["btn", `btn--${variant}`, `btn--${size}`, { "btn--full": full }, cls]} {...extra} {...rest}>
  <slot />
</Tag>

<style>
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: var(--font-display); font-weight: 800; line-height: 1; letter-spacing: -0.01em;
    border-radius: var(--radius-pill); cursor: pointer; text-decoration: none; white-space: nowrap;
    border: 2px solid transparent;
    transition: transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out);
  }
  .btn--sm { font-size: 14px; padding: 8px 16px; }
  .btn--md { font-size: 16px; padding: 12px 22px; }
  .btn--lg { font-size: 18px; padding: 15px 30px; }
  .btn--full { width: 100%; }
  .btn--primary { background: var(--green-400); color: var(--ink-900); border-color: var(--green-400); }
  .btn--dark { background: var(--ink-900); color: var(--green-400); border-color: var(--ink-900); }
  .btn--outline { background: transparent; color: var(--ink-900); border-color: var(--ink-900); }
  .btn--outline-on-dark { background: transparent; color: var(--green-400); border-color: var(--green-400); }
  .btn--ghost { background: transparent; color: var(--text-strong); }
  .btn:hover { filter: brightness(0.94); }
  .btn:active { transform: scale(0.96); }
</style>
```

- [ ] **Step 4: Ejecutar (pasa)**

Run: `npm test -- tests/components/button.test.ts`
Expected: 2 tests PASS.

- [ ] **Step 5: Implementar Highlight.astro + test**

Create `src/components/brand/Highlight.astro`:

```astro
---
interface Props { variant?: "dark" | "green" | "coral"; }
const { variant = "dark" } = Astro.props;
---
<span class:list={["hl", `hl--${variant}`]}><slot /></span>
<style>
  .hl { box-decoration-break: clone; -webkit-box-decoration-break: clone; padding: 0 0.22em; margin: 0 -0.04em; font-weight: 800; line-height: inherit; }
  .hl--dark { background: var(--ink-900); color: var(--green-400); }
  .hl--green { background: var(--green-400); color: var(--ink-900); }
  .hl--coral { background: var(--coral-400); color: var(--ink-900); }
</style>
```

Create `tests/components/highlight.test.ts`:

```ts
import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Highlight from "../../src/components/brand/Highlight.astro";

test("Highlight aplica la variante green y muestra el texto", async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Highlight, { props: { variant: "green" }, slots: { default: "riqueza." } });
  expect(html).toContain("riqueza.");
  expect(html).toContain("hl--green");
});
```

- [ ] **Step 6: Implementar Overline.astro**

Create `src/components/brand/Overline.astro`:

```astro
---
interface Props { tone?: "auto" | "green" | "dark" | "muted"; color?: string; class?: string; }
const { tone = "auto", color, class: cls = "" } = Astro.props;
const style = color ? `color:${color}` : undefined;
---
<span class:list={["overline", `overline--${tone}`, cls]} style={style}><slot /></span>
<style>
  .overline { font-family: var(--font-mono); font-weight: 700; font-size: var(--fs-overline); letter-spacing: var(--ls-overline); text-transform: uppercase; }
  .overline--auto { color: currentColor; }
  .overline--green { color: var(--green-400); }
  .overline--dark { color: var(--ink-900); }
  .overline--muted { color: var(--text-muted); }
</style>
```

- [ ] **Step 7: Implementar Badge.astro**

Create `src/components/brand/Badge.astro`:

```astro
---
interface Props { variant?: "green" | "dark" | "outline" | "outline-on-dark" | "coral" | "soft"; size?: "sm" | "md"; }
const { variant = "green", size = "md" } = Astro.props;
---
<span class:list={["badge", `badge--${variant}`, `badge--${size}`]}><slot /></span>
<style>
  .badge { display: inline-flex; align-items: center; gap: 5px; font-family: var(--font-display); font-weight: 700; letter-spacing: 0.01em; border-radius: var(--radius-pill); line-height: 1; white-space: nowrap; }
  .badge--sm { font-size: 11px; padding: 3px 9px; }
  .badge--md { font-size: 12.5px; padding: 5px 12px; }
  .badge--green { background: var(--green-400); color: var(--ink-900); }
  .badge--dark { background: var(--ink-900); color: var(--green-400); }
  .badge--outline { background: transparent; color: var(--ink-900); border: 1.5px solid var(--ink-900); }
  .badge--outline-on-dark { background: transparent; color: var(--green-400); border: 1.5px solid var(--green-400); }
  .badge--coral { background: var(--coral-400); color: var(--ink-900); }
  .badge--soft { background: var(--green-50); color: var(--green-700); }
</style>
```

- [ ] **Step 8: Ejecutar tests + build**

Run: `npm test -- tests/components/`
Expected: button + highlight PASS.
Run: `npm run build`
Expected: OK.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: componentes de marca de texto (Button, Highlight, Overline, Badge) con tests

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8: Componentes de marca — gráficos (LogoBadge, BrandSymbol, ChevronPill, CircledWord) (TDD)

**Files:**
- Create: `src/components/brand/LogoBadge.astro`, `BrandSymbol.astro`, `ChevronPill.astro`, `CircledWord.astro`
- Test: `tests/components/logobadge.test.ts`

- [ ] **Step 1: Test de LogoBadge (failing)**

Create `tests/components/logobadge.test.ts`:

```ts
import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import LogoBadge from "../../src/components/brand/LogoBadge.astro";

test("LogoBadge tiene aria-label de marca y dibuja el 1+", async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(LogoBadge, { props: { variant: "green", size: 72 } });
  expect(html).toContain('aria-label="El Club del 1+"');
  expect(html).toContain("<svg");
  expect(html).toContain("club");
});
```

- [ ] **Step 2: Ejecutar (falla)**

Run: `npm test -- tests/components/logobadge.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar LogoBadge.astro** (mismo vector que assets/logo-badge-*.svg)

Create `src/components/brand/LogoBadge.astro`:

```astro
---
interface Props { size?: number; variant?: "green" | "dark"; class?: string; }
const { size = 72, variant = "green", class: cls = "" } = Astro.props;
const green = variant === "green";
const bg = green ? "var(--green-400)" : "var(--ink-800)";
const fg = green ? "var(--ink-900)" : "var(--green-400)";
---
<svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label="El Club del 1+" class={cls}>
  <circle cx="100" cy="100" r={green ? 100 : 96} fill={bg} stroke={green ? "none" : "var(--green-400)"} stroke-width={green ? 0 : 8} />
  <text x="66" y="131" text-anchor="middle" font-family="var(--font-display)" font-weight="900" font-size="104" letter-spacing="-4" fill={fg}>1</text>
  <g fill={fg}>
    <rect x="108" y="66" width="19" height="58" rx="4" />
    <rect x="88" y="86" width="59" height="19" rx="4" />
  </g>
  <text x="100" y="173" text-anchor="middle" font-family="var(--font-display)" font-weight="800" font-size="34" letter-spacing="0.5" fill={fg}>club</text>
</svg>
```

- [ ] **Step 4: Implementar BrandSymbol.astro**

Create `src/components/brand/BrandSymbol.astro`:

```astro
---
interface Props { symbol?: "plus" | "equals" | "rise" | "ring" | "spark"; size?: number; color?: string; title?: string; class?: string; }
const { symbol = "plus", size = 48, color = "currentColor", title, class: cls = "" } = Astro.props;
---
<svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title ?? symbol} class={cls}>
  {title && <title>{title}</title>}
  {symbol === "plus" && (<g fill={color}><rect x="43.5" y="16" width="13" height="68" rx="5" /><rect x="16" y="43.5" width="68" height="13" rx="5" /></g>)}
  {symbol === "equals" && (<g fill={color}><rect x="18" y="35" width="64" height="13" rx="6" /><rect x="18" y="57" width="64" height="13" rx="6" /></g>)}
  {symbol === "rise" && (<g fill={color}><rect x="18" y="56" width="16" height="28" rx="5" /><rect x="42" y="40" width="16" height="44" rx="5" /><rect x="66" y="22" width="16" height="62" rx="5" /></g>)}
  {symbol === "ring" && (<circle cx="50" cy="50" r="30" fill={color} />)}
  {symbol === "spark" && (<path d="M50 8 C53.5 35 65 46.5 92 50 C65 53.5 53.5 65 50 92 C46.5 65 35 53.5 8 50 C35 46.5 46.5 35 50 8 Z" fill={color} />)}
</svg>
```

- [ ] **Step 5: Implementar ChevronPill.astro**

Create `src/components/brand/ChevronPill.astro`:

```astro
---
interface Props { count?: number; variant?: "dark" | "green" | "outline"; size?: "sm" | "md" | "lg"; }
const { count = 3, variant = "dark", size = "md" } = Astro.props;
const S = { sm: { box: 36, icon: 14, pad: "0 14px" }, md: { box: 48, icon: 18, pad: "0 20px" }, lg: { box: 62, icon: 24, pad: "0 26px" } }[size]!;
const chevrons = Array.from({ length: count }, (_, i) => i);
---
<span class:list={["chev", `chev--${variant}`]} style={`height:${S.box}px;min-width:${S.box}px;padding:${S.pad}`} aria-hidden="true">
  {chevrons.map((i) => (
    <svg width={S.icon} height={S.icon} viewBox="0 0 24 24" fill="none" style={`opacity:${1 - i * 0.18};margin-left:${i === 0 ? 0 : -S.icon * 0.35}px`}>
      <path d="M8 5l7 7-7 7" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  ))}
</span>
<style>
  .chev { display: inline-flex; align-items: center; justify-content: center; border-radius: var(--radius-pill); }
  .chev--dark { background: var(--ink-900); color: var(--green-400); }
  .chev--green { background: var(--green-400); color: var(--ink-900); }
  .chev--outline { background: transparent; color: var(--ink-900); border: 2px solid var(--ink-900); }
</style>
```

- [ ] **Step 6: Implementar CircledWord.astro**

Create `src/components/brand/CircledWord.astro`:

```astro
---
interface Props { color?: string; }
const { color = "var(--ink-900)" } = Astro.props;
---
<span class="circled">
  <svg viewBox="0 0 200 80" preserveAspectRatio="none" aria-hidden="true" class="circled__ring">
    <ellipse cx="100" cy="40" rx="96" ry="34" fill="none" stroke={color} stroke-width="2.4" transform="rotate(-2 100 40)" />
  </svg>
  <span class="circled__text"><slot /></span>
</span>
<style>
  .circled { position: relative; display: inline-block; padding: 0.1em 0.5em; }
  .circled__ring { position: absolute; inset: -6% -2%; width: 104%; height: 112%; pointer-events: none; }
  .circled__text { position: relative; }
</style>
```

- [ ] **Step 7: Ejecutar tests + build**

Run: `npm test -- tests/components/logobadge.test.ts`
Expected: PASS.
Run: `npm run build`
Expected: OK.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: componentes gráficos de marca (LogoBadge, BrandSymbol, ChevronPill, CircledWord)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 9: Componentes de marca — datos/contenedores (StatBar, AvatarRing, Card) (TDD)

**Files:**
- Create: `src/components/brand/StatBar.astro`, `AvatarRing.astro`, `Card.astro`
- Test: `tests/components/statbar.test.ts`

- [ ] **Step 1: Test de StatBar (failing)**

Create `tests/components/statbar.test.ts`:

```ts
import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import StatBar from "../../src/components/brand/StatBar.astro";

test("StatBar muestra label, display y ancho según value", async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(StatBar, { props: { label: "Brecha", value: 12, display: "-12.1%", tone: "light" } });
  expect(html).toContain("Brecha");
  expect(html).toContain("-12.1%");
  expect(html).toContain("width:12%");
});
```

- [ ] **Step 2: Ejecutar (falla)**

Run: `npm test -- tests/components/statbar.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implementar StatBar.astro**

Create `src/components/brand/StatBar.astro`:

```astro
---
interface Props { label: string; value?: number; display?: string; tone?: "light" | "dark"; fill?: string; }
const { label, value = 50, display, tone = "light", fill = "var(--green-400)" } = Astro.props;
const pct = Math.max(0, Math.min(100, value));
const onDark = tone === "dark";
---
<div class:list={["stat", { "stat--dark": onDark }]}>
  <div class="stat__top">
    <span class="stat__label">{label}</span>
    <span class="stat__value">{display ?? `${pct}%`}</span>
  </div>
  <div class="stat__track"><div class="stat__fill" style={`width:${pct}%;background:${fill}`}></div></div>
</div>
<style>
  .stat { font-family: var(--font-body); }
  .stat__top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .stat__label { font-weight: 700; font-size: 15px; color: var(--text-body); }
  .stat__value { font-family: var(--font-display); font-weight: 900; font-size: 22px; letter-spacing: -0.02em; color: var(--text-strong); }
  .stat__track { height: 14px; border-radius: var(--radius-pill); background: var(--paper-200); overflow: hidden; }
  .stat__fill { height: 100%; border-radius: var(--radius-pill); transition: width var(--dur-slow) var(--ease-out); }
  .stat--dark .stat__label { color: var(--text-on-dark); }
  .stat--dark .stat__value { color: var(--green-400); }
  .stat--dark .stat__track { background: var(--ink-600); }
</style>
```

- [ ] **Step 4: Implementar AvatarRing.astro**

Create `src/components/brand/AvatarRing.astro`:

```astro
---
interface Props { src?: string; alt?: string; size?: number; treatment?: "ring" | "disc" | "plain"; name?: string; }
const { src, alt = "", size = 96, treatment = "ring", name } = Astro.props;
const initial = (name ?? "·").slice(0, 1);
---
<span class:list={["avatar", `avatar--${treatment}`]} style={`width:${size}px;height:${size}px`}>
  <span class="avatar__inner">
    {src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : <span class="avatar__ph" style={`font-size:${Math.round(size * 0.34)}px`}>{initial}</span>}
  </span>
</span>
<style>
  .avatar { position: relative; display: inline-block; flex: none; border-radius: var(--radius-circle); }
  .avatar--disc { background: var(--green-400); padding: 8%; }
  .avatar__inner { display: block; width: 100%; height: 100%; border-radius: var(--radius-circle); overflow: hidden; background: var(--ink-700); }
  .avatar--ring .avatar__inner { border: 4px solid var(--green-400); }
  .avatar__inner img { width: 100%; height: 100%; object-fit: cover; }
  .avatar__ph { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; font-family: var(--font-display); font-weight: 800; color: var(--text-on-dark-muted); }
</style>
```

- [ ] **Step 5: Implementar Card.astro**

Create `src/components/brand/Card.astro`:

```astro
---
interface Props { tone?: "light" | "sunken" | "dark" | "brand"; pad?: number; interactive?: boolean; class?: string; }
const { tone = "light", pad = 24, interactive = false, class: cls = "" } = Astro.props;
---
<div class:list={["card", `card--${tone}`, { "card--interactive": interactive }, cls]} style={`padding:${pad}px`}>
  <slot />
</div>
<style>
  .card { border-radius: var(--radius-md); }
  .card--light { background: var(--surface-card); color: var(--text-strong); border: 1px solid var(--border-light); box-shadow: var(--shadow-sm); }
  .card--sunken { background: var(--surface-sunken); color: var(--text-strong); border: 1px solid var(--border-light); }
  .card--dark { background: var(--surface-dark-raised); color: var(--text-on-dark-strong); border: 1px solid var(--border-dark); }
  .card--brand { background: var(--surface-brand); color: var(--ink-900); }
  .card--interactive { transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out); cursor: pointer; }
  .card--interactive:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
</style>
```

- [ ] **Step 6: Ejecutar tests + build**

Run: `npm test -- tests/components/statbar.test.ts`
Expected: PASS.
Run: `npm run build`
Expected: OK.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: componentes de datos/contenedores (StatBar, AvatarRing, Card)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 10: BaseLayout + Nav + Footer + LanguageSwitcher

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/sections/Nav.astro`, `Footer.astro`, `LanguageSwitcher.astro`
- Create: `public/robots.txt`

- [ ] **Step 1: robots.txt**

Create `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://USUARIO.github.io/club1+/sitemap-index.xml
```

(El sitemap real lo emite `@astrojs/sitemap` con el `site`+`base` configurados; actualizar el host si cambia el repo.)

- [ ] **Step 2: LanguageSwitcher.astro**

Create `src/components/sections/LanguageSwitcher.astro`:

```astro
---
import { getLangFromUrl, otherLang, getRoute, useTranslations } from "../../i18n/utils";
import { ROUTES, type RouteKey } from "../../i18n/routes";
interface Props { routeKey: RouteKey; }
const { routeKey } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const target = otherLang(lang);
const t = useTranslations(lang);
const href = import.meta.env.BASE_URL.replace(/\/$/, "") + getRoute(routeKey, target);
---
<a class="lang" href={href} hreflang={target} lang={target} aria-label={t("nav.langLabel")}>
  {t("nav.langLabel")}
</a>
<style>
  .lang { font-family: var(--font-mono); font-weight: 700; font-size: var(--fs-overline); letter-spacing: var(--ls-overline); text-transform: uppercase; text-decoration: none; padding: 6px 10px; border-radius: var(--radius-pill); border: 1.5px solid currentColor; }
</style>
```

- [ ] **Step 3: Nav.astro**

Create `src/components/sections/Nav.astro`:

```astro
---
import LogoBadge from "../brand/LogoBadge.astro";
import Button from "../brand/Button.astro";
import LanguageSwitcher from "./LanguageSwitcher.astro";
import { getLangFromUrl, useTranslations, getRoute } from "../../i18n/utils";
import type { RouteKey } from "../../i18n/routes";
interface Props { routeKey: RouteKey; }
const { routeKey } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const link = (k: RouteKey) => base + getRoute(k, lang);
const items: { k: RouteKey; label: string }[] = [
  { k: "modelo", label: t("nav.model") },
  { k: "impacto", label: t("nav.impact") },
  { k: "beneficiarias", label: t("nav.stories") },
  { k: "nosotros", label: t("nav.about") },
];
---
<header class="nav">
  <div class="container nav__bar">
    <a class="nav__logo" href={link("home")} aria-label={t("site.title")}>
      <LogoBadge size={40} variant="green" />
      <span class="nav__name">El Club del 1+</span>
    </a>
    <nav class="nav__links" aria-label="Primary">
      {items.map((i) => <a href={link(i.k)}>{i.label}</a>)}
    </nav>
    <div class="nav__actions">
      <LanguageSwitcher routeKey={routeKey} />
      <Button href={link("donar")} variant="primary" size="sm">{t("nav.donate")}</Button>
    </div>
    <button class="nav__toggle" aria-expanded="false" aria-controls="nav-mobile" aria-label={t("nav.menu")}>
      <span></span><span></span><span></span>
    </button>
  </div>
  <nav id="nav-mobile" class="nav__mobile" hidden aria-label="Mobile">
    {items.map((i) => <a href={link(i.k)}>{i.label}</a>)}
    <a class="nav__mobile-donate" href={link("donar")}>{t("nav.donate")}</a>
  </nav>
</header>

<script>
  const toggle = document.querySelector<HTMLButtonElement>(".nav__toggle");
  const menu = document.getElementById("nav-mobile");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    if (menu) menu.hidden = open;
  });
</script>

<style>
  .nav { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--paper-50) 88%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid var(--border-light); }
  .nav__bar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding-block: 12px; }
  .nav__logo { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; color: var(--text-strong); }
  .nav__name { font-family: var(--font-display); font-weight: 900; letter-spacing: -0.02em; font-size: 18px; }
  .nav__links { display: flex; gap: 22px; }
  .nav__links a { font-family: var(--font-display); font-weight: 700; font-size: 15px; text-decoration: none; color: var(--text-body); }
  .nav__links a:hover { color: var(--green-700); }
  .nav__actions { display: flex; align-items: center; gap: 12px; }
  .nav__toggle { display: none; flex-direction: column; gap: 4px; background: none; border: 0; padding: 8px; cursor: pointer; }
  .nav__toggle span { width: 22px; height: 2.5px; background: var(--ink-900); border-radius: 2px; }
  .nav__mobile { display: none; flex-direction: column; gap: 4px; padding: 12px clamp(20px,5vw,40px) 20px; border-top: 1px solid var(--border-light); }
  .nav__mobile a { font-family: var(--font-display); font-weight: 700; font-size: 17px; text-decoration: none; color: var(--text-body); padding: 10px 0; }
  .nav__mobile-donate { color: var(--green-700) !important; }
  @media (max-width: 860px) {
    .nav__links, .nav__actions { display: none; }
    .nav__toggle { display: inline-flex; }
    .nav__mobile:not([hidden]) { display: flex; }
  }
</style>
```

- [ ] **Step 4: Footer.astro**

Create `src/components/sections/Footer.astro`:

```astro
---
import LogoBadge from "../brand/LogoBadge.astro";
import Button from "../brand/Button.astro";
import { getLangFromUrl, useTranslations, getRoute } from "../../i18n/utils";
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const year = 2026;
---
<section class="ground-green cta plus-texture-ink">
  <div class="container cta__inner">
    <h2 class="display cta__title">{t("footer.tagline")}</h2>
    <Button href={base + getRoute("donar", lang)} variant="dark" size="lg">{t("nav.donate")}</Button>
  </div>
</section>
<footer class="ground-ink foot">
  <div class="container foot__inner">
    <div class="foot__brand">
      <LogoBadge size={48} variant="dark" />
      <p class="foot__rights">© {year} · {t("footer.rights")}</p>
    </div>
    <a class="foot__ig" href="https://instagram.com/clubdel1_" target="_blank" rel="noopener noreferrer">@clubdel1_</a>
  </div>
</footer>
<style>
  .cta { padding-block: clamp(48px, 8vw, 80px); }
  .cta__inner { display: flex; flex-direction: column; align-items: flex-start; gap: 28px; }
  .cta__title { font-size: clamp(30px, 5vw, 50px); max-width: 18ch; padding-bottom: 0.1em; }
  .foot { padding-block: 40px; }
  .foot__inner { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
  .foot__brand { display: flex; align-items: center; gap: 14px; }
  .foot__rights { font-family: var(--font-mono); font-size: 12.5px; color: var(--text-on-dark-muted); }
  .foot__ig { font-family: var(--font-mono); font-weight: 700; text-transform: uppercase; letter-spacing: var(--ls-overline); font-size: var(--fs-overline); color: var(--green-400); text-decoration: none; }
</style>
```

- [ ] **Step 5: BaseLayout.astro** (SEO/OG/hreflang/JSON-LD/fonts/ClientRouter/skip-link)

Create `src/layouts/BaseLayout.astro`:

```astro
---
import "../styles/global.css";
import { ClientRouter } from "astro:transitions";
import Nav from "../components/sections/Nav.astro";
import Footer from "../components/sections/Footer.astro";
import { getLangFromUrl, useTranslations, getRoute, otherLang } from "../i18n/utils";
import { ROUTES, type RouteKey } from "../i18n/routes";

interface Props { routeKey: RouteKey; title?: string; description?: string; }
const { routeKey, title, description } = Astro.props;
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);

const pageTitle = title ? `${title} · ${t("site.title")}` : `${t("site.title")} · ${t("site.tagline")}`;
const desc = description ?? t("site.description");
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const canonical = new URL(base + getRoute(routeKey, lang), Astro.site).href;
const altOther = new URL(base + getRoute(routeKey, otherLang(lang)), Astro.site).href;
const ogImage = new URL(base + "/og-default.png", Astro.site).href;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "El Club del 1+",
  alternateName: "El Club del 1 más",
  url: new URL(base + "/", Astro.site).href,
  description: t("site.description"),
  areaServed: "CO",
  sameAs: ["https://instagram.com/clubdel1_"],
};
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{pageTitle}</title>
    <meta name="description" content={desc} />
    <link rel="canonical" href={canonical} />
    <link rel="alternate" hreflang={lang} href={canonical} />
    <link rel="alternate" hreflang={otherLang(lang)} href={altOther} />
    <link rel="alternate" hreflang="x-default" href={new URL(base + getRoute(routeKey, "es"), Astro.site).href} />
    <link rel="icon" href={base + "/favicon.svg"} type="image/svg+xml" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={pageTitle} />
    <meta property="og:description" content={desc} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:locale" content={lang === "es" ? "es_CO" : "en_US"} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#2BE06F" />
    <set:html set:html={`<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`} />
    <ClientRouter />
  </head>
  <body>
    <a class="skip-link" href="#main">{t("a11y.skip")}</a>
    <Nav routeKey={routeKey} />
    <main id="main">
      <slot />
    </main>
    <Footer />
    <script>
      // Reveal-on-scroll (respeta reduced-motion vía CSS)
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }, { rootMargin: "0px 0px -10% 0px" });
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    </script>
  </body>
</html>
```

> Nota sobre el JSON-LD: usar `set:html` evita que el `<script type="application/ld+json">` se procese como módulo. Alternativa equivalente: insertar el bloque `<script is:inline type="application/ld+json" set:html={JSON.stringify(jsonLd)} />` directamente en el `<head>`.

- [ ] **Step 6: Página home temporal usando el layout**

Reemplaza `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout routeKey="home">
  <section class="section container"><h1 class="display">El Club del 1+</h1></section>
</BaseLayout>
```

- [ ] **Step 7: Verificar build + preview**

Run: `npm run build`
Expected: OK. El HTML de `dist/index.html` contiene `<title>`, `og:`, `hreflang`, JSON-LD, skip-link, nav y footer.
Run: `npm run preview` y abrir la URL local con `/club1+/` para inspección visual rápida.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: BaseLayout (SEO/OG/hreflang/JSON-LD/view-transitions) + Nav + Footer + LanguageSwitcher

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 11: Secciones — Hero y Mission

**Files:**
- Create: `src/components/sections/Hero.astro`, `Mission.astro`

- [ ] **Step 1: Hero.astro**

Create `src/components/sections/Hero.astro`:

```astro
---
import Button from "../brand/Button.astro";
import Highlight from "../brand/Highlight.astro";
import Overline from "../brand/Overline.astro";
import ChevronPill from "../brand/ChevronPill.astro";
import { getLangFromUrl, useTranslations, getRoute } from "../../i18n/utils";
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const copy = lang === "es"
  ? { over: "Startup social · Medellín, Colombia", lead: "Asociamos amigos para dar una renta básica mensual a madres cabeza de familia. Sumas un aporte recurrente. Ellas construyen su salida de la pobreza.", before: "La mejor forma de eliminar la pobreza es creando ", hl: "riqueza." }
  : { over: "Social startup · Medellín, Colombia", lead: "We bring friends together to fund a monthly basic income for female heads of household. You add a recurring contribution. They build their way out of poverty.", before: "The best way to end poverty is by creating ", hl: "wealth." };
---
<section class="ground-green hero">
  <div class="container">
    <Overline tone="dark">{copy.over}</Overline>
    <h1 class="display hero__title">{copy.before}<Highlight>{copy.hl}</Highlight></h1>
    <p class="hero__lead">{copy.lead}</p>
    <div class="hero__actions">
      <Button href={base + getRoute("donar", lang)} variant="dark" size="lg">{t("nav.donate")}</Button>
      <Button href={base + getRoute("modelo", lang)} variant="outline" size="lg">{t("cta.learn")}</Button>
      <ChevronPill count={3} variant="dark" />
    </div>
  </div>
</section>
<style>
  .hero { padding-block: clamp(56px, 9vw, 84px); }
  .hero__title { font-size: clamp(44px, 7vw, 84px); line-height: 1.1; margin-top: 20px; max-width: 16ch; padding-bottom: 0.1em; }
  .hero__lead { font-family: var(--font-body); font-weight: 500; font-size: clamp(17px, 2.2vw, 20px); line-height: 1.5; color: var(--ink-900); opacity: 0.86; margin-top: 18px; max-width: 46ch; }
  .hero__actions { display: flex; align-items: center; gap: 16px; margin-top: 36px; flex-wrap: wrap; }
</style>
```

- [ ] **Step 2: Mission.astro** (4 pasos, fondo ink con textura +)

Create `src/components/sections/Mission.astro`:

```astro
---
import Overline from "../brand/Overline.astro";
import Highlight from "../brand/Highlight.astro";
import CircledWord from "../brand/CircledWord.astro";
import Card from "../brand/Card.astro";
import { getLangFromUrl } from "../../i18n/utils";
const lang = getLangFromUrl(Astro.url);
const data = lang === "es"
  ? { over: "El modelo", t1: "Creamos un startup social ", hl: "que asocia amigos", t2: " para construir ", circ: "salidas reales.",
      steps: [
        { n: "01", t: "Sumas tu +", d: "Aportas una cantidad recurrente cada mes. Sin condiciones, con transparencia total." },
        { n: "02", t: "Asociamos amigos", d: "Tu aporte se suma al de cientos de amigos comprometidos en un mismo fondo." },
        { n: "03", t: "Renta básica", d: "Una madre cabeza de familia recibe un ingreso mensual estable para emprender." },
        { n: "04", t: "Crean riqueza", d: "Ellas generan ingresos por cuenta propia y rompen la trampa de la pobreza." },
      ] }
  : { over: "The model", t1: "We built a social startup ", hl: "that brings friends together", t2: " to build ", circ: "real ways out.",
      steps: [
        { n: "01", t: "Add your +", d: "You give a recurring amount each month. No conditions, full transparency." },
        { n: "02", t: "We pool friends", d: "Your contribution joins hundreds of committed friends in one fund." },
        { n: "03", t: "Basic income", d: "A female head of household receives a stable monthly income to build her business." },
        { n: "04", t: "They create wealth", d: "They generate their own income and break the poverty trap." },
      ] };
---
<section class="ground-ink plus-texture-green section">
  <div class="container">
    <Overline tone="green">{data.over}</Overline>
    <h2 class="display mission__title">{data.t1}<Highlight variant="green">{data.hl}</Highlight>{data.t2}<CircledWord color="var(--green-400)">{data.circ}</CircledWord></h2>
    <div class="mission__grid">
      {data.steps.map((s) => (
        <Card tone="dark" pad={24} class="reveal">
          <div class="mission__n">{s.n}</div>
          <h3 class="mission__h">{s.t}</h3>
          <p class="mission__d">{s.d}</p>
        </Card>
      ))}
    </div>
  </div>
</section>
<style>
  .mission__title { font-size: clamp(30px, 5vw, 46px); color: var(--paper-50); max-width: 22ch; margin-top: 16px; line-height: 1.1; }
  .mission__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 52px; }
  .mission__n { font-family: var(--font-mono); font-weight: 700; font-size: 13px; color: var(--green-400); letter-spacing: 0.1em; }
  .mission__h { font-family: var(--font-display); font-weight: 800; font-size: 21px; color: var(--paper-50); margin: 14px 0 8px; }
  .mission__d { font-family: var(--font-body); font-weight: 500; font-size: 14.5px; line-height: 1.5; color: var(--text-on-dark-muted); }
  @media (max-width: 900px) { .mission__grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px) { .mission__grid { grid-template-columns: 1fr; } }
</style>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: OK (las secciones aún no se usan en páginas; compila igual).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: secciones Hero (verde) y Mission (modelo, 4 pasos)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 12: Secciones — Impact y Stories (data desde collections)

**Files:**
- Create: `src/components/sections/Impact.astro`, `Stories.astro`

- [ ] **Step 1: Impact.astro** (stats desde la colección `stats`)

Create `src/components/sections/Impact.astro`:

```astro
---
import Overline from "../brand/Overline.astro";
import StatBar from "../brand/StatBar.astro";
import CircledWord from "../brand/CircledWord.astro";
import { getCollection } from "astro:content";
import { getLangFromUrl } from "../../i18n/utils";
const lang = getLangFromUrl(Astro.url);
const stats = (await getCollection("stats", (e) => e.data.lang === lang)).sort((a, b) => a.data.order - b.data.order);
const copy = lang === "es"
  ? { over: "Evaluación de resultados", before: "Los datos del ", circ: "problema real.", quote: "¿Funciona dar dinero sin condiciones? Los resultados son reveladores." }
  : { over: "Outcome evaluation", before: "The data behind the ", circ: "real problem.", quote: "Does giving money without conditions work? The results are revealing." };
---
<section class="ground-paper section">
  <div class="container">
    <Overline tone="muted">{copy.over}</Overline>
    <h2 class="display impact__title">{copy.before}<CircledWord>{copy.circ}</CircledWord></h2>
    <div class="impact__grid">
      <div class="impact__stats">
        {stats.map((s) => (
          <div class="reveal">
            <StatBar label={s.data.label} value={s.data.value} display={s.data.display} tone="light" />
            {s.data.source && <p class="impact__src">*{s.data.source}</p>}
          </div>
        ))}
      </div>
      <blockquote class="impact__quote">{copy.quote}</blockquote>
    </div>
  </div>
</section>
<style>
  .impact__title { font-size: clamp(28px, 4.5vw, 44px); color: var(--text-strong); max-width: 18ch; margin-top: 14px; line-height: 1.1; }
  .impact__grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 48px; margin-top: 44px; align-items: center; }
  .impact__stats { display: flex; flex-direction: column; gap: 28px; }
  .impact__src { font-family: var(--font-mono); font-size: 11px; color: var(--text-faint); margin-top: 6px; }
  .impact__quote { font-family: var(--font-display); font-weight: 800; font-size: clamp(20px, 3vw, 28px); line-height: 1.25; color: var(--text-strong); border-left: 4px solid var(--green-400); padding-left: 20px; margin: 0; }
  @media (max-width: 820px) { .impact__grid { grid-template-columns: 1fr; gap: 28px; } }
</style>
```

- [ ] **Step 2: Stories.astro** (historias desde la colección `stories`)

Create `src/components/sections/Stories.astro`:

```astro
---
import Overline from "../brand/Overline.astro";
import AvatarRing from "../brand/AvatarRing.astro";
import { getCollection } from "astro:content";
import { getLangFromUrl } from "../../i18n/utils";
const lang = getLangFromUrl(Astro.url);
const stories = (await getCollection("stories", (e) => e.data.lang === lang)).sort((a, b) => a.data.order - b.data.order);
const over = lang === "es" ? "Protagonistas" : "Protagonists";
const heading = lang === "es" ? "Ellas son la cara del cambio." : "They are the face of change.";
---
<section class="ground-ink section">
  <div class="container">
    <Overline tone="green">{over}</Overline>
    <h2 class="display stories__title">{heading}</h2>
    <div class="stories__grid">
      {stories.map((s) => (
        <article class="story reveal">
          <AvatarRing src={s.data.photo} alt={s.data.name} size={88} treatment="ring" name={s.data.name} />
          <blockquote class="story__quote">“{s.data.quote}”</blockquote>
          <p class="story__name">{s.data.name}</p>
          <p class="story__role">{s.data.role}{s.data.location ? ` · ${s.data.location}` : ""}</p>
        </article>
      ))}
    </div>
  </div>
</section>
<style>
  .stories__title { font-size: clamp(28px, 4.5vw, 44px); color: var(--paper-50); margin-top: 14px; max-width: 18ch; line-height: 1.1; }
  .stories__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 28px; margin-top: 44px; }
  .story { background: var(--surface-dark-raised); border: 1px solid var(--border-dark); border-radius: var(--radius-md); padding: 28px; }
  .story__quote { font-family: var(--font-display); font-weight: 800; font-size: 19px; line-height: 1.3; color: var(--paper-50); margin: 18px 0 14px; }
  .story__name { font-family: var(--font-display); font-weight: 800; font-size: 15px; color: var(--green-400); }
  .story__role { font-family: var(--font-body); font-size: 13px; color: var(--text-on-dark-muted); margin-top: 2px; }
</style>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: OK.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: secciones Impact (stats DANE) y Stories (beneficiarias) desde collections

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 13: Secciones — Tiers + DonateCTA (Treli) (TDD)

**Files:**
- Create: `src/components/sections/Tiers.astro`, `DonateCTA.astro`
- Test: `tests/components/tiers.test.ts`

- [ ] **Step 1: Test de Tiers (failing)**

Create `tests/components/tiers.test.ts`:

```ts
import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Tiers from "../../src/components/sections/Tiers.astro";

test("Tiers renderiza los 3 niveles con enlaces y toggle de frecuencia", async () => {
  const c = await AstroContainer.create({});
  const html = await c.renderToString(Tiers, { props: {}, request: new Request("https://x.io/club1+/donar") });
  expect(html).toContain("Amigo");
  expect(html).toContain("Aliado");
  expect(html).toContain("Mecenas");
  expect(html).toContain('data-freq-toggle');     // toggle presente
  expect(html).toContain('data-tier');             // tarjetas con datos para el script
});
```

> Si `getCollection` no estuviera disponible en el container de test, este test puede fallar por carga de contenido. En ese caso, marca el test como skip y confía en `npm run build` + verificación visual (Task 17). El resto del archivo se implementa igual.

- [ ] **Step 2: Ejecutar (falla)**

Run: `npm test -- tests/components/tiers.test.ts`
Expected: FAIL (no existe Tiers.astro).

- [ ] **Step 3: Implementar Tiers.astro**

Create `src/components/sections/Tiers.astro`:

```astro
---
import Overline from "../brand/Overline.astro";
import Highlight from "../brand/Highlight.astro";
import BrandSymbol from "../brand/BrandSymbol.astro";
import Button from "../brand/Button.astro";
import { getCollection } from "astro:content";
import { getLangFromUrl } from "../../i18n/utils";
import { treliLink } from "../../lib/donate";

const lang = getLangFromUrl(Astro.url);
const tiers = (await getCollection("tiers", (e) => e.data.lang === lang)).sort((a, b) => a.data.order - b.data.order);
const accentVar: Record<string, string> = { green: "var(--green-500)", coral: "var(--coral-500)", marigold: "var(--marigold-500)" };
const copy = lang === "es"
  ? { over: "Súmate", before: "Elige cómo ", hl: "sumar.", featured: "★ Más elegido", monthly: "Mensual", once: "Único", per: "/ mes", join: "Súmate como" }
  : { over: "Join", before: "Choose how to ", hl: "add.", featured: "★ Most chosen", monthly: "Monthly", once: "One-time", per: "/ mo", join: "Join as" };
const tierData = tiers.map((t) => ({
  ...t.data,
  urlMonthly: treliLink({ slug: t.slug, urlMonthly: t.data.urlMonthly, urlOneTime: t.data.urlOneTime }, "monthly"),
  urlOneTime: treliLink({ slug: t.slug, urlMonthly: t.data.urlMonthly, urlOneTime: t.data.urlOneTime }, "one-time"),
}));
---
<section class="ground-paper-100 section">
  <div class="container">
    <div class="tiers__head">
      <Overline color="var(--coral-500)">{copy.over}</Overline>
      <h2 class="display tiers__title">{copy.before}<Highlight variant="coral">{copy.hl}</Highlight></h2>
      <div class="tiers__toggle" role="group" aria-label="frecuencia" data-freq-toggle>
        <button class="is-on" data-freq="monthly" aria-pressed="true">{copy.monthly}</button>
        <button data-freq="one-time" aria-pressed="false">{copy.once}</button>
      </div>
    </div>
    <div class="tiers__grid">
      {tierData.map((t) => (
        <div class:list={["tier", { "tier--featured": t.featured }]} style={`--accent:${accentVar[t.accent]}`}>
          {t.featured && <span class="tier__flag">{copy.featured}</span>}
          <BrandSymbol symbol={t.symbol} size={44} color="var(--accent)" title={t.name} />
          <h3 class="tier__name">{t.name}</h3>
          <p class="tier__note">{t.note}</p>
          <div class="tier__price"><span class="tier__amount">{t.amount}</span><span class="tier__per">{copy.per}</span></div>
          <ul class="tier__perks">
            {t.perks.map((p) => (<li><BrandSymbol symbol="plus" size={14} color="var(--accent)" /> {p}</li>))}
          </ul>
          <Button
            href={t.urlMonthly}
            variant={t.featured ? "primary" : "outline"}
            full
            data-tier={t.slug}
            data-url-monthly={t.urlMonthly}
            data-url-onetime={t.urlOneTime}
            target="_blank"
          >{copy.join} {t.name}</Button>
        </div>
      ))}
    </div>
  </div>
</section>

<script>
  const toggle = document.querySelector<HTMLElement>("[data-freq-toggle]");
  let freq: "monthly" | "one-time" = "monthly";
  function apply() {
    document.querySelectorAll<HTMLAnchorElement>("a[data-tier]").forEach((a) => {
      const url = freq === "monthly" ? a.dataset.urlMonthly : a.dataset.urlOnetime;
      if (url) a.setAttribute("href", url);
    });
  }
  toggle?.querySelectorAll<HTMLButtonElement>("button[data-freq]").forEach((btn) => {
    btn.addEventListener("click", () => {
      freq = btn.dataset.freq === "one-time" ? "one-time" : "monthly";
      toggle.querySelectorAll("button").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      apply();
    });
  });
</script>

<style>
  .tiers__head { text-align: center; max-width: 32ch; margin: 0 auto 40px; }
  .tiers__title { font-size: clamp(28px, 4.5vw, 42px); color: var(--ink-900); margin-top: 14px; padding-bottom: 0.1em; }
  .tiers__toggle { display: inline-flex; background: var(--paper-200); border-radius: var(--radius-pill); padding: 4px; margin-top: 22px; }
  .tiers__toggle button { font-family: var(--font-display); font-weight: 700; font-size: 14px; border: 0; background: transparent; color: var(--text-muted); padding: 8px 18px; border-radius: var(--radius-pill); cursor: pointer; }
  .tiers__toggle button.is-on { background: var(--ink-900); color: var(--paper-50); }
  .tiers__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-items: stretch; }
  .tier { position: relative; display: flex; flex-direction: column; background: var(--paper-0); border: 1px solid var(--paper-200); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); padding: 28px; }
  .tier--featured { border: 2px solid var(--accent); box-shadow: var(--shadow-lg); transform: translateY(-8px); }
  .tier__flag { position: absolute; top: -13px; left: 50%; transform: translateX(-50%); background: var(--accent); color: var(--ink-900); font-family: var(--font-display); font-weight: 800; font-size: 12px; padding: 5px 14px; border-radius: var(--radius-pill); white-space: nowrap; }
  .tier__name { font-family: var(--font-display); font-weight: 800; font-size: 22px; color: var(--ink-900); margin: 18px 0 2px; }
  .tier__note { font-family: var(--font-body); font-size: 13.5px; color: var(--text-muted); }
  .tier__price { display: flex; align-items: baseline; gap: 6px; margin: 20px 0 18px; }
  .tier__amount { font-family: var(--font-display); font-weight: 900; font-size: 34px; letter-spacing: -0.02em; color: var(--accent); }
  .tier__per { font-family: var(--font-body); font-weight: 600; font-size: 14px; color: var(--text-muted); }
  .tier__perks { list-style: none; display: flex; flex-direction: column; gap: 10px; flex: 1; margin-bottom: 24px; }
  .tier__perks li { display: flex; align-items: flex-start; gap: 9px; font-family: var(--font-body); font-weight: 500; font-size: 14px; color: var(--text-body); }
  @media (max-width: 820px) { .tiers__grid { grid-template-columns: 1fr; } .tier--featured { transform: none; } }
</style>
```

- [ ] **Step 4: Ejecutar (pasa o skip justificado)**

Run: `npm test -- tests/components/tiers.test.ts`
Expected: PASS. (Si falla por `getCollection` en el container, marcar `test.skip` con comentario y continuar — la verificación real ocurre en build/visual.)

- [ ] **Step 5: DonateCTA.astro** (banda compacta reutilizable de cierre en páginas internas)

Create `src/components/sections/DonateCTA.astro`:

```astro
---
import Button from "../brand/Button.astro";
import { getLangFromUrl, useTranslations, getRoute } from "../../i18n/utils";
const lang = getLangFromUrl(Astro.url);
const t = useTranslations(lang);
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const line = lang === "es" ? "Tú + ellas = riqueza." : "You + them = wealth.";
---
<section class="ground-green donatecta">
  <div class="container donatecta__inner">
    <p class="display donatecta__line">{line}</p>
    <Button href={base + getRoute("donar", lang)} variant="dark" size="lg">{t("cta.join")}</Button>
  </div>
</section>
<style>
  .donatecta { padding-block: clamp(40px, 6vw, 64px); }
  .donatecta__inner { display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; }
  .donatecta__line { font-size: clamp(26px, 4vw, 40px); color: var(--ink-900); }
</style>
```

- [ ] **Step 6: Build**

Run: `npm run build`
Expected: OK.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: secciones Tiers (Treli + toggle frecuencia) y DonateCTA

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 14: Páginas en español (home + internas + 404)

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/modelo.astro`, `impacto.astro`, `beneficiarias.astro`, `nosotros.astro`, `donar.astro`, `404.astro`

- [ ] **Step 1: Home ES**

Reemplaza `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/sections/Hero.astro";
import Mission from "../components/sections/Mission.astro";
import Impact from "../components/sections/Impact.astro";
import Stories from "../components/sections/Stories.astro";
import Tiers from "../components/sections/Tiers.astro";
---
<BaseLayout routeKey="home">
  <Hero />
  <Mission />
  <Impact />
  <Stories />
  <Tiers />
</BaseLayout>
```

- [ ] **Step 2: Modelo ES**

Create `src/pages/modelo.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Mission from "../components/sections/Mission.astro";
import DonateCTA from "../components/sections/DonateCTA.astro";
---
<BaseLayout routeKey="modelo" title="El modelo" description="Sumas un aporte recurrente, asociamos amigos y financiamos una renta básica para que ellas creen riqueza.">
  <Mission />
  <DonateCTA />
</BaseLayout>
```

- [ ] **Step 3: Impacto ES**

Create `src/pages/impacto.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Impact from "../components/sections/Impact.astro";
import DonateCTA from "../components/sections/DonateCTA.astro";
---
<BaseLayout routeKey="impacto" title="Impacto" description="Evaluación de resultados de nuestras beneficiarias, con datos del DANE y expertos en impacto social.">
  <Impact />
  <DonateCTA />
</BaseLayout>
```

- [ ] **Step 4: Beneficiarias ES**

Create `src/pages/beneficiarias.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Stories from "../components/sections/Stories.astro";
import DonateCTA from "../components/sections/DonateCTA.astro";
---
<BaseLayout routeKey="beneficiarias" title="Beneficiarias" description="Conoce a las mujeres protagonistas que rompen la trampa de la pobreza creando riqueza.">
  <Stories />
  <DonateCTA />
</BaseLayout>
```

- [ ] **Step 5: Nosotros ES** (equipo + alianzas)

Create `src/pages/nosotros.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Overline from "../components/brand/Overline.astro";
import AvatarRing from "../components/brand/AvatarRing.astro";
import DonateCTA from "../components/sections/DonateCTA.astro";
import { getCollection } from "astro:content";
const team = (await getCollection("team", (e) => e.data.lang === "es")).sort((a, b) => a.data.order - b.data.order);
const partners = (await getCollection("partners", (e) => e.data.lang === "es")).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout routeKey="nosotros" title="Nosotros" description="No somos millonarios, somos amigos comprometidos. Conoce al equipo y a nuestros aliados.">
  <section class="ground-paper section">
    <div class="container">
      <Overline tone="muted">Nosotros</Overline>
      <h1 class="display about__title">No somos millonarios, somos amigos comprometidos.</h1>
      <h2 class="about__sub">Equipo</h2>
      <div class="about__team">
        {team.map((m) => <AvatarRing src={m.data.photo} alt={m.data.name} size={96} treatment="ring" name={m.data.name} />)}
      </div>
      <h2 class="about__sub">Aliados</h2>
      <ul class="about__partners">
        {partners.map((p) => <li>{p.data.url ? <a href={p.data.url} target="_blank" rel="noopener noreferrer">{p.data.name}</a> : p.data.name}</li>)}
      </ul>
    </div>
  </section>
  <DonateCTA />
</BaseLayout>
<style>
  .about__title { font-size: clamp(30px, 5vw, 52px); color: var(--text-strong); max-width: 20ch; margin-top: 14px; padding-bottom: 0.1em; }
  .about__sub { font-family: var(--font-display); font-weight: 800; font-size: 24px; color: var(--text-strong); margin: 48px 0 20px; }
  .about__team { display: flex; flex-wrap: wrap; gap: 28px; }
  .about__partners { list-style: none; display: flex; flex-wrap: wrap; gap: 16px 28px; font-family: var(--font-display); font-weight: 800; font-size: 20px; color: var(--text-body); }
  .about__partners a { text-decoration: none; }
</style>
```

- [ ] **Step 6: Donar ES**

Create `src/pages/donar.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Tiers from "../components/sections/Tiers.astro";
---
<BaseLayout routeKey="donar" title="Sé socio" description="Súmate al Club. Elige tu aporte recurrente y conviértete en amigo comprometido. Pago seguro vía Treli.">
  <section class="ground-green section donar-head">
    <div class="container">
      <h1 class="display donar-head__title">Convierte tu + en la luz del cambio.</h1>
      <p class="donar-head__lead">Elige cuánto sumar cada mes. El cobro es seguro y recurrente vía Treli; cancelas cuando quieras.</p>
    </div>
  </section>
  <Tiers />
</BaseLayout>
<style>
  .donar-head { padding-bottom: 0; }
  .donar-head__title { font-size: clamp(34px, 6vw, 60px); color: var(--ink-900); max-width: 16ch; padding-bottom: 0.1em; }
  .donar-head__lead { font-family: var(--font-body); font-weight: 500; font-size: clamp(16px, 2vw, 19px); color: var(--ink-900); opacity: 0.86; max-width: 48ch; margin-top: 14px; }
</style>
```

- [ ] **Step 7: 404 branded**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Button from "../components/brand/Button.astro";
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
---
<BaseLayout routeKey="home" title="404">
  <section class="ground-ink section nf">
    <div class="container nf__inner">
      <p class="display nf__big">404</p>
      <h1 class="nf__h">Esta página se nos perdió.</h1>
      <Button href={base + "/"} variant="primary" size="lg">Volver al inicio</Button>
    </div>
  </section>
</BaseLayout>
<style>
  .nf__inner { text-align: center; }
  .nf__big { font-size: clamp(80px, 18vw, 180px); color: var(--green-400); line-height: 1; }
  .nf__h { font-family: var(--font-display); font-weight: 800; font-size: clamp(22px, 4vw, 32px); color: var(--paper-50); margin: 8px 0 28px; }
</style>
```

- [ ] **Step 8: Build + preview**

Run: `npm run build`
Expected: OK. `dist/` contiene `index.html`, `modelo/index.html`, `impacto/index.html`, `beneficiarias/index.html`, `nosotros/index.html`, `donar/index.html`, `404.html`.
Run: `npm run preview` y navegar las páginas ES en `/club1+/...`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: páginas en español (home, modelo, impacto, beneficiarias, nosotros, donar, 404)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 15: Páginas en inglés (espejo bajo /en)

**Files:**
- Create: `src/pages/en/index.astro`, `model.astro`, `impact.astro`, `stories.astro`, `about.astro`, `donate.astro`

> Las secciones detectan el idioma por `Astro.url` (que será `/en/...`), así que cada página EN compone las mismas secciones; el copy interno conmuta solo. `routeKey` es el mismo que su par ES.

- [ ] **Step 1: Home EN**

Create `src/pages/en/index.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Hero from "../../components/sections/Hero.astro";
import Mission from "../../components/sections/Mission.astro";
import Impact from "../../components/sections/Impact.astro";
import Stories from "../../components/sections/Stories.astro";
import Tiers from "../../components/sections/Tiers.astro";
---
<BaseLayout routeKey="home">
  <Hero />
  <Mission />
  <Impact />
  <Stories />
  <Tiers />
</BaseLayout>
```

- [ ] **Step 2: Model EN**

Create `src/pages/en/model.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Mission from "../../components/sections/Mission.astro";
import DonateCTA from "../../components/sections/DonateCTA.astro";
---
<BaseLayout routeKey="modelo" title="The model" description="You add a recurring contribution, we pool friends, and fund a basic income so they create wealth.">
  <Mission />
  <DonateCTA />
</BaseLayout>
```

- [ ] **Step 3: Impact EN**

Create `src/pages/en/impact.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Impact from "../../components/sections/Impact.astro";
import DonateCTA from "../../components/sections/DonateCTA.astro";
---
<BaseLayout routeKey="impacto" title="Impact" description="Outcome evaluation of our beneficiaries, with DANE data and social-impact experts.">
  <Impact />
  <DonateCTA />
</BaseLayout>
```

- [ ] **Step 4: Stories EN**

Create `src/pages/en/stories.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Stories from "../../components/sections/Stories.astro";
import DonateCTA from "../../components/sections/DonateCTA.astro";
---
<BaseLayout routeKey="beneficiarias" title="Beneficiaries" description="Meet the women breaking the poverty trap by creating wealth.">
  <Stories />
  <DonateCTA />
</BaseLayout>
```

- [ ] **Step 5: About EN**

Create `src/pages/en/about.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Overline from "../../components/brand/Overline.astro";
import AvatarRing from "../../components/brand/AvatarRing.astro";
import DonateCTA from "../../components/sections/DonateCTA.astro";
import { getCollection } from "astro:content";
const team = (await getCollection("team", (e) => e.data.lang === "en")).sort((a, b) => a.data.order - b.data.order);
const partners = (await getCollection("partners", (e) => e.data.lang === "en")).sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout routeKey="nosotros" title="About" description="We're not millionaires, we're committed friends. Meet the team and our partners.">
  <section class="ground-paper section">
    <div class="container">
      <Overline tone="muted">About</Overline>
      <h1 class="display about__title">We're not millionaires, we're committed friends.</h1>
      <h2 class="about__sub">Team</h2>
      <div class="about__team">
        {team.map((m) => <AvatarRing src={m.data.photo} alt={m.data.name} size={96} treatment="ring" name={m.data.name} />)}
      </div>
      <h2 class="about__sub">Partners</h2>
      <ul class="about__partners">
        {partners.map((p) => <li>{p.data.url ? <a href={p.data.url} target="_blank" rel="noopener noreferrer">{p.data.name}</a> : p.data.name}</li>)}
      </ul>
    </div>
  </section>
  <DonateCTA />
</BaseLayout>
<style>
  .about__title { font-size: clamp(30px, 5vw, 52px); color: var(--text-strong); max-width: 20ch; margin-top: 14px; padding-bottom: 0.1em; }
  .about__sub { font-family: var(--font-display); font-weight: 800; font-size: 24px; color: var(--text-strong); margin: 48px 0 20px; }
  .about__team { display: flex; flex-wrap: wrap; gap: 28px; }
  .about__partners { list-style: none; display: flex; flex-wrap: wrap; gap: 16px 28px; font-family: var(--font-display); font-weight: 800; font-size: 20px; color: var(--text-body); }
  .about__partners a { text-decoration: none; }
</style>
```

- [ ] **Step 6: Donate EN**

Create `src/pages/en/donate.astro`:

```astro
---
import BaseLayout from "../../layouts/BaseLayout.astro";
import Tiers from "../../components/sections/Tiers.astro";
---
<BaseLayout routeKey="donar" title="Become a member" description="Join the Club. Pick your recurring contribution and become a committed friend. Secure payment via Treli.">
  <section class="ground-green section donar-head">
    <div class="container">
      <h1 class="display donar-head__title">Turn your + into the light of change.</h1>
      <p class="donar-head__lead">Choose how much to add each month. Payment is secure and recurring via Treli; cancel anytime.</p>
    </div>
  </section>
  <Tiers />
</BaseLayout>
<style>
  .donar-head { padding-bottom: 0; }
  .donar-head__title { font-size: clamp(34px, 6vw, 60px); color: var(--ink-900); max-width: 16ch; padding-bottom: 0.1em; }
  .donar-head__lead { font-family: var(--font-body); font-weight: 500; font-size: clamp(16px, 2vw, 19px); color: var(--ink-900); opacity: 0.86; max-width: 48ch; margin-top: 14px; }
</style>
```

- [ ] **Step 7: Build + verificar rutas EN**

Run: `npm run build`
Expected: OK. `dist/en/` contiene `index.html`, `model/`, `impact/`, `stories/`, `about/`, `donate/`.
Run: `npm run preview` y navegar `/club1+/en/` y verificar que el copy está en inglés y el LanguageSwitcher cruza ES↔EN correctamente.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: páginas en inglés espejo bajo /en (home, model, impact, stories, about, donate)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 16: Activos SEO (favicon, OG) y verificación de hreflang/sitemap

**Files:**
- Create: `public/favicon.svg`, `public/og-default.png`

- [ ] **Step 1: Favicon de marca**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="100" fill="#2BE06F"/>
  <text x="64" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="108" letter-spacing="-4" fill="#0C1A13">1</text>
  <g fill="#0C1A13"><rect x="108" y="66" width="19" height="58" rx="4"/><rect x="88" y="86" width="59" height="19" rx="4"/></g>
</svg>
```

- [ ] **Step 2: Imagen OG placeholder**

Genera una imagen OG 1200×630 de marca a partir del logo (placeholder editable):

```bash
# Si tienes rsvg-convert o similar disponible, rasteriza; si no, copia un PNG temporal:
# Placeholder mínimo: un PNG verde con el logo. Sustituir luego por una OG diseñada.
cp ".ds-source/uploads/IMG_0851.PNG" public/og-default.png 2>/dev/null || node -e "const fs=require('fs');const b=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==','base64');fs.writeFileSync('public/og-default.png',b)"
```
> Flag: `og-default.png` es un placeholder. Reemplazar por una imagen OG 1200×630 diseñada con el headline de marca.

- [ ] **Step 3: Build + verificar SEO en el HTML generado**

Run: `npm run build`
Expected: OK.

Run: `grep -l "hreflang" dist/index.html dist/en/index.html`
Expected: ambos archivos listados.

Run: `cat dist/sitemap-index.xml`
Expected: existe y referencia `sitemap-0.xml` con las URLs ES y EN bajo el `site`+`base`.

- [ ] **Step 4: Verificar JSON-LD**

Run: `grep -o 'application/ld+json' dist/index.html`
Expected: una coincidencia (el bloque NGO está presente).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: favicon de marca, OG placeholder y verificación de hreflang/sitemap/JSON-LD

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 17: Verificación integral (tipos, build, a11y, visual)

**Files:** (sin cambios de código salvo correcciones que surjan)

- [ ] **Step 1: Chequeo de tipos**

Run: `npm run check`
Expected: `0 errors`. Corregir cualquier error de tipos inline antes de seguir.

- [ ] **Step 2: Suite de tests completa**

Run: `npm test`
Expected: todos PASS (i18n, donate, content, button, highlight, logobadge, statbar, tiers).

- [ ] **Step 3: Build de producción**

Run: `npm run build`
Expected: OK, sin warnings de assets.

- [ ] **Step 4: Preview + revisión visual con captura**

Run: `npm run preview` (en background) y luego, con Chrome MCP o el navegador, abrir:
- `/club1+/` (home ES), `/club1+/en/` (home EN)
- `/club1+/donar` y verificar el toggle Mensual/Único cambia los enlaces (inspeccionar `href` de los botones de tier)
- `/club1+/nosotros`, `/club1+/impacto`

Verificar manualmente:
- Skip-link aparece al tabular.
- Foco con anillo verde visible en enlaces/botones.
- Nav colapsa a hamburguesa < 860px y abre/cierra.
- LanguageSwitcher cruza a la página equivalente en el otro idioma.

- [ ] **Step 5: Accesibilidad (axe) en home y donar**

Si hay extensión/CLI axe disponible, correr sobre `/club1+/` y `/club1+/donar`.
Expected: 0 violaciones críticas/serias. Si aparecen (p.ej. contraste de un acento sobre paper), ajustar el color del acento o el texto y re-verificar.

- [ ] **Step 6: Commit (si hubo correcciones)**

```bash
git add -A
git commit -m "fix: correcciones de tipos/a11y tras verificación integral

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 18: Deploy a GitHub Pages + README

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

- [ ] **Step 1: Workflow de deploy**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: README**

Create `README.md`:

```md
# El Club del 1+ — Sitio web

Sitio multipágina bilingüe (ES/EN) en Astro. Estático, desplegado en GitHub Pages.
Donación vía Treli (sin backend). Fiel al design system "El Club del 1+".

## Desarrollo
```bash
npm install
npm run dev      # http://localhost:4321/club1+/
npm run check    # tipos
npm test         # vitest
npm run build    # genera dist/
```

## Despliegue (GitHub Pages)
1. Crear el repo en GitHub. **Aviso:** GitHub no admite `+` en el nombre; `club1+`
   se convierte en `club1-`. Confirmar el nombre real.
2. En `astro.config.mjs`, fijar `GH_USER` y `REPO` con los valores reales (único lugar).
3. En el repo: Settings → Pages → Source = **GitHub Actions**.
4. Push a `main`: el workflow `.github/workflows/deploy.yml` construye y publica.

## Editar contenido
- Textos de UI/nav: `src/i18n/es.json` y `en.json`.
- Tiers, historias, stats, aliados, equipo: `src/content/**` (Markdown + frontmatter).
- **URLs de Treli:** en cada `src/content/tiers/*.md` (`urlMonthly`, `urlOneTime`).
  Mientras estén vacías, los botones caen al fallback `TIER_FALLBACK` en `src/lib/donate.ts`.

## Pendientes (flags)
- Fuente real de marca (hoy: Hanken Grotesk, sustitución).
- URLs reales de Treli por tier.
- Imagen OG diseñada (`public/og-default.png` es placeholder).
- Fotos reales de beneficiarias/equipo (campo `photo` en las collections).
```

- [ ] **Step 3: Build final**

Run: `npm run build`
Expected: OK.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "ci: workflow de deploy a GitHub Pages + README

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

- [ ] **Step 5: (Manual, fuera del agente) Crear repo y publicar**

Indicar al usuario:
1. Crear repo en GitHub (confirmar nombre real → ajustar `GH_USER`/`REPO`).
2. `git remote add origin <url>` y `git push -u origin main`.
3. Settings → Pages → Source = GitHub Actions.
4. Verificar la URL publicada y, si el nombre cambió, ajustar `astro.config.mjs` y re-push.

---

## Self-Review (completado por el planner)

**1. Cobertura del spec:**
- Multipágina bilingüe → Tasks 14, 15 (ES/EN); i18n → Task 4; hreflang/sitemap → Tasks 10, 16. ✓
- Donación Treli sin backend → Tasks 5, 13 (lógica + sección + toggle). ✓
- Contenido editable + copy real → Task 6 (collections), Task 4 (diccionarios). ✓
- Tokens portados + componentes .astro → Tasks 2, 7, 8, 9. ✓
- Secciones del DS (Hero/Mission/Impact/Stories/Tiers/Donate/Footer/Nav) → Tasks 10–13. ✓
- Fidelidad de marca (marker, circled, chevron, +, símbolos, grounds) → componentes en 7–9, uso en 11–13. ✓
- Rendimiento (≈0 JS, fonts self-host, assets) → Tasks 2, 3, 10. ✓
- A11y (skip-link, focus, reduced-motion, teclado) → Tasks 2, 10, 17. ✓
- SEO (title/desc/canonical/OG/hreflang/sitemap/JSON-LD) → Tasks 10, 16. ✓
- View Transitions + reveal → Task 10. ✓
- 404 branded → Task 14. ✓
- Deploy GitHub Pages (base configurable) → Tasks 1, 18. ✓
- Verificación → Task 17. ✓

**2. Placeholders:** Los únicos "TODO" son intencionales y señalados como tales: URLs de Treli, `GH_USER`/`REPO`, y la imagen OG. No hay pasos vacíos ni "implementar luego".

**3. Consistencia de tipos:** `getLangFromUrl`, `useTranslations`, `getRoute`, `otherLang` (Task 4) se usan con las mismas firmas en Tasks 10–15. `treliLink`/`TierLinks` (Task 5) coinciden con su uso en Task 13. `routeKey: RouteKey` consistente en BaseLayout, Nav, LanguageSwitcher y todas las páginas. Nombres de colecciones (`tiers/stories/stats/partners/team`) idénticos entre `config.ts` (Task 6) y su consumo (Tasks 12–15).
