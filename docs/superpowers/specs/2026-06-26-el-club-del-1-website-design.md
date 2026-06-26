# El Club del 1+ — Sitio web (Astro + GitHub Pages)

**Fecha:** 2026-06-26
**Estado:** Diseño aprobado — pendiente revisión del spec por el usuario

---

## 1. Resumen

Construir el sitio web de **El Club del 1+** (startup social de Medellín, Colombia
que combate la pobreza creando riqueza mediante una renta básica recurrente para
madres cabeza de familia emprendedoras) en **Astro**, desplegado en **GitHub Pages**,
con las mejores prácticas de rendimiento, accesibilidad, SEO e i18n.

El sitio debe sentirse **recontra cool**: eléctrico, confiado, cálido y humano —
energía activista con filo de startup, fiel al design system rebrandeado a "1+"
(el `+` es el héroe; nunca se menciona "1%").

### Decisiones tomadas (brainstorming)

| Decisión | Elección |
|---|---|
| Estructura | **Sitio multipágina** |
| Donación | **Pasarela vía Treli** (checkout/links hospedados, sin backend) |
| Idioma | **Bilingüe ES/EN** (i18n nativo de Astro) |
| Contenido | **Placeholder pro + copy real de marca**, estructurado en archivos editables |
| Hosting | **GitHub Pages** en `usuario.github.io/repo` (base `/REPO`) |
| Enfoque DS | **Portar a componentes `.astro` nativos** (tokens CSS tal cual; JS mínimo) |

---

## 2. Fuente de marca (design system provisto)

El design system completo está en `.ds-source/` (extraído del zip provisto; **no se
commitea** — es material de referencia, va en `.gitignore`). Contiene:

- **Tokens CSS** (`tokens/colors.css`, `typography.css`, `spacing.css`, `radius.css`,
  `effects.css`, `fonts.css`) — agnósticos de framework, se portan tal cual.
- **Componentes React/JSX** (forms, content, brand, feedback) — referencia visual,
  se reimplementan en `.astro`.
- **UI kit web** (`ui_kits/web/`: Nav, Hero, Mission, Impact, Stories, Tiers, Donate,
  Footer) — referencia de composición de cada sección.
- **Assets**: `logo-badge-green.svg`, `logo-badge-dark.svg`.
- **Guidelines** de color, tipo, spacing, marca.

### Fundamentos de marca a respetar
- **Color (dos polos):** verde eléctrico `#2BE06F` (héroe) sobre ink bosque `#0F1F17`
  (nunca negro puro) + paper `#F4F6F2`. Coral `#FF6B4A` / marigold `#FFC23D` solo como
  acentos cálidos sobre paper. Fondos planos full-bleed: verde, ink o paper.
- **Tipografía:** una grotesca geométrica pesada (Hanken Grotesk — *sustitución*,
  confirmar fuente real) para display (900, tight) y body (500, abierto); Space Mono
  para datos/fechas/handles (uppercase, tracked).
- **Motivos firma:** marker-box highlight, circled word (elipse a mano), chevron pill
  `>>>`, logo badge circular "1+", el motivo **+** (copy "tu +", lockup
  "Tú + ellas = riqueza", textura de `+` a ~13–16% opacidad), familia de símbolos
  (plus/equals/rise/ring/spark), fotos con duotono verde/scrim/recorte circular con
  anillo verde.
- **Voz:** español colombiano + inglés; cálido, directo, dignificante. "Nosotros" para
  el Club, "tú" para el donante; preguntas retóricas (¿…?) y exclamaciones (¡…!); citar
  fuentes (DANE). Beneficiarias como protagonistas, nunca víctimas.
- **Léxico:** amigos comprometidos · beneficiarias · renta básica · pobreza monetaria ·
  trampa de la pobreza · creando riqueza · sin condiciones · sumar/suma · tu +.
  **Prohibido:** "1%", "dona el 1%".
- **Movimiento:** rápido y confiado (120–360ms, ease-out, leve overshoot); barras llenan
  de izq→der; press `scale(0.96)`; respetar `prefers-reduced-motion`.

---

## 3. Arquitectura de información

ES en la raíz, EN bajo `/en` (i18n nativo de Astro con `prefixDefaultLocale: false`),
con `hreflang` recíproco.

