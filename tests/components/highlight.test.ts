import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Highlight from "../../src/components/brand/Highlight.astro";

test("Highlight aplica la variante green y muestra el texto", async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Highlight, { props: { variant: "green" }, slots: { default: "riqueza." } });
  expect(html).toContain("riqueza.");
  expect(html).toContain("hl--green");
});
