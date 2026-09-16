'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { UserRole } from '@/types';
import { updateUserRole } from '@/app/actions/user-actions';

interface RoleChangeModalProps {
  user: { id: string; name: string; email: string; role: UserRole };
  isOpen: boolean;
  onClose: () => void;
}

const ROLES_LIST: { role: UserRole; label: string; desc: string }[] = [
  { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full system administration & user access control' },
  { role: 'EXAM_ADMIN', label: 'Exam Controller', desc: 'Create & manage exam schedules and center assignments' },
  { role: 'QUESTION_SETTER', label: 'Question Setter', desc: 'Author and submit encrypted question papers' },
  { role: 'COLLEGE_ADMIN', label: 'College Admin', desc: 'Manage exam center operations for assigned institution' },
  { role: 'INVIGILATOR', label: 'Invigilator', desc: 'Conduct today’s examinations & verify paper authenticity' },
  { role: 'AUDITOR', label: 'Security Auditor', desc: 'Inspect blockchain records and system audit logs' },
  { role: 'PENDING', label: 'Pending Approval', desc: 'Restricted account awaiting role assignment' },
];

export function RoleChangeModal({ user, isOpen, onClose }: RoleChangeModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (selectedRole === user.role) return;
    setLoading(true);
    setError(null);

    const res = await updateUserRole(user.id, selectedRole);
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Failed to update role.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Change User Role</h3>
              <p className="text-xs text-slate-500">Modify system authorization level for personnel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
          <p className="font-bold text-slate-900">{user.name}</p>
          <p className="text-slate-500 font-mono mt-0.5">{user.email}</p>
          <p className="text-amber-800 font-semibold mt-1">
            Current Role: <span className="bg-amber-100 px-2 py-0.5 rounded text-[11px] font-mono">{user.role}</span>
          </p>
        </div>

        {/* Warning Alert */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <strong>Warning:</strong> Changing a role modifies all system permissions and access capabilities for this user account. This event is logged immutably.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Role Selector List */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {ROLES_LIST.map((r) => (
            <label
              key={r.role}
              onClick={() => setSelectedRole(r.role)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                selectedRole === r.role
                  ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="role"
                checked={selectedRole === r.role}
                onChange={() => setSelectedRole(r.role)}
                className="mt-0.5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">{r.label}</p>
                <p className="text-[11px] text-slate-500">{r.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || selectedRole === user.role}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md transition flex items-center gap-2"
          >
            {loading ? 'Updating Role...' : 'Confirm Role Change'}
          </button>
        </div>
      </div>
    </div>
  );
}
