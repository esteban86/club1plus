export type Lang = "es" | "en";

// Clave de página → ruta (sin base) por idioma. Fuente única para hreflang y switcher.
export const ROUTES = {
  home:          { es: "/",              en: "/en/" },
  modelo:        { es: "/modelo",        en: "/en/model" },
  impacto:       { es: "/impacto",       en: "/en/impact" },
  evidencia:     { es: "/evidencia",     en: "/en/evidence" },
  beneficiarias: { es: "/beneficiarias", en: "/en/stories" },
  nosotros:      { es: "/nosotros",      en: "/en/about" },
  donar:         { es: "/donar",         en: "/en/donate" },
  gracias:       { es: "/gracias",       en: "/en/thanks" },
  privacidad:    { es: "/privacidad",    en: "/en/privacy" },
  // ── Demo interactiva (portal de socios, comunidad y admin) ──
  ingresar:      { es: "/ingresar",      en: "/en/login" },
  miEspacio:     { es: "/mi-espacio",    en: "/en/my-space" },
  bienvenida:    { es: "/bienvenida",    en: "/en/welcome" },
  comunidad:     { es: "/comunidad",     en: "/en/community" },
  admin:         { es: "/admin",         en: "/en/admin" },
} as const;

export type RouteKey = keyof typeof ROUTES;
export const LANGS: readonly Lang[] = ["es", "en"];
