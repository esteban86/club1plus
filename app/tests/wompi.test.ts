import { describe, it, expect } from "vitest";
import { verifyWompiWebhookSignature } from "../src/lib/wompi";
import type { WompiWebhookPayload } from "../src/lib/wompi";

// Checksum calculado de forma independiente (node:crypto, fuera de la implementación)
// para: concat("txn_abc123", "APPROVED", "1500000") + timestamp + secret.
const VALID_CHECKSUM = "087b0b8e7f40ba2b98108b2a6141760e2cf2fd94faaf88832d84bf7b7be1ea41";
const EVENTS_SECRET = "test_events_secret_xyz";
const TIMESTAMP = 1735689600;

function basePayload(overrides: Partial<WompiWebhookPayload> = {}): WompiWebhookPayload {
  return {
    event: "transaction.updated",
    data: {
      transaction: {
        id: "txn_abc123",
        status: "APPROVED",
        amount_in_cents: 1500000,
      },
    },
    sent_at: "2026-01-01T00:00:00.000Z",
    timestamp: TIMESTAMP,
    signature: {
      properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
      checksum: VALID_CHECKSUM,
    },
    ...overrides,
  };
}

describe("verifyWompiWebhookSignature", () => {
  it("acepta un checksum válido calculado de forma independiente", async () => {
    const ok = await verifyWompiWebhookSignature(basePayload(), EVENTS_SECRET);
    expect(ok).toBe(true);
  });

  it("acepta el checksum en mayúsculas (case-insensitive)", async () => {
    const payload = basePayload({
      signature: {
        properties: ["transaction.id", "transaction.status", "transaction.amount_in_cents"],
        checksum: VALID_CHECKSUM.toUpperCase(),
      },
    });
    const ok = await verifyWompiWebhookSignature(payload, EVENTS_SECRET);
    expect(ok).toBe(true);
  });

  it("rechaza si el secreto de eventos no coincide", async () => {
    const ok = await verifyWompiWebhookSignature(basePayload(), "secreto_equivocado");
    expect(ok).toBe(false);
  });

  it("rechaza si cualquier valor referenciado en properties cambió (payload alterado)", async () => {
    const payload = basePayload({
      data: { transaction: { id: "txn_abc123", status: "DECLINED", amount_in_cents: 1500000 } },
    });
    const ok = await verifyWompiWebhookSignature(payload, EVENTS_SECRET);
    expect(ok).toBe(false);
  });

  it("rechaza si falta el secreto de eventos", async () => {
    const ok = await verifyWompiWebhookSignature(basePayload(), "");
    expect(ok).toBe(false);
  });

  it("rechaza si signature.properties está vacío", async () => {
    const payload = basePayload({ signature: { properties: [], checksum: VALID_CHECKSUM } });
    const ok = await verifyWompiWebhookSignature(payload, EVENTS_SECRET);
    expect(ok).toBe(false);
  });

  it("usa solo los campos listados en properties, no todo el payload", async () => {
    // Cambiar un campo NO listado en properties no debe invalidar la firma.
    const payload = basePayload({
      data: {
        transaction: { id: "txn_abc123", status: "APPROVED", amount_in_cents: 1500000 },
        extra_unlisted_field: "esto no debería importar",
      },
    });
    const ok = await verifyWompiWebhookSignature(payload, EVENTS_SECRET);
    expect(ok).toBe(true);
  });
});
