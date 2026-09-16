'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut, User, ChevronDown, Shield, Settings } from 'lucide-react';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700',
  EXAM_ADMIN: 'bg-blue-100 text-blue-700',
  QUESTION_SETTER: 'bg-indigo-100 text-indigo-700',
  COLLEGE_ADMIN: 'bg-emerald-100 text-emerald-700',
  INVIGILATOR: 'bg-amber-100 text-amber-700',
  AUDITOR: 'bg-slate-100 text-slate-700',
  PENDING: 'bg-gray-100 text-gray-600',
};

const DEMO_NOTIFICATIONS = [
  { id: '1', title: 'Role Updated', message: 'Your account role has been updated to SUPER_ADMIN.', time: '2 min ago', read: false },
  { id: '2', title: 'Exam Assigned', message: 'You have been assigned to UE-CSE-2026-001 examination.', time: '1 hr ago', read: false },
  { id: '3', title: 'Paper Encrypted', message: 'Question paper QP-DSA-001 encryption completed.', time: '3 hrs ago', read: true },
];

function getPageTitle(pathname: string): string {
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/exams': 'Examinations',
    '/colleges': 'Examination Centers',
    '/papers': 'Question Papers',
    '/blockchain': 'Blockchain Registry',
    '/verification': 'Paper Verification',
    '/admin/users': 'User Management',
    '/audit': 'Audit Logs',
    '/security-alerts': 'Security Alerts',
  };
  for (const [key, label] of Object.entries(map)) {
    if (pathname.startsWith(key)) return label;
  }
  return 'SecureExam';
}

export function Topbar() {
  const { user, clearDemoSession } = useDemoSession();
  const pathname = usePathname();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = DEMO_NOTIFICATIONS.filter(n => !n.read).length;

  const handleSignOut = () => {
    clearDemoSession();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-blue-600" />
          <h1 className="text-sm font-bold text-slate-900">{getPageTitle(pathname)}</h1>
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 transition"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-glass z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              {DEMO_NOTIFICATIONS.map(n => (
                <div key={n.id} className={cn('px-4 py-3 border-b border-slate-100 last:border-0', !n.read && 'bg-blue-50/50')}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name || ''} className="w-7 h-7 rounded-full object-cover ring-2 ring-slate-200" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-none">{user?.full_name?.split(' ')[0] || 'User'}</p>
              <p className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 inline-block', ROLE_COLORS[user?.role || 'PENDING'])}>
                {(user?.role || 'PENDING').replace('_', ' ')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-glass z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name || ''} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      {(user?.full_name || 'U')[0]}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user?.full_name || 'Demo User'}</p>
                    <p className="text-[11px] text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block border', ROLE_COLORS[user?.role || 'PENDING'])}>
                  {(user?.role || 'PENDING').replace('_', ' ')}
                </span>
              </div>
              <div className="py-1">
                <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <User className="w-4 h-4 text-slate-500" /> My Dashboard
                </Link>
                <Link href="/admin/users" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Settings className="w-4 h-4 text-slate-500" /> Settings
                </Link>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
