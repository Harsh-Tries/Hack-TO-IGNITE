'use client';

import React from 'react';
import { 
  GraduationCap, 
  FileText, 
  Building2, 
  Unlock, 
  AlertTriangle, 
  Link as ChainIcon, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import { SecurityStat } from '@/types';

const ICON_MAP: Record<string, React.ElementType> = {
  GraduationCap,
  FileText,
  Building2,
  Unlock,
  AlertTriangle,
  Link: ChainIcon,
};

export function StatCard({ title, value, change, trend = 'up', icon, isAlert = false }: SecurityStat) {
  const Icon = ICON_MAP[icon] || FileText;

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-200 ${
      isAlert 
        ? 'bg-gradient-to-br from-rose-50/90 to-amber-50/50 border-rose-200/80 shadow-sm' 
        : 'bg-white border-slate-200/80 shadow-subtle hover:border-blue-200 hover:shadow-card'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold uppercase tracking-wider ${isAlert ? 'text-rose-700' : 'text-slate-500'}`}>
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
          isAlert 
            ? 'bg-rose-100 text-rose-600 border border-rose-200' 
            : 'bg-blue-50 text-blue-600 border border-blue-100'
        }`}>
          <Icon className="w-4 h-4 stroke-[2.2]" />
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className={`text-2xl font-extrabold tracking-tight ${isAlert ? 'text-rose-900' : 'text-slate-900'}`}>
          {value}
        </div>

        {change && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isAlert 
              ? 'bg-rose-100/80 text-rose-700' 
              : trend === 'up' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                : 'bg-slate-100 text-slate-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
