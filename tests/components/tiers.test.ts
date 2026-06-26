import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Tiers from "../../src/components/sections/Tiers.astro";

test.skip("Tiers renderiza niveles, enlaces y toggle de frecuencia", async () => {
  // getCollection no disponible en el container de Vitest; validado en build + donate.test.ts
  const c = await AstroContainer.create();
  const html = await c.renderToString(Tiers, { request: new Request("https://x.io/club1plus/donar") });
  expect(html).toContain("data-freq-toggle");
  expect(html).toContain("data-tier");
});
