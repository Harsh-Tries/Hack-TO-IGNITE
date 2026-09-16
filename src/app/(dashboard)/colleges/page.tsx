import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { CollegesClientView } from '@/components/colleges/colleges-client-view';

export default async function CollegesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  // Data Scoping
  let collegeWhere: any = {};
  if (user.role === 'COLLEGE_ADMIN' || user.role === 'INVIGILATOR') {
    if (user.collegeId) {
      collegeWhere = { id: user.collegeId };
    }
  }

  const colleges = await prisma.college.findMany({
    where: collegeWhere,
    include: {
      assignments: { include: { exam: true } },
      users: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <CollegesClientView colleges={colleges} userRole={user.role} />
        </main>
      </div>
    </div>
  );
}
