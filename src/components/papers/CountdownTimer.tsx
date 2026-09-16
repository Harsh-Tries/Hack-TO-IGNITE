'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string | Date;
  onExpire?: () => void;
}

export function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        if (onExpire) onExpire();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onExpire]);

  if (isExpired) {
    return (
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
        <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">00 : 00 : 00 : 00 — RELEASED</span>
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[
        { label: 'DAYS', val: pad(timeLeft.days) },
        { label: 'HRS', val: pad(timeLeft.hours) },
        { label: 'MIN', val: pad(timeLeft.minutes) },
        { label: 'SEC', val: pad(timeLeft.seconds) },
      ].map((item, i) => (
        <div key={i} className="p-3 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-inner">
          <span className="font-mono text-xl md:text-2xl font-black text-amber-400 tracking-widest block">{item.val}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
