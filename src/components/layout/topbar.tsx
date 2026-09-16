'use client';

import React, { useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { Bell, CheckCircle2, ChevronDown, LogOut, User, Shield, Key } from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';
import { UserRole } from '@/types';

export function Topbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user as any || {
    name: 'Harsh Wagh',
    email: 'harsh@example.com',
    role: 'SUPER_ADMIN',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    isGoogleVerified: true,
    collegeName: 'Central Examination Authority',
  };

  const handleRoleSwitch = async (roleEmail: string) => {
    await signIn('demo-credentials', { email: roleEmail, callbackUrl: '/dashboard' });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-subtle">
      {/* Left Context Title / System State */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-700">System Environment:</span>
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 text-[11px] font-mono">
            MAINNET REGISTRY (DEMO)
          </span>
        </div>
      </div>

      {/* Right User Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button 
          className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200"
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            {/* Name & Verification */}
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Google Verified
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-slate-500 font-medium truncate max-w-[140px]">{user.email}</span>
                <StatusBadge status={user.role || 'SUPER_ADMIN'} size="sm" />
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 divide-y divide-slate-100">
              {/* User Info Header */}
              <div className="p-3 space-y-1">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                {user.collegeName && (
                  <p className="text-[11px] font-medium text-blue-600 bg-blue-50 p-1.5 rounded-md border border-blue-100 mt-1">
                    📍 {user.collegeName}
                  </p>
                )}
              </div>

              {/* Demo Role Switcher */}
              <div className="py-2">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Key className="w-3 h-3 text-amber-500" /> Demo Role Switcher
                </div>
                <div className="space-y-0.5 mt-1">
                  <button
                    onClick={() => handleRoleSwitch('admin@secureexam.demo')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Super Admin</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-mono">SUPER_ADMIN</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('exam.admin@secureexam.demo')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Exam Controller</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">EXAM_ADMIN</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('setter@secureexam.demo')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Question Setter</span>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono">QUESTION_SETTER</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('college@secureexam.demo')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>College Admin</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">COLLEGE_ADMIN</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('invigilator@secureexam.demo')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Invigilator</span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-mono">INVIGILATOR</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('auditor@secureexam.demo')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Security Auditor</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">AUDITOR</span>
                  </button>
                </div>
              </div>

              {/* Logout Action */}
              <div className="pt-2">
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
