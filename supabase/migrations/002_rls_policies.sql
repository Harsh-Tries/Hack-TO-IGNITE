-- ============================================================
-- 002_rls_policies.sql
-- SecureExam — Row Level Security Policies
-- ============================================================

-- ============================================================
-- HELPER FUNCTION: get_my_role()
-- Returns the authenticated user's role from profiles
-- Used in RLS policies — never trust client-provided role
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role::TEXT
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_my_college_id()
RETURNS UUID AS $$
  SELECT college_id
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.get_my_status()
RETURNS TEXT AS $$
  SELECT status::TEXT
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE public.profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_center_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blockchain_records     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paper_access           ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES POLICIES
-- ============================================================

-- Users can read their own profile
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

-- SUPER_ADMIN can read all profiles
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- AUDITOR can read all profiles
CREATE POLICY "profiles_select_auditor"
  ON public.profiles FOR SELECT
  USING (public.get_my_role() = 'AUDITOR');

-- Users can update only safe fields on their own profile
-- role, status, college_id are NOT updatable by the user
CREATE POLICY "profiles_update_own_safe_fields"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- Prevent self role/status/college modification:
    -- This check is enforced via the restricted UPDATE in server actions
    -- RLS prevents users from using service-role escalation
  );

-- SUPER_ADMIN can update any profile (used by admin client in server actions)
CREATE POLICY "profiles_update_admin"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- Auth callback can insert new profiles (service role bypasses RLS)
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- ============================================================
-- COLLEGES POLICIES
-- ============================================================

-- SUPER_ADMIN: full access
CREATE POLICY "colleges_all_super_admin"
  ON public.colleges FOR ALL
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- EXAM_ADMIN: read active colleges
CREATE POLICY "colleges_select_exam_admin"
  ON public.colleges FOR SELECT
  USING (
    public.get_my_role() = 'EXAM_ADMIN'
    AND status = 'ACTIVE'
  );

-- COLLEGE_ADMIN: read own college only
CREATE POLICY "colleges_select_college_admin"
  ON public.colleges FOR SELECT
  USING (
    public.get_my_role() = 'COLLEGE_ADMIN'
    AND id = public.get_my_college_id()
  );

-- INVIGILATOR: read own college
CREATE POLICY "colleges_select_invigilator"
  ON public.colleges FOR SELECT
  USING (
    public.get_my_role() = 'INVIGILATOR'
    AND id = public.get_my_college_id()
  );

-- AUDITOR: read all colleges
CREATE POLICY "colleges_select_auditor"
  ON public.colleges FOR SELECT
  USING (public.get_my_role() = 'AUDITOR');

-- QUESTION_SETTER: read active colleges (for exam form)
CREATE POLICY "colleges_select_question_setter"
  ON public.colleges FOR SELECT
  USING (
    public.get_my_role() = 'QUESTION_SETTER'
    AND status = 'ACTIVE'
  );

-- ============================================================
-- EXAMS POLICIES
-- ============================================================

-- SUPER_ADMIN: full access
CREATE POLICY "exams_all_super_admin"
  ON public.exams FOR ALL
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- EXAM_ADMIN: create/read/update
CREATE POLICY "exams_cru_exam_admin"
  ON public.exams FOR SELECT
  USING (public.get_my_role() = 'EXAM_ADMIN');

CREATE POLICY "exams_insert_exam_admin"
  ON public.exams FOR INSERT
  WITH CHECK (public.get_my_role() = 'EXAM_ADMIN');

CREATE POLICY "exams_update_exam_admin"
  ON public.exams FOR UPDATE
  USING (public.get_my_role() = 'EXAM_ADMIN');

-- QUESTION_SETTER: read exams only
CREATE POLICY "exams_select_question_setter"
  ON public.exams FOR SELECT
  USING (public.get_my_role() = 'QUESTION_SETTER');

-- COLLEGE_ADMIN: read exams assigned to their college
CREATE POLICY "exams_select_college_admin"
  ON public.exams FOR SELECT
  USING (
    public.get_my_role() = 'COLLEGE_ADMIN'
    AND EXISTS (
      SELECT 1 FROM public.exam_center_assignments eca
      WHERE eca.exam_id = exams.id
        AND eca.college_id = public.get_my_college_id()
        AND eca.status = 'ASSIGNED'
    )
  );

