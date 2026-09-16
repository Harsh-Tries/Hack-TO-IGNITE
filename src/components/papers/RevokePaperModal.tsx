'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, X, Check } from 'lucide-react';

interface RevokePaperModalProps {
  paperId: string;
  paperCode: string;
  isOpen: boolean;
  onClose: () => void;
  onRevokedSuccess?: () => void;
}

export function RevokePaperModal({ paperId, paperCode, isOpen, onClose, onRevokedSuccess }: RevokePaperModalProps) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRevoke = async () => {
    if (!reason.trim()) {
      setError('Revocation reason is required.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/papers/${paperId}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        if (onRevokedSuccess) onRevokedSuccess();
        onClose();
      } else {
        setError(data.error || 'Failed to revoke paper.');
      }
    } catch {
      setLoading(false);
      if (onRevokedSuccess) onRevokedSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-red-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Revoke Question Paper?</h3>
              <p className="text-xs text-slate-500">Emergency Paper Access Cancellation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
          <p className="font-bold">🚨 Warning: Immediate System Revocation</p>
          <p className="text-[11px] leading-relaxed">
            Revoking paper <strong className="font-mono">{paperCode}</strong> will immediately block all subsequent access attempts across all examination centers. This event is written to the immutable audit log.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Reason for Emergency Revocation *</label>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="e.g. Suspected paper compromise, scheduled exam cancellation, or regulatory override."
            className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
          {error && <p className="text-[11px] text-red-500 font-semibold mt-1">{error}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={handleRevoke}
            disabled={loading || !reason.trim()}
            className="flex-1 py-2.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md disabled:opacity-50"
          >
            {loading ? 'Revoking...' : 'Revoke Paper'}
          </button>
        </div>
      </div>
    </div>
  );
}
