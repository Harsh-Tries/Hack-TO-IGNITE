'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  PlusCircle, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Building2, 
  ChevronRight, 
  FileText, 
  Lock 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { ExamWizard } from './exam-wizard';
import { hasPermission } from '@/lib/permissions';

interface ExamsClientViewProps {
  exams: any[];
  colleges: any[];
  userRole: string;
}

export function ExamsClientView({ exams, colleges, userRole }: ExamsClientViewProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const canCreate = hasPermission(userRole as any, 'CREATE_EXAM');

  const filteredExams = exams.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.examCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesDept = departmentFilter === 'ALL' || e.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <GraduationCap className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Examinations
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Create and manage secure examination schedules & center distribution lists.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setWizardOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Examination</span>
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search examinations by title, code, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PAPER_READY">Paper Ready</option>
            <option value="DISTRIBUTED">Distributed</option>
            <option value="RELEASED">Released</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Exam Grid */}
      {filteredExams.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-subtle text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No examinations yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first examination to begin secure paper distribution and college center assignment.
          </p>
          {canCreate && (
            <button
              onClick={() => setWizardOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 transition inline-flex items-center gap-1.5 mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Examination</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-blue-300 hover:shadow-card transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {exam.examCode}
                  </span>
                  <StatusBadge status={exam.status} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-blue-600 transition">
                  <Link href={`/exams/${exam.id}`}>{exam.title}</Link>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {exam.department} • {exam.semester} ({exam.academicYear})
                </p>
              </div>

              {/* Meta Stats */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" /> Exam Date:
                  </span>
                  <span className="font-bold text-slate-900">
                    {new Date(exam.examDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" /> Start Time:
                  </span>
                  <span className="font-semibold text-slate-900">{exam.startTime}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" /> Centers:
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded border border-emerald-200 text-[10px]">
                    {exam.assignments?.length || 0} Centers Assigned
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400">
                  Lock: {new Date(exam.paperReleaseTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <Link
                  href={`/exams/${exam.id}`}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wizard */}
      <ExamWizard
        colleges={colleges}
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </div>
  );
}
