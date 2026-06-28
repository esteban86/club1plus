// ─────────────────────────────────────────────────────────────────────────────
//  Recorrido guiado de onboarding (demo). Overlay tipo "spotlight" + tooltip que
//  ATRAVIESA todo el sitio: home → comunidad → portal → admin → donar. El estado
//  (activo, paso, idioma) vive en localStorage para reanudar tras cada navegación.
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
  target?: string;       // selector a iluminar; ausente = tarjeta centrada
  ready?: string;        // selector que indica que la página está lista (para esperar render JS)
  pre?: () => void;      // acción antes de mostrar (p. ej. abrir una pestaña)
  ensureDemoSession?: boolean;
  title: I18n;
  body: I18n;
}

const L = {
  es: { next: "Siguiente", prev: "Atrás", skip: "Saltar", finish: "Terminar ✓", launch: "Recorrido guiado" },
  en: { next: "Next", prev: "Back", skip: "Skip", finish: "Finish ✓", launch: "Guided tour" },
};

const STEPS: Step[] = [
  {
    route: "home",
    title: { es: "Te muestro el Club en 1 minuto", en: "Let me show you the Club in 1 minute" },
    body: { es: "Un recorrido rápido por todo: el modelo, la comunidad, el espacio de cada socio y el panel interno. Avanza con Siguiente.", en: "A quick walk through everything: the model, the community, each member's space and the internal panel. Use Next to advance." },
  },
  {
    route: "home", target: ".hero",
    title: { es: "La promesa", en: "The promise" },
    body: { es: "Amigos comprometidos suman un aporte mensual para dar una renta básica a madres cabeza de familia. Riqueza, no caridad.", en: "Committed friends add a monthly contribution to fund a basic income for female heads of household. Wealth, not charity." },
  },
  {
    route: "home", target: "[data-tour='problema']",
    title: { es: "El problema", en: "The problem" },
    body: { es: "1 de cada 3 personas en Colombia es pobre. No es falta de esfuerzo: es una trampa. Por eso quienes más tenemos podemos mover la balanza.", en: "1 in 3 people in Colombia is poor. It isn't lack of effort — it's a trap. That's why those of us with more can move the needle." },
  },
  {
    route: "home", target: "[data-tour='tiers']",
    title: { es: "Cómo te sumas", en: "How you join" },
    body: { es: "Eliges cuánto sumar cada mes. Diez aliados o cuatro mecenas financian a una madre; una madrina la apadrina completa.", en: "You choose how much to add each month. Ten allies or four patrons fund one mother; a godmother sponsors her in full." },
  },
  {
    route: "home", target: ".livec",
    title: { es: "La comunidad crece", en: "The community grows" },
    body: { es: "En vivo: cuántos somos, cuántas madres ya reciben renta y cuánto hemos transferido. Vamos a verla de cerca.", en: "Live: how many we are, how many mothers already receive income, and how much we've transferred. Let's look closer." },
  },
  {
    route: "comunidad", target: ".comm__graphcard", ready: ".comm__graphcard",
    title: { es: "Una red que se multiplica", en: "A network that multiplies" },
    body: { es: "Cada socio puede traer a otros. Así crece la red — varios niveles — siempre anonimizada en la vista pública.", en: "Every member can bring others in. The network grows several levels deep — always anonymized in the public view." },
  },
  {
    route: "miEspacio", target: ".pf-carnet", ready: ".pf-tabs", ensureDemoSession: true,
    title: { es: "El espacio de cada socio", en: "Each member's space" },
    body: { es: "Al donar, cada socio entra a Mi espacio: su carné, la madre que financia, sus aportes y su red de referidos.", en: "After donating, each member enters My space: their card, the mother they fund, their contributions and their referral network." },
  },
  {
    route: "miEspacio", target: ".pf-mother", ready: ".pf-tabs",
    pre: () => { try { localStorage.setItem("c1p_demo_consent", "1"); } catch {} document.querySelector<HTMLElement>(".pf-tab[data-tab='madre']")?.click(); },
    title: { es: "La persona que financias", en: "The person you fund" },
    body: { es: "Con su consentimiento, el socio conoce a su beneficiaria real: su historia y cuánto falta para completar su renta.", en: "With her consent, the member meets their real beneficiary: her story and how much is left to complete her income." },
  },
  {
    route: "miEspacio", target: ".pf-reflink", ready: ".pf-tabs",
    pre: () => { document.querySelector<HTMLElement>(".pf-tab[data-tab='referidos']")?.click(); },
    title: { es: "Invita y multiplica", en: "Invite and multiply" },
    body: { es: "Cada socio comparte su enlace y ve crecer su propia red — incluso varios niveles abajo.", en: "Each member shares their link and watches their own network grow — even several levels down." },
  },
  {
    route: "admin", target: "[data-panel='matching']", ready: ".pf-tab",
    pre: () => { document.querySelector<HTMLElement>(".pf-tab[data-tab='matching']")?.click(); },
    title: { es: "Para el equipo: el matching", en: "For the team: matching" },
    body: { es: "El panel interno muestra cómo se apilan los aportes para completar los $600.000/mes de cada madre, y el reparto 65/35.", en: "The internal panel shows how contributions stack up to complete each mother's $600,000/mo, and the 65/35 split." },
  },
  {
    route: "donar", target: "[data-tour='tiers']", ready: "[data-tour='tiers']",
    title: { es: "¿Listo para sumarte?", en: "Ready to join?" },
    body: { es: "Eso es todo. Tu + se convierte en la renta de una madre cabeza de familia. Elige tu aporte y súmate.", en: "That's it. Your + becomes the income of a female head of household. Pick your contribution and join." },
  },
];

