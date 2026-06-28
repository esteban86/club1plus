// ─────────────────────────────────────────────────────────────────────────────
//  Recorrido guiado de onboarding (demo). Panel "narrador" anclado abajo (no tapa
//  el contenido: la página se desplaza para dejar el elemento resaltado por encima
//  del panel) + spotlight con anillo. Atraviesa todo el sitio y reanuda el paso
//  tras cada navegación (estado en localStorage). ES + EN, responsive.
// ─────────────────────────────────────────────────────────────────────────────
import { ROUTES, type RouteKey } from "../../i18n/routes";
import { setMemberId } from "./session";
import { DEFAULT_MEMBER_ID } from "./data";

type Lang = "es" | "en";
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const KEY = "c1p_tour";

interface I18n { es: string; en: string }
interface Step {
  route: RouteKey;
  target?: string;       // selector a iluminar; ausente = solo narrador (intro/outro)
  ready?: string;        // selector que indica que la página está lista (espera render JS)
  pre?: () => void;      // acción antes de mostrar (p. ej. abrir una pestaña)
  ensureDemoSession?: boolean;
  kicker: I18n;
  title: I18n;
  body: I18n;
  cta?: I18n;            // etiqueta del botón final (último paso); si falta usa "Terminar"
}

const L = {
  es: { next: "Siguiente", prev: "Atrás", skip: "Saltar recorrido", finish: "Terminar", launch: "Recorrido guiado", of: "de" },
  en: { next: "Next", prev: "Back", skip: "Skip tour", finish: "Finish", launch: "Guided tour", of: "of" },
};

const STEPS: Step[] = [
  {
    route: "home",
    kicker: { es: "Bienvenida/o", en: "Welcome" },
    title: { es: "Te muestro el Club en 1 minuto", en: "Let me show you the Club in 1 minute" },
    body: { es: "Un recorrido corto por la historia completa: el problema, tu papel y a quién le cambias la vida. ¿Vamos?", en: "A short walk through the whole story: the problem, your role, and whose life you change. Shall we?" },
  },
  {
    route: "home", target: ".hero",
    kicker: { es: "La idea", en: "The idea" },
    title: { es: "Riqueza, no caridad", en: "Wealth, not charity" },
    body: { es: "Cientos de amigos suman un aporte mensual para que una madre cabeza de familia reciba una renta básica y construya su propia salida.", en: "Hundreds of friends add a monthly contribution so a female head of household receives a basic income and builds her own way out." },
  },
  {
    route: "home", target: "[data-tour='problema']",
    kicker: { es: "Por qué importa", en: "Why it matters" },
    title: { es: "1 de cada 3 es pobre", en: "1 in 3 is poor" },
    body: { es: "En Colombia la pobreza no es falta de esfuerzo: es una trampa. Quienes más tenemos podemos inclinar la balanza con muy poco.", en: "In Colombia, poverty isn't lack of effort — it's a trap. Those of us with more can tip the scale with very little." },
  },
  {
    route: "home", target: "[data-tour='tiers']",
    kicker: { es: "Tu parte", en: "Your part" },
    title: { es: "Eliges cuánto sumar", en: "You choose how much to add" },
    body: { es: "Diez aliados o cuatro mecenas financian a una madre entre todos; una madrina la apadrina completa. Cada + cuenta.", en: "Ten allies or four patrons fund one mother together; a godmother sponsors her in full. Every + counts." },
  },
  {
    route: "home", target: ".livec",
    kicker: { es: "No empiezas de cero", en: "You're not starting from zero" },
    title: { es: "Ya somos una comunidad", en: "We're already a community" },
    body: { es: "En vivo: cuántos sumamos, cuántas madres ya reciben su renta y cuánto hemos transferido. Vamos a verla.", en: "Live: how many we are, how many mothers already receive income, and how much we've transferred. Let's see it." },
  },
  {
    route: "comunidad", target: ".comm__graphcard", ready: ".comm__graphcard",
    kicker: { es: "El efecto red", en: "The network effect" },
    title: { es: "Un + se multiplica", en: "One + multiplies" },
    body: { es: "Invitas a un amigo, que invita a otro. Así crece la red — varios niveles — y entran más madres. Siempre anónima en lo público.", en: "You invite a friend, who invites another. The network grows several levels deep — and more mothers join. Always anonymous in public." },
  },
  {
    route: "miEspacio", target: ".pf-carnet", ready: ".pf-tabs", ensureDemoSession: true,
    kicker: { es: "Tu espacio", en: "Your space" },
    title: { es: "Todo en un solo lugar", en: "Everything in one place" },
    body: { es: "Al sumarte entras a Mi espacio: tu carné, tus aportes, tu red y —lo más importante— la persona que financias.", en: "When you join you enter My space: your card, your contributions, your network and — most importantly — the person you fund." },
  },
  {
    route: "miEspacio", target: ".pf-mother", ready: ".pf-tabs",
    pre: () => { try { localStorage.setItem("c1p_demo_consent", "1"); } catch {} document.querySelector<HTMLElement>(".pf-tab[data-tab='madre']")?.click(); },
    kicker: { es: "La conexión", en: "The connection" },
    title: { es: "Conoces a quien financias", en: "You meet who you fund" },
    body: { es: "Con su consentimiento, ves a tu beneficiaria real: su historia y cuánto falta para completar su renta. No es un número.", en: "With her consent, you see your real beneficiary: her story and how much is left to complete her income. Not a number." },
  },
  {
    route: "miEspacio", target: ".pf-reflink", ready: ".pf-tabs",
    pre: () => { document.querySelector<HTMLElement>(".pf-tab[data-tab='referidos']")?.click(); },
    kicker: { es: "Multiplica", en: "Multiply" },
    title: { es: "Tu enlace, tu red", en: "Your link, your network" },
    body: { es: "Compartes tu link y ves crecer tu propia red de referidos, incluso varios niveles abajo.", en: "You share your link and watch your own referral network grow, even several levels down." },
  },
  {
    route: "admin", target: "[data-panel='matching']", ready: ".pf-tab",
    pre: () => { document.querySelector<HTMLElement>(".pf-tab[data-tab='matching']")?.click(); },
    kicker: { es: "Tras bambalinas", en: "Behind the scenes" },
    title: { es: "Cómo encajan las piezas", en: "How the pieces fit" },
    body: { es: "El equipo ve cómo se apilan los aportes para completar los $600.000/mes de cada madre, y el reparto 65/35.", en: "The team sees how contributions stack up to complete each mother's $600,000/mo, and the 65/35 split." },
  },
  {
    route: "donar", target: "[data-tour='tiers']", ready: "[data-tour='tiers']",
    kicker: { es: "Tu turno", en: "Your turn" },
    title: { es: "¿Lista/o para sumarte?", en: "Ready to join?" },
    body: { es: "Eso es todo. Tu + se convierte en la renta de una madre cabeza de familia. Elige tu aporte y empieza hoy.", en: "That's it. Your + becomes the income of a female head of household. Pick your contribution and start today." },
  },
];

