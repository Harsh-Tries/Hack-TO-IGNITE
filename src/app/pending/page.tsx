'use client';

import React from 'react';
import { Clock, ShieldAlert, CheckCircle2, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function PendingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/80 shadow-glass text-center space-y-6">
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-200">
          <Clock className="w-7 h-7 stroke-[2.2] animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-800 border border-amber-300">
            Account Pending Approval
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Role Assignment Pending
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your Google Account has been verified successfully. Your application access request is currently queued for administrator approval.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-slate-700">
            <span>Authentication Provider:</span>
            <span className="text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Google OAuth
            </span>
          </div>
          <div className="flex items-center justify-between font-semibold text-slate-700">
            <span>Assigned Role:</span>
            <span className="text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              PENDING
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
