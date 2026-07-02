# Plan de comunicación de clase mundial — El Club del 1+

> Objetivo: convertir la objeción cultural colombiana **"regalar plata que se va a malgastar"** en la
> convicción **"cofinancio, entre amigos, la salida que unas emprendedoras ya están construyendo — y
> está probado que funciona."** Basado en storytelling + los 7 principios de Cialdini + economía del
> comportamiento del dar. Todo aterrizado en la copy real del sitio (jun 2026).

---

## 0. El reto, en una frase
La renta básica se percibe como **caridad que crea dependencia**. Nuestra comunicación debe reencuadrarla
como **inversión con retorno social, entre iguales, con evidencia y rendición de cuentas**. No cambiamos
el mecanismo (efectivo incondicional, que es lo que la evidencia respalda): cambiamos el **marco, el orden
y las pruebas** con que lo contamos.

---

## 1. Diagnóstico — qué ya tienen y dónde se rompe la persuasión

### Fortalezas (no tocar, amplificar)
- **El Explainer de `/modelo`** ([Explainer.astro](../src/components/sections/Explainer.astro)) es un
  scrollytelling excelente que YA desactiva la objeción: *"No es que falte esfuerzo. Falta liquidez"* ·
  el loop interactivo *"añadir renta básica → espiral hacia arriba"* · *"¿Y si simplemente damos efectivo?
  … no se malgasta. Se transforma"* · las 4 evidencias (*Lo invierten · No dejan de trabajar (el mito de
  la pereza no se sostiene) · Los hijos ganan · Dignidad y decisión*) · *"no es un regalo: es el colchón"*.
- **Prueba real** en [Results.astro](../src/components/sections/Results.astro): *"53 mujeres ya recibieron
  $400.000"*, en qué invirtieron (28% alimentación, 18% emprendimiento, 16% ahorro…), y **desempleo
  59,5% → 18,9%**. Es el antídoto directo al "se lo gastan / les da pereza".
- **Reencuadre de riqueza** en [WealthPyramid.astro](../src/components/sections/WealthPyramid.astro):
  *"arriba, $60.000 es casi nada; abajo, sumado entre amigos, cambia una vida"* (anclaje + relatividad).
- **Transparencia 65/35** ([Transparency.astro](../src/components/sections/Transparency.astro)) que
  responde el "overhead myth" ("¿cuánto se queda la fundación?").
- **Lenguaje de Unidad** ya presente: "Club", "amigos", "socios", "súmate", "tu +".
- **Evidencia mundial** (Namibia, Finlandia, Canadá-Dauphin, GiveDirectly, Banerjee/Duflo, Bregman).

### El problema central: secuencia y encuadre, no falta de argumentos
1. **La mejor artillería está enterrada.** El escéptico aterriza en la **home** y en los primeros scrolls
   lee los *gatillos* — *"renta básica"*, *"sin condiciones"*, *"no es cuestión de esfuerzo"* — **antes**
   de recibir el reencuadre y la prueba (que viven en `/modelo` e `/impacto`). Se va antes de convencerse.
2. **Se lidera con la palabra-gatillo.** [Impact.astro](../src/components/sections/Impact.astro) abre con
   *"¿Funciona dar dinero sin condiciones?"* y [Proof.astro](../src/components/sections/Proof.astro) con
   *"Dar dinero, sin condiciones, ya funcionó."* Para el converso es virtud; para el escéptico es la
   bandera roja. La prueba debe **preceder** a la etiqueta, no al revés.
3. **Dos capas de la objeción, y solo una está bien atendida:**
   - **Empírica** ("¿funciona?, ¿no se lo gastan?") → bien cubierta (evidencia + Results).
   - **Moral/identitaria** ("deben ganárselo", "asistencialismo", "dependencia", "yo me esforcé") → se
     aborda de refilón. Hay que **nombrar la objeción para desactivarla** (inoculación), no esquivarla.
4. **Una línea a matizar.** *"Salir de la pobreza no es cuestión de esfuerzo"* (Hero) puede leerse como
   *"el esfuerzo no importa"* → choca con una cultura que valora el esfuerzo **y** con la voz de las
   propias beneficiarias (Deyis: *"cuando llegan las oportunidades, hay que saber aprovecharlas"*). El
   Explainer ya usa la versión correcta: **"No es por *falta* de esfuerzo"**. Unificar hacia esa.
