import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { UploadDropzone } from '@/components/papers/upload-dropzone';
import Link from 'next/link';
import { ArrowLeft, FileUp, ShieldCheck } from 'lucide-react';
import { hasPermission } from '@/lib/permissions';

export default async function PaperUploadPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  if (!hasPermission(user.role, 'UPLOAD_PAPER')) {
    redirect('/papers');
  }

  const exams = await prisma.exam.findMany({
    where: {
      status: { in: ['SCHEDULED', 'DRAFT'] },
    },
    orderBy: { examDate: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Back Navigation */}
          <Link
            href="/papers"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Question Papers
          </Link>

          {/* Page Header */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <FileUp className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Upload Question Paper
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Upload confidential PDF paper to be encrypted with AES-256-GCM and registered on blockchain.
              </p>
            </div>
          </div>

          {/* Upload Dropzone Pipeline Component */}
          <UploadDropzone exams={exams} />
        </main>
      </div>
    </div>
  );
}
