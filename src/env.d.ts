/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Measurement ID de GA4 (ej. "G-XXXXXXXXXX"). Vacío = analítica desactivada. */
  readonly PUBLIC_GA_MEASUREMENT_ID?: string;
  /** Llave pública de Wompi (pub_test_… / pub_prod_…) — segura de exponer client-side. */
  readonly PUBLIC_WOMPI_PUBLIC_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
