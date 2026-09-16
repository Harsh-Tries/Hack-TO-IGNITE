'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, GraduationCap, Building2, FileText, Link2,
  Search, Users, ShieldCheck, AlertTriangle, Clock, Menu, X,
  Shield, ChevronRight,
} from 'lucide-react';
import { useDemoSession } from '@/components/providers/demo-session-provider';
import { getNavItemsForRole } from '@/lib/permissions';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, GraduationCap, Building2, FileText, Link2,
  Search, Users, ShieldCheck, AlertTriangle, Clock, Shield,
};

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
  EXAM_ADMIN: 'bg-blue-100 text-blue-700 border-blue-200',
  QUESTION_SETTER: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  COLLEGE_ADMIN: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  INVIGILATOR: 'bg-amber-100 text-amber-700 border-amber-200',
  AUDITOR: 'bg-slate-100 text-slate-700 border-slate-200',
  PENDING: 'bg-gray-100 text-gray-600 border-gray-200',
};

export function Sidebar() {
  const { user, isLoading } = useDemoSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = (user?.role || 'PENDING') as UserRole;
  const navItems = getNavItemsForRole(role);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200/80 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Shield className="w-4.5 h-4.5 stroke-[2.5]" />
        </div>
        <div>
          <span className="font-extrabold text-slate-900 text-base tracking-tight">
            SECURE<span className="text-blue-600">EXAM</span>
          </span>
          <p className="text-[10px] text-slate-400 font-medium">Blockchain Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {!isLoading && navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] || ShieldCheck;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700')} />
              <span className="tracking-wide">{item.title}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto text-blue-500" />}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      {user && (
        <div className="px-4 py-4 border-t border-slate-200/80 shrink-0">
          <div className="flex items-center gap-3">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name || ''} className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                {(user.full_name || user.email)[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user.full_name || 'User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-2">
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border', ROLE_COLORS[role])}>
              {role.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border border-slate-200 rounded-xl p-2 shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 lg:hidden',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
