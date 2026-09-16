'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, GraduationCap, Calendar, Clock, Building2, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { cn } from '@/lib/utils';

const ALL_EXAMS = [
  { id: 'e1', code: 'UE-CSE-2026-001', name: 'Data Structures and Algorithms', department: 'Computer Engineering', semester: 'Semester IV', subject: 'DSA', date: '2026-10-15', time: '09:00 AM', duration: 180, centers: 4, status: 'SCHEDULED', academicYear: '2026-2027' },
  { id: 'e2', code: 'UE-CSE-2026-002', name: 'Database Management Systems', department: 'Computer Engineering', semester: 'Semester VI', subject: 'DBMS', date: '2026-10-18', time: '02:00 PM', duration: 180, centers: 3, status: 'SCHEDULED', academicYear: '2026-2027' },
  { id: 'e3', code: 'UE-IT-2026-003', name: 'Web Technology and Applications', department: 'Information Technology', semester: 'Semester V', subject: 'WTA', date: '2026-10-20', time: '09:00 AM', duration: 150, centers: 2, status: 'DRAFT', academicYear: '2026-2027' },
  { id: 'e4', code: 'UE-MECH-2026-004', name: 'Thermodynamics and Heat Transfer', department: 'Mechanical Engineering', semester: 'Semester III', subject: 'THT', date: '2026-10-22', time: '09:00 AM', duration: 180, centers: 3, status: 'SCHEDULED', academicYear: '2026-2027' },
  { id: 'e5', code: 'UE-CIVIL-2026-005', name: 'Structural Analysis', department: 'Civil Engineering', semester: 'Semester V', subject: 'SA', date: '2026-10-25', time: '09:00 AM', duration: 180, centers: 2, status: 'PAPER_READY', academicYear: '2026-2027' },
  { id: 'e6', code: 'UE-ELEX-2026-006', name: 'Digital Signal Processing', department: 'Electronics Engineering', semester: 'Semester VI', subject: 'DSP', date: '2026-10-28', time: '02:00 PM', duration: 150, centers: 2, status: 'DRAFT', academicYear: '2026-2027' },
];

export default function ExamsPage() {
  const { user } = useDemoSession();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const role = user?.role || 'SUPER_ADMIN';
  const canCreate = ['SUPER_ADMIN', 'EXAM_ADMIN'].includes(role);

  // College-scoped users see fewer exams
  const baseExams = ['COLLEGE_ADMIN', 'INVIGILATOR'].includes(role) ? ALL_EXAMS.slice(0, 3) : ALL_EXAMS;

  const exams = baseExams.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = { total: baseExams.length, scheduled: baseExams.filter(e => e.status === 'SCHEDULED').length, draft: baseExams.filter(e => e.status === 'DRAFT').length, ready: baseExams.filter(e => e.status === 'PAPER_READY').length };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Examinations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage examination schedules and center assignments</p>
        </div>
        {canCreate && (
          <Link href="/exams/new" className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition">
            <Plus className="w-4 h-4" /> Create Exam
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: 'Total', value: counts.total, color: 'text-slate-900' }, { label: 'Scheduled', value: counts.scheduled, color: 'text-blue-600' }, { label: 'Draft', value: counts.draft, color: 'text-amber-600' }, { label: 'Paper Ready', value: counts.ready, color: 'text-indigo-600' }].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center">
            <p className={cn('text-2xl font-extrabold', s.color)}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exams..." className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="PAPER_READY">Paper Ready</option>
          <option value="DISTRIBUTED">Distributed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Exam List */}
      {exams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No examinations found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map(exam => (
            <Link key={exam.id} href={`/exams/${exam.id}`}>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-glass hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer">
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{exam.code}</span>
                    <StatusBadge status={exam.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{exam.name}</h3>
                  <p className="text-xs text-slate-500">{exam.department} • {exam.semester} • {exam.academicYear}</p>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{new Date(exam.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{exam.time} ({exam.duration}m)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{exam.centers} Centers</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
