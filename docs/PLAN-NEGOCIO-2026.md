# Plan de negocio y marketing — ventana post-sismo (ago 2026 → ago 2027)

> Complementa [ROADMAP.md](./ROADMAP.md) (qué construir), [COMUNICACION.md](./COMUNICACION.md) (cómo
> hablar) y [TERREMOTO-2026.md](./TERREMOTO-2026.md) (hechos verificados y guardarraíles éticos).
> Este documento responde otra pregunta: **cómo se financia el crecimiento y cómo se captura el momento**,
> con fechas derivadas de evidencia, no de intuición.

---

## 0. La tesis, en una frase

**El activo de este momento no son los damnificados del sismo: son los cientos de miles de colombianos que
acaban de donar por primera vez y que en seis semanas no van a tener a dónde seguir.** El producto del
Club —un aporte mensual, auditable, con nombre y cara— es exactamente la respuesta a la pregunta que
todos ellos se van a hacer: *"¿y esa plata sirvió de algo? ¿ahora qué?"*.

No competimos por la plata de la emergencia. **Recogemos a la gente cuando la emergencia se apaga.**

---

## 1. La decisión que el sismo fuerza: partir el lanzamiento único

El ROADMAP tiene aprobado un **lanzamiento único** (web + portal de socios + motor de matching +
referidos + correos + admin), y él mismo nombra el riesgo: *"El lanzamiento único retrasa ingresos/
validación hasta tenerlo todo."*

La evidencia de la sección 3 dice que la ventana de conversión de este momento se abre en **septiembre** y
se cierra hacia **noviembre**. El portal + motor + referidos + correos es trabajo de meses. **Si se espera
al lanzamiento completo, la ventana se pierde entera** — y no vuelve: es el evento de activación de
donantes más grande de Colombia en décadas.

> **Recomendación central de este plan: tomar la alternativa que el propio ROADMAP ya contempla** —
> *"lanzar ya web pública + Wompi en vivo, y portal + motor + referidos como fast-follow."*
>
> Riesgo de partir el lanzamiento: el socio nuevo no ve de inmediato "su madre" ni el carné, y hay que
> sostenerlo con correos manuales unos meses. **Es un riesgo manejable.** El riesgo de no partirlo —
> perder la única ventana del año con el país predispuesto a dar— no se puede recuperar.

Esto no cancela nada del ROADMAP. Solo cambia el orden: **cobrar primero, deleitar después.**

---

## 2. La matemática del negocio

Del ROADMAP, ya definido y coherente con los tiers del sitio:

| Concepto | Valor |
|---|---|
| Costo **bruto** por madre en el programa | **$600.000 COP/mes** |
| De ahí, a ella (65%) | ~$400.000 COP/mes |
| Operación (35%, baja al escalar) | ~$200.000 COP/mes |
| Costo bruto anual por madre | **$7.200.000 COP** |

### 2.1 Cuántos socios cuesta cada meta

| Madres | Ingreso recurrente mensual | Socios si todos fueran Aliado ($60k) | Socios con ticket promedio $50k |
|---|---|---|---|
| 10 | $6.000.000 | 100 | 120 |
| 25 | $15.000.000 | 250 | 300 |
| **50 (meta 2026)** | **$30.000.000** | **500** | **600** |
| 100 | $60.000.000 | 1.000 | 1.200 |

**La meta 2026 de 50 madres = ~500–600 socios recurrentes = $360 millones COP al año.** Ese es el número
que hay que tener en la cabeza en toda decisión de marketing. El ticket promedio real depende de la mezcla
de tiers, que hoy no está medida — es el primer dato que hay que empezar a registrar.

### 2.2 Cuánto vale un socio (y por tanto cuánto se puede gastar en conseguirlo)

Con la **meta propia de 70% de retención anual** ([Goals.astro](../src/components/sections/Goals.astro)),
la vida esperada de un socio es de ~3,3 años:

| Tier | Aporte mensual | Valor de vida (LTV) |
|---|---|---|
| Amigo | $20.000 | $800.000 |
| **Aliado** (el destacado) | **$60.000** | **$2.400.000** |
| Mecenas | $150.000 | $6.000.000 |
| Madrina/Padrino | $600.000 | $24.000.000 |

