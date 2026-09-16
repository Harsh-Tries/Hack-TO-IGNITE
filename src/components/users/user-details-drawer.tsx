'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Building2, 
  Clock, 
  AlertOctagon, 
  Key, 
  Ban, 
  Check 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { UserRole } from '@/types';
import { RoleChangeModal } from './role-change-modal';
import { updateUserStatus } from '@/app/actions/user-actions';

interface UserDetailsDrawerProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UserDetailsDrawer({ user, isOpen, onClose }: UserDetailsDrawerProps) {
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  if (!isOpen || !user) return null;

  const handleToggleStatus = async () => {
    const newStatus = user.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
    setLoadingStatus(true);
    await updateUserStatus(user.id, newStatus);
    setLoadingStatus(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs flex justify-end">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                User Personnel File
              </span>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <StatusBadge status={user.role} size="sm" />
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    user.status === 'SUSPENDED'
                      ? 'bg-rose-100 text-rose-800'
                      : user.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    ● {user.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Grid */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Google Verification State:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Google Verified
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500 font-medium">Associated Institution:</span>
                  <span className="font-semibold text-slate-900">
                    {user.college?.name || 'Central Exam Authority'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500 font-medium">Account ID:</span>
                  <span className="font-mono text-slate-600 text-[11px] truncate max-w-[160px]">{user.id}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-slate-600">
                <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Audit Metadata</p>
                <div className="flex justify-between">
                  <span>Registered Date:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Last Authenticated:</span>
                  <span className="font-semibold text-slate-900">
                    {new Date(user.lastLoginAt || user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={() => setRoleModalOpen(true)}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Change User Role</span>
              </button>

              <button
                onClick={handleToggleStatus}
                disabled={loadingStatus}
                className={`w-full py-2.5 px-4 font-bold text-xs rounded-xl border transition flex items-center justify-center gap-2 ${
                  user.status === 'SUSPENDED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                }`}
              >
                {user.status === 'SUSPENDED' ? (
                  <>
                    <Check className="w-4 h-4" /> <span>Activate Account Access</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4" /> <span>Suspend Account Access</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-4">
            Changes take immediate effect upon server revalidation.
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      <RoleChangeModal
        user={user}
        isOpen={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false);
          onClose();
        }}
      />
    </>
  );
}
