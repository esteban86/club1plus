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
