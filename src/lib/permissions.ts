import { UserRole, NavItem } from '@/types';

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
    title: 'EXAMS',
    href: '/exams',
    icon: 'GraduationCap',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'COLLEGE_ADMIN', 'INVIGILATOR'],
  },
  {
    title: 'QUESTION PAPERS',
    href: '/papers',
    icon: 'FileText',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'QUESTION_SETTER', 'COLLEGE_ADMIN', 'INVIGILATOR'],
  },
  {
    title: 'COLLEGES / CENTERS',
    href: '/colleges',
    icon: 'Building2',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN'],
  },
  {
    title: 'VERIFICATION',
    href: '/verification',
    icon: 'QrCode',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'COLLEGE_ADMIN', 'INVIGILATOR', 'AUDITOR'],
  },
  {
    title: 'BLOCKCHAIN RECORDS',
    href: '/blockchain',
    icon: 'Link',
    roles: ['SUPER_ADMIN', 'EXAM_ADMIN', 'AUDITOR'],
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
  {
    title: 'USER MANAGEMENT',
    href: '/admin/users',
    icon: 'Users',
    roles: ['SUPER_ADMIN'],
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
