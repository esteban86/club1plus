import { describe, expect, it } from "vitest";
import { treliLink, customTreliLink, TIER_FALLBACK } from "../src/lib/donate";

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

describe("customTreliLink", () => {
  it("incluye el monto y marca frecuencia mensual", () => {
    const u = customTreliLink(50000, "monthly");
    expect(u).toContain("amount=50000");
    expect(u).toContain("freq=mensual");
  });
  it("marca pago único y omite montos inválidos", () => {
    const u = customTreliLink(0, "one-time");
    expect(u).toContain("freq=unico");
    expect(u).not.toContain("amount=");
  });
  it("redondea el monto", () => {
    expect(customTreliLink(49999.7, "monthly")).toContain("amount=50000");
  });
});
