import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { BlockchainClientView } from '@/components/blockchain/blockchain-client-view';

export default async function BlockchainRecordsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  // Fetch real blockchain records from database
  const records = await prisma.blockchainRecord.findMany({
    include: {
      paper: {
        include: { exam: true },
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  const totalRegistered = records.length;
  const totalRevoked = records.filter((r) => r.paper?.isRevoked).length;
  const confirmedTxns = records.filter((r) => r.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <BlockchainClientView
            records={records}
            stats={{
              totalRegistered,
              confirmedTxns,
              totalRevoked,
            }}
          />
        </main>
      </div>
    </div>
  );
}
