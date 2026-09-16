import Link from 'next/link';
import { ArrowRight, LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  color?: string;
  disabled?: boolean;
  badge?: string;
}

export function QuickActionCard({ title, description, href, icon, color = 'blue', disabled, badge }: QuickActionCardProps) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[icon] || Icons.Shield;
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100 group-hover:bg-slate-100',
  };
  const Card = (
    <div className={cn(
      'group bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle flex items-start gap-4 transition-all duration-200',
      !disabled && 'hover:shadow-glass hover:-translate-y-0.5 cursor-pointer',
      disabled && 'opacity-60 cursor-not-allowed',
    )}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition', colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-slate-900">{title}</p>
          {badge && <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{badge}</span>}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
      </div>
      {!disabled && <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition shrink-0 mt-1" />}
    </div>
  );
  if (disabled) return Card;
  return <Link href={href}>{Card}</Link>;
}
