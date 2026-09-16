'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Lock, 
  FileText, 
  ArrowLeft, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { CenterAssignmentModal } from './center-assignment-modal';
import { hasPermission } from '@/lib/permissions';

interface ExamDetailsClientProps {
  exam: any;
  allColleges: any[];
  userRole: string;
}

export function ExamDetailsClient({ exam, allColleges, userRole }: ExamDetailsClientProps) {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const canEdit = hasPermission(userRole as any, 'EDIT_EXAM');

  const currentCollegeIds = exam.assignments.map((a: any) => a.collegeId);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/exams"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Examinations
      </Link>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {exam.examCode}
            </span>
            <StatusBadge status={exam.status} size="md" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{exam.title}</h1>
          <p className="text-xs text-slate-500 font-medium">
            {exam.department} • {exam.semester} ({exam.academicYear})
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setAssignModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 shrink-0"
          >
            <Building2 className="w-4 h-4" />
            <span>Manage Authorized Centers</span>
          </button>
        )}
      </div>

      {/* 4 Core Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Exam Information */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" /> Exam Specification
          </h3>
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Subject:</span>
              <span className="font-bold text-slate-900">{exam.subject}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-900">{exam.department}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Semester / Term:</span>
              <span className="font-semibold text-slate-900">{exam.semester}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Created By:</span>
              <span className="font-semibold text-slate-900">{exam.createdBy?.name || 'Central Board'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Schedule & Lock Parameters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" /> Schedule & Time-Lock
          </h3>
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Examination Date:</span>
              <span className="font-bold text-slate-900">{new Date(exam.examDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Start Time:</span>
              <span className="font-semibold text-slate-900">{exam.startTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Duration:</span>
              <span className="font-semibold text-slate-900">{exam.durationMinutes} Minutes (3 Hours)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Automated Release Time:</span>
              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                ⏰ {new Date(exam.paperReleaseTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Authorized Examination Centers */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" /> Authorized Centers ({exam.assignments.length})
            </h3>
            {canEdit && (
              <button
                onClick={() => setAssignModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                + Assign
              </button>
            )}
          </div>

          <div className="border-t border-slate-100 pt-2 space-y-2 max-h-48 overflow-y-auto">
            {exam.assignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No centers assigned yet.</p>
            ) : (
              exam.assignments.map((a: any) => (
                <div
                  key={a.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900">{a.college.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{a.college.code} • {a.college.city}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    AUTHORIZED
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 4: Security Status (Phase 4+ Placeholder) */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" /> Security Status
            </h3>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-bold">
              COMING SOON
            </span>
          </div>

          <div className="border-t border-slate-700/60 pt-3 space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span>AES-256-GCM Encryption:</span>
              <span className="text-slate-400 font-mono text-[11px]">○ Pending Upload (Phase 4)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SHA-256 Hash Signature:</span>
              <span className="text-slate-400 font-mono text-[11px]">○ Pending Upload (Phase 4)</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Blockchain Ledger Registration:</span>
              <span className="text-slate-400 font-mono text-[11px]">○ Pending Upload (Phase 5)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-300 leading-relaxed mt-2">
            ℹ Security Features — Question paper local encryption & smart contract registration pipeline will be activated in Phase 4 and Phase 5.
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      <CenterAssignmentModal
        examId={exam.id}
        currentAssignments={currentCollegeIds}
        allColleges={allColleges}
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
      />
    </div>
  );
}
