// ─────────────────────────────────────────────────────────────────────────────
//  DATOS DE DEMOSTRACIÓN · El Club del 1+
//  Fuente única para el portal de socios, el panel admin y el módulo de comunidad.
//  NADA aquí es real salvo las frases públicas de las 4 beneficiarias (ya con
//  consentimiento, publicadas en /beneficiarias). Toda cifra de financiación,
//  socio, círculo, referido o transacción es FICTICIA, solo para el demo.
// ─────────────────────────────────────────────────────────────────────────────

export type Lang = "es" | "en";
export interface I18n { es: string; en: string }
export const tr = (v: I18n, lang: Lang) => v[lang];

/** Fecha "de hoy" para el demo (determinista, evita depender del reloj). */
export const AS_OF = "2026-06-28";

/** Economía del modelo (pesos COP). */
export const FUNDING_TARGET = 600_000; // costo BRUTO mensual para financiar a una madre
export const NET_TO_MOTHER = 400_000; // ~65% que recibe la madre (el 35% sostiene la fundación)
export const PROGRAM_SHARE = 0.65;
export const CURRENCY = "COP";

// ── Niveles (tiers) ──────────────────────────────────────────────────────────
export type TierKey = "amigo" | "aliado" | "mecenas" | "madrina";
export type Symbol = "plus" | "rise" | "spark" | "ring";

export const TIERS: Record<
  TierKey,
  { amountCop: number; symbol: Symbol; accent: "green" | "coral" | "marigold" | "ink"; label: I18n; note: I18n }
> = {
  amigo: { amountCop: 20_000, symbol: "plus", accent: "green", label: { es: "Amigo", en: "Friend" }, note: { es: "Tu + se suma al de cientos", en: "Your + joins hundreds" } },
  aliado: { amountCop: 60_000, symbol: "rise", accent: "coral", label: { es: "Aliado", en: "Ally" }, note: { es: "10 aliados, una madre", en: "10 allies, one mother" } },
  mecenas: { amountCop: 150_000, symbol: "spark", accent: "marigold", label: { es: "Mecenas", en: "Patron" }, note: { es: "Cuatro mecenas, una madre", en: "Four patrons, one mother" } },
  madrina: { amountCop: 600_000, symbol: "ring", accent: "ink", label: { es: "Madrina / Padrino", en: "Godmother / Godfather" }, note: { es: "Una madre, completa", en: "One mother, in full" } },
};

export const tierLabel = (k: TierKey, lang: Lang) => tr(TIERS[k].label, lang);

// ── Beneficiarias (madres) ─────────────────────────────────────────────────────
export type BenStatus = "in_formation" | "funded" | "active" | "graduated";

export interface Beneficiary {
  id: string;
  name: string;
  photo?: string; // ruta bajo /public (sin base)
  location: string;
  age?: number;
  kids?: number;
  real: boolean; // true = testimonio público real; false = ficticia para el demo
  quote: I18n;
  bio: I18n;
  status: BenStatus;
  targetCop: number; // siempre FUNDING_TARGET
  joinedProgram: string; // ISO
}

