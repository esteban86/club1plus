import { describe, it, expect, beforeEach } from "vitest";
import { FakeD1 } from "./helpers/fake-d1";
import {
  issueMagicLink,
  consumeMagicLink,
  createSession,
  validateSession,
  revokeSession,
} from "../src/lib/auth";

let db: FakeD1;

beforeEach(() => {
  db = new FakeD1();
  db.tables.members.push({ id: "mem_1", email: "socia@example.com", name: "Socia Uno", created_at: 0 });
  db.tables.admin_users.push({ id: "adm_1", email: "admin@example.com", role: "admin", created_at: 0 });
});

describe("issueMagicLink", () => {
  it("emite un link si el correo es de un socio existente", async () => {
    const result = await issueMagicLink(db as unknown as D1Database, "socia@example.com");
    expect(result).not.toBeNull();
    expect(db.tables.magic_links).toHaveLength(1);
  });

  it("normaliza mayúsculas/espacios en el correo", async () => {
    const result = await issueMagicLink(db as unknown as D1Database, "  Socia@Example.com  ");
    expect(result).not.toBeNull();
    expect(db.tables.magic_links[0].email).toBe("socia@example.com");
  });

  it("emite un link si el correo es de un admin", async () => {
    const result = await issueMagicLink(db as unknown as D1Database, "admin@example.com");
    expect(result).not.toBeNull();
  });

  it("devuelve null (sin filtrar) si el correo no existe — anti email-enumeration", async () => {
    const result = await issueMagicLink(db as unknown as D1Database, "nadie@example.com");
    expect(result).toBeNull();
    expect(db.tables.magic_links).toHaveLength(0);
  });

  it("nunca guarda el token crudo en la base, solo su hash", async () => {
    const result = await issueMagicLink(db as unknown as D1Database, "socia@example.com");
    const stored = db.tables.magic_links[0].token_hash as string;
    expect(stored).not.toBe(result!.rawToken);
    expect(stored).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("consumeMagicLink", () => {
  it("crea una sesión válida con un token recién emitido", async () => {
    const { rawToken } = (await issueMagicLink(db as unknown as D1Database, "socia@example.com"))!;
    const sessionToken = await consumeMagicLink(db as unknown as D1Database, rawToken);
    expect(sessionToken).not.toBeNull();

    const identity = await validateSession(db as unknown as D1Database, sessionToken!);
    expect(identity).toEqual({ memberId: "mem_1", adminUserId: null });
  });

  it("rechaza un token inventado", async () => {
    const sessionToken = await consumeMagicLink(db as unknown as D1Database, "token-que-no-existe");
    expect(sessionToken).toBeNull();
  });

  it("es de un solo uso — el segundo intento con el mismo token falla", async () => {
    const { rawToken } = (await issueMagicLink(db as unknown as D1Database, "socia@example.com"))!;
    const first = await consumeMagicLink(db as unknown as D1Database, rawToken);
    const second = await consumeMagicLink(db as unknown as D1Database, rawToken);
    expect(first).not.toBeNull();
    expect(second).toBeNull();
  });

  it("rechaza un token expirado", async () => {
    const { rawToken } = (await issueMagicLink(db as unknown as D1Database, "socia@example.com"))!;
    db.tables.magic_links[0].expires_at = Math.floor(Date.now() / 1000) - 1;
    const sessionToken = await consumeMagicLink(db as unknown as D1Database, rawToken);
    expect(sessionToken).toBeNull();
  });
});

describe("createSession / validateSession / revokeSession", () => {
  it("valida una sesión de admin correctamente", async () => {
    const token = await createSession(db as unknown as D1Database, { memberId: null, adminUserId: "adm_1" });
    const identity = await validateSession(db as unknown as D1Database, token);
    expect(identity).toEqual({ memberId: null, adminUserId: "adm_1" });
  });

  it("rechaza crear una sesión sin identidad", async () => {
    await expect(
      createSession(db as unknown as D1Database, { memberId: null, adminUserId: null }),
    ).rejects.toThrow();
  });

  it("revoke invalida la sesión inmediatamente", async () => {
    const token = await createSession(db as unknown as D1Database, { memberId: "mem_1", adminUserId: null });
    await revokeSession(db as unknown as D1Database, token);
    const identity = await validateSession(db as unknown as D1Database, token);
    expect(identity).toBeNull();
  });

  it("rechaza una sesión expirada", async () => {
    const token = await createSession(db as unknown as D1Database, { memberId: "mem_1", adminUserId: null });
    db.tables.sessions[0].expires_at = Math.floor(Date.now() / 1000) - 1;
    const identity = await validateSession(db as unknown as D1Database, token);
    expect(identity).toBeNull();
  });
});
