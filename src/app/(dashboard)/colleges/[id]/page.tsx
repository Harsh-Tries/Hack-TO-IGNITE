import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  GraduationCap, 
  ArrowLeft, 
  Lock, 
  Users, 
  Calendar 
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/status-badge';

export default async function CollegeDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!user || user.role === 'PENDING') {
    redirect('/pending');
  }

  // IDOR protection
  if ((user.role === 'COLLEGE_ADMIN' || user.role === 'INVIGILATOR') && user.collegeId && user.collegeId !== params.id) {
    redirect('/colleges');
  }

  const college = await prisma.college.findUnique({
    where: { id: params.id },
    include: {
      assignments: { include: { exam: true } },
      users: true,
    },
  });

  if (!college) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Back Button */}
          <Link
            href="/colleges"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Examination Centers
          </Link>

          {/* Header Banner */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {college.code}
                </span>
                <StatusBadge status={college.status} size="md" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{college.name}</h1>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {college.address}, {college.city}, {college.state} ({college.postalCode})
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Contact Details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" /> Institution Profile
              </h3>
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Contact Officer:</span>
                  <span className="font-bold text-slate-900">{college.contactName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Contact Email:</span>
                  <span className="font-mono text-slate-900 font-semibold">{college.contactEmail}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Contact Phone:</span>
                  <span className="font-semibold text-slate-900">{college.contactPhone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Registered Personnel:</span>
                  <span className="font-bold text-slate-900">{college.users.length} Users</span>
                </div>
              </div>
            </div>

            {/* Card 2: Security & Paper Delivery Placeholder */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" /> Center Security Status
                </h3>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded font-bold">
                  COMING SOON
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                Encrypted Question Paper delivery endpoints, time-locked key decryption, and live invigilator QR verification logs will appear here in Phase 4-7.
              </p>
            </div>

            {/* Card 3: Assigned Examinations */}
            <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" /> Assigned Examinations ({college.assignments.length})
              </h3>
              <div className="border-t border-slate-100 pt-3 space-y-2">
                {college.assignments.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No examinations assigned to this center yet.</p>
                ) : (
                  college.assignments.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mr-2">
                          {a.exam.examCode}
                        </span>
                        <span className="font-bold text-slate-900">{a.exam.title}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Date: {new Date(a.exam.examDate).toLocaleDateString()} • Start Time: {a.exam.startTime}
                        </p>
                      </div>
                      <Link
                        href={`/exams/${a.exam.id}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        Exam Details →
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
