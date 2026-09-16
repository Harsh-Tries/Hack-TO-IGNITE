'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { RightPanel } from '@/components/layout/right-panel';
import { StatCard } from '@/components/ui/stat-card';
import { QuickActionCard } from '@/components/ui/quick-action-card';
import { SecurityOverview } from '@/components/ui/security-overview';
import { 
  Shield, 
  Lock, 
  Link as ChainIcon, 
  Clock, 
  ShieldCheck, 
  PlusCircle, 
  Upload, 
  Building2, 
  QrCode, 
  ShieldAlert, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { SecurityStat } from '@/types';

const STATS_DATA: SecurityStat[] = [
  {
    title: 'Total Exams',
    value: 12,
    change: '↑ 2 this week',
    trend: 'up',
    icon: 'GraduationCap',
  },
  {
    title: 'Papers Uploaded',
    value: 28,
    change: '↑ 4 this week',
    trend: 'up',
    icon: 'FileText',
  },
  {
    title: 'Assigned Centers',
    value: 15,
    change: '↑ 1 this week',
    trend: 'up',
    icon: 'Building2',
  },
  {
    title: 'Released Papers',
    value: 8,
    change: '↑ 2 today',
    trend: 'up',
    icon: 'Unlock',
  },
  {
    title: 'Security Alerts',
    value: 2,
    change: '🚨 1 High Severity',
    trend: 'down',
    icon: 'AlertTriangle',
    isAlert: true,
  },
  {
    title: 'Blockchain Txns',
    value: 42,
    change: '100% Confirmed',
    trend: 'up',
    icon: 'Link',
  },
];

const QUICK_ACTIONS = [
  {
    id: 'qa-1',
    title: 'CREATE EXAM',
    description: 'Set up a new examination schedule',
    href: '/exams',
    iconType: 'CREATE',
  },
  {
    id: 'qa-2',
    title: 'UPLOAD PAPER',
    description: 'Securely encrypt & hash question paper',
    href: '/papers',
    iconType: 'UPLOAD',
  },
  {
    id: 'qa-3',
    title: 'ASSIGN CENTERS',
    description: 'Distribute papers to authorized centers',
    href: '/colleges',
    iconType: 'ASSIGN',
  },
  {
    id: 'qa-4',
    title: 'VERIFY PAPER',
    description: 'Confirm SHA-256 & blockchain integrity',
    href: '/verification',
    iconType: 'VERIFY',
  },
  {
    id: 'qa-5',
    title: 'BLOCKCHAIN',
    description: 'Inspect smart contract registration records',
    href: '/blockchain',
    iconType: 'BLOCKCHAIN',
  },
  {
    id: 'qa-6',
    title: 'SECURITY ALERTS',
    description: 'Monitor suspicious early access attempts',
    href: '/security-alerts',
    iconType: 'ALERTS',
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Harsh Wagh';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* 1. Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Topbar Header */}
        <Topbar />

        {/* Content Shell + Right Activity Panel */}
        <div className="flex-1 flex min-w-0">
          <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
            {/* Hero Dashboard Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-blue-900/10 border border-blue-600/30">
              {/* Background glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl pointer-events-none"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                    <span>SECUREEXAM System Core Active</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    Welcome back, {userName}! 👋
                  </h2>

                  <p className="text-blue-100 text-xs md:text-sm leading-relaxed max-w-xl">
                    Your examination security is under control. Secure examination paper distribution powered by AES-256 encryption, blockchain verification, and time-locked access.
                  </p>

                  {/* Security Badges Bar */}
                  <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium">
                    <span className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 transition">
                      🔐 Encrypted Papers
                    </span>
                    <span className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 transition">
                      ⛓ Blockchain Verified
                    </span>
                    <span className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 transition">
                      ⏱ Time Locked
                    </span>
                    <span className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center gap-2 transition">
                      🛡 Role Based Access
                    </span>
                  </div>
                </div>

                {/* Right Hero Graphic Box */}
                <div className="lg:col-span-4 hidden lg:flex justify-end">
                  <div className="w-48 h-48 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 flex flex-col items-center justify-center text-center space-y-3 shadow-inner">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center shadow-md">
                      <Shield className="w-7 h-7 text-white stroke-[2.5]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">0 Leaks Detected</p>
                      <p className="text-[10px] text-blue-200 mt-0.5">100% Cryptographic Assurance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6 Statistic Cards Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Key Security Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {STATS_DATA.map((stat, idx) => (
                  <StatCard key={idx} {...stat} />
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Quick Security Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUICK_ACTIONS.map((action) => (
                  <QuickActionCard key={action.id} {...action} />
                ))}
              </div>
            </div>

            {/* Security Overview Diagnostics */}
            <SecurityOverview />
          </main>

          {/* 3. Right Panel (Recent Activity Feed) */}
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
