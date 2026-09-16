'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  ChevronRight, 
  GraduationCap 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { CollegeFormModal } from './college-form-modal';
import { hasPermission } from '@/lib/permissions';

interface CollegesClientViewProps {
  colleges: any[];
  userRole: string;
}

export function CollegesClientView({ colleges, userRole }: CollegesClientViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');

  const canCreate = hasPermission(userRole as any, 'CREATE_COLLEGE');

  const cities = Array.from(new Set(colleges.map((c) => c.city)));

  const filtered = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = cityFilter === 'ALL' || c.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Building2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Examination Centers
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage institutions authorized to conduct examinations and receive encrypted papers.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Examination Center</span>
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search colleges by name, code, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Colleges Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-subtle text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No examination centers found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add an examination center institution to begin paper distribution.
          </p>
          {canCreate && (
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-blue-700 transition inline-flex items-center gap-1.5 mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Examination Center</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:border-blue-300 hover:shadow-card transition duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {c.code}
                  </span>
                  <StatusBadge status={c.status} size="sm" />
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-blue-600 transition">
                  <Link href={`/colleges/${c.id}`}>{c.name}</Link>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {c.city}, {c.state} ({c.postalCode})
                </p>
              </div>

              {/* Contact Meta */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Contact Officer:</span>
                  <span className="font-bold text-slate-900">{c.contactName || 'Exam Cell'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Email:</span>
                  <span className="font-mono text-slate-700 text-[11px]">{c.contactEmail}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">Assigned Exams:</span>
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-200 text-[10px]">
                    {c.assignments?.length || 0} Exams Assigned
                  </span>
                </div>
              </div>

              {/* Action Link */}
              <div className="flex items-center justify-end pt-1 border-t border-slate-100">
                <Link
                  href={`/colleges/${c.id}`}
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

      {/* College Form Modal */}
      <CollegeFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
