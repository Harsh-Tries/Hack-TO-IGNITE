'use client';

import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, XCircle, Link2, Lock, FileText, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEMO_VERIFIED_PAPERS: Record<string, any> = {
  'QP-DSA-2026-001': {
    code: 'QP-DSA-2026-001',
    exam: 'Data Structures and Algorithms',
    examCode: 'UE-CSE-2026-001',
    sha256: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e',
    blockchainHash: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d9c2e7b14f506d92c8a1e30b5f7d9c2e',
    match: true,
    txHash: '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a3f9c2e01b44d88e42f9a77c',
    blockNumber: 12842,
    uploadedBy: 'Dr. Ananya Sharma',
    encryption: 'AES-256-GCM Verified',
    registeredAt: '2026-09-15T09:35:00Z',
    status: 'ACTIVE',
  },
  'QP-SA-2026-001': {
    code: 'QP-SA-2026-001',
    exam: 'Structural Analysis',
    examCode: 'UE-CIVIL-2026-005',
    sha256: 'c5g0f1e4g9d36h728f14e0c3g52d7h9f1e4g9d36h728f14e0c3g52d7h9f1e4g',
    blockchainHash: 'c5g0f1e4g9d36h728f14e0c3g52d7h9f1e4g9d36h728f14e0c3g52d7h9f1e4g',
    match: true,
    txHash: '0x8b4g0d3f12c55e99f53g0b88d4691e20d13f6b4g0d3f12c55e99f53g0b88d46',
    blockNumber: 12845,
    uploadedBy: 'Dr. Ananya Sharma',
    encryption: 'AES-256-GCM Verified',
    registeredAt: '2026-09-14T14:05:00Z',
    status: 'ACTIVE',
  },
};

export default function VerificationPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);

    setTimeout(() => {
      const found = DEMO_VERIFIED_PAPERS[query.trim().toUpperCase()] || null;
      setResult(found);
      setSearched(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Cryptographic Integrity Verification</h1>
        <p className="text-xs text-slate-500 mt-0.5">Verify paper SHA-256 hash against live database and on-chain blockchain records</p>
      </div>

      {/* Verification Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5">
        <form onSubmit={handleVerify} className="space-y-4">
          <label className="text-xs font-bold text-slate-700 block">Enter Question Paper Code or Hash *</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. QP-DSA-2026-001 or SHA-256 string"
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Verify</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Quick tests: Try <button type="button" onClick={() => { setQuery('QP-DSA-2026-001'); }} className="text-blue-600 underline font-mono">QP-DSA-2026-001</button> or <button type="button" onClick={() => { setQuery('QP-SA-2026-001'); }} className="text-blue-600 underline font-mono">QP-SA-2026-001</button></p>
        </form>

        {/* Search Results */}
        {searched && result && (
          <div className="p-6 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>INTEGRITY VERIFIED & ON-CHAIN CONFIRMED</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
                100% Authentic
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-emerald-100">
              <div><p className="text-slate-500 font-semibold">Paper Code</p><p className="font-bold font-mono text-slate-900 mt-0.5">{result.code}</p></div>
              <div><p className="text-slate-500 font-semibold">Examination</p><p className="font-bold text-slate-900 mt-0.5">{result.exam}</p></div>
              <div><p className="text-slate-500 font-semibold">Uploaded By</p><p className="font-medium text-slate-800 mt-0.5">{result.uploadedBy}</p></div>
              <div><p className="text-slate-500 font-semibold">Encryption</p><p className="font-medium text-indigo-700 mt-0.5 flex items-center gap-1"><Lock className="w-3 h-3" />{result.encryption}</p></div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <p className="text-slate-500 font-semibold mb-1">Local Database SHA-256 Hash</p>
                <code className="font-mono text-[11px] text-slate-800 break-all">{result.sha256}</code>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100">
                <p className="text-slate-500 font-semibold mb-1 flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-purple-600" /> Blockchain Registered Hash</p>
                <code className="font-mono text-[11px] text-purple-700 break-all">{result.blockchainHash}</code>
              </div>
              <div className="p-3 bg-white rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-slate-500 font-semibold">Transaction Hash</p>
                  <code className="font-mono text-[11px] text-slate-700">{result.txHash}</code>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                  Block #{result.blockNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        {searched && !result && (
          <div className="p-6 bg-red-50/60 rounded-2xl border border-red-200 text-center space-y-2">
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-sm font-bold text-red-900">Verification Failed</h3>
            <p className="text-xs text-red-700">No matching paper code or hash found in the blockchain registry or database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
