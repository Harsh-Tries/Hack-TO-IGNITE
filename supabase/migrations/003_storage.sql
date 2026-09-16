-- ============================================================
-- 003_storage.sql
-- SecureExam — Supabase Storage Configuration
-- ============================================================

-- ============================================================
-- STORAGE BUCKET: encrypted-papers
-- Private bucket — no public access
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'encrypted-papers',
  'encrypted-papers',
  FALSE,                     -- PRIVATE: no public URL access
  52428800,                  -- 50MB max
  ARRAY['application/octet-stream']  -- Only encrypted binary blobs
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE POLICIES
-- ============================================================

-- Policy: Only SUPER_ADMIN and EXAM_ADMIN and QUESTION_SETTER
-- can upload encrypted papers via server-side actions
-- Direct browser upload is blocked — all uploads go through API routes

CREATE POLICY "encrypted_papers_upload_authorized"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'encrypted-papers'
    AND (
      (SELECT role::TEXT FROM public.profiles WHERE id = auth.uid())
        IN ('SUPER_ADMIN', 'EXAM_ADMIN', 'QUESTION_SETTER')
    )
  );

-- Policy: Authorized users can read their accessible papers
-- But only through server-side signed URL generation
CREATE POLICY "encrypted_papers_read_authorized"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'encrypted-papers'
    AND (
      (SELECT role::TEXT FROM public.profiles WHERE id = auth.uid())
        IN ('SUPER_ADMIN', 'EXAM_ADMIN', 'QUESTION_SETTER', 'AUDITOR')
    )
  );

-- Policy: SUPER_ADMIN and EXAM_ADMIN can delete/update storage objects
CREATE POLICY "encrypted_papers_manage_admin"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'encrypted-papers'
    AND (
      (SELECT role::TEXT FROM public.profiles WHERE id = auth.uid())
        IN ('SUPER_ADMIN', 'EXAM_ADMIN')
    )
  );

-- ============================================================
-- NOTE ON SIGNED URLS
-- ============================================================
-- Direct storage access is intentionally restrictive.
-- Paper downloads are served through:
--   /api/papers/[id]/download
-- This route:
--   1. Authenticates the user
--   2. Checks role + college + exam assignment
--   3. Generates a short-lived signed URL (60 seconds)
--   4. Records access in paper_access table
--   5. Creates audit log entry
-- ============================================================
