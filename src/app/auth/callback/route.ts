import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Supabase OAuth callback handler.
 * After Google login, Supabase redirects here with a code.
 * We:
 *  1. Exchange code for session
 *  2. Get the authenticated user
 *  3. Create or update their profile in public.profiles
 *  4. Assign SUPER_ADMIN if email matches INITIAL_ADMIN_EMAIL
 *  5. Otherwise assign PENDING if new user
 *  6. Redirect based on role
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const user = data.user;
  const email = user.email!;
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0];
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  try {
    // Determine if this is the initial admin
    const initialAdminEmail = process.env.INITIAL_ADMIN_EMAIL;
    const isInitialAdmin = initialAdminEmail && email.toLowerCase() === initialAdminEmail.toLowerCase();

    // Try admin client for privileged profile upsert
    let profileRole = 'PENDING';
    let profileStatus = 'PENDING';

    try {
      const adminClient = createAdminClient();

      // Check existing profile
      const { data: existingProfile } = await adminClient
        .from('profiles')
        .select('id, role, status')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // Update last login
        await adminClient
          .from('profiles')
          .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq('id', user.id);

        profileRole = existingProfile.role;
        profileStatus = existingProfile.status;
      } else {
        // New user — create profile
        profileRole = isInitialAdmin ? 'SUPER_ADMIN' : 'PENDING';
        profileStatus = isInitialAdmin ? 'ACTIVE' : 'PENDING';

        await adminClient.from('profiles').insert({
          id: user.id,
          full_name: fullName,
          email: email,
          avatar_url: avatarUrl,
          role: profileRole,
          status: profileStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login_at: new Date().toISOString(),
        });

        // Create audit log
        await adminClient.from('audit_logs').insert({
          actor_id: user.id,
          event_type: 'LOGIN',
          entity_type: 'Profile',
          entity_id: user.id,
          description: `New user registered via Google OAuth: ${email}${isInitialAdmin ? ' (assigned SUPER_ADMIN)' : ''}`,
          metadata: { email, role: profileRole, provider: 'google' },
        });
      }
    } catch (adminErr) {
      // Supabase not configured — demo mode, allow through
      console.warn('Admin client not available (demo mode):', adminErr);
    }

    // Redirect based on role/status
    if (profileStatus === 'SUSPENDED') {
      return NextResponse.redirect(`${origin}/suspended`);
    }
    if (profileRole === 'PENDING' || profileStatus === 'PENDING') {
      return NextResponse.redirect(`${origin}/pending`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    console.error('Profile creation error:', err);
    return NextResponse.redirect(`${origin}/dashboard`);
  }
}
