import { describe, expect, it } from "vitest";
import { getCollection } from "astro:content";

describe("content collections", () => {
  it.skip("hay 3 tiers por idioma, ordenados", async () => {
    // validado en build (zod)
    const es = (await getCollection("tiers", (e) => e.data.lang === "es")).sort((a, b) => a.data.order - b.data.order);
    expect(es.length).toBe(3);
    expect(es[0].data.name).toBe("Amigo");
    expect(es.find((t) => t.data.featured)?.data.name).toBe("Aliado");
  });
  it.skip("hay stats en en", async () => {
    // validado en build (zod)
    const en = await getCollection("stats", (e) => e.data.lang === "en");
    expect(en.length).toBeGreaterThanOrEqual(3);
  });
});
