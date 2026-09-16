import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Clock, 
  AlertOctagon, 
  ShieldAlert, 
  Link as ChainIcon, 
  FileText,
  Building2
} from 'lucide-react';

export type StatusType = 
  | 'VERIFIED'
  | 'LOCKED'
  | 'PENDING'
  | 'REVOKED'
  | 'DENIED'
  | 'BLOCKCHAIN'
  | 'SCHEDULED'
  | 'RELEASED'
  | 'ACTIVE'
  | 'DRAFT';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let Icon = FileText;
  let text = label || status;

  switch (normalized) {
    case 'VERIFIED':
    case 'RELEASED':
    case 'ACTIVE':
    case 'CONFIRMED':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      Icon = CheckCircle2;
      text = label || (normalized === 'VERIFIED' ? 'Verified' : normalized === 'RELEASED' ? 'Released' : 'Active');
      break;

    case 'LOCKED':
    case 'SCHEDULED':
      styles = 'bg-blue-50 text-blue-700 border-blue-200/80';
      Icon = Lock;
      text = label || (normalized === 'LOCKED' ? 'Locked' : 'Scheduled');
      break;

    case 'PENDING':
    case 'DRAFT':
      styles = 'bg-amber-50 text-amber-700 border-amber-200/80';
      Icon = Clock;
      text = label || (normalized === 'PENDING' ? 'Pending Approval' : 'Draft');
      break;

    case 'REVOKED':
    case 'DENIED':
    case 'ACCESS DENIED':
      styles = 'bg-rose-50 text-rose-700 border-rose-200/80';
      Icon = AlertOctagon;
      text = label || (normalized === 'REVOKED' ? 'Revoked' : 'Access Denied');
      break;

    case 'BLOCKCHAIN':
    case 'REGISTERED':
      styles = 'bg-purple-50 text-indigo-700 border-indigo-200/80';
      Icon = ChainIcon;
      text = label || 'Blockchain Registered';
      break;

    case 'HIGH':
    case 'CRITICAL':
      styles = 'bg-red-100 text-red-800 border-red-300 font-semibold';
      Icon = ShieldAlert;
      text = label || normalized;
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full border ${styles} ${sizeClasses}`}>
      <Icon className={iconSizes} />
      <span>{text}</span>
    </span>
  );
}
