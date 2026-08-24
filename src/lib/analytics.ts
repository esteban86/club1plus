// GA4, cargado solo con consentimiento explícito del visitante (Ley 1581 / Habeas Data).
// Vacío = analítica desactivada por completo, ni siquiera se muestra el banner.
export const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? "";