5. **Estadística sin rostro = "psychic numbing".** "53 mujeres" convence a la cabeza; **una historia con
   nombre** convence al corazón (efecto de la víctima identificable, Slovic). Hoy las historias
   ([Stories.astro](../src/components/sections/Stories.astro)) son citas de agradecimiento sin arco
   antes→después.

---

## 2. El reencuadre central (arquitectura de mensaje)

**Idea madre:** *"No es caridad, es cofinanciación. Tú + cientos de amigos = el capital semilla que una
mamá convierte en negocio."*

**Principio:** mantener el **mecanismo** (efectivo incondicional — lo respaldado por la evidencia) pero
mover el **marco** de *"dar plata sin condiciones"* → *"confiar el capital a quien sabe exactamente qué
necesita y ya demostró que lo invierte"*. Y **anclar el pedido siempre a la prueba** (53 mujeres,
59,5%→18,9%, "lo invierten").

### Glosario de reencuadre (cambios de palabra, con razón)
| En vez de… | Decir… | Por qué |
|---|---|---|
| "Regalar / dar dinero sin condiciones" | "Confiar el capital / capital semilla" | "Regalar" activa "se malgasta"; "capital" implica inversión y retorno. |
| "Renta básica" (a secas, arriba) | "Un ingreso estable para emprender" (y luego nombrarla) | Definir por su **función** antes que por la etiqueta politizada. |
| "Ayuda / donación / caridad" | "Cofinanciación / inversión social / apadrinar" | Reposiciona al donante como socio-inversionista, no limosnero. |
| "Beneficiaria" (receptora pasiva) | "Emprendedora / socia-emprendedora / protagonista" | Devuelve agencia; combate el marco de dependencia. |
| "No es cuestión de esfuerzo" | "No es por **falta** de esfuerzo — es por falta de liquidez" | Honra el esfuerzo; ataca la estructura, no a la persona. |
| "Sin condiciones" (como eslogan) | "Sin condiciones **porque ellas saben mejor que nadie qué necesitan** — y la evidencia lo confirma" | Convierte el gatillo en dignidad + prueba, en la misma frase. |

**Anclas que deben viajar SIEMPRE junto al pedido de dinero:** "ya lo hicieron 53 mujeres", "desempleo
59,5%→18,9%", "lo invierten, no lo malgastan", "$400.000/mes que ellas convierten en negocio".

---

## 3. Cialdini aplicado (7 principios → tácticas concretas)

| Principio | Qué ya tienen | Qué agregar (y dónde) |
|---|---|---|
| **Reciprocidad** | — | Dar **antes** de pedir: el Explainer/mini-guía "la trampa" como regalo de valor; PDF/reel "cómo saber si una ONG usa bien tu plata"; al donante, el vínculo con *su* madre + reporte trimestral como devolución. |
| **Compromiso y coherencia** | Toggle mensual/único, monto libre | Escalera de micro-compromisos: waitlist → "reservar mi cupo de socio" → aporte pequeño → subir de tier. Copy que ancle identidad: *"Sé del 1+"*, *"Soy socio fundador"*. Pedir el **recurrente** apelando a coherencia ("los que empiezan, se quedan": 70% de fidelización, ya es meta en [Goals.astro](../src/components/sections/Goals.astro)). |
| **Prueba social** | "★ Más elegido", LiveCounter, historias | **Números en vivo y visibles**: "N socios activos", "$X reunidos este mes", "N madres apadrinadas". Nombres/caras de socios (con permiso). Logos de aliados (Proantioquia, Cubo Social) arriba, no al final. "El tier que eligen 6 de cada 10". |
| **Autoridad** | Evidencia (Nobel, Kela, DANE), 65/35 | Subir la evidencia y las fuentes al primer pantallazo del argumento; sellos ("Fundación con RTE — recibo deducible" cuando exista); aliados institucionales como aval; citar a Banerjee/Duflo/Bregman con cara. |
| **Simpatía (liking)** | "amigos", equipo, historias | Fundadores/equipo con rostro y "por qué lo hago" (1ª persona); protagonista con nombre y arco; similitud ("no somos millonarios, somos amigos comprometidos" — ya está en Nosotros, subirlo). |
| **Escasez / urgencia** | — | Cohorte y cupo: "Buscamos las próximas **50 madres de 2026**" (ya es meta), "cupos de socio fundador", cuenta regresiva del lanzamiento, "cada mes sin fondear es un mes que una familia sigue en la trampa" (urgencia con propósito, sin manipular). |
| **Unidad (identidad compartida)** | "Club", "amigos", "nosotros", "tu +" | Es su superpoder — explotarlo: pertenencia ("entrar al Club"), carné de socio, ritual de bienvenida, lenguaje "los que más tenemos podemos mover la balanza" (nosotros, no ellos), la marca "1+" como símbolo de tribu. |

