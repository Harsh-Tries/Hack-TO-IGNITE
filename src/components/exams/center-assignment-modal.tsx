'use client';

import React, { useState } from 'react';
import { X, Check, Building2, ShieldAlert } from 'lucide-react';
import { assignCentersToExam } from '@/app/actions/exam-actions';

interface CenterAssignmentModalProps {
  examId: string;
  currentAssignments: string[]; // college IDs currently assigned
  allColleges: any[];
  isOpen: boolean;
  onClose: () => void;
}

export function CenterAssignmentModal({
  examId,
  currentAssignments,
  allColleges,
  isOpen,
  onClose,
}: CenterAssignmentModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(currentAssignments || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    const res = await assignCentersToExam(examId, selectedIds);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to update center assignments.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Building2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Assign Examination Centers</h3>
              <p className="text-[11px] text-slate-500">Authorize active colleges for paper distribution</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
          {allColleges.map((c) => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => handleToggle(c.id)}
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
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                    isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition"
          >
            {loading ? 'Saving Changes...' : 'Assign Selected Centers'}
          </button>
        </div>
      </div>
    </div>
  );
}
