export type UserRole =
  | 'SUPER_ADMIN'
  | 'EXAM_ADMIN'
  | 'QUESTION_SETTER'
  | 'COLLEGE_ADMIN'
  | 'INVIGILATOR'
  | 'AUDITOR'
  | 'PENDING';

export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED';
export type ExamStatus = 'DRAFT' | 'SCHEDULED' | 'PAPER_READY' | 'DISTRIBUTED' | 'RELEASED' | 'COMPLETED' | 'CANCELLED';
export type CollegeStatus = 'ACTIVE' | 'INACTIVE';
export type PaperStatus = 'UPLOADED' | 'ENCRYPTED' | 'BLOCKCHAIN_REGISTERED' | 'ACTIVE' | 'REVOKED';
export type BlockchainVerificationStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REVOKED';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';

export interface SystemHealthItem {
  label: string;
  status: string;
  isHealthy: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  status: UserStatus;
  college_id: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  college?: College | null;
}

export interface College {
  id: string;
  name: string;
  code: string;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  status: CollegeStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: string;
  name: string;
  code: string;
  description: string | null;
  academic_year: string;
  semester: string | null;
  department: string | null;
  subject: string | null;
  exam_date: string;
  start_time: string;
  duration_minutes: number;
  paper_release_time: string | null;
  status: ExamStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  creator?: UserProfile | null;
  assignments?: ExamCenterAssignment[];
}

export interface ExamCenterAssignment {
  id: string;
  exam_id: string;
  college_id: string;
  assigned_by: string;
  status: 'ASSIGNED' | 'REMOVED';
  assigned_at: string;
  removed_at: string | null;
  college?: College;
  exam?: Exam;
}

export interface QuestionPaper {
  id: string;
  paper_code: string;
  exam_id: string;
  uploaded_by: string;
  original_filename: string | null;
  storage_path: string | null;
  encrypted_storage_path: string | null;
  file_size: number | null;
  mime_type: string | null;
  sha256_hash: string | null;
  encryption_algorithm: string | null;
  encryption_iv: string | null;
  encryption_auth_tag: string | null;
  status: PaperStatus;
  created_at: string;
  updated_at: string;
  exam?: Exam;
  uploader?: UserProfile;
  blockchain_record?: BlockchainRecord | null;
}

export interface BlockchainRecord {
  id: string;
  paper_id: string;
  network: string | null;
  contract_address: string | null;
  transaction_hash: string | null;
  block_number: number | null;
  paper_hash: string;
  registered_by: string;
  registered_at: string;
  verification_status: BlockchainVerificationStatus;
  metadata: Record<string, unknown>;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  event_type: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  actor?: UserProfile | null;
}

export interface SecurityAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  user_id: string | null;
  exam_id: string | null;
  paper_id: string | null;
  status: AlertStatus;
  resolved_by: string | null;
  resolved_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string | null;
  read: boolean;
  created_at: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  roles: UserRole[];
}
