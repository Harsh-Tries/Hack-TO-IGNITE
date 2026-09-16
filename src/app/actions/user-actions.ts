'use server';

import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { getServerProfile } from '@/lib/auth';
import { UserRole } from '@/types';

export async function changeUserRole(userId: string, newRole: UserRole) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    revalidatePath('/admin/users');
    return { success: true };
  }

  const actor = await getServerProfile();

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Unauthorized: Only SUPER_ADMIN can change user roles.' };
  }

  try {
    const admin = createAdminClient();

    const { error } = await admin
      .from('profiles')
      .update({
        role: newRole,
        status: newRole === 'PENDING' ? 'PENDING' : 'ACTIVE',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    await admin.from('audit_logs').insert({
      actor_id: actor.id,
      event_type: 'ROLE_CHANGED',
      entity_type: 'Profile',
      entity_id: userId,
      description: `Changed user ${userId} role to ${newRole}`,
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user role.' };
  }
}

export const updateUserRole = changeUserRole;

export async function updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED') {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    revalidatePath('/admin/users');
    return { success: true };
  }

  const actor = await getServerProfile();

  if (!actor || actor.role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Unauthorized: Only SUPER_ADMIN can change user status.' };
  }

  try {
    const admin = createAdminClient();

    const { error } = await admin
      .from('profiles')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw new Error(error.message);

    await admin.from('audit_logs').insert({
      actor_id: actor.id,
      event_type: status === 'ACTIVE' ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
      entity_type: 'Profile',
      entity_id: userId,
      description: `User ${userId} status changed to ${status}`,
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update user status.' };
  }
}
