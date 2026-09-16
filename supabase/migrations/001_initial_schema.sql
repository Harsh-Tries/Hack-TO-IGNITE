-- ============================================================
-- 001_initial_schema.sql
-- SecureExam — Full PostgreSQL Schema
-- Run this in Supabase SQL Editor or via supabase db push
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN',
  'EXAM_ADMIN',
  'QUESTION_SETTER',
  'COLLEGE_ADMIN',
  'INVIGILATOR',
  'AUDITOR',
  'PENDING'
);

CREATE TYPE user_status AS ENUM (
  'PENDING',
  'ACTIVE',
  'SUSPENDED'
);

CREATE TYPE college_status AS ENUM (
  'ACTIVE',
  'INACTIVE'
);

CREATE TYPE exam_status AS ENUM (
  'DRAFT',
  'SCHEDULED',
  'PAPER_READY',
  'DISTRIBUTED',
  'RELEASED',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE assignment_status AS ENUM (
  'ASSIGNED',
  'REMOVED'
);

CREATE TYPE paper_status AS ENUM (
  'UPLOADED',
  'ENCRYPTED',
  'BLOCKCHAIN_REGISTERED',
  'ACTIVE',
  'REVOKED'
);

CREATE TYPE blockchain_verification_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'FAILED',
  'REVOKED'
);

CREATE TYPE audit_event_type AS ENUM (
  'LOGIN',
  'LOGOUT',
  'USER_CREATED',
  'ROLE_CHANGED',
  'USER_ACTIVATED',
  'USER_SUSPENDED',
  'EXAM_CREATED',
  'EXAM_UPDATED',
  'EXAM_STATUS_CHANGED',
  'COLLEGE_CREATED',
  'COLLEGE_UPDATED',
  'EXAM_CENTER_ASSIGNED',
  'EXAM_CENTER_REMOVED',
  'PAPER_UPLOADED',
  'PAPER_ENCRYPTED',
  'PAPER_HASHED',
  'BLOCKCHAIN_REGISTERED',
  'BLOCKCHAIN_VERIFIED',
  'PAPER_ACCESSED',
  'PAPER_REVOKED',
  'ACCESS_DENIED',
  'SECURITY_ALERT'
);

CREATE TYPE alert_severity AS ENUM (
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL'
);

CREATE TYPE alert_status AS ENUM (
  'OPEN',
  'INVESTIGATING',
  'RESOLVED',
  'DISMISSED'
);

CREATE TYPE access_result AS ENUM (
  'ALLOWED',
  'DENIED',
  'LOCKED',
  'REVOKED'
);

-- ============================================================
-- TABLE 1: profiles
-- Application-level user profile
-- References auth.users — NOT a duplicate
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT UNIQUE NOT NULL,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'PENDING',
  status        user_status NOT NULL DEFAULT 'PENDING',
  college_id    UUID NULL,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 2: colleges
-- Examination centers / institutions
-- ============================================================

