export type Frequency = "monthly" | "one-time";

export interface TierLinks {
  slug: string;
  urlMonthly: string;
  urlOneTime: string;
}

// Placeholder hasta tener las URLs reales de Treli.
export const TIER_FALLBACK = "https://treli.co/"; // TODO: URL Treli real (catálogo del Club)

export function treliLink(tier: TierLinks, freq: Frequency): string {
  const url = freq === "monthly" ? tier.urlMonthly : tier.urlOneTime;
  return url && url.length > 0 ? url : TIER_FALLBACK;
}

// Checkout de aporte de monto libre. Placeholder hasta tener la URL real de Treli.
export const CUSTOM_TRELI = "https://treli.co/"; // TODO: URL Treli de monto libre

// Construye el enlace para un aporte personalizado. El monto y la frecuencia van como
// query params; ajusta los nombres ("amount"/"freq") al esquema real de Treli al integrar.
export function customTreliLink(amount: number, freq: Frequency, base: string = CUSTOM_TRELI): string {
  const url = new URL(base);
  if (Number.isFinite(amount) && amount > 0) url.searchParams.set("amount", String(Math.round(amount)));
  url.searchParams.set("freq", freq === "monthly" ? "mensual" : "unico");
  return url.toString();
}