// ── Edición "fundadores": invitación a refundar el Club (1% → 1+) ───────────────
const STEPS_FOUNDERS: Step[] = [
  {
    route: "home",
    kicker: { es: "Para quienes fundaron el Club", en: "For those who founded the Club" },
    title: { es: "Lo cerramos. ¿Lo reabrimos, juntos?", en: "We closed it. Shall we reopen it — together?" },
    body: { es: "Creamos El Club del 1% y lo pausamos. Pero la idea era demasiado buena para dejarla ir. Te invitamos a refundarlo con nosotros, ahora como El Club del 1+. Déjanos mostrarte lo que ya está listo.", en: "We built El Club del 1% and paused it. But the idea was too good to let go. We invite you to re-found it with us — now as El Club del 1+. Let us show you what's already built." },
  },
  {
    route: "home", target: ".hero",
    kicker: { es: "La misión sigue intacta", en: "The mission is intact" },
    title: { es: "Riqueza, no caridad", en: "Wealth, not charity" },
    body: { es: "El propósito no cambió: que una madre cabeza de familia reciba una renta básica y construya su propia salida. Lo que cambia es la fuerza con la que lo hacemos.", en: "The purpose hasn't changed: a female head of household receives a basic income and builds her own way out. What changes is the force we do it with." },
  },
  {
    route: "home", target: "[data-tour='problema']",
    kicker: { es: "Por qué vale la pena volver", en: "Why it's worth coming back" },
    title: { es: "El problema no se fue", en: "The problem didn't go away" },
    body: { es: "1 de cada 3 personas en Colombia sigue en la trampa de la pobreza. Lo que nos unió sigue ahí, esperando que volvamos a moverlo.", en: "1 in 3 people in Colombia is still in the poverty trap. What brought us together is still there, waiting for us to move it again." },
  },
  {
    route: "home", target: "[data-tour='tiers']",
    kicker: { es: "El giro: del 1% al 1+", en: "The shift: from 1% to 1+" },
    title: { es: "De pocos elegidos a sumar a muchos", en: "From a chosen few to adding many" },
    body: { es: "Antes, un club del 1%. Ahora un “+”: sumar. Diez aliados o cuatro mecenas financian a una madre; una madrina la apadrina completa. Mientras más seamos, más madres reciben su renta.", en: "Before, a club of the 1%. Now a “+”: adding up. Ten allies or four patrons fund one mother; a godmother sponsors her in full. The more we are, the more mothers receive income." },
  },
  {
    route: "home", target: ".livec",
    kicker: { es: "Imagina la tracción", en: "Imagine the traction" },
    title: { es: "Esto es lo que crece al reabrir", en: "This is what grows when we reopen" },
    body: { es: "Socios, madres con renta, dinero transferido — en vivo. Hoy son cifras de demostración; contigo y este equipo se vuelven reales.", en: "Members, mothers with income, money transferred — live. Today they're demo figures; with you and this team they become real." },
  },
  {
    route: "comunidad", target: ".comm__graphcard", ready: ".comm__graphcard",
    kicker: { es: "El efecto refundador", en: "The re-founder effect" },
    title: { es: "Cada uno trae a otros", en: "Each one brings others" },
    body: { es: "Tú ya sabes a quién invitar. Un refundador trae a otro, y la red se multiplica. Así pasamos de un puñado a un movimiento.", en: "You already know who to invite. One re-founder brings another, and the network multiplies. That's how we go from a handful to a movement." },
  },
  {
    route: "miEspacio", target: ".pf-carnet", ready: ".pf-tabs", ensureDemoSession: true,
    kicker: { es: "Ya está construido", en: "It's already built" },
    title: { es: "El espacio del socio, listo", en: "The member space, ready" },
    body: { es: "No partimos de cero: el portal, el carné, los aportes y la red ya funcionan. Solo falta encenderlo.", en: "We're not starting from zero: the portal, the card, the contributions and the network already work. We just need to switch it on." },
  },
  {
    route: "miEspacio", target: ".pf-mother", ready: ".pf-tabs",
    pre: () => { try { localStorage.setItem("c1p_demo_consent", "1"); } catch {} document.querySelector<HTMLElement>(".pf-tab[data-tab='madre']")?.click(); },
    kicker: { es: "Por esto lo hacemos", en: "This is why we do it" },
    title: { es: "Ellas ya están", en: "They're already here" },
    body: { es: "Cuatro mujeres reales confiaron y dieron su testimonio. Cada socio conoce a la madre que financia. No es un número: es una historia esperando seguir.", en: "Four real women trusted us and shared their testimony. Each member meets the mother they fund. Not a number: a story waiting to continue." },
  },
  {
    route: "admin", target: "[data-panel='matching']", ready: ".pf-tab",
    pre: () => { document.querySelector<HTMLElement>(".pf-tab[data-tab='matching']")?.click(); },
    kicker: { es: "La operación, pensada", en: "The operation, thought through" },
    title: { es: "Sabemos cómo encaja", en: "We know how it fits" },
    body: { es: "Cómo se reparte cada aporte (65/35), cómo se completa la renta de cada madre, cómo se asigna. El motor ya está diseñado para que el equipo lo opere.", en: "How each contribution splits (65/35), how each mother's income is completed, how it's matched. The engine is already designed for the team to run." },
  },
  {
    route: "nosotros", target: "[data-tour='ellos']", ready: "[data-tour='ellos']",
    kicker: { es: "Esto empezó con ustedes", en: "It started with you" },
    title: { es: "Los fundadores del Club", en: "The Club's founders" },
    body: { es: "El Club del 1% existió porque un grupo de amigos se atrevió. Ustedes demostraron que asociarse para dar una renta básica cambia vidas. Ese legado es el punto de partida.", en: "El Club del 1% existed because a group of friends dared to. You proved that joining forces to give a basic income changes lives. That legacy is our starting point." },
  },
  {
    route: "nosotros", target: "[data-tour='nosotros']", ready: "[data-tour='nosotros']",
    kicker: { es: "El equipo que hoy le mete el empuje", en: "The team pushing it today" },
    title: { es: "Equipo refundador", en: "Re-founding team" },
    body: { es: "Nosotros tomamos el testigo para reabrirlo y profesionalizarlo como El Club del 1+. Pero esto se hace en grande solo si lo hacemos juntos — ustedes y nosotros.", en: "We took up the baton to reopen and professionalize it as El Club del 1+. But this only goes big if we do it together — you and us." },
  },
  {
    route: "home",
    kicker: { es: "Tu turno, refundador/a", en: "Your turn, re-founder" },
    title: { es: "¿Le metemos el empuje, juntos?", en: "Shall we give it the push, together?" },
    body: { es: "Esto solo necesita gente que se ilusione. Ya hay un equipo de liderazgo metiéndole el empuje. Si te late, escríbenos: ¿le entras a refundar El Club del 1+?", en: "This just needs people who get excited. There's already a leadership team pushing it. If it resonates, write to us: are you in to re-found El Club del 1+?" },
    cta: { es: "¡Cuenten conmigo!", en: "Count me in!" },
  },
];

