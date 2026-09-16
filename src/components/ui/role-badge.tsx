import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { Crown, ClipboardList, PenTool, Building2, Eye, ShieldCheck, Clock } from 'lucide-react';

const ROLE_CONFIG: Record<UserRole, { label: string; className: string; Icon: React.ElementType }> = {
  SUPER_ADMIN: { label: 'Super Admin', className: 'bg-purple-100 text-purple-700 border-purple-200', Icon: Crown },
  EXAM_ADMIN: { label: 'Exam Admin', className: 'bg-blue-100 text-blue-700 border-blue-200', Icon: ClipboardList },
  QUESTION_SETTER: { label: 'Question Setter', className: 'bg-indigo-100 text-indigo-700 border-indigo-200', Icon: PenTool },
  COLLEGE_ADMIN: { label: 'College Admin', className: 'bg-emerald-100 text-emerald-700 border-emerald-200', Icon: Building2 },
  INVIGILATOR: { label: 'Invigilator', className: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Eye },
  AUDITOR: { label: 'Auditor', className: 'bg-slate-100 text-slate-600 border-slate-200', Icon: ShieldCheck },
  PENDING: { label: 'Pending', className: 'bg-gray-100 text-gray-500 border-gray-200', Icon: Clock },
};

interface RoleBadgeProps { role: UserRole; size?: 'sm' | 'md' }

export function RoleBadge({ role, size = 'md' }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.PENDING;
  const Icon = config.Icon;
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 font-bold border rounded-full',
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
      config.className,
    )}>
      <Icon className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      {config.label}
    </span>
  );
}