export const BENEFICIARIES: Beneficiary[] = [
  {
    id: "yuri",
    name: "Yuri Milena Cruz Guerra",
    photo: "/stories/yuri.jpg",
    location: "Medellín, Colombia",
    age: 34,
    kids: 2,
    real: true,
    quote: { es: "Estamos agradecidos y enormemente bendecidos por el apoyo: económico, de aprendizaje y emocional.", en: "We are grateful and enormously blessed by the support — financial, in learning, and emotional." },
    bio: { es: "Madre cabeza de familia. Con tu aporte recibe una renta básica mensual y el acompañamiento del Club.", en: "Female head of household. With your contribution she receives a monthly basic income and the Club's support." },
    status: "active",
    targetCop: FUNDING_TARGET,
    joinedProgram: "2026-01-15",
  },
  {
    id: "sandra",
    name: "Sandra Lucía Palacio Montoya",
    photo: "/stories/sandra.jpg",
    location: "Medellín, Colombia",
    age: 41,
    kids: 3,
    real: true,
    quote: { es: "Gracias a tu ayuda puedo sentirme acompañada y escuchada. Veo que no estamos solos en este camino tan difícil.", en: "Thanks to your help I feel accompanied and heard. I see that we are not alone on this difficult road." },
    bio: { es: "Madre cabeza de familia. Su círculo de socios financia su renta básica y su proceso de formación.", en: "Female head of household. Her circle of members funds her basic income and her training process." },
    status: "active",
    targetCop: FUNDING_TARGET,
    joinedProgram: "2026-01-20",
  },
  {
    id: "juliana",
    name: "Juliana Marcela Mosquera Vargas",
    photo: "/stories/juliana.jpg",
    location: "Medellín, Colombia",
    age: 29,
    kids: 2,
    real: true,
    quote: { es: "Gracias por ese aporte tan grande que hacen con cada uno de nosotros. Realmente es algo que nos cambia la vida.", en: "Thank you for such a big contribution to each of us. It truly changes our lives." },
    bio: { es: "Madre cabeza de familia. Cuatro mecenas completan, entre todos, su renta básica mensual.", en: "Female head of household. Four patrons together complete her monthly basic income." },
    status: "active",
    targetCop: FUNDING_TARGET,
    joinedProgram: "2026-02-10",
  },
  {
    id: "deyis",
    name: "Deyis Aidec Ruiz Beleño",
    photo: "/stories/deyis.jpg",
    location: "Medellín, Colombia",
    age: 37,
    kids: 1,
    real: true,
    quote: { es: "El pobre es pobre por falta de oportunidades; cuando llegan, hay que saber aprovecharlas para salir adelante.", en: "Poverty comes from a lack of opportunities; when they arrive, you have to seize them to get ahead." },
    bio: { es: "Madre cabeza de familia. Su círculo está en formación: aún faltan socios para completar su renta.", en: "Female head of household. Her circle is still forming: more members are needed to complete her income." },
    status: "in_formation",
    targetCop: FUNDING_TARGET,
    joinedProgram: "2026-05-30",
  },
  // ── Ficticias (solo para llenar el demo de matching/admin) ──
  {
    id: "luz",
    name: "Luz Marina (demo)",
    location: "Moravia, Medellín",
    age: 45,
    kids: 2,
    real: false,
    quote: { es: "Beneficiaria de ejemplo para la demostración del modelo.", en: "Sample beneficiary for the model demonstration." },
    bio: { es: "Registro de demostración. Su círculo está en formación.", en: "Demonstration record. Her circle is forming." },
    status: "in_formation",
    targetCop: FUNDING_TARGET,
    joinedProgram: "2026-06-05",
  },
  {
    id: "rosa",
    name: "Rosa Elena (demo)",
    location: "Moravia, Medellín",
    age: 52,
    kids: 1,
    real: false,
    quote: { es: "Beneficiaria de ejemplo para la demostración del modelo.", en: "Sample beneficiary for the model demonstration." },
    bio: { es: "Registro de demostración. Apadrinada 1:1 por un socio Madrina.", en: "Demonstration record. Sponsored 1:1 by a Godmother member." },
    status: "active",
    targetCop: FUNDING_TARGET,
    joinedProgram: "2026-03-12",
  },
];

export const getBeneficiary = (id: string) => BENEFICIARIES.find((b) => b.id === id);

// ── Socios / personas conmutables del demo ─────────────────────────────────────
export interface Member {
  id: string;
  name: string;
  email: string;
  tierKey: TierKey;
  amountCop: number;
  frequency: "monthly" | "one-time";
  joinedAt: string; // ISO
  referralCode: string;
  referredBy?: string; // memberId
  fundsBeneficiaryId: string; // madre que financia (vía su círculo)
  ambassador?: boolean;
}

export const MEMBERS: Member[] = [
  {
    id: "daniela",
    name: "Daniela Restrepo",
    email: "daniela@demo.club",
    tierKey: "madrina",
    amountCop: TIERS.madrina.amountCop,
    frequency: "monthly",
    joinedAt: "2026-01-12",
    referralCode: "DANIELA",
    fundsBeneficiaryId: "yuri",
    ambassador: true,
  },
  {
    id: "andres",
    name: "Andrés Mejía",
    email: "andres@demo.club",
    tierKey: "aliado",
    amountCop: TIERS.aliado.amountCop,
    frequency: "monthly",
    joinedAt: "2026-02-03",
    referralCode: "ANDRES",
    referredBy: "daniela",
    fundsBeneficiaryId: "sandra",
  },
  {
    id: "camila",
    name: "Camila Soto",
    email: "camila@demo.club",
    tierKey: "mecenas",
    amountCop: TIERS.mecenas.amountCop,
    frequency: "monthly",
    joinedAt: "2026-02-18",
    referralCode: "CAMILA",
    referredBy: "daniela",
    fundsBeneficiaryId: "juliana",
  },
  {
    id: "julian",
    name: "Julián Vélez",
    email: "julian@demo.club",
    tierKey: "amigo",
    amountCop: TIERS.amigo.amountCop,
    frequency: "monthly",
    joinedAt: "2026-06-20",
    referralCode: "JULIAN",
    referredBy: "andres",
    fundsBeneficiaryId: "deyis",
  },
];