**Implicación estratégica:** un Aliado vale $2,4 millones de pesos en el tiempo. Gastar $150.000–$250.000
en conseguirlo sigue siendo un retorno de 10:1 o mejor. **Hoy el Club actúa como si no pudiera invertir en
adquisición; la matemática dice que sí puede, y bastante.** El benchmark del sector (Houston Food Bank,
huracán Harvey) es un retorno de 9x en 2,5 años convirtiendo donantes de desastre.

### 2.3 El embudo, con la única tasa de conversión que tenemos medida
El caso Houston Food Bank convirtió **17% de los donantes captados durante el desastre** en donantes
ligados a la misión. Si se usa esa tasa como referencia:

**Para conseguir 500 socios se necesitan ~3.000 personas realmente enganchadas** con el contenido de la
campaña. Eso es alcanzable con un buen golpe de prensa + redes: no requiere presupuesto de medios masivo,
requiere una historia que la gente quiera reenviar.

---

## 3. El calendario, derivado de la evidencia

Las fechas no son gusto: salen de las curvas medidas de donación post-desastre (ver
[TERREMOTO-2026.md](./TERREMOTO-2026.md) §3). Sismo = **10 de agosto de 2026**.

| Fase | Fechas | Qué pasa afuera | Qué hacemos |
|---|---|---|---|
| **0. Silencio comercial** | 17 ago – 7 sep | Pico de emergencia. Medellín acaba de recaudar $6.000M en un concierto — la billetera solidaria de nuestra propia base está agotada | **No pedir nada.** Franja de reconocimiento sin CTA. Arreglar la caja (§5). Producir contenido |
| **1. Prensa sin pedido** | 8 sep – 5 oct | Semana 6: la cobertura satura y los medios entran en fatiga del sismo — **necesitan ángulos nuevos** | Lanzar la historia de Armenia. Cero pedido de plata en el contenido, pero el sitio ya convierte a quien llegue |
| **2. Campaña de conversión** | 6 oct – 30 nov | Mes 2: dos tercios de la donación de emergencia ya se dio; empieza el vacío | **Aquí sí se pide, y se pide recurrente.** Es el corazón del año |
| **3. Aguinaldo** | dic | Pico natural de donación de fin de año en Colombia | Segunda ola, apalancada en la primera |
| **4. "La plata del sismo ya se acabó"** | feb 2027 | Mes 6: la donación de desastre está muerta y la reconstrucción apenas arranca (es de 4–6 años) | Momento de máxima resonancia del argumento estructural, con datos reales de qué pasó |
| **5. Aniversario** | ago 2027 | 28% de los donantes convertidos dan su segundo aporte entre los meses 10 y 15 (dato Houston) | Segunda ventana de conversión |

> **La regla que ordena todo el calendario:** en agosto se acompaña, en septiembre se cuenta, en octubre se
> pide. Invertir ese orden es lo que convierte una campaña legítima en oportunismo (ver semáforo rojo en
> [TERREMOTO-2026.md](./TERREMOTO-2026.md) §4).

---

## 4. La campaña: "Cero muertos no fue suerte"

### 4.1 El concepto
Armenia, 1999: sismo de 6,2 → **921 muertos**. Armenia, 2026: sismo de **7,4, más fuerte** → **cero
muertos, ningún edificio colapsado**. La diferencia no fue la ayuda que llegó en enero de 1999. Fueron
**27 años** de norma sismorresistente e interventoría construidos cuando ya nadie estaba mirando.

Es la tesis del Club contada con un caso colombiano que todo el mundo recuerda, y que **no requiere pedir
plata para el sismo ni fingir que Moravia fue afectada**:

> **Lo que salva no es lo que llega en la emergencia. Es lo que se sostiene cuando la emergencia deja de
> ser noticia.**

Y el segundo acto lo pone Moravia, sin metáfora: el barrio **nació de emergencias que nadie resolvió** —
familias desplazadas que terminaron levantando ranchos sobre el basurero municipal. Moravia *es* el día
después que Colombia no atendió. El Club no está cambiando de tema: está diciendo que ya conoce el final
de esta película porque trabaja adentro.

### 4.2 Por qué esto es, además, una jugada de prensa
Hacia la semana 6 (mediados de septiembre) los medios habrán agotado el ángulo del rescate y estarán
buscando historias nuevas sobre el sismo. "Por qué Armenia no tuvo un solo muerto" es un regalo
periodístico: es positivo, es colombiano, es contraintuitivo y tiene expertos citables. **El Club puede
ser la fuente que lo empaqueta.** Prensa ganada, costo cero, y posiciona la tesis sin pedir un peso.

