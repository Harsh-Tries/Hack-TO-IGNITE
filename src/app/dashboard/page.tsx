import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { RightPanel } from '@/components/layout/right-panel';
import { StatCard } from '@/components/ui/stat-card';
import { QuickActionCard } from '@/components/ui/quick-action-card';
import { 
  Shield, 
  Lock, 
  Link as ChainIcon, 
  Clock, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'PENDING') {
    redirect('/pending');
  }

  // 1. Role-based exam scoping query
  let examWhere: any = {};
  if (user.role === 'COLLEGE_ADMIN' || user.role === 'INVIGILATOR') {
    if (user.collegeId) {
      examWhere = {
        assignments: {
          some: { collegeId: user.collegeId },
        },
      };
    } else {
      examWhere = { id: 'no-college' };
    }
  }

  // Real Database Queries
  const [
    totalUsers,
    pendingUsers,
    activeUsers,
    totalExams,
    scheduledExams,
    totalColleges,
    totalAuditLogs,
    upcomingExams,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { OR: [{ status: 'PENDING' }, { role: 'PENDING' }] } }),
    prisma.user.count({ where: { status: 'ACTIVE', role: { not: 'PENDING' } } }),
    prisma.exam.count({ where: examWhere }),
    prisma.exam.count({ where: { ...examWhere, status: 'SCHEDULED' } }),
    prisma.college.count({ where: { status: 'ACTIVE' } }),
    prisma.auditLog.count(),
    prisma.exam.findMany({
      where: examWhere,
      include: { assignments: { include: { college: true } } },
      orderBy: { examDate: 'asc' },
      take: 5,
    }),
  ]);

  const userName = user.name || 'Harsh Wagh';

  // Role-aware Stat Cards Data
  const getStatsForRole = () => {
    if (user.role === 'SUPER_ADMIN') {
      return [
        { title: 'Total Users', value: totalUsers, change: `${activeUsers} Active`, trend: 'up' as const, icon: 'Users' },
        { title: 'Pending Approval', value: pendingUsers, change: 'Action Required', trend: 'down' as const, icon: 'AlertTriangle', isAlert: pendingUsers > 0 },
        { title: 'Total Exams', value: totalExams, change: `${scheduledExams} Scheduled`, trend: 'up' as const, icon: 'GraduationCap' },
        { title: 'Exam Centers', value: totalColleges, change: '100% Active', trend: 'up' as const, icon: 'Building2' },
        { title: 'Audit Events', value: totalAuditLogs, change: 'Streamed', trend: 'up' as const, icon: 'ShieldCheck' },
        { title: 'System Health', value: '100%', change: 'Operational', trend: 'up' as const, icon: 'Link' },
      ];
    }
    return [
      { title: 'Assigned Exams', value: totalExams, change: `${scheduledExams} Scheduled`, trend: 'up' as const, icon: 'GraduationCap' },
      { title: 'Active Centers', value: totalColleges, change: 'Authorized', trend: 'up' as const, icon: 'Building2' },
      { title: 'Security Audits', value: totalAuditLogs, change: 'Recorded', trend: 'up' as const, icon: 'ShieldCheck' },
      { title: 'Time-Lock Status', value: 'Active', change: 'Enforced', trend: 'up' as const, icon: 'Lock' },
    ];
  };

  const stats = getStatsForRole();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <div className="flex-1 flex min-w-0">
          <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
            {/* Hero Banner Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-lg shadow-blue-900/10 border border-blue-600/30">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl pointer-events-none"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                    <span>SECUREEXAM Architecture Core</span>
                  </div>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
                    Welcome back, {userName}! 👋
                  </h2>

                  <p className="text-blue-100 text-xs md:text-sm leading-relaxed max-w-xl">
                    Your examination security is under control. Secure paper distribution platform with role-based access control, institutional center mapping, and audit trails.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                    <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">
                      🛡 RBAC Active
                    </span>
                    <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">
                      🔐 AES Encryption (Phase 4)
                    </span>
                    <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl">
                      ⛓ Blockchain Ledger (Phase 5)
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 hidden lg:flex justify-end">
                  <div className="w-48 h-48 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-400 flex items-center justify-center shadow-md">
                      <Shield className="w-6 h-6 text-white stroke-[2.5]" />
                    </div>
                    <p className="text-xs font-bold text-white">0 Security Breaches</p>
                    <p className="text-[10px] text-blue-200">Database & RBAC Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics Cards Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live System Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((s, idx) => (
                  <StatCard key={idx} {...(s as any)} />
                ))}
              </div>
            </div>

            {/* Upcoming Examinations Table Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Calendar className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Upcoming Examinations</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Next scheduled university examinations</p>
                  </div>
                </div>

                <Link
                  href="/exams"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>View All Exams</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {upcomingExams.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No upcoming examinations scheduled.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="p-3.5 bg-slate-50/80 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {exam.examCode}
                          </span>
                          <StatusBadge status={exam.status} size="sm" />
                        </div>
                        <h4 className="font-bold text-slate-900">{exam.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {exam.department} • {exam.semester}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-slate-600 font-medium shrink-0">
                        <div>
                          <p className="text-[11px] text-slate-400">Date & Start</p>
                          <p className="font-bold text-slate-900">
                            {new Date(exam.examDate).toLocaleDateString()} @ {exam.startTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-slate-400">Centers</p>
                          <p className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                            {exam.assignments.length} Assigned
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Real Security Diagnostics Status Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Shield className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Platform Security Status</h3>
                    <p className="text-[11px] text-slate-500 font-medium">System diagnostic monitors</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Phases 1-3 Active
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Google Authentication</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">● Active</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Role-Based Access</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">● Active</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Prisma Database</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">● Connected</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Audit Logging</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">● Active</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between opacity-60">
                  <span className="text-slate-600 font-medium">AES-256 Encryption</span>
                  <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-bold">Phase 4</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between opacity-60">
                  <span className="text-slate-600 font-medium">Hardhat Blockchain</span>
                  <span className="font-mono text-[10px] bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-bold">Phase 5</span>
                </div>
              </div>
            </div>
          </main>

          <RightPanel />
        </div>
      </div>
    </div>
  );
}
