'use client';

import React, { useState } from 'react';
import { Lock, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface BeforeReleaseCardProps {
  paperCode: string;
  examName: string;
  scheduledReleaseAt: string;
  onAttemptAccess?: () => void;
}

export function BeforeReleaseCard({ paperCode, examName, scheduledReleaseAt, onAttemptAccess }: BeforeReleaseCardProps) {
  const [attemptError, setAttemptError] = useState<string | null>(null);

  const handleEarlyClick = () => {
    setAttemptError(`ACCESS DENIED: Paper ${paperCode} is time-locked until ${new Date(scheduledReleaseAt).toLocaleTimeString('en-IN')}. Early access attempt recorded in security alerts.`);
    if (onAttemptAccess) onAttemptAccess();
  };

  return (
    <div className="bg-white rounded-3xl border border-amber-200/80 shadow-glass p-6 md:p-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8 text-amber-500 stroke-[2.2]" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
          🔒 QUESTION PAPER TIME-LOCKED
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mt-1">{examName}</h2>
        <p className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-block">{paperCode}</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-500 text-center uppercase tracking-wider">Available In</p>
        <CountdownTimer targetDate={scheduledReleaseAt} />
        <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1 mt-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          Scheduled Release: <span className="font-bold text-slate-800">{new Date(scheduledReleaseAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </p>
      </div>

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-2">
        <div className="flex items-center gap-2 text-emerald-700 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cryptographically Secured
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          The question paper has been encrypted with AES-256-GCM, hashed with SHA-256, and registered on the blockchain. Server-side UTC time locks prevent access until the exact scheduled time.
        </p>
      </div>

      {attemptError && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Time-Lock Enforcement Warning</span>
          </div>
          <p className="text-[11px] leading-relaxed">{attemptError}</p>
        </div>
      )}

      <button
        onClick={handleEarlyClick}
        className="w-full py-3 bg-slate-100 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-slate-400 hover:text-amber-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
      >
        <Lock className="w-4 h-4" /> Request Early Access (Security Test)
      </button>
    </div>
  );
}
