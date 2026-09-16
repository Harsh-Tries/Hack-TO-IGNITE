'use client';

import React from 'react';
import { 
  FileUp, 
  Lock, 
  Building2, 
  Link as ChainIcon, 
  ShieldAlert, 
  Unlock, 
  Activity 
} from 'lucide-react';
import { RecentActivityItem } from '@/types';

const MOCK_ACTIVITIES: RecentActivityItem[] = [
  {
    id: 'act-1',
    title: 'Paper uploaded',
    code: 'DSA-2026-001',
    timestamp: '2 mins ago',
    type: 'upload',
    status: 'info',
  },
  {
    id: 'act-2',
    title: 'AES-256 Encrypted',
    code: 'MAT-2026-002',
    timestamp: '14 mins ago',
    type: 'encrypt',
    status: 'info',
  },
  {
    id: 'act-3',
    title: 'Assigned to PICT',
    code: 'Mathematics-2026',
    timestamp: '1 hour ago',
    type: 'assign',
    status: 'success',
  },
  {
    id: 'act-4',
    title: 'Blockchain Registered',
    code: 'TX: 0x7a3f...9c2e',
    timestamp: '2 hours ago',
    type: 'blockchain',
    status: 'success',
  },
  {
    id: 'act-5',
    title: 'Access Attempt Denied',
    code: 'INVIGILATOR-023',
    timestamp: '3 hours ago',
    type: 'denied',
    status: 'danger',
  },
  {
    id: 'act-6',
    title: 'Paper Released',
    code: 'ECE-2026-003',
    timestamp: '5 hours ago',
    type: 'release',
    status: 'success',
  },
];

export function RightPanel() {
  const getIcon = (type: RecentActivityItem['type']) => {
    switch (type) {
      case 'upload':
        return <FileUp className="w-3.5 h-3.5 text-blue-600" />;
      case 'encrypt':
        return <Lock className="w-3.5 h-3.5 text-indigo-600" />;
      case 'assign':
        return <Building2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'blockchain':
        return <ChainIcon className="w-3.5 h-3.5 text-purple-600" />;
      case 'denied':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case 'release':
        return <Unlock className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const getStatusBg = (status: RecentActivityItem['status']) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 border-emerald-200/60';
      case 'danger':
        return 'bg-rose-50 border-rose-200/60';
      case 'warning':
        return 'bg-amber-50 border-amber-200/60';
      default:
        return 'bg-blue-50 border-blue-200/60';
    }
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200/80 p-5 hidden lg:block shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          Recent Security Activity
        </h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
      </div>

      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        Real-time audit log stream of paper uploads, encryption events, & access attempts.
      </p>

      {/* Activity Timeline Stream */}
      <div className="space-y-3 relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

        {MOCK_ACTIVITIES.map((item) => (
          <div key={item.id} className="relative flex items-start gap-3 group">
            {/* Icon Bubble */}
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 z-10 ${getStatusBg(item.status)} shadow-xs`}>
              {getIcon(item.type)}
            </div>

            {/* Content */}
            <div className="flex-1 bg-slate-50/70 hover:bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/60 transition duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{item.title}</span>
                <span className="text-[10px] text-slate-400 font-medium">{item.timestamp}</span>
              </div>
              <p className="text-[11px] font-mono text-slate-600 mt-0.5 font-medium">
                {item.code}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
