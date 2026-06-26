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
