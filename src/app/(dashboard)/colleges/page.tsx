'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Building2, MapPin, Phone, Mail } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { cn } from '@/lib/utils';

const DEMO_COLLEGES = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Pune Institute of Computer Technology', code: 'PICT-001', address: 'Survey No. 27, Near Trimurti Chowk, Dhankawadi', city: 'Pune', state: 'Maharashtra', postal_code: '411043', contact_name: 'Dr. R. V. Sonawane', contact_email: 'principal@pict.edu', contact_phone: '+91 20 2437 1101', status: 'ACTIVE', exams: 4 },
  { id: 'c1000000-0000-0000-0000-000000000002', name: 'College of Engineering Pune', code: 'COEP-001', address: 'Wellesley Road, Shivajinagar', city: 'Pune', state: 'Maharashtra', postal_code: '411005', contact_name: 'Prof. B. B. Ahuja', contact_email: 'director@coep.ac.in', contact_phone: '+91 20 2550 7000', status: 'ACTIVE', exams: 3 },
  { id: 'c1000000-0000-0000-0000-000000000003', name: 'Vishwakarma Institute of Technology', code: 'VIT-001', address: '666, Upper Indiranagar, Bibwewadi', city: 'Pune', state: 'Maharashtra', postal_code: '411037', contact_name: 'Dr. Madhuri Khambete', contact_email: 'principal@vit.edu', contact_phone: '+91 20 2425 6800', status: 'ACTIVE', exams: 3 },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'Symbiosis Institute of Technology', code: 'SIT-001', address: 'Survey No. 231, Plot No. B-52, Off Mumbai-Pune Expressway, Lavale', city: 'Pune', state: 'Maharashtra', postal_code: '412115', contact_name: 'Dr. Vinay Kulkarni', contact_email: 'principal@sitpune.edu.in', contact_phone: '+91 20 3911 6400', status: 'ACTIVE', exams: 2 },
  { id: 'c1000000-0000-0000-0000-000000000005', name: 'Marathwada Mitra Mandal College of Engineering', code: 'MMCOE-001', address: 'Survey No. 105, Karvenagar', city: 'Pune', state: 'Maharashtra', postal_code: '411052', contact_name: 'Dr. Pradeep Patil', contact_email: 'principal@mmcoe.edu.in', contact_phone: '+91 20 2544 4400', status: 'INACTIVE', exams: 0 },
];

export default function CollegesPage() {
  const { user } = useDemoSession();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const role = user?.role || 'SUPER_ADMIN';
  const canCreate = ['SUPER_ADMIN', 'EXAM_ADMIN'].includes(role);
  const myCollegeId = user?.college_id;

  const base = (role === 'COLLEGE_ADMIN' || role === 'INVIGILATOR') && myCollegeId
    ? DEMO_COLLEGES.filter(c => c.id === myCollegeId)
    : DEMO_COLLEGES;

  const colleges = base.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Examination Centers</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage colleges and examination center assignments</p>
        </div>
        {canCreate && (
          <button className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Add Center
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Total Centers', value: DEMO_COLLEGES.length }, { label: 'Active', value: DEMO_COLLEGES.filter(c => c.status === 'ACTIVE').length }, { label: 'Inactive', value: DEMO_COLLEGES.filter(c => c.status === 'INACTIVE').length }].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center">
            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search centers..." className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none">
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colleges.map(c => (
          <Link key={c.id} href={`/colleges/${c.id}`}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle hover:shadow-glass hover:-translate-y-0.5 transition-all p-5 space-y-4 cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{c.code}</span>
                    <StatusBadge status={c.status} size="sm" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{c.name}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-slate-500" />
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400" /><span>{c.address}, {c.city} - {c.postal_code}</span></div>
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-400" /><span>{c.contact_email}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /><span>{c.contact_phone}</span></div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{c.contact_name}</span>
                <span className={cn('font-bold', c.exams > 0 ? 'text-blue-600' : 'text-slate-400')}>{c.exams} Exam{c.exams !== 1 ? 's' : ''} Assigned</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
