'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types';

export async function updateUserRole(targetUserId: string, newRole: UserRole) {
  const session = await getServerSession(authOptions);
  const actor = session?.user as any;

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Unauthorized: Only SUPER_ADMIN can modify user roles.' };
  }

  if (actor.id === targetUserId) {
    return { success: false, error: 'Forbidden: You cannot modify your own role.' };
  }

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, error: 'User not found.' };

    const oldRole = targetUser.role;

    // Update role
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { 
        role: newRole,
        status: newRole === 'PENDING' ? 'PENDING' : 'ACTIVE',
      },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        eventType: 'ROLE_CHANGED',
        entityType: 'User',
        entityId: targetUserId,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        targetResource: targetUser.name,
        details: `Updated role for ${targetUser.name} (${targetUser.email}) from ${oldRole} to ${newRole}.`,
        result: 'GRANTED',
      },
    });

    revalidatePath('/admin/users');
    revalidatePath('/dashboard');
    return { success: true, user: updatedUser };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user role.' };
  }
}

export async function updateUserStatus(targetUserId: string, newStatus: 'ACTIVE' | 'SUSPENDED') {
  const session = await getServerSession(authOptions);
  const actor = session?.user as any;

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Unauthorized: Only SUPER_ADMIN can modify user status.' };
  }

  if (actor.id === targetUserId) {
    return { success: false, error: 'Forbidden: You cannot modify your own status.' };
  }

  try {
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, error: 'User not found.' };

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { status: newStatus },
    });

    // Record Audit Log
    await prisma.auditLog.create({
      data: {
        eventType: newStatus === 'SUSPENDED' ? 'USER_SUSPENDED' : 'USER_ACTIVATED',
        entityType: 'User',
        entityId: targetUserId,
        actorId: actor.id,
        actorEmail: actor.email,
        actorRole: actor.role,
        targetResource: targetUser.name,
        details: `User ${targetUser.name} (${targetUser.email}) status set to ${newStatus}.`,
        result: 'GRANTED',
      },
    });

    revalidatePath('/admin/users');
    revalidatePath('/dashboard');
    return { success: true, user: updatedUser };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user status.' };
  }
}
