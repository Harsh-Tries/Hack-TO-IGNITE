'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield, ShieldCheck, Calendar, ChevronRight, Lock, Link2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const DEMO_EXAMS = [
  { id: 'e1', code: 'UE-CSE-2026-001', name: 'Data Structures and Algorithms', department: 'Computer Engineering', semester: 'Semester IV', date: '2026-10-15', time: '09:00 AM', duration: 180, centers: 4, status: 'SCHEDULED' },
  { id: 'e2', code: 'UE-CSE-2026-002', name: 'Database Management Systems', department: 'Computer Engineering', semester: 'Semester VI', date: '2026-10-18', time: '02:00 PM', duration: 180, centers: 3, status: 'SCHEDULED' },
  { id: 'e3', code: 'UE-IT-2026-003', name: 'Web Technology and Applications', department: 'Information Technology', semester: 'Semester V', date: '2026-10-20', time: '09:00 AM', duration: 150, centers: 2, status: 'DRAFT' },
  { id: 'e4', code: 'UE-MECH-2026-004', name: 'Thermodynamics and Heat Transfer', department: 'Mechanical Engineering', semester: 'Semester III', date: '2026-10-22', time: '09:00 AM', duration: 180, centers: 3, status: 'SCHEDULED' },
];

const SECURITY_STATUS = [
  { label: 'Google Authentication', status: 'Active', phase: null },
  { label: 'Role-Based Access Control', status: 'Active', phase: null },
  { label: 'Supabase Database', status: 'Connected', phase: null },
  { label: 'Row Level Security', status: 'Active', phase: null },
  { label: 'Audit Logging', status: 'Active', phase: null },
  { label: 'AES-256 Encryption', status: 'Active', phase: null },
  { label: 'SHA-256 Integrity', status: 'Active', phase: null },
  { label: 'Blockchain Ledger', status: 'Active', phase: null },
  { label: 'Time-Lock Release', status: null, phase: 'Coming Soon' },
  { label: 'QR Verification', status: null, phase: 'Coming Soon' },
];

function getStatsForRole(role: UserRole) {
  if (role === 'SUPER_ADMIN') return [
    { title: 'Total Users', value: 7, change: '5 Active', trend: 'up' as const, icon: 'Users' },
    { title: 'Pending Approval', value: 1, change: 'Action Required', trend: 'down' as const, icon: 'AlertTriangle', isAlert: true },
    { title: 'Total Exams', value: 6, change: '4 Scheduled', trend: 'up' as const, icon: 'GraduationCap' },
    { title: 'Exam Centers', value: 4, change: '4 Active', trend: 'up' as const, icon: 'Building2' },
    { title: 'Audit Events', value: 42, change: 'All recorded', trend: 'up' as const, icon: 'ShieldCheck' },
    { title: 'System Health', value: '100%', change: 'Operational', trend: 'up' as const, icon: 'Lock' },
  ];
  if (role === 'EXAM_ADMIN') return [
    { title: 'Total Exams', value: 6, change: '4 Scheduled', trend: 'up' as const, icon: 'GraduationCap' },
    { title: 'Exam Centers', value: 4, change: 'Assigned', trend: 'up' as const, icon: 'Building2' },
    { title: 'Question Papers', value: 3, change: 'Encrypted', trend: 'up' as const, icon: 'Lock' },
    { title: 'Audit Events', value: 42, change: 'Monitored', trend: 'up' as const, icon: 'ShieldCheck' },
  ];
  if (role === 'QUESTION_SETTER') return [
    { title: 'My Uploaded Papers', value: 2, change: 'Encrypted', trend: 'up' as const, icon: 'Lock' },
    { title: 'Assigned Exams', value: 3, change: 'Active', trend: 'up' as const, icon: 'GraduationCap' },
    { title: 'Blockchain Status', value: 2, change: 'Confirmed', trend: 'up' as const, icon: 'Link2' },
  ];
  if (role === 'COLLEGE_ADMIN' || role === 'INVIGILATOR') return [
    { title: 'Assigned Exams', value: 3, change: 'Scheduled', trend: 'up' as const, icon: 'GraduationCap' },
    { title: 'My College', value: 1, change: 'Active Center', trend: 'up' as const, icon: 'Building2' },
    { title: 'Upcoming Today', value: 0, change: 'No exams today', trend: 'neutral' as const, icon: 'Calendar' },
  ];
  return [
    { title: 'Total Exams', value: 6, change: 'Monitored', trend: 'up' as const, icon: 'GraduationCap' },
    { title: 'Audit Events', value: 42, change: 'Recorded', trend: 'up' as const, icon: 'ShieldCheck' },
    { title: 'Security Alerts', value: 3, change: '1 Open', trend: 'down' as const, icon: 'AlertTriangle', isAlert: true },
  ];
}

export default function DashboardPage() {
  const { user, isLoading } = useDemoSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted || isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  const role = (user?.role || 'SUPER_ADMIN') as UserRole;
  const stats = getStatsForRole(role);
  const visibleExams = (role === 'COLLEGE_ADMIN' || role === 'INVIGILATOR') ? DEMO_EXAMS.slice(0, 2) : DEMO_EXAMS;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg border border-blue-600/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>SECUREEXAM — Phases 1–5 Active</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 👋
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-xl">
              Your examination security platform is operational. Role-based access, AES-256 encryption, blockchain verification, and complete audit trails are active.
            </p>
            <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">🛡 RBAC Active</span>
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">🔐 AES-256 Encryption</span>
              <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">⛓ Blockchain Verified</span>
            </div>
          </div>
          <div className="lg:col-span-4 hidden lg:flex justify-end">
            <div className="w-44 h-44 rounded-2xl bg-white/10 border border-white/20 p-4 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white stroke-[2.5]" />
              </div>
              <p className="text-xs font-bold text-white">0 Security Breaches</p>
              <p className="text-[10px] text-blue-200">All Systems Secure</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Upcoming Examinations</h3>
              <p className="text-[11px] text-slate-500">Next scheduled examinations</p>
            </div>
          </div>
          <Link href="/exams" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {visibleExams.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No upcoming examinations.</p>
        ) : (
          <div className="space-y-2">
            {visibleExams.map((exam) => (
              <Link key={exam.id} href={`/exams/${exam.id}`}>
                <div className="p-3.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{exam.code}</span>
                      <StatusBadge status={exam.status} size="sm" />
                    </div>
                    <h4 className="font-bold text-slate-900">{exam.name}</h4>
                    <p className="text-[11px] text-slate-500">{exam.department} • {exam.semester}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div>
                      <p className="text-[11px] text-slate-400">Date &amp; Time</p>
                      <p className="font-bold text-slate-900">{new Date(exam.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} @ {exam.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">Centers</p>
                      <p className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">{exam.centers} Assigned</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Security Status */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">Platform Security Status</h3>
              <p className="text-[11px] text-slate-500">Real-time system diagnostics</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Phases 1–5 Active
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          {SECURITY_STATUS.map((item, i) => (
            <div key={i} className={cn('p-3 bg-slate-50 rounded-xl border flex flex-col gap-1', item.status ? 'border-slate-200' : 'border-slate-200 opacity-60')}>
              <span className="text-slate-600 font-medium text-[11px]">{item.label}</span>
              {item.status ? (
                <span className="flex items-center gap-1 font-bold text-emerald-600 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> {item.status}
                </span>
              ) : (
                <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-bold w-fit">{item.phase}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
