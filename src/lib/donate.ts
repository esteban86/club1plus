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

// Aporte de monto libre: links de "monto abierto" de Wompi (el donante elige el valor
// en la página de Wompi). Wompi no recibe el monto por query —la firma de integridad lo
// impide—, así que el campo del sitio es una sugerencia/ancla y el valor se confirma en Wompi.
export const CUSTOM_WOMPI_MONTHLY = "https://wompi.co/"; // TODO: link Wompi monto abierto recurrente
export const CUSTOM_WOMPI_ONCE = "https://wompi.co/";    // TODO: link Wompi monto abierto único

export function customWompiLink(freq: Frequency): string {
  return freq === "monthly" ? CUSTOM_WOMPI_MONTHLY : CUSTOM_WOMPI_ONCE;
}
