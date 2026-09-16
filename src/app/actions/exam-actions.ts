'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getServerProfile } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function createExam(data: {
  title: string;
  examCode: string;
  description?: string;
  academicYear: string;
  semester: string;
  department: string;
  subject: string;
  examDate: string;
  startTime: string;
  durationMinutes: number;
  paperReleaseTime: string;
  collegeIds: string[];
}) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    // Demo mode: Return success for UI flow
    revalidatePath('/exams');
    revalidatePath('/dashboard');
    return { success: true, examId: 'demo-exam-' + Date.now() };
  }

  const actor = await getServerProfile();

  if (!actor || !hasPermission(actor.role, 'CREATE_EXAM')) {
    return { success: false, error: 'Unauthorized: You do not have permission to create examinations.' };
  }

  try {
    const supabase = await createClient();

    const { data: existingCode } = await supabase
      .from('exams')
      .select('id')
      .eq('code', data.examCode)
      .single();

    if (existingCode) {
      return { success: false, error: `Exam code "${data.examCode}" is already in use.` };
    }

    const { data: exam, error: createError } = await supabase
      .from('exams')
      .insert({
        name: data.title,
        code: data.examCode,
        description: data.description,
        academic_year: data.academicYear,
        semester: data.semester,
        department: data.department,
        subject: data.subject,
        exam_date: data.examDate,
        start_time: data.startTime,
        duration_minutes: data.durationMinutes,
        paper_release_time: data.paperReleaseTime || null,
        status: 'SCHEDULED',
        created_by: actor.id,
      })
      .select('id')
      .single();

    if (createError || !exam) {
      throw new Error(createError?.message || 'Failed to create exam record');
    }

    if (data.collegeIds && data.collegeIds.length > 0) {
      const assignments = data.collegeIds.map((cId) => ({
        exam_id: exam.id,
        college_id: cId,
        assigned_by: actor.id,
        status: 'ASSIGNED',
      }));

      await supabase.from('exam_center_assignments').insert(assignments);
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      actor_id: actor.id,
      event_type: 'EXAM_CREATED',
      entity_type: 'Exam',
      entity_id: exam.id,
      description: `Created examination "${data.title}" (${data.examCode})`,
      metadata: { code: data.examCode, academicYear: data.academicYear },
    });

    revalidatePath('/exams');
    revalidatePath('/dashboard');
    return { success: true, examId: exam.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create examination.' };
  }
}

export async function assignCentersToExam(examId: string, collegeIds: string[]) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    revalidatePath(`/exams/${examId}`);
    revalidatePath('/exams');
    return { success: true };
  }

  const actor = await getServerProfile();

  if (!actor || !hasPermission(actor.role, 'EDIT_EXAM')) {
    return { success: false, error: 'Unauthorized: Permission denied.' };
  }

  try {
    const supabase = await createClient();

    await supabase.from('exam_center_assignments').delete().eq('exam_id', examId);

    if (collegeIds.length > 0) {
      const assignments = collegeIds.map((cId) => ({
        exam_id: examId,
        college_id: cId,
        assigned_by: actor.id,
        status: 'ASSIGNED',
      }));

      await supabase.from('exam_center_assignments').insert(assignments);
    }

    await supabase.from('audit_logs').insert({
      actor_id: actor.id,
      event_type: 'EXAM_CENTER_ASSIGNED',
      entity_type: 'Exam',
      entity_id: examId,
      description: `Assigned ${collegeIds.length} center(s) to exam ${examId}`,
    });

    revalidatePath(`/exams/${examId}`);
    revalidatePath('/exams');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to assign centers.' };
  }
}
