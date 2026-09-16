import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { UserTable } from '@/components/users/user-table';
import { Users, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

export default async function UserManagementPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  // Server-side RBAC enforcement
  if (!user || user.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  // Fetch users & statistics directly from Prisma DB
  const users = await prisma.user.findMany({
    include: { college: true },
    orderBy: { createdAt: 'desc' },
  });

  const totalUsers = users.length;
  const pendingUsers = users.filter((u) => u.status === 'PENDING' || u.role === 'PENDING').length;
  const activeUsers = users.filter((u) => u.status === 'ACTIVE' && u.role !== 'PENDING').length;
  const suspendedUsers = users.filter((u) => u.status === 'SUSPENDED').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Users className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  User Management
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Manage authorized examination personnel and assign role permissions.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">Total Users</span>
                <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalUsers}</p>
              </div>
              <Users className="w-5 h-5 text-blue-600" />
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-amber-700 text-[11px] font-bold uppercase tracking-wider">Pending Users</span>
                <p className="text-2xl font-extrabold text-amber-900 mt-0.5">{pendingUsers}</p>
              </div>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-emerald-700 text-[11px] font-bold uppercase tracking-wider">Active Users</span>
                <p className="text-2xl font-extrabold text-emerald-900 mt-0.5">{activeUsers}</p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-rose-700 text-[11px] font-bold uppercase tracking-wider">Suspended</span>
                <p className="text-2xl font-extrabold text-rose-900 mt-0.5">{suspendedUsers}</p>
              </div>
              <ShieldAlert className="w-5 h-5 text-rose-600" />
            </div>
          </div>

          {/* User Table Component */}
          <UserTable users={users} />
        </main>
      </div>
    </div>
  );
}