### 4.3 Los tres activos de contenido
1. **La pieza de Armenia** (nota + reel + gráfico comparativo 1999/2026). Alta compartibilidad, cero pedido.
2. **El origen de Moravia** (documentado, con fuentes). Conecta la causa al momento sin oportunismo.
3. **La cifra ancla**: *por cada peso que la filantropía de desastres destina a recuperación de largo
   plazo, destina casi seis a la respuesta inmediata* (57,5% vs 9,9%, Center for Disaster Philanthropy).
   Es el dato que justifica la existencia del Club sin atacar a nadie.

### 4.4 Lo que la campaña NO hace
No pide plata para el terremoto. No insinúa que Moravia fue afectada. No usa imágenes de víctimas del
sismo. No mezcla urgencia con la palabra "terremoto". Los seis puntos del semáforo rojo están en
[TERREMOTO-2026.md](./TERREMOTO-2026.md) §4 y son innegociables.

---

## 5. Bloqueadores críticos — sin esto el plan vale cero

### 🔴 5.1 La caja no existe: no se puede cobrar
[src/lib/donate.ts](../src/lib/donate.ts) tiene todas las URLs de Wompi vacías y `WORKER_BASE = ""`. Los
cuatro tiers en `src/content/tiers/*.md` tienen `urlMonthly: ""` y `urlOneTime: ""`. **Hoy el sitio
persuade y no puede recibir un peso.**

Todo lo demás en este documento depende de esto. **Fecha límite: 7 de septiembre** (fin de la fase 0), o
la fase 1 manda tráfico de prensa a un sitio que no convierte. Requiere del equipo: llave pública Wompi,
secreto de integridad, y desplegar el Worker.

### 🔴 5.2 El sitio tiene datos de demostración a la vista
El contador en vivo y varias historias están marcados como "datos de prueba" / `real: false`. **Una
campaña cuyo argumento central es la transparencia no puede mandar tráfico a un sitio con cifras
inventadas.** Antes de la fase 1: o son datos reales, o se retiran esos bloques.

### 🟠 5.3 El recibo deducible se está prometiendo sin RTE
El tier Amigo promete "Recibo deducible" y el RTE (Track A del ROADMAP) todavía está en trámite. El propio
COMUNICACION.md lo marca como guardarraíl: *no prometer deducibilidad hasta tener RTE*. Corregir el copy o
condicionarlo ("cuando obtengamos el RTE, con efecto retroactivo si aplica" — verificar con el contador).

---

## 6. Cómo llegarle a más gente bajo el modelo de transferencias

Tres vectores, y uno de ellos es la palanca de escala real:

### Vector 1 — Profundizar en Moravia *(base)*
Más madres en el mismo barrio, misma operación. Costo marginal casi nulo, calidad controlada, y es donde
se producen las historias que alimentan todo el marketing. **Es el laboratorio de prueba y no se toca.**
Limitación: topa contra la capacidad operativa propia.

### Vector 2 — Pasar de operador a **co-financiador de operadores locales** *(la palanca)*
Hoy el Club hace todo: selecciona, transfiere, acompaña, mide. Eso limita el crecimiento a su propia
capacidad de terreno. El modelo que escala es **concentrar la financiación y descentralizar la ejecución**
en organizaciones locales que ya tienen presencia y cumplimiento resueltos.

No es teoría: es exactamente lo que hizo el **FOREC** para reconstruir el Eje Cafetero tras 1999 —
28 a 32 gerencias zonales operadas por universidades, cooperativas y organizaciones cívicas. Y es la
recomendación #1 de Gonzalo Lizarralde para este sismo: *"concentrar recursos, descentralizar
intervenciones"*.

### Vector 3 — Co-financiar un aliado en la zona del sismo *(el piloto del vector 2)*
Aquí está el insight que responde la pregunta directamente: **co-financiar a un aliado en la zona del
sismo no es un desvío de la misión — es el ensayo del músculo que permite escalar a cualquier parte.**
Si el Club aprende a financiar a un operador y auditarlo, ya no necesita montar operación propia en cada
ciudad para crecer.