type Variant = "general" | "founders";
const getSteps = (v: Variant): Step[] => (v === "founders" ? STEPS_FOUNDERS : STEPS);

interface State { active: boolean; step: number; lang: Lang; variant: Variant }
const DEFAULT_STATE: State = { active: false, step: 0, lang: "es", variant: "general" };
const read = (): State => { try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); return s ? { ...DEFAULT_STATE, ...s } : { ...DEFAULT_STATE }; } catch { return { ...DEFAULT_STATE }; } };
const write = (s: State) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
const clearState = () => { try { localStorage.removeItem(KEY); } catch {} };

const detectLang = (): Lang => (location.pathname.split("/").filter(Boolean).some((s) => s === "en") ? "en" : "es");
const norm = (p: string) => p.replace(/\/+$/, "");
const stripBase = (p: string) => (base && p.startsWith(base) ? p.slice(base.length) : p);
function currentKey(lang: Lang): RouteKey | null {
  const here = norm(stripBase(location.pathname));
  for (const k of Object.keys(ROUTES) as RouteKey[]) if (norm(ROUTES[k][lang]) === here) return k;
  return null;
}
const routePath = (k: RouteKey, lang: Lang) => base + ROUTES[k][lang];

let currentEl: HTMLElement | null = null;

export function startTour(variant: Variant = "general") {
  write({ active: true, step: 0, lang: detectLang(), variant });
  showStep();
}
function endTour() {
  clearState();
  currentEl = null;
  const root = document.getElementById("tour-root");
  if (root) root.innerHTML = "";
  document.body.classList.remove("tour-on");
}
function goTo(i: number) {
  if (i >= getSteps(read().variant).length) return endTour();
  if (i < 0) return;
  write({ ...read(), step: i });
  showStep();
}

