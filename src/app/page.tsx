'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  Lock, 
  Link as ChainIcon, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  UploadCloud, 
  Key, 
  Search, 
  Cpu
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              SECURE<span className="text-blue-600">EXAM</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Enterprise SaaS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-bold text-slate-700 hover:text-blue-600 px-4 py-2 transition"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
          >
            <span>Continue with Google</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative pt-16 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full text-center md:text-left grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Hero Text */}
        <div className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Tamper-Proof Question Paper Distribution Platform</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Secure the Question Paper. <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Secure the Examination.
            </span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
            Encrypted, blockchain-verified, and time-locked examination paper distribution. Prevent leaks, ensure complete chain-of-custody integrity, and verify authenticity down to the second.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>Continue with Google</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#architecture"
              className="w-full sm:w-auto text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-subtle"
            >
              <span>Explore Security Architecture</span>
            </a>
          </div>

          {/* Quick Security Badges */}
          <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
              <Lock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
              <ChainIcon className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Time-Locked Release</span>
            </div>
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Role-Based Access</span>
            </div>
          </div>
        </div>

        {/* Right Hero Visual Illustration Card */}
        <div className="md:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-glass relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                SECURITY WORKFLOW PIPELINE
              </span>
            </div>

            {/* Pipeline Stage Preview Cards */}
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <UploadCloud className="w-4 h-4 text-blue-600" />
                  <span className="font-sans font-bold text-slate-900">Question Paper Upload</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-bold">SHA-256</span>
              </div>

              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span className="font-sans font-bold text-slate-900">AES-256 Encryption</span>
                </div>
                <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">GCM MODE</span>
              </div>

              <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ChainIcon className="w-4 h-4 text-purple-600" />
                  <span className="font-sans font-bold text-slate-900">Smart Contract Hash Register</span>
                </div>
                <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded font-bold">TX 0x7a3f...9c</span>
              </div>

              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span className="font-sans font-bold text-slate-900">Time-Lock Active</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">09:00 AM RELEASE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture Pipeline Section */}
      <section id="architecture" className="py-20 bg-white border-y border-slate-200 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              End-To-End Chain of Custody
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              The 9-Step Security Distribution Pipeline
            </h2>
            <p className="text-slate-600 text-sm">
              The actual question paper PDF is encrypted locally and NEVER stored on the blockchain. Only cryptographic hashes and metadata reside on-chain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-3 text-center">
            {[
              { step: '01', title: 'Upload', desc: 'Secure PDF Upload' },
              { step: '02', title: 'Encrypt', desc: 'AES-256-GCM' },
              { step: '03', title: 'Hash', desc: 'SHA-256 Signature' },
              { step: '04', title: 'Blockchain', desc: 'Register Hash' },
              { step: '05', title: 'Distribute', desc: 'Assign Centers' },
              { step: '06', title: 'Time Lock', desc: 'Enforce Countdown' },
              { step: '07', title: 'Release', desc: 'Time Reached' },
              { step: '08', title: 'Verify', desc: 'QR & Hash Check' },
              { step: '09', title: 'Audit', desc: 'Immutable Log' },
            ].map((s, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 hover:border-blue-300 transition">
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-100/80 px-2 py-0.5 rounded">
                  {s.step}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-2">{s.title}</h4>
                <p className="text-[10px] text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-white text-xs border-t border-slate-800 px-6 md:px-12 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>SECUREEXAM System Architecture v1.0</span>
          </div>
          <p className="text-slate-400">
            Powered by Next.js, Prisma ORM, AES-256 Encryption & Blockchain Verification.
          </p>
        </div>
      </footer>
    </div>
  );
}
