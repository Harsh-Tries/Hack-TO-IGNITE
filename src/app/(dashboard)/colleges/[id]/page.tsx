'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Building2, MapPin, Mail, Phone, User, GraduationCap } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

const DEMO_COLLEGES: Record<string, any> = {
  'c1000000-0000-0000-0000-000000000001': { id: 'c1000000-0000-0000-0000-000000000001', name: 'Pune Institute of Computer Technology', code: 'PICT-001', address: 'Survey No. 27, Near Trimurti Chowk, Dhankawadi', city: 'Pune', state: 'Maharashtra', postal_code: '411043', contact_name: 'Dr. R. V. Sonawane', contact_email: 'principal@pict.edu', contact_phone: '+91 20 2437 1101', status: 'ACTIVE', exams: [{ code: 'UE-CSE-2026-001', name: 'Data Structures and Algorithms', date: '2026-10-15', status: 'SCHEDULED' }, { code: 'UE-CSE-2026-002', name: 'Database Management Systems', date: '2026-10-18', status: 'SCHEDULED' }], users: [{ name: 'Principal V. S. Patil', email: 'college@secureexam.demo', role: 'COLLEGE_ADMIN' }, { name: 'Prof. Suresh Mehta', email: 'invigilator@secureexam.demo', role: 'INVIGILATOR' }] },
  'c1000000-0000-0000-0000-000000000002': { id: 'c1000000-0000-0000-0000-000000000002', name: 'College of Engineering Pune', code: 'COEP-001', address: 'Wellesley Road, Shivajinagar', city: 'Pune', state: 'Maharashtra', postal_code: '411005', contact_name: 'Prof. B. B. Ahuja', contact_email: 'director@coep.ac.in', contact_phone: '+91 20 2550 7000', status: 'ACTIVE', exams: [{ code: 'UE-CSE-2026-001', name: 'Data Structures and Algorithms', date: '2026-10-15', status: 'SCHEDULED' }], users: [] },
};

export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const college = DEMO_COLLEGES[id] || Object.values(DEMO_COLLEGES)[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/colleges')} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{college.code}</span>
            <StatusBadge status={college.status} size="sm" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">{college.name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Contact Information</h2>
          <div className="space-y-3 text-xs">
            {[
              { icon: MapPin, label: 'Address', value: `${college.address}, ${college.city}, ${college.state} - ${college.postal_code}` },
              { icon: User, label: 'Contact Person', value: college.contact_name },
              { icon: Mail, label: 'Email', value: college.contact_email },
              { icon: Phone, label: 'Phone', value: college.contact_phone },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-slate-500 font-semibold">{label}</p>
                  <p className="text-slate-900 font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Users */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Assigned Personnel ({college.users.length})</h2>
          {college.users.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No personnel assigned.</p>
          ) : (
            <div className="space-y-2">
              {college.users.map((u: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">{u.name[0]}</div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{u.name}</p>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                  </div>
                  <span className="ml-auto text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{u.role.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assigned Exams */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-5 space-y-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600" /> Assigned Examinations ({college.exams.length})
        </h2>
        {college.exams.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No examinations assigned.</p>
        ) : (
          <div className="space-y-2">
            {college.exams.map((e: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="font-mono text-[10px] font-bold text-blue-600">{e.code}</span>
                  <p className="font-bold text-slate-900 mt-0.5">{e.name}</p>
                  <p className="text-slate-500">{new Date(e.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
                <StatusBadge status={e.status} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
