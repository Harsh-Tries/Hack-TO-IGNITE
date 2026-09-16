import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  // Exam statuses
  DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  SCHEDULED: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  PAPER_READY: { label: 'Paper Ready', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  DISTRIBUTED: { label: 'Distributed', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  RELEASED: { label: 'Released', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  COMPLETED: { label: 'Completed', className: 'bg-gray-100 text-gray-600 border-gray-200' },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-600 border-red-200' },
  // User statuses
  ACTIVE: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  SUSPENDED: { label: 'Suspended', className: 'bg-red-100 text-red-600 border-red-200' },
  // College
  INACTIVE: { label: 'Inactive', className: 'bg-gray-100 text-gray-500 border-gray-200' },
  // Paper statuses
  UPLOADED: { label: 'Uploaded', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  ENCRYPTED: { label: 'Encrypted', className: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  BLOCKCHAIN_REGISTERED: { label: 'On-Chain', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  REVOKED: { label: 'Revoked', className: 'bg-red-100 text-red-600 border-red-200' },
  // Blockchain
  CONFIRMED: { label: 'Confirmed', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-600 border-red-200' },
  // Alert severity
  LOW: { label: 'Low', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  MEDIUM: { label: 'Medium', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  HIGH: { label: 'High', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  CRITICAL: { label: 'Critical', className: 'bg-red-100 text-red-700 border-red-200' },
  // Alert status
  OPEN: { label: 'Open', className: 'bg-red-100 text-red-700 border-red-200' },
  INVESTIGATING: { label: 'Investigating', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  RESOLVED: { label: 'Resolved', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  DISMISSED: { label: 'Dismissed', className: 'bg-gray-100 text-gray-500 border-gray-200' },
  // Assignment
  ASSIGNED: { label: 'Assigned', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  REMOVED: { label: 'Removed', className: 'bg-red-100 text-red-600 border-red-200' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_MAP[status] || { label: status, className: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={cn(
      'inline-flex items-center font-bold border rounded-full',
      size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5',
      config.className,
    )}>
      {config.label}
    </span>
  );
}