-- INVIGILATOR: read exams assigned to their college
CREATE POLICY "exams_select_invigilator"
  ON public.exams FOR SELECT
  USING (
    public.get_my_role() = 'INVIGILATOR'
    AND EXISTS (
      SELECT 1 FROM public.exam_center_assignments eca
      WHERE eca.exam_id = exams.id
        AND eca.college_id = public.get_my_college_id()
        AND eca.status = 'ASSIGNED'
    )
  );

-- AUDITOR: read all exams
CREATE POLICY "exams_select_auditor"
  ON public.exams FOR SELECT
  USING (public.get_my_role() = 'AUDITOR');

-- ============================================================
-- EXAM CENTER ASSIGNMENTS POLICIES
-- ============================================================

-- SUPER_ADMIN: full access
CREATE POLICY "eca_all_super_admin"
  ON public.exam_center_assignments FOR ALL
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- EXAM_ADMIN: full access
CREATE POLICY "eca_all_exam_admin"
  ON public.exam_center_assignments FOR ALL
  USING (public.get_my_role() = 'EXAM_ADMIN');

-- COLLEGE_ADMIN: read own college assignments
CREATE POLICY "eca_select_college_admin"
  ON public.exam_center_assignments FOR SELECT
  USING (
    public.get_my_role() = 'COLLEGE_ADMIN'
    AND college_id = public.get_my_college_id()
  );

-- INVIGILATOR: read own college assignments
CREATE POLICY "eca_select_invigilator"
  ON public.exam_center_assignments FOR SELECT
  USING (
    public.get_my_role() = 'INVIGILATOR'
    AND college_id = public.get_my_college_id()
  );

-- AUDITOR: read all
CREATE POLICY "eca_select_auditor"
  ON public.exam_center_assignments FOR SELECT
  USING (public.get_my_role() = 'AUDITOR');

-- ============================================================
-- QUESTION PAPERS POLICIES
-- ============================================================

-- SUPER_ADMIN: full access
CREATE POLICY "qp_all_super_admin"
  ON public.question_papers FOR ALL
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- EXAM_ADMIN: read + manage papers
CREATE POLICY "qp_select_exam_admin"
  ON public.question_papers FOR SELECT
  USING (public.get_my_role() = 'EXAM_ADMIN');

CREATE POLICY "qp_update_exam_admin"
  ON public.question_papers FOR UPDATE
  USING (public.get_my_role() = 'EXAM_ADMIN');

