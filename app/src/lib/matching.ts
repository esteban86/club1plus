// Motor de matching: bin-packing greedy de socios a círculos.
// Regla dura: nunca reasignar algorítmicamente a un socio ya vinculado a un
// círculo/madre — solo llena círculos nuevos o huecos que aún no tienen dueño.

export interface CircleRow {
  id: string;
  beneficiary_id: string | null;
  target_gross_cents: number;
  current_gross_cents: number;
  status: "forming" | "full" | "active" | "closed";
}

export interface MatchResult {
  circleId: string;
  isNewCircle: boolean;
}

const DEFAULT_TARGET_GROSS_CENTS = 60_000_000; // $600.000 COP

/**
 * Decide a qué círculo entra una nueva suscripción de `amountGrossCents`.
 * - Madrina (monto == target completo): siempre crea su propio círculo 1:1.
 * - Cualquier otro tier: entra al círculo "forming" al que menos le falta
 *   completar sin pasarse del target (mejor ajuste, no solo el primero que
 *   quepa) — así se minimiza el número de círculos parcialmente llenos.
 * - Si ningún círculo en formación tiene espacio suficiente, se crea uno.
 */
export function pickCircleForSubscription(
  amountGrossCents: number,
  formingCircles: CircleRow[],
): { circleId: string | null; isNewCircle: boolean; remainingAfter: number } {
  if (amountGrossCents >= DEFAULT_TARGET_GROSS_CENTS) {
    return { circleId: null, isNewCircle: true, remainingAfter: 0 };
  }

  let best: CircleRow | null = null;
  let bestRemaining = Infinity;

  for (const circle of formingCircles) {
    if (circle.status !== "forming") continue;
    const remaining = circle.target_gross_cents - circle.current_gross_cents;
    if (remaining < amountGrossCents) continue; // no cabe sin pasarse
    if (remaining < bestRemaining) {
      best = circle;
      bestRemaining = remaining;
    }
  }

  if (!best) {
    return { circleId: null, isNewCircle: true, remainingAfter: DEFAULT_TARGET_GROSS_CENTS - amountGrossCents };
  }
  return { circleId: best.id, isNewCircle: false, remainingAfter: bestRemaining - amountGrossCents };
}

export function splitAllocation(grossAmountCents: number, splitBeneficiaryBps: number) {
  const beneficiaryNetCents = Math.round((grossAmountCents * splitBeneficiaryBps) / 10_000);
  return {
    beneficiaryNetCents,
    operationsCents: grossAmountCents - beneficiaryNetCents,
  };
}

export { DEFAULT_TARGET_GROSS_CENTS };
