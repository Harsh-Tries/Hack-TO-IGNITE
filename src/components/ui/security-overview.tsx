'use client';

import React from 'react';
import { Shield, CheckCircle2, Server, Key, Cpu, Database } from 'lucide-react';
import { SystemHealthItem } from '@/types';

const HEALTH_ITEMS: SystemHealthItem[] = [
  { label: 'Blockchain Sync', status: 'Online', isHealthy: true },
  { label: 'Encryption Service', status: 'Active', isHealthy: true },
  { label: 'Threat Detection', status: 'Normal', isHealthy: true },
  { label: 'Database', status: 'Healthy', isHealthy: true },
];

export function SecurityOverview() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Security & System Health</h3>
            <p className="text-[11px] text-slate-500 font-medium">Real-time infrastructure diagnostic monitors</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          All Systems Operational
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {HEALTH_ITEMS.map((item, idx) => (
          <div key={idx} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">{item.label}</span>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                ● {item.status}
              </span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
