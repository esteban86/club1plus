# Backlog — El Club del 1+

Pendientes acordados para retomar más adelante.

---

## 1. Pasarela Wompi — monto libre con valor exacto (Cloudflare Worker) ⏸️

**Objetivo:** que el monto que el usuario escribe en el sitio sea el que se cobra
(no que lo reescriba en Wompi). Decidido: **opción B** (mini-función serverless).

**Por qué un Worker:** Wompi solo recibe el monto por la URL en su *Web Checkout*,
y va firmado con una *firma de integridad* (SHA-256 con el **secreto**). Esa firma
no se puede generar en el navegador sin exponer el secreto → se genera en un
Cloudflare Worker. El usuario tiene cuenta de Cloudflare.

### Spec de Wompi Web Checkout (ya verificada — no re-investigar)
- **Base URL:** `https://checkout.wompi.co/p/`
- **Params requeridos:** `public-key`, `currency` (`COP`), `amount-in-cents`,
  `reference` (única), `signature:integrity`.
- **Opcionales:** `redirect-url`, `expiration-time` (ISO8601 UTC+0000),
  `customer-data:email|full-name|phone-number|...`, `tax-in-cents:vat`, etc.
- **Firma de integridad (SHA-256, orden EXACTO):**
  - Sin expiración: `SHA256("<reference><amount-in-cents><currency><integrity_secret>")`
  - Con expiración: `SHA256("<reference><amount-in-cents><currency><expiration-time><integrity_secret>")`
- **amount-in-cents** = pesos × 100 (ej.: $95.000 → `9500000`).
- **Web Checkout es de PAGO ÚNICO** (no crea suscripciones).

### Qué construir
- **Worker** (`worker/` con `wrangler.jsonc` + `src/index.ts`):
  - `GET /checkout?amount=<COP>` → valida (entero, min), `amountInCents = amount*100`,
    `reference` única con `crypto.randomUUID()` (NO `Math.random()`),
    firma con Web Crypto (`crypto.subtle.digest('SHA-256', ...)`), arma la URL y **302** a Wompi.
  - `compatibility_date` = hoy, `observability` on, logging estructurado, try/catch explícito.
  - Secretos vía `wrangler secret put` — nunca en el repo.
- **Frontend:** `src/lib/donate.ts` → constante `WORKER_BASE`; el CTA de monto libre
  (one-time) apunta a `${WORKER_BASE}/checkout?amount=<valor>`.
- **Página de gracias:** `/gracias` (ES) + `/en/thanks` como `redirect-url`
  (Wompi añade `?id=<tx>&env=...`). Opcional: verificar estado con la API pública de Wompi.

### Qué necesito del usuario
- **Llave pública** Wompi (`pub_…`) y **secreto de integridad** (panel → Desarrolladores → Secretos).
- Desplegar el Worker en su Cloudflare (`wrangler deploy`) y pasarme la **URL del Worker**
  para fijar `WORKER_BASE`.

### Decisión pendiente
- **Recurrencia del monto libre:** Web Checkout = único. Recurrente con monto libre
  necesitaría un backend de suscripción completo (tokenización + almacenamiento + cobros
  programados). Definir: ¿monto libre solo único, o también recurrente?

---

## 2. Links de pago Wompi por tier (pegar cuando existan) ⏸️
El comercio crea en el panel de Wompi:
- Por tier (Amigo/Aliado/Mecenas/Madrina-Padrino): link **recurrente/suscripción** → `urlMonthly`,
  y link **único** → `urlOneTime` (si se ofrece pago único).
- **Monto abierto** recurrente y único (para el fallback del aporte libre).

Hoy todos en placeholder `https://wompi.co/`. Campos en `src/content/tiers/*.md`.
Decisión: ¿se ofrece **pago único** o todo es **recurrente**?

---

## 3. Contenido real pendiente ⏸️
- **Fotos + frases de beneficiarias** (sección "Protagonistas" / Stories) — reemplazar
  los avatares de letra. El usuario las descarga de su IG/originales y las pasa.
- **Prueba social** (junto al ask). Candidatos del deck del Club: **+300 donantes**,
  **53 mujeres** apoyadas, meta 2026: **50 mujeres**. ⚠️ Confirmar vigencia antes de publicar
  (son cifras del Club del 1% original; el 1+ pudo reiniciar conteos).

---

## 4. Política de difusión / influencers — alianzas y embajadores ⏸️
Pagar influencers **no es antiético per se** (es un costo de captación legítimo si rinde),
pero para una marca construida sobre la **confianza/transparencia** tiene que pasar filtros.

**Filtros no-negociables si se paga difusión:**
- **Divulgación obligatoria** (`#publicidad` / "en alianza con"). En Colombia lo **exige la SIC**;
  promoción pagada sin declarar sería hipócrita frente a la sección de transparencia 35/65.
- **Eficiencia medible** (donantes captados por peso; si no rinde, se corta).
- **Honestidad del mensaje** (pagar la difusión, no el elogio falso ni resultados exagerados).
- **Proporción** (costo razonable dentro del 35%, sin comerse el fondo de las mujeres).
- **Congruencia del vocero** con los valores de la causa.

**Camino preferido (más fuerte y más barato, más coherente con la marca):**
1. **Embajadores que se vuelven socios** y lo cuentan de verdad (cero pago, máxima credibilidad).
2. **Reach donado / pro-bono** (su difusión es su aporte; se les reconoce como "Embajador/Aliado").
3. **Pagar producción, no el endorsement** (cubrir el costo de buen contenido, mensaje genuino).
4. Si se paga, **como alianza declarada y medida**, nunca como endorsement disfrazado.

**Posible entregable:** mini-política de alianzas/embajadores (criterios + reglas de divulgación)
y/o una sección **"Sé embajador"** en la web para canalizar la difusión auténtica.

---

_Última actualización del backlog: jun 2026._
