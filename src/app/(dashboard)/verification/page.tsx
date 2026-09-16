import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { VerificationClientView } from '@/components/verification/verification-client-view';

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: { paperId?: string };
}) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  const papers = await prisma.questionPaper.findMany({
    include: { exam: true, blockchainRecord: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <VerificationClientView papers={papers} initialPaperId={searchParams.paperId} />
        </main>
      </div>
    </div>
  );
}