function waitFor(sel: string, onFound: (el: HTMLElement) => void, onTimeout?: () => void, tries = 30) {
  const el = document.querySelector<HTMLElement>(sel);
  if (el) return onFound(el);
  if (tries <= 0) return onTimeout?.();
  setTimeout(() => waitFor(sel, onFound, onTimeout, tries - 1), 90);
}

function showStep() {
  const st = read();
  if (!st.active) return;
  const step = getSteps(st.variant)[st.step];
  if (!step) return endTour();
  const lang = st.lang;
  if (currentKey(lang) !== step.route) {
    if (step.ensureDemoSession) setMemberId(DEFAULT_MEMBER_ID);
    location.assign(routePath(step.route, lang));
    return;
  }
  document.body.classList.add("tour-on");
  const proceed = () => {
    step.pre?.();
    if (!step.target) return paint(step, null, st, lang);
    waitFor(step.target, (el) => paint(step, el, st, lang), () => paint(step, null, st, lang));
  };
  const readySel = step.ready || step.target;
  if (readySel) waitFor(readySel, () => proceed(), () => paint(step, null, st, lang));
  else proceed();
}

function paint(step: Step, el: HTMLElement | null, st: State, lang: Lang) {
  const root = document.getElementById("tour-root");
  if (!root) return;
  const ui = L[lang];
  const steps = getSteps(st.variant);
  const isFirst = st.step === 0;
  const isLast = st.step === steps.length - 1;
  const total = steps.length;

  if (el) {
    el.querySelectorAll<HTMLElement>(".reveal").forEach((r) => r.classList.add("is-in"));
    el.classList.add("is-in");
  }

  const dots = steps.map((_, i) => {
    const cls = i === st.step ? "tourx__dot tourx__dot--now" : i < st.step ? "tourx__dot tourx__dot--done" : "tourx__dot";
    return `<button class="${cls}" data-goto="${i}" aria-label="${i + 1}"></button>`;
  }).join("");

  root.innerHTML = `
    <div class="tourx-dim ${el ? "tourx-dim--clear" : "tourx-dim--solid"}"></div>
    ${el ? '<div class="tourx-ring" id="tourx-ring"></div>' : ""}
    <div class="tourx" id="tourx-card" role="dialog" aria-modal="true" aria-label="${esc(step.title[lang])}">
      <div class="tourx__top">
        <span class="tourx__kicker">${esc(step.kicker[lang])}</span>
        <button class="tourx__close" id="tourx-close" aria-label="${ui.skip}">✕</button>
      </div>
      <h3 class="tourx__title">${esc(step.title[lang])}</h3>
      <p class="tourx__body">${esc(step.body[lang])}</p>
      <div class="tourx__progress" role="group" aria-label="${st.step + 1} ${ui.of} ${total}">${dots}</div>
      <div class="tourx__foot">
        <button class="tourx__skip" id="tourx-skip">${ui.skip}</button>
        <div class="tourx__btns">
          ${isFirst ? "" : `<button class="tourx__btn tourx__btn--ghost" id="tourx-prev">${ui.prev}</button>`}
          <button class="tourx__btn tourx__btn--primary" id="tourx-next">${isLast ? (step.cta ? esc(step.cta[lang]) : ui.finish + " ✓") : ui.next + " →"}</button>
        </div>
      </div>
    </div>`;

  currentEl = el;
  if (el) { scrollSmart(el); repositionRing(el); }

  root.querySelector("#tourx-next")!.addEventListener("click", () => goTo(st.step + 1));
  root.querySelector("#tourx-prev")?.addEventListener("click", () => goTo(st.step - 1));
  root.querySelector("#tourx-skip")!.addEventListener("click", endTour);
  root.querySelector("#tourx-close")!.addEventListener("click", endTour);
  root.querySelectorAll<HTMLElement>(".tourx__dot").forEach((d) =>
    d.addEventListener("click", () => goTo(Number(d.dataset.goto)))
  );
}

