# club1plus-pay — Worker de pago Wompi

Firma un **Web Checkout de Wompi** para el aporte de **monto libre de pago único**, de modo
que se cobre el valor exacto que el usuario escribió en el sitio. El secreto de integridad
vive solo aquí (nunca en el repo ni en el navegador).

> Alcance actual: solo el monto libre de pago único. La recurrencia (tokenización),
> el webhook y el portal de socios son fases posteriores — ver `../docs/ROADMAP.md`.

## Endpoints
- `GET /checkout?amount=<COP entero>` → 302 a `checkout.wompi.co/p/` con la firma.
- `GET /` → health check.

## Desplegar (Cloudflare)
```bash
cd worker
npm install

# 1) Pega tu llave pública (sandbox o prod) en wrangler.jsonc → vars.WOMPI_PUBLIC_KEY
#    y ajusta WOMPI_REDIRECT_URL al /gracias real (o el dominio propio cuando exista).

# 2) Carga el secreto de integridad (NO va en el repo):
npx wrangler secret put WOMPI_INTEGRITY_SECRET

# 3) Despliega:
npx wrangler deploy
```

Tras desplegar, copia la URL del Worker (p. ej. `https://club1plus-pay.<cuenta>.workers.dev`
o un dominio propio como `https://pay.clubdel1.org`) y ponla en
`src/lib/donate.ts` → `export const WORKER_BASE = "..."`. Eso activa el monto exacto en el
botón de aporte libre (pago único).

## Notas
- `amount-in-cents` = pesos × 100. Validación: entero entre `MIN_AMOUNT_COP` y `MAX_AMOUNT_COP`.
- Firma: `SHA256("<reference><amount-in-cents><currency><integrity_secret>")` (orden exacto de Wompi).
- Usa primero las llaves de **sandbox** de Wompi para probar el flujo punta a punta.
- `npm run dev` corre el Worker localmente; `npm run types` regenera tipos de Cloudflare.
