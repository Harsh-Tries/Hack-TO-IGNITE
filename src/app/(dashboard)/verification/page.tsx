import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { QrCode, ShieldCheck, Search, CheckCircle2 } from 'lucide-react';

export default async function VerificationPlaceholderPage() {
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
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <QrCode className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Verify Examination Paper
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Confirm authenticity, check SHA-256 integrity, & scan QR verification codes.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              PHASE 7 FEATURE
            </span>
          </div>

          {/* Placeholder Card */}
          <div className="bg-white p-10 rounded-3xl border border-slate-200/80 shadow-glass text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <QrCode className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                📱 Camera QR Scanner & Hash Verification — Coming in Phase 7
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Instant Integrity & Hash Matching Engine
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Invigilators and auditors will scan unique paper QR codes to match live SHA-256 hashes against blockchain registration records in Phase 7.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