export const getMember = (id: string) => MEMBERS.find((m) => m.id === id);
export const DEFAULT_MEMBER_ID = "daniela";

// ── Círculos (uno por madre) ───────────────────────────────────────────────────
// Un socio Madrina financia 1:1 (sole). Aportes menores co-financian (shared).
export interface CircleEntry {
  memberId?: string; // si es una de las personas conmutables
  name: string; // visible (iniciales si es anónimo)
  tierKey: TierKey;
  amountCop: number;
  anonymous: boolean;
}
export interface Circle {
  beneficiaryId: string;
  type: "sole" | "shared";
  targetCop: number;
  entries: CircleEntry[];
}

// Generador de co-financiadores anónimos para los círculos compartidos.
const anon = (initials: string, tierKey: TierKey): CircleEntry => ({
  name: initials,
  tierKey,
  amountCop: TIERS[tierKey].amountCop,
  anonymous: true,
});

export const CIRCLES: Circle[] = [
  // Yuri — apadrinada 1:1 por Daniela (Madrina) → 100%
  {
    beneficiaryId: "yuri",
    type: "sole",
    targetCop: FUNDING_TARGET,
    entries: [{ memberId: "daniela", name: "Daniela Restrepo", tierKey: "madrina", amountCop: TIERS.madrina.amountCop, anonymous: false }],
  },
  // Sandra — círculo de 10 Aliados (Andrés + 9 anónimos) → 100%
  {
    beneficiaryId: "sandra",
    type: "shared",
    targetCop: FUNDING_TARGET,
    entries: [
      { memberId: "andres", name: "Andrés Mejía", tierKey: "aliado", amountCop: TIERS.aliado.amountCop, anonymous: false },
      anon("M. G.", "aliado"), anon("J. R.", "aliado"), anon("P. C.", "aliado"), anon("S. D.", "aliado"),
      anon("L. V.", "aliado"), anon("F. A.", "aliado"), anon("N. T.", "aliado"), anon("R. M.", "aliado"), anon("C. P.", "aliado"),
    ],
  },
  // Juliana — 4 Mecenas (Camila + 3 anónimos) → 100%
  {
    beneficiaryId: "juliana",
    type: "shared",
    targetCop: FUNDING_TARGET,
    entries: [
      { memberId: "camila", name: "Camila Soto", tierKey: "mecenas", amountCop: TIERS.mecenas.amountCop, anonymous: false },
      anon("D. O.", "mecenas"), anon("V. H.", "mecenas"), anon("G. B.", "mecenas"),
    ],
  },
  // Deyis — en formación: Julián (Amigo) + algunos más → ~63%
  {
    beneficiaryId: "deyis",
    type: "shared",
    targetCop: FUNDING_TARGET,
    entries: [
      { memberId: "julian", name: "Julián Vélez", tierKey: "amigo", amountCop: TIERS.amigo.amountCop, anonymous: false },
      anon("A. L.", "mecenas"), anon("T. R.", "mecenas"), anon("E. S.", "aliado"),
      anon("B. C.", "aliado"), anon("H. M.", "amigo"), anon("K. P.", "amigo"),
    ],
  },
  // Luz — en formación temprana → ~40%
  {
    beneficiaryId: "luz",
    type: "shared",
    targetCop: FUNDING_TARGET,
    entries: [anon("W. D.", "mecenas"), anon("Q. F.", "aliado"), anon("Z. T.", "aliado"), anon("Y. N.", "amigo")],
  },
  // Rosa — apadrinada 1:1 (demo) → 100%
  {
    beneficiaryId: "rosa",
    type: "sole",
    targetCop: FUNDING_TARGET,
    entries: [anon("Socio Madrina", "madrina")],
  },
];

