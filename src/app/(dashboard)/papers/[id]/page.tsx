'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Lock, Link2, CheckCircle2, ShieldCheck, AlertOctagon } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { BeforeReleaseCard } from '@/components/papers/BeforeReleaseCard';
import { AfterReleaseCard } from '@/components/papers/AfterReleaseCard';
import { RevokePaperModal } from '@/components/papers/RevokePaperModal';
import { useDemoSession } from '@/components/providers/demo-session-provider';

const DEMO_PAPERS: Record<string, any> = {
  p1: {
    id: 'p1',
    code: 'QP-DSA-2026-001',
    exam: 'Data Structures and Algorithms',
    examCode: 'UE-CSE-2026-001',
    subject: 'DSA',
    uploadedBy: 'Dr. Ananya Sharma',
    status: 'BLOCKCHAIN_REGISTERED',
    sha256: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e',
    fileSize: 2457600,
    createdAt: '2026-09-15T09:30:00Z',
    scheduledReleaseAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago (RELEASED)
    txHash: '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a3f9c2e01b44d88e42f9a77c',
    blockNumber: 12842,
    network: 'Hardhat Local',
    contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    iv: 'a1b2c3d4e5f6a7b8',
    authTag: 'c7d8e9f0a1b2c3d4',
  },
  p2: {
    id: 'p2',
    code: 'QP-DBMS-2026-001',
    exam: 'Database Management Systems',
    examCode: 'UE-CSE-2026-002',
    subject: 'DBMS',
    uploadedBy: 'Dr. Ananya Sharma',
    status: 'ENCRYPTED',
    sha256: 'b4f9e0d3f8c25a617e03d9b2f41c6a8e0d3f8c25a617e03d9b2f41c6a8e0d3f',
    fileSize: 1843200,
    createdAt: '2026-09-15T11:00:00Z',
    scheduledReleaseAt: new Date(Date.now() + 1000 * 60 * 161 + 1000 * 18).toISOString(), // In future (LOCKED)
    txHash: null,
    blockNumber: null,
  },
};

export default function PaperDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useDemoSession();
  const [paper, setPaper] = useState<any>(DEMO_PAPERS[id] || DEMO_PAPERS['p1']);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const role = user?.role || 'SUPER_ADMIN';
  const canRevoke = ['SUPER_ADMIN', 'EXAM_ADMIN'].includes(role) && paper.status !== 'REVOKED';
  const isReleased = new Date(paper.scheduledReleaseAt).getTime() <= Date.now();

  const securityChecks = [
    { label: 'File Encrypted', detail: 'AES-256-GCM', done: true },
    { label: 'SHA-256 Verified', detail: 'Hash integrity confirmed', done: true },
    { label: 'Blockchain Registered', detail: paper.txHash ? `Block #${paper.blockNumber}` : 'Pending registration', done: !!paper.txHash },
    { label: 'Time-Lock Release', detail: isReleased ? 'Paper Unlocked' : 'Time-Locked', done: isReleased },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/papers')} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{paper.code}</span>
              <StatusBadge status={paper.status} size="sm" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">{paper.exam}</h1>
          </div>
        </div>
        {canRevoke && (
          <button
            onClick={() => setShowRevokeModal(true)}
            className="text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
          >
            <AlertOctagon className="w-4 h-4" /> Revoke Paper
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Phase 6 Time Lock Card */}
        <div className="lg:col-span-7">
          {paper.status === 'REVOKED' ? (
            <div className="bg-white rounded-3xl border border-red-200 shadow-glass p-8 text-center space-y-3">
              <AlertOctagon className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-lg font-extrabold text-red-900">PAPER REVOKED</h2>
              <p className="text-xs text-red-700 leading-relaxed">This question paper has been revoked by an administrator. All access attempts are strictly blocked and logged.</p>
            </div>
          ) : isReleased ? (
            <AfterReleaseCard
              paperId={paper.id}
              paperCode={paper.code}
              examName={paper.exam}
              releasedAt={paper.scheduledReleaseAt}
              sha256Hash={paper.sha256}
              txHash={paper.txHash}
            />
          ) : (
            <BeforeReleaseCard
              paperCode={paper.code}
              examName={paper.exam}
              scheduledReleaseAt={paper.scheduledReleaseAt}
            />
          )}
        </div>

        {/* Security Details Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-600" /> Security Verification</h2>
            <div className="space-y-3">
              {securityChecks.map(c => (
                <div key={c.label} className={`flex items-center gap-3 p-3 rounded-xl border ${c.done ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${c.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <div>
                    <p className={`text-xs font-bold ${c.done ? 'text-emerald-800' : 'text-slate-500'}`}>{c.label}</p>
                    <p className="text-[10px] text-slate-500">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-purple-200 shadow-subtle p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SHA-256 Integrity Hash</h2>
            <code className="font-mono text-[11px] text-purple-700 bg-purple-50 p-3 rounded-xl block break-all border border-purple-200">{paper.sha256}</code>
          </div>
        </div>
      </div>

      <RevokePaperModal
        paperId={paper.id}
        paperCode={paper.code}
        isOpen={showRevokeModal}
        onClose={() => setShowRevokeModal(false)}
        onRevokedSuccess={() => setPaper({ ...paper, status: 'REVOKED' })}
      />
    </div>
  );
}
