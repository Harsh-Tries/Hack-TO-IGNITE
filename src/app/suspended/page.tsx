'use client';

import { useRouter } from 'next/navigation';
import { ShieldX, LogOut } from 'lucide-react';

export default function SuspendedPage() {
  const router = useRouter();
  const handleSignOut = () => {
    localStorage.removeItem('secureexam_demo_session');
    router.push('/login');
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-red-200 shadow-glass p-10 max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">Account Suspended</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your account has been suspended. Please contact a Super Administrator to resolve this issue.
          </p>
        </div>
        <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-700">
          Access to SecureExam has been restricted. All activity is being logged.
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-red-600 mx-auto transition">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
