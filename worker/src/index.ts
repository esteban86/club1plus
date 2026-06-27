/**
 * club1plus-pay — Cloudflare Worker que firma un Web Checkout de Wompi para un
 * monto EXACTO (pago único) y redirige. El secreto de integridad nunca sale del Worker.
 *
 *   GET /checkout?amount=<COP entero>  -> 302 a checkout.wompi.co/p/ con la firma
 *   GET /                              -> 200 health
 *
 * Firma de integridad (Wompi): SHA256("<reference><amount-in-cents><currency><integrity_secret>").
 * Solo cubre el aporte de MONTO LIBRE de pago único. La recurrencia (tokenización),
 * el webhook y el portal de socios son fases posteriores (ver docs/ROADMAP.md).
 */

// Ejecuta `wrangler types` para regenerar el tipo Env con bindings. Aquí solo hay
// vars + un secret (sin KV/D1/R2), así que se declaran de forma mínima.
interface Env {
  WOMPI_INTEGRITY_SECRET: string; // secret (wrangler secret put), NUNCA en el repo
  WOMPI_PUBLIC_KEY: string;       // pub_test_… / pub_prod_…
  WOMPI_CURRENCY: string;         // "COP"
  WOMPI_CHECKOUT_BASE: string;    // "https://checkout.wompi.co/p/"
  WOMPI_REDIRECT_URL: string;     // p. ej. "https://.../gracias"
  MIN_AMOUNT_COP: string;
  MAX_AMOUNT_COP: string;
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);

      if (request.method === "GET" && url.pathname === "/") {
        return new Response("club1plus-pay ok", { status: 200 });
      }
      if (request.method !== "GET" || url.pathname !== "/checkout") {
        return json(404, { error: "not_found" });
      }

      const raw = (url.searchParams.get("amount") ?? "").trim();
      const amount = Number.parseInt(raw, 10);
      const min = Number.parseInt(env.MIN_AMOUNT_COP || "5000", 10);
      const max = Number.parseInt(env.MAX_AMOUNT_COP || "50000000", 10);
      if (!Number.isInteger(amount) || String(amount) !== raw || amount < min || amount > max) {
        return json(400, { error: "invalid_amount", min, max });
      }

      const currency = env.WOMPI_CURRENCY || "COP";
      const amountInCents = amount * 100;
      // Referencia única, no adivinable (Web Crypto, no Math.random).
      const reference = `c1p-${crypto.randomUUID()}`;
      const signature = await sha256Hex(
        `${reference}${amountInCents}${currency}${env.WOMPI_INTEGRITY_SECRET}`,
      );

      // Query construida a mano para preservar la clave literal "signature:integrity"
      // (URLSearchParams codificaría los dos puntos y Wompi no la reconocería).
      const params: Array<[string, string]> = [
        ["public-key", env.WOMPI_PUBLIC_KEY],
        ["currency", currency],
        ["amount-in-cents", String(amountInCents)],
        ["reference", reference],
        ["signature:integrity", signature],
        ["redirect-url", env.WOMPI_REDIRECT_URL],
      ];
      const query = params.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&");
      const checkoutUrl = `${env.WOMPI_CHECKOUT_BASE}?${query}`;

      console.log(JSON.stringify({ msg: "checkout", reference, amountInCents, currency }));
      return Response.redirect(checkoutUrl, 302);
    } catch (err) {
      console.log(JSON.stringify({ msg: "error", error: err instanceof Error ? err.message : String(err) }));
      return json(500, { error: "internal_error" });
    }
  },
};
