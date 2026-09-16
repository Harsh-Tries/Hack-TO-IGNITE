'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Lock, Link2, CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

const DEMO_PAPERS: Record<string, any> = {
  p1: { id: 'p1', code: 'QP-DSA-2026-001', exam: 'Data Structures and Algorithms', examCode: 'UE-CSE-2026-001', subject: 'DSA', uploadedBy: 'Dr. Ananya Sharma', status: 'BLOCKCHAIN_REGISTERED', sha256: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e', fileSize: 2457600, createdAt: '2026-09-15T09:30:00Z', txHash: '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a3f9c2e01b44d88e42f9a77c', blockNumber: 12842, network: 'Hardhat Local', contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3', iv: 'a1b2c3d4e5f6a7b8', authTag: 'c7d8e9f0a1b2c3d4' },
  p2: { id: 'p2', code: 'QP-DBMS-2026-001', exam: 'Database Management Systems', examCode: 'UE-CSE-2026-002', subject: 'DBMS', uploadedBy: 'Dr. Ananya Sharma', status: 'ENCRYPTED', sha256: 'b4f9e0d3f8c25a617e03d9b2f41c6a8e0d3f8c25a617e03d9b2f41c6a8e0d3f', fileSize: 1843200, createdAt: '2026-09-15T11:00:00Z', txHash: null, blockNumber: null },
};

export default function PaperDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const paper = DEMO_PAPERS[id] || DEMO_PAPERS['p1'];

  const securityChecks = [
    { label: 'File Encrypted', detail: 'AES-256-GCM', done: ['ENCRYPTED', 'BLOCKCHAIN_REGISTERED', 'ACTIVE'].includes(paper.status) },
    { label: 'SHA-256 Verified', detail: 'Hash integrity confirmed', done: true },
    { label: 'Blockchain Registered', detail: paper.txHash ? `Block #${paper.blockNumber}` : 'Not yet registered', done: !!paper.txHash },
    { label: 'RLS Protected', detail: 'Row Level Security active', done: true },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/papers')} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"><ArrowLeft className="w-4 h-4" /></button>
        <div>
          <div className="flex items-center gap-2"><span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{paper.code}</span><StatusBadge status={paper.status} size="sm" /></div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">{paper.exam}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Details */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Paper Details</h2>
          <div className="space-y-2.5 text-xs">
            {[['Exam Code', paper.examCode], ['Subject', paper.subject], ['Uploaded By', paper.uploadedBy], ['File Size', `${(paper.fileSize / (1024*1024)).toFixed(2)} MB`], ['Uploaded', new Date(paper.createdAt).toLocaleString('en-IN')], ['Encryption', 'AES-256-GCM'], ['IV', paper.iv || '—'], ['Auth Tag', paper.authTag || '—']].map(([k,v]) => (
              <div key={k} className="flex items-start justify-between border-b border-slate-100 pb-2 last:border-0">
                <span className="text-slate-500 font-semibold">{k}</span>
                <span className="font-mono text-slate-800 text-[11px] text-right max-w-[200px] break-all">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Status */}
        <div className="space-y-4">
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

          {/* SHA-256 Hash */}
          <div className="bg-white rounded-2xl border border-purple-200 shadow-subtle p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SHA-256 Integrity Hash</h2>
            <code className="font-mono text-[11px] text-purple-700 bg-purple-50 p-3 rounded-xl block break-all border border-purple-200">{paper.sha256}</code>
          </div>

          {/* Blockchain Record */}
          {paper.txHash && (
            <div className="bg-white rounded-2xl border border-purple-200 shadow-subtle p-5 space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2"><Link2 className="w-4 h-4 text-purple-600" /> Blockchain Record</h2>
              <div className="space-y-2 text-xs">
                <div><p className="text-slate-500 font-semibold mb-0.5">Transaction Hash</p><code className="font-mono text-[10px] text-purple-600 break-all">{paper.txHash}</code></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><p className="text-slate-500 font-semibold">Block #</p><p className="font-bold text-slate-900">{paper.blockNumber}</p></div>
                  <div><p className="text-slate-500 font-semibold">Network</p><p className="font-bold text-slate-900">{paper.network}</p></div>
                </div>
                <div><p className="text-slate-500 font-semibold mb-0.5">Contract Address</p><code className="font-mono text-[10px] text-slate-600">{paper.contractAddress}</code></div>
              </div>
            </div>
          )}

          {!paper.txHash && (
            <button className="w-full text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md">
              <Link2 className="w-4 h-4" /> Register on Blockchain
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