| Página | Ruta ES | Ruta EN | Contenido |
|---|---|---|---|
| Home | `/` | `/en/` | Hero + teasers de cada sección + CTA donar |
| El Modelo | `/modelo` | `/en/model` | Cómo funciona (4 pasos); "¿Funciona dar dinero sin condiciones?" |
| Impacto | `/impacto` | `/en/impact` | Evaluación de resultados, datos DANE, study cases, StatBars |
| Beneficiarias | `/beneficiarias` | `/en/stories` | Historias/protagonistas con tratamiento de foto verde |
| Nosotros | `/nosotros` | `/en/about` | Equipo + Alianzas combinados |
| Donar | `/donar` | `/en/donate` | Tiers de membresía → checkout Treli |
| 404 | branded | branded | Página de error con marca |

6 páginas × 2 idiomas + 404. Ajustable (separar Equipo/Alianzas o fusionar
Modelo+Impacto) si el contenido lo pide.

---

## 4. Estructura del proyecto

```
src/
  layouts/
    BaseLayout.astro        # <head> SEO/OG/hreflang/JSON-LD, fonts, ClientRouter
                            # (view transitions), skip-link, Nav, Footer, slot
  components/
    brand/                  # Portados a .astro desde el DS
      LogoBadge.astro  BrandSymbol.astro  AvatarRing.astro
      Highlight.astro  CircledWord.astro  Overline.astro  ChevronPill.astro
      StatBar.astro    Button.astro       Badge.astro     Card.astro
    sections/               # Composición por página
      Nav.astro  Hero.astro  Mission.astro  Impact.astro
      Stories.astro  Tiers.astro  DonateCTA.astro  Footer.astro
      LanguageSwitcher.astro
  content/                  # Content Collections tipadas (editables)
      stories/  tiers/  stats/  partners/  team/   (+ config.ts con schemas zod)
  i18n/
      es.json  en.json      # strings de UI + navegación
      utils.ts              # getLangFromUrl(), useTranslations(), localizePath()
  pages/
      index.astro  modelo.astro  impacto.astro  beneficiarias.astro
      nosotros.astro  donar.astro  404.astro
      en/  (espejo de las anteriores)
  styles/
      tokens.css            # portado del DS (colors, type, spacing, radius, effects)
      global.css            # reset, base, motivos +, utilidades
public/
  fonts/                    # self-host (woff2)
  logo-badge-green.svg  logo-badge-dark.svg
  og-image.png  favicon.svg  robots.txt
.github/workflows/deploy.yml  # build + deploy a Pages (withastro/action)
astro.config.mjs              # site + base '/REPO'; integraciones sitemap + i18n
package.json  tsconfig.json  .gitignore
```

---

## 5. Componentes (contratos)

Cada componente portado tiene un propósito único, interfaz por props clara, y se prueba
visualmente de forma aislada.

- **Button** — `variant: 'green'|'dark'|'outline'`, `size: 'md'|'lg'`, `href?`, `onClick?`.
  Pills redondos; hover oscurece, press `scale(0.96)`, focus ring verde 3px.
- **Highlight** — marker-box detrás de keyword; auto-invierte según fondo (verde/ink/paper).
- **CircledWord** — elipse SVG dibujada a mano alrededor de una frase.
- **Overline** — etiqueta mono uppercase tracked; `tone: 'dark'|'light'|'green'`.
- **ChevronPill** — `>>>` en pill, afordancia de "siguiente"; chevrons se desvanecen.
- **LogoBadge** — badge circular "1+"; `variant: 'green'|'dark'`, `size`.
- **BrandSymbol** — `name: 'plus'|'equals'|'rise'|'ring'|'spark'`, `tint`.
- **AvatarRing** — foto recortada en círculo con anillo verde + scrim.
- **StatBar** — barra de progreso/dato verde/ink; llena izq→der.
- **Badge / Card** — feedback chips y tarjetas (radio 12px, hairline 1px).

Las **secciones** componen estos brand components + contenido de las collections.

---

## 6. Modelo de contenido (editable, separado del código)

- **Content Collections** (con schemas zod en `content/config.ts`) para:
  `stories` (beneficiarias), `tiers` (membresías + link Treli), `stats` (cifras DANE),
  `partners` (aliados), `team` (equipo). Cada entry lleva un campo **`lang: 'es' | 'en'`**
  en su frontmatter; las secciones filtran las entries por el idioma de la página.
