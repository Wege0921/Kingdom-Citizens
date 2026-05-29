import { createClient } from '@supabase/supabase-js'

/**
 * Cookie-less Supabase client for fetching PUBLIC data in server components.
 *
 * Unlike `@/lib/supabase/server`, this does NOT read cookies, so pages that
 * use it are NOT forced into dynamic rendering and can be statically
 * generated / ISR-cached (`export const revalidate = N`).
 *
 * Only use this for data that is publicly readable under RLS (e.g. published
 * sermons, learning paths). Never use it for per-user or privileged data.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  )
}
