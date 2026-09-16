import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { ShieldCheck, Activity, User, Clock, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  // Fetch real audit logs from database
  const auditLogs = await prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

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
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  System Audit Logs
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Immutable chronological event trail of user authentications, role modifications, and exam assignments.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {auditLogs.length} Events Streamed
            </span>
          </div>

          {/* Audit Event Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Event Type</th>
                    <th className="py-3.5 px-4">Actor Personnel</th>
                    <th className="py-3.5 px-4">Target Resource</th>
                    <th className="py-3.5 px-4">Event Description</th>
                    <th className="py-3.5 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        No audit events recorded yet.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {log.eventType}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{log.actorEmail}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{log.actorRole}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-800">
                          {log.targetResource}
                        </td>
                        <td className="py-3 px-4 text-slate-600 leading-snug max-w-xs">
                          {log.details}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
