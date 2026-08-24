/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Measurement ID de GA4 (ej. "G-XXXXXXXXXX"). Vacío = analítica desactivada. */
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
