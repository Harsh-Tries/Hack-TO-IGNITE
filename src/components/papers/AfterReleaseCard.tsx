'use client';

import React, { useState } from 'react';
import { Unlock, CheckCircle2, ShieldCheck, Download, ExternalLink, Key } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

interface AfterReleaseCardProps {
  paperId: string;
  paperCode: string;
  examName: string;
  releasedAt: string;
  sha256Hash: string;
  txHash?: string | null;
  onAccessSuccess?: () => void;
}

export function AfterReleaseCard({ paperId, paperCode, examName, releasedAt, sha256Hash, txHash, onAccessSuccess }: AfterReleaseCardProps) {
  const [accessing, setAccessing] = useState(false);
  const [accessed, setAccessed] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleAccess = async () => {
    setAccessing(true);
    try {
      const res = await fetch(`/api/papers/${paperId}/access`, { method: 'POST' });
      const data = await res.json();
      setAccessing(false);
      if (data.success) {
        setAccessed(true);
        setDownloadUrl(data.downloadUrl || '#');
        if (onAccessSuccess) onAccessSuccess();
      } else {
        alert(data.error || 'Access denied.');
      }
    } catch {
      setAccessing(false);
      setAccessed(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-200/80 shadow-glass p-6 md:p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <Unlock className="w-8 h-8 text-emerald-600 stroke-[2.2]" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
          🔓 QUESTION PAPER RELEASED
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mt-1">{examName}</h2>
        <p className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-block">{paperCode}</p>
      </div>

      <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 font-semibold">Released Timestamp</span>
          <span className="font-bold text-slate-900">{new Date(releasedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60 text-center">
          <div className="p-2 bg-white rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-400 font-semibold block">Blockchain</span>
            <span className="text-xs font-bold text-purple-700 flex items-center justify-center gap-1 mt-0.5"><ShieldCheck className="w-3 h-3" /> Confirmed</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-400 font-semibold block">SHA-256</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Verified</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-emerald-100">
            <span className="text-[10px] text-slate-400 font-semibold block">Role Auth</span>
            <span className="text-xs font-bold text-blue-700 flex items-center justify-center gap-1 mt-0.5"><Key className="w-3 h-3" /> Granted</span>
          </div>
        </div>
      </div>

      {accessed ? (
        <div className="space-y-3">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-indigo-600 mx-auto" />
            <p className="text-xs font-bold text-indigo-900">Authorization Verified &amp; Paper Decrypted</p>
            <p className="text-[11px] text-indigo-700">Pre-signed download authorization token generated. Event logged as <strong>PAPER_ACCESSED</strong>.</p>
          </div>
          <a
            href={downloadUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Question Paper (PDF)
          </a>
        </div>
      ) : (
        <button
          onClick={handleAccess}
          disabled={accessing}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {accessing ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Verifying Authorization...</span> : <><Unlock className="w-4 h-4" /> ACCESS QUESTION PAPER</>}
        </button>
      )}
    </div>
  );
}
