'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function createCollege(data: {
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}) {
  const session = await getServerSession(authOptions);
  const actor = session?.user as any;

  if (!actor || !hasPermission(actor.role, 'CREATE_COLLEGE')) {
    return { success: false, error: 'Unauthorized: Permission denied to register examination centers.' };
  }

  try {
    const existingCode = await prisma.college.findUnique({ where: { code: data.code } });
    if (existingCode) {
      return { success: false, error: `College code "${data.code}" already exists.` };
    }

    const college = await prisma.college.create({
      data: {
        code: data.code,
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        status: 'ACTIVE',
      },
    });

    await prisma.auditLog.create({
      data: {
        eventType: 'COLLEGE_CREATED',
        entityType: 'College',
        entityId: college.id,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        targetResource: college.name,
        details: `Registered examination center ${college.name} (${college.code}) in ${college.city}.`,
        result: 'GRANTED',
      },
    });

    revalidatePath('/colleges');
    revalidatePath('/dashboard');
    return { success: true, collegeId: college.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create college.' };
  }
}
