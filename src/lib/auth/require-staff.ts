import { createClient } from '@/lib/supabase/server'

/**
 * Ensures the current request comes from an authenticated staff member
 * (ADMIN or LEADER). Returns the user id on success, or an `error` string
 * with an HTTP `status` on failure.
 *
 * Use in API route handlers to protect expensive/privileged operations
 * such as AI generation endpoints.
 */
export async function requireStaff(): Promise<
  { userId: string; error?: never; status?: never } | { userId?: never; error: string; status: number }
> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized', status: 401 }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'ADMIN' && profile.role !== 'LEADER')) {
    return { error: 'Forbidden', status: 403 }
  }

  return { userId: user.id }
}
