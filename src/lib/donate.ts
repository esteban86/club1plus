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
