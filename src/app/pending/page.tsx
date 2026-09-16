'use client';

import { useRouter } from 'next/navigation';
import { Clock, ArrowLeft } from 'lucide-react';

export default function PendingPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-glass p-10 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
          <Clock className="w-10 h-10 text-amber-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">Account Pending Approval</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your account has been registered. A Super Administrator will review your account and assign you an appropriate role.
          </p>
        </div>
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-left space-y-2">
          <p className="text-xs font-bold text-amber-800">What happens next?</p>
          <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
            <li>Super Admin reviews your Google account</li>
            <li>An appropriate role will be assigned</li>
            <li>You will be notified once your account is activated</li>
          </ul>
        </div>
        <button onClick={() => router.push('/login')} className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline mx-auto">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
      </div>
    </div>
  );
}
