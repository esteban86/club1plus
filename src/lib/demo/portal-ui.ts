// ─────────────────────────────────────────────────────────────────────────────
//  Lógica del portal de socios (demo, lado cliente). La importan las páginas
//  ES y EN de /ingresar y /mi-espacio para no duplicar nada. Renderiza desde los
//  datos mock (./data) y la sesión en localStorage (./session).
// ─────────────────────────────────────────────────────────────────────────────
import { ROUTES, type RouteKey } from "../../i18n/routes";
import * as D from "./data";
import * as S from "./session";

type Lang = "es" | "en";
const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const route = (key: RouteKey, lang: Lang) => base + ROUTES[key][lang];
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const firstName = (n: string) => n.split(" ")[0];
const monthsAsMember = (joined: string) => {
  const a = new Date(joined + "T00:00:00"), b = new Date(D.AS_OF + "T00:00:00");
  return Math.max(1, (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1);
};

// ── Diccionario ────────────────────────────────────────────────────────────────
const L = {
  es: {
    title: "Mi espacio", sub: "Entra a tu espacio de socio. Es una demo: usa el enlace mágico simulado o entra como uno de nuestros socios de ejemplo.",
    emailPh: "tu@correo.com", magic: "Enviar enlace mágico", sentT: "Revisa tu correo ✉️", sentB: "Te enviamos un enlace mágico a", openLink: "Abrir enlace (demo)", or: "o entra como un socio de ejemplo",
    hello: "Hola,", switch: "Cambiar socio", logout: "Salir",
    tResumen: "Resumen", tMadre: "Tu madre", tAportes: "Aportes", tReferidos: "Referidos", tAjustes: "Ajustes",
    socioYear: "Socio · 2026", monthly: "Aporte mensual", since: "Socio desde",
    months: "Meses como socio", totalGiven: "Total aportado", funding: "Madre que financias",
    meet: "Conoce a la persona que financias →",
    consentKick: "Privacidad · Ley 1581", consentT: "Vas a ver los datos de una persona real",
    consentB: "Por respeto y con su consentimiento firmado, los datos de la madre que financias solo se muestran a quienes la apoyan. ¿Confirmas que quieres verlos?",
    consentBtn: "Sí, conocer a mi madre", revealKick: "La persona que financias", benefRole: "Beneficiaria",
    soleT: "La financias tú, completa", soleB: "Como Madrina/Padrino, tu aporte cubre el 100% de su renta básica mensual.",
    circleT: "Tu círculo", circleB: (n: number, name: string) => `${n} personas co-financian, entre todas, a ${name}.`,
    you: "Tú", funded: (p: number) => `${p}% financiada`, inFormation: "En formación",
    committedOf: (c: string, t: string) => `${c} de ${t} / mes`, withdraw: "Ocultar estos datos",
    aTitle: "Tus aportes", thDate: "Fecha", thRef: "Referencia", thAmount: "Monto", thStatus: "Estado", approved: "Aprobado",
    total: "Total aportado", reciboT: "Último recibo", recurring: "Aporte recurrente", fee: "Comisión", toMothers: "Para las madres (65%)", toFund: "Sostiene la fundación (35%)", deductible: "Deducible de impuestos",
    rTitle: "Invita y multiplica", rBody: "Comparte tu enlace. Cuando alguien se hace socio, aparece en tu red — incluso varios niveles abajo.",
    copy: "Copiar", copied: "¡Copiado!", invited: "Invitados", convertedL: "Se hicieron socios", netTitle: "Tu red de referidos",
    legMember: "Socio activo", legPending: "Invitado (pendiente)", noRefs: "Aún no has invitado a nadie. ¡Comparte tu enlace y empieza tu red!",
    sTitle: "Ajustes", pauseT: "Pausar mis aportes", pauseD: "Detén temporalmente tu aporte mensual. Puedes reactivarlo cuando quieras.",
    amountT: "Mi nivel de aporte", amountD: "Cambia cuánto aportas cada mes.",
    consentST: "Ver los datos de la madre que financio", consentSD: "Controla si quieres ver la información de tu beneficiaria.",
    logoutT: "Cerrar sesión", logoutD: "Salir de esta cuenta de demostración.",
    pausedBadge: "Aportes en pausa", note: "Demo: estos ajustes son simulados. En producción se conectan a tu suscripción en Wompi y a tu perfil.",
    personaDesc: {
      daniela: "Madrina · apadrina a una madre completa (1:1) y trajo a 8 personas.",
      andres: "Aliado · co-financia a una madre dentro de un círculo de 10.",
      camila: "Mecenas · una de cuatro que, juntas, completan a una madre.",
      julian: "Amigo · recién ingresó; su círculo aún está en formación.",
    } as Record<string, string>,
  },
  en: {
    title: "My space", sub: "Enter your member space. This is a demo: use the simulated magic link or enter as one of our sample members.",
    emailPh: "you@email.com", magic: "Send magic link", sentT: "Check your email ✉️", sentB: "We sent a magic link to", openLink: "Open link (demo)", or: "or enter as a sample member",
    hello: "Hi,", switch: "Switch member", logout: "Log out",
    tResumen: "Overview", tMadre: "Your mother", tAportes: "Contributions", tReferidos: "Referrals", tAjustes: "Settings",
    socioYear: "Member · 2026", monthly: "Monthly contribution", since: "Member since",
    months: "Months as member", totalGiven: "Total contributed", funding: "Mother you fund",
    meet: "Meet the person you fund →",
    consentKick: "Privacy · Law 1581", consentT: "You're about to see a real person's data",
    consentB: "Out of respect and with her signed consent, the data of the mother you fund is shown only to those who support her. Confirm you want to see it?",
    consentBtn: "Yes, meet my mother", revealKick: "The person you fund", benefRole: "Beneficiary",
    soleT: "You fund her, in full", soleB: "As a Godmother/Godfather, your contribution covers 100% of her monthly basic income.",
    circleT: "Your circle", circleB: (n: number, name: string) => `${n} people together co-fund ${name}.`,
    you: "You", funded: (p: number) => `${p}% funded`, inFormation: "Forming",
    committedOf: (c: string, t: string) => `${c} of ${t} / mo`, withdraw: "Hide this data",
    aTitle: "Your contributions", thDate: "Date", thRef: "Reference", thAmount: "Amount", thStatus: "Status", approved: "Approved",
    total: "Total contributed", reciboT: "Latest receipt", recurring: "Recurring contribution", fee: "Fee", toMothers: "To the mothers (65%)", toFund: "Sustains the foundation (35%)", deductible: "Tax-deductible",
    rTitle: "Invite and multiply", rBody: "Share your link. When someone becomes a member, they appear in your network — even several levels down.",
    copy: "Copy", copied: "Copied!", invited: "Invited", convertedL: "Became members", netTitle: "Your referral network",
    legMember: "Active member", legPending: "Invited (pending)", noRefs: "You haven't invited anyone yet. Share your link and start your network!",
    sTitle: "Settings", pauseT: "Pause my contributions", pauseD: "Temporarily stop your monthly contribution. You can resume any time.",
    amountT: "My contribution tier", amountD: "Change how much you give each month.",
    consentST: "See the data of the mother I fund", consentSD: "Control whether you want to see your beneficiary's information.",
    logoutT: "Log out", logoutD: "Leave this demonstration account.",
    pausedBadge: "Contributions paused", note: "Demo: these settings are simulated. In production they connect to your Wompi subscription and profile.",
    personaDesc: {
      daniela: "Godmother · sponsors a full mother (1:1) and brought in 8 people.",
      andres: "Ally · co-funds a mother within a circle of 10.",
      camila: "Patron · one of four who, together, complete a mother.",
      julian: "Friend · just joined; her circle is still forming.",
    } as Record<string, string>,
  },
} as const;

// ── LOGIN / lanzador de demo ────────────────────────────────────────────────────
export function initLogin() {
  const root = document.getElementById("login");
  if (!root) return;
  const lang = (root.dataset.lang as Lang) || "es";
  const t = L[lang];

  const personas = D.MEMBERS.map(
    (m) => `
    <button class="lg-persona" data-member="${m.id}">
      <span class="lg-persona__tier">${esc(D.tierLabel(m.tierKey, lang))} · ${D.formatCop(m.amountCop, lang)}/mes</span>
      <span class="lg-persona__name">${esc(m.name)}</span>
      <span class="lg-persona__desc">${esc(t.personaDesc[m.id] ?? "")}</span>
    </button>`
  ).join("");

  root.innerHTML = `
    <div class="lg-magic" id="lg-magic">
      <form id="lg-form" novalidate>
        <input type="email" id="lg-email" placeholder="${t.emailPh}" autocomplete="email" required />
        <button class="btn btn--primary btn--md" type="submit">${t.magic}</button>
      </form>
    </div>
    <p class="lg-or">${t.or}</p>
    <div class="lg-personas">${personas}</div>`;

  const form = root.querySelector<HTMLFormElement>("#lg-form")!;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = root.querySelector<HTMLInputElement>("#lg-email")!.value.trim() || t.emailPh;
    const box = root.querySelector<HTMLElement>("#lg-magic")!;
    box.innerHTML = `
      <div class="lg-sent">
        <p class="pf-h">${t.sentT}</p>
        <p class="pf-muted">${t.sentB} <b>${esc(email)}</b>.</p>
        <div class="pf-spacer"></div>
        <button class="btn btn--primary btn--md" id="lg-open">${t.openLink}</button>
      </div>`;
    box.querySelector("#lg-open")!.addEventListener("click", () => enter(D.DEFAULT_MEMBER_ID, lang));
  });

  root.querySelectorAll<HTMLElement>(".lg-persona").forEach((b) =>
    b.addEventListener("click", () => enter(b.dataset.member!, lang))
  );
}

