import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { PaperDetailsClient } from '@/components/papers/paper-details-client';

export default async function PaperDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  const paper = await prisma.questionPaper.findUnique({
    where: { id: params.id },
    include: {
      exam: {
        include: {
          assignments: { include: { college: true } },
        },
      },
      uploader: true,
      blockchainRecord: true,
    },
  });

  if (!paper) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <PaperDetailsClient paper={paper} userRole={user.role} />
        </main>
      </div>
    </div>
  );
}