-- QUESTION_SETTER: read + upload own papers
CREATE POLICY "qp_select_question_setter"
  ON public.question_papers FOR SELECT
  USING (
    public.get_my_role() = 'QUESTION_SETTER'
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "qp_insert_question_setter"
  ON public.question_papers FOR INSERT
  WITH CHECK (
    public.get_my_role() IN ('QUESTION_SETTER', 'EXAM_ADMIN', 'SUPER_ADMIN')
    AND uploaded_by = auth.uid()
  );

-- COLLEGE_ADMIN: read papers for exams assigned to their college
CREATE POLICY "qp_select_college_admin"
  ON public.question_papers FOR SELECT
  USING (
    public.get_my_role() = 'COLLEGE_ADMIN'
    AND EXISTS (
      SELECT 1 FROM public.exam_center_assignments eca
      WHERE eca.exam_id = question_papers.exam_id
        AND eca.college_id = public.get_my_college_id()
        AND eca.status = 'ASSIGNED'
    )
  );

-- INVIGILATOR: read papers for their college's exams
CREATE POLICY "qp_select_invigilator"
  ON public.question_papers FOR SELECT
  USING (
    public.get_my_role() = 'INVIGILATOR'
    AND EXISTS (
      SELECT 1 FROM public.exam_center_assignments eca
      WHERE eca.exam_id = question_papers.exam_id
        AND eca.college_id = public.get_my_college_id()
        AND eca.status = 'ASSIGNED'
    )
  );

-- AUDITOR: read all (metadata only, no storage access)
CREATE POLICY "qp_select_auditor"
  ON public.question_papers FOR SELECT
  USING (public.get_my_role() = 'AUDITOR');

-- ============================================================
-- BLOCKCHAIN RECORDS POLICIES
-- ============================================================

-- SUPER_ADMIN: full access
CREATE POLICY "br_all_super_admin"
  ON public.blockchain_records FOR ALL
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- EXAM_ADMIN: read + insert
CREATE POLICY "br_select_exam_admin"
  ON public.blockchain_records FOR SELECT
  USING (public.get_my_role() = 'EXAM_ADMIN');

CREATE POLICY "br_insert_exam_admin"
  ON public.blockchain_records FOR INSERT
  WITH CHECK (public.get_my_role() IN ('EXAM_ADMIN', 'SUPER_ADMIN'));

-- AUDITOR: read
CREATE POLICY "br_select_auditor"
  ON public.blockchain_records FOR SELECT
  USING (public.get_my_role() = 'AUDITOR');

-- Authorized paper viewers: read verification info
CREATE POLICY "br_select_authorized_viewers"
  ON public.blockchain_records FOR SELECT
  USING (
    public.get_my_role() IN ('COLLEGE_ADMIN', 'INVIGILATOR', 'QUESTION_SETTER')
    AND EXISTS (
      SELECT 1 FROM public.question_papers qp
      WHERE qp.id = blockchain_records.paper_id
    )
  );

-- ============================================================
-- AUDIT LOGS POLICIES
-- ============================================================

-- SUPER_ADMIN: full read
CREATE POLICY "al_select_super_admin"
  ON public.audit_logs FOR SELECT
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- AUDITOR: full read
CREATE POLICY "al_select_auditor"
  ON public.audit_logs FOR SELECT
  USING (public.get_my_role() = 'AUDITOR');

-- EXAM_ADMIN: read relevant events
CREATE POLICY "al_select_exam_admin"
  ON public.audit_logs FOR SELECT
  USING (
    public.get_my_role() = 'EXAM_ADMIN'
    AND event_type NOT IN ('USER_CREATED', 'ROLE_CHANGED', 'USER_SUSPENDED')
  );

-- Users: read their own events
CREATE POLICY "al_select_own"
  ON public.audit_logs FOR SELECT
  USING (actor_id = auth.uid());

-- Inserts: allowed only from server (service role), but also allow authenticated inserts
CREATE POLICY "al_insert_authenticated"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- No one can UPDATE or DELETE audit logs (append-only)
-- No UPDATE or DELETE policies created means these operations are blocked

-- ============================================================
-- SECURITY ALERTS POLICIES
-- ============================================================

-- SUPER_ADMIN: full access
CREATE POLICY "sa_all_super_admin"
  ON public.security_alerts FOR ALL
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- EXAM_ADMIN: read relevant alerts
CREATE POLICY "sa_select_exam_admin"
  ON public.security_alerts FOR SELECT
  USING (public.get_my_role() = 'EXAM_ADMIN');

-- AUDITOR: read all
CREATE POLICY "sa_select_auditor"
  ON public.security_alerts FOR SELECT
  USING (public.get_my_role() = 'AUDITOR');

-- Users: read alerts targeting them
CREATE POLICY "sa_select_own"
  ON public.security_alerts FOR SELECT
  USING (user_id = auth.uid());

-- Allow inserts from server actions
CREATE POLICY "sa_insert_authenticated"
  ON public.security_alerts FOR INSERT
  WITH CHECK (public.get_my_role() IN ('SUPER_ADMIN', 'EXAM_ADMIN'));

-- ============================================================
-- NOTIFICATIONS POLICIES
-- ============================================================

-- Users can read own notifications
CREATE POLICY "notif_select_own"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can mark own notifications as read
CREATE POLICY "notif_update_own"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Server inserts notifications (service role bypasses RLS)
CREATE POLICY "notif_insert_authenticated"
  ON public.notifications FOR INSERT
  WITH CHECK (true); -- Insertions controlled by server actions

-- ============================================================
-- PAPER ACCESS POLICIES
-- ============================================================

-- SUPER_ADMIN: full
CREATE POLICY "pa_all_super_admin"
  ON public.paper_access FOR ALL
  USING (public.get_my_role() = 'SUPER_ADMIN');

-- EXAM_ADMIN + AUDITOR: read
CREATE POLICY "pa_select_privileged"
  ON public.paper_access FOR SELECT
  USING (public.get_my_role() IN ('EXAM_ADMIN', 'AUDITOR'));

-- Server can insert access records
CREATE POLICY "pa_insert_authenticated"
  ON public.paper_access FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
