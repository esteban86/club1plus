import { describe, expect, it } from "vitest";
import { wompiLink, customWompiLink, TIER_FALLBACK, CUSTOM_WOMPI_MONTHLY, CUSTOM_WOMPI_ONCE } from "../src/lib/donate";

describe("wompiLink", () => {
  const tier = { slug: "aliado", urlMonthly: "https://wompi.co/x/mensual", urlOneTime: "https://wompi.co/x/unico" };
  it("elige la URL mensual", () => {
    expect(wompiLink(tier, "monthly")).toBe("https://wompi.co/x/mensual");
  });
  it("elige la URL de pago único", () => {
    expect(wompiLink(tier, "one-time")).toBe("https://wompi.co/x/unico");
  });
  it("hace fallback si falta la URL de la frecuencia", () => {
    expect(wompiLink({ slug: "a", urlMonthly: "", urlOneTime: "" }, "monthly")).toBe(TIER_FALLBACK);
  });
});

describe("customWompiLink", () => {
  it("usa el link de monto abierto recurrente para mensual", () => {
    expect(customWompiLink("monthly", 50000)).toBe(CUSTOM_WOMPI_MONTHLY);
  });
  it("usa el link de monto abierto único cuando el Worker no está configurado", () => {
    // WORKER_BASE = "" por defecto → fallback al link de monto abierto único.
    expect(customWompiLink("one-time", 50000)).toBe(CUSTOM_WOMPI_ONCE);
  });
  it("ignora montos inválidos", () => {
    expect(customWompiLink("one-time", 0)).toBe(CUSTOM_WOMPI_ONCE);
    expect(customWompiLink("one-time")).toBe(CUSTOM_WOMPI_ONCE);
  });
});
