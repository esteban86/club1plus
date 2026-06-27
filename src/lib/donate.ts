export type Frequency = "monthly" | "one-time";

export interface TierLinks {
  slug: string;
  urlMonthly: string;
  urlOneTime: string;
}

// Enlaces de pago Wompi. Placeholder hasta tener los reales del panel del Club.
// El comercio crea en Wompi un link de pago por tier — recurrente/suscripción para
// "monthly" y pago único para "one-time" — y los pega en cada .md (urlMonthly / urlOneTime).
export const TIER_FALLBACK = "https://wompi.co/"; // TODO: link Wompi por defecto

export function wompiLink(tier: TierLinks, freq: Frequency): string {
  const url = freq === "monthly" ? tier.urlMonthly : tier.urlOneTime;
  return url && url.length > 0 ? url : TIER_FALLBACK;
}

// Worker de pago (Cloudflare) que firma un Web Checkout de Wompi con el monto EXACTO
// que el usuario escribió (pago único). El secreto de integridad vive solo en el Worker.
// Vacío = aún no desplegado → se usa el link de "monto abierto" como fallback.
export const WORKER_BASE: string = ""; // TODO: URL del Worker, p. ej. "https://pay.clubdel1.org"

// Aporte de monto libre RECURRENTE: links de "monto abierto" de Wompi (el donante elige
// el valor en la página de Wompi; Wompi no recibe el monto por query por la firma).
export const CUSTOM_WOMPI_MONTHLY = "https://wompi.co/"; // TODO: link Wompi monto abierto recurrente
export const CUSTOM_WOMPI_ONCE = "https://wompi.co/";    // TODO: link Wompi monto abierto único (fallback)

// Enlace del aporte de monto libre.
// - one-time + Worker configurado + monto válido → Worker firma el monto exacto.
// - en otro caso → link de "monto abierto" de Wompi (el valor se confirma en Wompi).
export function customWompiLink(freq: Frequency, amount?: number): string {
  if (
    freq === "one-time" &&
    WORKER_BASE &&
    typeof amount === "number" &&
    Number.isFinite(amount) &&
    amount > 0
  ) {
    return `${WORKER_BASE.replace(/\/$/, "")}/checkout?amount=${Math.round(amount)}`;
  }
  return freq === "monthly" ? CUSTOM_WOMPI_MONTHLY : CUSTOM_WOMPI_ONCE;
}
