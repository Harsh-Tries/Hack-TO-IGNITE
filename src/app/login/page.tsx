'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, CheckCircle2, Link2, Clock, Key, ArrowRight, AlertCircle } from 'lucide-react';
import { DEMO_USERS } from '@/lib/demo-data';

const DEMO_SESSION_KEY = 'secureexam_demo_session';

const DEMO_ROLES = [
  { email: 'admin@secureexam.demo', label: 'Super Admin — Harsh Wagh', role: 'SUPER_ADMIN' },
  { email: 'exam.admin@secureexam.demo', label: 'Exam Admin — Prof. Rajesh Kumar', role: 'EXAM_ADMIN' },
  { email: 'setter@secureexam.demo', label: 'Question Setter — Dr. Ananya Sharma', role: 'QUESTION_SETTER' },
  { email: 'college@secureexam.demo', label: 'College Admin — Principal V. S. Patil', role: 'COLLEGE_ADMIN' },
  { email: 'invigilator@secureexam.demo', label: 'Invigilator — Prof. Suresh Mehta', role: 'INVIGILATOR' },
  { email: 'auditor@secureexam.demo', label: 'Security Auditor — Vikramaditya Rao', role: 'AUDITOR' },
  { email: 'pending@secureexam.demo', label: 'Pending User — New Faculty Member', role: 'PENDING' },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedEmail, setSelectedEmail] = useState('admin@secureexam.demo');
  const [loading, setLoading] = useState(false);
  const [googleInfo, setGoogleInfo] = useState(false);

  const handleDemoLogin = () => {
    setLoading(true);
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ email: selectedEmail }));
    const user = DEMO_USERS[selectedEmail];
    if (user?.role === 'PENDING') {
      router.push('/pending');
    } else if (user?.status === 'SUSPENDED') {
      router.push('/suspended');
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && url !== 'https://your-project.supabase.co') {
      window.location.href = `${url}/auth/v1/authorize?provider=google&redirect_to=${window.location.origin}/auth/callback`;
    } else {
      setGoogleInfo(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">
      {/* Left Panel */}
      <div className="lg:w-1/2 bg-slate-900 text-white p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-white text-xl tracking-tight">SECURE<span className="text-blue-400">EXAM</span></span>
            <p className="text-xs text-slate-400">Blockchain • Encryption • Trust</p>
          </div>
        </div>

        <div className="my-12 relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" /> High-Security Examination Platform
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Cryptographic Trust &amp; Blockchain-Verified Question Paper Distribution
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed max-w-md">
              AES-256-GCM paper encryption, SHA-256 integrity hashing, smart contract blockchain verification, and strict role-based access control.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Lock, label: 'AES-256 Encrypted', desc: 'Server-side encryption before storage', color: 'text-blue-400' },
              { icon: Link2, label: 'Blockchain Verified', desc: 'Immutable hash registry on-chain', color: 'text-purple-400' },
              { icon: Clock, label: 'Time-Lock Ready', desc: 'Phase 6 release enforcement', color: 'text-indigo-400' },
              { icon: CheckCircle2, label: 'Role-Based Access', desc: 'Strict authorization + audit trails', color: 'text-emerald-400' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-md">
                <div className={`flex items-center gap-2 text-xs font-bold mb-1 ${color}`}>
                  <Icon className="w-4 h-4" /> {label}
                </div>
                <p className="text-[11px] text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 relative z-10">© 2026 SECUREEXAM Platform. Authorized Personnel Only.</p>
      </div>

      {/* Right Panel */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200/80 shadow-glass space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <Lock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Secure access to SecureExam</h2>
            <p className="text-xs font-semibold text-slate-500">Authorized examination personnel only.</p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-sm transition flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">OAuth 2.0</span>
          </button>

          {googleInfo && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Supabase not configured. Add <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> to .env.local to enable Google OAuth. Use demo mode below.</span>
            </div>
          )}

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative bg-white px-3 text-[11px] font-bold text-slate-400 uppercase">Or Use Demo Mode</span>
          </div>

          {/* Demo Role Selector */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-500" /> Select Demo Role
              </span>
              <span className="text-[10px] font-mono text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">DEMO MODE</span>
            </div>
            <select
              value={selectedEmail}
              onChange={(e) => setSelectedEmail(e.target.value)}
              className="w-full bg-white text-xs font-semibold text-slate-800 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {DEMO_ROLES.map(r => <option key={r.email} value={r.email}>{r.label}</option>)}
            </select>
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>Enter as Selected Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            New Google users are assigned <strong className="text-slate-600">PENDING</strong> status until activated by Super Admin.
          </p>
        </div>
      </div>
    </div>
  );
}
