'use client';

import React from 'react';
import Link from 'next/link';
import { 
  PlusCircle, 
  Upload, 
  Building2, 
  QrCode, 
  Link as ChainIcon, 
  ShieldAlert, 
  ArrowRight 
} from 'lucide-react';

const ACTION_ICONS: Record<string, React.ElementType> = {
  CREATE: PlusCircle,
  UPLOAD: Upload,
  ASSIGN: Building2,
  VERIFY: QrCode,
  BLOCKCHAIN: ChainIcon,
  ALERTS: ShieldAlert,
};

interface QuickActionProps {
  id: string;
  title: string;
  description: string;
  href: string;
  iconType: string;
}

export function QuickActionCard({ title, description, href, iconType }: QuickActionProps) {
  const Icon = ACTION_ICONS[iconType] || PlusCircle;

  return (
    <Link
      href={href}
      className="group p-4 bg-white rounded-2xl border border-slate-200/80 shadow-subtle hover:border-blue-300 hover:shadow-md transition-all duration-200 flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-200 border border-blue-100/80">
        <Icon className="w-5 h-5 stroke-[2.2]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
            {title}
          </h4>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
        <p className="text-[11px] text-slate-500 mt-1 leading-snug truncate">
          {description}
        </p>
      </div>
    </Link>
  );
}
