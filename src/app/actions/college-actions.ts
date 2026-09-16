'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getServerProfile } from '@/lib/auth';
import { hasPermission } from '@/lib/permissions';

export async function createCollege(data: {
  name: string;
  code: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}) {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (isDemoMode) {
    revalidatePath('/colleges');
    return { success: true, collegeId: 'demo-college-' + Date.now() };
  }

  const actor = await getServerProfile();

  if (!actor || !hasPermission(actor.role, 'CREATE_COLLEGE')) {
    return { success: false, error: 'Unauthorized: Permission denied to create colleges.' };
  }

  try {
    const supabase = await createClient();

    const { data: college, error } = await supabase
      .from('colleges')
      .insert({
        name: data.name,
        code: data.code,
        address: data.address,
        city: data.city,
        state: data.state,
        postal_code: data.postalCode,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        status: 'ACTIVE',
        created_by: actor.id,
      })
      .select('id')
      .single();

    if (error || !college) {
      throw new Error(error?.message || 'Failed to create college.');
    }

    await supabase.from('audit_logs').insert({
      actor_id: actor.id,
      event_type: 'COLLEGE_CREATED',
      entity_type: 'College',
      entity_id: college.id,
      description: `Created college ${data.name} (${data.code})`,
    });

    revalidatePath('/colleges');
    return { success: true, collegeId: college.id };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create college.' };
  }
}
