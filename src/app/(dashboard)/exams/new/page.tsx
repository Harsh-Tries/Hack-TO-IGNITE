'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Building2, Calendar, Clock, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = ['Basic Info', 'Schedule', 'Assign Centers', 'Review'];

const DEMO_COLLEGES = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Pune Institute of Computer Technology', code: 'PICT-001', city: 'Pune' },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'College of Engineering Pune', code: 'COEP-001', city: 'Pune' },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Vishwakarma Institute of Technology', code: 'VIT-001', city: 'Pune' },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Symbiosis Institute of Technology', code: 'SIT-001', city: 'Pune' },
];

interface FormData {
  name: string; code: string; description: string; academicYear: string;
  semester: string; department: string; subject: string;
  examDate: string; startTime: string; durationMinutes: string; paperReleaseTime: string;
  collegeIds: string[];
}

const INITIAL: FormData = {
  name: '', code: '', description: '', academicYear: '2026-2027',
  semester: 'Semester VI', department: 'Computer Engineering', subject: '',
  examDate: '', startTime: '09:00', durationMinutes: '180', paperReleaseTime: '',
  collegeIds: [],
};

function generateCode(dept: string, subject: string): string {
  const deptCode = dept.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase();
  const subCode = subject.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase();
  return `UE-${deptCode}-2026-${subCode || '001'}`;
}

export default function NewExamPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof FormData, v: string | string[]) => setForm(f => ({ ...f, [k]: v }));

  const validateStep = () => {
    const e: Partial<FormData> = {};
    if (step === 0) {
      if (!form.name) e.name = 'Required';
      if (!form.code) e.code = 'Required';
      if (!form.subject) e.subject = 'Required';
    }
    if (step === 1) {
      if (!form.examDate) e.examDate = 'Required';
      if (!form.startTime) e.startTime = 'Required';
      if (!form.durationMinutes || Number(form.durationMinutes) <= 0) e.durationMinutes = 'Must be > 0';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 3)); };
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSuccess(true);
    setTimeout(() => router.push('/exams'), 1500);
  };

  const toggleCollege = (id: string) => {
    set('collegeIds', form.collegeIds.includes(id) ? form.collegeIds.filter(c => c !== id) : [...form.collegeIds, id]);
  };

  if (success) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-emerald-500" />
        </div>
        <p className="font-bold text-slate-900">Examination Created!</p>
        <p className="text-xs text-slate-500">Redirecting to exams list...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/exams')} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Create Examination</h1>
          <p className="text-xs text-slate-500">Fill in the details to schedule a new exam</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition', i < step ? 'bg-blue-600 border-blue-600 text-white' : i === step ? 'border-blue-600 text-blue-600 bg-white' : 'border-slate-200 text-slate-400 bg-white')}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={cn('text-[10px] font-semibold mt-1', i === step ? 'text-blue-600' : 'text-slate-400')}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={cn('flex-1 h-0.5 mx-1 -mt-4', i < step ? 'bg-blue-600' : 'bg-slate-200')} />}
          </React.Fragment>
        ))}
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5">
        {/* Step 1 */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="w-4 h-4 text-blue-600" /> Basic Information</h2>
            {[['name', 'Exam Name', 'e.g. Data Structures and Algorithms'], ['code', 'Exam Code', 'e.g. UE-CSE-2026-001'], ['subject', 'Subject', 'e.g. DSA']].map(([key, label, placeholder]) => (
              <div key={key}>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{label} *</label>
                <div className="flex gap-2">
                  <input value={form[key as keyof FormData] as string} onChange={e => set(key as keyof FormData, e.target.value)} placeholder={placeholder} className={cn('flex-1 px-3 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500', (errors as Record<string,string>)[key] ? 'border-red-400' : 'border-slate-200')} />
                  {key === 'code' && <button type="button" onClick={() => set('code', generateCode(form.department, form.subject))} className="text-xs font-bold text-blue-600 border border-blue-200 px-3 rounded-xl hover:bg-blue-50">Auto</button>}
                </div>
                {(errors as Record<string,string>)[key] && <p className="text-[11px] text-red-500 mt-1">{(errors as Record<string,string>)[key]}</p>}
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Optional exam description" className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { k: 'academicYear', l: 'Academic Year', opts: ['2025-2026', '2026-2027', '2027-2028'] },
                { k: 'semester', l: 'Semester', opts: ['Semester I', 'Semester II', 'Semester III', 'Semester IV', 'Semester V', 'Semester VI', 'Semester VII', 'Semester VIII'] },
                { k: 'department', l: 'Department', opts: ['Computer Engineering', 'Information Technology', 'Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering'] },
              ].map(({ k, l, opts }) => (
                <div key={k}>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">{l}</label>
                  <select value={form[k as keyof FormData] as string} onChange={e => set(k as keyof FormData, e.target.value)} className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {opts.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Exam Date *</label>
                <input type="date" value={form.examDate} onChange={e => set('examDate', e.target.value)} className={cn('w-full px-3 py-2.5 text-xs border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500', errors.examDate ? 'border-red-400' : 'border-slate-200')} />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Start Time *</label>
                <input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Duration (minutes) *</label>
              <input type="number" value={form.durationMinutes} onChange={e => set('durationMinutes', e.target.value)} min="30" className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <label className="text-xs font-semibold text-amber-800 block mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Paper Release Time <span className="text-[10px] bg-amber-200 text-amber-700 px-1.5 rounded font-mono">Phase 6 — Future Feature</span></label>
              <input type="datetime-local" value={form.paperReleaseTime} onChange={e => set('paperReleaseTime', e.target.value)} className="w-full px-3 py-2.5 text-xs border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
              <p className="text-[10px] text-amber-600 mt-1">This value is stored but time-locked enforcement will be implemented in Phase 6.</p>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-600" /> Assign Examination Centers</h2>
            <p className="text-xs text-slate-500">Select active colleges to assign as examination centers.</p>
            <div className="space-y-2">
              {DEMO_COLLEGES.map(c => (
                <label key={c.id} className={cn('flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition', form.collegeIds.includes(c.id) ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-slate-300')}>
                  <input type="checkbox" checked={form.collegeIds.includes(c.id)} onChange={() => toggleCollege(c.id)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-500">{c.code} • {c.city}</p>
                  </div>
                </label>
              ))}
            </div>
            {form.collegeIds.length > 0 && <p className="text-xs text-emerald-600 font-semibold">{form.collegeIds.length} center{form.collegeIds.length > 1 ? 's' : ''} selected</p>}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Review Examination</h2>
            <div className="space-y-3 text-xs">
              {[
                ['Exam Name', form.name],
                ['Exam Code', form.code],
                ['Subject', form.subject],
                ['Department', form.department],
                ['Academic Year', form.academicYear],
                ['Semester', form.semester],
                ['Exam Date', form.examDate || '—'],
                ['Start Time', form.startTime],
                ['Duration', `${form.durationMinutes} minutes`],
                ['Centers', form.collegeIds.length > 0 ? `${form.collegeIds.length} selected` : 'None selected'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-slate-500 font-semibold">{label}</span>
                  <span className="font-bold text-slate-900 text-right max-w-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={step === 0} className="flex items-center gap-2 text-xs font-bold text-slate-600 border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        {step < 3 ? (
          <button onClick={next} className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={submit} disabled={submitting} className="flex items-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 rounded-xl shadow-md disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Examination'}
          </button>
        )}
      </div>
    </div>
  );
}
