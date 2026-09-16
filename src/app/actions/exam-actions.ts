'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function createExam(data: {
  title: string;
  examCode: string;
  description?: string;
  academicYear: string;
  semester: string;
  department: string;
  subject: string;
  examDate: string; // ISO date string
  startTime: string;
  durationMinutes: number;
  paperReleaseTime: string; // ISO date string
  collegeIds: string[];
}) {
  const session = await getServerSession(authOptions);
  const actor = session?.user as any;

  if (!actor || !hasPermission(actor.role, 'CREATE_EXAM')) {
    return { success: false, error: 'Unauthorized: You do not have permission to create examinations.' };
  }

  // Basic server-side validation
  if (new Date(data.paperReleaseTime) > new Date(data.examDate)) {
    return { success: false, error: 'Paper release time cannot be scheduled after the examination start date.' };
  }

  try {
    const existingCode = await prisma.exam.findUnique({ where: { examCode: data.examCode } });
    if (existingCode) {
      return { success: false, error: `Exam code "${data.examCode}" is already in use. Please enter a unique code.` };
    }

    const exam = await prisma.exam.create({
      data: {
        title: data.title,
        examCode: data.examCode,
        description: data.description,
        academicYear: data.academicYear,
        semester: data.semester,
        department: data.department,
        subject: data.subject,
        examDate: new Date(data.examDate),
        startTime: data.startTime,
        durationMinutes: data.durationMinutes,
        paperReleaseTime: new Date(data.paperReleaseTime),
        status: 'SCHEDULED',
        createdById: actor.id,
      },
    });

    // Assign centers
    if (data.collegeIds && data.collegeIds.length > 0) {
      await prisma.examCenterAssignment.createMany({
        data: data.collegeIds.map((cId) => ({
          examId: exam.id,
          collegeId: cId,
          assignedById: actor.id,
          status: 'ASSIGNED',
        })),
      });
    }

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        eventType: 'EXAM_CREATED',
        entityType: 'Exam',
        entityId: exam.id,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        targetResource: exam.examCode,
        details: `Created examination "${exam.title}" scheduled for ${new Date(exam.examDate).toLocaleDateString()}.`,
        result: 'GRANTED',
      },
    });

    revalidatePath('/exams');
    revalidatePath('/dashboard');
    return { success: true, examId: exam.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create examination.' };
  }
}

export async function assignCentersToExam(examId: string, collegeIds: string[]) {
  const session = await getServerSession(authOptions);
  const actor = session?.user as any;

  if (!actor || !hasPermission(actor.role, 'EDIT_EXAM')) {
    return { success: false, error: 'Unauthorized: Permission denied.' };
  }

  try {
    // Clear old assignments and add new
    await prisma.examCenterAssignment.deleteMany({ where: { examId } });

    if (collegeIds.length > 0) {
      await prisma.examCenterAssignment.createMany({
        data: collegeIds.map((cId) => ({
          examId,
          collegeId: cId,
          assignedById: actor.id,
          status: 'ASSIGNED',
        })),
      });
    }

    await prisma.auditLog.create({
      data: {
        eventType: 'EXAM_CENTER_ASSIGNED',
        entityType: 'Exam',
        entityId: examId,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        targetResource: examId,
        details: `Assigned ${collegeIds.length} examination center(s) to exam ID ${examId}.`,
        result: 'GRANTED',
      },
    });

    revalidatePath(`/exams/${examId}`);
    revalidatePath('/exams');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to assign centers.' };
  }
}
