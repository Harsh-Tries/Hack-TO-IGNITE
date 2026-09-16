import { UserRole } from '@/types';
import { createClient } from '@/lib/supabase/server';
import { DEMO_USERS } from '@/lib/demo-data';

export { DEMO_USERS };

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  college_id: string | null;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getServerProfile(): Promise<UserProfile | null> {
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  if (!isDemoMode) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile as UserProfile | null;
    } catch {
      return null;
    }
  }

  return null;
}

export async function getProfileById(userId: string): Promise<UserProfile | null> {
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin');
    const admin = createAdminClient();
    const { data } = await admin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data as UserProfile | null;
  } catch {
    return null;
  }
}
