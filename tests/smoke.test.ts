import { expect, test } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";

test("AstroContainer renderiza HTML", async () => {
  const container = await AstroContainer.create();
  expect(container).toBeDefined();
});
