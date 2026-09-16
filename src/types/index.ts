export type UserRole = 
  | 'SUPER_ADMIN'
  | 'EXAM_ADMIN'
  | 'QUESTION_SETTER'
  | 'COLLEGE_ADMIN'
  | 'INVIGILATOR'
  | 'AUDITOR'
  | 'PENDING';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isGoogleVerified: boolean;
  collegeId?: string;
  collegeName?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  roles: UserRole[];
}

export interface SecurityStat {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  isAlert?: boolean;
}

export interface SystemHealthItem {
  label: string;
  status: 'Online' | 'Active' | 'Normal' | 'Healthy' | 'Degraded';
  isHealthy: boolean;
}

export interface RecentActivityItem {
  id: string;
  title: string;
  code: string;
  timestamp: string;
  type: 'upload' | 'encrypt' | 'assign' | 'blockchain' | 'denied' | 'release' | 'revoke';
  status: 'success' | 'info' | 'danger' | 'warning';
}
