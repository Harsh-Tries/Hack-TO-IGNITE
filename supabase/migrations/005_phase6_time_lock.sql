-- ============================================================
-- 005_phase6_time_lock.sql
-- SecureExam — Phase 6: Time-Locked Paper Release Schema
-- ============================================================

-- 1. ENUM TYPES FOR PHASE 6
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'release_status') THEN
    CREATE TYPE release_status AS ENUM ('SCHEDULED', 'RELEASING', 'RELEASED', 'PAUSED', 'REVOKED', 'FAILED');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attempt_result') THEN
    CREATE TYPE attempt_result AS ENUM ('ALLOWED', 'DENIED_EARLY', 'DENIED_UNAUTHORIZED', 'DENIED_REVOKED', 'DENIED_COLLEGE_MISMATCH');
  END IF;
END $$;

-- 2. TABLE: paper_release_schedule
CREATE TABLE IF NOT EXISTS public.paper_release_schedule (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id               UUID NOT NULL UNIQUE REFERENCES public.question_papers(id) ON DELETE CASCADE,
  exam_id                UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  scheduled_release_at   TIMESTAMPTZ NOT NULL,
  actual_release_at      TIMESTAMPTZ NULL,
  status                 release_status NOT NULL DEFAULT 'SCHEDULED',
  created_by             UUID REFERENCES public.profiles(id),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLE: release_attempts
CREATE TABLE IF NOT EXISTS public.release_attempts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id       UUID NOT NULL REFERENCES public.question_papers(id) ON DELETE CASCADE,
  user_id        UUID NULL REFERENCES public.profiles(id),
  attempted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempt_type   TEXT NOT NULL DEFAULT 'PAPER_ACCESS',
  result         attempt_result NOT NULL,
  reason         TEXT,
  ip_address     INET NULL,
  user_agent     TEXT NULL,
  metadata       JSONB DEFAULT '{}'::jsonb
);

-- 4. INDEXES
CREATE INDEX IF NOT EXISTS idx_prs_paper_id          ON public.paper_release_schedule(paper_id);
CREATE INDEX IF NOT EXISTS idx_prs_exam_id           ON public.paper_release_schedule(exam_id);
CREATE INDEX IF NOT EXISTS idx_prs_status            ON public.paper_release_schedule(status);
CREATE INDEX IF NOT EXISTS idx_prs_scheduled_time    ON public.paper_release_schedule(scheduled_release_at);

CREATE INDEX IF NOT EXISTS idx_ra_paper_id           ON public.release_attempts(paper_id);
CREATE INDEX IF NOT EXISTS idx_ra_user_id            ON public.release_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_ra_result             ON public.release_attempts(result);
CREATE INDEX IF NOT EXISTS idx_ra_attempted_at       ON public.release_attempts(attempted_at DESC);

-- 5. RLS POLICIES
ALTER TABLE public.paper_release_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.release_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "prs_select_all" ON public.paper_release_schedule;
CREATE POLICY "prs_select_all" ON public.paper_release_schedule FOR SELECT USING (true);

DROP POLICY IF EXISTS "prs_admin_all" ON public.paper_release_schedule;
CREATE POLICY "prs_admin_all" ON public.paper_release_schedule FOR ALL USING (public.get_my_role() IN ('SUPER_ADMIN', 'EXAM_ADMIN'));

DROP POLICY IF EXISTS "ra_select_auditor" ON public.release_attempts;
CREATE POLICY "ra_select_auditor" ON public.release_attempts FOR SELECT USING (public.get_my_role() IN ('SUPER_ADMIN', 'EXAM_ADMIN', 'AUDITOR'));

DROP POLICY IF EXISTS "ra_insert_auth" ON public.release_attempts;
CREATE POLICY "ra_insert_auth" ON public.release_attempts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
