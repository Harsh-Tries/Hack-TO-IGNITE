'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Unlock, Clock, ShieldCheck, AlertTriangle, ChevronRight } from 'lucide-react';
import { CountdownTimer } from '@/components/papers/CountdownTimer';
import { cn } from '@/lib/utils';

const UPCOMING_RELEASES = [
  {
    id: 'p1',
    code: 'QP-DSA-2026-001',
    examName: 'Data Structures and Algorithms',
    examCode: 'UE-CSE-2026-001',
    scheduledReleaseAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15m ago (RELEASED)
    status: 'RELEASED',
    blockchainVerified: true,
  },
  {
    id: 'p2',
    code: 'QP-DBMS-2026-001',
    examName: 'Database Management Systems',
    examCode: 'UE-CSE-2026-002',
    scheduledReleaseAt: new Date(Date.now() + 1000 * 60 * 161 + 1000 * 18).toISOString(), // 02:41:18 in future
    status: 'SCHEDULED',
    blockchainVerified: true,
  },
];

export function SecureReleaseMonitor() {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Lock className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">Secure Release Monitor</h3>
            <p className="text-[11px] text-slate-500 font-medium">Time-locked paper distribution &amp; countdown control</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          Phase 6 Active
        </span>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { label: 'Scheduled', val: 12, color: 'text-slate-900 bg-slate-50 border-slate-200' },
          { label: 'Released', val: 8, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Locked 🔒', val: 4, color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Alerts', val: 2, color: 'text-red-700 bg-red-50 border-red-200' },
        ].map((m, i) => (
          <div key={i} className={cn('p-2.5 rounded-xl border', m.color)}>
            <p className="text-lg font-extrabold">{m.val}</p>
            <p className="text-[10px] font-semibold">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Release Cards */}
      <div className="space-y-3">
        {UPCOMING_RELEASES.map(item => {
          const isReleased = new Date(item.scheduledReleaseAt).getTime() <= Date.now();
          return (
            <div key={item.id} className={cn('p-4 rounded-2xl border transition space-y-3', isReleased ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/80 border-slate-200')}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{item.code}</span>
                    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1', isReleased ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300')}>
                      {isReleased ? <><Unlock className="w-2.5 h-2.5" /> RELEASED</> : <><Lock className="w-2.5 h-2.5" /> LOCKED</>}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.examName}</h4>
                  <p className="text-[11px] text-slate-500">{item.examCode}</p>
                </div>
                <Link href={`/papers/${item.id}`} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5">
                  View <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {!isReleased ? (
                <CountdownTimer targetDate={item.scheduledReleaseAt} />
              ) : (
                <div className="p-2.5 bg-emerald-100/60 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                  <CheckCircleIcon /> Released at {new Date(item.scheduledReleaseAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} • Available to Authorized Personnel
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />;
}
