'use client';

import React from 'react';
import { Shield, CheckCircle2, Clock, Lock, Link2, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const RECENT_EVENTS = [
  { type: 'LOGIN', desc: 'Super Admin logged in', time: '2 min ago', color: 'bg-blue-500' },
  { type: 'EXAM_CREATED', desc: 'Exam UE-CSE-2026-001 created', time: '15 min ago', color: 'bg-emerald-500' },
  { type: 'PAPER_ENCRYPTED', desc: 'Paper QP-DSA-001 encrypted', time: '1 hr ago', color: 'bg-indigo-500' },
  { type: 'BLOCKCHAIN_REGISTERED', desc: 'Hash registered on-chain', time: '2 hrs ago', color: 'bg-purple-500' },
  { type: 'ROLE_CHANGED', desc: 'User role updated to EXAM_ADMIN', time: '3 hrs ago', color: 'bg-amber-500' },
];

const SECURITY_STATUS = [
  { label: 'Supabase Auth', status: 'Active', healthy: true, icon: Shield },
  { label: 'Role-Based Access', status: 'Active', healthy: true, icon: ShieldCheck },
  { label: 'Row Level Security', status: 'Active', healthy: true, icon: Lock },
  { label: 'Audit Logging', status: 'Active', healthy: true, icon: Activity },
  { label: 'AES-256 Encryption', status: 'Active', healthy: true, icon: Lock },
  { label: 'Blockchain Ledger', status: 'Active', healthy: true, icon: Link2 },
  { label: 'Time-Lock Release', status: 'Phase 6', healthy: false, icon: Clock },
];

export function RightPanel() {
  return (
    <aside className="hidden xl:flex flex-col w-72 shrink-0 border-l border-slate-200 bg-slate-50/50 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      {/* Security Activity */}
      <div className="p-5 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900">Security Activity</span>
        </div>
        <div className="space-y-3">
          {RECENT_EVENTS.map((evt, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', evt.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-800 leading-snug">{evt.desc}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{evt.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Security Status */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900">System Status</span>
        </div>
        <div className="space-y-2">
          {SECURITY_STATUS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-between py-2 px-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Icon className={cn('w-3.5 h-3.5', item.healthy ? 'text-slate-500' : 'text-slate-400')} />
                  <span className="text-[11px] font-medium text-slate-700">{item.label}</span>
                </div>
                {item.healthy ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {item.status}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.status}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Platform version */}
        <div className="mt-4 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200/80 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] font-bold text-blue-700">SECUREEXAM v2.0</span>
          </div>
          <p className="text-[10px] text-blue-600">Phases 1–5 Active</p>
          <p className="text-[9px] text-blue-500 mt-0.5">Supabase • Blockchain • AES-256</p>
        </div>
      </div>
    </aside>
  );
}