interface State { active: boolean; step: number; lang: Lang }
const read = (): State => { try { return JSON.parse(localStorage.getItem(KEY) || "") || { active: false, step: 0, lang: "es" }; } catch { return { active: false, step: 0, lang: "es" }; } };
const write = (s: State) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} };
const clear = () => { try { localStorage.removeItem(KEY); } catch {} };

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
  clear();
  currentEl = null;
  document.getElementById("tour-root")!.innerHTML = "";
  document.body.classList.remove("tour-on");
}
function goTo(i: number) {
  const st = read();
  if (i >= STEPS.length) return endTour();
  if (i < 0) return;
  write({ ...st, step: i });
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
  // ¿estamos en la página correcta?
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
  if (el) {
    el.querySelectorAll<HTMLElement>(".reveal").forEach((r) => r.classList.add("is-in"));
    el.classList.add("is-in");
    el.scrollIntoView({ block: "center", inline: "nearest" });
  }
  root.innerHTML = `
    <div class="tour-blocker ${el ? "tour-blocker--clear" : "tour-blocker--dim"}"></div>
    ${el ? '<div class="tour-hole" id="tour-hole"></div>' : ""}
    <div class="tour-tip ${el ? "" : "tour-tip--center"}" id="tour-tip" role="dialog" aria-modal="true" aria-label="${esc(step.title[lang])}">
      <div class="tour-tip__bar"><span class="tour-tip__count">${st.step + 1} / ${STEPS.length}</span><button class="tour-tip__x" id="tour-skip" aria-label="${ui.skip}">✕</button></div>
      <h3 class="tour-tip__title">${esc(step.title[lang])}</h3>
      <p class="tour-tip__body">${esc(step.body[lang])}</p>
      <div class="tour-tip__actions">
        <button class="tour-tip__skip" id="tour-skip2">${ui.skip}</button>
        <div class="tour-tip__nav">
          ${isFirst ? "" : `<button class="btn btn--outline btn--sm" id="tour-prev">${ui.prev}</button>`}
          <button class="btn btn--primary btn--sm" id="tour-next">${isLast ? ui.finish : ui.next}</button>
        </div>
      </div>
    </div>`;

  currentEl = el;
  if (el) reposition();

  root.querySelector("#tour-next")!.addEventListener("click", () => goTo(st.step + 1));
  root.querySelector("#tour-prev")?.addEventListener("click", () => goTo(st.step - 1));
  root.querySelector("#tour-skip")!.addEventListener("click", endTour);
  root.querySelector("#tour-skip2")!.addEventListener("click", endTour);
}

function reposition() {
  const tip = document.getElementById("tour-tip");
  const hole = document.getElementById("tour-hole");
  if (!currentEl || !tip || !hole) return;
  const r = currentEl.getBoundingClientRect();
  const pad = 6;
  hole.style.top = `${r.top - pad}px`;
  hole.style.left = `${r.left - pad}px`;
  hole.style.width = `${r.width + pad * 2}px`;
  hole.style.height = `${r.height + pad * 2}px`;

  const vw = window.innerWidth, vh = window.innerHeight, gap = 14;
  if (vw < 600) {
    tip.style.left = "12px";
    tip.style.right = "12px";
    tip.style.width = "auto";
    tip.style.top = `${Math.max(12, vh - tip.offsetHeight - 16)}px`;
    return;
  }
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let top: number;
  if (r.bottom + gap + th < vh) top = r.bottom + gap;
  else if (r.top - gap - th > 0) top = r.top - gap - th;
  else top = Math.max(12, (vh - th) / 2);
  const left = Math.min(Math.max(12, r.left), vw - tw - 12);
  tip.style.top = `${top}px`;
  tip.style.left = `${left}px`;
  tip.style.right = "auto";
}

export function initTour() {
  // botón lanzador (guarda contra listeners duplicados en navegación SPA)
  const launch = document.getElementById("tour-launch");
  if (launch && !launch.dataset.bound) { launch.dataset.bound = "1"; launch.addEventListener("click", startTour); }
  // ?tour=1 inicia el recorrido (y limpia la URL)
  const params = new URLSearchParams(location.search);
  if (params.get("tour") === "1") {
    const url = location.pathname + location.hash;
    history.replaceState(null, "", url);
    startTour();
    return;
  }
  // reanudar si está activo
  if (read().active) showStep();
}

// reposición ante scroll/resize mientras hay un paso con elemento
let bound = false;
function bindReflow() {
  if (bound) return;
  bound = true;
  const h = () => { if (currentEl) reposition(); };
  window.addEventListener("scroll", h, { passive: true });
  window.addEventListener("resize", h);
}
bindReflow();

function esc(s: string) { return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!)); }
