-- Dedicated obidientbenue Neon project only. Additive and repeatable.
BEGIN;
CREATE TABLE IF NOT EXISTS community_registrations (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 reference UUID UNIQUE NOT NULL,
 full_name VARCHAR(100) NOT NULL CHECK (char_length(full_name) BETWEEN 3 AND 100),
 phone VARCHAR(20),
 category VARCHAR(20) NOT NULL CHECK (category IN ('Member','Volunteer','Interested','Other')),
 method VARCHAR(10) NOT NULL CHECK (method IN ('Self','Assisted')),
 assisted_by VARCHAR(100),
 lga_code CHAR(2) NOT NULL,
 ward_code CHAR(2) NOT NULL,
 pu_code VARCHAR(12) NOT NULL,
 pu_name TEXT NOT NULL,
 consent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 communication_consent BOOLEAN NOT NULL DEFAULT FALSE,
 status VARCHAR(10) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','VERIFIED','REJECTED')),
 created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
 consent_version TEXT NOT NULL DEFAULT '2026-10-31-v1',
 fingerprint TEXT,
 potential_duplicate BOOLEAN NOT NULL DEFAULT FALSE
);
ALTER TABLE community_registrations ADD COLUMN IF NOT EXISTS consent_version TEXT NOT NULL DEFAULT '2026-10-31-v1';
ALTER TABLE community_registrations ADD COLUMN IF NOT EXISTS fingerprint TEXT;
ALTER TABLE community_registrations ADD COLUMN IF NOT EXISTS potential_duplicate BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_reg_date ON community_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reg_location ON community_registrations(lga_code,ward_code,pu_code);
CREATE INDEX IF NOT EXISTS idx_reg_fingerprint ON community_registrations(fingerprint,created_at DESC);
CREATE TABLE IF NOT EXISTS registration_rate_limits (
 visitor_hash TEXT NOT NULL,
 window_start TIMESTAMPTZ NOT NULL,
 attempts INTEGER NOT NULL DEFAULT 1,
 PRIMARY KEY(visitor_hash,window_start)
);
CREATE TABLE IF NOT EXISTS registration_admin_audit (
 id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 actor_email TEXT NOT NULL,
 action TEXT NOT NULL,
 reference UUID,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMIT;
