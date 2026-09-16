-- ============================================================
-- 004_seed_data.sql
-- SecureExam — Demo / Development Seed Data
-- ============================================================
-- NOTE: This creates demo colleges and exam data.
-- Real user profiles are created on first Google OAuth login.
-- Do NOT use this in production without review.
-- ============================================================

-- Demo Colleges
INSERT INTO public.colleges (id, name, code, address, city, state, postal_code, contact_name, contact_email, contact_phone, status)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Pune Institute of Computer Technology', 'PICT-001', 'Survey No. 27, Near Trimurti Chowk, Dhankawadi', 'Pune', 'Maharashtra', '411043', 'Dr. R. V. Sonawane', 'principal@pict.edu', '+91 20 2437 1101', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000002', 'College of Engineering Pune', 'COEP-001', 'Wellesley Road, Shivajinagar', 'Pune', 'Maharashtra', '411005', 'Prof. B. B. Ahuja', 'director@coep.ac.in', '+91 20 2550 7000', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000003', 'Vishwakarma Institute of Technology', 'VIT-001', '666, Upper Indiranagar, Bibwewadi', 'Pune', 'Maharashtra', '411037', 'Dr. Madhuri Khambete', 'principal@vit.edu', '+91 20 2425 6800', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000004', 'Symbiosis Institute of Technology', 'SIT-001', 'Survey No. 231, Plot No. B-52, Off Mumbai-Pune Expressway, Lavale', 'Pune', 'Maharashtra', '412115', 'Dr. Vinay Kulkarni', 'principal@sitpune.edu.in', '+91 20 3911 6400', 'ACTIVE'),
  ('c1000000-0000-0000-0000-000000000005', 'Marathwada Mitra Mandal College of Engineering', 'MMCOE-001', 'Survey No. 105, Karvenagar', 'Pune', 'Maharashtra', '411052', 'Dr. Pradeep Patil', 'principal@mmcoe.edu.in', '+91 20 2544 4400', 'INACTIVE')
ON CONFLICT (id) DO NOTHING;

-- Demo Security Alerts (no user_id, system-generated)
INSERT INTO public.security_alerts (severity, title, description, status, metadata)
VALUES
  ('LOW', 'New User Registration', 'A new user registered via Google OAuth and is awaiting role assignment.', 'OPEN', '{"source": "oauth_callback"}'::jsonb),
  ('MEDIUM', 'Multiple Login Attempts', 'User attempted login from 3 different IP addresses within 1 hour.', 'INVESTIGATING', '{"ip_count": 3}'::jsonb),
  ('HIGH', 'Unauthorized Paper Access Attempt', 'User with INVIGILATOR role attempted to access a paper outside their assigned college.', 'RESOLVED', '{"action": "access_denied"}'::jsonb)
ON CONFLICT DO NOTHING;

-- Demo Audit Events (system-level, no actor)
INSERT INTO public.audit_logs (event_type, entity_type, description, metadata)
VALUES
  ('COLLEGE_CREATED', 'College', 'Demo college data seeded for development environment.', '{"source": "seed_data"}'::jsonb),
  ('SECURITY_ALERT', 'System', 'SecureExam platform initialized. Awaiting INITIAL_ADMIN_EMAIL configuration.', '{"phase": "setup"}'::jsonb)
ON CONFLICT DO NOTHING;
