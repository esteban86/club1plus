import { describe, expect, it } from "vitest";
import { treliLink, TIER_FALLBACK } from "../src/lib/donate";

describe("treliLink", () => {
  const tier = { slug: "aliado", urlMonthly: "https://treli.co/x/mensual", urlOneTime: "https://treli.co/x/unico" };
  it("elige la URL mensual", () => {
    expect(treliLink(tier, "monthly")).toBe("https://treli.co/x/mensual");
  });
  it("elige la URL de pago único", () => {
    expect(treliLink(tier, "one-time")).toBe("https://treli.co/x/unico");
  });
  it("hace fallback si falta la URL de la frecuencia", () => {
    expect(treliLink({ slug: "a", urlMonthly: "", urlOneTime: "" }, "monthly")).toBe(TIER_FALLBACK);
  });
});