---

## 4. Marco de storytelling

- **Estructura (StoryBrand / donante-héroe):** el **villano** es *la trampa* (ya lo tienen, y es
  brillante: externaliza la culpa de la persona). El **guía** es el Club. El **héroe que actúa** es **TÚ**
  (el donante), que da el empujón; la **protagonista del cambio** es **ella**. Reconciliar ambos: el
  donante es quien hace posible que **ella** —no él— sea la heroína de su propia salida. Evita el
  "salvador blanco": el Club y el socio **cofinancian**; ella **construye**.
- **Víctima identificable > estadística:** elegir **una protagonista por campaña** (p. ej. Yuri) y
  contar su **arco antes→aporte→qué montó→hoy**, con cara, voz y datos propios. La estadística ("53
  mujeres") **respalda** la historia; no la reemplaza. Regla: *"una cara, un nombre, un número"*.
- **Secuencia emocional:** emoción primero (la historia), dato después (la prueba). Hoy la home hace lo
  contrario en varios bloques.
- **La historia de la refundación 1% → 1+** ([nosotros.astro](../src/pages/nosotros.astro)): úsala como
  prueba de tracción y de legado ("esto ya existía, ya cambió vidas, y un equipo tomó el testigo para
  profesionalizarlo"). Es autoridad + simpatía + prueba social en una sola narrativa.
- **Antídoto anti-lástima:** contar desde la **dignidad y la agencia** (emprendedoras que invierten), no
  desde la pena. Nada de "porno de pobreza". La evidencia lo permite: el relato es de **potencial**, no de carencia.

---

## 5. Matriz de objeciones (inoculación explícita)
Nombrar la objeción **desarma** al escéptico ("veo que ya lo pensaron"). Crear una sección **"Preguntas
incómodas"** (reutiliza el tono de *"la pregunta incómoda"* del Explainer) en `/modelo` y `/donar`.

| Objeción (voz del escéptico) | Reencuadre / respuesta | Prueba en el sitio |
|---|---|---|
| "Se lo van a gastar en vicio / mal" | "La evidencia global y **nuestro propio piloto** dicen lo contrario: lo invierten." | Results (28% comida, 18% negocio, 16% ahorro); evidencias del Explainer |
| "Les da pereza / se vuelven dependientes" | "El mito de la pereza no se sostiene: trabajan igual o más, con un plan." | Desempleo 59,5%→18,9%; Finlandia/Namibia |
| "Mejor enséñales a pescar" | "El efectivo **es** la caña: ellas saben qué caña necesitan. Y les damos acompañamiento, no solo plata." | "Dignidad y decisión"; 65% incluye capacitación y círculos |
| "Eso es asistencialismo / paternalismo" | "Al revés: es lo **menos** paternalista — confiamos en su criterio en vez de decidir por ellas." | "Cada familia sabe mejor que nadie qué necesita" |
| "¿Por qué mujeres/madres?" | "La pobreza tiene cara de mujer; con una madre, el impacto se multiplica en toda la familia." | Feminización (−12,1%; 36,1% jefatura femenina); "los hijos ganan" |
| "Que lo haga el gobierno" | "El Estado no llega (solo 56% recibe transferencias). Nosotros actuamos ya, entre ciudadanos." | Causa "programas desarticulados" |
| "¿Cómo sé que no es una estafa / a dónde va mi plata?" | "Cada peso con destino claro; ves a *tu* madre y su progreso; recibo deducible." | Transparencia 65/35; vínculo socio↔madre; RTE |
| "¿Por qué incondicional?" | "Porque poner condiciones cuesta más vigilar de lo que ahorra, y quita dignidad. La evidencia gana sin condiciones." | Kela, Dauphin, GiveDirectly |

---

## 6. Rework página por página (con copy de ejemplo)

### 6.1 Home — reordenar el arco (máximo impacto, bajo esfuerzo)
**Orden actual:** Hero → Impact(problema+pirámide) → Proof(evidencia) → Mission(modelo) → Stories →
LiveCounter → Tiers → Transparency.

**Orden propuesto (prueba y reencuadre primero, gatillos después):**
1. **Hero** (reescrito, ver abajo)
2. **Prueba viva primero** — un **mini-Results** ("53 mamás ya lo lograron: desempleo 59,5%→18,9%") +
   **una historia con nombre**. Gana el corazón y la credibilidad antes de argumentar.
3. **El problema / la trampa** (Impact + pirámide) — ahora el escéptico ya está abierto.
4. **Cómo funciona** (Mission: tu + → amigos → ingreso → crean riqueza).
5. **La evidencia** (Proof) — reetiquetada (ver abajo).
6. **"Preguntas incómodas"** (matriz de objeciones, 4–5 clave).
7. **Transparencia 65/35** (justo antes del pedido: responde "¿a dónde va mi plata?").
8. **Prueba social en vivo** (contador de socios + aliados) → **Tiers** → **DonateCTA**.

**Hero — reescritura (ejemplo):**
- *Antes:* "Salir de la pobreza no es cuestión de esfuerzo. Asociamos a cientos de amigos para dar una
  renta básica mensual a madres cabeza de familia — y que construyan su propia salida."
- *Después:* **"La mejor forma de eliminar la pobreza es creando riqueza."** (mantener el titular, es
  excelente) + lead: *"No es por falta de esfuerzo: es por falta de liquidez. Entre cientos de amigos
  cofinanciamos un ingreso estable para madres emprendedoras — y **ya 53 lo convirtieron en su propio
  negocio.**"* (mete prueba + reencuadre + honra el esfuerzo desde la primera línea).

**Proof — reetiquetar** para que la prueba preceda a la etiqueta:
- *Antes:* "Dar dinero, sin condiciones, ya funcionó."
- *Después:* **"Ya se probó en el mundo — y funciona."** … y dentro: *"Se llama renta básica: efectivo
  que las familias invierten. Namibia, Finlandia, Canadá y el mayor estudio del mundo (GiveDirectly) lo
  confirman."* (la etiqueta llega **después** del resultado).

**Impact — reencuadrar la pregunta:**
- *Antes:* "¿Funciona dar dinero sin condiciones? Los resultados son reveladores."
- *Después:* **"¿Y si el problema no es la gente, sino la trampa? Los resultados son reveladores."**

### 6.2 `/modelo` (Explainer) — ya es de clase mundial; micro-ajustes
- Añadir al final de "La pregunta incómoda" un **contador de prueba propia** ("no solo el mundo: nosotras
  ya lo vimos en 53 familias") para cerrar el salto de "evidencia global" a "acá funciona".
- Enlazar cada evidencia a su fuente (hoy el `/evidencia` lo tiene) y sumar la **historia con nombre**.

### 6.3 `/impacto`
- Subir **Results** como primer bloque (es la joya). Añadir **una historia con arco** (Yuri: de X a
  negocio propio). Convertir "53 mujeres" en "53 nombres" (grid de caras con permiso).

### 6.4 `/donar` (Tiers) — subir la conversión
- **Prueba social por tier** ("6 de cada 10 eligen Aliado"), **anclaje** (mostrar Madrina/Padrino primero
  hace que Aliado parezca razonable), y **traducir el aporte a impacto concreto**: *"$60.000 = una semana
  del colchón que sostiene a una mamá"*.
- **Reciprocidad + coherencia:** "Al sumarte recibes el vínculo con *tu* madre y su reporte trimestral."
- **Escasez honesta:** "Buscamos las próximas 50 madres de 2026 — tu aporte reserva un cupo."
- Cerrar el `/donar` con **"Preguntas incómodas"** (matriz) para rematar dudas antes de pagar.

### 6.5 `/nosotros`
- Subir *"No somos millonarios, somos amigos comprometidos"* como faro de **simpatía + unidad**. Añadir a
  cada fundador/equipo un **"por qué lo hago"** en 1ª persona. Poner **aliados con logo** como autoridad.

---

## 7. Plan de comunicación (más allá del sitio)

### 7.1 Públicos
- **Núcleo "1+":** clase media/alta urbana que puede dar $20–150k/mes sin que le duela (el mensaje de la
  pirámide es para ellos). Motivación: propósito + pertenencia + prueba.
- **Padrinos/Madrinas:** alto patrimonio, quieren impacto 1:1 medible. Motivación: ver *su* familia.
- **Aliados (marcas/empresas):** difusión + comercios (ver la app de checkout). Motivación: propósito de marca.
- **Embajadores:** voceros/influencers que se vuelven socios (máxima credibilidad; política de divulgación SIC).

### 7.2 Plataforma narrativa y pilares de contenido
Narrativa maestra: **"Riqueza, no lástima."** Pilares:
1. **Prueba** (historias con nombre, antes→después, "en qué lo invirtió").
2. **Evidencia** (mito vs. dato; "la pregunta incómoda" en formato corto).
3. **Transparencia** ("a dónde fue tu peso este mes"; el 35% que baja).
4. **Comunidad** (socios, ritual de entrada, contador, "quién se sumó hoy").
5. **Refundación 1%→1+** (legado + hacia dónde vamos, metas 2026).

### 7.3 Motor de prueba ("proof engine")
Convertir el **seguimiento trimestral** (que ya hacen) en materia prima de contenido: cada trimestre →
1 historia en video, 1 dato de impacto, 1 "en qué invirtieron". Con **consentimiento firmado (Ley 1581)**,
sin porno de pobreza, protagonismo y dignidad de ellas. Este motor alimenta redes, reportes a socios y PR.

### 7.4 Canales
- **Instagram/Reels + TikTok:** la historia con nombre y el "mito vs. dato" en 20–40s.
- **WhatsApp (clave en Colombia):** onboarding del socio, reportes, referidos ("reenvía e invita").
- **Embajadores:** kit + política de divulgación (SIC); embajador que **es** socio.
- **PR/earned media:** el ángulo "startup social que profesionaliza la renta básica en Medellín" + datos.
- **Alianzas** (Proantioquia, Cubo Social, comercios): co-marca y distribución.

### 7.5 Campaña de lanzamiento (encaja con el ROADMAP Track C)
Expectativa (narrativa 1%→1+, cuenta regresiva, waitlist) → lanzamiento (historia + evidencia + pedido) →
prueba continua (motor de prueba). Cada fase con un **micro-compromiso** que escala (Cialdini).

### 7.6 Ciclo de vida del donante (retención = 70% meta)
Micro-compromiso (waitlist/cupo) → aporte → **bienvenida ritual** (carné, "tu madre") → **reporte
trimestral** (reciprocidad + coherencia) → **referido** (grafo) → subir de tier. Cada correo/pantalla
refuerza identidad "soy del 1+".

### 7.7 Guardarraíles éticos (no negociables)
Dignidad y agencia de las mujeres; **consentimiento** para foto/historia (Ley 1581); cero "porno de
pobreza"; transparencia radical del dinero; **divulgación SIC** en embajadores; no prometer deducibilidad
hasta tener **RTE**; datos siempre citados (DANE, fuentes).

### 7.8 Medición (KPIs)
Conversión visitante→socio; % que elige recurrente; retención a 3/6/12 meses; CAC por canal; tier
promedio; y **encuesta de objeción** ("¿qué casi te frena de sumarte?") para iterar la copy. Donde se
pueda, **A/B** del Hero y del orden de la home.

---

## 8. Roadmap de implementación (por prioridad)

**Quick wins (1–2 semanas, solo copy/orden, sin backend):**
1. Reescribir el **Hero** (prueba + reencuadre + honrar el esfuerzo).
2. **Reordenar la home** (prueba y reencuadre antes de los gatillos).
3. Reetiquetar **Proof** e **Impact** (resultado antes que la etiqueta).
4. Añadir sección **"Preguntas incómodas"** (matriz de objeciones) en `/modelo` y `/donar`.
5. Unificar "no es *por falta de* esfuerzo" en todo el sitio.

**Medio plazo (semanas):**
6. **Historia con nombre** (arco antes→después) en home e `/impacto`.
7. Mejoras de **Tiers** (prueba social por tier, anclaje, aporte→impacto, escasez de cohorte).
8. **Prueba social en vivo** (contador de socios) y aliados con logo arriba.
9. Montar el **motor de prueba** (proceso trimestral → contenido, con consentimiento).

**Continuo:**
10. Campaña de expectativa 1%→1+, embajadores (SIC), ciclo de vida del donante, PR, A/B y encuesta de objeción.

---

## 9. Resumen de una línea
Tienen los argumentos y la evidencia de sobra; el salto de clase mundial está en **poner la prueba y la
dignidad primero, nombrar las objeciones sin miedo, y hablar siempre de riqueza y confianza — nunca de
lástima**.
