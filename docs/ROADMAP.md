# Relanzamiento El Club del 1+ — Roadmap del programa

> Roadmap maestro aprobado (jun 2026). Tácticas de pagos/contenido en [BACKLOG.md](./BACKLOG.md).
> Cada fase técnica (Track B) se especifica en su propio plan detallado (con TDD) antes de construir.

## Contexto
Relanzamiento (refundación del "Club del 1%" → "1+"): no solo web, sino programa integral —
constituir la fundación, modelo financiero y operativo, campaña de expectativa, cerrar vacíos
de la web, y el salto de sitio estático a **plataforma** (portal de socios + motor real
socio↔madre + correos + grafo de referidos con contador público).

Hoy: Astro 5 estático en GitHub Pages (bilingüe, base `/club1plus`), sin backend/DB/auth/correo.
El design system ya trae **carné de socio** (`.ds-source/guidelines/app-carnet.card.html`) y
**warm poster** de beneficiaria (`app-warm-poster.card.html`) — se reutilizan.

### Decisiones tomadas
- **Vínculo socio↔madre = real.** Padrino/Madrina ($600k) financia 1 madre completa (1:1);
  aportes menores co-financian una madre entre varios ("círculo"). Cada socio ve *su* madre.
- **Stack:** Cloudflare (Workers + D1 + KV + email + R2).
- **Lanzamiento:** único y completo (web + portal + motor + referidos).
- **Privacidad:** datos reales a socios con consentimiento firmado (Ley 1581); público anonimizado.

## Arquitectura general
- Sitio público marketing → sigue estático en Astro/GitHub Pages.
- App de socios → Astro SSR como Cloudflare Worker en `app.<dominio>`; comparte tokens y
  componentes de marca; i18n replicado/extendido.
- Workers backend: Wompi (`/checkout`, `/wompi/webhook`), API del portal, cron mensual, `/admin/*`.
- **Prerrequisito:** dominio propio (`www`→Pages, `app`→Worker, `mail.`→correo) y soltar `/club1plus`.

## Workstreams
1. **Legal (ESAL):** estatutos + acta → Cámara de Comercio Medellín + RUT/NIT → **RTE** (DIAN, habilita recibos deducibles, Art. 125 ET) → cuenta bancaria + política de datos (Ley 1581). Con abogado/contador.
2. **Modelo financiero:** ingresos (membresías recurrentes + únicos + alianzas); reparto **65% programa / 35% gestión** (baja al escalar). **Costo BRUTO por madre = $600.000/mes** (lo que suma un círculo: 10 aliados o 1 padrino) → de ahí **~$400.000 (65%) son para ella** (renta + acompañamiento) y **~$200.000 (35%) operación**. El "$600k" NO es lo que recibe la madre; es el costo total de tenerla en el programa. Modelo con escenarios + punto de equilibrio + comisión Wompi.
3. **Operación:** selección de beneficiarias (Moravia, estratos 1–2, consentimiento) · desembolso (Nequi/Bancolombia) · acompañamiento + M&E (piloto Grupo A vs control, 12 meses) · equipo (Director, Mercadeo, Gestor social + legal/contable + tech) · gobernanza + reporte trimestral.
4. **Campaña de expectativa:** narrativa 1%→1+, fundadores/refundadores, Moravia; waitlist + cuenta regresiva; IG + embajadores (política del backlog, divulgación SIC); "Sé embajador" en la web.
5. **Web pública — vacíos:** fotos/frases reales de beneficiarias · Wompi en vivo + `/gracias` + `/en/thanks` · `/privacidad` · "Sé embajador" · "Mi espacio" (login) en nav · contador de socios en vivo (KV) · pulir Nosotros/Impacto/Evidencia + OG por página.
6. **Plataforma técnica (Cloudflare):**
   - **D1 (centavos COP):** members, beneficiaries (**funding_target_cents = $600k bruto** [para el matching] + **transfer_cents ≈ $400k neto = 65%, lo que recibe**, status, consentimiento+R2), subscriptions (token Wompi, next_charge_at), transactions (idempotente por wompi_transaction_id), circles (sole|shared), allocations (ledger inmutable), referral_codes/edges, audit_log, admin_users.
   - **Matching:** bin-packing greedy (FFD) + estabilidad. Padrino → círculo sole 1:1; menores → círculos compartidos ≥ **costo bruto ($600k)**. El círculo se llena por el **BRUTO**; a la madre llega el **65% (~$400k)** — el motor **nunca asume 100% a la madre**. Corre en webhook (incremental) + cron mensual (rebalance) + admin. Subfinanciada = "en formación (X%)".
   - **Wompi:** `/checkout` (Web Checkout firmado, único) + `/wompi/webhook` (idempotente) + recurrencia por tokenización + cron de cobro. APPROVED → find_or_create_member(email) → upsert subscription → allocation → correo bienvenida → conversión referido.
   - **Auth:** magic-link passwordless (Web Crypto + sesiones D1, cookies `__Host-`, Turnstile). Donar = registrarse (redirect a `/bienvenida`). Cloudflare Access solo para `/admin`.
   - **Portal socios (SSR, noindex, gated):** dashboard (carné), "tu madre / tu círculo" (warm-poster, gate de consentimiento; padrino 1:1 vs círculo anonimizado), aportes/recibos, referidos (link + grafo), ajustes (cancelar/consentimiento).
   - **Referidos + grafo:** códigos base32, `/r/<code>` → funnel con `?ref`, `members.referred_by`, CTE recursivo, SVG inline propio (sin d3). Público anonimizado (k-anonimato) + contador en KV (cron) embebido en el sitio.
   - **Correos:** Resend vía Worker detrás de `lib/email.ts`; plantillas bilingües (magic-link, bienvenida, madre asignada, impacto mensual, recibo, cancelación); SPF/DKIM/DMARC en `mail.`.
   - **Admin:** `/admin/*` (Cloudflare Access): CRUD madres, consentimiento (gate), curaduría de círculos, finanzas; audit_log de PII.
   - **Privacidad:** PII solo en D1, SSR a socio financiador tras consentimiento; fotos en R2 privado con URLs firmadas; público anonimizado; `/privacidad`.
   - Diseños técnicos detallados: `~/.claude/plans/cheerful-noodling-falcon*.md`.
