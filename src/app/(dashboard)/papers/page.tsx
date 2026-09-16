import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { FileText, Lock, ShieldCheck, UploadCloud, Link as ChainIcon } from 'lucide-react';

export default async function QuestionPapersPlaceholderPage() {
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
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <FileText className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Question Papers
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Encrypted question paper repository & blockchain hash registration.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              PHASE 4 FEATURE
            </span>
          </div>

          {/* Placeholder Banner */}
          <div className="bg-white p-10 rounded-3xl border border-slate-200/80 shadow-glass text-center space-y-4 max-w-2xl mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <Lock className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                🔒 AES-256 Paper Encryption — Coming Soon in Phase 4
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Secure Question Paper Upload Pipeline
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                The paper upload pipeline will encrypt PDF documents locally using AES-256-GCM, compute SHA-256 integrity signatures, and register cryptographic metadata on the blockchain smart contract.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 font-mono text-[11px] text-slate-600 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <UploadCloud className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span>Drag & Drop Upload</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <Lock className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <span>AES-256-GCM</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <ChainIcon className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <span>Hardhat Blockchain</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
