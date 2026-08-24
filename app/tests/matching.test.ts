import { describe, it, expect } from "vitest";
import { pickCircleForSubscription, splitAllocation, DEFAULT_TARGET_GROSS_CENTS } from "../src/lib/matching";
import type { CircleRow } from "../src/lib/matching";

function circle(overrides: Partial<CircleRow> = {}): CircleRow {
  return {
    id: "c1",
    beneficiary_id: null,
    target_gross_cents: DEFAULT_TARGET_GROSS_CENTS,
    current_gross_cents: 0,
    status: "forming",
    ...overrides,
  };
}

describe("pickCircleForSubscription", () => {
  it("crea círculo propio para una Madrina (monto completo)", () => {
    const result = pickCircleForSubscription(DEFAULT_TARGET_GROSS_CENTS, []);
    expect(result.isNewCircle).toBe(true);
    expect(result.circleId).toBeNull();
  });

  it("crea un círculo nuevo si no hay ninguno en formación", () => {
    const result = pickCircleForSubscription(2_000_000, []);
    expect(result.isNewCircle).toBe(true);
  });

  it("entra al círculo al que menos le falta (mejor ajuste)", () => {
    const circles = [
      circle({ id: "casi-lleno", current_gross_cents: 55_000_000 }), // faltan 5M
      circle({ id: "recien-empezando", current_gross_cents: 6_000_000 }), // faltan 54M
    ];
    const result = pickCircleForSubscription(2_000_000, circles);
    expect(result.circleId).toBe("casi-lleno");
    expect(result.isNewCircle).toBe(false);
    expect(result.remainingAfter).toBe(3_000_000);
  });

  it("no mete un monto que haría pasarse del target", () => {
    const circles = [circle({ id: "casi-lleno", current_gross_cents: 59_000_000 })]; // faltan 1M
    const result = pickCircleForSubscription(2_000_000, circles); // Aliado, 6M — no cabe
    expect(result.isNewCircle).toBe(true);
  });

  it("ignora círculos que no están en formación", () => {
    const circles = [circle({ id: "full", status: "full", current_gross_cents: 60_000_000 })];
    const result = pickCircleForSubscription(2_000_000, circles);
    expect(result.isNewCircle).toBe(true);
  });
});

describe("splitAllocation", () => {
  it("reparte 65/35 sobre un monto exacto", () => {
    const { beneficiaryNetCents, operationsCents } = splitAllocation(60_000_000, 6500);
    expect(beneficiaryNetCents).toBe(39_000_000);
    expect(operationsCents).toBe(21_000_000);
    expect(beneficiaryNetCents + operationsCents).toBe(60_000_000);
  });

  it("nunca pierde centavos por redondeo — la suma siempre da el total", () => {
    const { beneficiaryNetCents, operationsCents } = splitAllocation(20_000, 6500);
    expect(beneficiaryNetCents + operationsCents).toBe(20_000);
  });
});