7. **Wompi en vivo:** links recurrentes/únicos por tier + monto-abierto en el panel; llave pública + secreto de integridad como secrets del Worker.

## Orden de construcción (hacia lanzamiento único)
- **Track A — Fundación (paralelo):** ESAL → RTE → banco · modelo financiero · operación + consentimiento de madres (Moravia) · reclutar piloto.
- **Track B — Plataforma:** (1) dominio + Cloudflare → (2) Worker Wompi `/checkout` + `/gracias`/`/en/thanks` → (3) D1 + webhook + tokenización + cron → (4) auth magic-link + registro-desde-donación → (5) portal socios → (6) motor matching + cron → (7) referidos + grafo + contador → (8) correos → (9) admin + carga de madres.
- **Track C — Contenido/Campaña:** fotos/frases · `/privacidad` · "Sé embajador" · activos + waitlist → campaña → **lanzamiento único**.

## Decisiones pendientes
1. Nombre del **dominio propio**. 2. ¿Único + recurrente o solo recurrente? (custom recurrente exige tokenización). 3. Política de subfinanciación (madre "en formación" espera vs fondo completa). 4. Rieles de desembolso (Nequi/Bancolombia). 5. Fecha **RTE** (gatea recibo deducible). 6. Recompensa de referidos (recomendado: ninguna monetaria).

## Riesgo clave
El lanzamiento único retrasa ingresos/validación hasta tenerlo todo. Alternativa menor-riesgo
(si se reconsidera): lanzar ya web pública + Wompi en vivo, y portal+motor+referidos como fast-follow.

## Verificación
Por fase: `astro check`, `vitest`, `wrangler dev` + D1 local, sandbox Wompi. E2E: donación →
webhook idempotente → socio → magic-link → portal muestra madre asignada (1:1 y círculo) →
referido `/r/<code>` → grafo/contador se actualizan → correos entregados. Tests del matching
(estabilidad, churn, padrino 1:1, excedente). Privacidad: PII no aparece sin login+consentimiento.

_Última actualización: jun 2026._
