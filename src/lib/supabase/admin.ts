import { createClient } from '@supabase/supabase-js';

/**
 * ADMIN / SERVICE-ROLE Supabase client.
 *
 * WARNING: This client bypasses Row Level Security.
 * It MUST only be used server-side for privileged operations:
 *   - Initial admin bootstrap
 *   - Trusted server background operations
 *   - Administrative user management
 *
 * NEVER import this file into:
 *   - React components
 *   - Client components ('use client')
 *   - Browser utilities
 *   - Any file that could be bundled into the client
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not configured. ' +
      'This admin client cannot be used in demo mode.'
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
