'use client';

import React, { useState, useEffect } from 'react';
import { Search, Users, Shield, Check, X } from 'lucide-react';
import { RoleBadge } from '@/components/ui/role-badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { DEMO_USERS } from '@/lib/demo-data';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const ALL_ROLES: UserRole[] = ['SUPER_ADMIN','EXAM_ADMIN','QUESTION_SETTER','COLLEGE_ADMIN','INVIGILATOR','AUDITOR','PENDING'];

export default function UsersPage() {
  const { user } = useDemoSession();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>('EXAM_ADMIN');
  const [mounted, setMounted] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    setUsers(Object.values(DEMO_USERS).map((u: any) => ({ ...u, status: u.role === 'PENDING' ? 'PENDING' : 'ACTIVE' })));
  }, []);

  if (!mounted) return null;
  if (user?.role !== 'SUPER_ADMIN') return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center"><Shield className="w-12 h-12 text-red-300 mx-auto mb-3" /><p className="text-sm font-bold text-slate-900">Access Denied</p><p className="text-xs text-slate-500">Super Admin only.</p></div>
    </div>
  );

  const filtered = users.filter(u => {
    const matchSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = { total: users.length, active: users.filter(u => u.status === 'ACTIVE').length, pending: users.filter(u => u.status === 'PENDING' || u.role === 'PENDING').length, suspended: users.filter(u => u.status === 'SUSPENDED').length };

  const handleRoleChange = () => {
    if (selectedUser) {
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
      setShowRoleDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-extrabold text-slate-900">User Management</h1><p className="text-xs text-slate-500 mt-0.5">Manage roles, status, and college assignments</p></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: 'Total Users', value: stats.total, color: 'text-slate-900' }, { label: 'Active', value: stats.active, color: 'text-emerald-600' }, { label: 'Pending', value: stats.pending, color: 'text-amber-600' }, { label: 'Suspended', value: stats.suspended, color: 'text-red-600' }].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle text-center">
            <p className={cn('text-2xl font-extrabold', s.color)}>{s.value}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none">
          <option value="ALL">All Roles</option>
          {ALL_ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none">
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['User', 'Role', 'Status', 'College', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-slate-600 uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {u.avatar_url ? <img src={u.avatar_url} alt={u.full_name} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">{u.full_name?.[0]}</div>}
                      <div>
                        <p className="font-bold text-slate-900">{u.full_name}</p>
                        <p className="text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><RoleBadge role={u.role as UserRole} size="sm" /></td>
                  <td className="px-4 py-3"><StatusBadge status={u.status || 'ACTIVE'} size="sm" /></td>
                  <td className="px-4 py-3 text-slate-600">{(u as any).collegeName || '—'}</td>
                  <td className="px-4 py-3 text-slate-500">Just now</td>
                  <td className="px-4 py-3">
                    {u.email !== user?.email && (
                      <button
                        onClick={() => { setSelectedUser(u); setNewRole(u.role); setShowRoleDialog(true); }}
                        className="text-[10px] font-bold text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50"
                      >
                        Change Role
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Change Dialog */}
      {showRoleDialog && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowRoleDialog(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-glass" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Change User Role</h3>
            <p className="text-xs text-slate-500 mb-4">Update the role for <strong>{selectedUser.full_name}</strong></p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600 font-semibold">Current Role</span>
                <RoleBadge role={selectedUser.role} size="sm" />
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
                <span className="text-xs text-slate-700 font-semibold block">New Role</span>
                <select value={newRole} onChange={e => setNewRole(e.target.value as UserRole)} className="w-full text-xs font-semibold border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {ALL_ROLES.filter(r => r !== 'SUPER_ADMIN').map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                ⚠ Changing this role immediately updates the permissions available to this account.
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRoleDialog(false)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                <X className="w-4 h-4" /> Cancel
              </button>
              <button onClick={handleRoleChange} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Check className="w-4 h-4" /> Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
