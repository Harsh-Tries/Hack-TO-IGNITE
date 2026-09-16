import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { ExamDetailsClient } from '@/components/exams/exam-details-client';

export default async function ExamDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  const exam = await prisma.exam.findUnique({
    where: { id: params.id },
    include: {
      assignments: { include: { college: true } },
      createdBy: true,
    },
  });

  if (!exam) {
    notFound();
  }

  // Check IDOR / Role visibility
  if ((user.role === 'COLLEGE_ADMIN' || user.role === 'INVIGILATOR') && user.collegeId) {
    const isAssigned = exam.assignments.some((a) => a.collegeId === user.collegeId);
    if (!isAssigned) {
      redirect('/exams');
    }
  }

  const allColleges = await prisma.college.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          <ExamDetailsClient exam={exam} allColleges={allColleges} userRole={user.role} />
        </main>
      </div>
    </div>
  );
}
