'use client';

import React from 'react';
import {
  Users, GraduationCap, Building2, ShieldCheck,
  AlertTriangle, Lock, Link2, TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  Users, GraduationCap, Building2, ShieldCheck, AlertTriangle, Lock, Link2,
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  isAlert?: boolean;
}

export function StatCard({ title, value, change, trend = 'neutral', icon, isAlert }: StatCardProps) {
  const Icon = ICON_MAP[icon] || ShieldCheck;
  return (
    <div className={cn(
      'bg-white rounded-2xl p-5 border shadow-subtle flex items-start gap-4 transition hover:shadow-glass',
      isAlert && Number(value) > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200',
    )}>
      <div className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
        isAlert && Number(value) > 0 ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600',
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
            {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-500" />}
            {trend === 'neutral' && <Minus className="w-3 h-3 text-slate-400" />}
            <span className={cn(
              'text-[11px] font-semibold',
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-red-500' : 'text-slate-500',
            )}>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
