'use client';

import React, { useState } from 'react';
import { ShieldCheck, Filter, Search, User, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEMO_AUDIT_LOGS = [
  { id: 'al-1', actor: 'Harsh Wagh (Super Admin)', email: 'admin@secureexam.demo', eventType: 'LOGIN', entity: 'Profile', desc: 'User logged in successfully via Google OAuth / Demo session', time: '2 mins ago', ip: '127.0.0.1' },
  { id: 'al-2', actor: 'Prof. Rajesh Kumar (Exam Admin)', email: 'exam.admin@secureexam.demo', eventType: 'EXAM_CREATED', entity: 'Exam', desc: 'Created examination UE-CSE-2026-001 (Data Structures and Algorithms)', time: '15 mins ago', ip: '192.168.1.45' },
  { id: 'al-3', actor: 'Dr. Ananya Sharma (Question Setter)', email: 'setter@secureexam.demo', eventType: 'PAPER_UPLOADED', entity: 'QuestionPaper', desc: 'Uploaded original PDF for paper QP-DSA-2026-001', time: '1 hr ago', ip: '192.168.1.88' },
  { id: 'al-4', actor: 'System (Crypto Engine)', email: 'system@secureexam.internal', eventType: 'PAPER_ENCRYPTED', entity: 'QuestionPaper', desc: 'AES-256-GCM encryption applied to paper QP-DSA-2026-001. Envelope stored in Supabase Storage.', time: '1 hr ago', ip: 'internal' },
  { id: 'al-5', actor: 'System (Blockchain Signer)', email: 'system@secureexam.internal', eventType: 'BLOCKCHAIN_REGISTERED', entity: 'BlockchainRecord', desc: 'Registered SHA-256 hash on-chain (Contract: 0x5FbD...aa3, Block #12842)', time: '55 mins ago', ip: 'internal' },
  { id: 'al-6', actor: 'Principal V. S. Patil (College Admin)', email: 'college@secureexam.demo', eventType: 'EXAM_CENTER_ASSIGNED', entity: 'ExamCenterAssignment', desc: 'Assigned PICT as examination center for UE-CSE-2026-001', time: '3 hrs ago', ip: '172.16.0.12' },
  { id: 'al-7', actor: 'Harsh Wagh (Super Admin)', email: 'admin@secureexam.demo', eventType: 'ROLE_CHANGED', entity: 'Profile', desc: 'Assigned EXAM_ADMIN role to user exam.admin@secureexam.demo', time: '4 hrs ago', ip: '127.0.0.1' },
];

const EVENT_COLOR_MAP: Record<string, string> = {
  LOGIN: 'bg-blue-100 text-blue-700 border-blue-200',
  EXAM_CREATED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  PAPER_UPLOADED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  PAPER_ENCRYPTED: 'bg-purple-100 text-purple-700 border-purple-200',
  BLOCKCHAIN_REGISTERED: 'bg-purple-100 text-purple-800 border-purple-300',
  EXAM_CENTER_ASSIGNED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  ROLE_CHANGED: 'bg-amber-100 text-amber-700 border-amber-200',
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
          <h1 className="text-xl font-extrabold text-slate-900">Immutable Audit Logs</h1>
          <p className="text-xs text-slate-500 mt-0.5">Append-only security and activity trail for compliance and forensic analysis</p>
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
          <option value="EXAM_CREATED">Exam Created</option>
          <option value="PAPER_UPLOADED">Paper Uploaded</option>
          <option value="PAPER_ENCRYPTED">Paper Encrypted</option>
          <option value="BLOCKCHAIN_REGISTERED">Blockchain Registered</option>
          <option value="ROLE_CHANGED">Role Changed</option>
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
