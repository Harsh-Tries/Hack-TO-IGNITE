'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, FileText, Lock, Link2, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { cn } from '@/lib/utils';

const DEMO_PAPERS = [
  { id: 'p1', code: 'QP-DSA-2026-001', exam: 'Data Structures and Algorithms', examCode: 'UE-CSE-2026-001', subject: 'DSA', uploadedBy: 'Dr. Ananya Sharma', status: 'BLOCKCHAIN_REGISTERED', sha256: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e', fileSize: 2457600, createdAt: '2026-09-15T09:30:00Z', txHash: '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a3f9c2e01b44d88e42f9a77c' },
  { id: 'p2', code: 'QP-DBMS-2026-001', exam: 'Database Management Systems', examCode: 'UE-CSE-2026-002', subject: 'DBMS', uploadedBy: 'Dr. Ananya Sharma', status: 'ENCRYPTED', sha256: 'b4f9e0d3f8c25g617e03d9b2f41c6g8e0d3f8c25g617e03d9b2f41c6g8e0d3f', fileSize: 1843200, createdAt: '2026-09-15T11:00:00Z', txHash: null },
  { id: 'p3', code: 'QP-SA-2026-001', exam: 'Structural Analysis', examCode: 'UE-CIVIL-2026-005', subject: 'SA', uploadedBy: 'Dr. Ananya Sharma', status: 'BLOCKCHAIN_REGISTERED', sha256: 'c5g0f1e4g9d36h728f14e0c3g52d7h9f1e4g9d36h728f14e0c3g52d7h9f1e4g', fileSize: 3145728, createdAt: '2026-09-14T14:00:00Z', txHash: '0x8b4g0d3f12c55e99f53g0b88d4691e20d13f6b4g0d3f12c55e99f53g0b88d46' },
];

export default function PapersPage() {
  const { user } = useDemoSession();
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const role = user?.role || 'SUPER_ADMIN';
  const canUpload = ['SUPER_ADMIN', 'EXAM_ADMIN', 'QUESTION_SETTER'].includes(role);
  const papers = DEMO_PAPERS.filter(p => !search || p.code.toLowerCase().includes(search.toLowerCase()) || p.exam.toLowerCase().includes(search.toLowerCase()));

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-extrabold text-slate-900">Question Papers</h1><p className="text-xs text-slate-500 mt-0.5">Manage encrypted examination papers and blockchain verification</p></div>
        {canUpload && (
          <Link href="/papers/upload" className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Upload Paper
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Total Papers', value: DEMO_PAPERS.length }, { label: 'Blockchain Registered', value: DEMO_PAPERS.filter(p => p.status === 'BLOCKCHAIN_REGISTERED').length }, { label: 'Encrypted', value: DEMO_PAPERS.filter(p => ['ENCRYPTED','BLOCKCHAIN_REGISTERED'].includes(p.status)).length }].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center">
            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search papers..." className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Papers List */}
      <div className="space-y-3">
        {papers.map(p => (
          <Link key={p.id} href={`/papers/${p.id}`}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-glass hover:-translate-y-0.5 transition-all p-5 cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{p.code}</span>
                    <StatusBadge status={p.status} size="sm" />
                    {['ENCRYPTED','BLOCKCHAIN_REGISTERED'].includes(p.status) && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        <Lock className="w-2.5 h-2.5" /> AES-256-GCM
                      </span>
                    )}
                    {p.status === 'BLOCKCHAIN_REGISTERED' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        <Link2 className="w-2.5 h-2.5" /> On-Chain
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{p.exam}</h3>
                  <p className="text-xs text-slate-500">{p.examCode} • Uploaded by {p.uploadedBy}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-semibold">SHA-256:</span>
                    <code className="font-mono text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">{p.sha256.slice(0, 16)}...</code>
                  </div>
                </div>
                <div className="text-xs text-slate-500 shrink-0 text-right">
                  <p className="font-semibold text-slate-700">{(p.fileSize / (1024*1024)).toFixed(2)} MB</p>
                  <p>{new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
