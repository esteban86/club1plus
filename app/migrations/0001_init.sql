-- Esquema inicial de El Club del 1+ (D1 / SQLite).
-- Montos siempre en centavos COP (entero), timestamps en segundos unix.
-- Convención circle: target_gross_cents = 60000000 ($600.000 COP) — el costo
-- BRUTO que llena un círculo (10 Aliado, 4 Mecenas, 1 Madrina, o mezcla de Amigo).
-- El split bruto/neto se snapshotea en cada allocation (nunca se reinterpreta
-- retroactivamente si el % publicado cambia en el futuro).

CREATE TABLE members (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  referred_by_code TEXT REFERENCES referral_codes(code),
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_members_referred_by ON members(referred_by_code);

CREATE TABLE referral_codes (
  code TEXT PRIMARY KEY,
  member_id TEXT NOT NULL UNIQUE REFERENCES members(id),
  created_at INTEGER NOT NULL
);

CREATE TABLE beneficiaries (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER,
  kids_count INTEGER,
  bio TEXT,
  photo_r2_key TEXT,
  consent_public_scope TEXT,
  consent_portal_scope TEXT,
  status TEXT NOT NULL DEFAULT 'receiving' CHECK (status IN ('receiving', 'graduated', 'paused')),
  joined_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_beneficiaries_status ON beneficiaries(status);

CREATE TABLE circles (
  id TEXT PRIMARY KEY,
  beneficiary_id TEXT REFERENCES beneficiaries(id),
  target_gross_cents INTEGER NOT NULL DEFAULT 60000000,
  current_gross_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'full', 'active', 'closed')),
  created_at INTEGER NOT NULL,
  filled_at INTEGER
);
CREATE INDEX idx_circles_status ON circles(status);
CREATE INDEX idx_circles_beneficiary ON circles(beneficiary_id);

CREATE TABLE subscriptions (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id),
  tier TEXT NOT NULL CHECK (tier IN ('amigo', 'aliado', 'mecenas', 'madrina')),
  amount_gross_cents INTEGER NOT NULL,
  circle_id TEXT REFERENCES circles(id),
  wompi_payment_source_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending_first_charge'
    CHECK (status IN ('pending_first_charge', 'active', 'paused', 'cancelled')),
  charge_day INTEGER NOT NULL DEFAULT 1 CHECK (charge_day BETWEEN 1 AND 28),
  next_charge_at INTEGER,
  created_at INTEGER NOT NULL,
  cancelled_at INTEGER
);
CREATE INDEX idx_subscriptions_member ON subscriptions(member_id);
CREATE INDEX idx_subscriptions_circle ON subscriptions(circle_id);
CREATE INDEX idx_subscriptions_due ON subscriptions(status, next_charge_at);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  member_id TEXT NOT NULL REFERENCES members(id),
  subscription_id TEXT REFERENCES subscriptions(id),
  wompi_transaction_id TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'COP',
  kind TEXT NOT NULL CHECK (kind IN ('one_time', 'subscription_first', 'subscription_recurring')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'declined', 'voided', 'error')),
  wompi_raw_status TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_transactions_member ON transactions(member_id);
CREATE INDEX idx_transactions_subscription ON transactions(subscription_id);

CREATE TABLE allocations (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE REFERENCES transactions(id),
  circle_id TEXT NOT NULL REFERENCES circles(id),
  beneficiary_id TEXT REFERENCES beneficiaries(id),
  gross_amount_cents INTEGER NOT NULL,
  beneficiary_net_cents INTEGER NOT NULL,
  operations_cents INTEGER NOT NULL,
  split_beneficiary_bps INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_allocations_circle ON allocations(circle_id);
CREATE INDEX idx_allocations_beneficiary ON allocations(beneficiary_id);

CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'viewer')),
  created_at INTEGER NOT NULL
);

CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('admin', 'system', 'webhook')),
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  detail TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_log(created_at);

-- Auth passwordless: el token crudo solo vive en el correo/URL, nunca en DB.
CREATE TABLE magic_links (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_magic_links_email ON magic_links(email);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  member_id TEXT REFERENCES members(id),
  admin_user_id TEXT REFERENCES admin_users(id),
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  CHECK (
    (member_id IS NOT NULL AND admin_user_id IS NULL) OR
    (member_id IS NULL AND admin_user_id IS NOT NULL)
  )
);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
