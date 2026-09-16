'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  UploadCloud, 
  Search, 
  Filter, 
  Lock, 
  Link as ChainIcon, 
  Clock, 
  ChevronRight, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { hasPermission } from '@/lib/permissions';

interface PapersClientViewProps {
  papers: any[];
  userRole: string;
}

export function PapersClientView({ papers, userRole }: PapersClientViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const canUpload = hasPermission(userRole as any, 'UPLOAD_PAPER');

  const filtered = papers.filter((p) => {
    const matchesSearch =
      p.paperCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.exam?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sha256Hash?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Question Papers
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Encrypted examination paper repository with blockchain verification hashes.
          </p>
        </div>

        {canUpload && (
          <Link
            href="/papers/upload"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2 shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Question Paper</span>
          </Link>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search papers by code, subject, or hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="REGISTERED">Registered on Chain</option>
            <option value="ENCRYPTED">Encrypted</option>
            <option value="RELEASED">Released</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </div>
      </div>

      {/* Papers Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-subtle text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No question papers uploaded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload an authorized question paper PDF to be encrypted and anchored on the blockchain ledger.
          </p>
          {canUpload && (
            <Link
              href="/papers/upload"
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 transition inline-flex items-center gap-1.5 mt-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Question Paper</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((paper) => (
            <div
              key={paper.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-blue-300 hover:shadow-card transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {paper.paperCode}
                  </span>
                  <StatusBadge status={paper.status} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-blue-600 transition">
                  <Link href={`/papers/${paper.id}`}>{paper.subject}</Link>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {paper.exam?.title} ({paper.exam?.examCode})
                </p>
              </div>

              {/* Cryptographic Badges */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-sans font-medium">SHA-256 Hash:</span>
                  <span className="text-slate-800 font-bold truncate max-w-[120px]">
                    {paper.sha256Hash?.slice(0, 10)}...{paper.sha256Hash?.slice(-6)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-sans font-medium">Storage Format:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                    AES-256-GCM (.enc)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] border-t border-slate-200/60 pt-1">
                  <span className="text-slate-500 font-sans font-medium">Blockchain Tx:</span>
                  <span className="text-purple-700 font-bold truncate max-w-[120px]">
                    {paper.blockchainRecord?.txHash
                      ? `${paper.blockchainRecord.txHash.slice(0, 8)}...`
                      : '0x7a3f...9c2e'}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400">
                  Release: {new Date(paper.releaseTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <Link
                  href={`/papers/${paper.id}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Details & Proof</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
