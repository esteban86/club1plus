# Demo interactiva (datos de prueba)

Toda la plataforma que diseñamos para el relanzamiento está construida y navegable
**en el front, con datos de prueba y sin backend**. Sirve para un gran demo hoy;
cuando lleguen los insumos (dominio, llaves de Wompi, D1, correo) se "cablea" a la
infraestructura real fase por fase (ver `docs/ROADMAP.md`).

## Dónde verlo

| Vista | ES | EN | Qué muestra |
|---|---|---|---|
| Lanzador / login | `/ingresar` | `/en/login` | Enlace mágico **simulado** + selector de 4 socios de ejemplo |
| Portal de socios | `/mi-espacio` | `/en/my-space` | Carné, Tu madre (consentimiento→revelado), Aportes, Referidos (grafo), Ajustes |
| Bienvenida (post-pago) | `/bienvenida` | `/en/welcome` | Regreso simulado tras Wompi + madre asignada |
| Comunidad pública | `/comunidad` | `/en/community` | Contador en vivo + grafo de referidos anonimizado + "Sé embajador" |
| Admin interno | `/admin` | `/en/admin` | Madres, socios, círculos, **matching (bin-packing)**, finanzas 65/35 |
| Contador en vivo | en el home | en el home | Socios / madres con renta / transferido (count-up) |

Entradas: enlace **"Mi espacio"** en el nav; **"Comunidad"** en el footer;
**"Ver la experiencia del socio (demo)"** en `/donar`; CTA del contador → comunidad.

## Recorrido guiado (onboarding)

Botón flotante **"✨ Recorrido guiado"** (abajo a la derecha, en todas las páginas) o
añadiendo **`?tour=1`** a cualquier URL. Es un tour de 11 pasos que **atraviesa todo el
sitio** y navega solo entre páginas: intro → la promesa → el problema → cómo te sumas →
la comunidad → red de referidos → portal de socios (carné → tu madre → referidos) →
matching del admin → donar.

UX: un **panel narrador anclado abajo** (fondo ink + textura "+", kicker + título +
relato, puntos de progreso navegables y botones de marca) que **no tapa el contenido** —
la página se desplaza para dejar el elemento resaltado iluminado por encima del panel, con
el anillo recortado justo arriba de él. Reanuda el paso tras cada navegación (estado en
`localStorage`), funciona en ES y EN y es responsive. Motor: `src/lib/demo/tour.ts` +
`src/styles/tour.css`.

## Qué es real y qué es de prueba

- **Real (público, con consentimiento):** las 4 beneficiarias (Yuri, Sandra, Juliana,
  Deyis) con sus frases y fotos — ya publicadas en `/beneficiarias`.
- **Ficticio (solo demo):** socios, montos, círculos, referidos, transacciones,
  estadísticas públicas y 2 madres de relleno ("(demo)"). Todo va marcado con la
  píldora **DEMO · datos de prueba**.

## Arquitectura del demo (todo front)

- `src/lib/demo/data.ts` — fuente única de datos mock (madres, socios, círculos,
  referidos, transacciones, stats). Dinero en pesos COP.
- `src/lib/demo/session.ts` — "sesión" en `localStorage` (socio activo, prefs, consentimiento).
- `src/lib/demo/portal-ui.ts` — login + dashboard (compartido ES/EN) + grafo SVG.
- `src/lib/demo/countup.ts` — animación de contadores.
- Páginas/secciones: `Welcome.astro`, `Community.astro`, `Admin.astro`, `LiveCounter.astro`.

## Para volverlo real (resumen; detalle en ROADMAP)

1. **Dominio + Cloudflare** → quita `base:/club1plus`, habilita `app.<dominio>`.
2. **Wompi** (Worker `/checkout` + webhook) → reemplaza el login simulado y la
   bienvenida; `redirect-url` de Wompi → `/bienvenida` real que crea al socio.
3. **D1 + auth (magic-link real)** → la "sesión" deja de ser localStorage.
4. **Motor de matching** → reemplaza los círculos fijos de `data.ts`.
5. **Resend** → correos (bienvenida, madre asignada).
6. **Cloudflare Access + audit log** → protege `/admin` y los datos personales.
7. **KV público** → alimenta el contador y el grafo anonimizado de `/comunidad`.

> El front ya está modelado para que cada pieza se cambie por su equivalente real
> sin rehacer la UI: las vistas leen de `data.ts`/`session.ts`, que son los únicos
> puntos a sustituir por llamadas a la API.
