'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, FileText, Lock, Link2, Clock, CheckCircle2, Circle, Calendar, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

const DEMO_EXAMS: Record<string, any> = {
  e1: { id: 'e1', code: 'UE-CSE-2026-001', name: 'Data Structures and Algorithms', department: 'Computer Engineering', semester: 'Semester IV', subject: 'DSA', date: '2026-10-15', time: '09:00 AM', duration: 180, status: 'SCHEDULED', academicYear: '2026-2027', description: 'Comprehensive examination covering arrays, linked lists, trees, graphs, and algorithm analysis.', createdBy: 'Prof. Rajesh Kumar', centers: [{ id: 'c1', name: 'Pune Institute of Computer Technology', code: 'PICT-001', city: 'Pune', status: 'ASSIGNED' }, { id: 'c2', name: 'College of Engineering Pune', code: 'COEP-001', city: 'Pune', status: 'ASSIGNED' }, { id: 'c3', name: 'Vishwakarma Institute of Technology', code: 'VIT-001', city: 'Pune', status: 'ASSIGNED' }, { id: 'c4', name: 'Symbiosis Institute of Technology', code: 'SIT-001', city: 'Pune', status: 'ASSIGNED' }], papers: [{ id: 'p1', code: 'QP-DSA-2026-001', status: 'BLOCKCHAIN_REGISTERED', sha256: 'a3f8d9...bc42', uploadedBy: 'Dr. Ananya Sharma' }] },
  e2: { id: 'e2', code: 'UE-CSE-2026-002', name: 'Database Management Systems', department: 'Computer Engineering', semester: 'Semester VI', subject: 'DBMS', date: '2026-10-18', time: '02:00 PM', duration: 180, status: 'SCHEDULED', academicYear: '2026-2027', description: 'Covers SQL, normalization, transactions, and database design.', createdBy: 'Prof. Rajesh Kumar', centers: [{ id: 'c1', name: 'Pune Institute of Computer Technology', code: 'PICT-001', city: 'Pune', status: 'ASSIGNED' }, { id: 'c2', name: 'College of Engineering Pune', code: 'COEP-001', city: 'Pune', status: 'ASSIGNED' }, { id: 'c3', name: 'Vishwakarma Institute of Technology', code: 'VIT-001', city: 'Pune', status: 'ASSIGNED' }], papers: [] },
};

const SECURITY_ITEMS = [
  { label: 'Authentication', detail: 'Supabase + Google OAuth', active: true },
  { label: 'Role-Based Access', detail: 'RBAC enforced', active: true },
  { label: 'Row Level Security', detail: 'Database-level policies', active: true },
  { label: 'Encryption', detail: 'AES-256-GCM', active: true },
  { label: 'Blockchain', detail: 'Hash registered on-chain', active: true },
  { label: 'Time-Lock', detail: 'Phase 6', active: false },
];

export default function ExamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const exam = DEMO_EXAMS[id] || DEMO_EXAMS['e1'];
  const [showCenterModal, setShowCenterModal] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/exams')} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{exam.code}</span>
              <StatusBadge status={exam.status} />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">{exam.name}</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Examination Details</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {[
                ['Subject', exam.subject],
                ['Department', exam.department],
                ['Semester', exam.semester],
                ['Academic Year', exam.academicYear],
                ['Exam Date', new Date(exam.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })],
                ['Start Time', exam.time],
                ['Duration', `${exam.duration} minutes`],
                ['Created By', exam.createdBy],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-slate-500 font-semibold">{label}</p>
                  <p className="font-bold text-slate-900 mt-0.5">{val}</p>
                </div>
              ))}
            </div>
            {exam.description && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-semibold mb-1">Description</p>
                <p className="text-xs text-slate-700">{exam.description}</p>
              </div>
            )}
          </div>

          {/* Centers */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Examination Centers ({exam.centers.length})</h2>
              <button onClick={() => setShowCenterModal(true)} className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> + Assign Centers
              </button>
            </div>
            <div className="space-y-2">
              {exam.centers.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-500">{c.code} • {c.city}</p>
                  </div>
                  <StatusBadge status={c.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Question Papers */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Question Papers</h2>
              <Link href="/papers/upload" className="text-xs font-bold text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Upload Paper
              </Link>
            </div>
            {exam.papers.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No question papers uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {exam.papers.map((p: any) => (
                  <Link key={p.id} href={`/papers/${p.id}`}>
                    <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{p.code}</p>
                        <p className="text-[11px] text-slate-500">Uploaded by {p.uploadedBy}</p>
                        <p className="font-mono text-[10px] text-purple-600 mt-0.5">{p.sha256}</p>
                      </div>
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Security Panel */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-600" /> Security Status</h2>
            <div className="space-y-3">
              {SECURITY_ITEMS.map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.active ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <Circle className="w-4 h-4 text-slate-300 shrink-0" />}
                    <div>
                      <p className={cn('text-xs font-semibold', item.active ? 'text-slate-900' : 'text-slate-400')}>{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Status Management</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-semibold">Current Status</span>
                <StatusBadge status={exam.status} size="sm" />
              </div>
              {exam.status === 'DRAFT' && (
                <button className="w-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 py-2.5 rounded-xl transition">
                  Mark as Scheduled →
                </button>
              )}
              {exam.status === 'SCHEDULED' && (
                <button className="w-full text-xs font-bold text-slate-600 border border-red-200 hover:bg-red-50 py-2.5 rounded-xl transition text-red-600">
                  Cancel Exam
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center Assignment Modal */}
      {showCenterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowCenterModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-glass" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Assign Examination Centers</h3>
            <p className="text-xs text-slate-500 mb-4">Centers are already assigned. In demo mode, assignments are pre-configured.</p>
            <button onClick={() => setShowCenterModal(false)} className="w-full text-xs font-bold bg-blue-600 text-white py-2.5 rounded-xl">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