function enter(memberId: string, lang: Lang) {
  S.setMemberId(memberId);
  location.assign(route("miEspacio", lang));
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
export function initDashboard() {
  const rootEl = document.getElementById("portal");
  if (!rootEl) return;
  const root: HTMLElement = rootEl; // tipo no-nulo: el narrowing se conserva dentro de los closures
  const lang = (root.dataset.lang as Lang) || "es";
  const base0 = S.activeMember();
  if (!base0) { location.replace(route("ingresar", lang)); return; }

  const t = L[lang];
  let m: D.Member = { ...base0 };
  let activeTab = (location.hash.replace("#", "") || "resumen");
  const TABS = [
    { id: "resumen", label: t.tResumen },
    { id: "madre", label: t.tMadre },
    { id: "aportes", label: t.tAportes },
    { id: "referidos", label: t.tReferidos },
    { id: "ajustes", label: t.tAjustes },
  ];

  function paint() {
    const prefs = S.getPrefs();
    root.innerHTML = `
      <div class="pf-top">
        <div>
          <p class="pf-hello">${t.hello} ${esc(firstName(m.name))} <span aria-hidden="true">👋</span></p>
          ${prefs.paused ? `<span class="pf-chip pf-chip--marigold">${t.pausedBadge}</span>` : ""}
        </div>
        <div class="pf-top-actions">
          <a class="pf-switch" href="${route("ingresar", lang)}">${t.switch}</a>
          <button class="pf-logout" id="pf-logout">${t.logout}</button>
        </div>
      </div>
      <div class="pf-tabs" role="tablist">
        ${TABS.map((tab) => `<button class="pf-tab" role="tab" data-tab="${tab.id}" aria-selected="${tab.id === activeTab}">${tab.label}</button>`).join("")}
      </div>
      <div id="pf-body"></div>`;

    const body = root.querySelector<HTMLElement>("#pf-body")!;
    body.innerHTML = panelFor(activeTab);
    wirePanel(activeTab);

    root.querySelector("#pf-logout")!.addEventListener("click", () => { S.clearSession(); location.assign(route("ingresar", lang)); });
    root.querySelectorAll<HTMLElement>(".pf-tab").forEach((b) =>
      b.addEventListener("click", () => { activeTab = b.dataset.tab!; history.replaceState(null, "", "#" + activeTab); paint(); })
    );
  }

  function panelFor(tab: string): string {
    if (tab === "resumen") return overviewHTML();
    if (tab === "madre") return motherHTML();
    if (tab === "aportes") return contributionsHTML();
    if (tab === "referidos") return referralsHTML();
    if (tab === "ajustes") return settingsHTML();
    return "";
  }

  // ---- Resumen ----
  function overviewHTML() {
    const tier = D.TIERS[m.tierKey];
    const txns = D.monthlyTxns(m);
    const totalGiven = txns.reduce((s, x) => s + x.amountCop, 0);
    const ben = D.getBeneficiary(m.fundsBeneficiaryId);
    return `
    <div class="pf-grid pf-grid--2">
      <div class="pf-carnet">
        <div class="pf-carnet__top">
          <span class="pf-kick">${t.socioYear}</span>
          <img src="${base}/logo-badge-green.svg" alt="" />
        </div>
        <div class="pf-carnet__body">
          <span class="pf-chip pf-chip--${tier.accent}">${symbolSVG(tier.symbol)} ${esc(D.tierLabel(m.tierKey, lang))}</span>
          <div class="pf-carnet__name">${esc(m.name)}</div>
          <div class="pf-carnet__row">
            <div>
              <div class="pf-kick">${t.monthly}</div>
              <div class="pf-carnet__amount">${D.formatCop(m.amountCop, lang)}</div>
            </div>
            <div class="pf-carnet__since">${t.since}<br>${D.formatDate(m.joinedAt, lang)}</div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:18px;justify-content:center">
        <div class="pf-stats">
          <div class="pf-stat"><div class="pf-stat__n">${monthsAsMember(m.joinedAt)}</div><div class="pf-stat__l">${t.months}</div></div>
          <div class="pf-stat"><div class="pf-stat__n">${D.formatCop(totalGiven, lang)}</div><div class="pf-stat__l">${t.totalGiven}</div></div>
          <div class="pf-stat"><div class="pf-stat__n">${esc(ben ? firstName(ben.name) : "—")}</div><div class="pf-stat__l">${t.funding}</div></div>
        </div>
        <button class="btn btn--dark btn--md" id="pf-goto-madre" style="align-self:flex-start">${t.meet}</button>
      </div>
    </div>`;
  }

  // ---- Tu madre ----
  function motherHTML() {
    if (!S.hasConsented()) {
      return `
      <div class="pf-card pf-consent">
        ${sparkSVG(56)}
        <span class="pf-kick">${t.consentKick}</span>
        <h3 class="pf-h" style="font-size:24px">${t.consentT}</h3>
        <p class="pf-muted" style="font-size:15px">${t.consentB}</p>
        <button class="btn btn--primary btn--lg" id="pf-consent">${t.consentBtn}</button>
      </div>`;
    }
    const ben = D.getBeneficiary(m.fundsBeneficiaryId)!;
    const circle = D.getCircle(ben.id)!;
    const pct = D.pctFunded(circle);
    const committed = D.committedCop(circle);
    const photo = ben.photo
      ? `<img src="${base}${ben.photo}" alt="${esc(ben.name)}" />`
      : `<span class="pf-poster__ph">${esc(ben.name.slice(0, 1))}</span>`;

    let circleBlock = "";
    if (circle.type === "sole") {
      circleBlock = `
        <h4 class="pf-h">${t.soleT}</h4>
        <p class="pf-muted">${t.soleB}</p>
        <div class="pf-spacer"></div>
        <div class="pf-bar"><div class="pf-bar__fill" style="width:100%"></div></div>
        <p class="pf-kick" style="margin-top:8px">100% · ${t.committedOf(D.formatCop(committed, lang), D.formatCop(circle.targetCop, lang))}</p>`;
    } else {
      const chips = circle.entries.map((e) => {
        const you = e.memberId === m.id;
        const dot = D.TIERS[e.tierKey].accent;
        const dotColor = dot === "green" ? "#19C95E" : dot === "coral" ? "#FF6B4A" : dot === "marigold" ? "#FFC23D" : "#0C1A13";
        return `<span class="pf-cofunder${you ? " pf-cofunder--you" : ""}"><span class="pf-cofunder__dot" style="background:${dotColor}"></span>${you ? t.you : esc(e.name)}</span>`;
      }).join("");
      const warm = ben.status === "in_formation" ? " pf-bar__fill--warm" : "";
      circleBlock = `
        <h4 class="pf-h">${t.circleT}</h4>
        <p class="pf-muted">${esc(t.circleB(circle.entries.length, firstName(ben.name)))}</p>
        <div class="pf-circle-chips">${chips}</div>
        <div class="pf-spacer"></div>
        <div class="pf-bar"><div class="pf-bar__fill${warm}" style="width:${pct}%"></div></div>
        <p class="pf-kick" style="margin-top:8px">${ben.status === "in_formation" ? t.inFormation + " · " : ""}${t.funded(pct)} · ${t.committedOf(D.formatCop(committed, lang), D.formatCop(circle.targetCop, lang))}</p>`;
    }

    return `
    <div class="pf-mother">
      <div class="pf-poster">
        <span class="pf-poster__photo">${photo}</span>
        <span class="pf-poster__meta">${t.revealKick}</span>
        <div class="pf-poster__name">${esc(ben.name)}</div>
        <p class="pf-muted">${esc(D.tr(ben.bio, lang))}</p>
        <span class="pf-poster__meta">${t.benefRole} · ${esc(ben.location)}</span>
      </div>
      <div class="pf-quote">
        ${plusSVG(28)}
        <p class="pf-quote__big">“${esc(D.tr(ben.quote, lang))}”</p>
      </div>
    </div>
    <div class="pf-card" style="margin-top:18px">${circleBlock}
      <div class="pf-spacer"></div>
      <button class="pf-switch" id="pf-withdraw">${t.withdraw}</button>
    </div>`;
  }

  // ---- Aportes ----
  function contributionsHTML() {
    const txns = D.monthlyTxns(m);
    const total = txns.reduce((s, x) => s + x.amountCop, 0);
    const rows = txns.map((x) => `
      <tr>
        <td class="pf-mono">${D.formatDate(x.date, lang)}</td>
        <td class="pf-mono">${x.ref}</td>
        <td><b>${D.formatCop(x.amountCop, lang)}</b></td>
        <td><span class="pf-ok">${t.approved}</span></td>
      </tr>`).join("");
    const toMothers = Math.round(m.amountCop * D.PROGRAM_SHARE);
    const toFund = m.amountCop - toMothers;
    return `
    <div class="pf-grid pf-grid--2">
      <div class="pf-card">
        <h3 class="pf-h">${t.aTitle}</h3>
        <div class="pf-table-scroll">
          <table class="pf-table">
            <thead><tr><th>${t.thDate}</th><th>${t.thRef}</th><th>${t.thAmount}</th><th>${t.thStatus}</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="pf-spacer"></div>
        <div class="pf-carnet__row" style="margin-top:0"><span class="pf-h" style="margin:0">${t.total}</span><span class="pf-carnet__amount">${D.formatCop(total, lang)}</span></div>
      </div>
      <div class="pf-card">
        <h3 class="pf-h">${t.reciboT}</h3>
        <div class="pf-spacer"></div>
        <div class="pf-setting" style="padding-top:0"><span>${t.recurring}</span><b>${D.formatCop(m.amountCop, lang)}</b></div>
        <div class="pf-setting"><span>${t.fee}</span><b>$0</b></div>
        <div class="pf-setting"><span>${t.toMothers}</span><b>${D.formatCop(toMothers, lang)}</b></div>
        <div class="pf-setting"><span>${t.toFund}</span><b>${D.formatCop(toFund, lang)}</b></div>
        <div class="pf-spacer"></div>
        <span class="pf-chip pf-chip--marigold">${t.deductible}</span>
      </div>
    </div>`;
  }

  // ---- Referidos ----
  function referralsHTML() {
    const link = `https://clubdel1.org/r/${m.referralCode}`;
    const directs = D.directReferrals(m.id);
    const converted = D.convertedCount(m.id);
    const graph = directs.length ? `
      <div class="pf-card" style="margin-top:18px">
        <h3 class="pf-h">${t.netTitle}</h3>
        <div class="pf-graph-scroll">${renderGraphSVG(m.id)}</div>
        <div class="pf-legend">
          <span><span class="swatch" style="background:#2BE06F"></span>${t.legMember}</span>
          <span><span class="swatch" style="background:#fff;border:2px solid #19C95E"></span>${t.legPending}</span>
        </div>
      </div>` : `<div class="pf-card" style="margin-top:18px"><p class="pf-muted">${t.noRefs}</p></div>`;
    return `
    <div class="pf-card">
      <h3 class="pf-h">${t.rTitle}</h3>
      <p class="pf-muted">${t.rBody}</p>
      <div class="pf-spacer"></div>
      <div class="pf-reflink">
        <input id="pf-reflink" readonly value="${link}" />
        <button class="btn btn--primary btn--md" id="pf-copy">${t.copy}</button>
      </div>
      <div class="pf-spacer"></div>
      <div class="pf-stats" style="grid-template-columns:repeat(2,1fr)">
        <div class="pf-stat"><div class="pf-stat__n">${directs.length}</div><div class="pf-stat__l">${t.invited}</div></div>
        <div class="pf-stat"><div class="pf-stat__n">${converted}</div><div class="pf-stat__l">${t.convertedL}</div></div>
      </div>
    </div>
    ${graph}`;
  }

  // ---- Ajustes ----
  function settingsHTML() {
    const prefs = S.getPrefs();
    const options = (Object.keys(D.TIERS) as D.TierKey[]).map(
      (k) => `<option value="${k}" ${k === m.tierKey ? "selected" : ""}>${esc(D.tierLabel(k, lang))} · ${D.formatCop(D.TIERS[k].amountCop, lang)}</option>`
    ).join("");
    return `
    <div class="pf-card">
      <h3 class="pf-h">${t.sTitle}</h3>
      <div class="pf-setting">
        <div><div class="pf-setting__t">${t.pauseT}</div><div class="pf-setting__d">${t.pauseD}</div></div>
        <button class="pf-toggle" id="pf-pause" aria-pressed="${prefs.paused}" aria-label="${t.pauseT}"></button>
      </div>
      <div class="pf-setting">
        <div><div class="pf-setting__t">${t.amountT}</div><div class="pf-setting__d">${t.amountD}</div></div>
        <select class="pf-select" id="pf-tier">${options}</select>
      </div>
      <div class="pf-setting">
        <div><div class="pf-setting__t">${t.consentST}</div><div class="pf-setting__d">${t.consentSD}</div></div>
        <button class="pf-toggle" id="pf-consent-toggle" aria-pressed="${S.hasConsented()}" aria-label="${t.consentST}"></button>
      </div>
      <div class="pf-setting">
        <div><div class="pf-setting__t">${t.logoutT}</div><div class="pf-setting__d">${t.logoutD}</div></div>
        <button class="pf-logout" id="pf-logout2">${t.logout}</button>
      </div>
      <p class="pf-note">${t.note}</p>
    </div>`;
  }

  // ---- Wiring por panel ----
  function wirePanel(tab: string) {
    if (tab === "resumen") {
      root.querySelector("#pf-goto-madre")?.addEventListener("click", () => { activeTab = "madre"; history.replaceState(null, "", "#madre"); paint(); });
    }
    if (tab === "madre") {
      root.querySelector("#pf-consent")?.addEventListener("click", () => { S.setConsent(true); paint(); });
      root.querySelector("#pf-withdraw")?.addEventListener("click", () => { S.setConsent(false); paint(); });
    }
    if (tab === "referidos") {
      const btn = root.querySelector<HTMLButtonElement>("#pf-copy");
      btn?.addEventListener("click", async () => {
        const input = root.querySelector<HTMLInputElement>("#pf-reflink")!;
        try { await navigator.clipboard.writeText(input.value); } catch { input.select(); }
        btn.textContent = t.copied; setTimeout(() => (btn.textContent = t.copy), 1600);
      });
    }
    if (tab === "ajustes") {
      const pause = root.querySelector<HTMLButtonElement>("#pf-pause");
      pause?.addEventListener("click", () => { const next = !(pause.getAttribute("aria-pressed") === "true"); S.setPrefs({ paused: next }); paint(); });
      const ct = root.querySelector<HTMLButtonElement>("#pf-consent-toggle");
      ct?.addEventListener("click", () => { S.setConsent(!(ct.getAttribute("aria-pressed") === "true")); paint(); });
      root.querySelector<HTMLSelectElement>("#pf-tier")?.addEventListener("change", (e) => {
        const k = (e.target as HTMLSelectElement).value as D.TierKey;
        m = { ...m, tierKey: k, amountCop: D.TIERS[k].amountCop };
        paint();
      });
      root.querySelector("#pf-logout2")?.addEventListener("click", () => { S.clearSession(); location.assign(route("ingresar", lang)); });
    }
  }

  paint();
}

// ── Grafo de referidos (SVG inline, layout tidy top-down) ────────────────────────
export function renderGraphSVG(rootId: string, anonymizeRoot = false): string {
  const root = D.REFERRAL_NETWORK.find((n) => n.id === rootId);
  if (!root) return "";
  const baseDepth = root.depth;
  const nodes: (D.RefNode & { rd: number })[] = [];
  const walk = (n: D.RefNode) => { nodes.push({ ...n, rd: n.depth - baseDepth }); D.REFERRAL_NETWORK.filter((c) => c.parentId === n.id).forEach(walk); };
  walk(root);
  const childrenOf = (id: string) => nodes.filter((n) => n.parentId === id);
  const pos: Record<string, { x: number; y: number }> = {};
  let leaf = 0;
  const assign = (n: { id: string; rd: number }) => {
    const kids = childrenOf(n.id);
    if (!kids.length) pos[n.id] = { x: leaf++, y: n.rd };
    else { kids.forEach(assign); const xs = kids.map((k) => pos[k.id].x); pos[n.id] = { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: n.rd }; }
  };
  assign({ id: root.id, rd: 0 });

  const colW = 84, rowH = 92, padX = 38, padY = 34, r = 17;
  const leaves = Math.max(1, leaf);
  const W = padX * 2 + (leaves - 1) * colW;
  const maxD = nodes.reduce((mx, n) => Math.max(mx, n.rd), 0);
  const H = padY * 2 + maxD * rowH;
  const px = (n: { id: string }) => padX + (leaves === 1 ? 0 : pos[n.id].x * colW) + (leaves === 1 ? W / 2 - padX : 0);
  const py = (n: { id: string }) => padY + pos[n.id].y * rowH;

  const edges = nodes.filter((n) => n.parentId && pos[n.parentId]).map((n) => {
    const p = nodes.find((x) => x.id === n.parentId)!;
    return `<line x1="${px(p).toFixed(1)}" y1="${py(p)}" x2="${px(n).toFixed(1)}" y2="${py(n)}" stroke="#C2CBBA" stroke-width="2" />`;
  }).join("");

  const circles = nodes.map((n) => {
    const x = px(n), y = py(n);
    const isRoot = n.id === rootId;
    const label = (anonymizeRoot && isRoot) ? "Tú" : (n.label.includes(".") ? n.label : firstName(n.label));
    const fill = n.converted ? "#2BE06F" : "#FFFFFF";
    const stroke = n.converted ? "#0C1A13" : "#19C95E";
    const dash = n.converted ? "" : ` stroke-dasharray="4 3"`;
    const rr = isRoot ? r + 4 : r;
    return `
      <g>
        <circle cx="${x.toFixed(1)}" cy="${y}" r="${rr}" fill="${fill}" stroke="${stroke}" stroke-width="${isRoot ? 3 : 2}"${dash} />
        <text x="${x.toFixed(1)}" y="${y + rr + 15}" text-anchor="middle" font-family="'Space Mono', monospace" font-size="11" fill="#0C1A13">${esc(label)}</text>
      </g>`;
  }).join("");

  return `<svg class="pf-graph" width="${W}" height="${H + 8}" viewBox="0 0 ${W} ${H + 8}" role="img" aria-label="referral network">${edges}${circles}</svg>`;
}

// ── Iconitos SVG inline (sin var() en atributos, seguro en Safari) ───────────────
function symbolSVG(sym: D.Symbol): string {
  const p = {
    plus: '<rect x="43.5" y="16" width="13" height="68" rx="5"/><rect x="16" y="43.5" width="68" height="13" rx="5"/>',
    rise: '<rect x="18" y="56" width="16" height="28" rx="5"/><rect x="42" y="40" width="16" height="44" rx="5"/><rect x="66" y="22" width="16" height="62" rx="5"/>',
    spark: '<path d="M50 8 C53.5 35 65 46.5 92 50 C65 53.5 53.5 65 50 92 C46.5 65 35 53.5 8 50 C35 46.5 46.5 35 50 8 Z"/>',
    ring: '<circle cx="50" cy="50" r="30"/>',
  }[sym];
  return `<svg width="12" height="12" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">${p}</svg>`;
}
function sparkSVG(size: number) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="#FFC23D" aria-hidden="true"><path d="M50 8 C53.5 35 65 46.5 92 50 C65 53.5 53.5 65 50 92 C46.5 65 35 53.5 8 50 C35 46.5 46.5 35 50 8 Z"/></svg>`;
}
function plusSVG(size: number) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="#F2502E" aria-hidden="true"><rect x="43.5" y="16" width="13" height="68" rx="5"/><rect x="16" y="43.5" width="68" height="13" rx="5"/></svg>`;
}
