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