export const getCircle = (beneficiaryId: string) => CIRCLES.find((c) => c.beneficiaryId === beneficiaryId);
export const committedCop = (c: Circle) => c.entries.reduce((s, e) => s + e.amountCop, 0);
export const pctFunded = (c: Circle) => Math.min(100, Math.round((committedCop(c) / c.targetCop) * 100));

// ── Red de referidos (para el grafo personal y el público anonimizado) ──────────
// depth 0 = el socio raíz; converted=false = invitado que aún no se hace socio.
export interface RefNode {
  id: string;
  parentId?: string;
  label: string; // nombre o iniciales
  tierKey?: TierKey;
  converted: boolean;
  depth: number;
}

// Red de Daniela (embajadora): 8 invitados directos, varios multinivel.
export const REFERRAL_NETWORK: RefNode[] = [
  { id: "daniela", label: "Daniela Restrepo", tierKey: "madrina", converted: true, depth: 0 },
  // nivel 1 (directos de Daniela)
  { id: "andres", parentId: "daniela", label: "Andrés Mejía", tierKey: "aliado", converted: true, depth: 1 },
  { id: "camila", parentId: "daniela", label: "Camila Soto", tierKey: "mecenas", converted: true, depth: 1 },
  { id: "r-mar", parentId: "daniela", label: "M. A.", tierKey: "amigo", converted: true, depth: 1 },
  { id: "r-lau", parentId: "daniela", label: "L. P.", tierKey: "aliado", converted: true, depth: 1 },
  { id: "r-ser", parentId: "daniela", label: "S. G.", converted: false, depth: 1 },
  { id: "r-val", parentId: "daniela", label: "V. R.", converted: false, depth: 1 },
  { id: "r-nic", parentId: "daniela", label: "N. C.", tierKey: "amigo", converted: true, depth: 1 },
  { id: "r-fel", parentId: "daniela", label: "F. T.", converted: false, depth: 1 },
  // nivel 2 (de Andrés)
  { id: "julian", parentId: "andres", label: "Julián Vélez", tierKey: "amigo", converted: true, depth: 2 },
  { id: "r-die", parentId: "andres", label: "D. M.", tierKey: "aliado", converted: true, depth: 2 },
  // nivel 2 (de Camila)
  { id: "r-pau", parentId: "camila", label: "P. H.", tierKey: "amigo", converted: true, depth: 2 },
  // nivel 3 (de Julián)
  { id: "r-tom", parentId: "julian", label: "T. V.", converted: false, depth: 3 },
];

export const directReferrals = (memberId: string) => REFERRAL_NETWORK.filter((n) => n.parentId === memberId);
export const convertedCount = (rootId: string) => {
  // cuenta todos los descendientes convertidos del nodo raíz
  let total = 0;
  const walk = (id: string) => {
    for (const n of REFERRAL_NETWORK.filter((x) => x.parentId === id)) {
      if (n.converted) total++;
      walk(n.id);
    }
  };
  walk(rootId);
  return total;
};

// ── Estadísticas públicas (agregadas / anonimizadas) ────────────────────────────
export const PUBLIC_STATS = {
  members: 214,
  mothersActive: 12,
  mothersInFormation: 5,
  transferredCop: 86_400_000, // acumulado a las madres
  committedMonthlyCop: 9_180_000, // comprometido recurrente / mes
  pilotCity: "Medellín",
  // crecimiento mensual de socios (para el sparkline del contador público)
  growth: [28, 41, 63, 92, 120, 156, 188, 214],
};

// ── Utilidades de formato ───────────────────────────────────────────────────────
export function formatCop(n: number, lang: Lang): string {
  const loc = lang === "es" ? "es-CO" : "en-US";
  return "$" + n.toLocaleString(loc);
}

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(lang === "es" ? "es-CO" : "en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Lista de transacciones mensuales de un socio desde su ingreso hasta AS_OF. */
export interface Txn { date: string; amountCop: number; status: "approved"; ref: string }
export function monthlyTxns(m: Member): Txn[] {
  const start = new Date(m.joinedAt + "T00:00:00");
  const end = new Date(AS_OF + "T00:00:00");
  const out: Txn[] = [];
  const d = new Date(start);
  let i = 1;
  while (d <= end) {
    const iso = d.toISOString().slice(0, 10);
    out.push({ date: iso, amountCop: m.amountCop, status: "approved", ref: `C1P-${m.referralCode}-${String(i).padStart(3, "0")}` });
    d.setMonth(d.getMonth() + 1);
    i++;
  }
  return out.reverse(); // más reciente primero
}
