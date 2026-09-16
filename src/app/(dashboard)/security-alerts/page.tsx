'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

const DEMO_ALERTS = [
  {
    id: 'sa-1',
    severity: 'HIGH',
    title: 'Unauthorized Paper Download Attempt Blocked',
    desc: 'An invigilator account attempted to download paper QP-DSA-2026-001 outside scheduled exam hours. Access was automatically blocked by RLS policies.',
    status: 'OPEN',
    time: '25 mins ago',
    metadata: { user: 'invigilator@secureexam.demo', paper: 'QP-DSA-2026-001', action: 'ACCESS_DENIED' },
  },
  {
    id: 'sa-2',
    severity: 'MEDIUM',
    title: 'Multiple Login Attempts Detected',
    desc: 'Account exam.admin@secureexam.demo attempted login from 3 distinct IP addresses within a 15-minute window.',
    status: 'INVESTIGATING',
    time: '2 hours ago',
    metadata: { IPs: ['192.168.1.45', '10.0.0.12', '172.16.4.2'] },
  },
  {
    id: 'sa-3',
    severity: 'LOW',
    title: 'New Admin Bootstrap Login',
    desc: 'Initial SUPER_ADMIN account registered via Google OAuth matching INITIAL_ADMIN_EMAIL.',
    status: 'RESOLVED',
    time: '1 day ago',
    metadata: { email: 'admin@secureexam.demo', action: 'BOOTSTRAP_ADMIN' },
  },
];

export default function SecurityAlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Security Alerts</h1>
          <p className="text-xs text-slate-500 mt-0.5">Automated threat detection, policy violation alerts, and security incidents</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-extrabold text-red-600">1</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">High Severity Open</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-extrabold text-amber-600">1</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Under Investigation</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">1</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Resolved</p>
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {DEMO_ALERTS.map(alert => (
          <div key={alert.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-subtle space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={alert.severity} size="sm" />
                    <StatusBadge status={alert.status} size="sm" />
                    <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{alert.title}</h3>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-13">{alert.desc}</p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700">
              {JSON.stringify(alert.metadata)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
