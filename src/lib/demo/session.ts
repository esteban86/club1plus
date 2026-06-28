// Sesión de demostración (lado cliente). Recuerda qué "socio" está activo y un
// puñado de ajustes simulados. Todo vive en localStorage — no hay backend.
import { DEFAULT_MEMBER_ID, MEMBERS, type Member } from "./data";

const KEY_MEMBER = "c1p_demo_member";
const KEY_PREFS = "c1p_demo_prefs";
const KEY_CONSENT = "c1p_demo_consent";

export interface DemoPrefs {
  paused: boolean;
  consentWithdrawn: boolean;
}
const DEFAULT_PREFS: DemoPrefs = { paused: false, consentWithdrawn: false };

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

export function getMemberId(): string | null {
  if (!hasStorage()) return null;
  return window.localStorage.getItem(KEY_MEMBER);
}

export function setMemberId(id: string): void {
  if (!hasStorage()) return;
  window.localStorage.setItem(KEY_MEMBER, id);
}

export function clearSession(): void {
  if (!hasStorage()) return;
  window.localStorage.removeItem(KEY_MEMBER);
  window.localStorage.removeItem(KEY_PREFS);
  window.localStorage.removeItem(KEY_CONSENT);
}

/** Socio activo, o null si no hay sesión / id inválido. */
export function activeMember(): Member | null {
  const id = getMemberId();
  if (!id) return null;
  return MEMBERS.find((m) => m.id === id) ?? null;
}

/** Asegura una sesión: si no hay, entra como el socio por defecto. */
export function ensureMember(): Member {
  let m = activeMember();
  if (!m) {
    setMemberId(DEFAULT_MEMBER_ID);
    m = MEMBERS.find((x) => x.id === DEFAULT_MEMBER_ID)!;
  }
  return m;
}

export function getPrefs(): DemoPrefs {
  if (!hasStorage()) return { ...DEFAULT_PREFS };
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(window.localStorage.getItem(KEY_PREFS) || "{}") };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function setPrefs(patch: Partial<DemoPrefs>): DemoPrefs {
  const next = { ...getPrefs(), ...patch };
  if (hasStorage()) window.localStorage.setItem(KEY_PREFS, JSON.stringify(next));
  return next;
}

/** Consentimiento para ver los datos de la madre (interstitial de "Tu madre"). */
export function hasConsented(): boolean {
  if (!hasStorage()) return false;
  return window.localStorage.getItem(KEY_CONSENT) === "1";
}
export function setConsent(v: boolean): void {
  if (!hasStorage()) return;
  if (v) window.localStorage.setItem(KEY_CONSENT, "1");
  else window.localStorage.removeItem(KEY_CONSENT);
}
