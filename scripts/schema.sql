CREATE TABLE IF NOT EXISTS community_registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  reference UUID UNIQUE NOT NULL,
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 3 AND 100),
  phone TEXT,
  category TEXT NOT NULL CHECK (category IN ('Member','Volunteer','Interested','Other')),
  method TEXT NOT NULL CHECK (method IN ('Self','Assisted')),
  assisted_by TEXT,
  lga_code CHAR(2) NOT NULL,
  ward_code CHAR(2) NOT NULL,
  pu_code VARCHAR(12) NOT NULL,
  pu_name TEXT NOT NULL,
  consent_at TIMESTAMPTZ NOT NULL,
  communication_consent BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','VERIFIED','REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_registration_submitted ON community_registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registration_location ON community_registrations(lga_code,ward_code,pu_code);
-- Only authorised service credentials should have table access. Never expose database credentials to clients.
