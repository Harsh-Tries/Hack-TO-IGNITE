'use client';

import React from 'react';
import Link from 'next/link';
import { Link2, CheckCircle2, Clock, ExternalLink } from 'lucide-react';

const DEMO_RECORDS = [
  { id: 'br1', paperCode: 'QP-DSA-2026-001', exam: 'Data Structures and Algorithms', txHash: '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a3f9c2e01b44d88e42f9a77c', blockNumber: 12842, paperHash: 'a3f8d9c2e7b14f506d92c8a1e30b5f7d', registeredAt: '2026-09-15T09:35:00Z', status: 'CONFIRMED', registeredBy: 'Dr. Ananya Sharma', network: 'Hardhat Local' },
  { id: 'br2', paperCode: 'QP-SA-2026-001', exam: 'Structural Analysis', txHash: '0x8b4a0d3f12c55e99f53a0b88d4691e20d13f6b4a0d3f12c55e99f53a0b88d46', blockNumber: 12845, paperHash: 'c5a0f1e4a9d36b728f14e0c3a52d7b9f', registeredAt: '2026-09-14T14:05:00Z', status: 'CONFIRMED', registeredBy: 'Dr. Ananya Sharma', network: 'Hardhat Local' },
];

const STATS = [
  { label: 'Total Registered', value: 2, icon: Link2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { label: 'Confirmed', value: 2, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { label: 'Pending', value: 0, icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
];

export default function BlockchainPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Blockchain Registry</h1>
        <p className="text-xs text-slate-500 mt-0.5">Immutable on-chain hash registry for examination papers via Solidity smart contract</p>
      </div>

      {/* Contract Info Banner */}
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="w-5 h-5 text-purple-300" />
          <span className="text-xs font-bold text-purple-200">ExaminationPaperRegistry.sol</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div><p className="text-purple-300 font-semibold">Contract Address</p><code className="font-mono text-white break-all">0x5FbDB2315678afecb367f032d93F642f64180aa3</code></div>
          <div><p className="text-purple-300 font-semibold">Network</p><p className="text-white font-bold">Hardhat Local (Chain ID: 31337)</p></div>
          <div><p className="text-purple-300 font-semibold">Total Registered</p><p className="text-white font-bold text-2xl">{DEMO_RECORDS.length}</p></div>
          <div><p className="text-purple-300 font-semibold">Verified</p><p className="text-emerald-400 font-bold text-2xl">{DEMO_RECORDS.filter(r => r.status === 'CONFIRMED').length}</p></div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {STATS.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-white rounded-xl p-4 border shadow-subtle flex items-center gap-3 ${s.color.split(' ').slice(1).join(' ')}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${s.color}`}><Icon className="w-4 h-4" /></div>
              <div><p className="text-xl font-extrabold text-slate-900">{s.value}</p><p className="text-[11px] text-slate-500">{s.label}</p></div>
            </div>
          );
        })}
      </div>

      {/* Transaction Records */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900">Blockchain Transactions</h2>
          <Link href="/verification" className="text-xs font-bold text-blue-600 hover:underline">Verify a Paper →</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {DEMO_RECORDS.map(r => (
            <div key={r.id} className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">{r.paperCode}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" />{r.status}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{r.exam}</p>
                  <p className="text-[11px] text-slate-500">Registered by {r.registeredBy} • {new Date(r.registeredAt).toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-slate-500">Block #{r.blockNumber}</p>
                  <p className="font-semibold text-slate-700">{r.network}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2"><span className="text-slate-500 font-semibold shrink-0 w-20">TX Hash</span><code className="font-mono text-[10px] text-purple-600 break-all">{r.txHash}</code></div>
                <div className="flex items-center gap-2"><span className="text-slate-500 font-semibold shrink-0 w-20">Paper Hash</span><code className="font-mono text-[10px] text-slate-700">{r.paperHash}...</code></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
