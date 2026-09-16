'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Link as ChainIcon, 
  Search, 
  FileText, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Boxes 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

interface BlockchainClientViewProps {
  records: any[];
  stats: {
    totalRegistered: number;
    confirmedTxns: number;
    totalRevoked: number;
  };
}

export function BlockchainClientView({ records, stats }: BlockchainClientViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  const filtered = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.paperCode?.toLowerCase().includes(term) ||
      r.txHash?.toLowerCase().includes(term) ||
      r.sha256Hash?.toLowerCase().includes(term) ||
      r.paper?.subject?.toLowerCase().includes(term)
    );
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <ChainIcon className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Blockchain Ledger Records
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Immutable cryptographic transaction proofs registered on the ExaminationPaperRegistry smart contract.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Smart Contract Active
          </span>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Registered Papers</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.totalRegistered}</p>
          </div>
          <FileText className="w-5 h-5 text-blue-600" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Confirmed Txns</span>
            <p className="text-2xl font-extrabold text-purple-900 mt-0.5">{stats.confirmedTxns}</p>
          </div>
          <ChainIcon className="w-5 h-5 text-purple-600" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Verification Rate</span>
            <p className="text-2xl font-extrabold text-emerald-900 mt-0.5">100%</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Revoked Papers</span>
            <p className="text-2xl font-extrabold text-rose-900 mt-0.5">{stats.totalRevoked}</p>
          </div>
          <Boxes className="w-5 h-5 text-rose-600" />
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by transaction hash, paper code, or SHA-256..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Transactions Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-subtle text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <ChainIcon className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No blockchain transaction records</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload a question paper in Phase 4 to automatically trigger smart contract ledger registration.
          </p>
          <Link
            href="/papers/upload"
            className="px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-purple-700 transition inline-flex items-center gap-1.5 mt-2"
          >
            <span>Upload Paper to Anchor</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-purple-300 hover:shadow-card cursor-pointer transition duration-200 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    BLOCK #{record.blockNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{record.paperCode}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
              </div>

              <div className="space-y-2 font-mono text-[11px] bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans font-medium">Tx Hash:</span>
                  <span className="text-purple-700 font-bold truncate max-w-[180px]">
                    {record.txHash}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-sans font-medium">SHA-256 Hash:</span>
                  <span className="text-slate-700 truncate max-w-[180px]">
                    {record.sha256Hash}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1 text-slate-500 text-[10px]">
                  <span>Issuer Address:</span>
                  <span className="truncate max-w-[160px] text-slate-700">{record.issuerAddress}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(record.timestamp).toLocaleString()}
                </span>
                <span className="text-purple-600 font-bold inline-flex items-center gap-1">
                  <span>View Payload</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <ChainIcon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Blockchain Transaction Receipt</h3>
                  <p className="text-[11px] text-slate-500">Smart contract execution payload</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 font-sans font-bold">Transaction Hash:</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-purple-700 break-all text-[11px]">{selectedRecord.txHash}</span>
                  <button
                    onClick={() => copyToClipboard(selectedRecord.txHash)}
                    className="p-1 text-slate-400 hover:text-slate-700 shrink-0"
                  >
                    {copiedTx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] text-slate-500 font-sans font-bold">Anchored SHA-256 Hash:</span>
                <p className="text-slate-900 break-all text-[11px]">{selectedRecord.sha256Hash}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-sans block">Block Number:</span>
                  <span className="font-bold text-slate-900">#{selectedRecord.blockNumber}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-sans block">Ledger Status:</span>
                  <span className="font-bold text-emerald-600">✓ SUCCESS_CONFIRMED</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <Link
                href={`/papers/${selectedRecord.paperId}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Go to Paper Details →
              </Link>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
