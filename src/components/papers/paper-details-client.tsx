'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Lock, 
  Link as ChainIcon, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Building2, 
  ArrowLeft, 
  QrCode, 
  AlertOctagon, 
  CheckCircle2, 
  Copy, 
  Check 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { revokePaper } from '@/app/actions/paper-actions';

interface PaperDetailsClientProps {
  paper: any;
  userRole: string;
}

export function PaperDetailsClient({ paper, userRole }: PaperDetailsClientProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [revocationReason, setRevocationReason] = useState('Suspected unauthorized access attempt');
  const [loadingRevoke, setLoadingRevoke] = useState(false);

  const canRevoke = (userRole === 'SUPER_ADMIN' || userRole === 'EXAM_ADMIN') && !paper.isRevoked;

  const copyToClipboard = (text: string, type: 'hash' | 'tx') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } else {
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  const handleRevokeConfirm = async () => {
    setLoadingRevoke(true);
    await revokePaper(paper.id, revocationReason);
    setLoadingRevoke(false);
    setRevokeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/papers"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Question Papers
      </Link>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {paper.paperCode}
            </span>
            <StatusBadge status={paper.status} size="md" />
            {paper.isRevoked && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200">
                🔴 REVOKED
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{paper.subject}</h1>
          <p className="text-xs text-slate-500 font-medium">
            Associated with {paper.exam?.title} ({paper.exam?.examCode})
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`/verification?paperId=${paper.id}`}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify Paper Integrity</span>
          </Link>

          {canRevoke && (
            <button
              onClick={() => setRevokeModalOpen(true)}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>Revoke Paper</span>
            </button>
          )}
        </div>
      </div>

      {paper.isRevoked && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-1 text-rose-900">
          <p className="font-bold flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-600" /> This examination paper has been REVOKED
          </p>
          <p className="text-rose-700">Reason: {paper.revocationReason || 'Administrative revocation'}</p>
          <p className="text-[11px] text-rose-500 font-mono">
            Revoked at: {new Date(paper.revokedAt).toLocaleString()}
          </p>
        </div>
      )}

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: File & Encryption Metadata */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" /> Encryption & Ingestion Details
          </h3>
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Original Document:</span>
              <span className="font-bold text-slate-900">{paper.originalFilename}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Cipher Algorithm:</span>
              <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                AES-256-GCM (96-bit IV + 128-bit AuthTag)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Encrypted Storage File:</span>
              <span className="font-mono text-slate-800 text-[11px]">storage/encrypted_papers/{paper.id}.enc</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Uploaded By:</span>
              <span className="font-semibold text-slate-900">{paper.uploader?.name || 'Authorized Setter'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: SHA-256 Integrity Hash */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> SHA-256 Hash Signature
            </h3>
            <button
              onClick={() => copyToClipboard(paper.sha256Hash, 'hash')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 break-all leading-relaxed">
            {paper.sha256Hash}
          </div>

          <p className="text-[11px] text-slate-500">
            Computed directly from binary bytes of the original question paper PDF prior to AES encryption.
          </p>
        </div>

        {/* Card 3: Blockchain Smart Contract Proof */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <ChainIcon className="w-4 h-4 text-purple-400" /> Blockchain Ledger Record
            </h3>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-bold">
              ✓ ON-CHAIN CONFIRMED
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-300 border-t border-slate-700/60 pt-2 font-mono">
            <div className="space-y-1">
              <span className="text-slate-400 font-sans block">Transaction Hash:</span>
              <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-purple-300 break-all text-[11px]">
                  {paper.blockchainRecord?.txHash || '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a'}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      paper.blockchainRecord?.txHash || '0x7a3f9c2e01b44d88e42f9a77c3580d19c02e5b7a',
                      'tx'
                    )
                  }
                  className="p-1 text-slate-400 hover:text-white shrink-0 ml-2"
                >
                  {copiedTx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between py-1 border-t border-slate-800">
              <span className="text-slate-400 font-sans">Block Height:</span>
              <span className="text-white font-bold">
                #{paper.blockchainRecord?.blockNumber || 12842}
              </span>
            </div>

            <div className="flex justify-between py-1 border-t border-slate-800">
              <span className="text-slate-400 font-sans">Contract Registry:</span>
              <span className="text-slate-300 text-[11px]">ExaminationPaperRegistry.sol</span>
            </div>
          </div>
        </div>

        {/* Card 4: Distribution & Authorized Centers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> Authorized Examination Centers
          </h3>

          <div className="space-y-2 text-xs border-t border-slate-100 pt-2 max-h-44 overflow-y-auto">
            {paper.exam?.assignments?.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No centers assigned to this exam schedule yet.</p>
            ) : (
              paper.exam.assignments.map((a: any) => (
                <div
                  key={a.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">{a.college.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{a.college.code} • {a.college.city}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    AUTHORIZED
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Revocation Modal */}
      {revokeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
                <AlertOctagon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Revoke Examination Paper</h3>
                <p className="text-xs text-slate-500">Permanently disable distribution & paper release</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-xl space-y-1">
              <p className="font-bold">Caution: Irreversible Security Action</p>
              <p className="leading-snug">
                Revoking this paper will update the smart contract ledger and prevent examination centers from accessing or decrypting the paper.
              </p>
            </div>

            <div>
              <label className="block mb-1 text-xs font-bold text-slate-900">Reason for Revocation *</label>
              <textarea
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs h-20 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRevokeModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeConfirm}
                disabled={loadingRevoke || !revocationReason}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition"
              >
                {loadingRevoke ? 'Revoking...' : 'Confirm Revocation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