- **Diccionarios i18n** (`i18n/es.json`, `en.json`) para textos de UI, nav, CTAs.
- Copy real de marca; fotos placeholder con tratamiento verde-duotono/scrim/círculo,
  con `alt` real, listas para reemplazar por material del Club.

---

## 7. Flujo de donación (Treli, sin backend)

- Cada **tier** (entry de la collection `tiers`) tiene un campo `treliUrl` con el link de
  checkout/suscripción hospedado por Treli. **Placeholders marcados** hasta tener las URLs
  reales (`// TODO: URL Treli real`).
- En `/donar`: tarjetas de tier (acentos cálidos sobre paper) + toggle de frecuencia
  (mensual/único) que cambia el `href` destino. Vanilla JS mínimo (sin framework).
- Enlaces con `rel="noopener noreferrer"` y `target="_blank"`; el cobro ocurre en el
  checkout hospedado de Treli. **Cero manejo de dinero en el sitio.**
- El CTA global "Sé socio" (Nav, Hero, Footer) lleva a `/donar`.

---

## 8. Mejores prácticas (rendimiento / a11y / SEO)

**Rendimiento**
- Output estático; **~0 JS** (solo `ClientRouter` de view transitions + toggles vanilla
  pequeños + reveal con IntersectionObserver).
- `astro:assets` `<Image>` para imágenes responsive optimizadas.
- Fuentes **self-hosted** (woff2) con `<link rel="preload">` y `font-display: swap`.
- Meta Lighthouse **95–100** en las 4 categorías.

**Accesibilidad**
- HTML5 semántico, **skip-link**, landmarks, jerarquía de headings correcta.
- Focus ring verde 3px (DS), navegación completa por teclado, `aria-*` donde aplique.
- Contraste AA (verificar pares verde/ink/paper), `prefers-reduced-motion` respetado.

**SEO**
- `title`/`description` por página; `canonical`; **`hreflang` ES/EN recíproco**.
- **Open Graph** + **Twitter cards**; imagen OG de marca.
- `sitemap.xml` (`@astrojs/sitemap`); `robots.txt`.
- **JSON-LD**: `Organization`/`NGO` + `DonateAction` + `BreadcrumbList`.

**Navegación / motion**
- Astro **View Transitions** (`<ClientRouter />`) para transiciones de página suaves.
- Reveal sutil en scroll (IntersectionObserver), desactivado bajo reduced-motion.

---

## 9. Despliegue

- `astro.config.mjs`: `site: 'https://USUARIO.github.io'`, `base: '/REPO'`
  (claramente marcados para completar con el repo real).
- **GitHub Actions** (`.github/workflows/deploy.yml`) usando `withastro/action` +
  `actions/deploy-pages`: build en push a `main` → deploy a Pages.
- `.nojekyll` implícito por la action. Migrable a dominio propio (`clubdel1.org`) luego
  cambiando `site`/`base` y añadiendo `CNAME`.

---

## 10. Manejo de errores y casos límite

- **404 branded** (`src/pages/404.astro`) en ambos idiomas.
- Enlaces externos (Treli, redes) con `rel="noopener noreferrer"`.
- Imágenes faltantes: `alt` descriptivo + color de fondo de marca como fallback.
- i18n: si falta una clave de traducción, fallback al español (idioma base) con aviso en dev.

---

## 11. Verificación

- `astro check` sin errores de tipos.
- `npm run build` exitoso; `npm run preview` para revisión local.
- Chequeo de accesibilidad (axe) en páginas clave.
- Validación de enlaces internos y `hreflang`.
- Captura/preview de las páginas principales al finalizar.

---

## 12. Fuera de alcance (YAGNI)

- Pasarela de pago propia / serverless (se usa Treli hospedado).
- CMS headless (basta Content Collections + Markdown).
- Blog / sistema de noticias (puede añadirse luego sobre la misma arquitectura).
- Animaciones complejas / WebGL.
- Dominio propio ahora (migrable después).

---

## 13. Flags a confirmar con el usuario

- **Fuente real** de la marca (Hanken Grotesk es sustitución del DS).
- **URLs reales de Treli** por tier (mensual/único).
- **Nombre del repo / usuario GitHub** para `base` y `site`.
- **Iconset** (el DS sugiere Lucide como sustitución).
- Set final de páginas (separar Equipo/Alianzas o fusionar Modelo+Impacto).