// Desplaza la página para dejar el elemento en el área visible POR ENCIMA del panel.
function scrollSmart(el: HTMLElement) {
  const card = document.getElementById("tourx-card");
  const reserved = (card?.offsetHeight || 220) + 56;
  const navOff = 90;
  const vh = window.innerHeight;
  const availH = Math.max(120, vh - navOff - reserved);
  const r = el.getBoundingClientRect();
  const absTop = r.top + window.scrollY;
  const to = r.height >= availH ? absTop - navOff : absTop - navOff - (availH - r.height) / 2;
  window.scrollTo({ top: Math.max(0, to), behavior: "instant" as ScrollBehavior });
  repositionRing(el);
}

function repositionRing(el: HTMLElement) {
  const ring = document.getElementById("tourx-ring");
  if (!ring) return;
  const card = document.getElementById("tourx-card");
  const cardTop = card ? card.getBoundingClientRect().top : window.innerHeight;
  const pad = 6;
  const r = el.getBoundingClientRect();
  // El anillo nunca pasa por debajo del panel: para elementos altos muestra su
  // parte superior y termina limpio por encima del narrador.
  const top = Math.max(8, r.top - pad);
  let bottom = Math.min(r.bottom + pad, cardTop - 14);
  if (bottom < top + 36) bottom = top + 36;
  ring.style.top = `${top}px`;
  ring.style.left = `${r.left - pad}px`;
  ring.style.width = `${r.width + pad * 2}px`;
  ring.style.height = `${bottom - top}px`;
}

export function initTour() {
  const launch = document.getElementById("tour-launch");
  if (launch && !launch.dataset.bound) { launch.dataset.bound = "1"; launch.addEventListener("click", () => startTour("general")); }
  const tp = new URLSearchParams(location.search).get("tour");
  if (tp) {
    history.replaceState(null, "", location.pathname + location.hash);
    startTour(tp === "fundadores" || tp === "founders" || tp === "refundadores" ? "founders" : "general");
    return;
  }
  if (read().active) showStep();
}

// reposición del anillo ante scroll/resize mientras hay un paso con elemento
let bound = false;
(function bindReflow() {
  if (bound) return;
  bound = true;
  const h = () => { if (currentEl) repositionRing(currentEl); };
  window.addEventListener("scroll", h, { passive: true });
  window.addEventListener("resize", h);
})();

function esc(s: string) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!)); }
