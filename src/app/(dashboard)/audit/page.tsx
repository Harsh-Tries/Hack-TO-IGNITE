'use client';

import React, { useState } from 'react';
import { ShieldCheck, Filter, Search, User, Clock, Activity, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEMO_AUDIT_LOGS = [
  { id: 'al-1', actor: 'Harsh Wagh (Super Admin)', email: 'admin@secureexam.demo', eventType: 'LOGIN', entity: 'Profile', desc: 'User logged in successfully via Google OAuth / Demo session', time: '2 mins ago', ip: '127.0.0.1' },
  { id: 'al-2', actor: 'Prof. Suresh Mehta (Invigilator)', email: 'invigilator@secureexam.demo', eventType: 'PAPER_ACCESSED', entity: 'QuestionPaper', desc: 'Accessed released paper QP-DSA-2026-001 at PICT Center 04. SHA-256 & Blockchain verified.', time: '10 mins ago', ip: '192.168.1.105' },
  { id: 'al-3', actor: 'Prof. Suresh Mehta (Invigilator)', email: 'invigilator@secureexam.demo', eventType: 'ACCESS_DENIED', entity: 'QuestionPaper', desc: 'DENIED_EARLY: Attempted access to QP-DBMS-2026-001 at 08:43 AM before scheduled 09:00 AM release.', time: '15 mins ago', ip: '192.168.1.105' },
  { id: 'al-4', actor: 'System (Release Engine)', email: 'system@secureexam.internal', eventType: 'PAPER_RELEASED', entity: 'paper_release_schedule', desc: 'Automated UTC release transition for QP-DSA-2026-001 (Data Structures and Algorithms).', time: '20 mins ago', ip: 'internal' },
  { id: 'al-5', actor: 'Dr. Ananya Sharma (Question Setter)', email: 'setter@secureexam.demo', eventType: 'PAPER_UPLOADED', entity: 'QuestionPaper', desc: 'Uploaded original PDF for paper QP-DSA-2026-001', time: '1 hr ago', ip: '192.168.1.88' },
  { id: 'al-6', actor: 'System (Crypto Engine)', email: 'system@secureexam.internal', eventType: 'PAPER_ENCRYPTED', entity: 'QuestionPaper', desc: 'AES-256-GCM encryption applied to paper QP-DSA-2026-001. Envelope stored in Supabase Storage.', time: '1 hr ago', ip: 'internal' },
  { id: 'al-7', actor: 'System (Blockchain Signer)', email: 'system@secureexam.internal', eventType: 'BLOCKCHAIN_REGISTERED', entity: 'BlockchainRecord', desc: 'Registered SHA-256 hash on-chain (Contract: 0x5FbD...aa3, Block #12842)', time: '55 mins ago', ip: 'internal' },
];

const PAPER_ACCESS_ACTIVITY = [
  { time: '09:00:04 AM', result: 'ALLOWED', user: 'Prof. Suresh Mehta (Invigilator)', paper: 'QP-DSA-2026-001', reason: 'Release time reached & authorization verified' },
  { time: '09:00:12 AM', result: 'ALLOWED', user: 'Principal V. S. Patil (College Admin)', paper: 'QP-DSA-2026-001', reason: 'Center assignment verified' },
  { time: '08:59:21 AM', result: 'DENIED_EARLY', user: 'Prof. Suresh Mehta (Invigilator)', paper: 'QP-DSA-2026-001', reason: 'Time-lock enforced (1m 39s early)' },
  { time: '08:45:00 AM', result: 'DENIED_COLLEGE_MISMATCH', user: 'External Faculty', paper: 'QP-DSA-2026-001', reason: 'User not assigned to center' },
];

const EVENT_COLOR_MAP: Record<string, string> = {
  LOGIN: 'bg-blue-100 text-blue-700 border-blue-200',
  PAPER_ACCESSED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ACCESS_DENIED: 'bg-red-100 text-red-700 border-red-200',
  PAPER_RELEASED: 'bg-purple-100 text-purple-700 border-purple-200',
  PAPER_UPLOADED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  PAPER_ENCRYPTED: 'bg-purple-100 text-purple-700 border-purple-200',
  BLOCKCHAIN_REGISTERED: 'bg-purple-100 text-purple-800 border-purple-300',
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState('ALL');

  const filteredLogs = DEMO_AUDIT_LOGS.filter(log => {
    const matchSearch = !search || log.actor.toLowerCase().includes(search.toLowerCase()) || log.desc.toLowerCase().includes(search.toLowerCase());
    const matchType = eventTypeFilter === 'ALL' || log.eventType === eventTypeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Immutable Audit Logs &amp; Access Activity</h1>
          <p className="text-xs text-slate-500 mt-0.5">Append-only security and activity trail for compliance, forensic analysis, and time-lock verification</p>
        </div>
      </div>

      {/* Paper Access Activity Monitor (Phase 6) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" /> Paper Access Activity Stream
          </h2>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">LIVE STREAM</span>
        </div>
        <div className="divide-y divide-slate-100 text-xs">
          {PAPER_ACCESS_ACTIVITY.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-bold text-slate-400">{item.time}</span>
                <span className={cn('font-mono text-[10px] font-bold px-2 py-0.5 rounded border', item.result === 'ALLOWED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200')}>
                  {item.result}
                </span>
                <div>
                  <span className="font-bold text-slate-900">{item.user}</span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span className="font-mono text-blue-600">{item.paper}</span>
                </div>
              </div>
              <span className="text-[11px] text-slate-500 text-right">{item.reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search audit logs by actor or description..."
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={eventTypeFilter}
          onChange={e => setEventTypeFilter(e.target.value)}
          className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none"
        >
          <option value="ALL">All Event Types</option>
          <option value="LOGIN">Login</option>
          <option value="PAPER_ACCESSED">Paper Accessed</option>
          <option value="ACCESS_DENIED">Access Denied</option>
          <option value="PAPER_RELEASED">Paper Released</option>
          <option value="PAPER_UPLOADED">Paper Uploaded</option>
          <option value="BLOCKCHAIN_REGISTERED">Blockchain Registered</option>
        </select>
      </div>

      {/* Log List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredLogs.map(log => (
            <div key={log.id} className="p-4 hover:bg-slate-50 transition flex items-start gap-4">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5">
                <Activity className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded border', EVENT_COLOR_MAP[log.eventType] || 'bg-slate-100 text-slate-600')}>
                    {log.eventType}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{log.actor}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({log.ip})</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{log.desc}</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {log.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