CREATE TABLE IF NOT EXISTS public.colleges (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  code           TEXT UNIQUE NOT NULL,
  address        TEXT,
  city           TEXT,
  state          TEXT,
  postal_code    TEXT,
  contact_name   TEXT,
  contact_email  TEXT,
  contact_phone  TEXT,
  status         college_status NOT NULL DEFAULT 'ACTIVE',
  created_by     UUID REFERENCES public.profiles(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add FK from profiles.college_id → colleges.id (after colleges is created)
ALTER TABLE public.profiles
  ADD CONSTRAINT fk_profiles_college
  FOREIGN KEY (college_id) REFERENCES public.colleges(id)
  ON DELETE SET NULL;

-- ============================================================
-- TABLE 3: exams
-- ============================================================

CREATE TABLE IF NOT EXISTS public.exams (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  code                TEXT UNIQUE NOT NULL,
  description         TEXT,
  academic_year       TEXT NOT NULL,
  semester            TEXT,
  department          TEXT,
  subject             TEXT,
  exam_date           DATE NOT NULL,
  start_time          TIME NOT NULL,
  duration_minutes    INTEGER NOT NULL CHECK (duration_minutes > 0),
  paper_release_time  TIMESTAMPTZ NULL,
  status              exam_status NOT NULL DEFAULT 'DRAFT',
  created_by          UUID NOT NULL REFERENCES public.profiles(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 4: exam_center_assignments
-- Many-to-many: exams <-> colleges
-- ============================================================

CREATE TABLE IF NOT EXISTS public.exam_center_assignments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id      UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  college_id   UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  assigned_by  UUID NOT NULL REFERENCES public.profiles(id),
  status       assignment_status NOT NULL DEFAULT 'ASSIGNED',
  assigned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  removed_at   TIMESTAMPTZ NULL,
  UNIQUE (exam_id, college_id)
);

-- ============================================================
-- TABLE 5: question_papers
-- Phase 4 — Paper metadata (no plaintext content)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.question_papers (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_code              TEXT UNIQUE NOT NULL,
  exam_id                 UUID NOT NULL REFERENCES public.exams(id),
  uploaded_by             UUID NOT NULL REFERENCES public.profiles(id),
  original_filename       TEXT,
  storage_path            TEXT,         -- Raw upload path (unused after encryption)
  encrypted_storage_path  TEXT,         -- Path to encrypted blob in Supabase Storage
  file_size               BIGINT,
  mime_type               TEXT,
  sha256_hash             TEXT,         -- SHA-256 of the original plaintext
  encryption_algorithm    TEXT DEFAULT 'AES-256-GCM',
  encryption_iv           TEXT,
  encryption_auth_tag     TEXT,
  status                  paper_status NOT NULL DEFAULT 'UPLOADED',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 6: blockchain_records
-- Phase 5 — On-chain registration metadata
-- ============================================================

CREATE TABLE IF NOT EXISTS public.blockchain_records (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id              UUID NOT NULL UNIQUE REFERENCES public.question_papers(id),
  network               TEXT,
  contract_address      TEXT,
  transaction_hash      TEXT,
  block_number          BIGINT,
  paper_hash            TEXT NOT NULL,    -- SHA-256 that was registered
  registered_by         UUID NOT NULL REFERENCES public.profiles(id),
  registered_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verification_status   blockchain_verification_status NOT NULL DEFAULT 'PENDING',
  metadata              JSONB DEFAULT '{}'::jsonb
);

-- ============================================================
-- TABLE 7: audit_logs
-- Append-only event log — no UPDATE/DELETE ever
-- ============================================================

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     UUID NULL REFERENCES public.profiles(id),
  event_type   audit_event_type NOT NULL,
  entity_type  TEXT,
  entity_id    UUID NULL,
  description  TEXT,
  metadata     JSONB DEFAULT '{}'::jsonb,
  ip_address   INET NULL,
  user_agent   TEXT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 8: security_alerts
-- ============================================================

CREATE TABLE IF NOT EXISTS public.security_alerts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity     alert_severity NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  user_id      UUID NULL REFERENCES public.profiles(id),
  exam_id      UUID NULL REFERENCES public.exams(id),
  paper_id     UUID NULL REFERENCES public.question_papers(id),
  status       alert_status NOT NULL DEFAULT 'OPEN',
  resolved_by  UUID NULL REFERENCES public.profiles(id),
  resolved_at  TIMESTAMPTZ NULL,
  metadata     JSONB DEFAULT '{}'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 9: notifications
-- ============================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  type       TEXT,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE 10: paper_access
-- Phase 4 — access attempt tracking (Phase 6 readiness)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.paper_access (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id    UUID NOT NULL REFERENCES public.question_papers(id),
  user_id     UUID NOT NULL REFERENCES public.profiles(id),
  result      access_result NOT NULL,
  reason      TEXT,
  ip_address  INET,
  user_agent  TEXT,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email     ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role      ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status    ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_college   ON public.profiles(college_id);

-- colleges
CREATE INDEX IF NOT EXISTS idx_colleges_code      ON public.colleges(code);
CREATE INDEX IF NOT EXISTS idx_colleges_status    ON public.colleges(status);

-- exams
CREATE INDEX IF NOT EXISTS idx_exams_code         ON public.exams(code);
CREATE INDEX IF NOT EXISTS idx_exams_date         ON public.exams(exam_date);
CREATE INDEX IF NOT EXISTS idx_exams_status       ON public.exams(status);
CREATE INDEX IF NOT EXISTS idx_exams_created_by   ON public.exams(created_by);

-- exam_center_assignments
CREATE INDEX IF NOT EXISTS idx_eca_exam_id        ON public.exam_center_assignments(exam_id);
CREATE INDEX IF NOT EXISTS idx_eca_college_id     ON public.exam_center_assignments(college_id);

-- question_papers
CREATE INDEX IF NOT EXISTS idx_qp_paper_code      ON public.question_papers(paper_code);
CREATE INDEX IF NOT EXISTS idx_qp_exam_id         ON public.question_papers(exam_id);
CREATE INDEX IF NOT EXISTS idx_qp_status          ON public.question_papers(status);
CREATE INDEX IF NOT EXISTS idx_qp_sha256          ON public.question_papers(sha256_hash);

-- blockchain_records
CREATE INDEX IF NOT EXISTS idx_br_paper_id        ON public.blockchain_records(paper_id);
CREATE INDEX IF NOT EXISTS idx_br_tx_hash         ON public.blockchain_records(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_br_paper_hash      ON public.blockchain_records(paper_hash);

-- audit_logs
CREATE INDEX IF NOT EXISTS idx_al_actor_id        ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_al_event_type      ON public.audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_al_entity_id       ON public.audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_al_created_at      ON public.audit_logs(created_at DESC);

-- security_alerts
CREATE INDEX IF NOT EXISTS idx_sa_severity        ON public.security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_sa_status          ON public.security_alerts(status);
CREATE INDEX IF NOT EXISTS idx_sa_created_at      ON public.security_alerts(created_at DESC);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_colleges_updated_at
  BEFORE UPDATE ON public.colleges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_exams_updated_at
  BEFORE UPDATE ON public.exams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_question_papers_updated_at
  BEFORE UPDATE ON public.question_papers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
