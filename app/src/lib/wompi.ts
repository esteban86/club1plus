// Verificación del checksum de eventos (webhook) de Wompi.
// El Event Secret es DISTINTO del secreto de integridad del Web Checkout —
// se obtiene aparte en el panel de Wompi.
//
// Checksum = SHA-256( concat(valores de signature.properties, en orden)
//                      + timestamp
//                      + event_secret )
// Los campos a concatenar los define el propio payload (signature.properties),
// no una lista fija — así lo documenta Wompi.

import { sha256Hex, timingSafeEqual } from "./crypto";

export interface WompiWebhookPayload {
  event: string;
  data: Record<string, unknown>;
  sent_at: string;
  timestamp: number;
  signature: {
    properties: string[];
    checksum: string;
  };
}

function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc !== null && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export async function verifyWompiWebhookSignature(
  payload: WompiWebhookPayload,
  eventsSecret: string,
): Promise<boolean> {
  const { properties, checksum } = payload.signature ?? {};
  if (!properties?.length || !checksum || !eventsSecret) return false;

  const concatenatedValues = properties
    .map((path) => String(resolvePath(payload.data, path) ?? ""))
    .join("");
  const toHash = `${concatenatedValues}${payload.timestamp}${eventsSecret}`;
  const computed = await sha256Hex(toHash);
  return timingSafeEqual(computed, checksum.toLowerCase());
}