Aliados identificados que ya hacen **transferencias monetarias** (no solo especie) en la zona: **NRC**,
**ACNUR** (coordina el Grupo de Transferencias Monetarias, la mesa nacional que existe justo para esto),
**PMA**, y **Pastoral Social de la Diócesis de Quibdó**. Ninguno tiene convocatoria formal de
co-financiador abierta — el primer paso es simplemente escribirles.

⚠️ Antes de comprometer plata en el vector 3, resolver las dos preguntas legales abiertas (alcance real de
la Circular 011/2017 de la UIAF y retención en la fuente sobre pagos a beneficiarios) — ver
[TERREMOTO-2026.md](./TERREMOTO-2026.md) §6.

**Secuencia recomendada:** Vector 1 sostiene el relato y la calidad → Vector 3 prueba el modelo de
co-financiación con un aliado serio y bajo riesgo → Vector 2 lo convierte en la forma de crecer del Club.

---

## 7. Indicadores

**Del negocio** (los únicos que deciden si el plan funciona):
- **Socios recurrentes activos** — la métrica maestra. Meta implícita 2026: ~500–600
- Ticket promedio y mezcla de tiers *(hoy sin medir — empezar ya)*
- % de aportes recurrentes vs. únicos
- Retención a 3 / 6 / 12 meses (meta propia: 70%)
- Costo de adquisición por socio, contra el LTV de §2.2
- Madres financiadas de forma sostenible (círculos completos)

**De la campaña:**
- Menciones de prensa ganada en fase 1
- Tráfico y conversión visitante → socio (por fase)
- Tasa de conversión de la cohorte "post-sismo", contra el 17% de referencia

**De confianza** (lo que protege la licencia para operar):
- Reporte trimestral publicado a tiempo, sin excepción
- Cero reclamos de destinación de fondos
- % del 35% de gestión, bajando con la escala (es una promesa pública explícita del sitio)

---

## 8. Riesgos

| Riesgo | Mitigación |
|---|---|
| **Wompi no está listo para septiembre** → se pierde la ventana entera | Es el ítem #1 de la semana. Bloquea todo lo demás |
| **Desplazamiento de donaciones**: la base del Club en Medellín acabó de dar al sismo | Por eso la fase 0 es de silencio comercial. Se pide en octubre, no en agosto |
| **Percepción de oportunismo** | Semáforo rojo/verde innegociable. En fase 1 no se pide plata |
| **Sobreprometer a comunidades del sismo** y no poder sostenerlo | Nunca anunciar operación propia en zona de sismo. Vector 3 solo vía aliado, y solo con lo legal resuelto |
| **Lanzar con datos demo visibles** destruye el argumento de transparencia | Bloqueador 5.2, antes de fase 1 |
| **Partir el lanzamiento deja al socio nuevo sin portal** | Sostener con correos manuales y reporte trimestral hasta el fast-follow. Es deuda asumida a conciencia, no un descuido |

---

## 9. Esta semana

1. **Destrabar Wompi** — llave pública + secreto de integridad + desplegar el Worker. Sin esto no hay plan.
2. **Decidir si se parte el lanzamiento único** (§1). Es la decisión de mayor impacto del año y no es mía:
   es del equipo.
3. **Publicar la franja de reconocimiento** sin CTA, con enlace a canales oficiales (borrador en
   [TERREMOTO-2026.md](./TERREMOTO-2026.md) §5.1).
4. **Auditar el sitio por datos de demostración** y decidir: reales o fuera.
5. **Empezar a producir la pieza de Armenia** — tiene que estar lista para el 8 de septiembre.
6. *(Paralelo, sin compromiso)* Escribir a NRC y al GTM/GIFMM preguntando por vías de co-financiación, y
   la consulta a la UIAF.

---

*Elaborado el 17 de agosto de 2026, sobre la investigación de [TERREMOTO-2026.md](./TERREMOTO-2026.md).
Las cifras de negocio salen del ROADMAP y de los tiers del sitio; las de comportamiento de donantes, de
Center for Disaster Philanthropy, M+R Benchmarks, Blackbaud Institute y el Fundraising Effectiveness
Project. Los supuestos que aún no están medidos (ticket promedio, mezcla de tiers, CAC) están marcados
como tales — no son proyecciones, son casillas por llenar.*
