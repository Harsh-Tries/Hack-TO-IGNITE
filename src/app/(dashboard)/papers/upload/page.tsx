'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, Lock, Link2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEMO_EXAMS = [
  { id: 'e1', code: 'UE-CSE-2026-001', name: 'Data Structures and Algorithms' },
  { id: 'e2', code: 'UE-CSE-2026-002', name: 'Database Management Systems' },
  { id: 'e3', code: 'UE-IT-2026-003', name: 'Web Technology and Applications' },
  { id: 'e4', code: 'UE-MECH-2026-004', name: 'Thermodynamics and Heat Transfer' },
];

type Step = { label: string; done: boolean; active: boolean; icon: React.ElementType };

function simulateHash(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
  return Math.abs(hash).toString(16).padEnd(64, '0').slice(0, 64);
}

function simulateTxHash(): string {
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export default function UploadPaperPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [examId, setExamId] = useState('e1');
  const [paperCode, setPaperCode] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.pdf') && f.type !== 'application/pdf') { setError('Only PDF files are accepted.'); return; }
    if (f.size > 15 * 1024 * 1024) { setError('File must be under 15MB.'); return; }
    setError(''); setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };

  const handleSubmit = async () => {
    if (!file) { setError('Please select a PDF file.'); return; }
    setUploading(true); setSteps([]);

    const addStep = (s: string) => setSteps(prev => [...prev, s]);

    await new Promise(r => setTimeout(r, 400)); addStep('✓ File validated (PDF, <15MB)');
    await new Promise(r => setTimeout(r, 500)); addStep('✓ SHA-256 hash calculated');
    await new Promise(r => setTimeout(r, 600)); addStep('✓ AES-256-GCM encryption applied');
    await new Promise(r => setTimeout(r, 500)); addStep('✓ Encrypted file uploaded to Supabase Storage');
    await new Promise(r => setTimeout(r, 400)); addStep('✓ Paper metadata stored in database');
    await new Promise(r => setTimeout(r, 800)); addStep('✓ Hash registered on blockchain');
    await new Promise(r => setTimeout(r, 400)); addStep('✓ Audit event recorded');

    const sha256 = simulateHash(file.name + examId);
    const txHash = simulateTxHash();
    const generatedCode = paperCode || `QP-${DEMO_EXAMS.find(e => e.id === examId)?.code?.split('-').slice(1,3).join('') || 'EXAM'}-${Date.now().toString().slice(-4)}`;

    setResult({ sha256, txHash, paperCode: generatedCode, blockNumber: 12840 + Math.floor(Math.random() * 100) });
    setUploading(false);
  };

  if (result) return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl border border-emerald-200 shadow-subtle p-6 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-500" /></div>
          <h2 className="text-lg font-extrabold text-slate-900">Paper Secured Successfully</h2>
          <p className="text-xs text-slate-500">The question paper has been encrypted, stored, and registered on blockchain.</p>
        </div>
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between">
            <span className="font-semibold text-indigo-700 flex items-center gap-2"><Lock className="w-3.5 h-3.5" /> AES-256-GCM Encrypted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-slate-500 font-semibold mb-1">SHA-256 Hash</p>
            <code className="font-mono text-purple-600 text-[11px] break-all">{result.sha256}</code>
          </div>
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
            <p className="text-purple-700 font-semibold mb-1 flex items-center gap-2"><Link2 className="w-3.5 h-3.5" /> Blockchain Transaction</p>
            <code className="font-mono text-purple-600 text-[11px] break-all">{result.txHash}</code>
            <p className="text-purple-500 text-[10px] mt-1">Block #{result.blockNumber} • Network: Hardhat Local</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/papers')} className="flex-1 text-xs font-bold bg-blue-600 text-white py-2.5 rounded-xl">View All Papers</button>
          <button onClick={() => { setFile(null); setResult(null); setSteps([]); }} className="flex-1 text-xs font-bold border border-slate-200 text-slate-600 py-2.5 rounded-xl hover:bg-slate-50">Upload Another</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/papers')} className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"><ArrowLeft className="w-4 h-4" /></button>
        <div><h1 className="text-xl font-extrabold text-slate-900">Upload Question Paper</h1><p className="text-xs text-slate-500">PDF → SHA-256 → AES-256-GCM → Supabase Storage → Blockchain</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-5">
        {/* Exam Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">Select Examination *</label>
          <select value={examId} onChange={e => setExamId(e.target.value)} className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            {DEMO_EXAMS.map(e => <option key={e.id} value={e.id}>{e.code} — {e.name}</option>)}
          </select>
        </div>

        {/* Paper Code */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">Paper Code (optional)</label>
          <input value={paperCode} onChange={e => setPaperCode(e.target.value)} placeholder="Auto-generated if left blank" className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Dropzone */}
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">Question Paper PDF *</label>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={cn('border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition', dragOver ? 'border-blue-400 bg-blue-50' : file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50')}
          >
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            {file ? (
              <div className="space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-700">{file.name}</span>
                  <button onClick={e => { e.stopPropagation(); setFile(null); }} className="text-slate-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
                <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • PDF</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-600">Drag & drop PDF here or click to browse</p>
                <p className="text-xs text-slate-400">PDF only • Max 15MB</p>
              </div>
            )}
          </div>
          {error && <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
        </div>

        {/* Security Pipeline Info */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-2">
          <p className="text-xs font-bold text-blue-800">Security Pipeline (Server-Side):</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-700">
            {['SHA-256 Hash', 'AES-256-GCM Encrypt', 'Supabase Storage', 'Blockchain Registration'].map((s, i) => (
              <div key={s} className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-[9px] font-bold">{i+1}</span>{s}</div>
            ))}
          </div>
        </div>

        {/* Steps progress */}
        {steps.length > 0 && (
          <div className="p-4 bg-slate-900 rounded-xl space-y-1">
            {steps.map((s, i) => (
              <p key={i} className="font-mono text-xs text-emerald-400">{s}</p>
            ))}
            {uploading && <p className="font-mono text-xs text-blue-400 animate-pulse">Processing...</p>}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!file || uploading}
          className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Processing...</span> : <><Lock className="w-4 h-4" />Encrypt & Register Paper</>}
        </button>
      </div>
    </div>
  );
}
