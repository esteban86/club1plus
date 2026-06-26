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
