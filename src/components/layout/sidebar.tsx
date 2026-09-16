'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getNavItemsForRole } from '@/lib/permissions';
import { UserRole } from '@/types';
import {
  Shield,
  Home,
  LayoutDashboard,
  GraduationCap,
  FileText,
  Building2,
  QrCode,
  Link as ChainIcon,
  ShieldCheck,
  AlertTriangle,
  Users,
  Clock,
  ExternalLink,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  LayoutDashboard,
  GraduationCap,
  FileText,
  Building2,
  QrCode,
  Link: ChainIcon,
  ShieldCheck,
  AlertTriangle,
  Users,
  Clock,
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userRole: UserRole = (session?.user as any)?.role || 'SUPER_ADMIN';
  const navItems = getNavItemsForRole(userRole);

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 min-h-screen sticky top-0 z-30 shadow-subtle">
      {/* Top Header & Branding */}
      <div>
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base tracking-tight flex items-center gap-1">
              SECURE<span className="text-blue-600">EXAM</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Blockchain • Encryption • Trust
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation ({userRole.replace('_', ' ')})
          </div>

          {navItems.map((item) => {
            const IconComponent = ICON_MAP[item.icon] || FileText;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/60 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Branding & Verification Card */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-3.5 rounded-xl text-xs space-y-2 shadow-sm border border-slate-700/50">
          <div className="flex items-center justify-between text-blue-400 font-bold text-[11px] uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Secure Exam OS
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-slate-300 font-semibold leading-snug">
            Secure. <br />
            Transparent. <br />
            Tamper-Proof.
          </p>
          <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Powered by Blockchain</span>
            <ChainIcon className="w-3 h-3 text-purple-400" />
          </p>
        </div>
      </div>
    </aside>
  );
}
