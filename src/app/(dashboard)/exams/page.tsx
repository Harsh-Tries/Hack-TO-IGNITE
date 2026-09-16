import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { ExamsClientView } from '@/components/exams/exams-client-view';

export default async function ExamsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  // Role-Specific Data Scoping per Section 40 & 41
  let examsWhere: any = {};
  if (user.role === 'COLLEGE_ADMIN' || user.role === 'INVIGILATOR') {
    if (user.collegeId) {
      examsWhere = {
        assignments: {
          some: { collegeId: user.collegeId },
        },
      };
    } else {
      examsWhere = { id: 'no-college-assigned' };
    }
  }

  // Fetch Exams & Colleges from DB
  const exams = await prisma.exam.findMany({
    where: examsWhere,
    include: {
      assignments: { include: { college: true } },
      createdBy: true,
    },
    orderBy: { examDate: 'asc' },
  });

  const colleges = await prisma.college.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <ExamsClientView exams={exams} colleges={colleges} userRole={user.role} />
        </main>
      </div>
    </div>
  );
}
