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

interface State { active: boolean; step: number; lang: Lang }
const read = (): State => { try { return JSON.parse(localStorage.getItem(KEY) || "null") || { active: false, step: 0, lang: "es" }; } catch { return { active: false, step: 0, lang: "es" }; } };
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

export function startTour() {
  write({ active: true, step: 0, lang: detectLang() });
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
  if (i >= STEPS.length) return endTour();
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
  const step = STEPS[st.step];
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
  const isFirst = st.step === 0;
  const isLast = st.step === STEPS.length - 1;
  const total = STEPS.length;

  if (el) {
    el.querySelectorAll<HTMLElement>(".reveal").forEach((r) => r.classList.add("is-in"));
    el.classList.add("is-in");
  }

  const dots = STEPS.map((_, i) => {
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
          <button class="tourx__btn tourx__btn--primary" id="tourx-next">${isLast ? ui.finish + " ✓" : ui.next + " →"}</button>
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
  if (launch && !launch.dataset.bound) { launch.dataset.bound = "1"; launch.addEventListener("click", startTour); }
  const params = new URLSearchParams(location.search);
  if (params.get("tour") === "1") {
    history.replaceState(null, "", location.pathname + location.hash);
    startTour();
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
