import { sha256Hex, randomToken } from "./crypto";

const MAGIC_LINK_TTL_SECONDS = 15 * 60; // 15 min
const SESSION_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 días

export interface AuthIdentity {
  memberId: string | null;
  adminUserId: string | null;
}

function nowSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Genera y guarda un magic link SOLO si el correo pertenece a un socio o admin
 * ya existente — los socios se crean al pagar, vía webhook, nunca en el login.
 * Devuelve null si el correo no existe, para que el endpoint responda igual en
 * ambos casos (no revelar por timing/respuesta si un correo está registrado).
 */
export async function issueMagicLink(
  db: D1Database,
  email: string,
): Promise<{ rawToken: string; expiresAt: number } | null> {
  const normalized = email.trim().toLowerCase();
  const identity = await findIdentityByEmail(db, normalized);
  if (!identity) return null;

  const rawToken = randomToken();
  const tokenHash = await sha256Hex(rawToken);
  const created = nowSeconds();
  const expiresAt = created + MAGIC_LINK_TTL_SECONDS;

  await db
    .prepare("INSERT INTO magic_links (id, email, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(crypto.randomUUID(), normalized, tokenHash, expiresAt, created)
    .run();

  return { rawToken, expiresAt };
}

/** Consume un magic link de un solo uso y, si es válido, crea una sesión. */
export async function consumeMagicLink(db: D1Database, rawToken: string): Promise<string | null> {
  const tokenHash = await sha256Hex(rawToken);
  const now = nowSeconds();

  const link = await db
    .prepare("SELECT id, email, expires_at, used_at FROM magic_links WHERE token_hash = ?")
    .bind(tokenHash)
    .first<{ id: string; email: string; expires_at: number; used_at: number | null }>();

  if (!link || link.used_at !== null || link.expires_at < now) return null;

  await db.prepare("UPDATE magic_links SET used_at = ? WHERE id = ?").bind(now, link.id).run();

  // El socio/admin pudo borrarse entre la solicitud del link y el clic.
  const identity = await findIdentityByEmail(db, link.email);
  if (!identity) return null;

  return createSession(db, identity);
}

async function findIdentityByEmail(db: D1Database, normalizedEmail: string): Promise<AuthIdentity | null> {
  const member = await db
    .prepare("SELECT id FROM members WHERE email = ?")
    .bind(normalizedEmail)
    .first<{ id: string }>();
  if (member) return { memberId: member.id, adminUserId: null };

  const admin = await db
    .prepare("SELECT id FROM admin_users WHERE email = ?")
    .bind(normalizedEmail)
    .first<{ id: string }>();
  if (admin) return { memberId: null, adminUserId: admin.id };

  return null;
}

export async function createSession(db: D1Database, identity: AuthIdentity): Promise<string> {
  if (!identity.memberId && !identity.adminUserId) {
    throw new Error("createSession requiere memberId o adminUserId");
  }

  const rawToken = randomToken();
  const tokenHash = await sha256Hex(rawToken); // el hash ES el id de la sesión
  const created = nowSeconds();
  const expiresAt = created + SESSION_TTL_SECONDS;

  await db
    .prepare("INSERT INTO sessions (id, member_id, admin_user_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(tokenHash, identity.memberId, identity.adminUserId, expiresAt, created)
    .run();

  return rawToken;
}

export async function validateSession(db: D1Database, rawToken: string): Promise<AuthIdentity | null> {
  const tokenHash = await sha256Hex(rawToken);
  const now = nowSeconds();

  const session = await db
    .prepare("SELECT member_id, admin_user_id, expires_at FROM sessions WHERE id = ?")
    .bind(tokenHash)
    .first<{ member_id: string | null; admin_user_id: string | null; expires_at: number }>();

  if (!session || session.expires_at < now) return null;
  return { memberId: session.member_id, adminUserId: session.admin_user_id };
}

export async function revokeSession(db: D1Database, rawToken: string): Promise<void> {
  const tokenHash = await sha256Hex(rawToken);
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(tokenHash).run();
}

export const SESSION_COOKIE_NAME = "__Host-session";

/** __Host- exige: Secure, Path=/, sin Domain. */
export function sessionCookieHeader(rawToken: string, maxAgeSeconds = SESSION_TTL_SECONDS): string {
  return `${SESSION_COOKIE_NAME}=${rawToken}; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

export function clearSessionCookieHeader(): string {
  return `${SESSION_COOKIE_NAME}=; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}
