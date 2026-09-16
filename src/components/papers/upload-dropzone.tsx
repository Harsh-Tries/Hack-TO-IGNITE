'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Lock, 
  Link as ChainIcon, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  RefreshCw 
} from 'lucide-react';
import { uploadQuestionPaper } from '@/app/actions/paper-actions';

interface UploadDropzoneProps {
  exams: any[];
}

export function UploadDropzone({ exams }: UploadDropzoneProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
  const [subject, setSubject] = useState(exams[0]?.subject || '');
  const [paperCode, setPaperCode] = useState('');

  const [pipelineStage, setPipelineStage] = useState<
    'IDLE' | 'VALIDATING' | 'HASHING' | 'ENCRYPTING' | 'STORING' | 'REGISTERING' | 'COMPLETED' | 'ERROR'
  >('IDLE');

  const [resultData, setResultData] = useState<{
    paperId?: string;
    paperCode?: string;
    sha256Hash?: string;
    txHash?: string;
    blockNumber?: number;
  }>({});

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExamChange = (examId: string) => {
    setSelectedExamId(examId);
    const found = exams.find((e) => e.id === examId);
    if (found) {
      setSubject(found.subject);
      setPaperCode(`QP-${found.examCode}-01`);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
        setErrorMessage(null);
      } else {
        setErrorMessage('Only PDF documents are supported for secure question paper upload.');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
        setErrorMessage(null);
      } else {
        setErrorMessage('Only PDF documents are supported for secure question paper upload.');
      }
    }
  };

  const handleStartPipeline = async () => {
    if (!file || !selectedExamId || !subject) {
      setErrorMessage('Please select an examination and attach a PDF question paper.');
      return;
    }

    setErrorMessage(null);
    setPipelineStage('VALIDATING');

    // Simulate animated pipeline stages for cybersecurity UX
    await new Promise((r) => setTimeout(r, 600));
    setPipelineStage('HASHING');

    await new Promise((r) => setTimeout(r, 700));
    setPipelineStage('ENCRYPTING');

    await new Promise((r) => setTimeout(r, 700));
    setPipelineStage('STORING');

    await new Promise((r) => setTimeout(r, 600));
    setPipelineStage('REGISTERING');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('examId', selectedExamId);
    formData.append('subject', subject);
    formData.append('paperCode', paperCode);

    const res = await uploadQuestionPaper(formData);

    if (res.success) {
      setPipelineStage('COMPLETED');
      setResultData({
        paperId: res.paperId,
        paperCode: res.paperCode,
        sha256Hash: res.sha256Hash,
        txHash: res.txHash,
        blockNumber: res.blockNumber,
      });
    } else {
      setPipelineStage('ERROR');
      setErrorMessage(res.error || 'Pipeline execution failed.');
    }
  };

  const resetForm = () => {
    setFile(null);
    setPipelineStage('IDLE');
    setResultData({});
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Configuration Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle space-y-6">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Secure Question Paper Ingestion</h2>
            <p className="text-xs text-slate-500">
              Zero-knowledge file encryption with instant SHA-256 integrity blockchain anchoring.
            </p>
          </div>
          <span className="text-[11px] font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-bold">
            AES-256-GCM + HARDHAT LEDGER
          </span>
        </div>

        {pipelineStage === 'IDLE' && (
          <>
            {/* Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1.5 text-slate-900">Select Examination *</label>
                <select
                  value={selectedExamId}
                  onChange={(e) => handleExamChange(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {exams.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.examCode} — {ex.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-slate-900">Subject Name *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-slate-900">Custom Paper Code</label>
                <input
                  type="text"
                  value={paperCode}
                  onChange={(e) => setPaperCode(e.target.value)}
                  placeholder="Auto-generated if blank"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-10 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-200 ${
                file
                  ? 'border-emerald-400 bg-emerald-50/40'
                  : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,application/pdf"
                className="hidden"
              />

              {file ? (
                <div className="space-y-2">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
                    <FileText className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{file.name}</h3>
                  <p className="text-xs text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Ready for cryptographic ingestion
                  </p>
                  <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Click to replace PDF
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
                    <UploadCloud className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Drag & drop question paper PDF here
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      or browse from local disk (PDF • Maximum 15 MB)
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <Lock className="w-3.5 h-3.5 text-blue-500" />
                    <span>Plaintext is deleted from memory immediately after encryption</span>
                  </div>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Launch Pipeline Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleStartPipeline}
                disabled={!file}
                className="px-7 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Encrypt & Anchor to Blockchain</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Processing Pipeline Animated View */}
        {pipelineStage !== 'IDLE' && pipelineStage !== 'COMPLETED' && pipelineStage !== 'ERROR' && (
          <div className="py-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100 animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Executing Security Ingestion Pipeline...
              </h3>
              <p className="text-xs text-slate-500">
                Applying cryptographic transformations and writing to smart contract ledger
              </p>
            </div>

            {/* Step Indicators */}
            <div className="space-y-2.5 max-w-lg mx-auto font-mono text-xs">
              {[
                { key: 'VALIDATING', label: '1. File Validation & PDF Parsing', done: pipelineStage !== 'VALIDATING' },
                { key: 'HASHING', label: '2. SHA-256 Cryptographic Hash Generation', done: ['ENCRYPTING', 'STORING', 'REGISTERING'].includes(pipelineStage) },
                { key: 'ENCRYPTING', label: '3. AES-256-GCM Symmetrical Cipher Encryption', done: ['STORING', 'REGISTERING'].includes(pipelineStage) },
                { key: 'STORING', label: '4. Encrypted Envelope Storage (.enc) & Key Isolation', done: pipelineStage === 'REGISTERING' },
                { key: 'REGISTERING', label: '5. Hardhat Smart Contract Ledger Registration', done: false },
              ].map((step, idx) => {
                const isActive = pipelineStage === step.key;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between transition ${
                      step.done
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isActive
                        ? 'bg-blue-50 text-blue-800 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <span className="font-semibold">{step.label}</span>
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-300">QUEUED</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error State */}
        {pipelineStage === 'ERROR' && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-rose-900">Pipeline Ingestion Failed</h3>
              <p className="text-xs text-rose-700 mt-1">{errorMessage}</p>
            </div>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success / Registration Confirmation Screen */}
        {pipelineStage === 'COMPLETED' && (
          <div className="py-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto border border-emerald-200 shadow-md">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Paper Encrypted & Anchored on Blockchain!
              </h3>
              <p className="text-xs text-slate-500">
                The question paper has been stored in encrypted format and registered immutably on the ledger.
              </p>
            </div>

            {/* Certificate Proof Card */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-sans font-bold">Paper Identifier:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {resultData.paperCode}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-sans font-bold block">SHA-256 Hash Signature:</span>
                <p className="p-2 bg-white rounded-lg border border-slate-200 text-slate-800 break-all text-[11px]">
                  {resultData.sha256Hash}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-sans font-bold block">Blockchain Transaction Hash:</span>
                <p className="p-2 bg-white rounded-lg border border-slate-200 text-purple-700 break-all text-[11px]">
                  {resultData.txHash}
                </p>
              </div>

              <div className="flex justify-between items-center pt-1 text-slate-600">
                <span>Block Number:</span>
                <span className="font-bold text-slate-900">#{resultData.blockNumber}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={resetForm}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200"
              >
                Upload Another Paper
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/blockchain')}
                  className="px-4 py-2.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 flex items-center gap-1.5"
                >
                  <ChainIcon className="w-3.5 h-3.5" />
                  <span>View Blockchain Ledger</span>
                </button>
                <button
                  onClick={() => router.push(`/papers/${resultData.paperId}`)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <span>View Paper Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
