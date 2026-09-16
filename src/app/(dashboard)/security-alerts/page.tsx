import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { AlertTriangle, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function SecurityAlertsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                  <ShieldAlert className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Security Alerts & Threat Detection
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Real-time monitoring of early paper access attempts, integrity mismatches, & unauthorized actions.
              </p>
            </div>
          </div>

          {/* Sample Active Security Cards */}
          <div className="space-y-4">
            <div className="p-5 bg-gradient-to-r from-rose-50 to-amber-50 rounded-2xl border border-rose-200/80 shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> 🔴 HIGH SEVERITY
                </span>
                <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded border border-rose-300">
                  BLOCKED BY TIME-LOCK
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">EARLY ACCESS ATTEMPT DETECTED</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Invigilator user <code className="font-mono text-slate-900 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">invigilator@secureexam.demo</code> attempted to request decryption key for <code className="font-mono text-blue-700 font-bold">DSA-2026-001</code> at 08:43 AM before the scheduled 09:00 AM release time.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-rose-200/60 pt-2 font-mono">
                <span>Timestamp: 08:43:12 AM</span>
                <span className="text-emerald-700 font-bold">Action: Automated Lock Enforced</span>
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> 🟡 MEDIUM SEVERITY
                </span>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded border border-amber-300">
                  RESOLVED
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">REPEATED QR VERIFICATION FAILURE</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  3 consecutive QR verification hash checks failed for paper code <code className="font-mono text-slate-900 font-bold">MAT-2026-002</code> from IP address 192.168.1.45.
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
                <span>Timestamp: Yesterday, 04:12 PM</span>
                <span className="text-slate-600 font-bold">Status: Investigated & Cleared</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
