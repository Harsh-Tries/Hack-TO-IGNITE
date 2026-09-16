'use client';

import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Search, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  Link as ChainIcon, 
  Lock, 
  FileText, 
  ArrowRight, 
  RefreshCw 
} from 'lucide-react';
import { verifyPaperIntegrity } from '@/app/actions/paper-actions';

interface VerificationClientViewProps {
  papers: any[];
  initialPaperId?: string;
}

export function VerificationClientView({ papers, initialPaperId }: VerificationClientViewProps) {
  const [selectedPaperId, setSelectedPaperId] = useState(initialPaperId || papers[0]?.id || '');
  const [tamperTestHash, setTamperTestHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);

  const handleVerify = async (useTamper = false) => {
    if (!selectedPaperId) return;
    setLoading(true);

    const testHash = useTamper && tamperTestHash ? tamperTestHash : undefined;
    const res = await verifyPaperIntegrity(selectedPaperId, testHash);

    setLoading(false);
    if (res.success) {
      setVerificationResult(res);
    }
  };

  useEffect(() => {
    if (initialPaperId) {
      handleVerify();
    }
  }, [initialPaperId]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <QrCode className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verify Examination Paper
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Validate question paper cryptographic authenticity against on-chain SHA-256 ledger records.
          </p>
        </div>
      </div>

      {/* Verification Query Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-5">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          1. Select Examination Paper to Verify
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-8">
            <select
              value={selectedPaperId}
              onChange={(e) => {
                setSelectedPaperId(e.target.value);
                setVerificationResult(null);
              }}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {papers.length === 0 ? (
                <option value="">No papers available to verify</option>
              ) : (
                papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.paperCode} — {p.subject} ({p.exam?.title})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="sm:col-span-4 flex gap-2">
            <button
              onClick={() => handleVerify(false)}
              disabled={loading || !selectedPaperId}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Verify Integrity</span>
            </button>
          </div>
        </div>

        {/* Hackathon Demo Simulation: Simulate Tampering */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold">
              DEMO SIMULATOR
            </span>
            <span>Simulate file tampering or bit flip:</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Tampered SHA-256 hash..."
              value={tamperTestHash}
              onChange={(e) => setTamperTestHash(e.target.value)}
              className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono w-48"
            />
            <button
              onClick={() => {
                if (!tamperTestHash) {
                  setTamperTestHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
                }
                handleVerify(true);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] rounded-lg shrink-0"
            >
              Test Tamper
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Card */}
      {verificationResult && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          {verificationResult.matches && !verificationResult.isRevoked ? (
            /* SUCCESS STATE */
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-400 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      INTEGRITY PASSED
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      ✓ PAPER VERIFIED & AUTHENTIC
                    </h2>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  BLOCK #{verificationResult.blockNumber}
                </span>
              </div>

              {/* Checks Passed Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-700">
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>File Exists</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>SHA-256 Valid</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ledger Matched</span>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Not Revoked</span>
                </div>
              </div>

              {/* Cryptographic Comparison */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-slate-500 font-sans font-bold block text-[11px]">
                    Expected Paper Hash (Database):
                  </span>
                  <p className="p-2 bg-white rounded-lg border border-slate-200 text-slate-900 text-[11px] break-all">
                    {verificationResult.expectedHash}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 font-sans font-bold block text-[11px]">
                    On-Chain Anchored Hash (Smart Contract):
                  </span>
                  <p className="p-2 bg-white rounded-lg border border-slate-200 text-emerald-700 font-bold text-[11px] break-all">
                    {verificationResult.onChainHash}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* FAILURE / TAMPER DETECTED STATE */
            <div className="bg-white p-6 rounded-3xl border-2 border-rose-500 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-rose-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-200">
                    <AlertOctagon className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      CRITICAL INTEGRITY ALARM
                    </span>
                    <h2 className="text-xl font-extrabold text-rose-900">
                      🚨 INTEGRITY CHECK FAILED
                    </h2>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  TAMPER DETECTED
                </span>
              </div>

              <p className="text-xs text-rose-700 leading-relaxed font-medium">
                The provided question paper hash does NOT match the immutable cryptographic record registered on the smart contract blockchain. Access and decryption are strictly forbidden.
              </p>

              {/* Hash Mismatch Table */}
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-3 font-mono text-xs text-rose-900">
                <div>
                  <span className="font-sans font-bold block text-[11px]">Expected Blockchain Hash:</span>
                  <p className="p-2 bg-white rounded-lg border border-rose-200 text-slate-800 text-[11px] break-all">
                    {verificationResult.expectedHash}
                  </p>
                </div>
                <div>
                  <span className="font-sans font-bold block text-[11px]">Received / Tampered Hash:</span>
                  <p className="p-2 bg-rose-100/70 rounded-lg border border-rose-300 text-rose-900 font-bold text-[11px] break-all">
                    {verificationResult.receivedHash}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
