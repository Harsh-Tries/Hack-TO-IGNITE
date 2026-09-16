import { UserRole, NavItem } from '@/types';

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'VIEW_EXAMS'
  | 'CREATE_EXAM'
  | 'EDIT_EXAM'
  | 'DELETE_EXAM'
  | 'VIEW_COLLEGES'
  | 'CREATE_COLLEGE'
  | 'EDIT_COLLEGE'
  | 'VIEW_USERS'
  | 'CREATE_USER'
  | 'EDIT_USER'
  | 'CHANGE_USER_ROLE'
  | 'SUSPEND_USER'
  | 'VIEW_AUDIT_LOGS'
  | 'VIEW_SECURITY_ALERTS'
  | 'UPLOAD_PAPER'
  | 'VERIFY_PAPER'
  | 'ACCESS_PAPER'
  | 'REGISTER_BLOCKCHAIN'
  | 'REVOKE_PAPER';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_EXAMS',
    'CREATE_EXAM',
    'EDIT_EXAM',
    'DELETE_EXAM',
    'VIEW_COLLEGES',
    'CREATE_COLLEGE',
    'EDIT_COLLEGE',
    'VIEW_USERS',
    'CREATE_USER',
    'EDIT_USER',
    'CHANGE_USER_ROLE',
    'SUSPEND_USER',
    'VIEW_AUDIT_LOGS',
    'VIEW_SECURITY_ALERTS',
    'UPLOAD_PAPER',
    'VERIFY_PAPER',
    'ACCESS_PAPER',
    'REGISTER_BLOCKCHAIN',
    'REVOKE_PAPER',
  ],
  EXAM_ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_EXAMS',
    'CREATE_EXAM',
    'EDIT_EXAM',
    'VIEW_COLLEGES',
    'CREATE_COLLEGE',
    'EDIT_COLLEGE',
    'VIEW_AUDIT_LOGS',
    'VIEW_SECURITY_ALERTS',
    'UPLOAD_PAPER',
    'VERIFY_PAPER',
    'REGISTER_BLOCKCHAIN',
  ],
  QUESTION_SETTER: [
    'VIEW_DASHBOARD',
    'VIEW_EXAMS',
    'UPLOAD_PAPER',
  ],
  COLLEGE_ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_EXAMS',
    'VIEW_COLLEGES',
    'VERIFY_PAPER',
    'ACCESS_PAPER',
  ],
  INVIGILATOR: [
    'VIEW_DASHBOARD',
    'VIEW_EXAMS',
    'VERIFY_PAPER',
    'ACCESS_PAPER',
  ],
  AUDITOR: [
    'VIEW_DASHBOARD',
    'VIEW_EXAMS',
    'VIEW_COLLEGES',
    'VIEW_AUDIT_LOGS',
    'VIEW_SECURITY_ALERTS',
    'VERIFY_PAPER',
  ],
  PENDING: [],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  if (!role || role === 'PENDING') return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function requirePermission(role: UserRole, permission: Permission): boolean {
  const allowed = hasPermission(role, permission);
  if (!allowed) {
    throw new Error(`Access Denied: Role ${role} lacks permission ${permission}`);
  }
  return true;
}

export const ALL_NAV_ITEMS: NavItem[] = [
  {
    title: 'HOME',
    href: '/',
    icon: 'Home',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'QUESTION_SETTER', 'COLLEGE_ADMIN', 'INVIGILATOR', 'AUDITOR'],
  },
  {
    title: 'DASHBOARD',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'QUESTION_SETTER', 'COLLEGE_ADMIN', 'INVIGILATOR', 'AUDITOR'],
  },
  {
    title: 'EXAMINATIONS',
    href: '/exams',
    icon: 'GraduationCap',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'QUESTION_SETTER', 'COLLEGE_ADMIN', 'INVIGILATOR', 'AUDITOR'],
  },
  {
    title: 'COLLEGES / CENTERS',
    href: '/colleges',
    icon: 'Building2',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'COLLEGE_ADMIN', 'AUDITOR'],
  },
  {
    title: 'USER MANAGEMENT',
    href: '/admin/users',
    icon: 'Users',
    roles: ['SUPER_ADMIN'],
  },
  {
    title: 'AUDIT LOGS',
    href: '/audit',
    icon: 'ShieldCheck',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'AUDITOR'],
  },
  {
    title: 'SECURITY ALERTS',
    href: '/security-alerts',
    icon: 'AlertTriangle',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'AUDITOR'],
  },
];

export function getNavItemsForRole(role: UserRole): NavItem[] {
  if (role === 'PENDING') {
    return [
      {
        title: 'ACCOUNT PENDING',
        href: '/pending',
        icon: 'Clock',
        roles: ['PENDING'],
      },
    ];
  }
  return ALL_NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export function canAccessRoute(role: UserRole, path: string): boolean {
  if (role === 'SUPER_ADMIN') return true;
  if (path === '/' || path === '/login') return true;
  if (role === 'PENDING') return path === '/pending';

  const nav = getNavItemsForRole(role);
  return nav.some((item) => path === item.href || path.startsWith(item.href + '/'));
}
