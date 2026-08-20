import type { APIRoute } from "astro";

// robots.txt dinámico: la URL del sitemap se deriva del `site` configurado
// en astro.config.mjs (fuente única). Al fijar GH_USER/REPO, se actualiza solo.
export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  // Staging: bloquear por completo. Es contenido en revisión.
  if (import.meta.env.PUBLIC_IS_STAGING === "1") {
    return new Response("User-agent: *\nDisallow: /\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const lines = ["User-agent: *", "Allow: /", ""];
  if (site) {
    const origin = site.href.replace(/\/$/, "");
    lines.push(`Sitemap: ${origin}${base}/sitemap-index.xml`);
  }
  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
