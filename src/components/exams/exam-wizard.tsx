'use client';

import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, GraduationCap, Calendar, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { createExam } from '@/app/actions/exam-actions';

interface ExamWizardProps {
  colleges: any[];
  isOpen: boolean;
  onClose: () => void;
}

export function ExamWizard({ colleges, isOpen, onClose }: ExamWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    examCode: '',
    description: '',
    academicYear: '2026-2027',
    semester: 'Semester VI',
    department: 'Computer Engineering',
    subject: '',
    examDate: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    durationMinutes: 180,
    paperReleaseTime: new Date().toISOString().split('T')[0] + 'T08:30',
    collegeIds: [] as string[],
  });

  if (!isOpen) return null;

  const handleToggleCollege = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      collegeIds: prev.collegeIds.includes(id)
        ? prev.collegeIds.filter((c) => c !== id)
        : [...prev.collegeIds, id],
    }));
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.title || !formData.examCode || !formData.subject) {
        setError('Please complete all required fields in basic information.');
        return;
      }
    }
    if (step === 2) {
      if (!formData.examDate || !formData.paperReleaseTime) {
        setError('Please select valid examination and paper release dates.');
        return;
      }
      if (new Date(formData.paperReleaseTime) > new Date(formData.examDate)) {
        setError('Paper release time cannot be after the examination date.');
        return;
      }
    }
    setStep((prev) => (prev < 4 ? ((prev + 1) as any) : prev));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const res = await createExam({
      ...formData,
      paperReleaseTime: new Date(formData.paperReleaseTime).toISOString(),
    });

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to create examination.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <GraduationCap className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Examination Schedule</h3>
              <p className="text-xs text-slate-500">Multi-step setup for secure paper release</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
          {[
            { num: 1, title: '01 Basic' },
            { num: 2, title: '02 Schedule' },
            { num: 3, title: '03 Centers' },
            { num: 4, title: '04 Review' },
          ].map((s) => (
            <div
              key={s.num}
              className={`py-2 rounded-xl border transition ${
                step === s.num
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : step > s.num
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              {s.title}
            </div>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="space-y-4 text-xs font-medium text-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold text-slate-900">Exam Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures & Algorithms"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-slate-900">Unique Code *</label>
                <input
                  type="text"
                  placeholder="e.g. DSA-2026-001"
                  value={formData.examCode}
                  onChange={(e) => setFormData({ ...formData, examCode: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 font-bold text-slate-900">Academic Year</label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-slate-900">Semester</label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-slate-900">Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-900">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g. Data Structures & Algorithms"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold text-slate-900">Description</label>
              <textarea
                placeholder="End Semester Examination description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs h-16"
              />
            </div>
          </div>
        )}

        {/* STEP 2: SCHEDULE */}
        {step === 2 && (
          <div className="space-y-4 text-xs font-medium text-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold text-slate-900">Exam Conduct Date *</label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-slate-900">Start Time *</label>
                <input
                  type="text"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-bold text-slate-900">Duration (Minutes)</label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 180 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block mb-1 font-bold text-slate-900">Automated Release Time *</label>
                <input
                  type="datetime-local"
                  value={formData.paperReleaseTime}
                  onChange={(e) => setFormData({ ...formData, paperReleaseTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CENTERS SELECTION */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">Select authorized examination centers for paper distribution:</p>
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {colleges.map((c) => {
                const isSelected = formData.collegeIds.includes(c.id);
                return (
                  <div
                    key={c.id}
                    onClick={() => handleToggleCollege(c.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{c.code} • {c.city}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUMMARY */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between font-bold text-slate-900 border-b border-slate-200 pb-2">
                <span>{formData.title}</span>
                <span className="font-mono text-blue-600">{formData.examCode}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <p><strong>Department:</strong> {formData.department}</p>
                <p><strong>Subject:</strong> {formData.subject}</p>
                <p><strong>Date:</strong> {formData.examDate}</p>
                <p><strong>Start Time:</strong> {formData.startTime}</p>
                <p><strong>Release Lock:</strong> {formData.paperReleaseTime}</p>
                <p><strong>Selected Centers:</strong> {formData.collegeIds.length} Center(s)</p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          {step > 1 ? (
            <button
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <span>Next Step</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? 'Creating Examination...' : 'Create Examination'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
